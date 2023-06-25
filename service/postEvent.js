const calendar = require('../service/googleCalendar.js');
const checkavailability = require('./checkAvailibility.js');
require('dotenv').config();

const postEvent = async (summary, start, end, colorId, description) => {
  const response = { status: null, htmlLink: null, errorMessage: null };
  try {
    // const isAvailable = await checkavailability(start, end);
    const isAvailable = true;
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
      response.status = resp.status;
      response.htmlLink = resp.data.htmlLink;
    }
  } catch (err) {
    console.log(err);
    response.status = err.code;
    response.errorMessage = err.errors[0]?.message;
  }
  return response;
};

module.exports = postEvent;
