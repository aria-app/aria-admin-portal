import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import debounce from 'lodash/fp/debounce';
import React from 'react';
import styled from 'styled-components';

const Root = styled(Toolbar)((props) => ({
  borderBottom: `1px solid ${props.theme.palette.divider}`,
  borderTop: `1px solid ${props.theme.palette.divider}`,
  flex: 0,
}));

export default function UsersToolbar(props) {
  const {
    onSearchChange,
    onSortChange,
    onSortDirectionChange,
    search,
    sort,
    sortDirection,
  } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = React.useCallback(
    debounce(250, (e) => {
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
          <MenuItem value="firstName">First Name</MenuItem>
          <MenuItem value="lastName">Last Name</MenuItem>
        </Select>
      </Box>
      <Box paddingLeft={3}>
        <Select onChange={handleSortDirectionChange} value={sortDirection}>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </Box>
    </Root>
  );
}
