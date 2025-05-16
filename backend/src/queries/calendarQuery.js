const db = require("../../models/index");

const createACalendar = async (calendarData) => {
  const calendar = await db.Calendar.create(calendarData);
  return calendar;
};

const getAllCalendars = async () => {
  const calendars = await db.Calendar.findAll();
  return calendars;
}
const updateCalendar = async (id, updatedData) => {
  const calendar = await db.Calendar.findByPk(id);
  if (!calendar) {
    throw new Error("Lịch không tồn tại");
  }

  await calendar.update(updatedData);
  return calendar;
};

module.exports = { createACalendar,getAllCalendars,updateCalendar};
