import { useMutation, useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link as ReachLink } from '@reach/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';

import shared from '../../shared';
import * as documentNodes from '../documentNodes';
import UserDelete from './UserDelete';
import UserEdit from './UserEdit';

const { LOGOUT } = shared.documentNodes;
const { useAuth } = shared.hooks;

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
  borderBottom: `1px solid ${props.theme.palette.divider}`,
  flex: 1,
}));

export default function User(props) {
  const { id } = props;
  const [logout, { client }] = useMutation(LOGOUT);
  const { handleLogout } = useAuth();
  const [deleteUser] = useMutation(documentNodes.DELETE_USER);
  const [updateUser, { loading: updateUserLoading }] = useMutation(
    documentNodes.UPDATE_USER,
  );
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, loading } = useQuery(documentNodes.GET_USER, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id,
    },
  });
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const handleDeleteButtonClick = React.useCallback(() => {
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteCancel = React.useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const handleDeleteDelete = React.useCallback(async () => {
    try {
      await deleteUser({
        variables: {
          id: data.user.id,
        },
      });

      enqueueSnackbar('The user was deleted.', {
        variant: 'success',
      });
      setIsDeleteOpen(false);
      await logout();
      client.resetStore();
      handleLogout();
    } catch (e) {
      enqueueSnackbar('The user could not be deleted.', {
        variant: 'error',
      });
    }
  }, [client, data, deleteUser, enqueueSnackbar, handleLogout, logout]);

  const handleEditButtonClick = React.useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const handleEditCancel = React.useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const handleEditSave = React.useCallback(
    async (updates) => {
      try {
        if (
          updates.email === data.user.email &&
          updates.firstName === data.user.firstName &&
          updates.lastName === data.user.lastName
        ) {
          enqueueSnackbar('No changes.');
          setIsEditOpen(false);
          return;
        }

        await updateUser({
          variables: {
            id: data.user.id,
            updates,
          },
        });

        enqueueSnackbar('The user was updated.', {
          variant: 'success',
        });
        setIsEditOpen(false);
      } catch (e) {
        enqueueSnackbar('The user could not be updated.', {
          variant: 'error',
        });
      }
    },
    [data, enqueueSnackbar, updateUser],
  );

  return (
    <Root>
      {loading && <LinearProgress />}
      <StyledContainer disableGutters maxWidth="md">
        {error && <p>Error :(</p>}
        {!loading && !error && (
          <React.Fragment>
            <StyledToolbar>
              <Box flex={1}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link color="inherit" component={ReachLink} to="/users">
                    Users
                  </Link>
                  <Typography color="textPrimary">
                    {data.user.firstName} {data.user.lastName}
                  </Typography>
                </Breadcrumbs>
              </Box>
              <IconButton onClick={handleEditButtonClick}>
                <EditIcon color="inherit" />
              </IconButton>
              <IconButton edge="end" onClick={handleDeleteButtonClick}>
                <DeleteIcon color="inherit" />
              </IconButton>
            </StyledToolbar>
            <Box paddingX={3}>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Typography>{data.user.email}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Typography>{data.user.firstName}</Typography>
                </FormControl>
              </Box>
              <Box paddingTop={3}>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Typography>{data.user.lastName}</Typography>
                </FormControl>
              </Box>
            </Box>
            <UserDelete
              isOpen={isDeleteOpen}
              onCancel={handleDeleteCancel}
              onDelete={handleDeleteDelete}
              user={data.user}
            />
            <UserEdit
              isOpen={isEditOpen}
              isSaving={updateUserLoading}
              onCancel={handleEditCancel}
              onSave={handleEditSave}
              user={data.user}
            />
          </React.Fragment>
        )}
      </StyledContainer>
    </Root>
  );
}
