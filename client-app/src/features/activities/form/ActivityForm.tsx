import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activityForForm, setActivity] = useState<Activity>({
    id: '',
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    city: '',
    venue: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (match.params.id) {
        const result = await loadActivity(match.params.id);
        setActivity(result!);
      }
    }
    fetchData();
    return () => {
      clearActivity();
    };
  }, [match.params.id, loadActivity, setActivity, clearActivity]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activityForForm, [name]: value });
  };

  const handleSubmit = () => {
    console.log(activityForForm);
    if (activityForForm.id.length === 0) {
      const newActivity = {
        ...activityForForm,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}/details`)
      );
    } else {
      editActivity(activityForForm).then(() =>
        history.push(`/activities/${activityForForm.id}/details`)
      );
    }
  };

  const handleCancel = () => {
    if (!match.params.id) {
      history.push(`/activities`);
      return;
    }
    history.push(`/activities/${match.params.id}/details`);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              onChange={handleInputChange}
              name='title'
              placeholder='Title'
              value={activityForForm.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name='description'
              rows={2}
              placeholder='Description'
              value={activityForForm.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name='category'
              placeholder='Category'
              value={activityForForm.category}
            />
            <Form.Input
              onChange={handleInputChange}
              name='date'
              type='datetime-local'
              placeholder='Date'
              value={activityForForm.date}
            />
            <Form.Input
              onChange={handleInputChange}
              name='city'
              placeholder='City'
              value={activityForForm.city}
            />
            <Form.Input
              onChange={handleInputChange}
              name='venue'
              placeholder='Venue'
              value={activityForForm.venue}
            />
            <Button
              loading={submitting}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button
              floated='right'
              type='button'
              content='Cancel'
              onClick={handleCancel}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
