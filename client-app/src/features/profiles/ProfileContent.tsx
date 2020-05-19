import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileAbout from './ProfileAbout';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from './ProfileActivities';

const panes = [
  { menuItem: 'About', render: () => <ProfileAbout /> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  {
    menuItem: 'Activities',
    render: () => <ProfileActivities />,
  },
  {
    menuItem: 'Followers',
    render: () => <ProfileFollowings />,
  },
  {
    menuItem: 'Following',
    render: () => <ProfileFollowings />,
  },
];

interface Props {
  setActiveTab: (activeIndex: number) => void;
}

const ProfileContent: React.FC<Props> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex as number)}
    />
  );
};

export default ProfileContent;
