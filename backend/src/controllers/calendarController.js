const { createACalendar,getAllCalendars,updateCalendar} = require("../queries/calendarQuery");

const postCalendar = async (req, res) => {
  try {
    const calendar = req.body;
    const createdCalendar = await createACalendar(calendar);
    res.status(201).json(createdCalendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCalendarController = async (req, res) => {
  try {
    const calendar = await getAllCalendars();
    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateCalendarController = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedCalendar = await updateCalendar(id, updatedData);
    res.status(200).json(updatedCalendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { postCalendar,getCalendarController,updateCalendarController};
