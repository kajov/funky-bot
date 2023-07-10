const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands, registerSlashCommands} = require('./commands');
const { initializePlayer } = require('./player');
const { discord_token } = require('./config.json');
g
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log('Bot is ready!');
    client.guilds.cache.forEach((guild) => {
        registerCommands(guild); // Register slash commands for each guild the bot is in
    });
    registerSlashCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    registerCommands(interaction); // Pass the interaction to the commands file
});

initializePlayer(client); // Pass the client to the player file

client.login(discord_token);
