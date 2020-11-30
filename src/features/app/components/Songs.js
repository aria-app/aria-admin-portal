import { gql, useMutation, useQuery } from '@apollo/client';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';
import SongsAdd from './SongsAdd';

const { useUser } = shared.hooks;

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

const CREATE_SONG = gql`
  mutation CreateSong($options: CreateSongInput!) {
    createSong(options: $options) {
      song {
        id
      }
      success
    }
  }
`;

const GET_SONGS = gql`
  query GetSongs($userId: ID!) {
    songs(userId: $userId) {
      dateModified
      id
      name
      trackCount
    }
  }
`;

export default function Songs() {
  const user = useUser();
  const [createSong] = useMutation(CREATE_SONG);
  const { data, error, loading, refetch } = useQuery(GET_SONGS, {
    notifyOnNetworkStatusChange: true,
    skip: !user,
    variables: {
      userId: user && user.id,
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const handleAddButtonClick = React.useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleAddCancel = React.useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const handleAddSave = React.useCallback(
    async (options) => {
      try {
        await createSong({
          variables: {
            options,
          },
        });
        enqueueSnackbar('The song was created.', {
          variant: 'success',
        });

        setIsAddOpen(false);
        refetch();
      } catch (e) {
        enqueueSnackbar('The song could not be created.', {
          variant: 'error',
        });
      }
    },
    [createSong, enqueueSnackbar, refetch],
  );

  const handleSongClick = React.useCallback((song) => {
    // eslint-disable-next-line no-console
    console.log('Clicked song', song);
  }, []);

  return (
    <Root>
      {loading && <LinearProgress />}
      <StyledContainer disableGutters maxWidth="md">
        {error && <p>Error :(</p>}
        {!loading && !error && (
          <React.Fragment>
            <StyledToolbar>
              <IconButton
                edge="end"
                onClick={handleAddButtonClick}
                style={{ marginLeft: 'auto' }}
              >
                <AddIcon color="inherit" />
              </IconButton>
            </StyledToolbar>
            <List>
              {data.songs.map((song) => (
                <ListItem
                  button
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                >
                  <ListItemText
                    primary={`${song.name} (${formatDistance(
                      parseISO(song.dateModified),
                      new Date(),
                      { addSuffix: true },
                    )})`}
                    secondary={`Tracks: ${song.trackCount}`}
                  />
                </ListItem>
              ))}
            </List>
          </React.Fragment>
        )}
      </StyledContainer>
      <SongsAdd
        isOpen={isAddOpen}
        onCancel={handleAddCancel}
        onSave={handleAddSave}
      />
    </Root>
  );
}
