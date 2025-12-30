# Admin Images - Hình ảnh trang quản trị

Thư mục này chứa các hình ảnh SVG động được thiết kế để làm cho trang quản trị sinh động và hấp dẫn hơn.

## Danh sách hình ảnh

### Empty States (Trạng thái trống)
Các hình ảnh này được hiển thị khi không có dữ liệu trong bảng:

- **empty-users.svg** - Hiển thị khi chưa có người dùng nào
- **empty-bookings.svg** - Hiển thị khi chưa có đặt sân nào
- **empty-fields.svg** - Hiển thị khi chưa có sân bóng nào
- **empty-employees.svg** - Hiển thị khi chưa có nhân viên nào

### Loading States (Trạng thái tải)
- **loading-animation.svg** - Hình ảnh bóng đá nảy động khi đang tải dữ liệu

### Illustrations (Minh họa)
- **dashboard-illustration.svg** - Minh họa bảng điều khiển với biểu đồ động
- **welcome-banner.svg** - Banner chào mừng cho trang quản trị
- **success-celebration.svg** - Hình ảnh chúc mừng khi thao tác thành công

### Icons (Biểu tượng)
- **stat-icon-growth.svg** - Biểu tượng tăng trưởng cho thống kê
- **stat-icon-users.svg** - Biểu tượng người dùng động
- **icon-manager.svg** - Biểu tượng quản lý với vương miện
- **icon-search.svg** - Biểu tượng tìm kiếm động

## Đặc điểm

Tất cả các hình ảnh SVG đều có:
- ✨ **Animation (Hoạt ảnh)** - Các phần tử có hiệu ứng động mượt mà
- 🎨 **Gradient đẹp mắt** - Sử dụng gradient hiện đại
- 📱 **Responsive** - Tự động co giãn theo kích thước
- ⚡ **Nhẹ và nhanh** - File SVG nhẹ, tải nhanh
- 🎯 **Semantic** - Mỗi hình có ý nghĩa rõ ràng

## Cách sử dụng

Các hình ảnh được sử dụng tự động trong các component sau:

### DataTable Component
```jsx
<DataTable 
  emptyImage="/images/admin/empty-users.svg"
  emptyTitle="Chưa có người dùng"
  emptySubtitle="Hãy thêm người dùng mới"
/>
```

### Các trang đã được cập nhật:
- ✅ UserManagementPage - Header với gradient tím
- ✅ BookingManagementPage - Header với gradient xanh lá
- ✅ FieldManagementPage - Header với gradient xanh dương
- ✅ EmployeeManagementPage - Header với gradient vàng cam
- ✅ DashboardPage - Header với gradient tím và hình ảnh dashboard

## Màu sắc chủ đạo

- **Purple Gradient** (#667eea → #764ba2) - Users, Dashboard
- **Green Gradient** (#10b981 → #059669) - Bookings
- **Blue Gradient** (#3b82f6 → #1d4ed8) - Fields
- **Orange Gradient** (#f59e0b → #d97706) - Employees

## Tác giả
Được tạo với ❤️ để nâng cao trải nghiệm người dùng
