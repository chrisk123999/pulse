let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
let data = require('../../items.json');
let data2 = require('../../motoItems.json');
let items = data.items.concat(data2.items);
let Fuse = require('fuse.js');
let {formatResults} = require('../../sources.js');
let options = {
    keys: [
        'name'
    ],
    includeScore: true,
    threshold: 0.3
};
let fuse = new Fuse(items, options);
module.exports = {
    'data': new SlashCommandBuilder()
        .setName('automations')
        .setDescription('Find an automation from CPR, GPS, MISC, DDBI, RR, and PISS.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the item.')
                .setRequired(true)),
    async execute(interaction) {
        let itemName = interaction.options.getString('name');
        let items = fuse.search(itemName, {'limit': 20});
        if (!items.length) {
            await interaction.reply('No items found (' + itemName + ')! If you are looking for a monster feature, use /monsterautomations.');
            return;
        }
        let message = formatResults(items, false);
        let embed = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle('Found Items (' + itemName + '):')
            .setDescription(message);
        await interaction.reply({'embeds': [embed]});
    },
    'guild': 'all'
}