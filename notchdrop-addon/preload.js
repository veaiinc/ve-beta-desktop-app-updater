const { contextBridge, ipcRenderer } = require('electron');

// Expose NotchDrop API to renderer process
contextBridge.exposeInMainWorld('electronApi', {
	notchDrop: {
		// State management
		onStateChange: (callback) => {
			ipcRenderer.on('notchDrop:stateChanged', (event, data) => callback(data));
		},
		removeStateChangeListener: () => {
			ipcRenderer.removeAllListeners('notchDrop:stateChanged');
		},

		// Overlay state integration
		onOverlayStateChange: (callback) => {
			ipcRenderer.on('notchDrop:overlayStateChanged', (event, data) => callback(data));
		},
		removeOverlayStateListener: () => {
			ipcRenderer.removeAllListeners('notchDrop:overlayStateChanged');
		},

		// Control methods
		expand: () => ipcRenderer.invoke('notchDrop:expand'),
		collapse: () => ipcRenderer.invoke('notchDrop:collapse'),

		// Recording control methods
		startRecording: () => ipcRenderer.invoke('notchDrop:startRecording'),
		stopRecording: () => ipcRenderer.invoke('notchDrop:stopRecording'),
		pauseRecording: () => ipcRenderer.invoke('notchDrop:pauseRecording'),
		resumeRecording: () => ipcRenderer.invoke('notchDrop:resumeRecording'),

		// Chat mode methods
		setChatMode: (enabled) => ipcRenderer.invoke('notchDrop:setChatMode', enabled),
		setChatInput: (input) => ipcRenderer.invoke('notchDrop:setChatInput', input),

		// Timer methods
		updateTimer: (seconds) => ipcRenderer.invoke('notchDrop:updateTimer', seconds),

		// State methods
		getState: () => ipcRenderer.invoke('notchDrop:getState'),

		// Overlay integration
		onOverlayStateChange: (state) =>
			ipcRenderer.invoke('notchDrop:onOverlayStateChange', state),

		// File drop events
		onFileDropped: (callback) => {
			ipcRenderer.on('notchDrop:fileDropped', (event, filePath) => callback(filePath));
		},
		removeFileDropListener: () => {
			ipcRenderer.removeAllListeners('notchDrop:fileDropped');
		},
	},

	// Overlay API for integration with existing overlay system
	overlay: {
		toggleLiveIntelligence: () => ipcRenderer.invoke('overlay-toggle-live-intelligence'),
		startRecording: () => ipcRenderer.invoke('overlay-start-recording'),
		stopRecording: () => ipcRenderer.invoke('overlay-stop-recording'),
		pauseRecording: () => ipcRenderer.invoke('overlay-pause-recording'),
		resumeRecording: () => ipcRenderer.invoke('overlay-resume-recording'),
	},

	// Dynamic Island API for existing Dynamic Island functionality
	dynamicIsland: {
		onStateChange: (callback) => {
			ipcRenderer.on('dynamicIsland:stateChanged', (event, data) => callback(data));
		},
		removeStateChangeListener: () => {
			ipcRenderer.removeAllListeners('dynamicIsland:stateChanged');
		},
		onOverlayStateChange: (callback) => {
			ipcRenderer.on('dynamicIsland:overlayStateChanged', (event, data) => callback(data));
		},
		removeOverlayStateListener: () => {
			ipcRenderer.removeAllListeners('dynamicIsland:overlayStateChanged');
		},
		expand: () => ipcRenderer.invoke('dynamicIsland:expand'),
		collapse: () => ipcRenderer.invoke('dynamicIsland:collapse'),
	},

	// Swift-JS Bridge API for controlling JavaScript UI from Swift
	ipcRenderer: {
		on: (channel, callback) => {
			ipcRenderer.on(channel, (event, data) => callback(event, data));
		},
		send: (channel, data) => {
			ipcRenderer.send(channel, data);
		},
		invoke: (channel, data) => {
			return ipcRenderer.invoke(channel, data);
		},
	},
});

// Handle window events
window.addEventListener('DOMContentLoaded', () => {
	console.log('✅ NotchDrop preload script loaded');
});
