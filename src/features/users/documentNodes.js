import { gql } from '@apollo/client';

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      email
      id
      firstName
      lastName
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers(
    $limit: Int
    $page: Int
    $search: String
    $sort: String
    $sortDirection: String
  ) {
    users(
      limit: $limit
      page: $page
      search: $search
      sort: $sort
      sortDirection: $sortDirection
    ) {
      data {
        email
        id
        firstName
        lastName
      }
      meta {
        currentPage
        itemsPerPage
        totalItemCount
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $updates: UpdateUserInput!) {
    updateUser(id: $id, updates: $updates) {
      user {
        email
        id
        firstName
        lastName
      }
      success
    }
  }
`;
