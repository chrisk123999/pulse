let {Client, Events, GatewayIntentBits, EmbedBuilder} = require('discord.js');
let {token, bugReports, featureRequests} = require('./config.json');
let client = new Client({'intents': [GatewayIntentBits.Guilds]});
let bugReportEmbed = new EmbedBuilder()
    .setColor('DarkGreen')
    .setTitle('Required Information Needed')
    .setDescription(`This is **not** a troubleshooting thread, please seek assistance in #support before making a bug report. 
    > - Provide** exact steps** to reproduce the bug, describe what behavior you expect, and what behavior you're getting.
    > - Include your **CPR troubleshooter log**, from the module settings under the Help button.
    > - Include full screenshots of any errors (red text) in console (f12).
    
    If you do not follow these post guidelines, you will likely be redirected to #support and your post will be closed.`);
let featureRequestEmbed = new EmbedBuilder()
    .setColor('DarkGreen')
    .setTitle('Required Information Needed')
    .setDescription(`Any feature requests you would like to see implemented in this module. Please include a link to the feature/monster in D&DBeyond (if applicable) and title your post with the feature/creature name. Do not include descriptions.`);
client.once(Events.ClientReady, readyClient => {
    console.log('Ready! Logged in as ' + readyClient.user.tag);
    client.user.setStatus('online');
});
client.on(Events.ThreadCreate, (thread, newlyCreated) => {
    if (!newlyCreated) return;
    if (thread.parentId === bugReports) {
        thread.send({'embeds': [bugReportEmbed]});
    } else if (thread.parentId === featureRequests) {
        thread.send({'embeds': [featureRequestEmbed]});
    }
});
client.login(token);