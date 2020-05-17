import React, { useContext } from 'react';
import { Profile, ProfileFormValues } from 'app/models/profile';
import { Grid, Form, Button } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from 'app/common/form/TextInput';
import { RootStoreContext } from 'app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import TextAreaInput from 'app/common/form/TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
  displayName: isRequired({ message: 'Display name is required' }),
});

interface Props {
  profile: Profile;
}

const ProfileAboutForm: React.FC<Props> = ({ profile }) => {
  const rootStore = useContext(RootStoreContext);
  const { loading, updateProfile } = rootStore.profileStore;

  const handleFormSubmit = (values: ProfileFormValues) => {
    console.log(values);
    updateProfile(values);
  };

  return (
    <Grid>
      <Grid.Column width={16}>
        <FinalForm
          validate={validate}
          onSubmit={handleFormSubmit}
          initialValues={profile}
          render={({ handleSubmit, invalid, pristine }) => (
            <Form onSubmit={handleSubmit} loading={loading}>
              <Field
                name='displayName'
                placeholder='Display name'
                value={profile.displayName}
                component={TextInput as React.FC}
              />
              <Field
                name='bio'
                placeholder='Bio'
                value={profile.bio}
                rows={3}
                component={TextAreaInput as React.FC}
              />
              <Button
                floated='right'
                loading={loading}
                positive
                type='submit'
                content='Update profile'
                disabled={invalid || pristine}
              />
            </Form>
          )}
        ></FinalForm>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfileAboutForm);
