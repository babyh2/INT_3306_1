import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    // Demo registration - sẽ thay bằng API call sau
    console.log('Register data:', formData)
    
    setSuccess(true)
    
    // Chuyển hướng sau 2 giây
    setTimeout(() => {
      navigate('/user/login')
    }, 2000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <h1>Đăng ký tài khoản</h1>
            <p>Tạo tài khoản mới để bắt đầu đặt sân</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            <div className="form-checkbox">
              <label>
                <input type="checkbox" required />
                <span>
                  Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và{' '}
                  <Link to="/privacy">Chính sách bảo mật</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn">
              Đăng ký
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Đã có tài khoản? <Link to="/user/login">Đăng nhập ngay</Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Hoặc đăng ký bằng</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <span>🔍</span> Google
            </button>
            <button className="social-btn facebook">
              <span>f</span> Facebook
            </button>
          </div>

          <div className="back-home">
            <Link to="/">← Quay lại trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  )
}