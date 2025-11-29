import { Field, FieldImage, User, Booking } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get all fields with filters and pagination
 */
export const getAllFieldsService = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, search = '', status = '' } = { ...filters, ...pagination };
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (search) {
    whereClause[Op.or] = [
      { field_name: { [Op.like]: `%${search}%` } },
      { location: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (status) whereClause.status = status;

  const { count, rows } = await Field.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['field_id', 'DESC']],
    include: [
      {
        model: User,
        as: 'manager',
        attributes: ['person_id', 'person_name', 'email']
      },
      {
        model: FieldImage,
        as: 'images',
        limit: 1,
        where: { is_primary: true },
        required: false
      }
    ]
  });

  return {
    fields: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Get field by ID with full details
 */
export const getFieldByIdService = async (id) => {
  const field = await Field.findByPk(id, {
    include: [
      {
        model: User,
        as: 'manager',
        attributes: ['person_id', 'person_name', 'email', 'phone']
      },
      {
        model: FieldImage,
        as: 'images'
      },
      {
        model: Booking,
        as: 'bookings',
        limit: 10,
        order: [['start_time', 'DESC']],
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['person_name', 'phone']
          }
        ]
      }
    ]
  });

  return field;
};

/**
 * Create new field
 */
export const createFieldService = async (fieldData) => {
  const field = await Field.create(fieldData);
  return field;
};

/**
 * Update field
 */
export const updateFieldService = async (id, fieldData) => {
  const field = await Field.findByPk(id);
  if (!field) {
    throw new Error('Field not found');
  }

  await field.update(fieldData);
  return field;
};

/**
 * Delete field
 */
export const deleteFieldService = async (id) => {
  const field = await Field.findByPk(id);
  if (!field) {
    throw new Error('Field not found');
  }

  // Check if field has active bookings
  const activeBookings = await Booking.count({
    where: {
      field_id: id,
      status: { [Op.in]: ['pending', 'approved'] },
      start_time: { [Op.gte]: new Date() }
    }
  });

  if (activeBookings > 0) {
    throw new Error('Cannot delete field with active bookings');
  }

  await field.update({ status: 'inactive' });
  return { message: 'Field deleted successfully' };
};

/**
 * Toggle field status
 */
export const toggleFieldStatusService = async (id) => {
  const field = await Field.findByPk(id);
  if (!field) {
    throw new Error('Field not found');
  }

  const newStatus = field.status === 'active' ? 'inactive' : 'active';
  await field.update({ status: newStatus });
  
  return {
    message: `Field status changed to ${newStatus}`,
    status: newStatus
  };
};

/**
 * Get field statistics
 */
export const getFieldStatsService = async () => {
  const totalFields = await Field.count();
  const activeFields = await Field.count({ where: { status: 'active' } });
  const inactiveFields = await Field.count({ where: { status: 'inactive' } });
  const maintenanceFields = await Field.count({ where: { status: 'maintenance' } });

  return {
    total: totalFields,
    active: activeFields,
    inactive: inactiveFields,
    maintenance: maintenanceFields
  };
};

/**
 * Upload field images
 */
export const uploadFieldImagesService = async (fieldId, images) => {
  const field = await Field.findByPk(fieldId);
  if (!field) {
    throw new Error('Field not found');
  }

  const imageRecords = images.map((imageUrl, index) => ({
    field_id: fieldId,
    image_url: imageUrl,
    is_primary: index === 0 // First image is primary
  }));

  const createdImages = await FieldImage.bulkCreate(imageRecords);
  return createdImages;
};

/**
 * Delete field image
 */
export const deleteFieldImageService = async (imageId) => {
  const image = await FieldImage.findByPk(imageId);
  if (!image) {
    throw new Error('Image not found');
  }

  await image.destroy();
  return { message: 'Image deleted successfully' };
};
