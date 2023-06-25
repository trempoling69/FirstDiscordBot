const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Description de toutes les commandes possible'),
  async execute(interaction) {
    const helpEmbedsMessage = new EmbedBuilder()
      .setColor(0xFFB200)
      .setAuthor({
        name: 'Maitre de la salle',
        iconURL: process.env.LINK_AVATAR_AUTOR,
      })
      .setTitle('Guide des commandes')
      .setDescription('Je vais vous montrer tout ce que vous pouvez faire avec moi')
      .addFields(
        {
          name: '/create {entreprise}',
          value:
            "Cette commande permet de créer un évènement. Il prend AKANEMA ou UNIVR en option afin d'attribuer une couleur à l'évènement. Pour l'utiliser il suffit de faire la commande et ensuite remplir la modal qui s'affiche en respectant bien le format des dates.",
        },
        {
          name: '/getevent {periode}',
          value:
            "Cette commande permet d'afficher tous les évènements à venir. L'option peut être Jour, Semaine ou All time. **Jour** permet d'obtenir les event dans la journée, **semaine** dans la semaine et **all time** tous les évènements sans limite de temps.",
        },
        {
          name: '!supprimer {id_event}',
          value:
            "Cette commande permet de supprimer un évènement. Il faut entrer un id d'évènement et je me charge de le supprimer",
        },
        {
          name: '/ping',
          value: 'Oui bon celui là sert à rien à part vérifier que je fonctionne bien',
        }
      )
      .setFooter({
        text: 'Guide du bot',
        iconURL: process.env.LINK_AVATAR_AUTOR,
      })
      .setTimestamp();
    await interaction.reply({ embeds: [helpEmbedsMessage] });
  },
};
