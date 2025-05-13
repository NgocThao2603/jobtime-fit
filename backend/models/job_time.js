const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const JobTime = sequelize.define('JobTime', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  job_info_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'job_infos',
      key: 'id'
    }
  },
  day: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  shifts: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'job_times',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = JobTime; 