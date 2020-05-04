import { toast } from 'react-toastify';
import { history } from './../../index';
import { Activity } from './../models/activity';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map<string, Activity>();
  @observable activity: Activity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable activitiesLoaded = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: Activity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  @action editActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity.id, activity);
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`/activities/${activity.id}/details`);
    } catch (error) {
      console.log(error);
      toast.error('Problem submitting data');
    }
    runInAction(() => (this.submitting = false));
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action cancelSelectedActivity = () => {
    this.activity = null;
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => this.activityRegistry.delete(id));
    } catch (error) {
      console.log(error);
    }
    runInAction(() => {
      this.target = '';
      this.submitting = false;
    });
  };

  @action loadActivities = async () => {
    if (this.activitiesLoaded) {
      return;
    }
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('load activities', () => {
        activities.map((activity) => {
          const parsedActivity = {
            ...activity,
            date: new Date(activity.date),
          };
          this.activityRegistry.set(parsedActivity.id, parsedActivity);
          return parsedActivity;
        });
        this.activitiesLoaded = true;
      });
    } catch (error) {
      console.log(error);
    }
    runInAction(() => (this.loadingInitial = false));
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    }
    this.loadingInitial = true;
    try {
      activity = await agent.Activities.details(id);
      runInAction('load activity', () => {
        activity!.date = new Date((activity as any).date);
        this.activityRegistry.set(activity!.id, activity!);
        this.activity = activity || null;
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
    }
    return activity;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id) || null;
  };

  @action createActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create acitivity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectActivity(activity.id);
      });
      history.push(`/activities/${activity.id}/details`);
    } catch (error) {
      console.log(error);
      toast.error('Problem submitting data');
    }
    runInAction(() => (this.submitting = false));
  };
}

export default createContext(new ActivityStore());
