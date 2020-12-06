import React from 'react';

import AuthContext from '../contexts/AuthContext';

export default function AuthProvider(props) {
  const [expiresAt, setExpiresAt] = React.useState();
  const [token, setToken] = React.useState();
  const [user, setUser] = React.useState();

  const isAuthenticated = React.useMemo(() => {
    if (!token || !expiresAt) {
      return false;
    }

    return new Date().getTime() / 1000 < expiresAt;
  }, [expiresAt, token]);

  const logout = React.useCallback(() => {
    setExpiresAt(null);
    setToken(null);
    setUser(null);
    window.localStorage.removeItem('expiresAt');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  }, [setExpiresAt, setToken, setUser]);

  const setAuthState = React.useCallback(
    (data) => {
      setExpiresAt(data.expiresAt);
      setToken(data.token);
      setUser(data.user);
      window.localStorage.setItem('expiresAt', data.expiresAt);
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('user', JSON.stringify(data.user));
    },
    [setExpiresAt, setToken, setUser],
  );

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
        expiresAt,
        isAuthenticated,
        logout,
        setAuthState,
        token,
        user,
      }}
      {...props}
    />
  );
}
