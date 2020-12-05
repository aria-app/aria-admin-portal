import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';

export default function PrivateRoute(props) {
  const { component: Component, ...rest } = props;
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect noThrow to="/sign-in" />;
  }

  return <Component {...rest} />;
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
};
