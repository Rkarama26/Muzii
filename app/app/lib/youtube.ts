// lib/youtube.ts
export async function getYouTubeVideoDetails(videoId: string) {
    const apiKey = process.env.YT_API_KEY as string;

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch video details from YouTube API");
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("No video found with that ID");
    }

    const snippet = data.items[0].snippet;
    const thumbnails = snippet.thumbnails;

    return {
        title: snippet.title,
        description: snippet.description,
        thumbnails,
        channelTitle: snippet.channelTitle,
    };
}
