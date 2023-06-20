const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const play = require('./commands/play');
const getevent = require('./commands/getEvent');
const {
  errorFormatDateReservation,
  errorUseCommandReservation,
  errorAvailibityMeetingRoom,
  errorUseCommandSupprimer,
  errorMessageGeneralSuppression,
} = require('./messageBuilder/errorMessage');
const checkavailability = require('./service/checkAvailibility');
const {
  descriptionMeetingGetReact,
  initilisationMessageGetTitleDescription,
  confirmMessageSuccessPostEvent,
  confirmMessageGetOneEventReactDelete,
  confirmationNotDeleteEvent,
  confirmDeleteEvent,
} = require('./messageBuilder/successMessage');
const postEvent = require('./service/postEvent');
const getOneEvent = require('./service/getOneEvent');
const deleteEvent = require('./service/deleteEvent');

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
                console.log('react');
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
      const error = errorMessageGeneralSuppression(id_event, "lors de la récupération de l'évènement", event.error);
      return message.channel.send({ embeds: [error] });
    } else {
      const eventToDelete = event.event;
      let company;
      if (eventToDelete.colorId === '4') {
        company = 'AKANEMA';
      } else if (eventToDelete.colorId === '6') {
        company = 'UNIVR';
      } else {
        company = 'N/D';
      }
      const msg = confirmMessageGetOneEventReactDelete(
        id_event,
        eventToDelete.summary,
        eventToDelete.description,
        eventToDelete.start.dateTime,
        eventToDelete.end.dateTime,
        company,
        eventToDelete.htmlLink
      );
      const collectorFilter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
      };
      message.channel.send({ embeds: [msg] }).then((m) => {
        messageToDelete.push(m.id);
        Promise.all([m.react('✅'), m.react('❌')]).then(() => {
          m.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] }).then(
            async (collected) => {
              const reaction = collected.first();
              if (reaction.emoji.name == '✅') {
                const deleteResult = await deleteEvent(id_event);
                if (deleteResult.status === 204) {
                  const msg = confirmDeleteEvent(eventToDelete.start.dateTime);
                  messageToDelete.push(message.id);
                  message.channel.bulkDelete(messageToDelete, true);
                  message.channel.send({ embeds: [msg] });
                } else {
                  const msg = errorMessageGeneralSuppression(
                    id_event,
                    "durant la suppression de l'évènement",
                    deleteResult.error
                  );
                  message.channel.send({ embeds: [msg] });
                }
              } else {
                const msg = confirmationNotDeleteEvent();
                message.channel.send({ embeds: [msg] });
              }
            }
          );
        });
      });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await play.execute(interaction);
  } else if (interaction.commandName === 'getevent') {
    await getevent.execute(interaction);
  }
});

module.exports = client;
