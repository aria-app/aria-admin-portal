import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { PropTypes } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div({
  flex: 1,
  overflowY: 'auto',
});

export default function SequenceDetailsNotes(props) {
  const { isEditable, onNoteClick, sequence } = props;

  const handleNoteClick = React.useCallback(
    (note) => {
      if (!isEditable) return;

      onNoteClick(note);
    },
    [isEditable, onNoteClick],
  );

  return (
    <Root>
      <List style={{ overflowY: 'auto' }}>
        {sequence.notes.map((note) => (
          <ListItem
            button={isEditable}
            key={note.id}
            onClick={() => handleNoteClick(note)}
          >
            <ListItemText
              primary="Note"
              secondary={`(${note.points[0].x}, ${note.points[0].y}), (${note.points[1].x}, ${note.points[1].y})`}
            />
          </ListItem>
        ))}
      </List>
    </Root>
  );
}

SequenceDetailsNotes.propTypes = {
  isEditable: PropTypes.bool,
  onNoteClick: PropTypes.func,
  sequence: PropTypes.object,
};
