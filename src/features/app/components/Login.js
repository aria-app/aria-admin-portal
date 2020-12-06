import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';

const { useAuth } = shared.hooks;

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
  const { error, loading, login, user } = useAuth();

  const handleLoginClick = React.useCallback(async () => {
    try {
      await login();
      // eslint-disable-next-line
    } catch {}
  }, [login]);

  return (
    <Root>
      <StyledContainer maxWidth="sm">
        <Box paddingY={3}>
          <div>Log in to view and manage songs and data.</div>
          {error && <div style={{ color: 'red' }}>{error.message}</div>}
          {user && (
            <div style={{ color: 'blue' }}>
              {user.firstName} {user.lastName}
            </div>
          )}
          <Box display="flex" justifyContent="flex-end" paddingTop={3}>
            <Button
              color="primary"
              onClick={handleLoginClick}
              variant="contained"
            >
              {loading ? (
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
