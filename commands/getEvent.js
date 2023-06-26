const { SlashCommandBuilder } = require('discord.js');
const { getEventsWithTimeMax, getEventsLifeTime } = require('../service/getEvents');
const chunkSize = 5;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getevent')
    .setDescription('Obtenir les évènements à venir')
    .addStringOption((option) =>
      option
        .setName('period')
        .setDescription('Période sur laquelle filtrer le resultat')
        .setRequired(true)
        .addChoices(
          { name: 'Jour', value: 'day' },
          { name: 'Semaine', value: 'week' },
          { name: 'All time', value: 'alltime' }
        )
    ),
  async execute(interaction) {
    const period = interaction.options.getString('period');
    console.log(period);
    const currentDate = new Date();
    let timeMax;
    if (period === 'day') {
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
      timeMax = endDate.toISOString();
    }
    if (period === 'week') {
      const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
      timeMax = endOfWeek.toISOString();
    }
    await interaction.deferReply();
    let events;
    if (period === 'day' || period === 'week') {
      events = await getEventsWithTimeMax(timeMax);
    } else {
      events = await getEventsLifeTime();
    }
    if (events.length) {
      const eventChunks = chunkEvents(events);
      eventChunks.forEach((eventChunk, index) => {
        const reponse = formatEventChunk(eventChunk, index);
        interaction.followUp(reponse);
      });
    } else {
      await interaction.followUp('Aucun événement trouvé.');
    }
  },
};

const chunkEvents = (events) => {
  const eventChunks = [];
  for (let i = 0; i < events.length; i += chunkSize) {
    const chunk = events.slice(i, i + chunkSize);
    eventChunks.push(chunk);
  }
  return eventChunks;
};

const formatEventChunk = (eventChunk, chunkNumber) => {
  let eventList = 'Liste des événements :\n\n';
  const multiplier = chunkNumber * chunkSize;
  eventChunk.forEach((event, index) => {
    const eventIndex = multiplier + index + 1;
    let start;
    let end;
    if (event.start.dateTime === undefined) {
      start = new Date(event.start.date).toLocaleString();
      end = new Date(event.end.date).toLocaleString();
    } else {
      start = new Date(event.start.dateTime).toLocaleString();
      end = new Date(event.end.dateTime).toLocaleString();
    }
    let company;
    if (event.colorId === '1') {
      company = 'AKANEMA';
    } else if (event.colorId === '2') {
      company = 'UNIVR';
    } else {
      company = 'N/D';
    }
    const eventText =
      `${eventIndex}. [${event.id}] - ${event.summary}\n` +
      `   - Date de début : ${start}\n` +
      `   - Date de fin : ${end}\n` +
      `   - Entreprise : ${company}\n\n`;

    eventList += eventText;
  });
  return eventList;
};
