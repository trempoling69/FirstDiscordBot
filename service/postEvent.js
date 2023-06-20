const calendar = require('../service/googleCalendar.js');
const checkavailability = require('./checkAvailibility.js');
require('dotenv').config();

const postEvent = async (summary, start, end, colorId, description) => {
  const isAvailable = await checkavailability(start, end);
  if (isAvailable) {
    const event = {
      summary: summary,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Europe/Paris',
      },
      colorId,
      description,
      sendUpdates: 'all',
    };
    const resp = await calendar.events.insert({ calendarId: process.env.CALENDAR_ID, resource: event });
    return { status: resp.status, htmlLink: resp.data.htmlLink };
  }
};

module.exports = postEvent;
