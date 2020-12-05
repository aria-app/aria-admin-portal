import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';

function ApolloWrapper(props) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [bearerToken, setBearerToken] = useState('');
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_URI,
  });

  useEffect(() => {
    const getToken = async () => {
      const token = isAuthenticated ? await getAccessTokenSilently() : '';
      setBearerToken(token);
    };
    getToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  const authLink = setContext((arg1, { headers, ...rest }) => {
    if (!bearerToken) return { headers, ...rest };
    return {
      ...rest,
      headers: {
        ...headers,
        authorization: `Bearer: ${bearerToken}`,
      },
    };
  });

  const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          songs: {
            merge: true,
          },
        },
      },
    }),
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

  return <ApolloProvider client={client} {...props} />;
}

export default ApolloWrapper;
