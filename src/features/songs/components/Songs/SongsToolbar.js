import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import debounce from 'lodash/fp/debounce';
import React from 'react';
import styled from 'styled-components';

const Root = styled(Toolbar)((props) => ({
  borderBottom: `1px solid ${props.theme.palette.divider}`,
  borderTop: `1px solid ${props.theme.palette.divider}`,
  flex: 0,
}));

export default function SongsToolbar(props) {
  const {
    onAddButtonClick,
    onSearchChange,
    onSortChange,
    onSortDirectionChange,
    search,
    sort,
    sortDirection,
  } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = React.useCallback(
    debounce(500, (e) => {
      onSearchChange(e.target.value || undefined);
    }),
    [onSearchChange],
  );

  const handleSortChange = React.useCallback(
    (e) => {
      onSortChange(e.target.value);
    },
    [onSortChange],
  );

  const handleSortDirectionChange = React.useCallback(
    (e) => {
      onSortDirectionChange(e.target.value);
    },
    [onSortDirectionChange],
  );

  return (
    <Root>
      <Box flex={1}>
        <TextField
          defaultValue={search}
          fullWidth
          onChange={handleSearchChange}
          placeholder="Search"
        />
      </Box>
      <Box paddingLeft={3}>
        <Select onChange={handleSortChange} value={sort}>
          <MenuItem value="dateModified">Date Modified</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </Box>
      <Box paddingLeft={3}>
        <Select onChange={handleSortDirectionChange} value={sortDirection}>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </Box>
      <IconButton edge="end" onClick={onAddButtonClick}>
        <AddIcon color="inherit" />
      </IconButton>
    </Root>
  );
}
