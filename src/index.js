import { Auth0Provider } from '@auth0/auth0-react';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { globalHistory, LocationProvider, Router } from '@reach/router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { QueryParamProvider } from 'use-query-params';

import ApolloWrapper from './ApolloWrapper';
import app from './features/app';
import shared from './features/shared';

const { App } = app.components;
const { AuthProvider } = shared.components;

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
  <Auth0Provider
    audience={process.env.REACT_APP_AUTH_AUDIENCE}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
    domain={process.env.REACT_APP_AUTH_DOMAIN}
    redirectUri={window.location.origin}
  >
    <ApolloWrapper>
      <AuthProvider>
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
      </AuthProvider>
    </ApolloWrapper>
  </Auth0Provider>,
  document.getElementById('root'),
);
