import { Redirect } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';

import shared from '../../shared';

const { useAuth } = shared.hooks;

export default function PrivateRoute(props) {
  const { component: Component, ...rest } = props;
  const { getIsAuthenticated, getIsSessionExpired } = useAuth();

  if (!getIsAuthenticated() || getIsSessionExpired()) {
    return <Redirect noThrow to="/login" />;
  }

  return <Component {...rest} />;
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
};
