import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';

import ActivityList from './ActivityList';
import { LoadingComponent } from 'app/layout/LoadingComponent';
import { RootStoreContext } from 'app/stores/rootStore';

export const ActivitiesDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activityStore } = rootStore;

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content='Loading activities' />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiesDashboard);
