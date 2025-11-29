import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './FieldDetailPage.css'

export default function FieldDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    note: ''
  })
  const [activeTab, setActiveTab] = useState('info')

  // Demo data
  const field = {
    id: 1,
    name: 'Sân bóng Trường Đại học Sư phạm Hà Nội',
    address: 'Số 136, Xuân Thủy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
    rating: 4.5,
    totalReviews: 123,
    openTime: '5h-23h30',
    totalFields: 5,
    price: '1.200.000đ',
    priceRange: '1.200.000đ',
    facilities: [
      { icon: '🚗', name: 'Bãi đỗ xe oto' },
      { icon: '🏍️', name: 'Bãi đỗ xe máy' },
      { icon: '☕', name: 'Căng tin' },
      { icon: '🚻', name: 'Trà đá' },
      { icon: '🚿', name: 'Đồ ăn' },
      { icon: '💧', name: 'Nước uống' },
      { icon: '👕', name: 'Xem 5 sân' }
    ],
    images: [
      '/images/fields/placeholder.svg',
      '/images/fields/placeholder.svg',
      '/images/fields/placeholder.svg',
      '/images/fields/placeholder.svg'
    ],
    description: `
      - Số lượng sân: 1 sân 11 người, 4 sân 5
      - Kích Thước sân: 1 Sân Dài (100m Ngang (65m), 4 Sân Dài (40m Ngang (20m)
      - Tổng diện tích: 6500m2
      - Tình trạng kinh doanh: Tốt
    `
  }

  const timeSlots = [
    { day: 'T7', date: '18/10/2025', times: [
      { time: '14:00 - 15:30', price: '1200K', available: true },
      { time: '15:30 - 17:00', price: '1200K', available: true },
      { time: '17:00 - 18:30', price: '1200K', available: true },
      { time: '18:30 - 20:00', price: '1200K', available: true },
      { time: '20:00 - 21:30', price: '1200K', available: true }
    ]},
    { day: 'CN', date: '19/10/2025', times: [
      { time: '14:00 - 15:30', price: '1200K', available: true },
      { time: '15:30 - 17:00', price: '1200K', available: false },
      { time: '17:00 - 18:30', price: '1200K', available: true },
      { time: '18:30 - 20:00', price: '1200K', available: true },
      { time: '20:00 - 21:30', price: '1200K', available: true }
    ]},
    { day: 'T2', date: '20/10/2025', times: [
      { time: '14:00 - 15:30', price: '1200K', available: true },
      { time: '15:30 - 17:00', price: '1200K', available: true },
      { time: '17:00 - 18:30', price: '1200K', available: true },
      { time: '18:30 - 20:00', price: '1200K', available: true },
      { time: '20:00 - 21:30', price: '1200K', available: true }
    ]},
    { day: 'T3', date: '21/10/2025', times: [
      { time: '14:00 - 15:30', price: '1200K', available: true },
      { time: '15:30 - 17:00', price: '1200K', available: true },
      { time: '17:00 - 18:30', price: '1200K', available: true },
      { time: '18:30 - 20:00', price: '1200K', available: true },
      { time: '20:00 - 21:30', price: '1200K', available: true }
    ]}
  ]

  const reviews = [
    { id: 1, user: 'Nguyễn Văn A', rating: 5, date: '15/10/2025', comment: 'Sân đẹp, cỏ tốt, giá cả hợp lý' },
    { id: 2, user: 'Trần Thị B', rating: 4, date: '12/10/2025', comment: 'Sân rộng, thoáng mát, nhân viên nhiệt tình' },
    { id: 3, user: 'Lê Văn C', rating: 5, date: '10/10/2025', comment: 'Sân chất lượng, vị trí thuận tiện' }
  ]

  const handleTimeSelect = (dayIndex, timeSlot) => {
    if (timeSlot.available) {
      setSelectedTime({ dayIndex, timeSlot })
    }
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedTime) {
      alert('Vui lòng chọn khung giờ đặt sân')
      return
    }

    console.log('Booking:', {
      field: field.name,
      date: timeSlots[selectedTime.dayIndex].date,
      time: selectedTime.timeSlot.time,
      ...bookingForm
    })

    alert('Đặt sân thành công! Chúng tôi sẽ liên hệ với bạn sớm.')
    navigate('/user')
  }

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="field-detail-page">
      <Navbar />
      
      <div className="field-detail-container">
        {/* Header */}
        <div className="field-header">
          <div className="field-header-left">
            <h1>{field.name}</h1>
            <p className="field-address">
              📍 {field.address}
            </p>
          </div>
          <div className="field-header-right">
            <div className="field-rating">
              <span className="rating-score">Đánh giá: {field.rating}</span>
              <span className="rating-stars">⭐ ({field.totalReviews} Đánh giá)</span>
            </div>
            <div className="field-actions">
              <button className="action-btn">🔗</button>
              <button className="action-btn">❤️</button>
              <button className="action-btn">⚠️</button>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        <div className="field-gallery">
          <div className="gallery-main">
            <img src={field.images[0]} alt={field.name} />
          </div>
          <div className="gallery-grid">
            {field.images.slice(1).map((img, index) => (
              <div key={index} className="gallery-item">
                <img src={img} alt={`${field.name} ${index + 2}`} />
                {index === 2 && <div className="gallery-more">Xem 5 sân</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="field-content">
          {/* Left Column - Booking Form */}
          <div className="field-booking-section">
            <h2>Đặt sân theo yêu cầu</h2>
            
            <form onSubmit={handleBookingSubmit} className="booking-detail-form">
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleFormChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleFormChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleFormChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Chọn ngày</label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Lịch giờ</label>
                <select id="time" required>
                  <option value="">--:-- --</option>
                  <option value="morning">Sáng (6h - 12h)</option>
                  <option value="afternoon">Chiều (12h - 18h)</option>
                  <option value="evening">Tối (18h - 23h)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="note">Ghi chú</label>
                <textarea
                  id="note"
                  name="note"
                  value={bookingForm.note}
                  onChange={handleFormChange}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-submit-booking">
                Gửi yêu cầu →
              </button>
            </form>

            {/* Time Slots Calendar */}
            <div className="time-slots-section">
              <div className="time-slots-header">
                <button className="nav-btn">←</button>
                <span>18/10/2025 - 24/10/2025</span>
                <button className="nav-btn">→</button>
                <div className="time-filters">
                  <button className="filter-btn">Khung sáng</button>
                  <button className="filter-btn active">Khung chiều</button>
                </div>
              </div>

              <div className="time-slots-grid">
                {timeSlots.map((day, dayIndex) => (
                  <div key={dayIndex} className="day-column">
                    <div className="day-header">
                      <div className="day-name">{day.day}</div>
                      <div className="day-date">{day.date}</div>
                    </div>
                    <div className="time-list">
                      {day.times.map((slot, slotIndex) => (
                        <button
                          key={slotIndex}
                          className={`time-slot ${!slot.available ? 'booked' : ''} ${
                            selectedTime?.dayIndex === dayIndex && 
                            selectedTime?.timeSlot.time === slot.time ? 'selected' : ''
                          }`}
                          onClick={() => handleTimeSelect(dayIndex, slot)}
                          disabled={!slot.available}
                        >
                          <div className="time-range">{slot.time}</div>
                          <div className="time-price">{slot.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Reviews */}
          <div className="field-info-section">
            {/* Thông tin sân */}
            <div className="info-card">
              <h3>Thông tin sân</h3>
              <div className="info-row">
                <span>Giờ mở cửa:</span>
                <strong>{field.openTime}</strong>
              </div>
              <div className="info-row">
                <span>Số sân thi đấu:</span>
                <strong>{field.totalFields} Sân</strong>
              </div>
              <div className="info-row">
                <span>Giá sân:</span>
                <strong>{field.price}</strong>
              </div>
              <div className="info-row">
                <span>Giá sân giờ vàng:</span>
                <strong>{field.priceRange}</strong>
              </div>
            </div>

            {/* Dịch vụ tiện ích */}
            <div className="facilities-card">
              <h3>Dịch vụ tiện ích</h3>
              <div className="facilities-grid">
                {field.facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    <span className="facility-icon">{facility.icon}</span>
                    <span className="facility-name">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-section">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Thông tin
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Đánh giá
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === 'info' && (
                  <div className="info-content">
                    <h4>Thông tin chung về Sân bóng Trường Đại học Sư phạm Hà Nội</h4>
                    <pre>{field.description}</pre>
                    <p>Lưu ý nhập sân: Có nhắc trước sân bóng SPA-5P146002</p>
                    <p>Sân được vệ nhân viên liên hệ bảng trước khi đến bởng ông địa điểm thường đặc như học Sư-Phạm Hà Nội</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="rating-big">5.0</div>
                        <div className="rating-stars-display">⭐⭐⭐⭐⭐</div>
                      </div>
                      <div className="rating-breakdown">
                        {[5, 4, 3, 2, 1].map(star => (
                          <div key={star} className="rating-bar">
                            <span>{star} ⭐</span>
                            <div className="bar">
                              <div className="bar-fill" style={{width: star === 5 ? '100%' : '0%'}}></div>
                            </div>
                            <span>{star === 5 ? '100%' : '0%'}</span>
                          </div>
                        ))}
                      </div>
                      <button className="btn-write-review">Đánh giá và nhận xét</button>
                    </div>

                    <div className="reviews-list">
                      <h4>Gửi nhận xét của bạn</h4>
                      <p>Đánh giá của bạn về sản phẩm này:</p>
                      <div className="review-form">
                        <div className="star-rating-input">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="star">⭐</span>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Nhận xét của bạn về sản phẩm này"
                          rows="4"
                        />
                        <button className="btn-submit-review">Gửi đánh giá</button>
                      </div>
                    </div>

                    {reviews.length > 0 && (
                      <div className="existing-reviews">
                        <h4>Đánh giá từ khách hàng</h4>
                        {reviews.map(review => (
                          <div key={review.id} className="review-item">
                            <div className="review-header">
                              <strong>{review.user}</strong>
                              <div className="review-rating">
                                {'⭐'.repeat(review.rating)}
                              </div>
                            </div>
                            <div className="review-date">{review.date}</div>
                            <div className="review-comment">{review.comment}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}