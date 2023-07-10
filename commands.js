const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, discord_token } = require('./config.json');
const { play } = require('./player.js')


const commands = [
    // Define your commands here
    {
        name: 'play',
        description: 'Play a YouTube video',
        options: [
            {
                name: 'query',
                type: 3,
                description: 'The YouTube video URL or search query',
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '9' }).setToken(discord_token);

async function registerCommands(interaction) {
    const { commandName, options } = interaction;
    // ------- Debug ----- Uncomment this for Debug to see interactions received
    console.log('Interaction received:', interaction);
    // -------------------
    if (commandName === 'play') {
        // Handle the /play command here
        const query = options.getString('query');
        // Call the play function in the player file with the query
        await play(query); // Call the play function in the player file with the query
    }
}


async function registerSlashCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerCommands, registerSlashCommands };
