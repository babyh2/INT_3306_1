import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as adminApi from '../../api/adminApi';

// Mock axios
vi.mock('axios');

describe('Admin API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'mock-token');
  });

  describe('getDashboardStats', () => {
    it('should fetch dashboard statistics', async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            totalUsers: 100,
            totalFields: 20,
            totalBookings: 500,
            totalRevenue: 50000000,
          },
        },
      };

      axios.get.mockResolvedValue(mockData);

      const result = await adminApi.getDashboardStats();

      expect(axios.get).toHaveBeenCalledWith(
        '/api/admin/dashboard',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
      expect(result.data.data.totalUsers).toBe(100);
    });

    it('should handle API errors', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(adminApi.getDashboardStats()).rejects.toThrow('Network Error');
    });
  });

  describe('getRevenueByDateRange', () => {
    it('should fetch revenue data for date range', async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            totalRevenue: 10000000,
            totalBookings: 100,
            bookings: [],
          },
        },
      };

      axios.get.mockResolvedValue(mockData);

      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      const result = await adminApi.getRevenueByDateRange(startDate, endDate);

      expect(axios.get).toHaveBeenCalledWith(
        `/api/admin/revenue/date-range?startDate=${startDate}&endDate=${endDate}`,
        expect.any(Object)
      );
      expect(result.data.data.totalRevenue).toBe(10000000);
    });
  });

  describe('User Management API', () => {
    it('should fetch all users', async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { person_id: 1, name: 'User 1', email: 'user1@test.com' },
            { person_id: 2, name: 'User 2', email: 'user2@test.com' },
          ],
        },
      };

      axios.get.mockResolvedValue(mockData);

      const result = await adminApi.getAllUsers();

      expect(axios.get).toHaveBeenCalledWith('/api/admin/users', expect.any(Object));
      expect(result.data.data).toHaveLength(2);
    });

    it('should create new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@test.com',
        password: 'Password123!',
        role: 'user',
      };

      const mockResponse = {
        data: {
          success: true,
          data: { person_id: 3, ...newUser },
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await adminApi.createUser(newUser);

      expect(axios.post).toHaveBeenCalledWith(
        '/api/admin/users',
        newUser,
        expect.any(Object)
      );
      expect(result.data.data.person_id).toBe(3);
    });

    it('should update user', async () => {
      const userId = 1;
      const updateData = { name: 'Updated Name' };

      const mockResponse = {
        data: {
          success: true,
          data: { person_id: userId, name: 'Updated Name' },
        },
      };

      axios.put.mockResolvedValue(mockResponse);

      const result = await adminApi.updateUser(userId, updateData);

      expect(axios.put).toHaveBeenCalledWith(
        `/api/admin/users/${userId}`,
        updateData,
        expect.any(Object)
      );
      expect(result.data.data.name).toBe('Updated Name');
    });

    it('should delete user', async () => {
      const userId = 1;

      const mockResponse = {
        data: {
          success: true,
          message: 'User deleted successfully',
        },
      };

      axios.delete.mockResolvedValue(mockResponse);

      const result = await adminApi.deleteUser(userId);

      expect(axios.delete).toHaveBeenCalledWith(
        `/api/admin/users/${userId}`,
        expect.any(Object)
      );
      expect(result.data.success).toBe(true);
    });
  });

  describe('Field Management API', () => {
    it('should fetch all fields', async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { field_id: 1, field_name: 'Field 1' },
            { field_id: 2, field_name: 'Field 2' },
          ],
        },
      };

      axios.get.mockResolvedValue(mockData);

      const result = await adminApi.getAllFields();

      expect(axios.get).toHaveBeenCalledWith('/api/admin/fields', expect.any(Object));
      expect(result.data.data).toHaveLength(2);
    });

    it('should create new field', async () => {
      const newField = {
        field_name: 'New Field',
        location: 'Location A',
        size: '7-a-side',
        rental_price: 500000,
      };

      const mockResponse = {
        data: {
          success: true,
          data: { field_id: 1, ...newField },
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await adminApi.createField(newField);

      expect(axios.post).toHaveBeenCalledWith(
        '/api/admin/fields',
        newField,
        expect.any(Object)
      );
      expect(result.data.data.field_id).toBe(1);
    });
  });

  describe('Booking Management API', () => {
    it('should fetch all bookings', async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { booking_id: 1, status: 'pending' },
            { booking_id: 2, status: 'confirmed' },
          ],
        },
      };

      axios.get.mockResolvedValue(mockData);

      const result = await adminApi.getAllBookings();

      expect(axios.get).toHaveBeenCalledWith('/api/admin/bookings', expect.any(Object));
      expect(result.data.data).toHaveLength(2);
    });

    it('should update booking status', async () => {
      const bookingId = 1;
      const newStatus = 'confirmed';

      const mockResponse = {
        data: {
          success: true,
          data: { booking_id: bookingId, status: newStatus },
        },
      };

      axios.patch.mockResolvedValue(mockResponse);

      const result = await adminApi.updateBookingStatus(bookingId, newStatus);

      expect(axios.patch).toHaveBeenCalledWith(
        `/api/admin/bookings/${bookingId}/status`,
        { status: newStatus },
        expect.any(Object)
      );
      expect(result.data.data.status).toBe(newStatus);
    });
  });

  describe('Authorization Headers', () => {
    it('should include authorization header in all requests', async () => {
      axios.get.mockResolvedValue({ data: { success: true } });

      await adminApi.getDashboardStats();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
    });

    it('should handle requests without token', async () => {
      localStorage.removeItem('token');

      axios.get.mockResolvedValue({ data: { success: true } });

      await adminApi.getDashboardStats();

      expect(axios.get).toHaveBeenCalled();
    });
  });
});
