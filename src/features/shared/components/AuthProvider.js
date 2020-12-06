import { useMutation } from '@apollo/client';
import React from 'react';

import AuthContext from '../contexts/AuthContext';
import { LOGIN } from '../documentNodes';

export default function AuthProvider(props) {
  const [loginMutation, { error, loading }] = useMutation(LOGIN);
  const [expiresAt, setExpiresAt] = React.useState();
  const [token, setToken] = React.useState();
  const [user, setUser] = React.useState();

  const handleLogin = React.useCallback(
    async ({ email, password }) => {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      console.log('login data', data);

      setExpiresAt(data.login.expiresAt);
      setToken(data.login.token);
      setUser(data.login.user);
    },
    [loginMutation, setExpiresAt, setToken, setUser],
  );

  React.useEffect(() => {
    window.localStorage.getItem('expiresAt');
  }, [setExpiresAt, setToken, setUser]);

  return (
    <AuthContext.Provider
      value={{
        error,
        expiresAt,
        loading,
        login: handleLogin,
        token,
        user,
      }}
      {...props}
    />
  );
}
