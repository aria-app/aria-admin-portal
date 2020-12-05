import { gql, useQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import React from 'react';

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

export default function UserInfo() {
  const { data } = useQuery(ME);

  return <Typography>{data && data.user}</Typography>;
}
