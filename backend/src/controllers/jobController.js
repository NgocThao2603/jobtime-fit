const jobQuery = require('../queries/jobQuery');

// Get all jobs with their time requirements
const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobQuery.getAllJobsWithTimeRequirements();

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found with time requirements'
      });
    }

    return res.status(200).json({
      success: true,
      data: jobs
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