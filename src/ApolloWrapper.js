import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';

import shared from './features/shared';

const { useAuth } = shared.hooks;

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      songs: {
        merge: true,
      },
    },
  },
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URI,
});

const resolvers = {
  Song: {
    description: () => 'A really nifty description of the song.',
  },
};

const typeDefs = gql`
  extend type Song {
    description: String
  }
`;

function ApolloWrapper(props) {
  const { token } = useAuth();

  const authLink = setContext((_, { headers, ...rest }) => {
    if (!token) return { headers, ...rest };

    return {
      ...rest,
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  const client = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
    resolvers,
    typeDefs,
  });

  return <ApolloProvider client={client} {...props} />;
}

export default ApolloWrapper;
