import Field from '../models/Field.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// GET /api/user/fields
export const listFields = async (req, res) => {
  try {
    const { q, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'active' };
    if (q) {
      // basic search on field_name or location using Sequelize operators
      where[Op.or] = [
        { field_name: { [Op.like]: `%${q}%` } },
        { location: { [Op.like]: `%${q}%` } }
      ];
    }

    const fields = await Field.findAll({
      where,
      order: [['field_id', 'ASC']],
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10)
    });

    // Map to frontend-friendly shape
    const data = fields.map(f => ({
      field_id: f.field_id,
      field_name: f.field_name,
      location: f.location || 'Chưa cập nhật',
      status: f.status,
      image: '/images/fields/placeholder.svg',
      // extra ui-only fields
      price: 'Liên hệ',
      pricePerHour: null,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 200 + 10),
      type: 'Sân 7 người',
      facilities: ['Bãi đỗ xe', 'Đèn chiếu sáng', 'Phòng thay đồ'],
      openTime: '5h - 23h',
      distance: '2.5km',
      isOpen: true
    }));

    // return plain array (frontend expects array)
    res.json(data);
  } catch (error) {
    console.error('List fields error:', error);
    res.status(500).json({ message: 'Server error when fetching fields' });
  }
};

// GET /api/user/fields/:id
export const getField = async (req, res) => {
  try {
    const { id } = req.params;
    const f = await Field.findOne({ where: { field_id: id } });
    if (!f) return res.status(404).json({ message: 'Field not found' });

    // For now, return basic info and generate some sample available slots for the next 7 days
    const now = new Date();
    const slots = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(now);
      day.setDate(now.getDate() + d);
      // generate hourly slots from 6:00 to 22:00
      for (let h = 6; h < 22; h += 2) {
        const start = new Date(day);
        start.setHours(h, 0, 0, 0);
        const end = new Date(day);
        end.setHours(h + 2, 0, 0, 0);
        slots.push({ start_time: start.toISOString(), end_time: end.toISOString(), available: true });
      }
    }

    const data = {
      field_id: f.field_id,
      field_name: f.field_name,
      location: f.location,
      status: f.status,
      image: '/images/fields/placeholder.svg',
      price: 'Liên hệ',
      facilities: ['Bãi đỗ xe', 'Đèn chiếu sáng'],
      slots
    };

    res.json(data);
  } catch (err) {
    console.error('getField error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/user/bookings
export const createBooking = async (req, res) => {
  try {
    const { customer_id, field_id, start_time, end_time, price, note } = req.body;
    
    console.log('Received booking data:', req.body); // Debug log
    
    // Validate required fields
    if (!customer_id) {
      return res.status(400).json({ message: 'Missing customer_id' });
    }
    if (!field_id) {
      return res.status(400).json({ message: 'Missing field_id' });
    }
    if (!start_time) {
      return res.status(400).json({ message: 'Missing start_time' });
    }
    if (!end_time) {
      return res.status(400).json({ message: 'Missing end_time' });
    }

    const finalPrice = price || 0;
    const finalNote = note || '';

    // Check if customer exists in person table
    const [customerCheck] = await sequelize.query(
      'SELECT person_id FROM person WHERE person_id = ? LIMIT 1',
      { replacements: [customer_id] }
    );
    
    if (!customerCheck || customerCheck.length === 0) {
      return res.status(400).json({ 
        message: 'Customer ID does not exist. Please create a user account first.',
        error: 'INVALID_CUSTOMER_ID'
      });
    }

    // Check if field exists
    const [fieldCheck] = await sequelize.query(
      'SELECT field_id FROM fields WHERE field_id = ? LIMIT 1',
      { replacements: [field_id] }
    );
    
    if (!fieldCheck || fieldCheck.length === 0) {
      return res.status(400).json({ 
        message: 'Field ID does not exist',
        error: 'INVALID_FIELD_ID'
      });
    }

    await sequelize.query(
      `INSERT INTO bookings (customer_id, field_id, start_time, end_time, price, note, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      { replacements: [customer_id, field_id, start_time, end_time, finalPrice, finalNote] }
    );

    // MySQL returns insertId in result for mysql2 driver when using sequelize.query with INSERT
    // But sequelize.query returns different shapes; perform a follow-up query to fetch the inserted booking
  const [rows] = await sequelize.query('SELECT * FROM bookings WHERE booking_id = LAST_INSERT_ID() LIMIT 1');
  const booking = rows?.[0] ?? null;

    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error('createBooking error', err);
    res.status(500).json({ 
      message: 'Server error when creating booking', 
      error: err.message,
      sqlError: err.original?.sqlMessage || err.original?.message
    });
  }
};

// GET /api/user/bookings/:id - Get booking details with field info
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Join bookings with fields table to get field info
    const [rows] = await sequelize.query(
      `SELECT 
        b.booking_id, b.customer_id, b.field_id, b.start_time, b.end_time, 
        b.price, b.status, b.note,
        f.field_name, f.location
      FROM bookings b
      LEFT JOIN fields f ON b.field_id = f.field_id
      WHERE b.booking_id = ?
      LIMIT 1`,
      { replacements: [id] }
    );

    const booking = rows?.[0];
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error('getBooking error', err);
    res.status(500).json({ message: 'Server error when fetching booking' });
  }
};

// PUT /api/user/bookings/:id - Update booking (payment method, status)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, status } = req.body;

    // Build dynamic update query
    const updates = [];
    const replacements = [];

    if (payment_method) {
      updates.push('note = CONCAT(COALESCE(note, ""), " | Payment: ", ?)');
      replacements.push(payment_method);
    }
    
    if (status) {
      updates.push('status = ?');
      replacements.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    replacements.push(id);

    await sequelize.query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE booking_id = ?`,
      { replacements }
    );

    // Fetch updated booking
    const [rows] = await sequelize.query(
      'SELECT * FROM bookings WHERE booking_id = ? LIMIT 1',
      { replacements: [id] }
    );

    res.json({ message: 'Booking updated', booking: rows?.[0] });
  } catch (err) {
    console.error('updateBooking error', err);
    res.status(500).json({ message: 'Server error when updating booking' });
  }
};
