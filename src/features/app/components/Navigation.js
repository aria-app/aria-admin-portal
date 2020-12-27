import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useLocation, useNavigate } from '@reach/router';
import React from 'react';

import shared from '../../shared';
import BottomNavigation from './BottomNavigation';
import Sidebar from './Sidebar';

const { useAuth } = shared.hooks;

export default function Navigation() {
  const isMediumOrAbove = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const filteredItems = React.useMemo(() => {
    const items = [
      { path: 'songs', isAdminOnly: false, text: 'Songs' },
      { path: 'users', isAdminOnly: true, text: 'Users' },
    ];

    return items.filter((item) => (user && user.isAdmin) || !item.isAdminOnly);
  }, [user]);

  const selectedPath = React.useMemo(
    () => (pathname === '/' ? 'songs' : pathname.slice(1)),
    [pathname],
  );

  const handleSelectedPathChange = React.useCallback(
    (path) => {
      if (path === selectedPath) return;

      navigate(`/${path}`);
    },
    [navigate, selectedPath],
  );

  const navProps = {
    items: filteredItems,
    onSelectedPathChange: handleSelectedPathChange,
    selectedPath,
  };

  return isMediumOrAbove ? (
    <Sidebar {...navProps} />
  ) : (
    <BottomNavigation {...navProps} />
  );
}
