import React, { useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface Props {
  selectedActivity: Activity;
  setEditMode: (editMode: boolean) => void;
  createActivity: (activity: Activity) => void;
  editActivity: (activity: Activity) => void;
  submitting: boolean;
}

const ActivityForm: React.FC<Props> = ({ selectedActivity, setEditMode, createActivity, editActivity, submitting }) => {
  const initializeForm = () => {
    if (selectedActivity) return selectedActivity;
    const newActivity = {
      id: '',
      title: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      city: '',
      venue: ''
    };
    return newActivity;
  };

  const [activity, setActivity] = useState<Activity>(initializeForm());
  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    console.log(activity);
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name='title'
          placeholder='Title'
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          name='description'
          rows={2}
          placeholder='Description'
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          name='category'
          placeholder='Category'
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          name='date'
          type='datetime-local'
          placeholder='Date'
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          name='city'
          placeholder='City'
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          name='venue'
          placeholder='Venue'
          value={activity.venue}
        />
        <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
        <Button
          floated='right'
          type='button'
          content='Cancel'
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
