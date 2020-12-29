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
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

import shared from '../../../shared';
import * as documentNodes from '../../documentNodes';
import SongDetailsDelete from './SongDetailsDelete';
import SongDetailsEdit from './SongDetailsEdit';
import SongDetailsInfo from './SongDetailsInfo';
import SongDetailsTracks from './SongDetailsTracks';

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

export default function SongDetails(props) {
  const { songId } = props;
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
      id: songId,
    },
  });
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState('info');

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

  const handleTabsChange = React.useCallback(
    (e, value) => {
      setSelectedTab(value);
    },
    [setSelectedTab],
  );

  const handleTrackClick = React.useCallback(
    (track) => {
      navigate(`/songs/${songId}/tracks/${track.id}`);
    },
    [navigate, songId],
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
            <StyledTabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              value={selectedTab}
            >
              <Tab label="Info" value="info" />
              <Tab label="Tracks" value="tracks" />
            </StyledTabs>
            {selectedTab === 'info' && <SongDetailsInfo song={data.song} />}
            {selectedTab === 'tracks' && (
              <SongDetailsTracks
                onTrackClick={handleTrackClick}
                song={data.song}
              />
            )}
            <SongDetailsDelete
              isOpen={isDeleteOpen}
              onCancel={handleDeleteCancel}
              onDelete={handleDeleteDelete}
              song={data.song}
            />
            <SongDetailsEdit
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
