const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const JobInfo = sequelize.define('JobInfo', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'intern'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  min_sessions_per_week: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  requires_experience: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  holiday_off: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'completed'),
    defaultValue: 'active',
    allowNull: false
  }
}, {
  tableName: 'job_infos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = JobInfo; 