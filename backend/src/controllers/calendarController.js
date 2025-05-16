const { createACalendar,getAllCalendars,deleteCalendar} = require("../queries/calendarQuery");

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


const deleteCalendarById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteCalendar(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
module.exports = { postCalendar,getCalendarController,deleteCalendarById};
