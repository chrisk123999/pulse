let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
let data = require('../../items.json');
let data2 = require('../../motoItems.json');
let items = data.items.concat(data2.items);
let Fuse = require('fuse.js');
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
        let items = fuse.search(itemName, {'limit': 10});
        if (!items.length) {
            await interaction.reply('No items found (' + itemName + ')! If you are looking for a monster feature, use /monsterautomations.');
            return;
        }
        let message = '';
        for (let i of items) {
            if (i.item.source === 'cpr') {
                message += '\nCauldron of Plentiful Resources: ' + i.item.name + ' (' + i.item.rules + ')';
            } else if (i.item.source === 'rr') {
                message += '\nRest Recovery: ' + i.item.name;
            } else if (i.item.source === 'gps') {
                message += '\nGambit\'s Premades: ' + i.item.name + ' (' + i.item.rules + ')';
            } else if (i.item.source === 'misc') {
                message += '\nMidi Item Showcase: ' + i.item.name + ' (' + i.item.rules + ')';
            } else if (i.item.source === 'ddbi') {
                message += '\nD&D Beyond Importer: ' + i.item.name;
            } else if (i.item.source === 'piss') {
                message += '\nItems & Scripts Showcase: ' + i.item.name;
            } else if (i.item.source === 'midi') {
                message += '\nMidi-Qol Sample Items: ' + i.item.name;
            } else {
                message += '\nUnknown: ' + i.item.name;
            }
        }
        let embed = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle('Found Items (' + itemName + '):')
            .setDescription(message);
        await interaction.reply({'embeds': [embed]});
    },
    'guild': 'all'
}