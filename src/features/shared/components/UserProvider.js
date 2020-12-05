import { gql, useQuery } from '@apollo/client';
import React from 'react';

import UserContext from '../contexts/UserContext';

const ME = gql`
  query Me {
    me {
      email
      firstName
      id
      isAdmin
      lastName
    }
  }
`;

export default function UserProvider(props) {
  const { data } = useQuery(ME);
  console.log('data', data);

  return <UserContext.Provider value={data ? data.me : null} {...props} />;
}
