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
import TrackDetailsDelete from './TrackDetailsDelete';
import TrackDetailsEdit from './TrackDetailsEdit';
import TrackDetailsInfo from './TrackDetailsInfo';
import TrackDetailsSequences from './TrackDetailsSequences';

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

export default function TrackDetails(props) {
  const { trackId } = props;
  const { user } = useAuth();
  const [deleteTrack] = useMutation(documentNodes.DELETE_TRACK);
  const [updateTrack, { loading: updateTrackLoading }] = useMutation(
    documentNodes.UPDATE_TRACK,
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, loading } = useQuery(documentNodes.GET_TRACK, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: trackId,
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
      await deleteTrack({
        variables: {
          id: data.track.id,
        },
      });

      enqueueSnackbar('The song was deleted.', {
        variant: 'success',
      });
      setIsDeleteOpen(false);
      navigate(`/songs/${data.track.song.id}`);
    } catch (e) {
      enqueueSnackbar('The song could not be deleted.', {
        variant: 'error',
      });
    }
  }, [data, deleteTrack, enqueueSnackbar, navigate]);

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
          updates.voiceId === data.track.voice.id &&
          updates.volume === data.track.volume
        ) {
          enqueueSnackbar('No changes.');
          setIsEditOpen(false);
          return;
        }

        await updateTrack({
          variables: {
            input: {
              id: data.track.id,
              ...updates,
            },
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
    [data, enqueueSnackbar, updateTrack],
  );

  const handleTabsChange = React.useCallback(
    (e, value) => {
      setSelectedTab(value);
    },
    [setSelectedTab],
  );

  const handleSequenceClick = React.useCallback(
    (sequence) => {
      navigate(
        `/songs/${data.track.song.id}/tracks/${trackId}/sequences/${sequence.id}`,
      );
    },
    [data, navigate, trackId],
  );

  const isEditVisible = React.useMemo(() => {
    return getOr(undefined, 'track.song.user.id', data) === user.id;
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
                    to={`/songs/${data.track.song.id}`}
                  >
                    {data.track.song.name}
                  </Link>
                  <Typography color="textPrimary">
                    Track {data.track.id}
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
              <Tab label="Sequences" value="sequences" />
            </StyledTabs>
            {selectedTab === 'info' && <TrackDetailsInfo track={data.track} />}
            {selectedTab === 'sequences' && (
              <TrackDetailsSequences
                onSequenceClick={handleSequenceClick}
                track={data.track}
              />
            )}
            <TrackDetailsDelete
              isOpen={isDeleteOpen}
              onCancel={handleDeleteCancel}
              onDelete={handleDeleteDelete}
              track={data.track}
            />
            <TrackDetailsEdit
              isOpen={isEditOpen}
              isSaving={updateTrackLoading}
              onCancel={handleEditCancel}
              onSave={handleEditSave}
              track={data.track}
            />
          </React.Fragment>
        )}
      </StyledContainer>
    </Root>
  );
}
