# Hướng dẫn sử dụng thư mục ảnh

## Cấu trúc thư mục

```
public/
└── images/
    ├── fields/          # Ảnh các sân bóng
    ├── hero/            # Ảnh background cho hero section
    ├── logo/            # Logo website
    └── icons/           # Icons và biểu tượng
```

## Cách sử dụng trong code

### 1. Trong React components:

```jsx
// Logo
<img src="/images/logo/logo.png" alt="Logo" />

// Ảnh sân bóng
<img src="/images/fields/field1.jpg" alt="Sân bóng" />

// Hero background
<img src="/images/hero/hero-bg.jpg" alt="Background" />

// Icons
<img src="/images/icons/player-icon.png" alt="Player" />
```

### 2. Trong CSS:

```css
.hero-section {
  background-image: url('/images/hero/hero-bg.jpg');
}
```

## Các loại ảnh cần thêm:

### fields/ (Ảnh sân bóng)
- field1.jpg, field2.jpg, field3.jpg, etc.
- Ảnh sân bóng cỏ nhân tạo
- Ảnh sân bóng cỏ tự nhiên
- Ảnh đường chạy
- Ảnh toàn cảnh sân

### hero/ (Ảnh background)
- hero-bg.jpg - Ảnh background trang chủ (người chơi bóng)

### logo/ (Logo)
- logo.png - Logo chính của website
- logo-white.png - Logo trắng (cho navbar tối)

### icons/ (Icons)
- player-icon.png - Icon người chơi bóng
- football-icon.png - Icon quả bóng
- field-icon.png - Icon sân bóng

## Định dạng ảnh được khuyến nghị:

- **Logo**: PNG với nền trong suốt, kích thước 200x60px
- **Ảnh sân bóng**: JPG, kích thước 800x600px hoặc 1200x800px
- **Hero background**: JPG, kích thước tối thiểu 1920x1080px
- **Icons**: PNG với nền trong suốt, kích thước 64x64px hoặc 128x128px

## Lưu ý:
- Tất cả ảnh nên được tối ưu hóa trước khi upload
- Sử dụng định dạng WebP nếu muốn hiệu suất tốt hơn
- Đặt tên file theo quy tắc: lowercase, dùng dấu gạch ngang (-) thay khoảng trắng
