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

export default function TrackDetailsTracks(props) {
  const apolloClient = useApolloClient();
  const { onSequenceClick, track } = props;

  const handleSequenceClick = React.useCallback(
    (sequence) => {
      onSequenceClick(sequence);
    },
    [onSequenceClick],
  );

  return (
    <Root>
      <List style={{ overflowY: 'auto' }}>
        {track.sequences.map((sequence) => (
          <ListItem
            button
            key={sequence.id}
            onClick={() => handleSequenceClick(sequence)}
            onMouseOver={async () => {
              try {
                await apolloClient.query({
                  query: documentNodes.GET_SEQUENCE,
                  variables: { id: sequence.id },
                });
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
              }
            }}
          >
            <ListItemText
              primary={`Position: ${sequence.position}`}
              secondary={`Measures: ${sequence.measureCount}`}
            />
          </ListItem>
        ))}
      </List>
    </Root>
  );
}

TrackDetailsTracks.propTypes = {
  onSequenceClick: PropTypes.func,
  track: PropTypes.object,
};
