// preload.js
const { contextBridge, ipcRenderer } = require('electron/renderer');

// 🎤 Private internal API (only available in renderer)
window.electronInternal = {
	async startMicMonitoring() {
		try {
			// ✅ Now safe: we are in renderer context
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Setup Web Audio API
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 2048;
			const source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);

			const buffer = new Uint8Array(analyser.frequencyBinCount);
			let isMonitoring = true;

			// VAD Settings
			const SPEAKING_THRESHOLD = 0.01;
			let speakingFrameCount = 0;
			const MIN_FRAMES = 3;

			const checkAudio = () => {
				if (!isMonitoring) return;

				analyser.getByteFrequencyData(buffer);
				const rms = computeRMS(buffer);

				if (rms > SPEAKING_THRESHOLD) {
					speakingFrameCount++;
					if (speakingFrameCount >= MIN_FRAMES) {
						// Send event to main process
						ipcRenderer.send('mic-activity-detected', { rms, timestamp: Date.now() });

						// Prevent spam
						speakingFrameCount = MIN_FRAMES;
					}
				} else {
					speakingFrameCount = 0;
				}

				requestAnimationFrame(checkAudio);
			};

			checkAudio();

			// Return stop function if needed
			return {
				stop: () => {
					isMonitoring = false;
				},
			};
		} catch (err) {
			ipcRenderer.send('mic-error', { message: err.message });
		}
	},
};

// Helper
function computeRMS(data) {
	let sum = 0;
	for (let i = 0; i < data.length; i++) {
		const v = data[i] / 255;
		sum += v * v;
	}
	return Math.sqrt(sum / data.length);
}

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

	startMicMonitoring: () => window.electronInternal.startMicMonitoring(),
	stopMicMonitoring: () => ipcRenderer.invoke('stop-mic-monitoring'),

	// 🔔 Notifications
	showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),

	// 📣 Listen for mic activity
	onMicActivity: (callback) => {
		ipcRenderer.on('mic-activity-detected', (event, data) => callback(data));
	},
	removeMicActivityListener: () => {
		ipcRenderer.removeAllListeners('mic-activity-detected');
	},

	// Optional: Listen for notifications (if you want renderer-side handling)
	onNotification: (callback) => {
		ipcRenderer.on('notification-payload', (event, data) => callback(data));
	},

	// In preload.js, inside contextBridge.exposeInMainWorld('electronApi', { ... })

	// ✅ Safe way to listen to any allowed channel
	on: (channel, callback) => {
		const validChannels = [
			'start-mic-monitoring',
			'notification-payload',
			'mic-activity-detected',
		];

		if (!validChannels.includes(channel)) {
			console.warn(`Attempted to listen to blocked channel: ${channel}`);
			return;
		}

		ipcRenderer.on(channel, (event, ...args) => {
			callback(...args);
		});
	},
	// Overlay window APIs
	overlay: {
		toggleWindow: () => ipcRenderer.invoke('toggle-overlay-window'),
		updateDimensions: (dims) => ipcRenderer.invoke('update-overlay-dimensions', dims),
		hideAllWindows: () => ipcRenderer.invoke('hide-all-windows'),
		sendTabContentToAskAI: (tabContent) =>
			ipcRenderer.invoke('send-tab-content-to-askai', tabContent),
		// Send chat message from Dynamic Island to Ask AI
		sendChatMessageToAskAI: (chatMessage) =>
			ipcRenderer.invoke('send-chat-message-to-askai', chatMessage),
		// Force open AskAI window
		forceOpenAskAIWindow: () => ipcRenderer.invoke('force-open-askai-window'),
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

		// Listen for chat messages from Dynamic Island
		onReceiveChatMessage: (callback) => {
			ipcRenderer.on('receive-chat-message', (event, data) => {
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
		removeChatMessageListener: () => {
			ipcRenderer.removeAllListeners('receive-chat-message');
		},
	},

	// Home icon click handler for Windows
	home: {
		restoreMainWindow: () => ipcRenderer.invoke('restore-main-window'),
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
		focus: () => ipcRenderer.invoke('dynamic-island-focus'),
		setMouseEvents: (ignore) => ipcRenderer.invoke('dynamic-island-set-mouse-events', ignore),
		setChatMode: (isChatMode) => ipcRenderer.invoke('dynamic-island-chat-mode', isChatMode),
		
		// Send chat message directly to AskAI
		sendChatMessage: (message) => ipcRenderer.invoke('send-chat-message-to-askai', message),
		
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
		onForceFocus: (callback) => {
			ipcRenderer.on('force-focus', (event) => {
				callback();
			});
		},
		removeForceFocusListener: () => {
			ipcRenderer.removeAllListeners('force-focus');
		},
	},
});
