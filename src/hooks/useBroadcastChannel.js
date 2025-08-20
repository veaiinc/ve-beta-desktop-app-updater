import { useEffect } from 'react';

// This hook handles reloading multiple browser tabs parallelly when a user logs out or switches workspace
const useBroadcastChannel = () => {
	const channel = new BroadcastChannel('ve-ai-channel');

	useEffect(() => {
		channel.onmessage = (e) => {
			// reloads all the tabs in the browser to the home page
			if (e.data === 'switchWorkspace' || e.data === 'logout') {
				window.location.hash = '/home';

				if (window.api && typeof window.api.reloadApp === 'function') {
					window.api.reloadApp();
				} else {
					window.location.reload();
				}
			}
		};

		return () => {
			channel.close();
		};
	}, []);

	return channel;
};

export default useBroadcastChannel;
