const { createACalendar } = require("../queries/calendarQuery");

const postCalendar = async (req, res) => {
  try {
    const calendar = req.body;
    const createdCalendar = await createACalendar(calendar);
    res.status(201).json(createdCalendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { postCalendar };
