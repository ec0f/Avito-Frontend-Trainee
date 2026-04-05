import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { publicRoutes } from '../routes';
import { ANNOUNCEMENTS_ROUTE } from '../utils/consts';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ANNOUNCEMENTS_ROUTE} replace />} />

      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      <Route path="*" element={<Navigate to={ANNOUNCEMENTS_ROUTE} replace />} />
    </Routes>
  );
};

export default AppRouter;
