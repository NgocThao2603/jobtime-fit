'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add sample job
    const jobId = '550e8400-e29b-41d4-a716-446655440000';
    await queryInterface.bulkInsert('job_infos', [{
      id: jobId,
      title: 'Frontend Developer',
      salary: '15-20M',
      type: 'full_time',
      location: 'Ho Chi Minh City',
      min_sessions_per_week: 5,
      requires_experience: true,
      holiday_off: true,
      image_url: 'https://example.com/job1.jpg',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Add sample job time
    await queryInterface.bulkInsert('job_times', [{
      id: '550e8400-e29b-41d4-a716-446655440001',
      job_info_id: jobId,
      day: 'Monday',
      shifts: JSON.stringify([
        { start: '09:00', end: '12:00' },
        { start: '13:00', end: '18:00' }
      ]),
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: '550e8400-e29b-41d4-a716-446655440002',
      job_info_id: jobId,
      day: 'Wednesday',
      shifts: JSON.stringify([
        { start: '09:00', end: '12:00' },
        { start: '13:00', end: '18:00' }
      ]),
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('job_times', null, {});
    await queryInterface.bulkDelete('job_infos', null, {});
  }
}; 