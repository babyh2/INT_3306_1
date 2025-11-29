import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Field = sequelize.define('Field', {
  field_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'person',
      key: 'person_id'
    }
  },
  field_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive', 'maintenance']]
    }
  }
}, {
  tableName: 'fields',
  timestamps: false,
  indexes: [
    { fields: ['manager_id'] },
    { fields: ['status'] }
  ]
});

export default Field;