import { useEffect } from 'react';

export default function useChunkLoadErrorReload() {
	useEffect(() => {
		function handleChunkError(event) {
			const message = event?.message || '';
			if (
				message.includes('Loading chunk') ||
				message.includes('Failed to fetch dynamically imported module') ||
				message.includes('ChunkLoadError')
			) {
				window.location.reload(true);
			}
		}
		window.addEventListener('error', handleChunkError);
		return () => {
			window.removeEventListener('error', handleChunkError);
		};
	}, []);
}
