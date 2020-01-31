import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

interface State {
  openCreateForm: () => void;
}

export const NavBar: React.FC<State> = ({openCreateForm}) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: '10px' }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name="messages" />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={openCreateForm}></Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
