let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    'data': new SlashCommandBuilder()
        .setName('support')
        .setDescription('Displays the support message.'),
    async execute(interaction) {
        let embed = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle('Support')
            .setDescription('This is a friendly message asking you to go to https://discord.com/channels/1089258451949064296/1089265187141455923 and describe your issue with:\n1. The behavior you are experiencing.\n2. The behavior you expect.\n3. Your exact steps to produce this behavior.\n4. Your troubleshooter file (as shown below).')
            .setImage('https://raw.githubusercontent.com/chrisk123999/pulse/main/images/troubleshoot.gif');
        await interaction.reply({'embeds': [embed]});
    },
    'guild': 'cpr'
}