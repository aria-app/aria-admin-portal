import { gql, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';

import shared from '../../shared';

const { useUser } = shared.hooks;

const Root = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});

const StyledContainer = styled(Container)((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  flex: 1,
}));

const schema = yup.object().shape({
  email: yup.string().email(),
});

const LOGIN = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      token
    }
  }
`;

export default function Login(props) {
  const { navigate, onLoginComplete } = props;
  const { control, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const [login, { data }] = useMutation(LOGIN);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const user = useUser();

  const handleLoginClick = React.useCallback(
    async ({ email }) => {
      setIsLoggingIn(true);

      await login({
        variables: {
          email,
        },
      });

      setIsLoggingIn(false);
    },
    [login],
  );

  React.useEffect(() => {
    if (data && data.login) {
      window.localStorage.setItem('token', data.login.token);
      onLoginComplete();
      navigate('/songs');
    }
  }, [data, navigate, onLoginComplete]);

  React.useEffect(() => {
    if (user) {
      navigate('/songs');
    }
  }, [navigate, user]);

  return (
    <Root>
      <StyledContainer maxWidth="sm">
        <Box paddingY={3}>
          <div>To log in and view your songs, enter your email below.</div>
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              defaultValue=""
              error={!!errors.email}
              fullWidth
              helperText={errors.email && errors.email.message}
              id="email"
              label="Email Address"
              name="email"
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" paddingTop={3}>
            <Button
              color="primary"
              onClick={handleSubmit(handleLoginClick)}
              variant="contained"
            >
              {isLoggingIn ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                'Log In'
              )}
            </Button>
          </Box>
        </Box>
      </StyledContainer>
    </Root>
  );
}

Login.propTypes = {
  onLoginComplete: PropTypes.func.isRequired,
};
