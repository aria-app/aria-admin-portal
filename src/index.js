import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import red from '@material-ui/core/colors/red';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import app from './features/app';

const { App } = app.components;

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

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
const theme = createMuiTheme({
  breakpoints: {
    values: {
      sm: 480,
      md: 768,
    },
  },
  palette: {
    primary: {
      light: '#9b9bf9',
      main: '#5944ff',
      dark: '#2f2a9b',
    },
    secondary: red,
  },
  typography: {
    fontFamily: 'Nunito, Helvetica, sans-serif',
  },
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <CssBaseline />
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
