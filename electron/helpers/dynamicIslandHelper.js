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
			log.info('Skipping Dynamic Island window creation on macOS (using native NotchDrop)');
			return;
		}

		log.info('Creating Dynamic Island window for platform:', process.platform);
		log.info('NODE_ENV:', process.env.NODE_ENV);
		log.info('__dirname:', __dirname);

		const windowSettings = {
			width: this.expandedSize.width, // Start with expanded size (875x280)
			height: this.expandedSize.height, // Start with expanded size (875x280)
			x: this.position.x,
			y: this.position.y, // Y=0 to stick to top of screen
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, '..', 'preload.js'),
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

		// Check preload file exists
		const preloadPath = path.join(__dirname, '..', 'preload.js');
		const fs = require('fs');
		if (!fs.existsSync(preloadPath)) {
			log.error('Preload file not found at:', preloadPath);
			log.error('Available files in parent directory:', fs.readdirSync(path.join(__dirname, '..')));
			return;
		}
		log.info('Preload file found at:', preloadPath);

		try {
			this.dynamicIslandWindow = new BrowserWindow(windowSettings);
			log.info('Dynamic Island BrowserWindow created successfully');
		} catch (error) {
			log.error('Failed to create Dynamic Island BrowserWindow:', error);
			return;
		}

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		// Force the Dynamic Island React app mode so it renders the island UI
		const query = '?mode=dynamic-island';
		
		let dynamicIslandUrl;
		if (process.env.NODE_ENV === 'development') {
			dynamicIslandUrl = `${devURL}/dynamic-island.html${query}`;
		} else {
			// Try multiple possible paths for production
			const possiblePaths = [
				path.join(__dirname, '..', 'build', 'dynamic-island.html'),
				path.join(__dirname, '..', '..', 'build', 'dynamic-island.html'),
				path.join(process.resourcesPath, 'build', 'dynamic-island.html'),
				path.join(process.resourcesPath, 'app', 'build', 'dynamic-island.html'),
			];
			
			let htmlPath = null;
			for (const testPath of possiblePaths) {
				if (fs.existsSync(testPath)) {
					htmlPath = testPath;
					log.info('Found Dynamic Island HTML at:', htmlPath);
					break;
				}
			}
			
			if (!htmlPath) {
				log.error('Dynamic Island HTML file not found in any of these locations:');
				possiblePaths.forEach(p => log.error('  -', p));
				
				// Debug: show what directories exist
				try {
					const parentDir = path.join(__dirname, '..');
					if (fs.existsSync(parentDir)) {
						const parentFiles = fs.readdirSync(parentDir);
						log.error('Available in parent directory:', parentFiles);
					}
					
					if (process.resourcesPath && fs.existsSync(process.resourcesPath)) {
						const resourceFiles = fs.readdirSync(process.resourcesPath);
						log.error('Available in resources directory:', resourceFiles);
					}
				} catch (dirError) {
					log.error('Could not read directories:', dirError);
				}
				return;
			}
			
			dynamicIslandUrl = `file://${htmlPath}${query}`;
		}

		log.info('Loading Dynamic Island URL:', dynamicIslandUrl);

		this.dynamicIslandWindow.loadURL(dynamicIslandUrl).catch((err) => {
			log.error('Failed to load dynamic island URL:', dynamicIslandUrl, err);
		});

		// Configure for non-macOS platforms
		try {
			this.dynamicIslandWindow.setAlwaysOnTop(true, 'screen-saver');
			log.info('Dynamic Island set to always on top');
		} catch (error) {
			log.error('Failed to set Dynamic Island always on top:', error);
		}

		// Set initial mouse event handling - start with mouse events ignored since it's collapsed
		this.setMouseEventHandling(true);

		// Show the window immediately with enhanced visibility
		try {
			this.dynamicIslandWindow.show();
			this.dynamicIslandWindow.focus();
			this.dynamicIslandWindow.moveTop();
			this.isVisible = true;
			log.info('Dynamic Island window shown successfully');
			
			// Force visibility after multiple delays to ensure it's visible
			setTimeout(() => {
				if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
					this.dynamicIslandWindow.setVisibleOnAllWorkspaces(true);
					this.dynamicIslandWindow.setAlwaysOnTop(true, 'screen-saver', 1);
					this.dynamicIslandWindow.show(); // Show again
					log.info('Dynamic Island visibility enforced (1st pass)');
				}
			}, 500);
			
			// Second visibility enforcement
			setTimeout(() => {
				if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
					this.dynamicIslandWindow.show();
					this.dynamicIslandWindow.focus();
					this.dynamicIslandWindow.moveTop();
					log.info('Dynamic Island visibility enforced (2nd pass)');
				}
			}, 2000);
			
			// Third visibility enforcement for stubborn cases
			setTimeout(() => {
				if (this.dynamicIslandWindow && !this.dynamicIslandWindow.isDestroyed()) {
					this.dynamicIslandWindow.show();
					this.dynamicIslandWindow.setAlwaysOnTop(true, 'screen-saver', 2);
					log.info('Dynamic Island visibility enforced (3rd pass)');
				}
			}, 5000);
		} catch (error) {
			log.error('Failed to show Dynamic Island window:', error);
		}

		// Listen for window events
		this.dynamicIslandWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
			log.error('Dynamic Island failed to load:', {
				errorCode,
				errorDescription,
				validatedURL
			});
		});

		this.dynamicIslandWindow.webContents.on('dom-ready', () => {
			log.info('Dynamic Island DOM ready');
		});

		this.dynamicIslandWindow.on('closed', () => {
			log.info('Dynamic Island window closed');
			this.dynamicIslandWindow = null;
			this.isVisible = false;
		});

		// Listen for resize events from the renderer
		this.dynamicIslandWindow.webContents.on('did-finish-load', () => {
			log.info('Dynamic Island content loaded successfully, setting up resize listener');
			// Send initial state to React component - start collapsed
			log.info('Sending initial state to React component: { expanded: false }');
			try {
				this.dynamicIslandWindow.webContents.send('dynamic-island-state', { expanded: false });
				log.info('Initial state sent to Dynamic Island successfully');
			} catch (error) {
				log.error('Failed to send initial state to Dynamic Island:', error);
			}
		});
	}

	// Force show the Dynamic Island - can be called from IPC
	forceShow() {
		if (!this.dynamicIslandWindow || this.dynamicIslandWindow.isDestroyed()) {
			log.warn('Cannot force show - Dynamic Island window not available');
			return false;
		}

		try {
			log.info('Force showing Dynamic Island...');
			this.dynamicIslandWindow.show();
			this.dynamicIslandWindow.showInactive();
			this.dynamicIslandWindow.focus();
			this.dynamicIslandWindow.moveTop();
			this.dynamicIslandWindow.setAlwaysOnTop(true, 'screen-saver', 2);
			this.dynamicIslandWindow.setVisibleOnAllWorkspaces(true);
			this.isVisible = true;
			log.info('Dynamic Island force shown successfully');
			return true;
		} catch (error) {
			log.error('Failed to force show Dynamic Island:', error);
			return false;
		}
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
