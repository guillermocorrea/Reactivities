import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { Attendee } from 'app/models/activity';

const ActivityListItemAttendees: React.FC<{ attendees: Attendee[] }> = ({
  attendees,
}) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                size='mini'
                circular
                src={attendee.image || '/assets/user.png'}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
