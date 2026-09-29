import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/common/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TicketListPage } from './pages/TicketListPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { EditTicketPage } from './pages/EditTicketPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { ROLES } from './utils/constants';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
