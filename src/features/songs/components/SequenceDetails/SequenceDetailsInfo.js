import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

export default function SequenceDetailsInfo(props) {
  const { sequence } = props;

  return (
    <Box paddingX={3}>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Position</FormLabel>
          <Typography>{sequence.position}</Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Measure Count</FormLabel>
          <Typography>{sequence.measureCount}</Typography>
        </FormControl>
      </Box>
    </Box>
  );
}

SequenceDetailsInfo.propTypes = {
  sequence: PropTypes.object,
};
