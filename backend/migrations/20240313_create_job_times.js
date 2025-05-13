'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_times', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      job_info_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'job_infos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      day: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      shifts: {
        type: Sequelize.JSON,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('job_times');
  }
}; 