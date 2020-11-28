import { gql, useQuery } from '@apollo/client';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from 'react';

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

  const handleLogOutClick = React.useCallback(() => {
    window.localStorage.removeItem('token');

    client.resetStore();

    window.location.reload();
  }, [client]);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleLogOutClick}
          style={{ marginLeft: 'auto' }}
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
