import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from 'app/common/form/TextInput';
import TextAreaInput from 'app/common/form/TextAreaInput';
import SelectInput from 'app/common/form/SelectInput';
import { category } from 'app/common/options/categoryOptions';
import DateInput from 'app/common/form/DateInput';

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
    date: null,
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

  // const handleSubmit = () => {
  //   if (activityForForm.id.length === 0) {
  //     const newActivity = {
  //       ...activityForForm,
  //       id: uuid(),
  //     };
  //     createActivity(newActivity).then(() =>
  //       history.push(`/activities/${newActivity.id}/details`)
  //     );
  //   } else {
  //     editActivity(activityForForm).then(() =>
  //       history.push(`/activities/${activityForForm.id}/details`)
  //     );
  //   }
  // };

  const handleCancel = () => {
    if (!match.params.id) {
      history.push(`/activities`);
      return;
    }
    history.push(`/activities/${match.params.id}/details`);
  };

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  name='title'
                  placeholder='Title'
                  value={activityForForm.title}
                  component={TextInput as React.FC}
                />
                <Field
                  name='description'
                  rows={3}
                  placeholder='Description'
                  value={activityForForm.description}
                  component={TextAreaInput as React.FC}
                />
                <Field
                  name='category'
                  placeholder='Category'
                  value={activityForForm.category}
                  options={category}
                  component={SelectInput as React.FC}
                />
                <Field
                  component={DateInput as React.FC}
                  name='date'
                  date={true}
                  placeholder='Date'
                  value={activityForForm.date}
                />
                <Field
                  component={TextInput as React.FC}
                  name='city'
                  placeholder='City'
                  value={activityForForm.city}
                />
                <Field
                  component={TextInput as React.FC}
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
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
