import { Activity } from './../models/activity';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map<string, Activity>();
  @observable activities: Activity[] = [];
  @observable selectedActivity: Activity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

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
        this.selectedActivity = activity;
        this.editMode = false;
      });
    } catch (error) {
      console.log(error);
    }
    runInAction(() => (this.submitting = false));
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
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
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('load activities', () => {
        this.activities = activities.map(activity => {
          const parsedActivity = {
            ...activity,
            date: activity.date.split('.')[0]
          };
          this.activityRegistry.set(parsedActivity.id, parsedActivity);
          return parsedActivity;
        });
      });
    } catch (error) {
      console.log(error);
    }
    runInAction(() => (this.loadingInitial = false));
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id); // this.activities.find(a => a.id === id);
    this.editMode = false;
  };

  @action createActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create acitivity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activities = [...this.activities, activity];
        this.selectActivity(activity.id);
      });
    } catch (error) {
      console.log(error);
    }
    runInAction(() => (this.submitting = false));
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };
}

export default createContext(new ActivityStore());
