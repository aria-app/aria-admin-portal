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

export default function TrackEdit(props) {
  const { isOpen, isSaving, onCancel, onSave, track } = props;
  const { control, errors, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (isOpen) {
      reset({
        volume: track.volume,
      });
    }
  }, [isOpen, reset, track]);

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen}>
      <DialogTitle>Edit Track</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Controller
            as={TextField}
            autoFocus
            control={control}
            error={!!errors.volume}
            fullWidth
            helperText={errors.volume && 'You must enter a volume'}
            id="volume"
            label="Volume"
            max={20}
            min={-20}
            name="volume"
            rules={{ required: true, valueAsNumber: true }}
            type="number"
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

TrackEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  track: PropTypes.object,
};
