const calendar = require('../service/googleCalendar.js');
require('dotenv').config();
const checkavailability = async (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const freeBusyQuery = {
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    items: [{ id: process.env.CALENDAR_ID }],
  };

  const response = await calendar.freebusy.query({
    resource: freeBusyQuery,
  });
  const busyTimeSlots = Object.values(response.data.calendars)[0].busy;
  return busyTimeSlots.length === 0;
};

module.exports = checkavailability;
