import { gql, useQuery } from '@apollo/client';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import styled from 'styled-components';

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

const GET_USERS = gql`
  query GetUsers {
    users {
      email
      id
      firstName
      lastName
    }
  }
`;

export default function Users() {
  const { data, error, loading } = useQuery(GET_USERS);

  const getFullName = React.useCallback(
    ({ firstName, lastName }) => `${firstName} ${lastName}`,
    [],
  );

  const handleUserClick = React.useCallback((user) => {
    // eslint-disable-next-line no-console
    console.log('Clicked user', user);
  }, []);

  return (
    <Root>
      {loading && <LinearProgress />}
      <StyledContainer disableGutters maxWidth="md">
        {error && <p>Error :(</p>}
        {!loading && !error && (
          <List>
            {data.users.map((user) => (
              <ListItem
                button
                key={user.id}
                onClick={() => handleUserClick(user)}
              >
                <ListItemText
                  primary={getFullName(user)}
                  secondary={user.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </StyledContainer>
    </Root>
  );
}
