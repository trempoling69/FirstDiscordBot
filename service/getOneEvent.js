const calendar = require('../service/googleCalendar.js');
require('dotenv').config();

const getOneEvent = async (id) => {
  let event = { event: null, status: null, error: null };
  try {
    const eventResp = await calendar.events.get({ calendarId: process.env.CALENDAR_ID, eventId: id });
    event.event = eventResp.data;
    event.status = eventResp.status;
  } catch (err) {
    console.log(err);
    event.status = err.code;
    event.error = err.errors[0].message;
  }
  console.log(event);
  return event;
};

module.exports = getOneEvent;
