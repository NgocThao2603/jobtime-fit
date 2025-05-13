"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load models
const JobInfo = require('./job_info');
const JobTime = require('./job_time');

// Define relationships
JobInfo.hasMany(JobTime, {
  foreignKey: 'job_info_id',
  as: 'jobTimes'
});

JobTime.belongsTo(JobInfo, {
  foreignKey: 'job_info_id',
  as: 'jobInfo'
});

// Add models to db object
db.JobInfo = JobInfo;
db.JobTime = JobTime;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
