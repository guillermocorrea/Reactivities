import ActivityDetails from 'features/activities/details/ActivityDetails';
import ActivityForm from 'features/activities/form/ActivityForm';
import HomePage from 'home/HomePage';
import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import NavBar from '../../features/nav/NavBar';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <ToastContainer position='bottom-right' />
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route
                  path='/activities'
                  exact
                  component={ActivitiesDashboard}
                />
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
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
