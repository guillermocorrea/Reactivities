import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';

import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import NavBar from '../../features/nav/NavBar';
import ActivityStore from '../stores/activityStore';
import { LoadingComponent } from './LoadingComponent';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content='Loading activities...' />;

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiesDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
