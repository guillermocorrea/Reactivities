import React from 'react';
import { AxiosResponse } from 'axios';
import { Message, MessageList } from 'semantic-ui-react';

interface Props {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<Props> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <MessageList>
          {Object.values(error.data.errors)
            .flat()
            .map((err, i) => (
              <Message.Item key={i}>{err}</Message.Item>
            ))}
        </MessageList>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};

export default ErrorMessage;
