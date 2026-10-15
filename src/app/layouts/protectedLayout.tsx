import { getCookie } from 'react-use-cookie';
import { Navigate, Outlet } from 'react-router';
import { UserContext } from '../useUser';
import { useContext } from 'react';

type ProtectedRouteProps = {
  redirectPath?: string;
};

export const ProtectedLayout = ({
  redirectPath = '/',
}: ProtectedRouteProps) => {
  const token = getCookie('API_TOKEN');
  const { user } = useContext(UserContext);

  if (!token || user?.type !== 'ADMIN') {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Outlet />
  );
};
