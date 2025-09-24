const { BrowserWindow, globalShortcut, screen, app } = require('electron');
const log = require('electron-log');
const path = require('node:path');

class WindowHelper {
	constructor(applyContentProtectionCallback = null) {
		this.overlayWindow = null;
		this.isOverlayVisible = false;
		this.windowPosition = { x: 0, y: 0 };
		this.windowSize = { width: 500, height: 150 };

		// Store callback to apply content protection to new windows
		this.applyContentProtection = applyContentProtectionCallback || (() => {});

		// CRITICAL FIX: Track overlay window readiness for immediate response
		this.overlayWindowReady = false;
		this.overlayPreCreated = false;
		this.pendingOverlayActions = [];

		// Ask AI window properties
		this.askAIWindow = null;
		this.isAskAIVisible = false;
		this.askAIWindowPosition = { x: 0, y: 0 };
		this.askAIWindowSize = { width: 600, height: 600 };

		// Are You There window properties
		this.areYouThereWindow = null;
		this.isAreYouThereVisible = false;
		this.areYouThereWindowPosition = { x: 0, y: 0 };
		this.areYouThereWindowSize = { width: 500, height: 400 };

		// Permission window properties
		this.permissionWindow = null;
		this.isPermissionVisible = false;
		this.permissionWindowPosition = { x: 0, y: 0 };
		this.permissionWindowSize = { width: 520, height: 640 };

		this.screenWidth = 0;
		this.screenHeight = 0;
		this.step = 0;
		this.currentX = 0;
		this.currentY = 0;
		this.mainWindow = null;

		// Simple drag optimization: store Dynamic Island reference
		this.dynamicIslandHelper = null;
	}

	// CRITICAL FIX: Pre-create overlay window for immediate response
	async preCreateOverlayWindow() {
		try {
			if (this.overlayWindow !== null) {
				this.overlayPreCreated = true;
				this.overlayWindowReady = true;
				return true;
			}

			// Create the overlay window but keep it hidden
			this.createOverlayWindow();

			if (this.overlayWindow) {
				// Wait for window to be ready
				await this.waitForOverlayReady();

				// Mark as pre-created and ready
				this.overlayPreCreated = true;
				this.overlayWindowReady = true;

				return true;
			} else {
				return false;
			}
		} catch (error) {
			log.error('❌ Error pre-creating overlay window:', error);
			return false;
		}
	}

	// Wait for overlay window to be fully ready
	async waitForOverlayReady() {
		return new Promise((resolve) => {
			if (!this.overlayWindow) {
				resolve(false);
				return;
			}

			// Wait for the window to be ready-to-show
			this.overlayWindow.once('ready-to-show', () => {
				this.overlayWindowReady = true;
				resolve(true);
			});

			// Fallback timeout
			setTimeout(() => {
				this.overlayWindowReady = true;
				resolve(true);
			}, 2000);
		});
	}

	// Enhanced getOverlayWindow to use pre-created window
	getOverlayWindow() {
		if (this.overlayWindow !== null) {
			return this.overlayWindow;
		}

		// If no overlay exists but we were supposed to pre-create it, create now
		if (!this.overlayPreCreated) {
			log.info('📱 Creating overlay window on-demand (not pre-created)');
			this.createOverlayWindow();
		}

		return this.overlayWindow;
	}

	// Immediate show method for pre-created overlay
	showOverlayImmediate() {
		try {
			log.info('⚡ IMMEDIATE: Showing overlay window NOW');

			if (!this.overlayWindow) {
				if (this.overlayPreCreated) {
					log.warn('⚠️ Overlay was pre-created but window is null, recreating...');
					this.createOverlayWindow();
				} else {
					log.info('📱 Creating overlay window immediately...');
					this.createOverlayWindow();
				}
			}

			if (this.overlayWindow) {
				// Show immediately without waiting
				this.overlayWindow.show();
				this.overlayWindow.focus();
				this.overlayWindow.moveTop();
				this.isOverlayVisible = true;

				log.info('✅ Overlay window shown immediately');
				return true;
			} else {
				log.error('❌ Failed to show overlay immediately - window creation failed');
				return false;
			}
		} catch (error) {
			log.error('❌ Error showing overlay immediately:', error);
			return false;
		}
	}

	createOverlayWindow() {
		if (this.overlayWindow !== null) return;

		// CRITICAL FIX: Reset readiness state when creating new window
		this.overlayWindowReady = false;
		this.pendingOverlayActions = [];

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		this.step = Math.floor(this.screenWidth / 10);
		// Position at center, below Dynamic Island with proper spacing
		this.currentX = Math.floor(this.screenWidth / 2) - Math.floor(this.windowSize.width / 2);

		// Add proper spacing from Dynamic Island (which is now at Y=-8 with height ~280)
		const dynamicIslandHeight = 180; // Height of expanded Dynamic Island
		const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
		this.currentY = 0 + dynamicIslandHeight + gapFromDynamicIsland;

		const windowSettings = {
			width: this.windowSize.width,
			height: this.windowSize.height,
			x: this.currentX,
			y: this.currentY,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, '..', 'preload.js'),
				devTools: true, // Enable developer tools
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true,
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: process.env.NODE_ENV === 'development' ? 'normal' : 'panel', // Use normal window type in development
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
			resizable: false, // Disable resizing
			movable: true, // Explicitly enable window movement
		};

		// Platform-specific window settings
		if (process.platform === 'win32') {
			// Windows-specific settings
			windowSettings.type = 'toolbar'; // Use toolbar type for Windows overlay windows
			windowSettings.alwaysOnTop = true;
			windowSettings.skipTaskbar = true;
			windowSettings.focusable = true;
			windowSettings.transparent = true;
			windowSettings.hasShadow = false;
		}

		this.overlayWindow = new BrowserWindow(windowSettings);

		// Apply content protection to overlay window
		this.applyContentProtection(this.overlayWindow);

		const devURL = (process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173').replace(
			/\/$/,
			'',
		);
		const isDevelopment =
			process.env.NODE_ENV === 'development' ||
			process.env.NODE_ENV?.trim() === 'development';

