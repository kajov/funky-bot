const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

let voiceConnection;
let audioPlayer;

function initializePlayer(client) {
    audioPlayer = createAudioPlayer();

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (oldState.member?.user.bot || newState.member?.user.bot) return;

        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        if (!oldChannel && newChannel) {
            // User joined a voice channel
            voiceConnection = joinVoiceChannel({
                channelId: newChannel.id,
                guildId: newChannel.guild.id,
                adapterCreator: newChannel.guild.voiceAdapterCreator,
            });

            voiceConnection.subscribe(audioPlayer);
        } else if (!newChannel && oldChannel) {
            // User left a voice channel
            if (voiceConnection && oldChannel.members.size === 1) {
                voiceConnection.disconnect();
            }
        }
    });

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
        // Playback finished, do something (e.g., play the next song in the queue)
    });
}

async function play(query) {
    if (!voiceConnection) {
        // Bot is not connected to a voice channel
        return;
    }

    const videos = await searchVideos(query);
    if (videos.length === 0) {
        // No videos found
        return;
    }

    const video = videos[0];
    const stream = ytdl(video.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    audioPlayer.play(resource);
}

async function searchVideos(query) {
    try {
        const searchResults = await ytdl.search(query, { limit: 5 });
        return searchResults.videos;
    } catch (error) {
        console.error('Error searching videos:', error);
        return [];
    }
}

module.exports = { initializePlayer, play };
