import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

export default function SongDetailsDelete(props) {
  const { isOpen, onCancel, onDelete, song } = props;
  const [isDeleting, setIsDeleting] = React.useState();

  const handleDelete = React.useCallback(async () => {
    setIsDeleting(true);

    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete]);

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen}>
      <DialogTitle>Delete Song</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the song "{song.name}"?
        </DialogContentText>
        <DialogContentText>This action is permanent.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={isDeleting}
          onClick={handleDelete}
          type="submit"
        >
          {isDeleting ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            'Delete'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SongDetailsDelete.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  song: PropTypes.object,
};