		const overlayUrl = isDevelopment
			? `${devURL}/overlay.html`
			: `file://${path.join(__dirname, '..', '..', 'build', 'overlay.html')}`;

		this.overlayWindow.loadURL(overlayUrl).catch((err) => {
			log.error('Failed to load overlay URL:', err);
		});

		if (process.platform === 'darwin') {
			// Use the highest window level for maximum visibility during desktop switching
			this.overlayWindow.setAlwaysOnTop(true, 'floating');

			// Configure for all workspaces/desktops with fullscreen support
			this.overlayWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});

			// Hide from Mission Control but keep visible during transitions
			this.overlayWindow.setHiddenInMissionControl(true);

			// Disable click-through - overlay should be interactive
			this.overlayWindow.setIgnoreMouseEvents(false);
			this.overlayWindow.setMovable(true);
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			this.overlayWindow.setIgnoreMouseEvents(false);
			this.overlayWindow.setMovable(true);
			// Windows doesn't have the same workspace concept as macOS
			this.overlayWindow.setVisibleOnAllWorkspaces(true);
		} else {
			// For Linux and other platforms
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			// Disable click-through - overlay should be interactive
			this.overlayWindow.setIgnoreMouseEvents(false);
		}

		this.setupWindowListeners();

		const bounds = this.overlayWindow.getBounds();
		this.windowPosition = { x: bounds.x, y: bounds.y };
		this.windowSize = { width: bounds.width, height: bounds.height };
		this.currentX = bounds.x;
		this.currentY = bounds.y;
	}

	createAskAIWindow() {
		if (this.askAIWindow !== null) return;

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		// Center Ask AI window on screen, below Dynamic Island with proper spacing
		const askAIX =
			Math.floor(this.screenWidth / 2) - Math.floor(this.askAIWindowSize.width / 2);

		// Add proper spacing from Dynamic Island (which is now at Y=-8 with height ~280)
		const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
		const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
		const askAIY = -8 + dynamicIslandHeight + gapFromDynamicIsland;

		const windowSettings = {
			width: this.askAIWindowSize.width,
			height: this.askAIWindowSize.height,
			x: askAIX,
			y: askAIY,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, '..', 'preload.js'),
				devTools: true,
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true,
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: process.env.NODE_ENV === 'development' ? 'normal' : 'panel',
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
			resizable: false, // Disable resizing - keep only movable functionality
			movable: true, // Explicitly enable window movement
			devTools: true,
		};

		// Platform-specific window settings
		if (process.platform === 'win32') {
			// Windows-specific settings
			windowSettings.type = 'toolbar'; // Use toolbar type for Windows overlay windows
			windowSettings.alwaysOnTop = true;
			windowSettings.skipTaskbar = true;
			windowSettings.focusable = true;
			windowSettings.transparent = true;
			windowSettings.hasShadow = false;
		} else if (process.platform === 'darwin') {
			// macOS-specific settings
			windowSettings.type = process.env.NODE_ENV === 'development' ? 'normal' : 'panel';
		}

		this.askAIWindow = new BrowserWindow(windowSettings);

		// Apply content protection to Ask AI window
		this.applyContentProtection(this.askAIWindow);

		const devURL = (process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173').replace(
			/\/$/,
			'',
		);
		const isDevelopment =
			process.env.NODE_ENV === 'development' ||
			process.env.NODE_ENV?.trim() === 'development';

		const askAIUrl = isDevelopment
			? `${devURL}/askAI.html`
			: `file://${path.join(__dirname, '..', '..', 'build', 'askAI.html')}`;

		log.info(`Loading Ask AI URL: ${askAIUrl}`);

		this.askAIWindow.loadURL(askAIUrl).catch((err) => {
			log.error('Failed to load Ask AI URL:', err);
		});

		if (process.platform === 'darwin') {
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
			this.askAIWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			this.askAIWindow.setHiddenInMissionControl(true);
			// Ask AI window should always be interactive - no click-through
			this.askAIWindow.setIgnoreMouseEvents(false);
			this.askAIWindow.setMovable(true);
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
			this.askAIWindow.setIgnoreMouseEvents(false);
			this.askAIWindow.setMovable(true);
			// Windows doesn't have the same workspace concept as macOS
			this.askAIWindow.setVisibleOnAllWorkspaces(true);
		} else {
			// For Linux and other platforms
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
			// Ask AI window should always be interactive - no click-through
			this.askAIWindow.setIgnoreMouseEvents(false);
		}

		this.setupAskAIWindowListeners();

		const bounds = this.askAIWindow.getBounds();
		this.askAIWindowPosition = { x: bounds.x, y: bounds.y };
		this.askAIWindowSize = { width: bounds.width, height: bounds.height };
	}

	createAreYouThereWindow() {
		if (this.areYouThereWindow !== null) return;

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		// Center Are You There window on screen
		const areYouThereX =
			Math.floor(this.screenWidth / 2) - Math.floor(this.areYouThereWindowSize.width / 2);
		const areYouThereY =
			Math.floor(this.screenHeight / 2) - Math.floor(this.areYouThereWindowSize.height / 2);

		const windowSettings = {
			width: this.areYouThereWindowSize.width,
			height: this.areYouThereWindowSize.height,
			x: areYouThereX,
			y: areYouThereY,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, '..', 'preload.js'),
				devTools: true,
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true,
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: process.env.NODE_ENV === 'development' ? 'normal' : 'panel',
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
			resizable: process.env.NODE_ENV === 'development',
			devTools: true,
		};

		// Platform-specific window settings
		if (process.platform === 'win32') {
			// Windows-specific settings
			windowSettings.type = 'toolbar';
			windowSettings.alwaysOnTop = true;
			windowSettings.skipTaskbar = true;
			windowSettings.focusable = true;
			windowSettings.transparent = true;
			windowSettings.hasShadow = false;
		} else if (process.platform === 'darwin') {
			// macOS-specific settings
			windowSettings.type = process.env.NODE_ENV === 'development' ? 'normal' : 'panel';
		}

		this.areYouThereWindow = new BrowserWindow(windowSettings);

		// Apply content protection to Are You There window
		this.applyContentProtection(this.areYouThereWindow);

		const devURL = (process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173').replace(
			/\/$/,
			'',
		);
		const isDevelopment =
			process.env.NODE_ENV === 'development' ||
			process.env.NODE_ENV?.trim() === 'development';

		const areYouThereUrl = isDevelopment
			? `${devURL}/areYouThere.html`
			: `file://${path.join(__dirname, '..', '..', 'build', 'areYouThere.html')}`;

		log.info(`Loading Are You There URL: ${areYouThereUrl}`);

		this.areYouThereWindow.loadURL(areYouThereUrl).catch((err) => {
			log.error('Failed to load Are You There URL:', err);
		});

		if (process.platform === 'darwin') {
			this.areYouThereWindow.setAlwaysOnTop(true, 'floating');
			this.areYouThereWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			this.areYouThereWindow.setHiddenInMissionControl(true);
			// Are You There window should always be interactive
			this.areYouThereWindow.setIgnoreMouseEvents(false);
			this.areYouThereWindow.setMovable(true);
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.areYouThereWindow.setAlwaysOnTop(true, 'floating');
			this.areYouThereWindow.setIgnoreMouseEvents(false);
			this.areYouThereWindow.setMovable(true);
			this.areYouThereWindow.setVisibleOnAllWorkspaces(true);
		} else {
			// For Linux and other platforms
			this.areYouThereWindow.setAlwaysOnTop(true, 'floating');
			this.areYouThereWindow.setIgnoreMouseEvents(false);
		}

		this.setupAreYouThereWindowListeners();

		const bounds = this.areYouThereWindow.getBounds();
		this.areYouThereWindowPosition = { x: bounds.x, y: bounds.y };
		this.areYouThereWindowSize = { width: bounds.width, height: bounds.height };
	}

	createPermissionWindow() {
		if (this.permissionWindow !== null) return;

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		this.screenWidth = workArea.width;
		this.screenHeight = workArea.height;

		// Center permission window on screen
		const permissionX =
			Math.floor(this.screenWidth / 2) - Math.floor(this.permissionWindowSize.width / 2);
		const permissionY =
			Math.floor(this.screenHeight / 2) - Math.floor(this.permissionWindowSize.height / 2);

		const windowSettings = {
			width: this.permissionWindowSize.width,
			height: this.permissionWindowSize.height,
			x: permissionX,
			y: permissionY,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, '..', 'preload.js'),
				devTools: true,
			},
			show: false,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			fullscreenable: false,
			hasShadow: false,
			backgroundColor: '#00000000',
			focusable: true,
			skipTaskbar: true,
			visibleOnAllWorkspaces: true,
			type: process.env.NODE_ENV === 'development' ? 'normal' : 'panel',
			acceptFirstMouse: true,
			disableAutoHideCursor: true,
			resizable: false,
			movable: true,
			devTools: true,
		};

		// Platform-specific window settings
		if (process.platform === 'win32') {
			// Windows-specific settings
			windowSettings.type = 'toolbar';
			windowSettings.alwaysOnTop = true;
			windowSettings.skipTaskbar = true;
			windowSettings.focusable = true;
			windowSettings.transparent = true;
			windowSettings.hasShadow = false;
		} else if (process.platform === 'darwin') {
			// macOS-specific settings
			windowSettings.type = process.env.NODE_ENV === 'development' ? 'normal' : 'panel';
		}

		this.permissionWindow = new BrowserWindow(windowSettings);

		// Apply content protection to permission window
		this.applyContentProtection(this.permissionWindow);

		const devURL = (process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173').replace(
			/\/$/,
			'',
		);
		const isDevelopment =
			process.env.NODE_ENV === 'development' ||
			process.env.NODE_ENV?.trim() === 'development';

		const permissionUrl = isDevelopment
			? `${devURL}/permission.html`
			: `file://${path.join(__dirname, '..', '..', 'build', 'permission.html')}`;

		log.info(`Loading Permission URL: ${permissionUrl}`);

		this.permissionWindow.loadURL(permissionUrl).catch((err) => {
			log.error('Failed to load Permission URL:', err);
		});

		if (process.platform === 'darwin') {
			this.permissionWindow.setAlwaysOnTop(true, 'floating');
			this.permissionWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			this.permissionWindow.setHiddenInMissionControl(true);
			// Permission window should always be interactive
			this.permissionWindow.setIgnoreMouseEvents(false);
			this.permissionWindow.setMovable(true);
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.permissionWindow.setAlwaysOnTop(true, 'floating');
			this.permissionWindow.setIgnoreMouseEvents(false);
			this.permissionWindow.setMovable(true);
			this.permissionWindow.setVisibleOnAllWorkspaces(true);
		} else {
			// For Linux and other platforms
			this.permissionWindow.setAlwaysOnTop(true, 'floating');
			this.permissionWindow.setIgnoreMouseEvents(false);
		}

		this.setupPermissionWindowListeners();

		const bounds = this.permissionWindow.getBounds();
		this.permissionWindowPosition = { x: bounds.x, y: bounds.y };
		this.currentX = bounds.x;
		this.currentY = bounds.y;
	}

	setupWindowListeners() {
		if (!this.overlayWindow) return;

		// Simple drag detection: Hide Dynamic Island during drag, show when stopped
		let isDragging = false;
		let dragEndTimeout;

		// Listen for when window starts moving (drag start)
		this.overlayWindow.on('will-move', () => {
			if (!isDragging) {
				isDragging = true;
				log.info('🎯 DRAG START: Hiding Dynamic Island for smooth dragging');
				this.hideDynamicIslandForDrag();
			}
		});

		this.overlayWindow.on('move', () => {
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				const bounds = this.overlayWindow.getBounds();
				this.windowPosition = { x: bounds.x, y: bounds.y };
				this.currentX = bounds.x;
				this.currentY = bounds.y;

				// Reset the drag end timeout since we're still moving
				if (isDragging) {
					clearTimeout(dragEndTimeout);
					dragEndTimeout = setTimeout(() => {
						isDragging = false;
						log.info('🎯 DRAG END: Showing Dynamic Island again');
						this.showDynamicIslandAfterDrag();
					}, 100); // 100ms after last move event
				}
			}
		});

		// Resize event listener removed - resizing is disabled

		this.overlayWindow.on('closed', () => {
			this.overlayWindow = null;
			this.isOverlayVisible = false;
			// CRITICAL FIX: Reset readiness state when window closes
			this.overlayWindowReady = false;
			this.pendingOverlayActions = [];
		});

		// CRITICAL FIX: Wait for complete loading before marking as ready
		this.overlayWindow.webContents.on('did-finish-load', () => {
			this.overlayWindowReady = true;

			// If there are any pending actions, execute them now
			if (this.pendingOverlayActions && this.pendingOverlayActions.length > 0) {
				this.pendingOverlayActions.forEach((action) => {
					this.overlayWindow.webContents.send('overlay-command', action);
				});
				this.pendingOverlayActions = [];
			}
		});
	}

	setupAskAIWindowListeners() {
		if (!this.askAIWindow) return;

		// Same drag detection for Ask AI window: Hide Dynamic Island during drag, show when stopped
		let isDragging = false;
		let dragEndTimeout;

		// Listen for when Ask AI window starts moving (drag start)
		this.askAIWindow.on('will-move', () => {
			if (!isDragging) {
				isDragging = true;
				log.info('🎯 ASK AI DRAG START: Hiding Dynamic Island for smooth dragging');
				this.hideDynamicIslandForDrag();
			}
		});

		this.askAIWindow.on('move', () => {
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				const bounds = this.askAIWindow.getBounds();
				this.askAIWindowPosition = { x: bounds.x, y: bounds.y };

				// Reset the drag end timeout since we're still moving
				if (isDragging) {
					clearTimeout(dragEndTimeout);
					dragEndTimeout = setTimeout(() => {
						isDragging = false;
						log.info('🎯 ASK AI DRAG END: Showing Dynamic Island again');
						this.showDynamicIslandAfterDrag();
					}, 100); // 100ms after last move event
				}
			}
		});

		// Resize event listener removed - resizing is disabled

		this.askAIWindow.on('closed', () => {
			this.askAIWindow = null;
			this.isAskAIVisible = false;
		});
	}

	setupAreYouThereWindowListeners() {
		if (!this.areYouThereWindow) return;

		// Same drag detection for Are You There window: Hide Dynamic Island during drag, show when stopped
		let isDragging = false;
		let dragEndTimeout;

		// Listen for when Are You There window starts moving (drag start)
		this.areYouThereWindow.on('will-move', () => {
			if (!isDragging) {
				isDragging = true;
				log.info('🎯 ARE YOU THERE DRAG START: Hiding Dynamic Island for smooth dragging');
				this.hideDynamicIslandForDrag();
			}
		});

		this.areYouThereWindow.on('move', () => {
			if (this.areYouThereWindow && !this.areYouThereWindow.isDestroyed()) {
				const bounds = this.areYouThereWindow.getBounds();
				this.areYouThereWindowPosition = { x: bounds.x, y: bounds.y };

				// Reset the drag end timeout since we're still moving
				if (isDragging) {
					clearTimeout(dragEndTimeout);
					dragEndTimeout = setTimeout(() => {
						isDragging = false;
						log.info('🎯 ARE YOU THERE DRAG END: Showing Dynamic Island again');
						this.showDynamicIslandAfterDrag();
					}, 100); // 100ms after last move event
				}
			}
		});

		this.areYouThereWindow.on('resize', () => {
			if (this.areYouThereWindow && !this.areYouThereWindow.isDestroyed()) {
				const bounds = this.areYouThereWindow.getBounds();
				this.areYouThereWindowSize = { width: bounds.width, height: bounds.height };
			}
		});

		this.areYouThereWindow.on('closed', () => {
			this.areYouThereWindow = null;
			this.isAreYouThereVisible = false;
		});

		// Set up mouse event handling for Are You There window
		this.areYouThereWindow.webContents.on('dom-ready', () => {
			// Set Are You There window to be interactive immediately
			this.areYouThereWindow.setIgnoreMouseEvents(false);
		});
	}

	setupPermissionWindowListeners() {
		if (!this.permissionWindow) return;

		// Same drag detection for permission window: Hide Dynamic Island during drag, show when stopped
		let isDragging = false;
		let dragEndTimeout;

		// Listen for when permission window starts moving (drag start)
		this.permissionWindow.on('will-move', () => {
			if (!isDragging) {
				isDragging = true;
				log.info('🎯 PERMISSION DRAG START: Hiding Dynamic Island for smooth dragging');
				this.hideDynamicIslandForDrag();
			}
		});

		this.permissionWindow.on('move', () => {
			if (this.permissionWindow && !this.permissionWindow.isDestroyed()) {
				const bounds = this.permissionWindow.getBounds();
				this.permissionWindowPosition = { x: bounds.x, y: bounds.y };

				// Reset the drag end timeout since we're still moving
				if (isDragging) {
					clearTimeout(dragEndTimeout);
					dragEndTimeout = setTimeout(() => {
						isDragging = false;
						log.info('🎯 PERMISSION DRAG END: Showing Dynamic Island again');
						this.showDynamicIslandAfterDrag();
					}, 100); // 100ms after last move event
				}
			}
		});

		this.permissionWindow.on('closed', () => {
			this.permissionWindow = null;
			this.isPermissionVisible = false;
		});

		// Set up mouse event handling for permission window
		this.permissionWindow.webContents.on('dom-ready', () => {
			// Set permission window to be interactive immediately
			this.permissionWindow.setIgnoreMouseEvents(false);
		});
	}

	setupMainWindowListeners() {
		if (!this.mainWindow) return;

		// Same drag detection for main window: Hide Dynamic Island during drag, show when stopped
		let isDragging = false;
		let dragEndTimeout;

		// Listen for when main window starts moving (drag start)
		this.mainWindow.on('will-move', () => {
			if (!isDragging) {
				isDragging = true;
				log.info('🎯 MAIN WINDOW DRAG START: Hiding Dynamic Island for smooth dragging');
				this.hideDynamicIslandForDrag();
			}
		});

		this.mainWindow.on('move', () => {
			if (this.mainWindow && !this.mainWindow.isDestroyed()) {
				// Reset the drag end timeout since we're still moving
				if (isDragging) {
					clearTimeout(dragEndTimeout);
					dragEndTimeout = setTimeout(() => {
						isDragging = false;
						log.info('🎯 MAIN WINDOW DRAG END: Showing Dynamic Island again');
						this.showDynamicIslandAfterDrag();
					}, 100); // 100ms after last move event
				}
			}
		});
	}

	getAskAIWindow() {
		return this.askAIWindow;
	}

	getAreYouThereWindow() {
		return this.areYouThereWindow;
	}

	getPermissionWindow() {
		return this.permissionWindow;
	}

	// CRITICAL FIX: Send command to overlay with proper queuing if not ready
	sendOverlayCommand(action) {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) {
			console.warn('⚠️ Cannot send overlay command: window not available');
			return false;
		}

		if (this.overlayWindowReady) {
			// Window is ready, send command immediately
			console.log(`✅ IMMEDIATE: Sending overlay command: ${action.action}`);
			this.overlayWindow.webContents.send('overlay-command', action);
			return true;
		} else {
			// Window not ready yet, queue the command
			console.log(`⏳ QUEUING: Overlay not ready, queuing command: ${action.action}`);
			this.pendingOverlayActions.push(action);
			return false;
		}
	}

	isVisible() {
		return this.isOverlayVisible && this.overlayWindow && !this.overlayWindow.isDestroyed();
	}

	isAskAIWindowVisible() {
		return this.isAskAIVisible && this.askAIWindow && !this.askAIWindow.isDestroyed();
	}

	isAreYouThereWindowVisible() {
		return (
			this.isAreYouThereVisible &&
			this.areYouThereWindow &&
			!this.areYouThereWindow.isDestroyed()
		);
	}

	isPermissionWindowVisible() {
		return (
			this.isPermissionVisible &&
			this.permissionWindow &&
			!this.permissionWindow.isDestroyed()
		);
	}

	// CRITICAL FIX: Check if overlay is ready for commands
	isOverlayReady() {
		return this.overlayWindow && !this.overlayWindow.isDestroyed() && this.overlayWindowReady;
	}

	hideOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		const bounds = this.overlayWindow.getBounds();
		this.windowPosition = { x: bounds.x, y: bounds.y };
		this.windowSize = { width: bounds.width, height: bounds.height };
		this.overlayWindow.hide();
		this.isOverlayVisible = false;
	}

	hideAskAIWindow() {
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) return;
		const bounds = this.askAIWindow.getBounds();
		this.askAIWindowPosition = { x: bounds.x, y: bounds.y };
		this.askAIWindowSize = { width: bounds.width, height: bounds.height };
		this.askAIWindow.hide();
		this.isAskAIVisible = false;
	}

	hideAreYouThereWindow() {
		if (!this.areYouThereWindow || this.areYouThereWindow.isDestroyed()) return;
		const bounds = this.areYouThereWindow.getBounds();
		this.areYouThereWindowPosition = { x: bounds.x, y: bounds.y };
		this.areYouThereWindowSize = { width: bounds.width, height: bounds.height };
		this.areYouThereWindow.hide();
		this.isAreYouThereVisible = false;
	}

	// Helper method to hide both windows
	hideAllWindows() {
		this.hideOverlayWindow();
		this.hideAskAIWindow();
	}

	showOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;

		// Don't hide ask AI window - allow both to be visible
		// if (this.isAskAIWindowVisible() && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
		// 	this.hideAskAIWindow();
		// }

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;

		// Add proper spacing from Dynamic Island with platform-specific positioning
		const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
		const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay

		// Platform-specific Dynamic Island Y position - eliminate gap with menu bar
		let dynamicIslandY;
		if (process.platform === 'win32') {
			dynamicIslandY = 0; // At absolute top on Windows to eliminate any gap
		} else {
			dynamicIslandY = -8; // Slightly above screen edge on Mac/Linux to eliminate menu bar gap
		}

		const topY = dynamicIslandY;

		// Position overlay to allow space for ask AI on the right
		let overlayX;
		if (this.isAskAIWindowVisible() && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
			// Position overlay to the left to make room for ask AI on the right
			const gap = 30; // Gap between windows
			const totalWidth = this.windowSize.width + this.askAIWindowSize.width + gap;
			const startX = Math.floor(workArea.width / 2) - Math.floor(totalWidth / 2);
			overlayX = startX;
		} else {
			// Center overlay when ask AI is not visible
			overlayX = Math.floor(workArea.width / 2) - Math.floor(this.windowSize.width / 2);
		}

		this.overlayWindow.setBounds({
			x: overlayX,
			y: topY,
			width: this.windowSize.width,
			height: this.windowSize.height,
		});

		// Update current position tracking
		this.currentX = overlayX;
		this.currentY = topY;
		this.windowPosition = { x: overlayX, y: topY };

		// Ensure window properties for all desktops/spaces on macOS
		if (process.platform === 'darwin') {
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			this.overlayWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			this.overlayWindow.setVisibleOnAllWorkspaces(true);
		} else {
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
		}

		// Show overlay window
		this.overlayWindow.show();

		// Don't hide main window - keep it independent
		// if (this.mainWindow && !this.mainWindow.isDestroyed()) {
		// 	this.mainWindow.hide();
		// }

		this.isOverlayVisible = true;
	}

	showAskAIWindow() {
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) {
			this.createAskAIWindow();
		}

		// Don't hide overlay window - allow both to be visible
		// if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
		// 	this.hideOverlayWindow();
		// }

		// Position Ask AI window to the right of overlay with gap
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		const gap = 20; // Gap between windows

		let askAIX, askAIY;
		if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
			// Position ask AI to the right of overlay
			askAIX = this.currentX + this.windowSize.width + gap;
			askAIY = 80; // Same Y level as overlay
		} else {
			// Center ask AI when overlay is not visible, below Dynamic Island with proper spacing
			askAIX = Math.floor(workArea.width / 2) - Math.floor(this.askAIWindowSize.width / 2);

			// Add proper spacing from Dynamic Island with platform-specific positioning
			const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
			const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay

			// Platform-specific Dynamic Island Y position - eliminate gap with menu bar
			let dynamicIslandY;
			if (process.platform === 'win32') {
				dynamicIslandY = 0; // At absolute top on Windows to eliminate any gap
			} else {
				dynamicIslandY = -8; // Slightly above screen edge on Mac/Linux to eliminate menu bar gap
			}

			askAIY = dynamicIslandY + dynamicIslandHeight + gapFromDynamicIsland;
		}

		this.askAIWindow.setBounds({
			x: askAIX,
			y: askAIY,
			width: this.askAIWindowSize.width,
			height: this.askAIWindowSize.height,
		});

		// Ensure window properties for all desktops/spaces on macOS
		if (process.platform === 'darwin') {
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
			this.askAIWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			// Ensure Ask AI window is above overlay window
			this.askAIWindow.moveTop();
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
			this.askAIWindow.setVisibleOnAllWorkspaces(true);
			this.askAIWindow.moveTop();
		} else {
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
		}

		// Update position tracking
		this.askAIWindowPosition = { x: askAIX, y: askAIY };

		// Show Ask AI window
		this.askAIWindow.show();

		// Make sure Ask AI window is on top after showing
		setTimeout(() => {
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				this.askAIWindow.moveTop();
				this.askAIWindow.focus();
			}
		}, 100);

		// Don't hide main window - keep it independent
		// if (this.mainWindow && !this.mainWindow.isDestroyed()) {
		// 	this.mainWindow.hide();
		// }

		this.isAskAIVisible = true;
	}

	showAreYouThereWindow() {
		if (!this.areYouThereWindow || this.areYouThereWindow.isDestroyed()) {
			this.createAreYouThereWindow();
		}

		// Center the Are You There window on screen
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;

		const areYouThereX =
			Math.floor(workArea.width / 2) - Math.floor(this.areYouThereWindowSize.width / 2);
		const areYouThereY =
			Math.floor(workArea.height / 2) - Math.floor(this.areYouThereWindowSize.height / 2);

		this.areYouThereWindow.setBounds({
			x: areYouThereX,
			y: areYouThereY,
			width: this.areYouThereWindowSize.width,
			height: this.areYouThereWindowSize.height,
		});

		// Ensure window properties for all desktops/spaces on macOS
		if (process.platform === 'darwin') {
			this.areYouThereWindow.setAlwaysOnTop(true, 'floating');
			this.areYouThereWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			// Ensure Are You There window is above all other windows
			this.areYouThereWindow.moveTop();
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.areYouThereWindow.setAlwaysOnTop(true, 'floating');
			this.areYouThereWindow.setVisibleOnAllWorkspaces(true);
			this.areYouThereWindow.moveTop();
		} else {
			this.areYouThereWindow.setAlwaysOnTop(true, 'floating');
		}

		// Update position tracking
		this.areYouThereWindowPosition = { x: areYouThereX, y: areYouThereY };

		// Show Are You There window
		this.areYouThereWindow.show();

		// Make sure Are You There window is on top after showing
		setTimeout(() => {
			if (this.areYouThereWindow && !this.areYouThereWindow.isDestroyed()) {
				this.areYouThereWindow.moveTop();
				this.areYouThereWindow.focus();
			}
		}, 100);

		this.isAreYouThereVisible = true;
	}

	showPermissionWindow() {
		if (!this.permissionWindow || this.permissionWindow.isDestroyed()) {
			this.createPermissionWindow();
		}

		// Center the permission window on screen
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;

		const permissionX =
			Math.floor(workArea.width / 2) - Math.floor(this.permissionWindowSize.width / 2);
		const permissionY =
			Math.floor(workArea.height / 2) - Math.floor(this.permissionWindowSize.height / 2);

		this.permissionWindow.setBounds({
			x: permissionX,
			y: permissionY,
			width: this.permissionWindowSize.width,
			height: this.permissionWindowSize.height,
		});

		// Ensure window properties for all desktops/spaces on macOS
		if (process.platform === 'darwin') {
			this.permissionWindow.setAlwaysOnTop(true, 'floating');
			this.permissionWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
			// Ensure permission window is above all other windows
			this.permissionWindow.moveTop();
		} else if (process.platform === 'win32') {
			// Windows-specific window behavior
			this.permissionWindow.setAlwaysOnTop(true, 'floating');
			this.permissionWindow.setVisibleOnAllWorkspaces(true);
			this.permissionWindow.moveTop();
		} else {
			this.permissionWindow.setAlwaysOnTop(true, 'floating');
		}

		// Update position tracking
		this.permissionWindowPosition = { x: permissionX, y: permissionY };

		// Show permission window
		this.permissionWindow.show();

		// Make sure permission window is on top after showing
		setTimeout(() => {
			if (this.permissionWindow && !this.permissionWindow.isDestroyed()) {
				this.permissionWindow.moveTop();
				this.permissionWindow.focus();
			}
		}, 100);

		this.isPermissionVisible = true;
	}

	hidePermissionWindow() {
		if (!this.permissionWindow || this.permissionWindow.isDestroyed()) return;
		const bounds = this.permissionWindow.getBounds();
		this.permissionWindowPosition = { x: bounds.x, y: bounds.y };
		this.permissionWindowSize = { width: bounds.width, height: bounds.height };
		this.permissionWindow.hide();
		this.isPermissionVisible = false;
	}

	togglePermissionWindow() {
		if (this.isPermissionVisible) {
			this.hidePermissionWindow();
		} else {
			this.showPermissionWindow();
		}
	}

	toggleOverlayWindow() {
		if (this.isOverlayVisible) {
			this.hideOverlayWindow();
		} else {
			this.showOverlayWindow();
		}
	}

	toggleAskAIWindow() {
		if (this.isAskAIVisible) {
			this.hideAskAIWindow();
		} else {
			this.showAskAIWindow();
		}
	}

	toggleAreYouThereWindow() {
		if (this.isAreYouThereVisible) {
			this.hideAreYouThereWindow();
		} else {
			this.showAreYouThereWindow();
		}
	}

	updateWindowDimensions(width, height) {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		const { screen } = require('electron');
		const workArea = screen.getPrimaryDisplay().workAreaSize;

		// Allow for larger widths for side-by-side layout
		// Dynamic width limits based on requested width
		let maxWidthPercent = 0.6; // default 60%
		if (width > 1200) {
			maxWidthPercent = 0.9; // Allow up to 90% for side-by-side layout
		} else if (width > 800) {
			maxWidthPercent = 0.75; // Allow up to 75% for side-by-side layout
		}

		const newWidth = Math.min(width, Math.floor(workArea.width * maxWidthPercent));
		const newHeight = Math.ceil(height);

		// Get current window position to preserve user's manual positioning
		const currentBounds = this.overlayWindow.getBounds();
		const currentX = currentBounds.x;
		const currentY = currentBounds.y;

		// Only update the size, preserve the current position
		this.overlayWindow.setBounds({
			width: newWidth,
			height: newHeight,
		});

		// Update position tracking to reflect current position
		this.windowPosition = { x: currentX, y: currentY };
		this.currentX = currentX;
		this.currentY = currentY;

		// Update ask AI window position only if it's visible and we need to maintain side-by-side layout
		if (this.isAskAIWindowVisible() && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
			// Position ask AI to the right of overlay with gap
			const gap = 20;
			const askAIX = currentX + newWidth + gap;
			const askAIY = currentY; // Same Y level as overlay

			this.askAIWindow.setBounds({
				width: this.askAIWindowSize.width,
				height: this.askAIWindowSize.height,
			});

			// Update ask AI position tracking
			// this.askAIWindowPosition = { x: askAIX, y: askAIY };

			// Make sure ask AI stays on top
			setTimeout(() => {
				if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
					this.askAIWindow.moveTop();
				}
			}, 50);
		}

		this.windowSize = { width: newWidth, height: newHeight };
	}

	updateAskAIWindowDimensions(width, height, position = {}) {
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) return;
		const { screen } = require('electron');
		const workArea = screen.getPrimaryDisplay().workAreaSize;

		const newWidth = width; // Allow up to 600px width
		const newHeight = Math.min(height, workArea.height); // Max height 500px

		// Get current window position to preserve user's manual positioning
		const currentBounds = this.askAIWindow.getBounds();
		const currentX = position.x ?? currentBounds.x;
		const currentY = position.y ?? currentBounds.y;

		// Only update the size, preserve the current position
		this.askAIWindow.setBounds({
			x: currentX,
			y: currentY,
			width: newWidth,
			height: newHeight,
		});

		// Update position tracking to reflect current position
		this.askAIWindowPosition = { x: currentX, y: currentY };
		this.askAIWindowSize = { width: newWidth, height: newHeight };

		// Make sure ask AI stays on top
		setTimeout(() => {
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				this.askAIWindow.moveTop();
			}
		}, 50);
	}

	moveWindowLeft() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentX = Math.max(-this.windowSize.width / 2, this.currentX - this.step);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	moveWindowRight() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentX = Math.min(
			this.screenWidth - this.windowSize.width / 2,
			this.currentX + this.step,
		);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	moveWindowUp() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentY = Math.max(-this.windowSize.height / 2, this.currentY - this.step);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	moveWindowDown() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		this.currentY = Math.min(
			this.screenHeight - this.windowSize.height / 2,
			this.currentY + this.step,
		);
		this.overlayWindow.setPosition(Math.round(this.currentX), Math.round(this.currentY));
	}

	// Simple drag optimization methods
	setDynamicIslandHelper(dynamicIslandHelper) {
		this.dynamicIslandHelper = dynamicIslandHelper;
	}

	hideDynamicIslandForDrag() {
		if (
			this.dynamicIslandHelper?.dynamicIslandWindow &&
			!this.dynamicIslandHelper.dynamicIslandWindow.isDestroyed()
		) {
			log.info('🫥 Hiding Dynamic Island during drag');
			this.dynamicIslandHelper.dynamicIslandWindow.hide();
		}
	}

	showDynamicIslandAfterDrag() {
		if (
			this.dynamicIslandHelper?.dynamicIslandWindow &&
			!this.dynamicIslandHelper.dynamicIslandWindow.isDestroyed()
		) {
			log.info('👁️ Showing Dynamic Island after drag');
			this.dynamicIslandHelper.dynamicIslandWindow.show();
		}
	}

	registerGlobalShortcuts(mainWindow) {
		this.mainWindow = mainWindow;

		// Set up main window drag detection
		this.setupMainWindowListeners();

		// Check if globalShortcut is available
		if (!globalShortcut) {
			log.error('❌ globalShortcut module not available!');
			return;
		}

		// Log system-specific information
		this.logSystemInfo();

		// Register Cmd+\ to toggle overlay window only (independent of main window)
		const cmdBackslashRegistered = globalShortcut.register('CommandOrControl+\\', () => {
			// Check if overlay window is visible
			const isOverlayVisible = this.isVisible();

			if (isOverlayVisible) {
				// Hide overlay window only (keep ask AI visible if it's open)
				this.hideOverlayWindow();
			} else {
				// Show overlay window only
				// Create overlay window if it doesn't exist
				if (!this.getOverlayWindow()) {
					this.createOverlayWindow();
				}
				this.showOverlayWindow();
			}
		});

		if (cmdBackslashRegistered) {
		} else {
			log.error('❌ Failed to register Cmd+\\ shortcut');
			// On Windows, try alternative shortcuts if the main one fails
			if (process.platform === 'win32') {
				// Try Ctrl+Alt+O as alternative for overlay
				const altOverlayRegistered = globalShortcut.register('Ctrl+Alt+O', () => {
					const isOverlayVisible = this.isVisible();
					if (isOverlayVisible) {
						this.hideOverlayWindow();
					} else {
						if (!this.getOverlayWindow()) {
							this.createOverlayWindow();
						}
						this.showOverlayWindow();
					}
				});
				if (altOverlayRegistered) {
				}
			}
		}

		// Register Cmd+Shift+P to toggle content protection (invisibility mode)
		const cmdShiftPRegistered = globalShortcut.register('CommandOrControl+Shift+P', () => {
			// Call the toggle function directly through IPC invoke
			if (this.mainWindow && !this.mainWindow.isDestroyed()) {
				this.mainWindow.webContents.executeJavaScript(`
					if (window.electronApi && window.electronApi.toggleContentProtection) {
						window.electronApi.toggleContentProtection().then(status => {
						}).catch(err => {
							console.error('Error toggling content protection:', err);
						});
					}
				`);
			}
		});

		if (cmdShiftPRegistered) {
		} else {
			// Try alternative shortcut on Windows
			if (process.platform === 'win32') {
				const altProtectionRegistered = globalShortcut.register('Ctrl+Alt+P', () => {
					if (this.mainWindow && !this.mainWindow.isDestroyed()) {
						this.mainWindow.webContents.executeJavaScript(`
							if (window.electronApi && window.electronApi.toggleContentProtection) {
								window.electronApi.toggleContentProtection().then(status => {
								}).catch(err => {
									console.error('Error toggling content protection:', err);
								});
							}
						`);
					}
				});
			}
		}

		// Register Cmd+Enter to toggle ask AI window only (independent of main window)
		const cmdEnterRegistered = globalShortcut.register('CommandOrControl+Return', () => {
			// Create ask AI window if it doesn't exist
			this.createAskAIWindow?.();

			const isAskAIVisible = this.isAskAIWindowVisible();

			if (isAskAIVisible) {
				// Hide ask AI window only
				this.hideAskAIWindow?.();
			} else {
				// Show ask AI window only
				this.showAskAIWindow?.();
			}
		});

		if (cmdEnterRegistered) {
		} else {
			// On Windows, try alternative shortcuts if the main one fails
			if (process.platform === 'win32') {
				// Try Ctrl+Alt+A as alternative for Ask AI
				const altAskAIRegistered = globalShortcut.register('Ctrl+Alt+A', () => {
					if (!this.getAskAIWindow()) {
						this.createAskAIWindow();
					}
					const isAskAIVisible = this.isAskAIWindowVisible();
					if (isAskAIVisible) {
						this.hideAskAIWindow();
					} else {
						this.showAskAIWindow();
					}
				});
				if (altAskAIRegistered) {
				}
			}
		}

		// Register Cmd+. (period) to toggle main window visibility
		const cmdPeriodRegistered = globalShortcut.register('CommandOrControl+.', () => {
			if (this.mainWindow && !this.mainWindow.isDestroyed()) {
				if (this.mainWindow.isVisible()) {
					// Hide main window
					this.mainWindow.hide();
				} else {
					// Show main window
					this.mainWindow.show();
					this.mainWindow.focus();
				}
			} else {
				// Main window doesn't exist, recreate it
				// This will be handled by the main process
				process.emit('recreate-main-window');
			}
		});

		if (cmdPeriodRegistered) {
		} else {
			// On Windows, try alternative shortcuts if the main one fails
			if (process.platform === 'win32') {
				// Try Ctrl+Alt+M as alternative for main window toggle
				const altMainRegistered = globalShortcut.register('Ctrl+Alt+M', () => {
					if (this.mainWindow && !this.mainWindow.isDestroyed()) {
						if (this.mainWindow.isVisible()) {
							this.mainWindow.hide();
						} else {
							this.mainWindow.show();
							this.mainWindow.focus();
						}
					} else {
						process.emit('recreate-main-window');
					}
				});
				if (altMainRegistered) {
				}
			}
		}

		if (import.meta.env.VITE_APP_DEV_ENVIRONMENT === 'production') {
			// Register arrow keys for window movement (only when overlay is visible)
			const leftRegistered = globalShortcut.register('CommandOrControl+Left', () => {
				if (this.isVisible()) this.moveWindowLeft();
			});

			const rightRegistered = globalShortcut.register('CommandOrControl+Right', () => {
				if (this.isVisible()) this.moveWindowRight();
			});

			const upRegistered = globalShortcut.register('CommandOrControl+Up', () => {
				if (this.isVisible()) this.moveWindowUp();
			});

			const downRegistered = globalShortcut.register('CommandOrControl+Down', () => {
				if (this.isVisible()) this.moveWindowDown();
			});
		}
	}

	// Log system-specific information for debugging
	logSystemInfo() {
		// if (process.platform === 'win32') {
		// 	log.info(`     Windows version: ${process.getSystemVersion()}`);
		// } else if (process.platform === 'darwin') {
		// 	log.info(
		// 		'     Check System Preferences > Security & Privacy > Privacy > Accessibility',
		// 	);
		// }
	}

	// Flag to prevent multiple cleanup calls
	_isCleaningUp = false;

	// Cleanup method to properly close all windows and resources
	cleanup() {
		// Prevent multiple cleanup calls
		if (this._isCleaningUp) {
			return;
		}
		this._isCleaningUp = true;

		try {
			// Clean up overlay window
			if (this.overlayWindow) {
				try {
					if (!this.overlayWindow.isDestroyed()) {
						this.overlayWindow.destroy();
					}
				} catch (error) {
					log.error('Error destroying overlay window:', error);
				}
				this.overlayWindow = null;
				this.isOverlayVisible = false;
			}

			// Clean up Ask AI window
			if (this.askAIWindow) {
				try {
					if (!this.askAIWindow.isDestroyed()) {
						this.askAIWindow.destroy();
					}
				} catch (error) {
					log.error('Error destroying Ask AI window:', error);
				}
				this.askAIWindow = null;
				this.isAskAIVisible = false;
			}

			// Clean up Are You There window
			if (this.areYouThereWindow) {
				try {
					if (!this.areYouThereWindow.isDestroyed()) {
						this.areYouThereWindow.destroy();
					}
				} catch (error) {
					log.error('Error destroying Are You There window:', error);
				}
				this.areYouThereWindow = null;
				this.isAreYouThereVisible = false;
			}

			// Unregister all global shortcuts
			try {
				globalShortcut.unregisterAll();
			} catch (error) {
				log.error('Error unregistering WindowHelper global shortcuts:', error);
			}
		} catch (error) {
			log.error('Error during WindowHelper cleanup:', error);
		}
	}
}

module.exports = WindowHelper;
