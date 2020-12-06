import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      expiresAt
      success
      token
      user {
        email
        firstName
        id
        isAdmin
        lastName
      }
    }
  }
`;
