"use strict";

const db = require("../models");
const { JobInfo, JobTime } = db;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const jobData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/sample_jobs.json"), "utf-8")
);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      for (const job of jobData) {
        const jobId = uuidv4();

        const createdJob = await JobInfo.create(
          {
            id: jobId,
            title: job.title,
            image_url: job.image_url,
            salary: job.salary,
            type: job.type,
            location: job.location,
            min_sessions_per_week: job.min_sessions_per_week,
            requires_experience: job.requires_experience,
            holiday_off: job.holiday_off,
            job_status: job.job_status,
            job_agency: job.job_agency,
            job_agency_image: job.job_agency_image,
          },
          { transaction }
        );

        const jobTimes = job.job_times.map((time) => ({
          id: uuidv4(),
          job_info_id: createdJob.id,
          day: time.day,
          shifts: time.shifts,
        }));

        await JobTime.bulkCreate(jobTimes, { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("job_times", null, {});
    await queryInterface.bulkDelete("job_infos", null, {});
  },
};
