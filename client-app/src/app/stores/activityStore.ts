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
    return Array.from(this.activityRegistry.values()).sort(
      // this.activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
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
    } catch (error) {
      console.log(error);
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
            date: activity.date.split('.')[0],
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
    } catch (error) {
      console.log(error);
    }
    runInAction(() => (this.submitting = false));
  };
}

export default createContext(new ActivityStore());
