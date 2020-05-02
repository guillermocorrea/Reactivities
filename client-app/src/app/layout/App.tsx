import ActivityDetails from 'features/activities/details/ActivityDetails';
import ActivityForm from 'features/activities/form/ActivityForm';
import HomePage from 'home/HomePage';
import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import NavBar from '../../features/nav/NavBar';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Route path='/activities' exact component={ActivitiesDashboard} />
              <Route
                path='/activities/:id/details'
                exact
                component={ActivityDetails}
              />
              <Route
                path={['/activities/create', '/activities/edit/:id']}
                exact
                component={ActivityForm}
                key={location.key}
              />
            </Container>
          </>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
