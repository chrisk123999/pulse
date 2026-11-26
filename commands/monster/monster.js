let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
let data = require('../../monsterItems.json');
let items = data.items;
let Fuse = require('fuse.js');
let {formatResults} = require('../../sources.js');
let options = {
    keys: [
        'name',
        'monster'
    ],
    includeScore: true,
    threshold: 0.3
};
let fuse = new Fuse(items, options);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('monsterautomations')
        .setDescription('Find monster automations from CPR, GPS, and MISC.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the monster feature.')
                .setRequired(true)),
    async execute(interaction) {
        let itemName = interaction.options.getString('name');
        let items = fuse.search(itemName, {'limit': 20});
        if (!items.length) {
            await interaction.reply('No monster features found (' + itemName + ')!');
            return;
        }
        let message = formatResults(items, true);
        let embed = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle('Found Items (' + itemName + '):')
            .setDescription(message);
        await interaction.reply({'embeds': [embed]});
    },
    'guild': 'all'
}