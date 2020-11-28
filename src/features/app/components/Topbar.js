import { gql, useQuery } from '@apollo/client';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from 'react';

import shared from '../../shared';

const { useUser } = shared.hooks;

const ME = gql`
  query Me {
    me {
      email
      firstName
      id
      lastName
    }
  }
`;

export default function Topbar() {
  const { client } = useQuery(ME);
  const user = useUser();

  const handleLogOutClick = React.useCallback(() => {
    window.localStorage.removeItem('token');

    client.resetStore();

    window.location.reload();
  }, [client]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <Typography variant="h6">Aria Admin Portal</Typography>
        </Box>
        {user && (
          <IconButton color="inherit" edge="end" onClick={handleLogOutClick}>
            <ExitToAppIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
