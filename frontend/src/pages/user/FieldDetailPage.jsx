import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import ApiClient, { authAPI } from '../../services/api'
import { ChatWidgetContext } from '../../App'
import './FieldDetailPage.css'

export default function FieldDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chatWidgetRef = useContext(ChatWidgetContext)
  const [field, setField] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    note: ''
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [bookedSlots, setBookedSlots] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChatWithManager = () => {
    if (!authAPI.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để chat với manager. Chuyển đến trang đăng nhập?')) {
        navigate('/user/login')
      }
      return
    }

    if (!field?.manager_id) {
      alert('Sân này chưa có manager phụ trách')
      return
    }

    chatWidgetRef?.current?.openChatWithManager(field.manager_id)
  }

  useEffect(() => {
    const fetchField = async () => {
      setLoading(true)
      try {
        const res = await ApiClient.get(`/user/fields/${id}`)
        setField(res)
      } catch (err) {
        console.error(err)
        setError('Không thể tải thông tin sân bóng')
      } finally {
        setLoading(false)
      }
    }
    fetchField()
  }, [id])

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate || !field) return
    
    const fetchBookedSlots = async () => {
      try {
        // Fetch bookings for this field and date
        const res = await ApiClient.get(`/user/fields/${id}/bookings?date=${selectedDate}`)
        const bookings = Array.isArray(res) ? res : (res.data || [])
        setBookedSlots(bookings)
      } catch (err) {
        console.error('Error fetching bookings:', err)
        setBookedSlots([])
      }
    }
    
    fetchBookedSlots()
  }, [selectedDate, id, field])

  // Generate sample images if not available
  const getImages = () => {
    if (field?.images && field.images.length > 0) {
      return field.images
    }
    return [
      field?.image || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80'
    ]
  }

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 'undefined' || price === 'null') return 'Liên hệ'
    const priceStr = String(price).replace(/[^\d]/g, '')
    const numPrice = parseInt(priceStr)
    if (isNaN(numPrice) || numPrice === 0) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numPrice)
  }

  // Generate time slots for booking
  const generateTimeSlots = () => {
    if (!selectedDate) return []
    
    const times = [
      { label: 'Sáng sớm', time: '06:00 - 08:00', icon: '🌅' },
      { label: 'Buổi sáng', time: '08:00 - 10:00', icon: '☀️' },
      { label: 'Trưa', time: '10:00 - 12:00', icon: '🌤️' },
      { label: 'Chiều', time: '14:00 - 16:00', icon: '⛅' },
      { label: 'Chiều tối', time: '16:00 - 18:00', icon: '🌆' },
      { label: 'Tối', time: '18:00 - 20:00', icon: '🌙' },
      { label: 'Tối muộn', time: '20:00 - 22:00', icon: '🌃' }
    ]

    // Check if time slot is booked
    const isSlotBooked = (startTime, endTime) => {
      return bookedSlots.some(booking => {
        const bookingStart = new Date(booking.start_time).getTime()
        const bookingEnd = new Date(booking.end_time).getTime()
        const slotStart = new Date(`${selectedDate}T${startTime}`).getTime()
        const slotEnd = new Date(`${selectedDate}T${endTime}`).getTime()
        
        // Check if there's any overlap
        return (slotStart < bookingEnd && slotEnd > bookingStart)
      })
    }

    if (field?.slots && field.slots.length > 0) {
      return field.slots.map(slot => {
        const startTime = new Date(slot.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
        const endTime = new Date(slot.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
        const available = !isSlotBooked(startTime, endTime)
        
        return {
          id: slot.id,
          label: slot.shift_label || 'Ca thuê',
          time: `${startTime} - ${endTime}`,
          price: slot.price || field.price,
          available: available,
          start_time: `${selectedDate}T${startTime}`,
          end_time: `${selectedDate}T${endTime}`
        }
      })
    }

    return times.map((t, i) => {
      const [startTime, endTime] = t.time.split(' - ')
      const available = !isSlotBooked(startTime, endTime)
      
      return {
        id: `slot-${i}-${startTime.replace(':', '')}`,
        ...t,
        price: field?.price || '300000',
        available: available,
        start_time: `${selectedDate}T${startTime}`,
        end_time: `${selectedDate}T${endTime}`
      }
    })
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    
    // Check authentication first
    if (!authAPI.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để đặt sân. Chuyển đến trang đăng nhập?')) {
        navigate('/user/login')
      }
      return
    }

    // Validation
    const errors = {}
    if (!bookingForm.name.trim()) errors.name = 'Vui lòng nhập tên'
    if (!bookingForm.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại'
    if (!selectedDate) errors.date = 'Vui lòng chọn ngày'
    if (!selectedSlot) errors.slot = 'Vui lòng chọn khung giờ'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      // Create datetime strings for start and end time
      const startDateTime = selectedSlot.start_time || `${selectedDate}T${selectedSlot.time.split(' - ')[0]}:00`
      const endDateTime = selectedSlot.end_time || `${selectedDate}T${selectedSlot.time.split(' - ')[1]}:00`

      // Parse price to number, use default if invalid
      let numericPrice = 300000 // Default demo price
      const priceValue = selectedSlot.price || field.price
      if (priceValue && typeof priceValue === 'number') {
        numericPrice = priceValue
      } else if (priceValue && typeof priceValue === 'string') {
        const parsed = parseInt(priceValue.replace(/[^\d]/g, ''))
        if (!isNaN(parsed) && parsed > 0) {
          numericPrice = parsed
        }
      }

      const bookingData = {
        field_id: field.field_id || field.id,
        start_time: new Date(startDateTime).toISOString(),
        end_time: new Date(endDateTime).toISOString(),
        price: numericPrice,
        customer_name: bookingForm.name,
        customer_phone: bookingForm.phone,
        note: bookingForm.note || ''
      }

      const response = await ApiClient.post('/user/bookings', bookingData)
      const bookingId = response.booking?.booking_id || response.booking?.id
      
      // Chuyển sang trang thanh toán với booking_id
      if (bookingId) {
        navigate(`/user/booking?id=${bookingId}`)
      } else {
        alert('Đặt sân thành công nhưng không nhận được mã đặt sân')
        navigate('/user/bookings')
      }
    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || err.message || 'Đặt sân thất bại. Vui lòng thử lại.'
      alert(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const facilities = field?.facilities || ['Bãi đỗ xe', 'Phòng thay đồ', 'Căng tin', 'Wi-Fi', 'Điều hòa', 'Camera an ninh']
  
  const reviews = field?.reviews || [
    { id: 1, name: 'Nguyễn Văn A', rating: 5, comment: 'Sân đẹp, tiện nghi đầy đủ. Tôi sẽ quay lại!', date: '2 ngày trước', avatar: '👤' },
    { id: 2, name: 'Trần Thị B', rating: 4, comment: 'Chất lượng tốt, giá cả hợp lý.', date: '1 tuần trước', avatar: '👤' },
    { id: 3, name: 'Lê Văn C', rating: 5, comment: 'Sân rộng rãi, cỏ xanh tốt. Rất hài lòng!', date: '2 tuần trước', avatar: '👤' }
  ]

  if (loading) {
    return (
      <div className="modern-detail-page">
        <Navbar />
        <div className="loading-container-modern">
          <div className="loading-spinner-modern"></div>
          <p>Đang tải thông tin sân bóng...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !field) {
    return (
      <div className="modern-detail-page">
        <Navbar />
        <div className="error-container-modern">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>Không tìm thấy sân bóng</h2>
          <p>{error || 'Sân bóng không tồn tại hoặc đã bị xóa'}</p>
          <button onClick={() => navigate('/user/fields')} className="back-btn-modern">
            ← Quay lại danh sách
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const images = getImages()
  const timeSlots = generateTimeSlots()

  return (
    <div className="modern-detail-page">
      <Navbar />

      {/* Hero Section with Image Gallery */}
      <section className="detail-hero">
        <div className="hero-gallery">
          <div className="main-image-wrapper">
            <img src={images[currentImageIndex]} alt={field.field_name || field.name} className="main-image" />
            <div className="image-navigation">
              <button 
                className="nav-btn prev" 
                onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button 
                className="nav-btn next"
                onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            <div className="image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
          <div className="thumbnail-grid">
            {images.slice(0, 4).map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <img src={img} alt={`Ảnh ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="detail-container">
        <div className="detail-layout">
          {/* Left Column - Field Info */}
          <div className="detail-main">
            {/* Header */}
            <div className="field-header-modern">
              <div className="header-top">
                <div className="header-left">
                  <h1 className="field-title-modern">{field.field_name || field.name}</h1>
                  <div className="field-meta-modern">
                    <div className="meta-item-modern">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{field.location || 'Chưa cập nhật'}</span>
                    </div>
                    {field.openTime && (
                      <div className="meta-item-modern">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>{field.openTime}</span>
                      </div>
                    )}
                    <div className="meta-item-modern status-open">
                      <span className="status-dot"></span>
                      <span>Đang mở cửa</span>
                    </div>
                  </div>
                </div>
                <div className="header-right">
                  <div className="rating-box-modern">
                    <div className="rating-number">{field.rating || '4.8'}</div>
                    <div className="rating-stars-modern">⭐⭐⭐⭐⭐</div>
                    <div className="rating-count">{field.reviews || '128'} đánh giá</div>
                  </div>
                </div>
              </div>
              
              <div className="header-actions">
                <button className="action-btn-modern favorite">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>Yêu thích</span>
                </button>
                <button className="action-btn-modern share">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  <span>Chia sẻ</span>
                </button>
                <button className="action-btn-modern chat" onClick={handleChatWithManager}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>Chat ngay</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                Tổng quan
              </button>
              <button 
                className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
                onClick={() => setActiveTab('facilities')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
                Tiện ích
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Đánh giá
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  <div className="content-section">
                    <h3 className="section-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Mô tả sân bóng
                    </h3>
                    <div className="description-text">
                      {field.description || 'Sân bóng đá chất lượng cao với cỏ nhân tạo thế hệ mới, hệ thống chiếu sáng hiện đại. Phù hợp cho các trận đấu 5v5, 7v7 và 11v11. Khu vực sân rộng rãi, thoáng mát với đầy đủ tiện nghi phục vụ người chơi.'}
                    </div>
                  </div>

                  <div className="content-section">
                    <h3 className="section-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      Thông tin chi tiết
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Loại sân</span>
                        <span className="info-value">{field.type || 'Sân 5v5, 7v7'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Kích thước</span>
                        <span className="info-value">{field.size || '40m x 20m'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Mặt sân</span>
                        <span className="info-value">{field.surface || 'Cỏ nhân tạo'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Giá thuê</span>
                        <span className="info-value highlight">{formatPrice(field.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div className="facilities-content">
                  <h3 className="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Tiện ích & Dịch vụ
                  </h3>
                  <div className="facilities-grid-modern">
                    {facilities.map((facility, idx) => (
                      <div key={idx} className="facility-card-modern">
                        <div className="facility-icon-modern">✓</div>
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  <div className="reviews-header">
                    <h3 className="section-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Đánh giá từ khách hàng
                    </h3>
                    <div className="rating-summary">
                      <div className="summary-score">
                        <div className="score-number">{field.rating || '4.8'}</div>
                        <div className="score-stars">⭐⭐⭐⭐⭐</div>
                        <div className="score-text">{reviews.length} đánh giá</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="reviews-list">
                    {reviews.map(review => (
                      <div key={review.id} className="review-card-modern">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">{review.avatar}</div>
                            <div>
                              <div className="reviewer-name">{review.name}</div>
                              <div className="review-date">{review.date}</div>
                            </div>
                          </div>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="detail-sidebar">
            <div className="booking-card-modern">
              <div className="booking-header">
                <h3>Đặt sân ngay</h3>
                <div className="booking-price">
                  <span className="price-label">Từ</span>
                  <span className="price-value">{formatPrice(field.price)}</span>
                  <span className="price-unit">/giờ</span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="booking-form-modern">
                {/* Date Selection */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Chọn ngày
                  </label>
                  <input
                    type="date"
                    className={`form-input-modern ${formErrors.date ? 'error' : ''}`}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.date && <span className="error-text">{formErrors.date}</span>}
                </div>

                {/* Time Slot Selection */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Chọn khung giờ
                  </label>
                  <div className="time-slots-grid">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        className={`time-slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''} ${!slot.available ? 'disabled' : ''}`}
                        onClick={() => slot.available && setSelectedSlot(slot)}
                        disabled={!slot.available}
                      >
                        <span className="slot-icon">{slot.icon || '⏰'}</span>
                        <div className="slot-info">
                          <div className="slot-label">{slot.label}</div>
                          <div className="slot-time">{slot.time}</div>
                        </div>
                        {!slot.available && <span className="slot-badge">Đã đặt</span>}
                      </button>
                    ))}
                  </div>
                  {formErrors.slot && <span className="error-text">{formErrors.slot}</span>}
                </div>

                {/* Customer Name */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className={`form-input-modern ${formErrors.name ? 'error' : ''}`}
                    placeholder="Nhập họ và tên của bạn"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                {/* Customer Phone */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className={`form-input-modern ${formErrors.phone ? 'error' : ''}`}
                    placeholder="Nhập số điện thoại"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>

                {/* Note */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    className="form-textarea-modern"
                    placeholder="Ghi chú thêm cho việc đặt sân..."
                    rows="3"
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm({...bookingForm, note: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn-modern"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner-small"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      <span>Xác nhận đặt sân</span>
                    </>
                  )}
                </button>
              </form>

              <div className="booking-guarantee">
                <div className="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>Đảm bảo chất lượng</span>
                </div>
                <div className="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
