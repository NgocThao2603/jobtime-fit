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
      model: 'job_infos',  // Tên bảng job_infos
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  day: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  shifts: {
    type: DataTypes.JSON,  // Lưu dưới dạng JSON để lưu thông tin ca làm việc
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW()
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW()
  }
}, {
  tableName: 'job_times',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = JobTime; 