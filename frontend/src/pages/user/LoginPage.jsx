import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Demo validation
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    // Demo login - sẽ thay bằng API call sau
    console.log('Login data:', formData)
    
    // Giả lập đăng nhập thành công
    localStorage.setItem('user', JSON.stringify({
      email: formData.email,
      name: 'Người dùng demo'
    }))
    
    alert('Đăng nhập thành công!')
    navigate('/user')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn">
              Đăng nhập
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Chưa có tài khoản? <Link to="/user/register">Đăng ký ngay</Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Hoặc đăng nhập bằng</span>
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