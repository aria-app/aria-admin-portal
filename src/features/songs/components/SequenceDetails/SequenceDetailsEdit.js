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

export default function SequenceEdit(props) {
  const { isOpen, isSaving, onCancel, onSave, sequence } = props;
  const { control, errors, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (isOpen) {
      reset({
        measureCount: sequence.measureCount,
      });
    }
  }, [isOpen, reset, sequence]);

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen}>
      <DialogTitle>Edit Sequence</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Controller
            as={TextField}
            autoFocus
            control={control}
            error={!!errors.measureCount}
            fullWidth
            helperText={errors.measureCount && 'You must enter a measure count'}
            id="measureCount"
            label="Measure Count"
            min={0}
            name="measureCount"
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

SequenceEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  sequence: PropTypes.object,
};
