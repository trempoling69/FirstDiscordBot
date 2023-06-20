const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Non pas ça'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
