
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/administracion" />;
  }

  return <Outlet />;
};

export default AdminPage;
