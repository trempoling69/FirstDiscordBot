const calendar = require('../service/googleCalendar.js');
require('dotenv').config();
const getEventsWithTimeMax = async (timeMax) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date().toISOString(),
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    throw err;
  }
};
const getEventsLifeTime = async () => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getEventsWithTimeMax,
  getEventsLifeTime,
};
