const { screen, BrowserWindow } = require('electron');
const log = require('electron-log');
const path = require('path');

const RUNTIME_PLATFORM = process.env.VE_FORCE_PLATFORM || process.platform;
const isMacRuntime = RUNTIME_PLATFORM === 'darwin';
const isWindowsRuntime = RUNTIME_PLATFORM === 'win32';

module.exports = class DynamicIslandHelper {
	constructor() {
		this.dynamicIslandWindow = null;
		this.isExpanded = false; // Start collapsed by default
		this.isVisible = true;
		this.screenWidth = 0;
		this.screenHeight = 0;

		// Default positions and sizes - start with collapsed pill size
		this.collapsedSize = { width: 250, height: 18 };
		this.expandedSize = { width: 875, height: 280, flexShrink: 0 };
		this.position = { x: 0, y: 0 };

		this.setupScreenDimensions();
	}

	setupScreenDimensions() {
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		// Position at center top - use expanded size for positioning
		this.position.x =
			Math.floor(this.screenWidth / 2) - Math.floor(this.expandedSize.width / 2);

		this.position.y = 0;
	}

	createDynamicIslandWindow() {
		if (this.dynamicIslandWindow !== null) return;

		// Skip window creation on macOS (runtime) - only create for Windows/Linux
		if (isMacRuntime) {
			return;
		}

		const windowSettings = {
			width: this.expandedSize.width, // Start with expanded size (875x280)
			height: this.expandedSize.height, // Start with expanded size (875x280)
			x: this.position.x,
			y: this.position.y, // Y=0 to stick to top of screen
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, 'preload.js'),
				devTools: true, // Enable dev tools in production too
			},
			show: true, // Show immediately when created
			alwaysOnTop: true,
			frame: false, // Frameless to blend with menu bar
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true, // Make focusable by default for better Windows support
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: process.env.NODE_ENV === 'development' ? 'normal' : 'panel',
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
			resizable: false, // Disable resizing - fixed size
			movable: true, // Enable movement for Dynamic Island
			minimizable: false,
			maximizable: false,
			closable: false,
		};

		this.dynamicIslandWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		// Force the Dynamic Island React app mode so it renders the island UI
		const query = '?mode=dynamic-island';
		const dynamicIslandUrl =
			process.env.NODE_ENV === 'development'
				? `${devURL}/dynamic-island.html${query}`
				: `file://${path.join(__dirname, '..', 'build', 'dynamic-island.html')}${query}`;

		this.dynamicIslandWindow.loadURL(dynamicIslandUrl).catch((err) => {
			log.error('Failed to load dynamic island URL:', err);
		});

		// Configure for non-macOS platforms
		this.dynamicIslandWindow.setAlwaysOnTop(true, 'screen-saver');

		// Set initial mouse event handling - start with mouse events ignored since it's collapsed
		this.setMouseEventHandling(true);

		// Show the window immediately
		this.dynamicIslandWindow.show();
		this.isVisible = true;

		// Listen for resize events from the renderer
		this.dynamicIslandWindow.webContents.on('did-finish-load', () => {
			log.info('Dynamic Island content loaded, setting up resize listener');
			// Send initial state to React component - start collapsed
			log.info('Sending initial state to React component: { expanded: false }');
			this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
		});
	}

	expand() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isExpanded = true;
			log.info('🍎 Dynamic Island expand state tracked (no window on macOS)');
			return;
		}

		if (!this.dynamicIslandWindow || this.isExpanded) return;

		this.isExpanded = true;

		// Enable mouse events when expanded so user can interact with it
		this.setMouseEventHandling(false);

		// Make window focusable when expanded so input fields can receive focus
		this.dynamicIslandWindow.setFocusable(true);

		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: true });
	}

	collapse() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isExpanded = false;
			log.info('🍎 Dynamic Island collapse state tracked (no window on macOS)');
			return;
		}

		if (!this.dynamicIslandWindow || !this.isExpanded) return;

		this.isExpanded = false;

		// Disable mouse events when collapsed so clicks pass through
		this.setMouseEventHandling(true);

		// Make window non-focusable when collapsed to prevent stealing focus
		this.dynamicIslandWindow.setFocusable(false);

		// Notify renderer - window size stays the same
		this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
	}

	setMouseEventHandling(ignore) {
		if (!this.dynamicIslandWindow || this.dynamicIslandWindow.isDestroyed()) return;

		try {
			if (isMacRuntime) {
				// On macOS, use the forward option to allow clicks to pass through
				this.dynamicIslandWindow.setIgnoreMouseEvents(ignore, { forward: true });
			} else if (isWindowsRuntime) {
				// On Windows, when collapsed, allow clicks to pass through to overlay
				// When expanded, capture all mouse events
				if (ignore) {
					// Collapsed state - allow clicks to pass through to overlay underneath
					this.dynamicIslandWindow.setIgnoreMouseEvents(true, { forward: true });
				} else {
					// Expanded state - capture all mouse events
					this.dynamicIslandWindow.setIgnoreMouseEvents(false);
				}
			} else {
				// On other platforms, just ignore mouse events
				this.dynamicIslandWindow.setIgnoreMouseEvents(false);
			}
		} catch (error) {
			log.error('Error setting mouse event handling:', error);
		}
	}

	show() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isVisible = true;
			log.info('🍎 Dynamic Island show state tracked (no window on macOS)');
			return;
		}

		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.show();
			this.isVisible = true;
			log.info('Dynamic Island shown');
		}
	}

	hide() {
		// On macOS (runtime), just track the state without window operations
		if (isMacRuntime) {
			this.isVisible = false;
			log.info('🍎 Dynamic Island hide state tracked (no window on macOS)');
			return;
		}

		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			this.dynamicIslandWindow.hide();
			this.isVisible = false;
		}
	}

	toggleVisibility() {
		if (this.isVisible) {
			this.hide();
		} else {
			this.show();
		}
	}

	getDynamicIslandWindow() {
		return this.dynamicIslandWindow;
	}

	isDynamicIslandVisible() {
		return this.isVisible;
	}

	isDynamicIslandExpanded() {
		return this.isExpanded;
	}

	// Method to reposition Dynamic Island based on platform
	repositionForPlatform() {
		// On macOS (runtime), just log that repositioning was called
		if (isMacRuntime) {
			log.info('🍎 Dynamic Island reposition called (no window on macOS)');
			return;
		}

		if (!this.dynamicIslandWindow || this.dynamicIslandWindow.isDestroyed()) return;

		// Recalculate position based on current platform - eliminate gap with menu bar
		if (isWindowsRuntime) {
			this.position.y = -5; // Slightly above screen edge on Windows
		} else {
			this.position.y = -8; // Slightly above screen edge on Linux to eliminate menu bar gap
		}

		// Update window position
		this.dynamicIslandWindow.setPosition(this.position.x, this.position.y);
	}

	focus() {
		// On macOS (runtime), just log that focus was called
		if (isMacRuntime) {
			log.info('🍎 Dynamic Island focus called (no window on macOS)');
			return;
		}

		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				// Focus the window and bring it to front
				this.dynamicIslandWindow.focus();
				this.dynamicIslandWindow.show();
			} catch (error) {
				log.error('Error focusing Dynamic Island window:', error);
			}
		}
	}

	showDynamicIsland() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				this.dynamicIslandWindow.show();
				this.isVisible = true;
				log.info('Dynamic Island shown');
			} catch (error) {
				log.error('Error showing Dynamic Island:', error);
			}
		}
	}

	expandDynamicIsland() {
		if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
			try {
				// Set expanded size and position
				this.dynamicIslandWindow.setSize(this.expandedSize.width, this.expandedSize.height);
				this.dynamicIslandWindow.setPosition(this.position.x, this.position.y);
				this.isExpanded = true;

				// Enable mouse events when expanded so user can interact with it
				this.setMouseEventHandling(false);

				// Make window focusable when expanded so input fields can receive focus
				this.dynamicIslandWindow.setFocusable(true);

				// Send state change to the window
				this.dynamicIslandWindow.webContents.send('dynamic-island-state', {
					expanded: true,
					visible: true,
				});

				log.info('Dynamic Island expanded');
			} catch (error) {
				log.error('Error expanding Dynamic Island:', error);
			}
		}
	}

	// Flag to prevent multiple cleanup calls
	_isDestroyed = false;

	destroy() {
		// Prevent multiple destroy calls
		if (this._isDestroyed) {
			return;
		}
		this._isDestroyed = true;

		try {
			if (this.dynamicIslandWindow) {
				try {
					if (!this.dynamicIslandWindow.isDestroyed()) {
						this.dynamicIslandWindow.destroy();
					}
				} catch (error) {
					log.error('Error destroying dynamic island window:', error);
				}
				this.dynamicIslandWindow = null;
			}

			// Reset state
			this.isExpanded = false;
			this.isVisible = false;
		} catch (error) {
			log.error('Error destroying DynamicIslandHelper:', error);
		}
	}
};
