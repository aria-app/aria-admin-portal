import { useMutation } from '@apollo/client';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from 'react';

import shared from '../../shared';
import { LOGOUT } from '../documentNodes';

const { useAuth } = shared.hooks;

export default function Topbar() {
  const { clearAuthState, user } = useAuth();
  const [logout, { client }] = useMutation(LOGOUT);

  const handleLogOutClick = React.useCallback(async () => {
    await logout();
    clearAuthState();
    client.resetStore();
  }, [clearAuthState, client, logout]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <Typography variant="h6">Aria Admin Portal</Typography>
        </Box>
        {user && (
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
