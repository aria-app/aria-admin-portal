import { gql } from '@apollo/client';

export const CREATE_SONG = gql`
  mutation CreateSong($options: CreateSongInput!) {
    createSong(options: $options) {
      song {
        id
      }
      success
    }
  }
`;

export const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id) {
      success
    }
  }
`;

export const GET_SONG = gql`
  query GetSong($id: ID!) {
    song(id: $id) {
      bpm
      dateModified
      description @client
      id
      measureCount
      name
    }
  }
`;

export const GET_SONGS = gql`
  query GetSongs(
    $limit: Int
    $page: Int
    $search: String
    $sort: String
    $sortDirection: String
    $userId: ID
  ) {
    songs(
      limit: $limit
      page: $page
      search: $search
      sort: $sort
      sortDirection: $sortDirection
      userId: $userId
    ) {
      data {
        dateModified
        id
        name
        trackCount
      }
      meta {
        currentPage
        itemsPerPage
        totalItemCount
      }
    }
  }
`;

export const UPDATE_SONG = gql`
  mutation UpdateSong($id: ID!, $updates: UpdateSongInput!) {
    updateSong(id: $id, updates: $updates) {
      song {
        bpm
        dateModified
        id
        measureCount
        name
      }
      success
    }
  }
`;
