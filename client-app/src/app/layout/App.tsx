import { observer } from 'mobx-react-lite';
import React, { Fragment, Suspense, useContext, useEffect } from 'react';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { ToastContainer } from 'react-toastify';
import LoginForm from 'features/user/LoginForm';
import { RootStoreContext } from 'app/stores/rootStore';
import { LoadingComponent } from './LoadingComponent';

const HomePage = React.lazy(() => import('home/HomePage'));
const ActivitiesDashboard = React.lazy(() => import('../../features/activities/dashboard/ActivitiesDashboard'));
const NotFound = React.lazy(() => import('./NotFound'));
const NavBar = React.lazy(() => import('../../features/nav/NavBar'));
const ModalModalContainer = React.lazy(() => import('app/common/modals/ModalContainer'));
const ProfilePage = React.lazy(() => import('features/profiles/ProfilePage'));
const PrivateRoute = React.lazy(() => import('./PrivateRoute'));
const ActivityDetails = React.lazy(() => import('features/activities/details/ActivityDetails'));
const ActivityForm = React.lazy(() => import('features/activities/form/ActivityForm'));

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) {
    return <LoadingComponent content='Loading app' />;
  }

  return (
    <Fragment>
      <Suspense fallback="Suspense...">
        <ModalModalContainer />
        <ToastContainer position='bottom-right' />
        <Route path='/' exact component={HomePage} />
        <Route
          path={'/(.+)'}
          render={() => (
            <>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Switch>
                  <PrivateRoute
                    path='/activities'
                    exact
                    component={ActivitiesDashboard}
                  />
                  <PrivateRoute
                    path='/activities/:id/details'
                    exact
                    component={ActivityDetails}
                  />
                  <PrivateRoute
                    path={['/activities/create', '/activities/edit/:id']}
                    exact
                    component={ActivityForm}
                    key={location.key}
                  />
                  <Route path='/login' exact component={LoginForm} />
                  <PrivateRoute
                    path='/profile/:username'
                    exact
                    component={ProfilePage}
                  />
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </>
          )}
        />
      </Suspense>
    </Fragment>
  );
};

export default withRouter(observer(App));
