let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    'data': new SlashCommandBuilder()
        .setName('kofi')
        .setDescription('Displays Chris\'s KoFi link.'),
    async execute(interaction) {
        await interaction.reply('https://ko-fi.com/chrisk123999');
    },
    'guild': 'cpr'
}