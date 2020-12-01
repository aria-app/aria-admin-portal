import { gql, useMutation, useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { useNavigate } from '@reach/router';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

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
  query GetSongs($sort: String, $sortDirection: String, $userId: ID!) {
    songs(sort: $sort, sortDirection: $sortDirection, userId: $userId) {
      dateModified
      id
      name
      trackCount
    }
  }
`;

export default function Songs() {
  const user = useUser();
  const [sort, setSort] = useQueryParam(
    'sort',
    withDefault(StringParam, 'name'),
  );
  const [sortDirection, setSortDirection] = useQueryParam(
    'sortDirection',
    withDefault(StringParam, 'asc'),
  );
  const [createSong] = useMutation(CREATE_SONG);
  const navigate = useNavigate();
  const { data, error, loading } = useQuery(GET_SONGS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !user,
    variables: {
      sort,
      sortDirection,
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
        const result = await createSong({
          variables: {
            options,
          },
        });
        enqueueSnackbar('The song was created.', {
          variant: 'success',
        });

        setIsAddOpen(false);
        navigate(`/song/${result.data.createSong.song.id}`);
      } catch (e) {
        enqueueSnackbar('The song could not be created.', {
          variant: 'error',
        });
      }
    },
    [createSong, enqueueSnackbar, navigate],
  );

  const handleSongClick = React.useCallback(
    (song) => {
      navigate(`/song/${song.id}`);
    },
    [navigate],
  );

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
                  <Typography color="textPrimary">Songs</Typography>
                </Breadcrumbs>
              </Box>
              <Select onChange={(e) => setSort(e.target.value)} value={sort}>
                <MenuItem value="dateModified">Date Modified</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="trackCount">Track Count</MenuItem>
              </Select>
              <Box paddingLeft={2}>
                <Select
                  onChange={(e) => setSortDirection(e.target.value)}
                  value={sortDirection}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </Box>
              <IconButton edge="end" onClick={handleAddButtonClick}>
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
