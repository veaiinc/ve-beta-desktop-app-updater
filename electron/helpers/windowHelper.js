const { BrowserWindow, globalShortcut, screen, app } = require('electron');
const log = require('electron-log');
const path = require('node:path');

class WindowHelper {
	constructor() {
		this.overlayWindow = null;
		this.isOverlayVisible = false;
		this.windowPosition = { x: 0, y: 0 };
		this.windowSize = { width: 500, height: 150 };

		// Ask AI window properties
		this.askAIWindow = null;
		this.isAskAIVisible = false;
		this.askAIWindowPosition = { x: 0, y: 0 };
		this.askAIWindowSize = { width: 600, height: 500 };

		// Are You There window properties
		this.areYouThereWindow = null;
		this.isAreYouThereVisible = false;
		this.areYouThereWindowPosition = { x: 0, y: 0 };
		this.areYouThereWindowSize = { width: 500, height: 400 };

		this.screenWidth = 0;
		this.screenHeight = 0;
		this.step = 0;
		this.currentX = 0;
		this.currentY = 0;
		this.mainWindow = null;
	}

	createOverlayWindow() {
		if (this.overlayWindow !== null) return;

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
		} else if (process.platform === 'darwin') {
			// macOS-specific settings
			windowSettings.type = process.env.NODE_ENV === 'development' ? 'normal' : 'panel';
		}

		this.overlayWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
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

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
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

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
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

	setupWindowListeners() {
		if (!this.overlayWindow) return;

		this.overlayWindow.on('move', () => {
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				const bounds = this.overlayWindow.getBounds();
				this.windowPosition = { x: bounds.x, y: bounds.y };
				this.currentX = bounds.x;
				this.currentY = bounds.y;
			}
		});

		// Resize event listener removed - resizing is disabled

		this.overlayWindow.on('closed', () => {
			this.overlayWindow = null;
			this.isOverlayVisible = false;
		});

