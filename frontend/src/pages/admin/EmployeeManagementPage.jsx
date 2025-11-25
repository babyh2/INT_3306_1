import React, { useState } from 'react';

const initialEmployees = [
    { id: 1, name: 'Đỗ Văn Khoa', role: 'Quản lý sân', phone: '0967890123' },
    { id: 2, name: 'Bùi Thị Mai', role: 'Lễ tân', phone: '0978901234' },
    { id: 3, name: 'Ngô Văn Nam', role: 'Bảo vệ', phone: '0989012345' },
    { id: 4, name: 'Đinh Thị Oanh', role: 'Kế toán', phone: '0990123456' },
    { id: 5, name: 'Lý Văn Phúc', role: 'Bảo trì', phone: '0901234560' }
];

function EmployeeManagementPage() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [search, setSearch] = useState('');

    const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

    const deleteEmployee = (name) => {
        if (window.confirm(`Bạn có chắc muốn xóa nhân viên ${name}?`)) {
            setEmployees(employees.filter(e => e.name !== name));
            alert(`Đã xóa nhân viên ${name}`);
        }
    };

    const viewEmployeeInfo = (e) => {
        alert(`Thông tin nhân viên: ${e.name}\n\nChức vụ: ${e.role}\nSố điện thoại: ${e.phone}\nNgày vào làm: 01/01/2023`);
    };
    const viewWorkTime = (e) => {
        alert(`Thời gian làm việc của ${e.name}\n\nCa làm: 08:00 - 17:00\nNgày làm việc: Thứ 2 - Thứ 6\nTổng giờ tháng này: 176 giờ`);
    };
    const viewSalary = (e) => {
        alert(`Mức lương của ${e.name}\n\nLương cơ bản: 8,000,000 VNĐ\nPhụ cấp: 1,500,000 VNĐ\nTổng lương: 9,500,000 VNĐ`);
    };
    const addEmployee = () => {
        const name = window.prompt('Tên nhân viên:');
        const role = window.prompt('Chức vụ:');
        const phone = window.prompt('SĐT:');
        if (name && role && phone) {
            setEmployees([...employees, { id: Date.now(), name, role, phone }]);
            alert('Đã thêm nhân viên');
        }
    };

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Nhân Viên</h1>
                <button className="btn-primary" onClick={addEmployee}>+ Thêm Nhân Viên</button>
            </header>
            <div className="stats-container">
                <div className="stat-card"><h3>Tổng Nhân Viên</h3><p className="stat-number">{employees.length}</p></div>
                <div className="stat-card"><h3>Đang Làm</h3><p className="stat-number">{employees.length - 3}</p></div>
                <div className="stat-card"><h3>Tổng Lương (Tháng)</h3><p className="stat-number">185</p><span style={{ fontSize: '0.8em', color: '#FFC107' }}>triệu VNĐ</span></div>
            </div>
            <div className="search-bar">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm nhân viên..." />
            </div>
            <div className="list-container">
                {filtered.map(emp => (
                    <div className="list-item" key={emp.id}>
                        <div className="item-info">
                            <h3>{emp.name}</h3>
                            <p>Chức vụ: {emp.role} | SĐT: {emp.phone}</p>
                        </div>
                        <div className="item-actions">
                            <button className="btn-menu" onClick={(e) => { const m = e.currentTarget.nextElementSibling; m.classList.toggle('show'); }}>⋮</button>
                            <div className="dropdown-menu">
                                <a href="#" onClick={(e) => { e.preventDefault(); viewEmployeeInfo(emp); }}>👤 Xem thông tin</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); viewWorkTime(emp); }}>⏰ Thời gian làm việc</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); viewSalary(emp); }}>💵 Mức lương</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); deleteEmployee(emp.name); }}>🗑️ Xóa nhân viên</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default EmployeeManagementPage;