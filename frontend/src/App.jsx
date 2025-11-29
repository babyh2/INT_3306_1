import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Toast from './components/admin/Toast'
import UserHomePage from './pages/user/UserHomePage.jsx'
import FieldsPage from './pages/user/FieldsPage.jsx'
import FieldDetailPage from './pages/user/FieldDetailPage.jsx'
import BookingPage from './pages/user/BookingPage.jsx'
import LoginPage from './pages/user/LoginPage.jsx'
import RegisterPage from './pages/user/RegisterPage.jsx'
// Admin imports
import AdminLayout from './pages/admin/AdminLayout.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import FieldManagementPage from './pages/admin/FieldManagementPage.jsx'
import UserManagementPage from './pages/admin/UserManagementPage.jsx'
import EmployeeManagementPage from './pages/admin/EmployeeManagementPage.jsx'
import BookingManagementPage from './pages/admin/BookingManagementPage.jsx'

function App() {
  return (
    <>
      <Toast />
      <Router>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<UserHomePage />} />
          <Route path="/user" element={<UserHomePage />} />
          <Route path="/user/fields" element={<FieldsPage />} />
          <Route path="/user/fields/:id" element={<FieldDetailPage />} />
          <Route path="/user/booking" element={<BookingPage />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/register" element={<RegisterPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="fields" element={<FieldManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="employees" element={<EmployeeManagementPage />} />
            <Route path="bookings" element={<BookingManagementPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App