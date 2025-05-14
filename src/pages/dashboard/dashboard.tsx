import { lazy, useMemo, useState, useContext } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListSharp from '@mui/icons-material/ListSharp';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { Navigation, Router, Session } from '@toolpad/core/AppProvider';
import theme from '@/app/theme';
import LogoDark from '@/assets/dark-logo.png';
import LogoLight from '@/assets/light-logo.png';
import { SidebarFooter } from './components/SideBarFooter.tsx';
import { UserContext } from '@/app/useUser.ts';
import { removeCookie } from 'react-use-cookie';
import { useColorScheme } from '@mui/material/styles';
import { Navigate } from 'react-router';

const FlowersTab = lazy(() => import('./components/FlowersTab.tsx'));

const NAVIGATION: Navigation = [
  {
    segment: 'flowers',
    title: 'Flowers',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ListSharp />,
  },
  {
    segment: 'users',
    title: 'Users',
    icon: <AccountCircle />,
  },
  {
    segment: 'store',
    title: 'Back to store',
    icon: <ArrowBack />,
  },
];

function PageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case '/flowers':
      return <FlowersTab />;
    case '/orders':
      return <h1>Orders</h1>;
    case '/users':
      return <h1>Users</h1>;
    default:
      return <Navigate to={'/'} replace />;
  }
}

function Layout({ pathname }: { pathname: string }) {
  const { mode } = useColorScheme();

  return (
    <DashboardLayout
      sx={{ background: mode === 'dark' ? '#2f2f2f' : '#ffefff' }}
      slots={{
        toolbarAccount: () => null,
        sidebarFooter: SidebarFooter,
        appTitle: () => (
          <img
            src={mode === 'dark' ? LogoDark : LogoLight}
            width="120"
            alt="logo"
          />
        ),
      }}
    >
      <PageContent pathname={pathname} />
    </DashboardLayout>
  );
}

export function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [pathname, setPathname] = useState('/flowers');
  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: () => {
        localStorage.removeItem('user');
        setUser(null);
        removeCookie('API_TOKEN');
        window.location.reload();
      },
    };
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={theme}
      authentication={authentication}
      session={user ? ({ user } as unknown as Session) : null}
    >
      <Layout pathname={pathname} />
    </AppProvider>
  );
}
