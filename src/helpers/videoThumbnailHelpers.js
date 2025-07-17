export const parseVideoUrl = (url) => {
	if (!url) return { platform: 'unknown', id: null, hash: null };

	const youtubeRegex =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
	const vimeoRegex =
		/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]{6,11})(?:\/([a-z0-9]+))?/;
	const facebookRegex =
		/(?:facebook\.com\/(?:[^\/]+\/)?(?:videos|share\/v|watch\/v?|reel)\/([a-zA-Z0-9._-]+))(?:\/|\?|$)/;
	const dropboxRegex = /dropbox\.com\/s\/([a-z0-9]+)/;
	const instagramReelRegex = /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/i;

	if (youtubeRegex.test(url)) {
		const match = url.match(youtubeRegex);
		return { platform: 'youtube', id: match[1], hash: null };
	} else if (vimeoRegex.test(url)) {
		const match = url.match(vimeoRegex);
		return { platform: 'vimeo', id: match[1], hash: match[2] || null };
	} else if (facebookRegex.test(url)) {
		const match = url.match(facebookRegex);
		return { platform: 'facebook', id: match[1], hash: null };
	} else if (dropboxRegex.test(url)) {
		const match = url.match(dropboxRegex);
		return { platform: 'dropbox', id: match[1], hash: null };
	} else if (instagramReelRegex.test(url)) {
		const match = url.match(instagramReelRegex);
		return { platform: 'instagram', id: match[1], hash: null };
	}
	return { platform: 'unknown', id: null, hash: null };
};

export const getThumbnailUrl = async (video) => {
	if (!video?.embeddedLink) {
		return 'https://via.placeholder.com/640x360?text=No+Video+Available';
	}

	const { platform } = parseVideoUrl(video.embeddedLink);

	if (platform === 'youtube') {
		const { id } = parseVideoUrl(video.embeddedLink);
		return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
	}

	if (platform === 'vimeo') {
		try {
			const response = await fetch(
				`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(video.embeddedLink)}`,
			);
			if (!response.ok) throw new Error(`Vimeo oEmbed error: ${response.status}`);
			const data = await response.json();
			return data.thumbnail_url;
		} catch (error) {
			console.error('Failed to fetch Vimeo thumbnail:', error);
			return 'https://via.placeholder.com/640x360?text=Vimeo+Thumbnail+Error';
		}
	}

	if (platform === 'facebook') {
		return 'https://via.placeholder.com/640x360?text=Facebook+Thumbnail+Not+Available';
	}

	if (platform === 'dropbox') {
		return 'https://via.placeholder.com/640x360?text=Dropbox+Thumbnail+Not+Available';
	}

	if (platform === 'instagram') {
		return 'https://via.placeholder.com/640x360?text=Instagram+Reel';
	}

	return 'https://via.placeholder.com/640x360?text=Unknown+Video+Source';
};

export const getEmbedUrl = (video) => {
	if (!video?.embeddedLink) {
		return null;
	}
	const { platform, id, hash } = parseVideoUrl(video.embeddedLink);
	if (platform === 'youtube') {
		return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
	} else if (platform === 'vimeo') {
		const queryParams = [
			hash ? `h=${hash}` : null,
			'badge=0',
			'autopause=0',
			'player_id=0',
			'app_id=58479',
			'autoplay=0',
			'title=0',
			'byline=0',
			'portrait=0',
		]
			.filter(Boolean)
			.join('&');
		return `https://player.vimeo.com/video/${id}?${queryParams}`;
	} else if (platform === 'facebook') {
		return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
			video.embeddedLink,
		)}&show_text=false&width=560&autoplay=0`;
	} else if (platform === 'dropbox') {
		return video.embeddedLink
			.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
			.replace('?dl=0', '?dl=1');
	} else if (platform === 'instagram') {
		return `https://www.instagram.com/reel/${id}/embed`;
	}
	return null;
};
