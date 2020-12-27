import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Router } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';
import songs from '../../songs';
import users from '../../users';
import Login from './Login';
import Navigation from './Navigation';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';
import Topbar from './Topbar';

const { useAuth } = shared.hooks;
const { Song, Songs } = songs.components;
const { UserDetails, Users } = users.components;

const Root = styled.div((props) => ({
  backgroundColor: props.theme.palette.background.default,
  bottom: 0,
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  right: 0,
  top: 0,
}));

const Main = styled.div((props) => ({
  display: 'flex',
  flex: '1 1 auto',
  [`@media (max-width: ${props.theme.breakpoints.values.md}px)`]: {
    flexDirection: 'column-reverse',
  },
  overflow: 'hidden',
}));

const Content = styled.div({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  overflow: 'hidden',
});

const StyledRouter = styled(Router)({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  overflow: 'hidden',
});

export default function App() {
  const { loading } = useAuth();

  return (
    <Root default>
      <CssBaseline />
      <Topbar />
      <Main>
        {!loading && <PrivateRoute component={Navigation} />}
        <Content>
          {loading && <LinearProgress />}
          {!loading && (
            <StyledRouter>
              <Login path="login" />
              <PrivateRoute component={Songs} path="/" />
              <PrivateRoute component={Song} path="songs/:id" />
              <PrivateRoute component={Songs} path="songs" />
              <PrivateRoute component={Users} path="users" />
              <PrivateRoute component={UserDetails} path="users/:id" />
              <NotFound path="*" />
            </StyledRouter>
          )}
        </Content>
      </Main>
    </Root>
  );
}
