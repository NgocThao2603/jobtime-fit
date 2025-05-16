const { postCalendar,getCalendarController, deleteCalendarById} = require("../controllers/calendarController");

const express = require("express");
const route = express.Router();

route.post("/", postCalendar);
route.get("/allCalendar", getCalendarController);
route.delete("/delete/:id", deleteCalendarById);


module.exports = route;
