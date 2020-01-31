import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import agent from '../api/agent';
import { LoadingComponent } from './LoadingComponent';

const App = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(activity => activity.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: Activity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false)).catch(error => console.log(error));
  };

  const handleEditActivity = (activity: Activity) => {
    setSubmitting(true);
    agent.Activities.update(activity.id, activity).then(() => {
      const idx = activities.findIndex(a => a.id === activity.id);
      const updatedActitivies = [...activities];
      updatedActitivies[idx] = activity;
      setActivities(updatedActitivies);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false)).catch(error => console.log(error));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, activity: Activity) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(activity.id).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id)]);
    }).then(() => setSubmitting(false));
  };

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        setActivities(
          response.map(activity => ({
            ...activity,
            date: activity.date.split('.')[0]
          }))
        );
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content='Loading activities...' />;

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiesDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        ></ActivitiesDashboard>
      </Container>
    </Fragment>
  );
};

export default App;
