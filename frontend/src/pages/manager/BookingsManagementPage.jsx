import React, { useState, useEffect } from 'react';
import { 
  getBookings, 
  approveBooking, 
  rejectBooking,
  completeBooking,
  cancelBooking
} from '../../services/managerApi';
import './BookingsManagementPage.css';

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await getBookings(filters);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    if (!confirm('Xác nhận duyệt đơn đặt sân này?')) return;
    
    try {
      await approveBooking(bookingId);
      alert('Đã duyệt đơn đặt sân thành công!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to approve booking:', err);
      alert('Có lỗi khi duyệt đơn đặt sân');
    }
  };

  const handleReject = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    try {
      await rejectBooking(selectedBooking.booking_id, rejectReason);
      alert('Đã từ chối đơn đặt sân!');
      setShowRejectModal(false);
      setRejectReason('');
      fetchBookings();
    } catch (err) {
      console.error('Failed to reject booking:', err);
      alert('Có lỗi khi từ chối đơn đặt sân');
    }
  };

  const handleComplete = async (bookingId) => {
    if (!confirm('Đánh dấu đơn này là đã hoàn thành?')) return;
    
    try {
      await completeBooking(bookingId);
      alert('Đã đánh dấu hoàn thành!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to complete booking:', err);
      alert('Có lỗi khi cập nhật trạng thái');
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = prompt('Lý do hủy đơn (tùy chọn):');
    if (reason === null) return;
    
    try {
      await cancelBooking(bookingId, reason);
      alert('Đã hủy đơn đặt sân!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Có lỗi khi hủy đơn');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      key: 'booking_id',
      label: 'ID',
      sortable: true,
      render: (value) => (
        <span className="badge badge-primary">#{value || 'N/A'}</span>
      )
    },
    {
      key: 'field_name',
      label: 'Sân',
      sortable: true,
      render: (value, row) => (
        <div className="field-info">
          <div className="field-name">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {value || 'N/A'}
          </div>
          <div className="field-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {row?.location || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'customer_name',
      label: 'Khách hàng',
      sortable: true,
      render: (value, row) => (
        <div className="customer-info">
          <div className="avatar">
            {(typeof value === 'string' && value.charAt(0).toUpperCase()) || '?'}
          </div>
          <div className="customer-details">
            <div className="customer-name">{value || 'N/A'}</div>
            <div className="customer-contact">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {row?.customer_phone || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'start_time',
      label: 'Thời gian',
      sortable: true,
      render: (value, row) => (
        <div className="time-info">
          <div className="time-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="time-label">Bắt đầu:</span>
            <span className="time-value">{value ? formatDateTime(value) : 'N/A'}</span>
          </div>
          <div className="time-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="time-label">Kết thúc:</span>
            <span className="time-value">{row?.end_time ? formatDateTime(row.end_time) : 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Giá',
      sortable: true,
      render: (value) => (
        <div className="price-info">
          <span className="price-value">{(value || 0).toLocaleString('vi-VN')}</span>
          <span className="price-currency">VNĐ</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          pending: { text: 'Chờ duyệt', class: 'badge-warning', icon: '⏳' },
          confirmed: { text: 'Đã duyệt', class: 'badge-info', icon: '✓' },
          completed: { text: 'Hoàn thành', class: 'badge-success', icon: '✓' },
          cancelled: { text: 'Đã hủy', class: 'badge-cancelled', icon: '✗' },
          rejected: { text: 'Từ chối', class: 'badge-danger', icon: '✗' }
        };
        const config = statusConfig[value] || { text: value || 'N/A', class: '', icon: '' };
        return (
          <span className={`badge ${config.class}`}>
            {config.icon} {config.text}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (value, row) => (
        <div className="action-buttons">
          {row?.status === 'pending' && (
            <>
              <ConfirmDialog
                title="Xác nhận duyệt"
                message="Bạn có chắc chắn muốn duyệt đơn đặt sân này?"
                onConfirm={() => handleApprove(row?.booking_id)}
                confirmText="Duyệt"
                cancelText="Hủy"
              >
                <button className="btn-action btn-approve">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Duyệt
                </button>
              </ConfirmDialog>
              <button 
                onClick={() => handleReject(row)}
                className="btn-action btn-reject"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Từ chối
              </button>
            </>
          )}
          {row?.status === 'confirmed' && (
            <>
              <ConfirmDialog
                title="Xác nhận hoàn thành"
                message="Đánh dấu đơn đặt sân này là đã hoàn thành?"
                onConfirm={() => handleComplete(row?.booking_id)}
                confirmText="Hoàn thành"
                cancelText="Hủy"
              >
                <button className="btn-action btn-complete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Hoàn thành
                </button>
              </ConfirmDialog>
              <ConfirmDialog
                title="Xác nhận hủy"
                message="Bạn có chắc chắn muốn hủy đơn đặt sân này?"
                onConfirm={() => handleCancel(row?.booking_id)}
                confirmText="Hủy đơn"
                cancelText="Không"
              >
                <button className="btn-action btn-cancel">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Hủy
                </button>
              </ConfirmDialog>
            </>
          )}
          {['completed', 'cancelled', 'rejected'].includes(row?.status) && (
            <span className="no-action">—</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>Quản lý đơn đặt sân</h1>
        <div className="filter-group">
          <label>Lọc theo trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="confirmed">Đã duyệt</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : bookings.length === 0 ? (
        <div className="no-data">Không có đơn đặt sân nào</div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sân</th>
                <th>Khách hàng</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>
                    <div className="field-info">
                      <strong>{booking.field_name}</strong>
                      <small>{booking.location}</small>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <strong>{booking.customer_name}</strong>
                      <small>{booking.customer_phone}</small>
                      <small>{booking.customer_email}</small>
                    </div>
                  </td>
                  <td>{formatDateTime(booking.start_time)}</td>
                  <td>{formatDateTime(booking.end_time)}</td>
                  <td className="price">{(booking.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="action-buttons">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(booking.booking_id)}
                            className="btn-approve"
                          >
                            ✓ Duyệt
                          </button>
                          <button 
                            onClick={() => handleReject(booking)}
                            className="btn-reject"
                          >
                            ✗ Từ chối
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <button 
                            onClick={() => handleComplete(booking.booking_id)}
                            className="btn-complete"
                          >
                            ✓ Hoàn thành
                          </button>
                          <button 
                            onClick={() => handleCancel(booking.booking_id)}
                            className="btn-cancel"
                          >
                            ✗ Hủy
                          </button>
                        </>
                      )}
                      {['completed', 'cancelled', 'rejected'].includes(booking.status) && (
                        <span className="no-action">Không có thao tác</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Từ chối đơn đặt sân</h2>
            <p>Lý do từ chối:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối (tùy chọn)..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={confirmReject} className="btn-confirm">
                Xác nhận từ chối
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-cancel-modal">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
