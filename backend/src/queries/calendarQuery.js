const db = require("../../models/index");

const createACalendar = async (calendarData) => {
  const calendar = await db.Calendar.create(calendarData);
  return calendar;
};

module.exports = { createACalendar };
