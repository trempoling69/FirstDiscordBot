const calendar = require('../service/googleCalendar.js');
require('dotenv').config();
const getEvents = async () => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getEvents,
};
