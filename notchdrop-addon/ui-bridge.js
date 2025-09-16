const NotchDropAddonWrapper = require('./index.js');

class NotchDropUIBridge {
	constructor() {
		this.addon = null;
		this.isInitialized = false;
		this.uiState = {
			isExpanded: false,
			isRecording: false,
			isPaused: false,
			timer: 0,
			isLiveIntelligenceOpen: false,
			controlledByNotchDrop: false,
			isAuthenticated: false,
			isChatMode: false,
			chatInput: '',
		};
		this.listeners = {};
	}

	// Initialize the bridge
	async initialize() {
		if (this.isInitialized) {
			console.warn('NotchDrop UI Bridge already initialized');
			return;
		}

		try {
			// Initialize the native addon
			this.addon = new NotchDropAddonWrapper();
			this.addon.initialize();

			// Set up event listeners for the native addon
			this.setupNativeEventListeners();

			// Set up UI state management
			this.setupUIStateManagement();

			this.isInitialized = true;
			console.log('✅ NotchDrop UI Bridge initialized successfully');
		} catch (error) {
			console.error('❌ Failed to initialize NotchDrop UI Bridge:', error);
			throw error;
		}
	}

	setupNativeEventListeners() {
		// Listen for status changes from native addon
		this.addon.on('statusChanged', (status) => {
			console.log('📊 Native status changed:', status);
			this.updateUIState({ status });
		});

		// Listen for file drops
		this.addon.on('fileDropped', (filePath) => {
			console.log('📁 File dropped:', filePath);
			this.emit('fileDropped', filePath);
		});

		// Listen for item changes
		this.addon.on('itemAdded', (itemData) => {
			console.log('➕ Item added:', itemData);
			this.emit('itemAdded', itemData);
		});

		this.addon.on('itemRemoved', (itemData) => {
			console.log('➖ Item removed:', itemData);
			this.emit('itemRemoved', itemData);
		});
	}

