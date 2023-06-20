const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

const errorFormatDateReservation = new EmbedBuilder()
  .setTitle('Problème avec le format des dates')
  .setDescription('Pas de panique je vais vous aider à reformuler')
  .setColor(0xff0000)
  .setAuthor({
    name: 'Robot pas content',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setThumbnail('https://www.shutterstock.com/image-vector/error-icon-260nw-696697762.jpg')
  .addFields({
    name: "Rappel de l'utilisation de la commande",
    value: '!reservation <DateDebut> <DateFin>',
  })
  .addFields({
    name: 'Rappel sur le format de date',
    value: 'Les dates doivent être au format AAAA-MM-JJTHH:MM:SS',
  })
  .addFields(
    { name: '18 juin 2023 à 14h30', value: '2023-06-18T14:30:00', inline: true },
    { name: '25 juillet 2023 09h15', value: '2023-07-25T09:15:00', inline: true }
  )
  .setFooter({
    text: 'Erreur de commande',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setTimestamp();

const errorUseCommandReservation = new EmbedBuilder()
  .setTitle('Mauvaise utilisation de la commande !reservation')
  .setDescription('Pas de panique je vais vous aider à reformuler')
  .setColor(0xff0000)
  .setAuthor({
    name: 'Robot pas content',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setThumbnail('https://www.shutterstock.com/image-vector/error-icon-260nw-696697762.jpg')
  .addFields({
    name: "Rappel de l'utilisation de la commande",
    value: '!reservation <DateDebut> <DateFin>',
  })
  .addFields({
    name: 'Rappel sur le format de date',
    value: 'Les dates doivent être au format AAAA-MM-JJTHH:MM:SS',
  })
  .addFields(
    { name: '18 juin 2023 à 14h30', value: '2023-06-18T14:30:00', inline: true },
    { name: '25 juillet 2023 09h15', value: '2023-07-25T09:15:00', inline: true }
  )
  .setFooter({
    text: 'Erreur de commande',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setTimestamp();

const errorAvailibityMeetingRoom = new EmbedBuilder()
  .setTitle("Oh non ! La salle n'est pas disponible :(")
  .setAuthor({
    name: 'Robot pas content',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setColor(0xff0000)
  .setThumbnail('https://www.shutterstock.com/image-vector/error-icon-260nw-696697762.jpg')
  .setDescription("La salle est déjà reserver pour l'intégralité ou une partie du créneau voulu")
  .addFields({
    name: 'Mais comment vais-je faire ?',
    value:
      'Pas de panique ! En tant que magnifique robot je peux vous donner les créneaux déja réservé, il suffit de faire la commande /getevent',
  })
  .setFooter({
    text: 'Erreur de commande',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setTimestamp();

const errorUseCommandSupprimer = new EmbedBuilder()
  .setTitle('Mauvaise utilisation de la commande !supprimer')
  .setDescription('Pas de panique je vais vous aider à reformuler')
  .setColor(0xff0000)
  .setAuthor({
    name: 'Robot pas content',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setThumbnail('https://www.shutterstock.com/image-vector/error-icon-260nw-696697762.jpg')
  .addFields({
    name: "Rappel de l'utilisation de la commande",
    value: '!reservation <id_evenement>',
  })
  .setFooter({
    text: 'Erreur de commande',
    iconURL: process.env.LINK_AVATAR_AUTOR,
  })
  .setTimestamp();

const errorMessageGeneralSuppression = (id, errorType, errorMessage) => {
  return new EmbedBuilder()
    .setTitle(`Mince ! Un problème est servenue ${errorType}`)
    .setDescription(`Je ne suis pas parvenu à récupérer l'évènement défini par l'id : ${id}`)
    .setColor(0xff0000)
    .setAuthor({
      name: 'Robot pas content',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setThumbnail('https://www.shutterstock.com/image-vector/error-icon-260nw-696697762.jpg')
    .addFields({
      name: "Rappel de l'utilisation de la commande",
      value: '!reservation <id_evenement>',
    })
    .addFields({ name: "Voici l'erreur renvoyer par notre ami Google", value: `${errorMessage}` })
    .setFooter({
      text: 'Erreur de requête',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};
module.exports = {
  errorFormatDateReservation,
  errorUseCommandReservation,
  errorAvailibityMeetingRoom,
  errorUseCommandSupprimer,
  errorMessageGeneralSuppression,
};
