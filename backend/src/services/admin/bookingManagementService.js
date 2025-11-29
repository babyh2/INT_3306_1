import { Booking, User, Field, Payment } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get all bookings with filters and pagination
 */
export const getAllBookingsService = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, status = '', fieldId = '', startDate = '', endDate = '' } = { ...filters, ...pagination };
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (status) whereClause.status = status;
  if (fieldId) whereClause.field_id = fieldId;
  
  if (startDate && endDate) {
    whereClause.start_time = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  } else if (startDate) {
    whereClause.start_time = { [Op.gte]: new Date(startDate) };
  } else if (endDate) {
    whereClause.start_time = { [Op.lte]: new Date(endDate) };
  }

  const { count, rows } = await Booking.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['start_time', 'DESC']],
    include: [
      {
        model: User,
        as: 'customer',
        attributes: ['person_id', 'person_name', 'email', 'phone']
      },
      {
        model: Field,
        as: 'field',
        attributes: ['field_id', 'field_name', 'location']
      },
      {
        model: Payment,
        as: 'payment',
        attributes: ['payment_id', 'amount', 'payment_method', 'status']
      }
    ]
  });

  return {
    bookings: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Get booking by ID
 */
export const getBookingByIdService = async (id) => {
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: User,
        as: 'customer',
        attributes: ['person_id', 'person_name', 'email', 'phone', 'address']
      },
      {
        model: Field,
        as: 'field',
        attributes: ['field_id', 'field_name', 'location'],
        include: [
          {
            model: User,
            as: 'manager',
            attributes: ['person_name', 'phone']
          }
        ]
      },
      {
        model: User,
        as: 'manager',
        attributes: ['person_name', 'phone']
      },
      {
        model: Payment,
        as: 'payment'
      }
    ]
  });

  return booking;
};

/**
 * Update booking status
 */
export const updateBookingStatusService = async (id, status, note = '') => {
  const booking = await Booking.findByPk(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const updateData = { status };
  if (note) {
    updateData.note = booking.note ? `${booking.note}\n${note}` : note;
  }

  await booking.update(updateData);
  
  // If approved, update payment status if exists
  if (status === 'approved') {
    const payment = await Payment.findOne({ where: { booking_id: id } });
    if (payment && payment.status === 'pending') {
      await payment.update({ status: 'completed' });
    }
  }

  return booking;
};

/**
 * Cancel booking
 */
export const cancelBookingService = async (id, reason) => {
  const booking = await Booking.findByPk(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'completed') {
    throw new Error('Cannot cancel completed booking');
  }

  await booking.update({
    status: 'cancelled',
    note: booking.note ? `${booking.note}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`
  });

  // Update payment to refunded if payment was completed
  const payment = await Payment.findOne({ where: { booking_id: id } });
  if (payment && payment.status === 'completed') {
    await payment.update({ status: 'refunded' });
  }

  return booking;
};

/**
 * Get booking statistics
 */
export const getBookingStatsService = async () => {
  const totalBookings = await Booking.count();
  const pendingBookings = await Booking.count({ where: { status: 'pending' } });
  const approvedBookings = await Booking.count({ where: { status: 'approved' } });
  const completedBookings = await Booking.count({ where: { status: 'completed' } });
  const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });

  // Today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = await Booking.count({
    where: {
      start_time: {
        [Op.gte]: today,
        [Op.lt]: tomorrow
      }
    }
  });

  return {
    total: totalBookings,
    pending: pendingBookings,
    approved: approvedBookings,
    completed: completedBookings,
    cancelled: cancelledBookings,
    today: todayBookings
  };
};

/**
 * Get bookings by date range
 */
export const getBookingsByDateRangeService = async (startDate, endDate) => {
  const bookings = await Booking.findAll({
    where: {
      start_time: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    },
    include: [
      {
        model: User,
        as: 'customer',
        attributes: ['person_name', 'phone']
      },
      {
        model: Field,
        as: 'field',
        attributes: ['field_name']
      }
    ],
    order: [['start_time', 'ASC']]
  });

  return bookings;
};
