import { useApolloClient } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from 'react';

export default function Topbar() {
  const client = useApolloClient();
  const { isAuthenticated, logout } = useAuth0();

  const handleLogOutClick = React.useCallback(() => {
    client.resetStore();

    logout({ returnTo: window.location.origin });
  }, [client, logout]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <Typography variant="h6">Aria Admin Portal</Typography>
        </Box>
        {isAuthenticated && (
          <>
            <IconButton color="inherit" edge="end" onClick={handleLogOutClick}>
              <ExitToAppIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
