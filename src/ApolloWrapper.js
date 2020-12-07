import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import React from 'react';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      songs: {
        merge: true,
      },
    },
  },
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
  const client = new ApolloClient({
    cache,
    link: new HttpLink({
      uri: process.env.REACT_APP_API_URI,
    }),
    resolvers,
    typeDefs,
  });

  return <ApolloProvider client={client} {...props} />;
}

export default ApolloWrapper;
