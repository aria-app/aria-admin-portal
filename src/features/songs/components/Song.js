import { gql, useQuery } from '@apollo/client';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link as ReachLink } from '@reach/router';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import styled from 'styled-components';

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

const GET_SONG = gql`
  query GetSong($id: ID!) {
    song(id: $id) {
      bpm
      dateModified
      id
      name
    }
  }
`;

export default function Song(props) {
  const { id } = props;
  const { data, error, loading } = useQuery(GET_SONG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id,
    },
  });

  return (
    <Root>
      {loading && <LinearProgress />}
      <StyledContainer disableGutters maxWidth="md">
        {error && <p>Error :(</p>}
        {!loading && !error && (
          <React.Fragment>
            <StyledToolbar>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" component={ReachLink} to="/songs">
                  Songs
                </Link>
                <Typography color="textPrimary">{data.song.name}</Typography>
              </Breadcrumbs>
            </StyledToolbar>
            <div>{data.song.name}</div>
            <div>
              {formatDistance(parseISO(data.song.dateModified), new Date(), {
                addSuffix: true,
              })}
            </div>
          </React.Fragment>
        )}
      </StyledContainer>
    </Root>
  );
}
