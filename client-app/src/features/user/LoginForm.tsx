import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Header, Divider } from 'semantic-ui-react';
import TextInput from 'app/common/form/TextInput';
import { RootStoreContext } from 'app/stores/rootStore';
import { UserFormValues } from 'app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from 'app/common/form/ErrorMessage';
import SocialLogin from './SocialLogin';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
  email: isRequired('email'),
  password: isRequired('password'),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, fbLogin, loading } = rootStore.userStore;

  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: UserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      render={({
        handleSubmit,
        submitError,
        errors,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as='h2'
            content='Login to Reactivities'
            color='teal'
            textAlign='center'
          />
          <Field
            name='email'
            component={TextInput as React.FC}
            placeholder='Email'
          />
          <Field
            name='password'
            component={TextInput as React.FC}
            placeholder='Password'
            type='password'
          />
          {submitError && !dirtySinceLastSubmit && (
            <>
              <ErrorMessage
                error={submitError}
                text='Invalid email or password'
              />
            </>
          )}
          <Button
            color='teal'
            content='Login'
            disabled={Object.keys(errors).length > 0 || pristine}
            fluid
          />
          <Divider horizontal>Or</Divider>
          <SocialLogin loading={loading} fbCallback={fbLogin} />
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
