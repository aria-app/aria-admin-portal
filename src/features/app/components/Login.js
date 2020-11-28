import { gql, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Redirect } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import shared from '../../shared';

const { useUser } = shared.hooks;

const schema = yup.object().shape({
  email: yup.string().email(),
});

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

export default function Login(props) {
  const { onLoginComplete } = props;
  const { control, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const [login, { data }] = useMutation(LOGIN);
  const user = useUser();

  const handleLoginClick = React.useCallback(
    ({ email }) => {
      login({
        variables: {
          email,
        },
      });
    },
    [login],
  );

  React.useEffect(() => {
    if (data && data.login) {
      window.localStorage.setItem('token', data.login.token);
      onLoginComplete();
    }
  }, [data, onLoginComplete]);

  if (user) {
    return <Redirect noThrow to="/songs" />;
  }

  return (
    <div>
      <Dialog open>
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To log in and view your songs, enter your email below.
          </DialogContentText>
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
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleSubmit(handleLoginClick)}>
            Log In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Login.propTypes = {
  onLoginComplete: PropTypes.func.isRequired,
};
