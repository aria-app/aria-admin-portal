import { useAuth0 } from '@auth0/auth0-react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import { Redirect } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});

const StyledContainer = styled(Container)((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  flex: 1,
}));

export default function Login() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return <Redirect noThrow to="/songs" />;
  }

  return (
    <Root>
      <StyledContainer maxWidth="sm">
        <Box paddingY={3}>
          <div>Log in to view and manage songs and data.</div>
          <Box display="flex" justifyContent="flex-end" paddingTop={3}>
            <Button
              color="primary"
              onClick={loginWithRedirect}
              variant="contained"
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                'Log In'
              )}
            </Button>
          </Box>
        </Box>
      </StyledContainer>
    </Root>
  );
}
