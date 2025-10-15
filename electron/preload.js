// preload.js
// TODO: PERFORMANCE - This file exposes 100+ IPC methods - consider batching or lazy loading
const { contextBridge, ipcRenderer } = require('electron/renderer');

const { preloadBridge } = require('@zubridge/electron/preload');

console.log('[Preload] Script initializing');

// Get handlers from the preload bridge
const { handlers } = preloadBridge();

// Expose Zubridge handlers directly without wrapping
contextBridge.exposeInMainWorld('zubridge', handlers);

// Helper

contextBridge.exposeInMainWorld('electronApi', {
	// Sending messages from veApp to main process
	sendMessageFrmVeApp: (msg) => ipcRenderer.send('veAppMsg', msg),

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
	restartApp: () => ipcRenderer.invoke('restart-app'),

	// Manual update check with better error handling
	checkForUpdatesManual: async () => {
		try {
			const result = await ipcRenderer.invoke('check-for-updates');
			return result;
		} catch (error) {
			console.error('❌ Manual update check failed:', error);
			return { success: false, error: error.message };
		}
	},
	repositionDynamicIsland: () => ipcRenderer.invoke('reposition-dynamic-island'),
	openSystemSettings: () => ipcRenderer.invoke('open-system-settings'),
	openCameraSettings: () => ipcRenderer.invoke('open-camera-settings'),
	openMicrophoneSettings: () => ipcRenderer.invoke('open-microphone-settings'),
	openScreenRecordingSettings: () => ipcRenderer.invoke('open-screen-recording-settings'),
	openMediaSettings: () => ipcRenderer.invoke('open-media-settings'),
	openCalendarSettings: () => ipcRenderer.invoke('open-calendar-settings'),

	onUpdateStatus: (callback) => {
		ipcRenderer.on('update-status', (event, data) => {
			callback(data);
		});
	},

	onAutoUpdateLog: (callback) => {
		ipcRenderer.on('auto-update-log', (event, data) => {
			callback(data);
		});
	},

	removeUpdateStatusListener: () => {
		ipcRenderer.removeAllListeners('update-status');
	},

	removeAutoUpdateLogListener: () => {
		ipcRenderer.removeAllListeners('auto-update-log');
	},

	// Image processing function
	processImageWithSharp: (data) => ipcRenderer.invoke('process-image-with-sharp', data),

	extractImageMetadata: (data) => ipcRenderer.invoke('extract-image-metadata', data),

	// Diagnostic function
	getDiagnosticInfo: () => ipcRenderer.invoke('get-diagnostic-info'),

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

	// 🔔 Notifications
	showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),

	// 📣 Listen for mic activity

	// Optional: Listen for notifications (if you want renderer-side handling)
	onNotification: (callback) => {
		ipcRenderer.on('notification-payload', (event, data) => callback(data));
	},

	// In preload.js, inside contextBridge.exposeInMainWorld('electronApi', { ... })

	// TODO: PERFORMANCE - Event listener management could be optimized with cleanup tracking
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

	minimizeMainWindow: () => ipcRenderer.invoke('minimize-main-window'),
	// Overlay window APIs
	overlay: {
		toggleWindow: () => ipcRenderer.invoke('toggle-overlay-window'),
		showOverlayWindow: () => ipcRenderer.invoke('show-overlay-window'),
		updateDimensions: (dims) => ipcRenderer.invoke('update-overlay-dimensions', dims),
		hideAllWindows: () => ipcRenderer.invoke('hide-all-windows'),
		sendTabContentToAskAI: (tabContent) =>
			ipcRenderer.invoke('send-tab-content-to-askai', tabContent),
		// Send chat message from Dynamic Island to Ask AI
		sendChatMessageToAskAI: (chatMessage) =>
			ipcRenderer.invoke('send-chat-message-to-askai', chatMessage),
		// New methods for Dynamic Island integration
		startRecording: (data) => ipcRenderer.invoke('overlay-start-recording', data),
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
		// Send transcription data to main process
		sendTranscriptionData: (transcriptionData) =>
			ipcRenderer.invoke('overlay-send-transcription-data', transcriptionData),
		// Set current panel mode for recording (affects NotchDrop via main)
		setPanelMode: (mode) => ipcRenderer.invoke('overlay-set-panel-mode', mode),
		// Send live intelligence data to main process
		sendLiveIntelligenceData: (liveIntelligenceData) =>
			ipcRenderer.invoke('overlay-send-live-intelligence-data', liveIntelligenceData),
		// Test connection
		testConnection: () => ipcRenderer.invoke('test-overlay-connection'),
		// Test command sending
		testCommand: (command) => ipcRenderer.invoke('test-overlay-command', command),
		// Test overlay window creation
		testWindow: () => ipcRenderer.invoke('test-overlay-window'),
		// Hide overlay window only (without stopping recording)
		hideOverlayWindow: () => ipcRenderer.invoke('hide-overlay-window'),
	},

	// Ask AI window APIs
	askAI: {
		toggleWindow: () => ipcRenderer.invoke('toggle-askAI-window'),
		showWindow: () => ipcRenderer.invoke('show-askAI-window'),
		isWindowVisible: () => ipcRenderer.invoke('is-askAI-window-visible'),
		updateDimensions: (dims) => ipcRenderer.invoke('update-askAI-dimensions', dims),
		// Drag/move helpers
		getPosition: () => ipcRenderer.invoke('askAI-get-position'),
		moveTo: (x, y) => ipcRenderer.invoke('askAI-move-to', { x, y }),
		setIgnoreMouseEvents: (ignore) =>
			ipcRenderer.invoke('set-askAI-ignore-mouse-events', ignore),
		setInputFocus: (isFocused) => ipcRenderer.invoke('set-askAI-input-focus', isFocused),
		getInputFocus: () => ipcRenderer.invoke('get-askAI-input-focus'),
		onReceiveTabContent: (callback) => {
			ipcRenderer.on('receive-tab-content', (event, data) => {
				callback(data);
			});
		},
		getWorkArea: () => {
			return ipcRenderer.invoke('get-workarea');
		},

		// Listen for chat messages from Dynamic Island
		onReceiveChatMessage: (callback) => {
			ipcRenderer.on('receive-chat-message', (event, data) => {
				callback(data);
			});
		},

		// Show chatbox mode
		showChatbox: () => ipcRenderer.invoke('show-askAI-chatbox'),

		// Show response window mode
		showResponse: () => ipcRenderer.invoke('show-askAI-response'),

		// Listen for show chatbox command
		onShowChatbox: (callback) => {
			ipcRenderer.on('askAI-show-chatbox', (event, data) => {
				callback(data);
			});
		},

		// Listen for show response command
		onShowResponse: (callback) => {
			ipcRenderer.on('askAI-show-response', (event, data) => {
				callback(data);
			});
		},

		// Remove listeners
		removeShowChatboxListener: () => {
			ipcRenderer.removeAllListeners('askAI-show-chatbox');
		},

		removeShowResponseListener: () => {
			ipcRenderer.removeAllListeners('askAI-show-response');
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

	// Are You There window APIs
	areYouThere: {
		continueMeeting: () => ipcRenderer.invoke('are-you-there-continue-meeting'),
		autoContinueMeeting: () => ipcRenderer.invoke('are-you-there-auto-continue-meeting'),
		stopMeeting: () => ipcRenderer.invoke('are-you-there-stop-meeting'),
		pauseMeetingIntelligence: () =>
			ipcRenderer.invoke('are-you-there-pause-meeting-intelligence'),
		endSession: () => ipcRenderer.invoke('are-you-there-end-session'),
		getCurrentRecordingTime: () => ipcRenderer.invoke('are-you-there-get-recording-time'),
		checkRecordingState: () => ipcRenderer.invoke('are-you-there-check-recording-state'),
		onShowCommand: (callback) => {
			ipcRenderer.on('are-you-there-show-command', (event, data) => {
				callback(data);
			});
		},
		removeShowCommandListener: () => {
			ipcRenderer.removeAllListeners('are-you-there-show-command');
		},
		onCloseCommand: (callback) => {
			ipcRenderer.on('are-you-there-close-command', (event, data) => {
				callback(data);
			});
		},
		removeCloseCommandListener: () => {
			ipcRenderer.removeAllListeners('are-you-there-close-command');
		},
		// New transcription-based Are You There APIs
		updateTranscriptionActivity: () => ipcRenderer.invoke('update-transcription-activity'),
		continueTranscription: () => ipcRenderer.invoke('are-you-there-continue-transcription'),
		stopTranscriptionMonitoring: () =>
			ipcRenderer.invoke('are-you-there-stop-transcription-monitoring'),
		pauseTranscriptionMonitoring: () =>
			ipcRenderer.invoke('are-you-there-pause-transcription-monitoring'),
		endTranscriptionSession: () =>
			ipcRenderer.invoke('are-you-there-end-transcription-session'),
		getTranscriptionDetectionState: () =>
			ipcRenderer.invoke('get-transcription-detection-state'),
	},

	// Permission window APIs
	permission: {
		toggleWindow: () => ipcRenderer.invoke('toggle-permission-window'),
		showWindow: () => ipcRenderer.invoke('show-permission-window'),
		hideWindow: () => ipcRenderer.invoke('hide-permission-window'),
		isWindowVisible: () => ipcRenderer.invoke('is-permission-window-visible'),
		closeWindow: () => ipcRenderer.invoke('hide-permission-window'),
		checkAuthAndShowOverlay: () => ipcRenderer.invoke('check-auth-and-show-permission-overlay'),
		// Permission checking and requesting
		checkMicrophonePermission: () => ipcRenderer.invoke('check-microphone-permission'),
		requestMicrophonePermission: () => ipcRenderer.invoke('request-microphone-permission'),
		showMicrophonePermissionHelp: () => ipcRenderer.invoke('show-microphone-permission-help'),
		checkScreenPermission: () => ipcRenderer.invoke('check-screen-recording-permission'),
		requestScreenPermission: () => ipcRenderer.invoke('request-screen-recording-permission'),
		showScreenPermissionHelp: () => ipcRenderer.invoke('show-screen-recording-permission-help'),
		// Camera permission APIs
		checkCameraPermission: () => ipcRenderer.invoke('check-camera-permission'),
		requestCameraPermission: () => ipcRenderer.invoke('request-camera-permission'),
		showCameraPermissionHelp: () => ipcRenderer.invoke('show-camera-permission-help'),
		// Media permission APIs
		checkMediaPermission: () => ipcRenderer.invoke('check-media-permission'),
		requestMediaPermission: () => ipcRenderer.invoke('request-media-permission'),
		// Calendar permission APIs
		checkCalendarPermission: () => ipcRenderer.invoke('check-calendar-permission'),
		requestCalendarPermission: () => ipcRenderer.invoke('request-calendar-permission'),
		// System settings opener
		openSystemSettings: (section) => ipcRenderer.invoke('open-system-settings', section),
		// Debug permissions
		debugPermissions: () => ipcRenderer.invoke('debug-permissions'),
	},

	// Home icon click handler (cross-platform)
	home: {
		restoreMainWindow: () => ipcRenderer.invoke('restore-main-window'),
		saveCurrentRoute: (route) => ipcRenderer.invoke('save-current-route', route),
		onRestoreWindowState: (callback) => {
			ipcRenderer.on('restore-window-state', (event, state) => {
				callback(state);
			});
		},
		removeRestoreWindowStateListener: () => {
			ipcRenderer.removeAllListeners('restore-window-state');
		},
	},

	// Mouse event handling for click-through behavior
	setIgnoreMouseEvents: (ignore) => ipcRenderer.invoke('set-ignore-mouse-events', ignore),

	// Microphone permission APIs
	microphone: {
		checkPermission: () => ipcRenderer.invoke('check-microphone-permission'),
		requestPermission: () => ipcRenderer.invoke('request-microphone-permission'),
	},

	// Wake word APIs
	// wakeWord: {
	//  start: () => ipcRenderer.invoke('wake-word-start'),
	//  stop: () => ipcRenderer.invoke('wake-word-stop'),
	//  getStatus: () => ipcRenderer.invoke('wake-word-status'),
	// },

	// Clipboard APIs
	clipboard: {
		writeText: (text) => ipcRenderer.invoke('clipboard-write-text', text),
		readText: () => ipcRenderer.invoke('clipboard-read-text'),
	},

	// Developer tools API for WebSocket debugging
	openDevTools: (options) => ipcRenderer.invoke('open-dev-tools', options),

	// Platform information
	platform: {
		name: process.platform,
		arch: process.arch,
		isMac: process.platform === 'darwin',
		isWindows: process.platform === 'win32',
		isLinux: process.platform === 'linux',
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
	showScreenPermissionHelp: () => ipcRenderer.invoke('show-screen-recording-permission-help'),
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
		forceShow: () => ipcRenderer.invoke('dynamic-island-force-show'),
		setMouseEvents: (ignore) => ipcRenderer.invoke('dynamic-island-set-mouse-events', ignore),
		setChatMode: (isChatMode) => ipcRenderer.invoke('dynamic-island-chat-mode', isChatMode),

		// Send chat message directly to AskAI
		sendChatMessage: (message) => ipcRenderer.invoke('send-chat-message-to-askai', message),

		// Voice integration APIs for Dynamic Island
		connectVoice: () => ipcRenderer.invoke('dynamic-island-voice-connect'),
		disconnectVoice: () => ipcRenderer.invoke('dynamic-island-voice-disconnect'),
		getVoiceStatus: () => ipcRenderer.invoke('dynamic-island-voice-status'),
		setMicrophoneAccess: (enabled) =>
			ipcRenderer.invoke('dynamic-island-set-microphone-access', enabled),

		// Combined recording trigger for Windows (show/expand Dynamic Island + start recording)
		startRecordingFromModal: () =>
			ipcRenderer.invoke('dynamic-island-start-recording-from-modal'),

		onStateChange: (callback) => {
			ipcRenderer.on('dynamic-island-state', (event, data) => {
				callback(data);
			});
		},
		removeStateChangeListener: () => {
			ipcRenderer.removeAllListeners('dynamic-island-state');
		},
		onVoiceModeTrigger: (callback) => {
			ipcRenderer.on('trigger-voice-mode', (event) => {
				callback();
			});
		},
		removeVoiceModeTriggerListener: () => {
			ipcRenderer.removeAllListeners('trigger-voice-mode');
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
		// Listen for voice status changes
		onVoiceStatusChange: (callback) => {
			ipcRenderer.on('voice-status-changed', (event, data) => {
				callback(data);
			});
		},
		removeVoiceStatusListener: () => {
			ipcRenderer.removeAllListeners('voice-status-changed');
		},
		onForceFocus: (callback) => {
			ipcRenderer.on('force-focus', (event) => {
				callback();
			});
		},
		removeForceFocusListener: () => {
			ipcRenderer.removeAllListeners('force-focus');
		},

		// Notification APIs
		showNotification: (notification) =>
			ipcRenderer.invoke('dynamic-island-show-notification', notification),
		onNotification: (callback) => {
			ipcRenderer.on('dynamic-island-notification', (event, data) => {
				callback(data);
			});
		},
		removeNotificationListener: () => {
			ipcRenderer.removeAllListeners('dynamic-island-notification');
		},
	},

	// NotchDrop APIs
	notchdrop: {
		enable: () => ipcRenderer.invoke('notchdrop-enable'),
		disable: () => ipcRenderer.invoke('notchdrop-disable'),
		toggle: () => ipcRenderer.invoke('notchdrop-toggle'),
		isVisible: () => ipcRenderer.invoke('notchdrop-is-visible'),
		setStatus: (status) => ipcRenderer.invoke('notchdrop-set-status', status),
		getStatus: () => ipcRenderer.invoke('notchdrop-get-status'),
		handleFiles: (filePaths) => ipcRenderer.invoke('notchdrop-handle-files', filePaths),
		setAutoOpen: (enabled) => ipcRenderer.invoke('notchdrop-set-auto-open', enabled),
		getAutoOpen: () => ipcRenderer.invoke('notchdrop-get-auto-open'),
		getDebugInfo: () => ipcRenderer.invoke('boring-notch-debug-info'),
		setHapticFeedback: (enabled) =>
			ipcRenderer.invoke('notchdrop-set-haptic-feedback', enabled),
		getHapticFeedback: () => ipcRenderer.invoke('notchdrop-get-haptic-feedback'),
		updateMenu: () => ipcRenderer.invoke('update-notchdrop-menu'),
		// Voice integration
		updateVoiceStatus: (status) => ipcRenderer.invoke('notchdrop-update-voice-status', status),
		updateVoiceConnectionState: (status) =>
			ipcRenderer.invoke('notchdrop-update-voice-connection-state', status),
		updateVoiceMuteState: (isMuted) =>
			ipcRenderer.invoke('notchdrop-update-voice-mute-state', isMuted),
		addVoiceMessage: (messageData) =>
			ipcRenderer.invoke('notchdrop-add-voice-message', messageData),
		// GENERAL PURPOSE MESSAGE SYSTEM
		sendMessage: (messageData) => ipcRenderer.invoke('notchdrop-send-message', messageData),
		// New NotchDropLatest APIs
		openAirDrop: () => ipcRenderer.invoke('notchdrop-open-airdrop'),
		openShare: () => ipcRenderer.invoke('notchdrop-open-share'),
		openFile: (filePath) => ipcRenderer.invoke('notchdrop-open-file', filePath),
		deleteFile: (fileId) => ipcRenderer.invoke('notchdrop-delete-file', fileId),
		// Replace entire transcription list in NotchDrop
		replaceTranscriptions: (messages) =>
			ipcRenderer.invoke('notchdrop-replace-transcriptions', messages),
		// Clear live intelligence data in NotchDrop
		clearLiveIntelligenceData: () =>
			ipcRenderer.invoke('notchdrop-clear-live-intelligence-data'),
		onFileDropped: (callback) => {
			ipcRenderer.on('notchdrop-file-dropped', (event, data) => {
				callback(data);
			});
		},
		removeFileDroppedListener: () => {
			ipcRenderer.removeAllListeners('notchdrop-file-dropped');
		},
	},

	selectionAssistant: {
		getHistory: () => ipcRenderer.invoke('selection-assistant:get-history'),
		clearHistory: () => ipcRenderer.invoke('selection-assistant:clear-history'),
		showHistory: () => ipcRenderer.invoke('selection-assistant:show-history'),
		requestPermission: () =>
			ipcRenderer.invoke('selection-assistant:request-permission'),
		isPermissionGranted: () =>
			ipcRenderer.invoke('selection-assistant:is-permission-granted'),
		onSelectionCaptured: (callback) => {
			ipcRenderer.on('selection-assistant:captured', (event, data) => {
				callback(data);
			});
		},
		removeSelectionCapturedListener: () => {
			ipcRenderer.removeAllListeners('selection-assistant:captured');
		},
		onPermissionChanged: (callback) => {
			ipcRenderer.on('selection-assistant:permission', (event, data) => {
				callback(data);
			});
		},
		removePermissionListener: () => {
			ipcRenderer.removeAllListeners('selection-assistant:permission');
		},
	},

	navigateMainWindow: (data) => ipcRenderer.invoke('navigate-main-window', data),
	onNavigate: (callback) => ipcRenderer.on('navigate-to', (_, data) => callback(data)),

	// Simple Content Protection APIs
	toggleContentProtection: () => ipcRenderer.invoke('toggle-content-protection'),
	getContentProtectionStatus: () => ipcRenderer.invoke('get-content-protection-status'),
	setContentProtection: (enabled) => ipcRenderer.invoke('set-content-protection', enabled),

	// Listen for content protection changes
	onContentProtectionChanged: (callback) => {
		ipcRenderer.on('content-protection-changed', callback);
	},
	removeContentProtectionListener: (callback) => {
		ipcRenderer.removeListener('content-protection-changed', callback);
	},

	startScreenCapture: () => ipcRenderer.invoke('start-screen-capture'),

	onScreenAudio: (callback) => {
		ipcRenderer.on('screen-audio', (_event, data) => {
			callback(data);
		});
	},

	getStoreActions: () => ipcRenderer.sendSync('get-store-actions-sync'),

	onNotchdropToMainWindowEvent: (callback) =>
		ipcRenderer.on('notchdrop-to-main-window-event', (_, data) => callback(data)),

	sendTranscriptionDataToNotch:(data)=>ipcRenderer.invoke('send-transcription-data-to-notch', data),
	sendLiveIntelligenceDataToNotch:(data)=>ipcRenderer.invoke('send-live-intelligence-data-to-notch', data),

	removeNotchdropToMainWindowEventListener: () => {
		ipcRenderer.removeAllListeners('notchdrop-to-main-window-event');
	},

	/**
	 * Resize the main window with smooth animation
	 * @param {Object} data - Resize configuration
	 * @param {Object} data.dimensions - Target dimensions
	 * @param {number} [data.dimensions.width] - Target width in pixels
	 * @param {number} [data.dimensions.height] - Target height in pixels
	 * @param {boolean} [data.exitFullScreen=false] - Exit fullscreen before resizing
	 * @param {boolean} [data.animate=true] - Enable smooth animation
	 * @param {number} [data.duration=250] - Animation duration in milliseconds
	 * @param {string} [data.easing='easeInOutCubic'] - Easing function ('easeInOutCubic', 'easeOutCubic', 'easeInCubic', 'easeInOutQuad', 'linear')
	 * @returns {Promise<{success: boolean, bounds?: Object, error?: string}>}
	 */
	resizeMainWindow: (data) => ipcRenderer.invoke('resize-main-window', data),
	getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),

	// File system APIs for audio storage
	fs: {
		ensureDir: (dirPath) => ipcRenderer.invoke('fs-ensure-dir', dirPath),
		writeFile: (filePath, data) => ipcRenderer.invoke('fs-write-file', filePath, data),
		readFile: (filePath) => ipcRenderer.invoke('fs-read-file', filePath),
		readFileBinary: (filePath) => ipcRenderer.invoke('fs-read-file-binary', filePath),
		exists: (filePath) => ipcRenderer.invoke('fs-exists', filePath),
		remove: (filePath) => ipcRenderer.invoke('fs-remove', filePath),
		readdir: (dirPath) => ipcRenderer.invoke('fs-readdir', dirPath),
	},

	// Translucency toggle APIs
	onTranslucencyChanged: (callback) => {
		ipcRenderer.on('translucency-changed', (_e, data) => callback(data));
	},
	removeTranslucencyChangedListener: () => {
		ipcRenderer.removeAllListeners('translucency-changed');
	},

	toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
	closeWindow: () => ipcRenderer.invoke('close-window'),
	getFullscreenState: () => ipcRenderer.invoke('get-fullscreen-state'),

	// Glass mode sync API
	syncGlassModeState: (isEnabled) => {
		ipcRenderer.invoke('sync-glass-mode-state', { enabled: isEnabled });
	},
});
