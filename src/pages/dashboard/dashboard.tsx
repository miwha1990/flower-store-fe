import theme from '@/app/theme';
import { UserContext } from '@/app/useUser.ts';
import LogoDark from '@/assets/dark-logo.png';
import LogoLight from '@/assets/light-logo.png';
import OrdersTab from '@/pages/dashboard/components/OrdersTab.tsx';
import UsersTab from '@/pages/dashboard/components/UsersTab.tsx';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowBack from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListSharp from '@mui/icons-material/ListSharp';
import { useColorScheme } from '@mui/material/styles';
import type { Navigation, Router, Session } from '@toolpad/core/AppProvider';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { lazy, useContext, useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { removeCookie } from 'react-use-cookie';
import { SidebarFooter } from './components/SideBarFooter.tsx';

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
      return <OrdersTab />;
    case '/users':
      return <UsersTab />;
    default:
      return <Navigate to="/dashboard/flowers" replace />;
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
  const location = useLocation();
  const navigate = useNavigate();
  const pathname =
    location.pathname === '/dashboard'
      ? '/flowers'
      : location.pathname.startsWith('/dashboard/')
        ? location.pathname.slice('/dashboard'.length)
        : '/flowers';

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path, options) => {
        const destination = new URL(path, window.location.origin);
        const nextPath =
          destination.pathname === '/store'
            ? '/'
            : `/dashboard${destination.pathname}`;
        navigate(
          { pathname: nextPath, search: destination.search },
          { replace: options?.history === 'replace' }
        );
      },
    };
  }, [location.search, navigate, pathname]);

  const authentication = useMemo(() => {
    return {
      signIn: () => { },
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
      {location.pathname === '/dashboard' ? (
        <Navigate to="/dashboard/flowers" replace />
      ) : (
        <Layout pathname={pathname} />
      )}
    </AppProvider>
  );
}
