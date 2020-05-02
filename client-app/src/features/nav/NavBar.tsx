import { observer } from 'mobx-react-lite';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

export const NavBar: React.FC = () => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header as={NavLink} to='/' exact>
          <img
            src='/assets/logo.png'
            alt='logo'
            style={{ marginRight: '10px' }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} to='/activities' exact />
        <Menu.Item>
          <Button
            as={NavLink}
            exact
            to='/activities/create'
            positive
            content='Create Activity'
          ></Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
