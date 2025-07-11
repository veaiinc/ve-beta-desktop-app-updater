export const parseVideoUrl = (url) => {
	if (!url) return { platform: 'unknown', id: null };
	const youtubeRegex =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
	const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]{6,11})/;
	const facebookRegex = /(?:facebook\.com\/.*\/videos\/|fb\.watch\/)([0-9]+)/;
	const dropboxRegex = /dropbox\.com\/s\/([a-z0-9]+)/;

	if (youtubeRegex.test(url)) {
		const match = url.match(youtubeRegex);
		return { platform: 'youtube', id: match[1] };
	} else if (vimeoRegex.test(url)) {
		const match = url.match(vimeoRegex);
		return { platform: 'vimeo', id: match[1] };
	} else if (facebookRegex.test(url)) {
		const match = url.match(facebookRegex);
		return { platform: 'facebook', id: match[1] };
	} else if (dropboxRegex.test(url)) {
		const match = url.match(dropboxRegex);
		return { platform: 'dropbox', id: match[1] };
	}
	return { platform: 'unknown', id: null };
};

// Function to get thumbnail URL (no external API calls)
export const getThumbnailUrl = (video) => {
	if (!video?.embeddedLink) return 'https://via.placeholder.com/640x360?text=No+Video+Available';
	const { platform, id } = parseVideoUrl(video.embeddedLink);
	if (platform === 'youtube') {
		return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
	} else if (platform === 'vimeo') {
		return `https://i.vimeocdn.com/video/${id}.jpg`;
	} else if (platform === 'facebook') {
		return 'https://via.placeholder.com/640x360?text=Facebook+Thumbnail+Not+Available';
	} else if (platform === 'dropbox') {
		return 'https://via.placeholder.com/640x360?text=Dropbox+Thumbnail+Not+Available';
	}
	return 'https://via.placeholder.com/640x360?text=Unknown+Video+Source';
};

// Function to get embed URL or direct video URL for playback
export const getEmbedUrl = (video) => {
	if (!video?.embeddedLink) return null;
	const { platform, id } = parseVideoUrl(video.embeddedLink);
	if (platform === 'youtube') {
		return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
	} else if (platform === 'vimeo') {
		return `https://player.vimeo.com/video/${id}?autoplay=0&title=0&byline=0&portrait=0`;
	} else if (platform === 'facebook') {
		return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
			video.embeddedLink,
		)}&autoplay=0`;
	} else if (platform === 'dropbox') {
		return video.embeddedLink
			.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
			.replace('?dl=0', '?dl=1');
	}
	return null;
};
