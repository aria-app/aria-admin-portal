import { useMutation, useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link as ReachLink, useNavigate } from '@reach/router';
import getOr from 'lodash/fp/getOr';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

import shared from '../../../shared';
import * as documentNodes from '../../documentNodes';
import SequenceDetailsDelete from './SequenceDetailsDelete';
import SequenceDetailsEdit from './SequenceDetailsEdit';
import SequenceDetailsInfo from './SequenceDetailsInfo';
import SequenceDetailsNotes from './SequenceDetailsNotes';
import SequenceDetailsNotesEdit from './SequenceDetailsNotesEdit';

const { useAuth } = shared.hooks;

const Root = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});

const StyledContainer = styled(Container)((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  boxShadow: `-1px 0 0 ${props.theme.palette.divider}, 1px 0 0 ${props.theme.palette.divider}`,
  flex: 1,
}));

const StyledToolbar = styled(Toolbar)((props) => ({
  borderBottom: `1px solid ${props.theme.palette.divider}`,
  flex: 1,
}));

const StyledTabs = styled(Tabs)((props) => ({
  borderBottom: `1px solid ${props.theme.palette.divider}`,
}));

export default function SequenceDetails(props) {
  const { sequenceId, songId } = props;
  const { user } = useAuth();
  const [deleteSequence] = useMutation(documentNodes.DELETE_SEQUENCE);
  const [updateNote, { loading: updateNoteLoading }] = useMutation(
    documentNodes.UPDATE_NOTES_POINTS,
  );
  const [updateSequence, { loading: updateSequenceLoading }] = useMutation(
    documentNodes.UPDATE_SEQUENCE,
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, loading } = useQuery(documentNodes.GET_SEQUENCE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: sequenceId,
    },
  });
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState();
  const [selectedTab, setSelectedTab] = React.useState('info');

  const handleDeleteButtonClick = React.useCallback(() => {
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteCancel = React.useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const handleDeleteDelete = React.useCallback(async () => {
    try {
      await deleteSequence({
        variables: {
          id: data.sequence.id,
        },
      });

      enqueueSnackbar('The sequence was deleted.', {
        variant: 'success',
      });
      setIsDeleteOpen(false);
      navigate(`/songs/${songId}/tracks/${data.sequence.track.id}`);
    } catch (e) {
      enqueueSnackbar('The sequence could not be deleted.', {
        variant: 'error',
      });
    }
  }, [data, deleteSequence, enqueueSnackbar, navigate, songId]);

  const handleEditButtonClick = React.useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const handleEditCancel = React.useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const handleEditSave = React.useCallback(
    async (updates) => {
      try {
        if (updates.measureCount === data.sequence.measureCount) {
          enqueueSnackbar('No changes.');
          setIsEditOpen(false);
          return;
        }

        await updateSequence({
          variables: {
            input: {
              id: data.sequence.id,
              ...updates,
            },
          },
        });

        enqueueSnackbar('The sequence was updated.', {
          variant: 'success',
        });
        setIsEditOpen(false);
      } catch (e) {
        enqueueSnackbar('The sequence could not be updated.', {
          variant: 'error',
        });
      }
    },
    [data, enqueueSnackbar, updateSequence],
  );

  const handleNoteClick = React.useCallback(
    (note) => {
      setSelectedNote(note);
    },
    [setSelectedNote],
  );

  const handleNotesEditCancel = React.useCallback(() => {
    setSelectedNote(undefined);
  }, []);

  const handleNotesEditSave = React.useCallback(
    async (updates) => {
      try {
        if (
          updates.endX === selectedNote.points[1].x &&
          updates.endY === selectedNote.points[1].y &&
          updates.startX === selectedNote.points[0].x &&
          updates.startY === selectedNote.points[0].y
        ) {
          enqueueSnackbar('No changes.');
          setSelectedNote(undefined);
          return;
        }

        await updateNote({
          variables: {
            input: {
              notes: [
                {
                  id: selectedNote.id,
                  points: [
                    { x: updates.startX, y: updates.startY },
                    { x: updates.endX, y: updates.endY },
                  ],
                },
              ],
            },
          },
        });

        enqueueSnackbar('The note was updated.', {
          variant: 'success',
        });
        setSelectedNote(undefined);
      } catch (e) {
        enqueueSnackbar('The note could not be updated.', {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, selectedNote, updateNote],
  );

  const handleTabsChange = React.useCallback(
    (e, value) => {
      setSelectedTab(value);
    },
    [setSelectedTab],
  );

  const isEditVisible = React.useMemo(() => {
    return getOr(undefined, 'sequence.track.song.user.id', data) === user.id;
  }, [data, user]);

  return (
    <Root>
      {loading && <LinearProgress />}
      <StyledContainer disableGutters maxWidth="md">
        {error && <p>Error :(</p>}
        {!loading && !error && (
          <React.Fragment>
            <StyledToolbar>
              <Box flex={1}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link color="inherit" component={ReachLink} to="/songs">
                    Songs
                  </Link>
                  <Link
                    color="inherit"
                    component={ReachLink}
                    to={`/songs/${songId}`}
                  >
                    {data.sequence.track.song.name}
                  </Link>
                  <Link
                    color="inherit"
                    component={ReachLink}
                    to={`/songs/${songId}/tracks/${data.sequence.track.id}`}
                  >
                    Track {data.sequence.track.id}
                  </Link>
                  <Typography color="textPrimary">
                    Sequence {data.sequence.id}
                  </Typography>
                </Breadcrumbs>
              </Box>
              {isEditVisible && (
                <IconButton onClick={handleEditButtonClick}>
                  <EditIcon color="inherit" />
                </IconButton>
              )}
              <IconButton edge="end" onClick={handleDeleteButtonClick}>
                <DeleteIcon color="inherit" />
              </IconButton>
            </StyledToolbar>
            <StyledTabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              value={selectedTab}
            >
              <Tab label="Info" value="info" />
              <Tab label="Notes" value="notes" />
            </StyledTabs>
            {selectedTab === 'info' && (
              <SequenceDetailsInfo sequence={data.sequence} />
            )}
            {selectedTab === 'notes' && (
              <SequenceDetailsNotes
                isEditable={isEditVisible}
                onNoteClick={handleNoteClick}
                sequence={data.sequence}
              />
            )}
            <SequenceDetailsDelete
              isOpen={isDeleteOpen}
              onCancel={handleDeleteCancel}
              onDelete={handleDeleteDelete}
              sequence={data.sequence}
            />
            <SequenceDetailsEdit
              isOpen={isEditOpen}
              isSaving={updateSequenceLoading}
              onCancel={handleEditCancel}
              onSave={handleEditSave}
              sequence={data.sequence}
            />
            <SequenceDetailsNotesEdit
              isSaving={updateNoteLoading}
              note={selectedNote}
              onCancel={handleNotesEditCancel}
              onSave={handleNotesEditSave}
            />
          </React.Fragment>
        )}
      </StyledContainer>
    </Root>
  );
}
