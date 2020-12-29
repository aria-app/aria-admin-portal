import { useApolloClient } from '@apollo/client';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { PropTypes } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import * as documentNodes from '../../documentNodes';

const Root = styled.div({
  flex: 1,
  overflowY: 'auto',
});

export default function SongDetailsTracks(props) {
  const apolloClient = useApolloClient();
  const { onTrackClick, song } = props;

  const handleTrackClick = React.useCallback(
    (track) => {
      onTrackClick(track);
    },
    [onTrackClick],
  );

  return (
    <Root>
      <List style={{ overflowY: 'auto' }}>
        {song.tracks.map((track) => (
          <ListItem
            button
            key={track.id}
            onClick={() => handleTrackClick(track)}
            onMouseOver={async () => {
              try {
                await apolloClient.query({
                  query: documentNodes.GET_TRACK,
                  variables: { id: track.id },
                });
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
              }
            }}
          >
            <ListItemText
              primary={`Position: ${track.position}`}
              secondary={`Voice: ${track.voice.name}`}
            />
          </ListItem>
        ))}
      </List>
    </Root>
  );
}

SongDetailsTracks.propTypes = {
  onTrackClick: PropTypes.func,
  song: PropTypes.object,
};
