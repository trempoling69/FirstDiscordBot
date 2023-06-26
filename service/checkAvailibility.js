const calendar = require('../service/googleCalendar.js');
require('dotenv').config();
const checkavailability = async (start, end) => {
  const response = { status: null, error: null, availibility: null };
  const startDate = new Date(start);
  const endDate = new Date(end);
  const freeBusyQuery = {
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    items: [{ id: process.env.CALENDAR_ID }],
  };
  try {
    const resp = await calendar.freebusy.query({
      resource: freeBusyQuery,
    });
    const busyTimeSlots = Object.values(resp.data.calendars)[0].busy;
    response.availibility = busyTimeSlots.length === 0;
    response.status = resp.status;
  } catch (err) {
    console.log(err);
    response.status = err.code;
    response.error = err.errors[0]?.message;
  }
  return response;
};

module.exports = checkavailability;
