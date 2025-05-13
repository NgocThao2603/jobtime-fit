const db = require('../../models');
const { JobInfo, JobTime } = db;

// Get all jobs with their time requirements
const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobInfo.findAll({
      include: [{
        model: JobTime,
        as: 'jobTimes',
        required: true
      }]
    });

    // Validate if jobs have time requirements
    const validJobs = jobs.filter(job => job.jobTimes && job.jobTimes.length > 0);

    if (validJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found with time requirements'
      });
    }

    return res.status(200).json({
      success: true,
      data: validJobs
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

module.exports = {
  getAllJobs
}; 