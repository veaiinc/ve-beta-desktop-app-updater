import { useEffect } from 'react';

// This hook handles reloading multiple browser tabs parallelly when a user logs out or switches workspace

export const reloadApp = () => {
	window.location.reload();
};

const useBroadcastChannel = () => {
	const channel = new BroadcastChannel('ve-ai-channel');

	useEffect(() => {
		channel.onmessage = (e) => {
			// reloads all the tabs in the browser to the home page
			if (e.data === 'switchWorkspace') {
				window.location.hash = '/home';
				reloadApp();
			}

			if (e.data === 'logout') {
				window.location.hash = '/';
				reloadApp();
			}
		};

		return () => {
			channel.close();
		};
	}, []);

	return channel;
};

export default useBroadcastChannel;
