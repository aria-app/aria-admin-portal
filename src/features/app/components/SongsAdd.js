import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function SongsAdd(props) {
  const { isOpen, onCancel, onSave } = props;
  const { control, errors, handleSubmit } = useForm();
  const [isSaving, setIsSaving] = React.useState();

  const handleSave = React.useCallback(
    async (options) => {
      setIsSaving(true);

      try {
        await onSave(options);
      } finally {
        setIsSaving(false);
      }
    },
    [onSave],
  );

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen}>
      <DialogTitle>Create New Song</DialogTitle>
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <Controller
            as={TextField}
            autoFocus
            control={control}
            defaultValue=""
            error={!!errors.name}
            fullWidth
            helperText={errors.name && 'You must enter a name.'}
            id="name"
            label="Name"
            name="name"
            rules={{ required: true }}
          />
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

SongsAdd.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
