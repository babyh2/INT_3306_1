import React, { useState } from 'react';

const initialUsers = [
    { id: 1, name: 'Nguyễn Văn An', email: 'nguyenvanan@email.com', phone: '0901234567' },
    { id: 2, name: 'Trần Thị Bình', email: 'tranbinhn@email.com', phone: '0912345678' },
    { id: 3, name: 'Lê Văn Cường', email: 'levancuong@email.com', phone: '0923456789' },
    { id: 4, name: 'Phạm Thị Dung', email: 'phamthidung@email.com', phone: '0934567890' },
    { id: 5, name: 'Hoàng Văn Em', email: 'hoangvanem@email.com', phone: '0945678901' },
    { id: 6, name: 'Vũ Thị Hoa', email: 'vuthihoa@email.com', phone: '0956789012' }
];

function UserManagementPage() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    const deleteUser = (name) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng ${name}?`)) {
            setUsers(users.filter(u => u.name !== name));
            alert(`Đã xóa người dùng ${name}`);
        }
    };

    const viewUserInfo = (user) => {
        alert(`Thông tin người dùng: ${user.name}\n\nEmail: ${user.email}\nSĐT: ${user.phone}\nSố lượt đặt: 15 lượt`);
    };

    const addUser = () => {
        const name = window.prompt('Tên người dùng:');
        const email = window.prompt('Email:');
        const phone = window.prompt('SĐT:');
        if (name && email && phone) {
            setUsers([...users, { id: Date.now(), name, email, phone }]);
            alert('Đã thêm người dùng');
        }
    };

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Người Dùng</h1>
                <button className="btn-primary" onClick={addUser}>+ Thêm Người Dùng</button>
            </header>
            <div className="stats-container">
                <div className="stat-card"><h3>Tổng Người Dùng</h3><p className="stat-number">{users.length}</p></div>
                <div className="stat-card"><h3>Hoạt Động</h3><p className="stat-number">{Math.max(users.length - 40, 0) + 40}</p></div>
                <div className="stat-card"><h3>Mới (Tháng)</h3><p className="stat-number">23</p></div>
            </div>
            <div className="search-bar">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm người dùng..." />
            </div>
            <div className="list-container">
                {filtered.map(user => (
                    <div className="list-item" key={user.id}>
                        <div className="item-info">
                            <h3>{user.name}</h3>
                            <p>Email: {user.email} | SĐT: {user.phone}</p>
                        </div>
                        <div className="item-actions">
                            <button className="btn-menu" onClick={(e) => { const m = e.currentTarget.nextElementSibling; m.classList.toggle('show'); }}>⋮</button>
                            <div className="dropdown-menu">
                                <a href="#" onClick={(e) => { e.preventDefault(); viewUserInfo(user); }}>👤 Xem thông tin</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); deleteUser(user.name); }}>🗑️ Xóa người dùng</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default UserManagementPage;