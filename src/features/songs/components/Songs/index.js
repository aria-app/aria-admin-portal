import { useMutation, useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import { useNavigate } from '@reach/router';
import debounce from 'lodash/fp/debounce';
import { useSnackbar } from 'notistack';
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
import SongsAdd from './SongsAdd';
import SongsList from './SongsList';
import SongsToolbar from './SongsToolbar';

const { Pagination } = shared.components;

const Root = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});

const StyledContainer = styled(Container)((props) => ({
  backgroundColor: props.theme.palette.background.paper,
  boxShadow: `-1px 0 0 ${props.theme.palette.divider}, 1px 0 0 ${props.theme.palette.divider}`,
  flex: 1,
}));

const StyledToolbar = styled(Toolbar)((props) => ({
  borderTop: `1px solid ${props.theme.palette.divider}`,
  flex: 0,
}));

export default function Songs() {
  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, 1),
    search: StringParam,
    sort: withDefault(StringParam, 'name'),
    sortDirection: withDefault(StringParam, 'asc'),
  });
  const [createSong] = useMutation(documentNodes.CREATE_SONG);
  const navigate = useNavigate();
  const { data, error, loading } = useQuery(documentNodes.GET_SONGS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      ...queryParams,
      limit: 10,
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const handleAddButtonClick = React.useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleAddCancel = React.useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const handleAddSave = React.useCallback(
    async (options) => {
      try {
        const result = await createSong({
          variables: {
            options,
          },
        });
        enqueueSnackbar('The song was created.', {
          variant: 'success',
        });

        setIsAddOpen(false);
        navigate(`/song/${result.data.createSong.song.id}`);
      } catch (e) {
        enqueueSnackbar('The song could not be created.', {
          variant: 'error',
        });
      }
    },
    [createSong, enqueueSnackbar, navigate],
  );

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

  const handleSongClick = React.useCallback(
    (song) => {
      navigate(`/song/${song.id}`);
    },
    [navigate],
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

  return (
    <Root>
      <StyledContainer disableGutters maxWidth="md">
        <Box display="flex" flex={1} flexDirection="column" height="100%">
          <SongsToolbar
            onAddButtonClick={handleAddButtonClick}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onSortDirectionChange={handleSortDirectionChange}
            search={queryParams.search}
            sort={queryParams.sort}
            sortDirection={queryParams.sortDirection}
          />
          <SongsList
            error={error}
            loading={loading}
            onSongClick={handleSongClick}
            songs={data ? data.songs.data : []}
          />
          <StyledToolbar>
            {data && data.songs.meta && (
              <Box marginLeft={-1}>
                <Pagination
                  currentPage={data.songs.meta.currentPage}
                  itemsPerPage={data.songs.meta.itemsPerPage}
                  onCurrentPageChange={handlePageChange}
                  totalItemCount={data.songs.meta.totalItemCount}
                />
              </Box>
            )}
          </StyledToolbar>
        </Box>
      </StyledContainer>
      <SongsAdd
        isOpen={isAddOpen}
        onCancel={handleAddCancel}
        onSave={handleAddSave}
      />
    </Root>
  );
}
