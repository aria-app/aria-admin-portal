import { gql, useQuery } from '@apollo/client';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';

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
  const { data, error, loading } = useQuery(GET_SONGS, {
    skip: !user,
    variables: {
      userId: user && user.id,
    },
  });

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
        )}
      </StyledContainer>
    </Root>
  );
}
