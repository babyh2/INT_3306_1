import React, { useState } from 'react';

const initialBookings = [
    { id: 'booking1', customer: 'Nguyễn Văn An', phone: '0901234567', field: 'Sân Bóng Thiên Long', address: '123 Đường Nguyễn Văn A, Quận 1', date: '20/10/2025', time: '18:00 - 20:00 (2 giờ)', price: '400,000 VNĐ', status: 'Đã xác nhận' },
    { id: 'booking2', customer: 'Trần Thị Bình', phone: '0912345678', field: 'Sân Bóng Hoàng Gia', address: '456 Đường Lê Văn B, Quận 2', date: '21/10/2025', time: '16:00 - 18:00 (2 giờ)', price: '350,000 VNĐ', status: 'Chờ xác nhận' },
    { id: 'booking3', customer: 'Lê Văn Cường', phone: '0923456789', field: 'Sân Bóng Phú Thọ', address: '789 Đường Trần Văn C, Quận 3', date: '20/10/2025', time: '19:00 - 21:00 (2 giờ)', price: '450,000 VNĐ', status: 'Đã xác nhận' },
    { id: 'booking4', customer: 'Phạm Thị Dung', phone: '0934567890', field: 'Sân Bóng Đại Nam', address: '321 Đường Phan Văn D, Quận 4', date: '22/10/2025', time: '17:00 - 19:00 (2 giờ)', price: '380,000 VNĐ', status: 'Đã xác nhận' },
    { id: 'booking5', customer: 'Hoàng Văn Em', phone: '0945678901', field: 'Sân Bóng Hòa Bình', address: '654 Đường Võ Văn E, Quận 5', date: '19/10/2025', time: '18:00 - 20:00 (2 giờ)', price: '400,000 VNĐ', status: 'Đã hoàn thành' },
    { id: 'booking6', customer: 'Vũ Thị Hoa', phone: '0956789012', field: 'Sân Bóng Thiên Long', address: '123 Đường Nguyễn Văn A, Quận 1', date: '23/10/2025', time: '15:00 - 17:00 (2 giờ)', price: '350,000 VNĐ', status: 'Chờ xác nhận' }
];

function BookingManagementPage() {
    const [bookings, setBookings] = useState(initialBookings);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const filtered = bookings.filter(b => b.customer.toLowerCase().includes(search.toLowerCase()));

    const openModal = (booking) => setSelected(booking);
    const closeModal = () => setSelected(null);

    const confirmBooking = () => { alert('Đã xác nhận đặt sân!'); closeModal(); };
    const cancelBooking = () => { if (window.confirm('Bạn có chắc muốn hủy đặt sân này?')) { alert('Đã hủy đặt sân!'); closeModal(); } };
    const addBooking = () => { alert('Chức năng thêm đặt sân sẽ được triển khai'); };

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Đặt Sân</h1>
                <button className="btn-primary" onClick={addBooking}>+ Thêm Đặt Sân</button>
            </header>
            <div className="stats-container">
                <div className="stat-card"><h3>Tổng Lượt Đặt (Tháng)</h3><p className="stat-number">156</p></div>
                <div className="stat-card"><h3>Đặt Sân Hôm Nay</h3><p className="stat-number">8</p></div>
                <div className="stat-card"><h3>Doanh Thu (Tháng)</h3><p className="stat-number">89.5</p><span style={{ fontSize: '0.8em', color: '#FFC107' }}>triệu VNĐ</span></div>
            </div>
            <div className="search-bar">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm đặt sân..." />
            </div>
            <div className="bookings-container">
                {filtered.map(b => (
                    <div key={b.id} className="booking-card" onClick={() => openModal(b)}>
                        <div className="booking-header">
                            <h3>{b.customer}</h3>
                            <span className={`booking-status ${b.status === 'Đã xác nhận' ? 'status-confirmed' : b.status === 'Chờ xác nhận' ? 'status-pending' : b.status === 'Đã hoàn thành' ? 'status-completed' : ''}`}>{b.status}</span>
                        </div>
                        <div className="booking-info">
                            <p className="field-name">🏟️ {b.field}</p>
                            <p className="booking-date">📅 {b.date} - {b.time.split(' ')[0]} {b.time.includes('-') ? '' : b.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            {selected && (
                <div className="modal show" onClick={(e) => { if (e.target.classList.contains('modal')) closeModal(); }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>×</span>
                        <h2>Chi Tiết Đặt Sân</h2>
                        <div className="booking-details">
                            <div className="detail-row"><span className="detail-label">Người đặt:</span><span className="detail-value">{selected.customer}</span></div>
                            <div className="detail-row"><span className="detail-label">Số điện thoại:</span><span className="detail-value">{selected.phone}</span></div>
                            <div className="detail-row"><span className="detail-label">Sân bóng:</span><span className="detail-value">{selected.field}</span></div>
                            <div className="detail-row"><span className="detail-label">Địa chỉ sân:</span><span className="detail-value">{selected.address}</span></div>
                            <div className="detail-row"><span className="detail-label">Ngày đặt:</span><span className="detail-value">{selected.date}</span></div>
                            <div className="detail-row"><span className="detail-label">Khung giờ:</span><span className="detail-value">{selected.time}</span></div>
                            <div className="detail-row"><span className="detail-label">Giá sân:</span><span className="detail-value detail-price">{selected.price}</span></div>
                            <div className="detail-row"><span className="detail-label">Trạng thái:</span><span className="detail-value">{selected.status}</span></div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={confirmBooking}>Xác nhận</button>
                            <button className="btn-secondary" onClick={cancelBooking}>Hủy đặt sân</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BookingManagementPage;