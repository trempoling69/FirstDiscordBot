const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
require('dotenv').config();

const play = require('./commands/play');
const getevent = require('./commands/getEvent');
const {
  errorFormatDateReservation,
  errorUseCommandReservation,
  errorAvailibityMeetingRoom,
  errorUseCommandSupprimer,
  errorGeneralRequest,
} = require('./messageBuilder/errorMessage');
const checkavailability = require('./service/checkAvailibility');
const {
  descriptionMeetingGetReact,
  initilisationMessageGetTitleDescription,
  confirmMessageSuccessPostEvent,
  confirmMessageGetOneEventReactDelete,
  confirmationNotDeleteEvent,
  confirmDeleteEvent,
  successModalCreateEvent,
  successDismissEvent,
} = require('./messageBuilder/successMessage');
const postEvent = require('./service/postEvent');
const getOneEvent = require('./service/getOneEvent');
const deleteEventRequest = require('./service/deleteEvent');
const createEvent = require('./commands/createEvent');
const help = require('./commands/help');
const deleteEvent = require('./commands/deleteEvent');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const prefix = '!';

client.commands = new Collection();

client.commands.set(play.data.name, play);
client.commands.set(getevent.data.name, getevent);
client.commands.set(createEvent.data.name, createEvent);
client.commands.set(help.data.name, help);
client.commands.set(deleteEvent.data.name, deleteEvent);

