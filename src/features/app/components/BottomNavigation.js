import MuiBottomNavigation from '@material-ui/core/BottomNavigation';
import MuiBottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import PeopleIcon from '@material-ui/icons/People';
import React from 'react';
import styled from 'styled-components';

const Root = styled(MuiBottomNavigation)((props) => ({
  borderTop: `1px solid ${props.theme.palette.divider}`,
}));

const getIcon = (item) =>
  ({
    songs: <LibraryMusicIcon color="inherit" />,
    users: <PeopleIcon color="inherit" />,
  }[item.path]);

export default function BottomNavigation(props) {
  const { items, onSelectedPathChange, selectedPath } = props;

  const handleChange = React.useCallback(
    (_, path) => {
      onSelectedPathChange(path);
    },
    [onSelectedPathChange],
  );

  return (
    <Root onChange={handleChange} showLabels value={selectedPath}>
      {items.map((item) => (
        <MuiBottomNavigationAction
          icon={getIcon(item)}
          key={item.path}
          label={item.text}
          value={item.path}
        />
      ))}
    </Root>
  );
}
