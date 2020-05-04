import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormViewModel } from '../../../app/models/activity';
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
import { combinedDateAndTime } from 'app/common/util/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
} from 'revalidate';

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(5)({
      message: 'Description needs to be at least 5 characters',
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
});

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
  } = activityStore;

  const [activityForForm, setActivity] = useState(new ActivityFormViewModel());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (match.params.id) {
        setLoading(true);
        const result = await loadActivity(match.params.id);
        setActivity(new ActivityFormViewModel(result));
        setLoading(false);
      }
    }
    fetchData();
  }, [match.params.id, loadActivity, setActivity]);

  const handleCancel = () => {
    if (!match.params.id) {
      history.push(`/activities`);
      return;
    }
    history.push(`/activities/${match.params.id}/details`);
  };

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combinedDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activityForForm}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
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
                <Form.Group widths='equal'>
                  <Field
                    component={DateInput as React.FC}
                    name='date'
                    date={true}
                    placeholder='Date'
                    value={activityForForm.date}
                  />
                  <Field
                    component={DateInput as React.FC}
                    name='time'
                    time={true}
                    placeholder='Time'
                    value={activityForForm.time}
                  />
                </Form.Group>

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
                  disabled={loading || invalid || pristine}
                />
                <Button
                  floated='right'
                  type='button'
                  content='Cancel'
                  onClick={handleCancel}
                  disabled={loading}
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
