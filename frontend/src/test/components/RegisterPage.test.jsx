import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../pages/RegisterPage';
import * as authService from '../../services/authService';

vi.mock('../../services/authService', () => ({
  register: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render registration form', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/tên/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^mật khẩu$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/xác nhận mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/số điện thoại/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText(/tên/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const phoneInput = screen.getByPlaceholderText(/số điện thoại/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '0123456789' } });

    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(phoneInput.value).toBe('0123456789');
  });

  it('should validate password match', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/^mật khẩu$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/xác nhận mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /đăng ký/i });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mật khẩu không khớp/i)).toBeInTheDocument();
    });
  });

  it('should submit registration form successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Đăng ký thành công',
    };

    authService.register.mockResolvedValue(mockResponse);

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/tên/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^mật khẩu$/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/xác nhận mật khẩu/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/số điện thoại/i), {
      target: { value: '0123456789' },
    });

    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        phone_number: '0123456789',
      });
    });
  });

  it('should validate email format', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /đăng ký/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument();
    });
  });

  it('should validate phone number format', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const phoneInput = screen.getByPlaceholderText(/số điện thoại/i);
    const submitButton = screen.getByRole('button', { name: /đăng ký/i });

    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/số điện thoại không hợp lệ/i)).toBeInTheDocument();
    });
  });

  it('should handle registration error', async () => {
    authService.register.mockRejectedValue(new Error('Email đã tồn tại'));

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/tên/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^mật khẩu$/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/xác nhận mật khẩu/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/số điện thoại/i), {
      target: { value: '0123456789' },
    });

    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));

    await waitFor(() => {
      expect(screen.getByText(/email đã tồn tại/i)).toBeInTheDocument();
    });
  });

  it('should have link to login page', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const loginLink = screen.getByText(/đăng nhập/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should redirect to login page after successful registration', async () => {
    const mockResponse = {
      success: true,
      message: 'Đăng ký thành công',
    };

    authService.register.mockResolvedValue(mockResponse);

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/tên/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^mật khẩu$/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/xác nhận mật khẩu/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/số điện thoại/i), {
      target: { value: '0123456789' },
    });

    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
