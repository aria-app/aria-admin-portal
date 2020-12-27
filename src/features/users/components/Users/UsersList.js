import { useApolloClient } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { PropTypes } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import * as documentNodes from '../../documentNodes';

const Root = styled.div({
  flex: 1,
  overflowY: 'auto',
});

export default function UsersList(props) {
  const apolloClient = useApolloClient();
  const { error, loading, onUserClick, users } = props;

  const handleUserClick = React.useCallback(
    (user) => {
      onUserClick(user);
    },
    [onUserClick],
  );

  return (
    <Root>
      {loading && <LinearProgress />}
      {error && <p>Error :(</p>}
      {!loading && !error && (
        <List style={{ overflowY: 'auto' }}>
          {users.map((user) => (
            <ListItem
              button
              key={user.id}
              onClick={() => handleUserClick(user)}
              onMouseOver={async () => {
                try {
                  await apolloClient.query({
                    query: documentNodes.GET_USER,
                    variables: { id: user.id },
                  });
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e);
                }
              }}
            >
              <ListItemText
                primary={`${user.firstName} ${user.lastName}`}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Root>
  );
}

UsersList.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  onUserClick: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.object),
};
