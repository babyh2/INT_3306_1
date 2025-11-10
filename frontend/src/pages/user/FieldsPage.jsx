import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './FieldsPage.css'

export default function FieldsPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const categories = [
    { id: 'all', name: 'Tất cả', count: 50, icon: '⚽' },
    { id: 'football', name: 'Bóng đá', count: 50, icon: '⚽' },
    { id: 'tennis', name: 'Tennis', count: 10, icon: '🎾' },
    { id: 'pickleball', name: 'Pickleball', count: 8, icon: '🏓' },
    { id: 'badminton', name: 'Cầu lông', count: 12, icon: '🏸' },
    { id: 'basketball', name: 'Bóng rổ', count: 15, icon: '🏀' },
    { id: 'volleyball', name: 'Bóng chuyền', count: 20, icon: '🏐' }
  ]

  const fields = [
    {
      id: 1,
      name: 'Sân bóng Trường Đại học Sư phạm Hà Nội',
      image: '/images/fields/placeholder.svg',
      location: 'Xuân Thủy, Cầu Giấy, Hà Nội',
      price: '1.200.000đ',
      pricePerHour: 1200000,
      rating: 4.8,
      reviews: 245,
      type: 'Sân 11 người',
      facilities: ['Bãi đỗ xe', 'Căng tin', 'Đèn chiếu sáng'],
      openTime: '5h - 23h30',
      distance: '2.5km',
      isOpen: true,
      discount: '10%'
    },
    {
      id: 2,
      name: 'Sân bóng Anh Duy',
      image: '/images/fields/placeholder.svg',
      location: 'Huyện Cần Giờ, TP Hồ Chí Minh',
      price: '800.000đ',
      pricePerHour: 800000,
      rating: 4.5,
      reviews: 128,
      type: 'Sân 7 người',
      facilities: ['Bãi đỗ xe', 'Nước uống'],
      openTime: '6h - 22h',
      distance: '5.2km',
      isOpen: true
    },
    {
      id: 3,
      name: 'Sân bóng Đông Hải',
      image: '/images/fields/placeholder.svg',
      location: 'Quận 1, TP Hồ Chí Minh',
      price: '1.500.000đ',
      pricePerHour: 1500000,
      rating: 4.9,
      reviews: 320,
      type: 'Sân 11 người',
      facilities: ['Bãi đỗ xe', 'Căng tin', 'Phòng thay đồ', 'Đèn chiếu sáng'],
      openTime: '5h - 24h',
      distance: '1.8km',
      isOpen: true,
      featured: true
    },
    {
      id: 4,
      name: 'Sân bóng Minh Phương',
      image: '/images/fields/placeholder.svg',
      location: 'Hà Đông, Hà Nội',
      price: '600.000đ',
      pricePerHour: 600000,
      rating: 4.3,
      reviews: 89,
      type: 'Sân 5 người',
      facilities: ['Bãi đỗ xe', 'Nước uống'],
      openTime: '6h - 23h',
      distance: '7.5km',
      isOpen: false
    },
    {
      id: 5,
      name: 'Sân bóng Thành Công',
      image: '/images/fields/placeholder.svg',
      location: 'Ba Đình, Hà Nội',
      price: '1.000.000đ',
      pricePerHour: 1000000,
      rating: 4.7,
      reviews: 198,
      type: 'Sân 7 người',
      facilities: ['Bãi đỗ xe', 'Căng tin', 'Phòng thay đồ'],
      openTime: '5h - 23h',
      distance: '3.2km',
      isOpen: true
    },
    {
      id: 6,
      name: 'Sân bóng Hoàng Mai',
      image: '/images/fields/placeholder.svg',
      location: 'Hoàng Mai, Hà Nội',
      price: '700.000đ',
      pricePerHour: 700000,
      rating: 4.4,
      reviews: 156,
      type: 'Sân 5 người',
      facilities: ['Bãi đỗ xe', 'Đèn chiếu sáng'],
      openTime: '6h - 22h30',
      distance: '6.1km',
      isOpen: true
    }
  ]

  return (
    <div className="fields-page">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="fields-hero">
        <div className="fields-hero-content">
          <h1>Tìm sân bóng phù hợp với bạn</h1>
          <p>Hơn 50+ sân bóng chất lượng cao trên toàn quốc</p>
          
          {/* Search Bar */}
          <div className="fields-search-bar">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sân, địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Tất cả giá</option>
              <option value="low">Dưới 500k</option>
              <option value="medium">500k - 1tr</option>
              <option value="high">Trên 1tr</option>
            </select>
            <button className="search-btn">Tìm kiếm</button>
          </div>
        </div>
      </div>

      <div className="fields-container">
        {/* Sidebar */}
        <aside className="fields-sidebar">
          <div className="sidebar-section">
            <h3>Loại sân</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Tiện ích</h3>
            <div className="facilities-filter">
              <label className="facility-checkbox">
                <input type="checkbox" />
                <span>Bãi đỗ xe</span>
              </label>
              <label className="facility-checkbox">
                <input type="checkbox" />
                <span>Căng tin</span>
              </label>
              <label className="facility-checkbox">
                <input type="checkbox" />
                <span>Phòng thay đồ</span>
              </label>
              <label className="facility-checkbox">
                <input type="checkbox" />
                <span>Đèn chiếu sáng</span>
              </label>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Đánh giá</h3>
            <div className="rating-filter">
              <label className="rating-option">
                <input type="radio" name="rating" />
                <span>⭐⭐⭐⭐⭐ 5 sao</span>
              </label>
              <label className="rating-option">
                <input type="radio" name="rating" />
                <span>⭐⭐⭐⭐ 4 sao trở lên</span>
              </label>
              <label className="rating-option">
                <input type="radio" name="rating" />
                <span>⭐⭐⭐ 3 sao trở lên</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="fields-main">
          <div className="fields-header">
            <div className="results-info">
              <h2>Danh sách sân bóng</h2>
              <p>Tìm thấy {fields.length} sân bóng</p>
            </div>
            <div className="fields-controls">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="distance">Khoảng cách</option>
              </select>
              <div className="view-toggle">
                <button className="view-btn active">
                  <span>☷</span>
                </button>
                <button className="view-btn">
                  <span>☰</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="fields-grid">
            {fields.map(field => (
              <div key={field.id} className={`field-card ${field.featured ? 'featured' : ''}`}>
                {field.featured && <div className="featured-badge">⭐ Nổi bật</div>}
                {field.discount && <div className="discount-badge">-{field.discount}</div>}
                
                <div className="field-image">
                  <img src={field.image} alt={field.name} />
                  <div className="field-status">
                    <span className={`status-badge ${field.isOpen ? 'open' : 'closed'}`}>
                      {field.isOpen ? '● Đang mở cửa' : '● Đã đóng cửa'}
                    </span>
                  </div>
                  <button className="favorite-btn">
                    ❤️
                  </button>
                </div>

                <div className="field-content">
                  <div className="field-header-info">
                    <h3>{field.name}</h3>
                    <div className="field-rating">
                      <span className="rating-score">⭐ {field.rating}</span>
                      <span className="rating-count">({field.reviews})</span>
                    </div>
                  </div>

                  <div className="field-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{field.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⏰</span>
                      <span>{field.openTime}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🏟️</span>
                      <span>{field.type}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📏</span>
                      <span>{field.distance}</span>
                    </div>
                  </div>

                  <div className="field-facilities">
                    {field.facilities.slice(0, 3).map((facility, index) => (
                      <span key={index} className="facility-tag">
                        {facility}
                      </span>
                    ))}
                    {field.facilities.length > 3 && (
                      <span className="facility-more">+{field.facilities.length - 3}</span>
                    )}
                  </div>

                  <div className="field-footer">
                    <div className="field-price">
                      <span className="price-label">Giá từ</span>
                      <span className="price-value">{field.price}</span>
                      <span className="price-unit">/giờ</span>
                    </div>
                    <button 
                      className="btn-book"
                      onClick={() => navigate(`/user/fields/${field.id}`)}
                    >
                      Đặt sân ngay →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="page-btn" disabled>← Trước</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">10</button>
            <button className="page-btn">Sau →</button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}