import React, { useState } from 'react';

const initialFields = [
    { id: 1, name: 'Sân Bóng Thiên Long', address: '123 Đường Nguyễn Văn A, Quận 1' },
    { id: 2, name: 'Sân Bóng Hoàng Gia', address: '456 Đường Lê Văn B, Quận 2' },
    { id: 3, name: 'Sân Bóng Phú Thọ', address: '789 Đường Trần Văn C, Quận 3' },
    { id: 4, name: 'Sân Bóng Đại Nam', address: '321 Đường Phan Văn D, Quận 4' },
    { id: 5, name: 'Sân Bóng Hòa Bình', address: '654 Đường Võ Văn E, Quận 5' }
];

function FieldManagementPage() {
    const [fields, setFields] = useState(initialFields);
    const [search, setSearch] = useState('');

    const filtered = fields.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    const deleteField = (name) => {
        if (window.confirm(`Bạn có chắc muốn xóa sân bóng ${name}?`)) {
            setFields(fields.filter(f => f.name !== name));
            alert(`Đã xóa sân bóng ${name}`);
        }
    };

    const editField = (name) => {
        const newName = window.prompt(`Nhập tên mới cho sân bóng ${name}:`, name);
        if (newName && newName !== name) {
            setFields(fields.map(f => f.name === name ? { ...f, name: newName } : f));
            alert(`Đã đổi tên sân bóng thành: ${newName}`);
        }
    };

    const viewRevenue = (name) => {
        alert(`Xem doanh thu của sân ${name}\n\nDoanh thu tháng này: 45,000,000 VNĐ\nLượt đặt: 120 lượt`);
    };

    const showAddModal = () => {
        const newName = window.prompt('Nhập tên sân bóng mới:');
        const newAddress = window.prompt('Nhập địa chỉ sân bóng:');
        if (newName && newAddress) {
            setFields([...fields, { id: Date.now(), name: newName, address: newAddress }]);
            alert('Đã thêm sân bóng mới');
        }
    };

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Sân Bóng</h1>
                <button className="btn-primary" onClick={showAddModal}>+ Thêm Sân Bóng</button>
            </header>
            <div className="stats-container">
                <div className="stat-card"><h3>Tổng Số Sân</h3><p className="stat-number">{fields.length}</p></div>
                <div className="stat-card"><h3>Sân Đang Hoạt Động</h3><p className="stat-number">{fields.length - 2}</p></div>
                <div className="stat-card"><h3>Sân Bảo Trì</h3><p className="stat-number">2</p></div>
            </div>
            <div className="search-bar">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm sân bóng..." />
            </div>
            <div className="list-container">
                {filtered.map(field => (
                    <div className="list-item" key={field.id}>
                        <div className="item-info">
                            <h3>{field.name}</h3>
                            <p>Địa chỉ: {field.address}</p>
                        </div>
                        <div className="item-actions">
                            <button className="btn-menu" onClick={(e) => {
                                const menu = e.currentTarget.nextElementSibling; menu.classList.toggle('show');
                            }}>⋮</button>
                            <div className="dropdown-menu">
                                <a href="#" onClick={(e) => { e.preventDefault(); deleteField(field.name); }}>🗑️ Xóa sân bóng</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); editField(field.name); }}>✏️ Thay đổi tên</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); viewRevenue(field.name); }}>💰 Quản lý doanh thu</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FieldManagementPage;