const { postCalendar } = require("../controllers/calendarController");

const express = require("express");
const route = express.Router();

route.post("/", postCalendar);

module.exports = route;
