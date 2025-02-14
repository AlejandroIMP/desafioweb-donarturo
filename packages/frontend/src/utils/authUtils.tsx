import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { navigateByRole } from './loginUtils';
import { isAuthenticated, getUserRole } from './auth';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: number[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  if (!isAuthenticated()) return <Navigate to="/auth/login" />;
  if (roles && !roles.includes(Number(getUserRole()))) return <Navigate to="/" />;
  return children;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = localStorage.getItem('token');
  const role = Number(localStorage.getItem('role'));

  if (token) {
    const redirectPath = navigateByRole(role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};