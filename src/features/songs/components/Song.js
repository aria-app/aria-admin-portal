import { useMutation, useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link as ReachLink, useNavigate } from '@reach/router';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';
import * as documentNodes from '../documentNodes';
import SongDelete from './SongDelete';
import SongEdit from './SongEdit';

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

export default function Song(props) {
  const { id } = props;
  const { user } = useAuth();
  const [deleteSong] = useMutation(documentNodes.DELETE_SONG);
  const [updateSong, { loading: updateSongLoading }] = useMutation(
    documentNodes.UPDATE_SONG,
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, loading } = useQuery(documentNodes.GET_SONG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id,
    },
  });
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const handleDeleteButtonClick = React.useCallback(() => {
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteCancel = React.useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const handleDeleteDelete = React.useCallback(async () => {
    try {
      await deleteSong({
        variables: {
          id: data.song.id,
        },
      });

      enqueueSnackbar('The song was deleted.', {
        variant: 'success',
      });
      setIsDeleteOpen(false);
      navigate('/songs');
    } catch (e) {
      enqueueSnackbar('The song could not be deleted.', {
        variant: 'error',
      });
    }
  }, [data, deleteSong, enqueueSnackbar, navigate]);

  const handleEditButtonClick = React.useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const handleEditCancel = React.useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const handleEditSave = React.useCallback(
    async (updates) => {
      try {
        if (
          updates.bpm === data.song.bpm &&
          updates.measureCount === data.song.measureCount &&
          updates.name === data.song.name
        ) {
          enqueueSnackbar('No changes.');
          setIsEditOpen(false);
          return;
        }

        await updateSong({
          variables: {
            id: data.song.id,
            updates,
          },
        });

        enqueueSnackbar('The song was updated.', {
          variant: 'success',
        });
        setIsEditOpen(false);
      } catch (e) {
        enqueueSnackbar('The song could not be updated.', {
          variant: 'error',
        });
      }
    },
    [data, enqueueSnackbar, updateSong],
  );

  const isEditVisible = React.useMemo(() => {
    return data && data.song && data.song.user.id === user.id;
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
                  <Typography color="textPrimary">{data.song.name}</Typography>
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
            <Box paddingX={3}>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Typography>{data.song.name}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Created By</FormLabel>
                  <Typography>
                    {data.song.user.firstName} {data.song.user.lastName}
                  </Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>BPM</FormLabel>
                  <Typography>{data.song.bpm}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Measure Count</FormLabel>
                  <Typography>{data.song.measureCount}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Modified</FormLabel>
                  <Typography>
                    {formatDistance(
                      parseISO(data.song.dateModified),
                      new Date(),
                      {
                        addSuffix: true,
                      },
                    )}
                  </Typography>
                </FormControl>
              </Box>
            </Box>
            <SongDelete
              isOpen={isDeleteOpen}
              onCancel={handleDeleteCancel}
              onDelete={handleDeleteDelete}
              song={data.song}
            />
            <SongEdit
              isOpen={isEditOpen}
              isSaving={updateSongLoading}
              onCancel={handleEditCancel}
              onSave={handleEditSave}
              song={data.song}
            />
          </React.Fragment>
        )}
      </StyledContainer>
    </Root>
  );
}
