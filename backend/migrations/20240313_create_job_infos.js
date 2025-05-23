"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("job_infos", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      salary: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("full_time", "part_time", "intern"),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      min_sessions_per_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      requires_experience: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      holiday_off: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
      job_agency: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      job_agency_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      job_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("job_infos");
  },
};
