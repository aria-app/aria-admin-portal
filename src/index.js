import { ApolloProvider } from '@apollo/client';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { globalHistory, LocationProvider, Router } from '@reach/router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { QueryParamProvider } from 'use-query-params';

import apolloClient from './apolloClient';
import app from './features/app';

const { App } = app.components;
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
          <LocationProvider>
            <Router>
              <QueryParamProvider path="/" reachHistory={globalHistory}>
                <App default />
              </QueryParamProvider>
            </Router>
          </LocationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
