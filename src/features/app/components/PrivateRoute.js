import { Redirect } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';

import shared from '../../shared';

const { useAuth } = shared.hooks;

export default function PrivateRoute(props) {
  const { component: Component, ...rest } = props;
  const { getIsAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!getIsAuthenticated()) {
    return <Redirect noThrow to="/login" />;
  }

  return <Component {...rest} />;
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
};
