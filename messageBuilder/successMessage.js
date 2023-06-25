const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

const descriptionMeetingGetReact = (startDate, endDate, title, description) => {
  return new EmbedBuilder()
    .setTitle('Créer une réunion')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription('Vous venez de réaliser une demande pour reserver la salle de réunion')
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString()}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString()}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réunion', value: `${title}`, inline: true },
      { name: 'Description de la réunion', value: `${description}`, inline: true }
    )
    .addFields({
      name: 'Dernière chose',
      value: 'Réagissez avec 🔴 pour reserver en tant que AKANEMA et avec 🟠 pour reserver en tant que UNIVR',
    })
    .setFooter({
      text: 'Reservation salle réunion',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const initilisationMessageGetTitleDescription = (startDate, endDate) => {
  return new EmbedBuilder()
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setColor(0xfff700)
    .setTitle("Demande d'information supplémentaire sur la réunion")
    .setThumbnail(process.env.LINK_AVATAR_AUTOR)
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString()}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString()}`, inline: true }
    )
    .addFields({
      name: 'Action à réaliser',
      value:
        "Je vais maintenant vous demander de m'envoyer **deux messages différents**, l'un avec votre **titre** pour la réunion l'autre avec sa **description**",
    })
    .setTimestamp()
    .setFooter({
      text: "Prise d'information",
      iconURL: process.env.LINK_AVATAR_AUTOR,
    });
};

const confirmMessageSuccessPostEvent = (startDate, endDate, title, description, company, link) => {
  return new EmbedBuilder()
    .setTitle('Confirmation de réservation de la salle de réunion')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription("Tout s'est bien déroulé, votre créneau à été réservé vous pouvez le retrouver sur l'agenda")
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString()}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString()}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réunion', value: `${title}` },
      { name: 'Description de la réunion', value: `${description}`, inline: true }
    )
    .addFields(
      {
        name: 'Réservez pour',
        value: `${company}`,
        inline: true,
      },
      { name: "Lien vers l'évènement", value: `${link}` }
    )
    .setFooter({
      text: 'Reservation salle réunion',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const confirmMessageGetOneEventReactDelete = (id, title, description, startDate, endDate, company, link) => {
  return new EmbedBuilder()
    .setTitle("Confirmation de la suppression de l'évènement")
    .setColor(0xfff700)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription(`Voici l'évènement relié à cet id : ${id}`)
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString()}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString()}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réunion', value: `${title}` },
      { name: 'Description de la réunion', value: `${description}`, inline: true }
    )
    .addFields(
      {
        name: 'Réservez pour',
        value: `${company}`,
        inline: true,
      },
      { name: "Lien vers l'évènement", value: `${link}` }
    )
    .addFields(
      { name: 'AVERTISSEMENT', value: 'La suppression est définitive', inline: true },
      { name: 'Confirmation demandée', value: 'Réagissez par ✅ pour valider la suppression', inline: true }
    )
    .setFooter({
      text: 'Reservation salle réunion',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const confirmationNotDeleteEvent = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setColor(0x05b200)
    .setTitle("Confirmation de l'annulation de la suppression de l'évènement")
    .setThumbnail(process.env.LINK_AVATAR_AUTOR)
    .addFields({ name: 'Note', value: "l'évènement n'a pas été supprimé" })
    .setTimestamp()
    .setFooter({
      text: 'confirmation annulation',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    });
};

const confirmDeleteEvent = (date) => {
  return new EmbedBuilder()
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setColor(0x05b200)
    .setTitle(`Confirmation de suppression de l'évènement du ${new Date(date).toLocaleString()}`)
    .setThumbnail(process.env.LINK_AVATAR_AUTOR)
    .addFields(
      { name: 'Note', value: "L'évènement a été supprimé avec succès", inline: true },
      { name: 'Commentaire', value: 'Entre nous, il devait pas être si important que ça', inline: true }
    )
    .setTimestamp()
    .setFooter({
      text: 'confirmation suppression',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    });
};

const successModalCreateEvent = (startDate, endDate, title, description, company) => {
  return new EmbedBuilder()
    .setTitle('Créer une réunion')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription('Vous venez de réaliser une demande pour reserver la salle de réunion')
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString()}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString()}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réunion', value: `${title}`, inline: true },
      { name: 'Description de la réunion', value: `${description}`, inline: true },
      { name: 'Entreprise', value: `${company}`, inline: true }
    )
    .addFields({
      name: 'Dernière chose',
      value: 'Réagissez avec ✅ pour valider la réservation et avec ❌ pour annuler la reservation',
    })
    .setFooter({
      text: 'Reservation salle réunion',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};
module.exports = {
  descriptionMeetingGetReact,
  initilisationMessageGetTitleDescription,
  confirmMessageSuccessPostEvent,
  confirmMessageGetOneEventReactDelete,
  confirmationNotDeleteEvent,
  confirmDeleteEvent,
  successModalCreateEvent,
};
