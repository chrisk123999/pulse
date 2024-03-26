let {REST, Routes} = require('discord.js');
let {clientId, cprGuildId, token} = require('./config.json');
let fs = require('node:fs');
let path = require('node:path');
let commands = [];
let foldersPath = path.join(__dirname, 'commands');
let commandFolders = fs.readdirSync(foldersPath);
for (let folder of commandFolders) {
	let commandsPath = path.join(foldersPath, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (let file of commandFiles) {
		let filePath = path.join(commandsPath, file);
		let command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
let rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		let data = await rest.put(
			Routes.applicationGuildCommands(clientId, cprGuildId),
			{'body': commands},
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();