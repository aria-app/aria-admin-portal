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

export const DELETE_TRACK = gql`
  mutation DeleteTrack($id: ID!) {
    deleteTrack(id: $id) {
      success
    }
  }
`;

export const GET_SEQUENCE = gql`
  query GetSequence($id: ID!) {
    sequence(id: $id) {
      id
      measureCount
      notes {
        id
        points {
          x
          y
        }
      }
      position
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
      tracks {
        id
        position
        voice {
          name
        }
      }
      user {
        id
        email
        firstName
        lastName
      }
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

export const GET_TRACK = gql`
  query GetTrack($id: ID!) {
    track(id: $id) {
      id
      position
      sequences {
        id
        measureCount
        position
      }
      song {
        id
        name
        user {
          id
        }
      }
      voice {
        id
        name
      }
      volume
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

export const UPDATE_TRACK = gql`
  mutation UpdateTrack($input: UpdateTrackInput!) {
    updateTrack(input: $input) {
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
