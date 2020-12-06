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

      setExpiresAt(data.login.expiresAt);
      setToken(data.login.token);
      setUser(data.login.user);
      window.localStorage.setItem('expiresAt', data.login.expiresAt);
      window.localStorage.setItem('token', data.login.token);
      window.localStorage.setItem('user', JSON.stringify(data.login.user));
    },
    [loginMutation, setExpiresAt, setToken, setUser],
  );

  const handleLogout = React.useCallback(() => {
    setExpiresAt(null);
    setToken(null);
    setUser(null);
    window.localStorage.removeItem('expiresAt');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  }, [setExpiresAt, setToken, setUser]);

  React.useEffect(() => {
    try {
      setExpiresAt(window.localStorage.getItem('expiresAt'));
      setToken(window.localStorage.getItem('token'));
      setUser(JSON.parse(window.localStorage.getItem('user')));
    } catch (e) {
      // eslint-disable-next-line
      console.error('Failed to load user.');
    }
  }, [setExpiresAt, setToken, setUser]);

  return (
    <AuthContext.Provider
      value={{
        error,
        expiresAt,
        loading,
        login: handleLogin,
        logout: handleLogout,
        token,
        user,
      }}
      {...props}
    />
  );
}
