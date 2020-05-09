import { RootStore } from './rootStore';
import { toast } from 'react-toastify';
import { history } from './../../index';
import { Activity } from './../models/activity';
import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { setActivityProps, createAttendee } from 'app/common/util/util';

export default class ActivityStore {
  rootStore: RootStore;

  @observable activityRegistry = new Map<string, Activity>();
  @observable activity: Activity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable activitiesLoaded = false;
  @observable loading = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
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
            ...setActivityProps(activity, this.rootStore.userStore.user!),
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
        setActivityProps(activity!, this.rootStore.userStore.user!);
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      activity.attendees = [attendee];
      activity.isHost = true;
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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('Problem signing up to activity');
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user?.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('Problem signing up to activity');
    }
  };
}
