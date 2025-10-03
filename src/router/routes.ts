import React from 'react';

// Public Pages
const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));

// Admin Pages
// const DashboardPage = React.lazy(() => import('../pages/admin/DashboardPage'));

export const publicRoutes = [
  {
    path: '/',
    element: LandingPage,
    exact: true,
  },
  {
    path: '/login',
    element: LoginPage,
    exact: true,
  },
  {
    path: '/register',
    element: RegisterPage,
    exact: true,
  },
];

export const privateRoutes = [
  // {
  //   path: '/admin/dashboard',
  //   element: DashboardPage,
  //   exact: true,
  // },
];
