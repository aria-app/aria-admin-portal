import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

export default function TrackDetailsInfo(props) {
  const { track } = props;

  return (
    <Box paddingX={3}>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Position</FormLabel>
          <Typography>{track.position}</Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Voice</FormLabel>
          <Typography>{track.voice.name}</Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Volume</FormLabel>
          <Typography>{track.volume}</Typography>
        </FormControl>
      </Box>
    </Box>
  );
}

TrackDetailsInfo.propTypes = {
  track: PropTypes.object,
};
