// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	send(channel, data) {
		// only these three go _into_ main
		console.log('sending', channel, data);
		const validChannels = ['check-for-updates', 'download-update', 'quit-and-install'];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},
	receive(channel, callback) {
		// from main we always use a single "fromMain" gateway
		if (channel === 'fromMain') {
			ipcRenderer.on('fromMain', (event, message) => {
				callback(message);
			});
		}
	},
	reloadApp() {
		ipcRenderer.send('reload-app');
	}
});
