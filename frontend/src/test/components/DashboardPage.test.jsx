import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../pages/admin/DashboardPage';
import * as adminApi from '../../api/adminApi';

// Mock the API
vi.mock('../../api/adminApi', () => ({
  getDashboardStats: vi.fn(),
  getRevenueByDateRange: vi.fn(),
}));

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  PieChart: () => <div data-testid="pie-chart">PieChart</div>,
  Pie: () => null,
  Cell: () => null,
  BarChart: () => <div data-testid="bar-chart">BarChart</div>,
  Bar: () => null,
  LineChart: () => <div data-testid="line-chart">LineChart</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

describe('DashboardPage', () => {
  const mockDashboardData = {
    data: {
      totalUsers: 100,
      regularUsers: 80,
      totalManagers: 15,
      totalAdmins: 5,
      activeUsers: 90,
      totalFields: 20,
      activeFields: 18,
      maintenanceFields: 2,
      inactiveFields: 0,
      totalBookings: 500,
      pendingBookings: 50,
      confirmedBookings: 200,
      completedBookings: 200,
      cancelledBookings: 40,
      rejectedBookings: 10,
      todayBookings: 25,
      totalRevenue: 50000000,
      monthlyRevenue: 10000000,
    },
  };

  const mockRevenueData = {
    data: {
      totalRevenue: 50000000,
      totalBookings: 500,
      bookings: [
        { booking_date: '2024-01-01', total_price: 500000 },
        { booking_date: '2024-01-02', total_price: 600000 },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    adminApi.getDashboardStats.mockResolvedValue(mockDashboardData);
    adminApi.getRevenueByDateRange.mockResolvedValue(mockRevenueData);
  });

  it('should render loading state initially', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Đang tải dữ liệu/i)).toBeInTheDocument();
  });

  it('should fetch and display dashboard stats', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(adminApi.getDashboardStats).toHaveBeenCalled();
      expect(adminApi.getRevenueByDateRange).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Tổng Quan Hệ Thống/i)).toBeInTheDocument();
    });
  });

  it('should display correct stats card values', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tổng người dùng')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Tổng sân bóng')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Tổng đặt sân')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
    });
  });

  it('should render all charts', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const pieCharts = screen.getAllByTestId('pie-chart');
      expect(pieCharts.length).toBeGreaterThan(0);
      
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toBeInTheDocument();
      
      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toBeInTheDocument();
    });
  });

  it('should handle date range filter', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      expect(dateInputs.length).toBe(2);
    });
  });

  it('should display revenue summary', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Doanh Thu Theo Khoảng Thời Gian/i)).toBeInTheDocument();
      expect(screen.getByText('Tổng doanh thu')).toBeInTheDocument();
      expect(screen.getByText('Số lượt đặt')).toBeInTheDocument();
      expect(screen.getByText('Trung bình/đặt')).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    adminApi.getDashboardStats.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Lỗi tải dữ liệu/i)).toBeInTheDocument();
      expect(screen.getByText(/Thử lại/i)).toBeInTheDocument();
    });
  });

  it('should format revenue numbers correctly', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Check if numbers are formatted with thousands separator
      const formattedNumber = screen.getByText(/50,000,000/);
      expect(formattedNumber).toBeInTheDocument();
    });
  });
});
