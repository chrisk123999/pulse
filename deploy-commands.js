let {REST, Routes} = require('discord.js');
let {clientId, cprGuildId, token} = require('./config.json');
let fs = require('node:fs');
let path = require('node:path');
let cprCommands = [];
let allCommands = [];
let foldersPath = path.join(__dirname, 'commands');
let commandFolders = fs.readdirSync(foldersPath);
for (let folder of commandFolders) {
	let commandsPath = path.join(foldersPath, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (let file of commandFiles) {
		let filePath = path.join(commandsPath, file);
		let command = require(filePath);
		if ('data' in command && 'execute' in command && 'guild' in command) {
			if (command.guild === 'cpr') {
				cprCommands.push(command.data.toJSON());
			} else if (command.guild === 'all') {
				allCommands.push(command.data.toJSON());
			}
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
let rest = new REST().setToken(token);
async function registerCommands() {
	try {
		console.log('Adding CPR server commands.');
		let cprData = await rest.put(
			Routes.applicationGuildCommands(clientId, cprGuildId),
			{'body': cprCommands}
		);
		console.log('Added / refreshed ' + cprData.length + ' CPR server commands.');
		console.log('Adding server commands for all servers.')
		let allData = await rest.put(
			Routes.applicationCommands(clientId),
			{'body': allCommands}
		);
		console.log('Added / refreshed ' + allData.length + ' commands for all servers.')
	} catch (error) {
		console.error(error);
	}
}
registerCommands();