import { Redirect } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';

import shared from '../../shared';

const { useUser } = shared.hooks;

export default function PrivateRoute(props) {
  const { component: Component, ...rest } = props;
  const user = useUser();

  if (!user) {
    return <Redirect noThrow to="/sign-in" />;
  }

  return <Component {...rest} />;
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
};
