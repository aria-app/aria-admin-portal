import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import isEmail from 'isemail';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function UserEdit(props) {
  const { isOpen, isSaving, onCancel, onSave, user } = props;
  const { control, errors, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (isOpen) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [isOpen, reset, user]);

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen}>
      <DialogTitle>Edit Song</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Controller
            as={TextField}
            autoFocus
            control={control}
            error={!!errors.email}
            fullWidth
            helperText={
              errors.email &&
              {
                required: 'You must enter an email',
                validate: 'Incorrect email format',
              }[errors.email.type]
            }
            id="email"
            label="Email"
            name="email"
            rules={{ required: true, validate: isEmail.validate }}
          />
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.firstName}
              fullWidth
              helperText={errors.firstName && 'You must enter a first name.'}
              id="firstName"
              label="First Name"
              name="firstName"
              rules={{ required: true }}
            />
          </Box>
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.lastName}
              fullWidth
              helperText={errors.lastName && 'You must enter a last name.'}
              id="lastName"
              label="Last Name"
              name="lastName"
              rules={{ required: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button color="primary" disabled={isSaving} type="submit">
            {isSaving ? <CircularProgress color="primary" size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

UserEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.object,
};
