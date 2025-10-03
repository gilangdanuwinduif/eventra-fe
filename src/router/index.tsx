import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
// import ProtectedRoute from './ProtectedRoute'; // Will be created later

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {publicRoutes.map((route: { path: string; element: React.LazyExoticComponent<React.FC>; exact: boolean }, index: number) => (
          <Route key={index} path={route.path} element={React.createElement(route.element)} />
        ))}
        {/* Private routes will go here */}
        {/* {privateRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute>
                {React.createElement(route.element)}
              </ProtectedRoute>
            }
          />
        ))} */}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
