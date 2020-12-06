import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import PeopleIcon from '@material-ui/icons/People';
import { useLocation, useNavigate } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';

const { useAuth } = shared.hooks;

const Root = styled.div((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  borderRight: `1px solid ${props.theme.palette.divider}`,
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  width: props.theme.spacing(30),
}));

export default function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleItemClick = React.useCallback(
    (path) => {
      if (path === pathname) return;

      navigate(path);
    },
    [navigate, pathname],
  );

  return (
    <Root>
      <List>
        <ListItem
          button
          onClick={() => handleItemClick('/songs')}
          selected={pathname === '/songs' || pathname === '/'}
        >
          <ListItemIcon>
            <LibraryMusicIcon color="inherit" />
          </ListItemIcon>
          <ListItemText primary="Songs" />
        </ListItem>
        {user && user.isAdmin && (
          <ListItem
            button
            onClick={() => handleItemClick('/users')}
            selected={pathname === '/users'}
          >
            <ListItemIcon>
              <PeopleIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        )}
      </List>
    </Root>
  );
}
