const { SlashCommandBuilder } = require('discord.js');
const { getEvents } = require('../service/getEvents');
const asciiTable = require('ascii-table');

module.exports = {
  data: new SlashCommandBuilder().setName('getevent').setDescription('Obtenir les évènements à venir'),
  async execute(interaction) {
    await interaction.deferReply();
    const events = await getEvents();
    let response;
    if (events.length) {
      const eventChunks = chunkEvents(events);
      console.log(eventChunks);
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
    const start = new Date(event.start.dateTime).toLocaleString();
    const end = new Date(event.end.dateTime).toLocaleString();
    let company;
    if (event.colorId === '4') {
      company = 'AKANEMA';
    } else if (event.colorId === '6') {
      company = 'UNIVR';
    } else {
      company = 'N/D';
    }
    table.addRow(event.summary, start, end, company, event.id);
  });
  response = 'Voici les évènement à venir :\n```' + table.toString() + '```';
  return response;
};
