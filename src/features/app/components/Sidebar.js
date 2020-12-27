import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import PeopleIcon from '@material-ui/icons/People';
import startsWith from 'lodash/fp/startsWith';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  borderRight: `1px solid ${props.theme.palette.divider}`,
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  width: props.theme.spacing(30),
}));

const getIcon = (item) =>
  ({
    songs: <LibraryMusicIcon color="inherit" />,
    users: <PeopleIcon color="inherit" />,
  }[item.path]);

export default function Sidebar(props) {
  const { items, onSelectedPathChange, selectedPath } = props;

  return (
    <Root>
      <List>
        {items.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => onSelectedPathChange(item.path)}
            selected={startsWith(item.path, selectedPath)}
          >
            <ListItemIcon>{getIcon(item)}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Root>
  );
}
