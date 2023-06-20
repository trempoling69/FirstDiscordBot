const calendar = require('../service/googleCalendar.js');
require('dotenv').config();

const deleteEvent = async (id) => {
  const response = { status: null, error: null };
  try {
    const resp = await calendar.events.delete({ calendarId: process.env.CALENDAR_ID, eventId: id });
    response.status = resp.status;
  } catch (err) {
    console.log(err);
    response.status = err.code;
    response.error = err.errors[0]?.message;
  }
  console.log(response);
  return response;
};
module.exports = deleteEvent;
