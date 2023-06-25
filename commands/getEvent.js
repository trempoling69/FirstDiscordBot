const { SlashCommandBuilder } = require('discord.js');
const { getEventsWithTimeMax, getEventsLifeTime } = require('../service/getEvents');
const asciiTable = require('ascii-table');

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
      eventChunks.forEach((eventChunk) => {
        const reponse = formatEventChunk(eventChunk);
        interaction.followUp(reponse);
      });
    } else {
      await interaction.followUp('Aucun événement trouvé.');
    }
  },
};

const chunkEvents = (events) => {
  const chunkSize = 5;
  const eventChunks = [];
  for (let i = 0; i < events.length; i += chunkSize) {
    const chunk = events.slice(i, i + chunkSize);
    eventChunks.push(chunk);
  }
  return eventChunks;
};

const formatEventChunk = (eventChunk) => {
  let response;
  const table = new asciiTable('Liste des évènements');
  table.setHeading('Titre', 'Date de début', 'Date de fin', 'entreprise', 'id évènement');
  eventChunk.forEach((event) => {
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
    table.addRow(event.summary, start, end, company, event.id);
  });
  response = 'Voici les évènement à venir :\n```' + table.toString() + '```';
  return response;
};
// /opt/alt/alt-nodejs16/root/usr/bin/node ~/botDiscordDeploy/index.js
