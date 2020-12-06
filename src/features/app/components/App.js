import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Router } from '@reach/router';
import React, { Suspense } from 'react';
import styled from 'styled-components';

import songs from '../../songs';
import Login from './Login';
import Navigation from './Navigation';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';
import Topbar from './Topbar';

const { Song, Songs } = songs.components;

const Users = React.lazy(() => import('./Users'));

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
  const loading = false;

  return (
    <Root default>
      <CssBaseline />
      <Topbar />
      <Main>
        {!loading && <PrivateRoute component={Navigation} />}
        <Content>
          {loading && <LinearProgress />}
          {!loading && (
            <Suspense fallback={<LinearProgress />}>
              <StyledRouter>
                <Login path="login" />
                <PrivateRoute component={Songs} path="/" />
                <PrivateRoute component={Songs} path="songs" />
                <PrivateRoute component={Song} path="song/:id" />
                <PrivateRoute component={Users} path="users" />
                <NotFound path="*" />
              </StyledRouter>
            </Suspense>
          )}
        </Content>
      </Main>
    </Root>
  );
}
