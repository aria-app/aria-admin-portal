import React from 'react';

import UserContext from '../contexts/UserContext';

export default function UserProvider({ children, user }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
