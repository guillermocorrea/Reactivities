import React, { SyntheticEvent } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  deleteActivity: (
    event: SyntheticEvent<HTMLButtonElement>,
    activity: Activity
  ) => void;
  submitting: boolean;
  target: string;
}

const ActivityList: React.FC<Props> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>{`${activity.city}, ${activity.venue}`}</div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(activity.id)}
                  floated='right'
                  content='View'
                  color='blue'
                ></Button>
                <Button
                  name={activity.id}
                  loading={target === activity.id && submitting}
                  onClick={e => deleteActivity(e, activity)}
                  floated='right'
                  content='Delete'
                  color='red'
                ></Button>
                <Label basic content={activity.category}></Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;
