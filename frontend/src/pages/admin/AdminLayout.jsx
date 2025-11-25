import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './admin.css';

const navItems = [
    { to: '/admin/fields', label: 'Quản Lý Sân Bóng' },
    { to: '/admin/users', label: 'Quản Lý Người Dùng' },
    { to: '/admin/employees', label: 'Quản Lý Nhân Viên' },
    { to: '/admin/bookings', label: 'Quản Lý Đặt Sân' }
];

function AdminLayout() {
    return (
        <div className="container admin-container">
            <nav className="sidebar">
                <div className="logo">
                    <h2>⚽ Admin Panel</h2>
                </div>
                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;