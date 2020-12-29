import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import PropTypes from 'prop-types';
import React from 'react';

export default function SongDetailsInfo(props) {
  const { song } = props;

  return (
    <Box paddingX={3}>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Typography>{song.name}</Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Created By</FormLabel>
          <Typography>
            {song.user.firstName} {song.user.lastName}
          </Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>BPM</FormLabel>
          <Typography>{song.bpm}</Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Measure Count</FormLabel>
          <Typography>{song.measureCount}</Typography>
        </FormControl>
      </Box>
      <Box paddingTop={3}>
        <FormControl>
          <FormLabel>Modified</FormLabel>
          <Typography>
            {formatDistance(parseISO(song.dateModified), new Date(), {
              addSuffix: true,
            })}
          </Typography>
        </FormControl>
      </Box>
    </Box>
  );
}

SongDetailsInfo.propTypes = {
  song: PropTypes.object,
};
