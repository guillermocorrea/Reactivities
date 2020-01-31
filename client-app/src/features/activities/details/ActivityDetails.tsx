import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
  activity: Activity;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: Activity | null) => void;
}

const ActivityDetails: React.FC<Props> = ({ activity, setEditMode, setSelectedActivity }) => {
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button
            basic
            color="blue"
            content="Edit"
            onClick={() => setEditMode(true)}
          ></Button>
          <Button basic color="grey" content="Cancel" onClick={() => setSelectedActivity(null)}></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetails;