	setupUIStateManagement() {
		// Check authentication status periodically
		this.checkAuthStatus();
		setInterval(() => this.checkAuthStatus(), 5000);

		// Listen for storage changes (login/logout)
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', (e) => {
				if (e.key === 'usertoken') {
					this.checkAuthStatus();
				}
			});
		}
	}

	checkAuthStatus() {
		if (typeof window !== 'undefined') {
			const usertoken = localStorage.getItem('usertoken');
			const isAuthenticated = !!usertoken;
			this.updateUIState({ isAuthenticated });
		}
	}

	// UI State Management
	updateUIState(newState) {
		this.uiState = { ...this.uiState, ...newState };
		this.emit('uiStateChanged', this.uiState);
	}

	getUIState() {
		return { ...this.uiState };
	}

	// NotchDrop Control Methods
	async expand() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('📏 Expanding NotchDrop UI');
			this.addon.show();
			this.updateUIState({ isExpanded: true });
			return { success: true };
		} catch (error) {
			console.error('❌ Expand error:', error);
			return { success: false, error: error.message };
		}
	}

	async collapse() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('📏 Collapsing NotchDrop UI');
			this.addon.hide();
			this.updateUIState({ isExpanded: false });
			return { success: true };
		} catch (error) {
			console.error('❌ Collapse error:', error);
			return { success: false, error: error.message };
		}
	}

	// Recording Control Methods
	async startRecording() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('🎤 Starting recording via NotchDrop UI');
			this.updateUIState({
				isRecording: true,
				isPaused: false,
				controlledByNotchDrop: true,
			});

			// Emit event for overlay integration
			this.emit('startRecording');
			return { success: true };
		} catch (error) {
			console.error('❌ Start recording error:', error);
			return { success: false, error: error.message };
		}
	}

	async stopRecording() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('⏹️ Stopping recording via NotchDrop UI');
			this.updateUIState({
				isRecording: false,
				isPaused: false,
				timer: 0,
			});

			// Emit event for overlay integration
			this.emit('stopRecording');
			return { success: true };
		} catch (error) {
			console.error('❌ Stop recording error:', error);
			return { success: false, error: error.message };
		}
	}

	async pauseRecording() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('⏸️ Pausing recording via NotchDrop UI');
			this.updateUIState({ isPaused: true });

			// Emit event for overlay integration
			this.emit('pauseRecording');
			return { success: true };
		} catch (error) {
			console.error('❌ Pause recording error:', error);
			return { success: false, error: error.message };
		}
	}

	async resumeRecording() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('▶️ Resuming recording via NotchDrop UI');
			this.updateUIState({ isPaused: false });

			// Emit event for overlay integration
			this.emit('resumeRecording');
			return { success: true };
		} catch (error) {
			console.error('❌ Resume recording error:', error);
			return { success: false, error: error.message };
		}
	}

	// Chat Mode Methods
	setChatMode(enabled) {
		this.updateUIState({ isChatMode: enabled });
	}

	setChatInput(input) {
		this.updateUIState({ chatInput: input });
	}

	// Timer Management
	updateTimer(seconds) {
		this.updateUIState({ timer: seconds });
	}

	// Overlay Integration Methods
	onOverlayStateChange(state) {
		console.log('🏝️ NotchDrop UI received overlay state:', state);

		// Update local UI state
		const updatedState = {
			isRecording: state.isRecording || false,
			isPaused: state.isPaused || false,
			timer: state.timer || 0,
			isLiveIntelligenceOpen: state.isLiveIntelligenceOpen || false,
			controlledByNotchDrop:
				state.isNotchDropControlled || state.controlledByNotchDrop || false,
			isAuthenticated: state.isAuthenticated || false,
		};

		console.log('🏝️ Updating UI state with:', updatedState);
		this.updateUIState(updatedState);

		// Send state update to Swift side for collapsed UI
		if (this.addon && this.addon.onOverlayStateChange) {
			try {
				console.log('📊 Sending state to Swift side:', state);
				this.addon.onOverlayStateChange(state);
				console.log('✅ State successfully sent to Swift side');
			} catch (error) {
				console.error('❌ Error sending state to Swift:', error);
			}
		} else {
			console.warn('⚠️ NotchDrop addon or onOverlayStateChange method not available');
		}
	}

	// Enhanced Overlay Integration Methods
	async triggerOverlayRecording() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('🎤 Triggering overlay recording via NotchDrop UI');

			// Update local state
			this.updateUIState({
				isRecording: true,
				isPaused: false,
				controlledByNotchDrop: true,
			});

			// Emit event for overlay integration
			this.emit('startRecording');

			// Also emit the specific overlay trigger event
			this.emit('triggerOverlayRecording');

			return { success: true };
		} catch (error) {
			console.error('❌ Trigger overlay recording error:', error);
			return { success: false, error: error.message };
		}
	}

	async triggerOverlayToggleLiveIntelligence() {
		if (!this.isInitialized) {
			throw new Error('NotchDrop UI Bridge not initialized');
		}

		try {
			console.log('🧠 Triggering overlay toggle live intelligence via NotchDrop UI');

			// Update local state
			this.updateUIState({
				isRecording: true,
				isPaused: false,
				controlledByNotchDrop: true,
				isLiveIntelligenceOpen: true,
			});

			// Emit event for overlay integration
			this.emit('startRecording');
			this.emit('toggleLiveIntelligence');

			return { success: true };
		} catch (error) {
			console.error('❌ Trigger overlay toggle live intelligence error:', error);
			return { success: false, error: error.message };
		}
	}

	// Event Emitter Methods
	emit(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => {
				try {
					callback(data);
				} catch (error) {
					console.error('Error in event listener:', error);
				}
			});
		}
	}

	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	off(event, callback) {
		if (this.listeners[event]) {
			const index = this.listeners[event].indexOf(callback);
			if (index > -1) {
				this.listeners[event].splice(index, 1);
			}
		}
	}

	// Cleanup
	destroy() {
		if (this.addon) {
			// Clean up native addon listeners
			this.addon.off('statusChanged');
			this.addon.off('fileDropped');
			this.addon.off('itemAdded');
			this.addon.off('itemRemoved');
		}

		// Clear UI listeners
		this.listeners = {};
		this.isInitialized = false;
		console.log('🧹 NotchDrop UI Bridge destroyed');
	}
}

// Create singleton instance
const notchDropUIBridge = new NotchDropUIBridge();

// Export both the class and singleton instance
module.exports = NotchDropUIBridge;
module.exports.bridge = notchDropUIBridge;
