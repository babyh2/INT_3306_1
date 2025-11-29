import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('Person', {
  person_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  person_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  sex: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['male', 'female', 'other']]
    }
  },
  address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(45),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'manager', 'admin']]
    }
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive']]
    }
  }
}, {
  tableName: 'person',
  timestamps: false,
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
});

export default User;