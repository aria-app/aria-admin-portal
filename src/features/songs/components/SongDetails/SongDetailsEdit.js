import Box from '@material-ui/core/Box';
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

export default function SongEdit(props) {
  const { isOpen, isSaving, onCancel, onSave, song } = props;
  const { control, errors, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (isOpen) {
      reset({
        bpm: song.bpm,
        measureCount: song.measureCount,
        name: song.name,
      });
    }
  }, [isOpen, reset, song]);

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen}>
      <DialogTitle>Edit Song</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Controller
            as={TextField}
            autoFocus
            control={control}
            error={!!errors.name}
            fullWidth
            helperText={errors.name && 'You must enter a Name.'}
            id="name"
            label="Name"
            name="name"
            rules={{ required: true }}
          />
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.bpm}
              fullWidth
              helperText={
                errors.bpm && 'You must enter a value for Beats Per Minute.'
              }
              id="bpm"
              label="Beats Per Minute"
              min={0}
              name="bpm"
              rules={{ required: true, valueAsNumber: true }}
              type="number"
            />
          </Box>
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.measureCount}
              fullWidth
              helperText={
                errors.measureCount && 'You must enter a Measure Count.'
              }
              id="measureCount"
              label="Measure Count"
              min={0}
              name="measureCount"
              rules={{ required: true, valueAsNumber: true }}
              type="number"
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

SongEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  song: PropTypes.object,
};
