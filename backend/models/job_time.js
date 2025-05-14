const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const JobTime = sequelize.define(
  "JobTime",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      autoIncrement: false,
    },
    job_info_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shifts: {
      type: DataTypes.JSON, // Lưu dưới dạng JSON để lưu thông tin ca làm việc
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW(),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW(),
    },
  },
  {
    tableName: "job_times",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = JobTime;
