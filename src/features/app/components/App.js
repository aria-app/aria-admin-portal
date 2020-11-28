import { gql, useMutation } from '@apollo/client';
import { Router } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';
import Songs from './Songs';

const { UserProvider } = shared.components;

const StyledRouter = styled(Router)((props) => ({
  backgroundColor: props.theme.palette.background.default,
  bottom: 0,
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  right: 0,
  top: 0,
}));

const LOGIN = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      token
      user {
        email
        firstName
        id
        lastName
      }
    }
  }
`;

export default function App() {
  const [login, { data }] = useMutation(LOGIN);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    login({
      variables: {
        email: process.env.REACT_APP_DEFAULT_EMAIL,
      },
    });
  }, [login]);

  React.useEffect(() => {
    if (data && data.login) {
      window.localStorage.setItem('token', data.login.token);

      setUser(data.login.user);
    }
  }, [data]);

  return (
    <UserProvider user={user}>
      <StyledRouter>
        <Songs path="/" />
      </StyledRouter>
    </UserProvider>
  );
}
