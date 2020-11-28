import React from 'react';

import UserContext from '../contexts/UserContext';

export default function useUser() {
  return React.useContext(UserContext);
}