		// Set up basic window event handling
		this.overlayWindow.webContents.on('dom-ready', () => {
			console.log('Overlay window DOM ready - click-through disabled');
		});
	}

	setupAskAIWindowListeners() {
		if (!this.askAIWindow) return;

		this.askAIWindow.on('move', () => {
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				const bounds = this.askAIWindow.getBounds();
				this.askAIWindowPosition = { x: bounds.x, y: bounds.y };
			}
		});

		// Resize event listener removed - resizing is disabled

		this.askAIWindow.on('closed', () => {
			this.askAIWindow = null;
			this.isAskAIVisible = false;
		});

		// Set up mouse event handling for Ask AI window
		this.askAIWindow.webContents.on('dom-ready', () => {
			// Set ask AI window to be interactive immediately
			this.askAIWindow.setIgnoreMouseEvents(false);

			this.askAIWindow.webContents.executeJavaScript(`
				// Always keep the window interactive for Ask AI
				if (window.electronApi?.askAI?.setIgnoreMouseEvents) {
					window.electronApi.askAI.setIgnoreMouseEvents(false);
				}
				
				// Global click handler
				document.addEventListener('click', (e) => {
					// Ensure click-through remains disabled
					if (window.electronApi?.askAI?.setIgnoreMouseEvents) {
						window.electronApi.askAI.setIgnoreMouseEvents(false);
					}
				});
			`);
		});
	}

	setupAreYouThereWindowListeners() {
		if (!this.areYouThereWindow) return;

		this.areYouThereWindow.on('move', () => {
			if (this.areYouThereWindow && !this.areYouThereWindow.isDestroyed()) {
				const bounds = this.areYouThereWindow.getBounds();
				this.areYouThereWindowPosition = { x: bounds.x, y: bounds.y };
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

	getOverlayWindow() {
		return this.overlayWindow;
	}

	getAskAIWindow() {
		return this.askAIWindow;
	}

	getAreYouThereWindow() {
		return this.areYouThereWindow;
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
			dynamicIslandY = 0; // Slightly above screen edge on Windows
		} else {
			dynamicIslandY = -8; // Slightly above screen edge on Mac/Linux to eliminate menu bar gap
		}

		const topY = dynamicIslandY + dynamicIslandHeight + gapFromDynamicIsland;

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
				dynamicIslandY = -5; // Slightly above screen edge on Windows
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
			x: currentX,
			y: currentY,
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
				x: askAIX,
				y: askAIY,
				width: this.askAIWindowSize.width,
				height: this.askAIWindowSize.height,
			});

			// Update ask AI position tracking
			this.askAIWindowPosition = { x: askAIX, y: askAIY };

			// Make sure ask AI stays on top
			setTimeout(() => {
				if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
					this.askAIWindow.moveTop();
				}
			}, 50);
		}

		this.windowSize = { width: newWidth, height: newHeight };
	}

	updateAskAIWindowDimensions(width, height) {
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) return;
		const { screen } = require('electron');
		const workArea = screen.getPrimaryDisplay().workAreaSize;

		const newWidth = Math.min(width, 600); // Allow up to 600px width
		const newHeight = Math.min(height, 500); // Max height 500px

		// Get current window position to preserve user's manual positioning
		const currentBounds = this.askAIWindow.getBounds();
		const currentX = currentBounds.x;
		const currentY = currentBounds.y;

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

	registerGlobalShortcuts(mainWindow) {
		this.mainWindow = mainWindow;

		log.info('🚀 Starting global shortcut registration...');
		log.info(`🖥️  Platform: ${process.platform}`);
		log.info(
			`🖥️  OS: ${
				process.platform === 'win32'
					? 'Windows'
					: process.platform === 'darwin'
					? 'macOS'
					: 'Linux'
			}`,
		);
		log.info(`⏰ Registration time: ${new Date().toISOString()}`);
		log.info(`🔧 Node.js version: ${process.version}`);
		log.info(`🔧 Electron version: ${process.versions.electron}`);
		log.info(`🔧 Chrome version: ${process.versions.chrome}`);

		// Check if globalShortcut is available
		if (!globalShortcut) {
			log.error('❌ globalShortcut module not available!');
			return;
		}

		log.info('✅ globalShortcut module available, proceeding with registration...');

		// Log system-specific information
		this.logSystemInfo();

		// Register Cmd+\ to toggle overlay window only (independent of main window)
		const cmdBackslashRegistered = globalShortcut.register('CommandOrControl+\\', () => {
			log.info('Cmd+\\ pressed - toggling overlay window only');

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
			log.info('✅ Cmd+\\ shortcut registered successfully');
		} else {
			log.error('❌ Failed to register Cmd+\\ shortcut');
			// On Windows, try alternative shortcuts if the main one fails
			if (process.platform === 'win32') {
				log.info('Attempting to register Windows alternative shortcuts...');
				// Try Ctrl+Alt+O as alternative for overlay
				const altOverlayRegistered = globalShortcut.register('Ctrl+Alt+O', () => {
					log.info('Ctrl+Alt+O pressed - toggling overlay window');
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
					log.info('✅ Ctrl+Alt+O shortcut registered as alternative');
				}
			}
		}

		// Register Cmd+Enter to toggle ask AI window only (independent of main window)
		const cmdEnterRegistered = globalShortcut.register('CommandOrControl+Return', () => {
			log.info('Cmd+Enter pressed - toggling ask AI window only');

			// Create ask AI window if it doesn't exist
			if (!this.getAskAIWindow()) {
				this.createAskAIWindow();
			}

			const isAskAIVisible = this.isAskAIWindowVisible();

			if (isAskAIVisible) {
				// Hide ask AI window only
				this.hideAskAIWindow();
			} else {
				// Show ask AI window only
				this.showAskAIWindow();
			}
		});

		if (cmdEnterRegistered) {
			log.info('✅ Cmd+Enter shortcut registered successfully');
		} else {
			log.error('❌ Failed to register Cmd+Enter shortcut');
			// On Windows, try alternative shortcuts if the main one fails
			if (process.platform === 'win32') {
				log.info('Attempting to register Windows alternative shortcuts...');
				// Try Ctrl+Alt+A as alternative for Ask AI
				const altAskAIRegistered = globalShortcut.register('Ctrl+Alt+A', () => {
					log.info('Ctrl+Alt+A pressed - toggling ask AI window');
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
					log.info('✅ Ctrl+Alt+A shortcut registered as alternative');
				}
			}
		}

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

		// Register F12 to toggle developer tools for overlay window
		let f12Registered = false;
		try {
			f12Registered = globalShortcut.register('F12', () => {
				log.info('F12 pressed - attempting to open developer tools');

				// First, try to open dev tools for overlay window if visible
				if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
					log.info('Opening dev tools for overlay window');
					if (this.overlayWindow.webContents.isDevToolsOpened()) {
						this.overlayWindow.webContents.closeDevTools();
					} else {
						this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
					}
					return;
				}

				// If overlay not visible, try Ask AI window
				if (
					this.askAIWindow &&
					!this.askAIWindow.isDestroyed() &&
					this.askAIWindow.isVisible()
				) {
					log.info('Opening dev tools for Ask AI window');
					if (this.askAIWindow.webContents.isDevToolsOpened()) {
						this.askAIWindow.webContents.closeDevTools();
					} else {
						this.askAIWindow.webContents.openDevTools({ mode: 'detach' });
					}
					return;
				}

				// If no overlay windows, open for main window
				const mainWindow =
					BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
				if (mainWindow && !mainWindow.isDestroyed()) {
					log.info('Opening dev tools for main/focused window');
					if (mainWindow.webContents.isDevToolsOpened()) {
						mainWindow.webContents.closeDevTools();
					} else {
						mainWindow.webContents.openDevTools({ mode: 'detach' });
					}
				}
			});
		} catch (error) {
			log.warn(`Failed to register F12 shortcut: ${error.message}`);
			log.info('F12 may be used by another application - trying alternative Ctrl+F12');

			// Try alternative F12 shortcut
			try {
				f12Registered = globalShortcut.register('CommandOrControl+F12', () => {
					log.info('Ctrl+F12 pressed - attempting to open developer tools');

					// First, try to open dev tools for overlay window if visible
					if (
						this.isVisible() &&
						this.overlayWindow &&
						!this.overlayWindow.isDestroyed()
					) {
						log.info('Opening dev tools for overlay window');
						if (this.overlayWindow.webContents.isDevToolsOpened()) {
							this.overlayWindow.webContents.closeDevTools();
						} else {
							this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
						}
						return;
					}

					// If overlay not visible, try Ask AI window
					if (
						this.askAIWindow &&
						!this.askAIWindow.isDestroyed() &&
						this.askAIWindow.isVisible()
					) {
						log.info('Opening dev tools for Ask AI window');
						if (this.askAIWindow.webContents.isDevToolsOpened()) {
							this.askAIWindow.webContents.closeDevTools();
						} else {
							this.askAIWindow.webContents.openDevTools({ mode: 'detach' });
						}
						return;
					}

					// If no overlay windows, open for main window
					const mainWindow =
						BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
					if (mainWindow && !mainWindow.isDestroyed()) {
						log.info('Opening dev tools for main/focused window');
						if (mainWindow.webContents.isDevToolsOpened()) {
							mainWindow.webContents.closeDevTools();
						} else {
							mainWindow.webContents.openDevTools({ mode: 'detach' });
						}
					}
				});
				if (f12Registered) {
					log.info('✅ Ctrl+F12 shortcut registered as F12 alternative');
				}
			} catch (altError) {
				log.warn(`Failed to register Ctrl+F12 alternative: ${altError.message}`);
			}
		}

		// Register Cmd+Shift+I as alternative for developer tools
		const cmdShiftIRegistered = globalShortcut.register('CommandOrControl+Shift+I', () => {
			log.info('Ctrl+Shift+I pressed - attempting to open developer tools');

			// First, try to open dev tools for overlay window if visible
			if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				log.info('Opening dev tools for overlay window');
				if (this.overlayWindow.webContents.isDevToolsOpened()) {
					this.overlayWindow.webContents.closeDevTools();
				} else {
					this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
				}
				return;
			}

			// If overlay not visible, try Ask AI window
			if (
				this.askAIWindow &&
				!this.askAIWindow.isDestroyed() &&
				this.askAIWindow.isVisible()
			) {
				log.info('Opening dev tools for Ask AI window');
				if (this.askAIWindow.webContents.isDevToolsOpened()) {
					this.askAIWindow.webContents.closeDevTools();
				} else {
					this.askAIWindow.webContents.openDevTools({ mode: 'detach' });
				}
				return;
			}

			// If no overlay windows, open for main window
			const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
			if (mainWindow && !mainWindow.isDestroyed()) {
				log.info('Opening dev tools for main/focused window');
				if (mainWindow.webContents.isDevToolsOpened()) {
					mainWindow.webContents.closeDevTools();
				} else {
					mainWindow.webContents.openDevTools({ mode: 'detach' });
				}
			}
		});

		// Check if shortcuts are already registered by other apps
		this.checkShortcutConflicts();
	}

	// Check for potential shortcut conflicts
	checkShortcutConflicts() {
		const shortcutsToCheck = [
			'CommandOrControl+\\',
			'CommandOrControl+Return',
			'F12',
			'CommandOrControl+F12',
			'CommandOrControl+Shift+I',
		];

		shortcutsToCheck.forEach((shortcut) => {
			const isRegistered = globalShortcut.isRegistered(shortcut);
			log.info(`🔧 ${shortcut}: ${isRegistered ? '✅ REGISTERED' : '❌ NOT REGISTERED'}`);
		});
	}

	// Log system-specific information for debugging
	logSystemInfo() {
		log.info('📋 System Information:');
		log.info(`   Architecture: ${process.arch}`);
		log.info(`   Platform: ${process.platform}`);
		log.info(`   Version: ${process.version}`);

		if (process.platform === 'win32') {
			log.info('   Windows-specific info:');
			log.info(`     Windows version: ${process.getSystemVersion()}`);
			log.info('     Note: Windows global shortcuts should work by default');
		} else if (process.platform === 'darwin') {
			log.info('   macOS-specific info:');
			log.info('     Note: macOS requires accessibility permissions for global shortcuts');
			log.info(
				'     Check System Preferences > Security & Privacy > Privacy > Accessibility',
			);
		}
	}

	// Cleanup method to properly close all windows and resources
	cleanup() {
		try {
			// Clean up overlay window
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				this.overlayWindow.destroy();
				this.overlayWindow = null;
				this.isOverlayVisible = false;
			}

			// Clean up Ask AI window
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				this.askAIWindow.destroy();
				this.askAIWindow = null;
				this.isAskAIVisible = false;
			}

			// Clean up Are You There window
			if (this.areYouThereWindow && !this.areYouThereWindow.isDestroyed()) {
				log.info('🧹 Closing Are You There window...');
				this.areYouThereWindow.destroy();
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

module.exports = { WindowHelper };
