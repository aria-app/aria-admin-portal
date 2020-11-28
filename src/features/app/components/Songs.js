import { gql, useQuery } from '@apollo/client';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';

const { useUser } = shared.hooks;

const Root = styled(Container)((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  flex: 1,
}));

const GET_SONGS = gql`
  query GetSongs($userId: ID!) {
    songs(userId: $userId) {
      bpm
      id
      name
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

  if (!data || loading) return <p>Loading...</p>;
  if (error) {
    return <p>Error :(</p>;
  }

  return (
    <Root disableGutters maxWidth="sm">
      <List>
        {data.songs.map((song) => (
          <ListItem button key={song.id} onClick={() => handleSongClick(song)}>
            <ListItemText>{song.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Root>
  );
}
