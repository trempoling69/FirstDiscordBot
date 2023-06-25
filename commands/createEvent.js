const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Créer une réunion dans la salle')
    .addStringOption((option) =>
      option
        .setName('company')
        .setDescription("Entreprise pour laquelle créer l'évent")
        .setRequired(true)
        .addChoices({ name: 'AKANEMA', value: 'AKANEMA' }, { name: 'UNIVR', value: 'UNIVR' })
    ),
  async execute(interaction) {
    console.log('ok');
    const company = interaction.options.getString('company');
    const modal = new ModalBuilder().setCustomId('createEventModal').setTitle('Réserver la salle');
    modal.companyValue = company;
    const startDate = new TextInputBuilder()
      .setCustomId('EventStartDate')
      .setLabel('Date et heure de début')
      .setPlaceholder('AAAA-MM-JJTHH:MM:SS')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(19)
      .setMinLength(19)
      .setRequired(true);

    const endDate = new TextInputBuilder()
      .setCustomId('EventEndDate')
      .setLabel('Date et heure de fin')
      .setPlaceholder('AAAA-MM-JJTHH:MM:SS')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(19)
      .setMinLength(19)
      .setRequired(true);

    const EventTitle = new TextInputBuilder()
      .setCustomId('EventTitle')
      .setLabel('Titre de la réunion')
      .setPlaceholder('un joli titre ?')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const EventDescription = new TextInputBuilder()
      .setCustomId('EventDescription')
      .setLabel('Description de la réunion')
      .setPlaceholder('une magnifique description ?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const companyField = new TextInputBuilder()
      .setCustomId('EventCompany')
      .setLabel('Entreprise')
      .setValue(company)
      .setStyle(TextInputStyle.Short);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(startDate);
    const secondActionRow = new ActionRowBuilder().addComponents(endDate);
    const thirdActionRow = new ActionRowBuilder().addComponents(EventTitle);
    const fourthActionRow = new ActionRowBuilder().addComponents(EventDescription);
    const fifthActionRow = new ActionRowBuilder().addComponents(companyField);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
    await interaction.showModal(modal);
  },
};
