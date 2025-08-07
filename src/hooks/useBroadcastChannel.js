import { useEffect } from 'react';

const useBroadcastChannel = () => {
	const channel = new BroadcastChannel('ve-ai-channel');

	useEffect(() => {
		channel.onmessage = (e) => {
			if (e.data === 'reload') {
				window.location.reload();
			}
		};

		return () => {
			channel.close();
		};
	}, []);

	return channel;
};

export default useBroadcastChannel;