client.on('ready', () => {
  console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  // !reservation début fin
  if (command === 'reservation') {
    if (args.length !== 2) {
      const error = errorUseCommandReservation;
      return message.channel.send({ embeds: [error] });
    }
    const startDate = new Date(args[0]);
    const endDate = new Date(args[1]);
    const idMessageToDelete = [];
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      const error = errorFormatDateReservation;
      return message.channel.send({ embeds: [error] });
    }
    const availibility = await checkavailability(startDate, endDate);
    if (!availibility) {
      const error = errorAvailibityMeetingRoom;
      return message.channel.send({ embeds: [error] });
    }
    const init = initilisationMessageGetTitleDescription(startDate, endDate);
    message.channel.send({ embeds: [init] }).then((sentMessage) => {
      idMessageToDelete.push(sentMessage.id);
    });
    let title = '';
    let description = '';
    const filter = (m) => m.author.id === message.author.id;
    const collectorTitle = message.channel.createMessageCollector({
      filter: filter,
      max: 1,
      time: 60000,
    });
    collectorTitle.on('collect', async (m) => {
      title = m.content;
      await m.react('👍');
    });
    collectorTitle.on('end', (collected, reason) => {
      if (reason === 'time') {
        return message.reply("Mais, mais, tu m'as oublié ? :cry:");
      }
      const collectorDescription = message.channel.createMessageCollector({
        filter: filter,
        max: 1,
        time: 60000,
      });
      collectorDescription.on('collect', async (m) => {
        description = m.content;
        await m.react('👍');
      });
      collectorDescription.on('end', (collected, reason) => {
        if (reason === 'time') {
          return message.reply("Mais, mais, tu m'as oublié ? :cry:");
        }
        const descriptif = descriptionMeetingGetReact(startDate, endDate, title, description);
        const collectorFilter = (reaction, user) => {
          return ['🔴', '🟠'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        message.channel.send({ embeds: [descriptif] }).then((mess) => {
          idMessageToDelete.push(mess.id);
          Promise.all([mess.react('🟠'), mess.react('🔴')]).then(() => {
            mess
              .awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
              .then(async (collected) => {
                const reaction = collected.first();
                let color;
                let company;
                if (reaction.emoji.name === '🔴') {
                  color = '4';
                  company = 'AKANEMA';
                } else {
                  color = '6';
                  company = 'UNIVR';
                }
                const postEventReponse = await postEvent(title, startDate, endDate, color, description);
                if (postEventReponse.status === 200) {
                  idMessageToDelete.push(collectorTitle.collected.firstKey());
                  idMessageToDelete.push(collectorDescription.collected.firstKey());
                  idMessageToDelete.push(message.id);
                  message.channel.bulkDelete(idMessageToDelete, true);
                  const confirmationMessage = confirmMessageSuccessPostEvent(
                    startDate,
                    endDate,
                    title,
                    description,
                    company,
                    postEventReponse.htmlLink
                  );
                  message.channel.send({ embeds: [confirmationMessage] });
                }
              })
              .catch((collected) => {
                message.reply('Problème de récupération de ta magnifique réaction');
              });
          });
        });
      });
    });
  } else if (command === 'supprimer') {
    // !supprimer id
    if (args.length !== 1) {
      const error = errorUseCommandSupprimer;
      return message.channel.send({ embeds: [error] });
    }
    const messageToDelete = [];
    const id_event = args[0];
    const event = await getOneEvent(id_event);
    if (event.status !== 200) {
      const error = errorGeneralRequest(
        "lors de la récupération de l'évènement",
        `Je ne suis pas parvenu à récupérer l'évènement défini par l'id : ${id_event}`,
        event.error
      );
      return message.channel.send({ embeds: [error] });
    }
    const eventToDelete = event.event;
    let company;
    if (eventToDelete.colorId === '4') {
      company = 'AKANEMA';
    } else if (eventToDelete.colorId === '6') {
      company = 'UNIVR';
    } else {
      company = 'N/D';
    }

    let eventToDeleteStartDate;
    let eventToDeleteEndDate;
    if (eventToDelete.start.dateTime === undefined) {
      eventToDeleteStartDate = eventToDelete.start.date;
      eventToDeleteEndDate = eventToDelete.end.date;
    } else {
      eventToDeleteStartDate = eventToDelete.start.dateTime;
      eventToDeleteEndDate = eventToDelete.end.dateTime;
    }
    const msg = confirmMessageGetOneEventReactDelete(
      id_event,
      eventToDelete.summary,
      eventToDelete.description,
      eventToDeleteStartDate,
      eventToDeleteEndDate,
      company,
      eventToDelete.htmlLink
    );
    const collectorFilter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    message.channel.send({ embeds: [msg] }).then((m) => {
      messageToDelete.push(m.id);
      Promise.all([m.react('✅'), m.react('❌')]).then(() => {
        m.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
          const reaction = collected.first();
          if (reaction.emoji.name == '✅') {
            const deleteResult = await deleteEventRequest(id_event);
            if (deleteResult.status === 204) {
              const msg = confirmDeleteEvent(eventToDeleteStartDate);
              messageToDelete.push(message.id);
              message.channel.bulkDelete(messageToDelete, true);
              message.channel.send({ embeds: [msg] });
            } else {
              const msg = errorGeneralRequest(
                "durant la suppression de l'évènement",
                `Impossible de supprimer l'évènement défini par l'id : ${id_event}. code erreur : ${deleteResult.status}`,
                deleteResult.error
              );
              message.channel.send({ embeds: [msg] });
            }
          } else {
            const msg = confirmationNotDeleteEvent();
            message.channel.send({ embeds: [msg] });
          }
        });
      });
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await play.execute(interaction);
  } else if (interaction.commandName === 'getevent') {
    await getevent.execute(interaction);
  } else if (interaction.commandName === 'create') {
    await createEvent.execute(interaction);
  } else if (interaction.commandName === 'help') {
    await help.execute(interaction);
  } else if (interaction.commandName === 'delete') {
    await deleteEvent.execute(interaction);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'createEventModal') {
    const startDateString = interaction.fields.getTextInputValue('EventStartDate');
    const endDateString = interaction.fields.getTextInputValue('EventEndDate');
    const title = interaction.fields.getTextInputValue('EventTitle');
    const description = interaction.fields.getTextInputValue('EventDescription');
    const company = interaction.fields.getTextInputValue('EventCompany');
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      const error = errorFormatDateReservation;
      return interaction.reply({ embeds: [error] });
    }
    const availibility = await checkavailability(startDate, endDate);
    if (availibility.status !== 200) {
      const errorRequest = errorGeneralRequest(
        'durant la requête de vérification de disponibilité',
        `La requête n'a pas pu aboutir correctement, elle a renvoyé le code erreur ${availibility.status}`,
        availibility.error
      );
      return interaction.reply({ embeds: [errorRequest] });
    }
    if (!availibility.availibility) {
      const error = errorAvailibityMeetingRoom;
      return interaction.reply({ embeds: [error] });
    }
    const collectorFilter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
    };
    const askValidation = successModalCreateEvent(startDate, endDate, title, description, company);
    const validationMessage = await interaction.reply({ embeds: [askValidation], fetchReply: true });
    await Promise.all([validationMessage.react('✅'), validationMessage.react('❌')]);
    const collected = await validationMessage.awaitReactions({
      filter: collectorFilter,
      max: 1,
      time: 60000,
      errors: ['time'],
    });
    const reaction = collected.first();
    if (reaction.emoji.name === '✅') {
      let color;
      if (company === 'AKANEMA') {
        color = '1';
      } else if (company === 'UNIVR') {
        color = '2';
      } else {
        color = '3';
      }
      const postEventReponse = await postEvent(title, startDate, endDate, color, description);
      if (postEventReponse.status === 200) {
        interaction.channel.bulkDelete([validationMessage.id], true);
        const confirmationMessage = confirmMessageSuccessPostEvent(
          startDate,
          endDate,
          title,
          description,
          company,
          postEventReponse.htmlLink
        );
        interaction.channel.send({ embeds: [confirmationMessage] });
      } else {
        const errorEmbed = errorGeneralRequest(
          "durant la requête de création d'évènement",
          `Je suis moins smart que chatGPT alors si le code erreur te dis rien j'ai peur de pas être d'une grande aide. (code: ${postEventReponse.status})`,
          postEventReponse.errorMessage
        );
        interaction.channel.send({ embeds: [errorEmbed] });
      }
    } else {
      interaction.channel.bulkDelete([validationMessage.id], true);
      const confirmNoReservation = successDismissEvent();
      interaction.channel.send({ embeds: [confirmNoReservation] });
    }
  }
});
module.exports = client;
