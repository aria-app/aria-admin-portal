import { useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import { useNavigate } from '@reach/router';
import debounce from 'lodash/fp/debounce';
import React from 'react';
import styled from 'styled-components';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

import shared from '../../../shared';
import * as documentNodes from '../../documentNodes';
import UsersList from './UsersList';
import UsersToolbar from './UsersToolbar';

const { Pagination } = shared.components;

const Root = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflow: 'hidden',
});

const StyledContainer = styled(Container)((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  boxShadow: `-1px 0 0 ${props.theme.palette.divider}, 1px 0 0 ${props.theme.palette.divider}`,
  flex: 1,
  overflow: 'hidden',
}));

const StyledToolbar = styled(Toolbar)((props) => ({
  borderTop: `1px solid ${props.theme.palette.divider}`,
  flex: 0,
}));

export default function Users() {
  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, 1),
    search: StringParam,
    sort: withDefault(StringParam, 'firstName'),
    sortDirection: withDefault(StringParam, 'asc'),
  });
  const navigate = useNavigate();
  const { data, error, loading } = useQuery(documentNodes.GET_USERS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      ...queryParams,
      limit: 15,
    },
  });

  const handlePageChange = React.useCallback(
    (page) => {
      setQueryParams({ page }, 'replace-in');
    },
    [setQueryParams],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = React.useCallback(
    debounce(500, (search) => {
      setQueryParams({ page: 1, search }, 'replace-in');
    }),
    [setQueryParams],
  );

  const handleSortChange = React.useCallback(
    (sort) => {
      setQueryParams({ page: 1, sort }, 'replace-in');
    },
    [setQueryParams],
  );

  const handleSortDirectionChange = React.useCallback(
    (sortDirection) => {
      setQueryParams({ page: 1, sortDirection }, 'replace-in');
    },
    [setQueryParams],
  );

  const handleUserClick = React.useCallback(
    (user) => {
      navigate(`/users/${user.id}`);
    },
    [navigate],
  );

  return (
    <Root>
      <StyledContainer disableGutters maxWidth="md">
        <Box display="flex" flex={1} flexDirection="column" height="100%">
          <UsersToolbar
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onSortDirectionChange={handleSortDirectionChange}
            search={queryParams.search}
            sort={queryParams.sort}
            sortDirection={queryParams.sortDirection}
          />
          <UsersList
            error={error}
            loading={loading}
            onUserClick={handleUserClick}
            users={data ? data.users.data : []}
          />
          <StyledToolbar>
            {data && data.users.meta && (
              <Box marginLeft={-1}>
                <Pagination
                  currentPage={data.users.meta.currentPage}
                  itemsPerPage={data.users.meta.itemsPerPage}
                  onCurrentPageChange={handlePageChange}
                  totalItemCount={data.users.meta.totalItemCount}
                />
              </Box>
            )}
          </StyledToolbar>
        </Box>
      </StyledContainer>
    </Root>
  );
}
