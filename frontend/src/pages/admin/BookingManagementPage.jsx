import React, { useState, useEffect } from 'react';
import { getAllBookings, getBookingById, updateBookingStatus, cancelBooking, getBookingStats } from '../../api/adminApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatsCard from '../../components/admin/StatsCard';
import Pagination from '../../components/admin/Pagination';
import { showSuccess, showError } from '../../components/admin/Toast';

function BookingManagementPage() {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, booking: null, action: null });

    useEffect(() => {
        fetchBookings();
        fetchStats();
    }, [currentPage, search, statusFilter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings({
                page: currentPage,
                limit: 10,
                search,
                status: statusFilter
            });
            setBookings(response.data.data.bookings);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            showError('Lỗi khi tải danh sách đặt sân');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getBookingStats();
            setStats(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewDetail = async (booking) => {
        try {
            const response = await getBookingById(booking.booking_id);
            setSelectedBooking(response.data.data);
            setIsDetailModalOpen(true);
        } catch (error) {
            showError('Lỗi khi tải chi tiết đặt sân');
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await updateBookingStatus(confirmDialog.booking.booking_id, status);
            showSuccess('Cập nhật trạng thái thành công');
            setConfirmDialog({ isOpen: false, booking: null, action: null });
            fetchBookings();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleCancel = async () => {
        try {
            await cancelBooking(confirmDialog.booking.booking_id);
            showSuccess('Hủy đặt sân thành công');
            setConfirmDialog({ isOpen: false, booking: null, action: null });
            fetchBookings();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fef3c7', color: '#92400e' };
            case 'confirmed': return { bg: '#dbeafe', color: '#1e40af' };
            case 'completed': return { bg: '#d1fae5', color: '#065f46' };
            case 'cancelled': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const columns = [
        { key: 'booking_id', label: 'ID', sortable: true },
        {
            key: 'customer',
            label: 'Khách hàng',
            render: (value) => value?.person_name || 'N/A'
        },
        {
            key: 'field',
            label: 'Sân',
            render: (value) => value?.field_name || 'N/A'
        },
        {
            key: 'booking_date',
            label: 'Ngày đặt',
            render: (value) => new Date(value).toLocaleDateString('vi-VN')
        },
        {
            key: 'total_price',
            label: 'Tổng tiền',
            render: (value) => `${Number(value).toLocaleString()} VNĐ`
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (value) => {
                const { bg, color } = getStatusColor(value);
                return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: bg, color }}>{getStatusText(value)}</span>;
            }
        }
    ];

    const actions = (booking) => (
        <>
            <button onClick={() => handleViewDetail(booking)} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>👁️ Xem</button>
            {booking.status === 'pending' && (
                <button onClick={() => setConfirmDialog({ isOpen: true, booking, action: 'confirm' })} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>✅</button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <button onClick={() => setConfirmDialog({ isOpen: true, booking, action: 'cancel' })} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>❌</button>
            )}
        </>
    );

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Đặt Sân</h1>
            </header>
            {stats && (
                <div className="stats-container">
                    <StatsCard title="Tổng đặt sân" value={stats.total} icon="📋" color="blue" />
                    <StatsCard title="Chờ xác nhận" value={stats.pending} icon="⏳" color="yellow" />
                    <StatsCard title="Đã xác nhận" value={stats.confirmed} icon="✅" color="green" />
                    <StatsCard title="Đã hoàn thành" value={stats.completed} icon="🏆" color="purple" />
                </div>
            )}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm đặt sân..." style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>
            <DataTable columns={columns} data={bookings} actions={actions} isLoading={loading} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {selectedBooking && (
                <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết đặt sân" size="large">
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                            <span style={{ fontWeight: '600' }}>Mã đặt sân:</span>
                            <span>#{selectedBooking.booking_id}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px' }}>
                            <span style={{ fontWeight: '600' }}>Khách hàng:</span>
                            <span>{selectedBooking.customer?.person_name} - {selectedBooking.customer?.phone}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                            <span style={{ fontWeight: '600' }}>Sân bóng:</span>
                            <span>{selectedBooking.field?.field_name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px' }}>
                            <span style={{ fontWeight: '600' }}>Ngày đặt:</span>
                            <span>{new Date(selectedBooking.booking_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                            <span style={{ fontWeight: '600' }}>Tổng tiền:</span>
                            <span style={{ color: '#10b981', fontWeight: '700' }}>{Number(selectedBooking.total_price).toLocaleString()} VNĐ</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px' }}>
                            <span style={{ fontWeight: '600' }}>Trạng thái:</span>
                            <span>{getStatusText(selectedBooking.status)}</span>
                        </div>
                        {selectedBooking.note && (
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                                <span style={{ fontWeight: '600' }}>Ghi chú:</span>
                                <span>{selectedBooking.note}</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, booking: null, action: null })}
                onConfirm={() => confirmDialog.action === 'confirm' ? handleUpdateStatus('confirmed') : handleCancel()}
                title={confirmDialog.action === 'confirm' ? 'Xác nhận đặt sân' : 'Hủy đặt sân'}
                message={confirmDialog.action === 'confirm' ? 'Bạn có chắc chắn muốn xác nhận đặt sân này?' : 'Bạn có chắc chắn muốn hủy đặt sân này?'}
                confirmText={confirmDialog.action === 'confirm' ? 'Xác nhận' : 'Hủy'}
                type={confirmDialog.action === 'confirm' ? 'info' : 'danger'}
            />
        </>
    );
}

export default BookingManagementPage;