import * as fs from 'fs';
import * as path from 'path';
import schedule from 'node-schedule';
import {Client, Collection, Events, GatewayIntentBits, EmbedBuilder, time} from 'discord.js';
import {cprBugReportEmbed} from './cpr/bugReport.mjs';
import {cprFeatureRequestEmbed} from './cpr/featureRequest.mjs';
import {updateItems} from './automations.mjs';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';
import {updateMotoItems} from './moto.mjs';
import {cprOutOfTownEmbed} from './cpr/outOfTown.mjs';
console.log('----- Starting -----');
let srequire = createRequire(import.meta.url);
let {token, cprGuildId, cprBugReports, cprFeatureRequests, cprSupport} = srequire('./config.json');
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
let client = new Client({'intents': [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]});
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
		let command = srequire(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
client.once(Events.ClientReady, readyClient => {
    console.log('Ready! Logged in as ' + readyClient.user.tag);
    client.user.setStatus('online');
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
client.on(Events.ThreadCreate, async (thread, newlyCreated) => {
    if (!newlyCreated) return;
	await sleep(500);
    switch (thread.guildId) {
        case cprGuildId: {
            switch (thread.parentId) {
                case cprBugReports: {
                    console.log('Bug Report Created: ' + thread.name);
                    thread.send({'embeds': [cprBugReportEmbed]});
                    break;
                }
                case cprFeatureRequests: {
                    console.log('Feature Request Created: ' + thread.name);
                    thread.send({'embeds': [cprFeatureRequestEmbed]});
                    break;
                }
                default: {
                    console.log('Other Thread Created:' + thread.name);
                    break;
                }
            }
            break;
        }
    }
});
/*
let lastMessage = 0;
client.on(Events.MessageCreate, async message => {
	if (message.guildId != cprGuildId) return;
	if (message.channelId != cprSupport) return;
	let currentTime = Date.now();
	if (lastMessage + 1800000 > currentTime) return;
	message.channel.send({'embeds': [cprOutOfTownEmbed]});
	console.log('Out of Town embed created in support.');
	lastMessage = currentTime;
}); */
await updateItems();
await updateMotoItems();
client.login(token);
//schedule.scheduleJob('0 8 * * *', updateItems);
//schedule.scheduleJob('5 8 * * 4', updateMotoItems);
