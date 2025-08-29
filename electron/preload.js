// preload.js
const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronApi', {
	send(channel, data) {
		ipcRenderer.invoke(channel, data);
	},

	receive(channel, callback) {
		ipcRenderer.handle(channel, (event, message) => {
			callback(message);
		});
	},

	checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
	downloadUpdate: () => ipcRenderer.invoke('download-update'),

	onUpdateStatus: (callback) => {
		ipcRenderer.on('update-status', (event, data) => {
			callback(data);
		});
	},

	removeUpdateStatusListener: () => {
		ipcRenderer.removeAllListeners('update-status');
	},

	// Image processing function
	processImageWithSharp: (data) => ipcRenderer.invoke('process-image-with-sharp', data),

	extractImageMetadata: (data) => ipcRenderer.invoke('extract-image-metadata', data),

	// New: Download album as ZIP(s)
	downloadAlbumZip: (payload) => ipcRenderer.invoke('download-album-zip', payload),

	// Download Original Images
	createZipFromUrls: (args) => ipcRenderer.invoke('create-zip-from-urls', args),

	// Shortcut activation listener
	onShortcutActivated: (callback) => {
		ipcRenderer.on('shortcut-activated', (event, data) => {
			callback(data);
		});
	},

	removeShortcutActivatedListener: () => {
		ipcRenderer.removeAllListeners('shortcut-activated');
	},

	// Overlay window APIs
	overlay: {
		toggleWindow: () => ipcRenderer.invoke('toggle-overlay-window'),
		updateDimensions: (dims) => ipcRenderer.invoke('update-overlay-dimensions', dims),
		hideAllWindows: () => ipcRenderer.invoke('hide-all-windows'),
		sendTabContentToAskAI: (tabContent) =>
			ipcRenderer.invoke('send-tab-content-to-askai', tabContent),
		// New methods for Dynamic Island integration
		startRecording: () => ipcRenderer.invoke('overlay-start-recording'),
		stopRecording: () => ipcRenderer.invoke('overlay-stop-recording'),
		pauseRecording: () => ipcRenderer.invoke('overlay-pause-recording'),
		resumeRecording: () => ipcRenderer.invoke('overlay-resume-recording'),
		toggleLiveIntelligence: () => ipcRenderer.invoke('overlay-toggle-live-intelligence'),
		getRecordingState: () => ipcRenderer.invoke('overlay-get-recording-state'),
		onRecordingStateChange: (callback) => {
			ipcRenderer.on('overlay-recording-state-changed', (event, data) => {
				callback(data);
			});
		},
		removeRecordingStateListener: () => {
			ipcRenderer.removeAllListeners('overlay-recording-state-changed');
		},
		// Command listener for Dynamic Island integration
		onCommand: (callback) => {
			ipcRenderer.on('overlay-command', (event, data) => {
				callback(event, data);
			});
		},
		removeCommandListener: () => {
			ipcRenderer.removeAllListeners('overlay-command');
		},
		// Send state updates to Dynamic Island
		sendStateUpdate: (state) => ipcRenderer.invoke('overlay-state-update', state),
		// Test connection
		testConnection: () => ipcRenderer.invoke('test-overlay-connection'),
	},

	// Ask AI window APIs
	askAI: {
		toggleWindow: () => ipcRenderer.invoke('toggle-askAI-window'),
		showWindow: () => ipcRenderer.invoke('show-askAI-window'),
		isWindowVisible: () => ipcRenderer.invoke('is-askAI-window-visible'),
		updateDimensions: (dims) => ipcRenderer.invoke('update-askAI-dimensions', dims),
		setIgnoreMouseEvents: (ignore) =>
			ipcRenderer.invoke('set-askAI-ignore-mouse-events', ignore),
		setInputFocus: (isFocused) => ipcRenderer.invoke('set-askAI-input-focus', isFocused),
		getInputFocus: () => ipcRenderer.invoke('get-askAI-input-focus'),
		onReceiveTabContent: (callback) => {
			ipcRenderer.on('receive-tab-content', (event, data) => {
				callback(data);
			});
		},

		// Camera permission API
		camera: {
			checkPermission: () => ipcRenderer.invoke('check-camera-permission'),
			requestPermission: () => ipcRenderer.invoke('request-camera-permission'),
			showPermissionHelp: () => ipcRenderer.invoke('show-camera-permission-help'),
		},
		removeTabContentListener: () => {
			ipcRenderer.removeAllListeners('receive-tab-content');
		},
	},

	// Mouse event handling for click-through behavior
	setIgnoreMouseEvents: (ignore) => ipcRenderer.invoke('set-ignore-mouse-events', ignore),

	// Microphone permission APIs
	microphone: {
		checkPermission: () => ipcRenderer.invoke('check-microphone-permission'),
		requestPermission: () => ipcRenderer.invoke('request-microphone-permission'),
	},

	// Clipboard APIs
	clipboard: {
		writeText: (text) => ipcRenderer.invoke('clipboard-write-text', text),
		readText: () => ipcRenderer.invoke('clipboard-read-text'),
	},

	// Download progress listener
	onDownloadProgress: (callback) => {
		ipcRenderer.on('download-progress', (event, data) => {
			callback(data);
		});
	},

	removeDownloadProgressListener: () => {
		ipcRenderer.removeAllListeners('download-progress');
	},
	checkScreenPermission: () => ipcRenderer.invoke('check-screen-recording-permission'),
	requestScreenPermission: () => ipcRenderer.invoke('request-screen-recording-permission'),
	desktop: {
		// ✅ This is the key addition
		captureScreen: () => ipcRenderer.invoke('desktop:capture-screen'),
	},

	// Dynamic Island APIs
	dynamicIsland: {
		expand: () => ipcRenderer.invoke('dynamic-island-expand'),
		collapse: () => ipcRenderer.invoke('dynamic-island-collapse'),
		toggle: () => ipcRenderer.invoke('dynamic-island-toggle'),
		show: () => ipcRenderer.invoke('dynamic-island-show'),
		hide: () => ipcRenderer.invoke('dynamic-island-hide'),
		setMouseEvents: (ignore) => ipcRenderer.invoke('dynamic-island-set-mouse-events', ignore),
		testClickThrough: () => ipcRenderer.invoke('dynamic-island-test-click-through'),
		onStateChange: (callback) => {
			ipcRenderer.on('dynamic-island-state', (event, data) => {
				callback(data);
			});
		},
		removeStateChangeListener: () => {
			ipcRenderer.removeAllListeners('dynamic-island-state');
		},
		// Listen for overlay state changes
		onOverlayStateChange: (callback) => {
			ipcRenderer.on('overlay-state-changed', (event, data) => {
				callback(data);
			});
		},
		removeOverlayStateListener: () => {
			ipcRenderer.removeAllListeners('overlay-state-changed');
		},
	},

	// Main Window Management APIs
	mainWindow: {
		show: () => ipcRenderer.invoke('main-window-show'),
		restore: () => ipcRenderer.invoke('main-window-restore'),
		focus: () => ipcRenderer.invoke('main-window-focus'),
		showAndFocus: () => ipcRenderer.invoke('main-window-show-and-focus'),
		isVisible: () => ipcRenderer.invoke('main-window-is-visible'),
		isMinimized: () => ipcRenderer.invoke('main-window-is-minimized'),
	},
});
