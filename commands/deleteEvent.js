const { SlashCommandBuilder } = require('discord.js');
const getOneEvent = require('../service/getOneEvent');
const { errorGeneralRequest } = require('../messageBuilder/errorMessage');
const {
  confirmMessageGetOneEventReactDelete,
  confirmDeleteEvent,
  confirmationNotDeleteEvent,
} = require('../messageBuilder/successMessage');
const deleteEventRequest = require('../service/deleteEvent');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('supprimer')
    .setDescription('Supprimer un évènement avec son ID')
    .addStringOption((option) =>
      option.setName('id_event').setDescription("ID google caldendar de l'évènement à supprimer").setRequired(true)
    ),
  async execute(interaction) {
    const idEventToDelete = interaction.options.getString('id_event');
    const eventRequest = await getOneEvent(idEventToDelete);
    const msgToDelete = [];
    if (eventRequest.status !== 200) {
      const error = errorGeneralRequest(
        "lors de la récupération de l'évènement",
        `Je ne suis pas parvenu à récupérer l'évènement défini par l'id : ${idEventToDelete}`,
        eventRequest.error
      );
      return await interaction.reply({ embeds: [error] });
    }
    const event = eventRequest.event;
    let company;
    if (event.colorId === '1') {
      company = 'AKANEMA';
    } else if (event.colorId === '2') {
      company = 'UNIVR';
    } else {
      company = 'N/D';
    }
    let start;
    let end;
    if (event.start.dateTime === undefined) {
      start = new Date(event.start.date).toLocaleString();
      end = new Date(event.end.date).toLocaleString();
    } else {
      start = new Date(event.start.dateTime).toLocaleString();
      end = new Date(event.end.dateTime).toLocaleString();
    }
    const confirmDelete = confirmMessageGetOneEventReactDelete(
      idEventToDelete,
      event.summary,
      event.description,
      start,
      end,
      company,
      event.htmlLink
    );
    const collectorFilter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
    };
    const msgConf = await interaction.reply({ embeds: [confirmDelete], fetchReply: true });
    msgToDelete.push(msgConf.id);
    await Promise.all([msgConf.react('✅'), msgConf.react('❌')]);
    msgConf
      .awaitReactions({ filter: collectorFilter, max: 1, time: 60000, error: ['time'] })
      .then(async (collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === '✅') {
          const deleteResult = await deleteEventRequest(idEventToDelete);
          if (deleteResult.status === 204) {
            const confirmation = confirmDeleteEvent(start);
            interaction.channel.bulkDelete(msgToDelete, true);
            interaction.channel.send({ embeds: [confirmation] });
          } else {
            const msg = errorGeneralRequest(
              "durant la suppression de l'évènement",
              `Impossible de supprimer l'évènement défini par l'id : ${idEventToDelete}. code erreur : ${deleteResult.status}`,
              deleteResult.error
            );
            interaction.channel.send({ embeds: [msg] });
          }
        } else {
          const msgNotDelete = confirmationNotDeleteEvent();
          interaction.channel.bulkDelete(msgToDelete, true);
          interaction.channel.send({ embeds: [msgNotDelete] });
        }
      });
  },
};
