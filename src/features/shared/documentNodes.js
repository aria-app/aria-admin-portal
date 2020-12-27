import { gql } from '@apollo/client';

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

export const ME = gql`
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
