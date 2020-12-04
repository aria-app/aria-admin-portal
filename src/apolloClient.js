import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      songs: {
        merge: true,
      },
    },
  },
});

const httpLink = createHttpLink({ uri: process.env.REACT_APP_API_URI });
const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

export default new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
  resolvers: {
    Song: {
      description: () => 'A really nifty description of the song.',
    },
  },
  typeDefs: gql`
    extend type Song {
      description: String
    }
  `,
});
