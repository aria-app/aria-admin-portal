import { gql, useQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LocationProvider, Router } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';
import Login from './Login';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';
import Sidebar from './Sidebar';
import Songs from './Songs';
import Topbar from './Topbar';
import Users from './Users';

const { UserProvider } = shared.components;

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

const Main = styled.div({
  display: 'flex',
  flex: '1 1 auto',
});

const Content = styled.div({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
});

const StyledRouter = styled(Router)({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
});

const ME = gql`
  query Me {
    me {
      email
      firstName
      id
      isAdmin
      lastName
    }
  }
`;

export default function App() {
  const { data, error, loading, refetch } = useQuery(ME, {
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    return <div>There was an error fetching the current user.</div>;
  }

  return (
    <UserProvider user={data && data.me}>
      <LocationProvider>
        <Root>
          <Topbar />
          <Main>
            <PrivateRoute component={Sidebar} />
            <Content>
              {loading && <LinearProgress />}
              {!loading && (
                <StyledRouter>
                  <Login onLoginComplete={refetch} path="sign-in" />
                  <PrivateRoute component={Songs} path="/" />
                  <PrivateRoute component={Songs} path="songs" />
                  <PrivateRoute component={Users} path="users" />
                  <NotFound path="*" />
                </StyledRouter>
              )}
            </Content>
          </Main>
        </Root>
      </LocationProvider>
    </UserProvider>
  );
}
