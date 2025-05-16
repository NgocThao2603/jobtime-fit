const db = require("../../models/index");

const createACalendar = async (calendarData) => {
  const calendar = await db.Calendar.create(calendarData);
  return calendar;
};

const getAllCalendars = async () => {
  const calendars = await db.Calendar.findAll();
  return calendars;
}
const deleteCalendar = async (id) => {
  const calendar = await db.Calendar.findByPk(id);
  if (!calendar) {
    throw new Error("Lịch không tồn tại");
  }

  await calendar.destroy(); // Xóa bản ghi khỏi DB
  return { message: "Xóa lịch thành công", id };
};

module.exports = { createACalendar,getAllCalendars,deleteCalendar};
