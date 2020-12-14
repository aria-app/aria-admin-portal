import React from 'react';

import AuthContext from '../contexts/AuthContext';

export default function AuthProvider(props) {
  const [expiresAt, setExpiresAt] = React.useState();
  const [user, setUser] = React.useState();

  const clearAuthState = React.useCallback(() => {
    setExpiresAt(null);
    setUser(null);
    window.localStorage.removeItem('expiresAt');
    window.localStorage.removeItem('user');
  }, [setExpiresAt, setUser]);

  const getIsAuthenticated = React.useCallback(
    () => expiresAt && new Date().getTime() / 1000 < expiresAt,
    [expiresAt],
  );

  const setAuthState = React.useCallback(
    (data) => {
      setExpiresAt(data.expiresAt);
      setUser(data.user);
      window.localStorage.setItem('expiresAt', data.expiresAt);
      window.localStorage.setItem('user', JSON.stringify(data.user));
    },
    [setExpiresAt, setUser],
  );

  React.useEffect(() => {
    try {
      setExpiresAt(window.localStorage.getItem('expiresAt'));
      setUser(JSON.parse(window.localStorage.getItem('user')));
    } catch (e) {
      // eslint-disable-next-line
      console.error('Failed to load user.');
    }
  }, [setExpiresAt, setUser]);

  return (
    <AuthContext.Provider
      value={{
        clearAuthState,
        getIsAuthenticated,
        setAuthState,
        user,
      }}
      {...props}
    />
  );
}
