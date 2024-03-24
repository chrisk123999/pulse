let fs = require('node:fs');
let path = require('node:path');
let {Client, Collection, Events, GatewayIntentBits, EmbedBuilder} = require('discord.js');
let {token, bugReports, featureRequests} = require('./config.json');
let client = new Client({'intents': [GatewayIntentBits.Guilds]});
client.commands = new Collection();
let foldersPath = path.join(__dirname, 'commands');
let commandFolders = fs.readdirSync(foldersPath);
async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
for (let folder of commandFolders) {
	let commandsPath = path.join(foldersPath, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (let file of commandFiles) {
		let filePath = path.join(commandsPath, file);
		let command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
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
client.on(Events.ThreadCreate, async (thread, newlyCreated) => {
    if (!newlyCreated) return;
	await sleep(500);
    if (thread.parentId === bugReports) {
		console.log('Bug Report Created: ' + thread.name);
        thread.send({'embeds': [bugReportEmbed]});
    } else if (thread.parentId === featureRequests) {
		console.log('Feature Request Created: ' + thread.name);
        thread.send({'embeds': [featureRequestEmbed]});
    } else {
		console.log('Other Thread Created:' + thread.name);
	}
});
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	let command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({'content': 'There was an error while executing this command!', 'ephemeral': true});
		} else {
			await interaction.reply({'content': 'There was an error while executing this command!', 'ephemeral': true});
		}
	}
});
client.login(token);