import ActivityDetails from 'features/activities/details/ActivityDetails';
import ActivityForm from 'features/activities/form/ActivityForm';
import HomePage from 'home/HomePage';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
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
import LoginForm from 'features/user/LoginForm';
import { RootStoreContext } from 'app/stores/rootStore';
import { LoadingComponent } from './LoadingComponent';
import ModalModalContainer from 'app/common/modals/ModalContainer';

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
                <Route path='/login' exact component={LoginForm} />
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
