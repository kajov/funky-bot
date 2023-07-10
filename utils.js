const ytsr = require('ytsr');

async function getVideoInfo(query) {
    try {
        const filters = await ytsr.getFilters(query);
        const filter = filters.get('Type').find((o) => o.name === 'Video');
        const searchResults = await ytsr(filter.url, { limit: 1 });

        if (searchResults && searchResults.items.length > 0) {
            const video = searchResults.items[0];
            return {
                title: video.title,
                url: video.url,
            };
        }
    } catch (error) {
        console.error(error);
    }
    try {
        const response = await searchVideos(query); // Use the searchVideos function from player.js
        if (response.length > 0) {
            return response[0];
        }
    } catch (error) {
        console.error('Error getting video info:', error);
    }

    return null;
}

module.exports = {
    getVideoInfo: async (query) => {
        try {
            const searchResults = await ytdl.search(query, { limit: 1 });
            const video = searchResults.videos[0];
            return {
                title: video.title,
                url: video.url,
            };
        } catch (error) {
            console.error('Error getting video info:', error);
            return null;
        }
    }
};

