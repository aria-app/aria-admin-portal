import { gql, useMutation, useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link as ReachLink, useNavigate } from '@reach/router';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

import SongDelete from './SongDelete';

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

const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id) {
      success
    }
  }
`;

const GET_SONG = gql`
  query GetSong($id: ID!) {
    song(id: $id) {
      bpm
      dateModified
      id
      measureCount
      name
    }
  }
`;

export default function Song(props) {
  const { id } = props;
  const [deleteSong] = useMutation(DELETE_SONG);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, loading } = useQuery(GET_SONG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id,
    },
  });
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const handleDeleteButtonClick = React.useCallback(() => {
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteCancel = React.useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const handleDeleteDelete = React.useCallback(async () => {
    try {
      await deleteSong({
        variables: {
          id: data.song.id,
        },
      });

      enqueueSnackbar('The song was deleted.', {
        variant: 'success',
      });
      setIsDeleteOpen(false);
      navigate('/songs');
    } catch (e) {
      enqueueSnackbar('The song could not be deleted.', {
        variant: 'error',
      });
    }
  }, [data, deleteSong, enqueueSnackbar, navigate]);

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
                  <Link color="inherit" component={ReachLink} to="/songs">
                    Songs
                  </Link>
                  <Typography color="textPrimary">{data.song.name}</Typography>
                </Breadcrumbs>
              </Box>
              <IconButton edge="end" onClick={handleDeleteButtonClick}>
                <DeleteIcon color="inherit" />
              </IconButton>
            </StyledToolbar>
            <Box paddingX={3}>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Typography>{data.song.name}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Modified</FormLabel>
                  <Typography>
                    {formatDistance(
                      parseISO(data.song.dateModified),
                      new Date(),
                      {
                        addSuffix: true,
                      },
                    )}
                  </Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>BPM</FormLabel>
                  <Typography>{data.song.bpm}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Measure Count</FormLabel>
                  <Typography>{data.song.measureCount}</Typography>
                </FormControl>
              </Box>
            </Box>
            <SongDelete
              isOpen={isDeleteOpen}
              onCancel={handleDeleteCancel}
              onDelete={handleDeleteDelete}
              song={data.song}
            />
          </React.Fragment>
        )}
      </StyledContainer>
    </Root>
  );
}
