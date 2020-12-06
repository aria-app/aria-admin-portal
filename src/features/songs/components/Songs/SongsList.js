import { useApolloClient } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import { PropTypes } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import * as documentNodes from '../../documentNodes';

const Root = styled.div({
  flex: 1,
  overflowY: 'auto',
});

export default function SongsList(props) {
  const apolloClient = useApolloClient();
  const { error, loading, onSongClick, songs } = props;

  const handleSongClick = React.useCallback(
    (song) => {
      onSongClick(song);
    },
    [onSongClick],
  );

  return (
    <Root>
      {loading && <LinearProgress />}
      {error && <p>Error :(</p>}
      {!loading && !error && (
        <List style={{ overflowY: 'auto' }}>
          {songs.map((song) => (
            <ListItem
              button
              key={song.id}
              onClick={() => handleSongClick(song)}
              onMouseOver={() => {
                apolloClient.query({
                  query: documentNodes.GET_SONG,
                  variables: { id: song.id },
                });
              }}
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
    </Root>
  );
}

SongsList.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  onSongClick: PropTypes.func,
  songs: PropTypes.arrayOf(PropTypes.object),
};
