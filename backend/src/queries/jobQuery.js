const db = require('../../models');
const { JobInfo, JobTime } = db;

const getAllJobsWithTimeRequirements = async () => {
  try {
    const jobs = await JobInfo.findAll({
      include: [{
        model: JobTime,
        as: 'jobTimes',
        required: true
      }]
    });

    return jobs.filter(job => job.jobTimes && job.jobTimes.length > 0);
  } catch (error) {
    throw new Error(`Error in getAllJobsWithTimeRequirements: ${error.message}`);
  }
};

module.exports = {
  getAllJobsWithTimeRequirements
}; 