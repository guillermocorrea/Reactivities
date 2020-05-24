// eslint-disable-next-line
import React, { useContext, Component } from 'react';
import {
  RouteProps,
  RouteComponentProps,
  Route,
  Redirect,
} from 'react-router-dom';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';

interface Props extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn } = rootStore.userStore;
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to={'/'} />
      }
    />
  );
};

export default observer(PrivateRoute);
