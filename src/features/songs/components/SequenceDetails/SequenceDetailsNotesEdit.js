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

export default function SequenceDetailsNotesEdit(props) {
  const { isSaving, note, onCancel, onSave } = props;
  const { control, errors, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (note) {
      reset({
        endX: note.points[1].x,
        endY: note.points[1].y,
        startX: note.points[0].x,
        startY: note.points[0].y,
      });
    }
  }, [note, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" open={!!note}>
      <DialogTitle>Edit Note</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Controller
            as={TextField}
            autoFocus
            control={control}
            error={!!errors.startX}
            fullWidth
            helperText={
              errors.startX &&
              'You must enter an x value for the starting point.'
            }
            id="startX"
            label="Start X"
            min={0}
            name="startX"
            rules={{ required: true, valueAsNumber: true }}
            type="number"
          />
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.startY}
              fullWidth
              helperText={
                errors.startY &&
                'You must enter an y value for the starting point.'
              }
              id="startY"
              label="Start Y"
              min={0}
              name="startY"
              rules={{ required: true, valueAsNumber: true }}
              type="number"
            />
          </Box>
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.endX}
              fullWidth
              helperText={
                errors.endX && 'You must enter an x value for the ending point.'
              }
              id="endX"
              label="End X"
              min={0}
              name="endX"
              rules={{ required: true, valueAsNumber: true }}
              type="number"
            />
          </Box>
          <Box paddingTop={3}>
            <Controller
              as={TextField}
              autoFocus
              control={control}
              error={!!errors.endY}
              fullWidth
              helperText={
                errors.endY && 'You must enter an y value for the ending point.'
              }
              id="endY"
              label="End Y"
              min={0}
              name="endY"
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

SequenceDetailsNotesEdit.propTypes = {
  isSaving: PropTypes.bool.isRequired,
  note: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
