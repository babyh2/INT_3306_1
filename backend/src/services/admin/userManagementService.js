import { User, Field, Booking } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get all users with filters and pagination
 */
export const getAllUsersService = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, search = '', role = '', status = '' } = { ...filters, ...pagination };
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (search) {
    whereClause[Op.or] = [
      { person_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { username: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (role) whereClause.role = role;
  if (status) whereClause.status = status;

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['person_id', 'DESC']],
    attributes: { exclude: ['password'] }
  });

  return {
    users: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Get user by ID
 */
export const getUserByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Field,
        as: 'managedFields',
        attributes: ['field_id', 'field_name', 'location', 'status']
      },
      {
        model: Booking,
        as: 'bookings',
        limit: 5,
        order: [['start_time', 'DESC']],
        include: [
          {
            model: Field,
            as: 'field',
            attributes: ['field_name']
          }
        ]
      }
    ]
  });

  return user;
};

/**
 * Create new user
 */
export const createUserService = async (userData) => {
  const user = await User.create(userData);
  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
};

/**
 * Update user
 */
export const updateUserService = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  // Don't allow password update through this method
  delete userData.password;
  
  await user.update(userData);
  const updatedUser = user.toJSON();
  delete updatedUser.password;
  return updatedUser;
};

/**
 * Delete user (soft delete - set status to inactive)
 */
export const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.update({ status: 'inactive' });
  return { message: 'User deleted successfully' };
};

/**
 * Toggle user status
 */
export const toggleUserStatusService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  await user.update({ status: newStatus });
  
  return {
    message: `User status changed to ${newStatus}`,
    status: newStatus
  };
};

/**
 * Get user statistics
 */
export const getUserStatsService = async () => {
  const totalUsers = await User.count();
  const activeUsers = await User.count({ where: { status: 'active' } });
  const inactiveUsers = await User.count({ where: { status: 'inactive' } });
  
  const usersByRole = await User.findAll({
    attributes: [
      'role',
      [User.sequelize.fn('COUNT', User.sequelize.col('person_id')), 'count']
    ],
    group: ['role']
  });

  return {
    total: totalUsers,
    active: activeUsers,
    inactive: inactiveUsers,
    byRole: usersByRole
  };
};
