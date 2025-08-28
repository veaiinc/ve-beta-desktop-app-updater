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

		// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
		const dynamicIslandHeight = 180; // Height of expanded Dynamic Island
		const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
		this.currentY = 10 + dynamicIslandHeight + gapFromDynamicIsland;

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
			resizable: process.env.NODE_ENV === 'development', // Allow resizing in development
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

		log.info(`Environment: ${process.env.NODE_ENV}`);
		log.info(`Dev URL: ${devURL}`);
		log.info(`Is Development: ${isDevelopment}`);

		const overlayUrl = isDevelopment
			? `${devURL}/overlay.html`
			: `file://${path.join(__dirname, '..', '..', 'build', 'overlay.html')}`;

		log.info(`Loading overlay URL: ${overlayUrl}`);

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

		// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
		const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
		const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
		const askAIY = 10 + dynamicIslandHeight + gapFromDynamicIsland;

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
			resizable: process.env.NODE_ENV === 'development',
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

		this.overlayWindow.on('resize', () => {
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				const bounds = this.overlayWindow.getBounds();
				this.windowSize = { width: bounds.width, height: bounds.height };
			}
		});

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

		this.askAIWindow.on('resize', () => {
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				const bounds = this.askAIWindow.getBounds();
				this.askAIWindowSize = { width: bounds.width, height: bounds.height };
			}
		});

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

	getOverlayWindow() {
		return this.overlayWindow;
	}

	getAskAIWindow() {
		return this.askAIWindow;
	}

	isVisible() {
		return this.isOverlayVisible && this.overlayWindow && !this.overlayWindow.isDestroyed();
	}

	isAskAIWindowVisible() {
		return this.isAskAIVisible && this.askAIWindow && !this.askAIWindow.isDestroyed();
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

		// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
		// Position overlay below Dynamic Island with a gap
		const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
		const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
		const topY = 30 + dynamicIslandHeight + gapFromDynamicIsland;

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

			// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
			const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
			const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
			askAIY = 30 + dynamicIslandHeight + gapFromDynamicIsland;
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

		const newWidth = Math.min(width + 32, Math.floor(workArea.width * maxWidthPercent));
		const newHeight = Math.ceil(height + 16);

		// Update overlay positioning and maintain side-by-side layout if ask AI is visible
		if (this.isAskAIWindowVisible() && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
			// Calculate side-by-side positions with gap
			const gap = 20;
			const totalWidth = newWidth + this.askAIWindowSize.width + gap;
			const startX = Math.floor(workArea.width / 2) - Math.floor(totalWidth / 2);
			const overlayX = startX;
			const askAIX = startX + newWidth + gap;

			// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
			// Position overlay below Dynamic Island with a gap
			const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
			const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
			const overlayY = 30 + dynamicIslandHeight + gapFromDynamicIsland;
			const askAIY = overlayY; // Same Y level as overlay

			// Update overlay window
			this.overlayWindow.setBounds({
				x: overlayX,
				y: overlayY,
				width: newWidth,
				height: newHeight,
			});

			// Update ask AI window position to maintain side-by-side layout
			this.askAIWindow.setBounds({
				x: askAIX,
				y: askAIY,
				width: this.askAIWindowSize.width,
				height: this.askAIWindowSize.height,
			});

			// Update position tracking for both windows
			this.windowPosition = { x: overlayX, y: overlayY };
			this.askAIWindowPosition = { x: askAIX, y: askAIY };
			this.currentX = overlayX;
			this.currentY = overlayY;

			// Make sure ask AI stays on top
			setTimeout(() => {
				if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
					this.askAIWindow.moveTop();
				}
			}, 50);
		} else {
			// Standard centering when ask AI is not visible
			const centerX = Math.floor(workArea.width / 2) - Math.floor(newWidth / 2);

			// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
			// Position overlay below Dynamic Island with a gap
			const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
			const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
			const topY = 30 + dynamicIslandHeight + gapFromDynamicIsland;

			this.overlayWindow.setBounds({
				x: centerX,
				y: topY,
				width: newWidth,
				height: newHeight,
			});
			this.windowPosition = { x: centerX, y: topY };
			this.currentX = centerX;
			this.currentY = topY;
		}

		this.windowSize = { width: newWidth, height: newHeight };
	}

	updateAskAIWindowDimensions(width, height) {
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) return;
		const { screen } = require('electron');
		const workArea = screen.getPrimaryDisplay().workAreaSize;

		const newWidth = Math.min(width, 600); // Allow up to 600px width
		const newHeight = Math.min(height, 500); // Max height 400px

		// Update ask AI positioning and maintain side-by-side layout if overlay is visible
		if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
			// Position ask AI to the right of overlay with gap
			const gap = 20;
			const askAIX = this.currentX + this.windowSize.width + gap;
			const askAIY = this.currentY; // Same Y level as overlay

			this.askAIWindow.setBounds({
				x: askAIX,
				y: askAIY,
				width: newWidth,
				height: newHeight,
			});
			this.askAIWindowPosition = { x: askAIX, y: askAIY };
			this.askAIWindowSize = { width: newWidth, height: newHeight };

			// Make sure ask AI stays on top
			setTimeout(() => {
				if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
					this.askAIWindow.moveTop();
				}
			}, 50);
		} else {
			// Keep Ask AI window centered when overlay is not visible, below Dynamic Island with proper spacing
			const askAIX = Math.floor(workArea.width / 2) - Math.floor(newWidth / 2);

			// Add proper spacing from Dynamic Island (which is at Y=30 with height ~280)
			const dynamicIslandHeight = 220; // Height of expanded Dynamic Island
			const gapFromDynamicIsland = 30; // Gap between Dynamic Island and Overlay
			const askAIY = 10 + dynamicIslandHeight + gapFromDynamicIsland;

			this.askAIWindow.setBounds({
				x: askAIX,
				y: askAIY,
				width: newWidth,
				height: newHeight,
			});
			this.askAIWindowPosition = { x: askAIX, y: askAIY };
			this.askAIWindowSize = { width: newWidth, height: newHeight };
		}
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

		// Register Cmd+/ (Ctrl+/ on Windows) to toggle overlay window
		const cmdSlashRegistered = globalShortcut.register('CommandOrControl+/', () => {
			log.info('🔍 Cmd+/ (Ctrl+/) SHORTCUT TRIGGERED!');
			log.info(`📱 Platform: ${process.platform}`);
			log.info(
				`🖥️  OS: ${
					process.platform === 'win32'
						? 'Windows'
						: process.platform === 'darwin'
						? 'macOS'
						: 'Linux'
				}`,
			);
			log.info(`⏰ Timestamp: ${new Date().toISOString()}`);
			log.info('🔄 Toggling overlay window...');

			// Check if overlay window is visible
			const isOverlayVisible = this.isVisible();
			log.info(`👁️  Overlay window currently visible: ${isOverlayVisible}`);

			if (isOverlayVisible) {
				log.info('🙈 Hiding overlay window...');
				// Hide overlay window only (keep ask AI visible if it's open)
				this.hideOverlayWindow();
				log.info('✅ Overlay window hidden successfully');
			} else {
				log.info('👁️  Showing overlay window...');
				// Show overlay window only
				// Create overlay window if it doesn't exist
				if (!this.getOverlayWindow()) {
					log.info('🏗️  Creating new overlay window...');
					this.createOverlayWindow();
				}
				this.showOverlayWindow();
				log.info('✅ Overlay window shown successfully');
			}

			log.info('🎯 Cmd+/ (Ctrl+/) shortcut execution completed');
		});

		if (cmdSlashRegistered) {
			log.info('✅ Cmd+/ (Ctrl+/) shortcut registered successfully');
			log.info(`🔧 Shortcut key: CommandOrControl+/`);
			log.info(`🖥️  Platform: ${process.platform}`);
		} else {
			log.error('❌ Failed to register Cmd+/ (Ctrl+/) shortcut');
			log.error(`🔧 Attempted shortcut key: CommandOrControl+/`);
			log.error(`🖥️  Platform: ${process.platform}`);

			// On Windows, try alternative shortcuts if the main one fails
			if (process.platform === 'win32') {
				log.info('🔄 Attempting to register Windows alternative shortcuts for Ctrl+/...');
				// Try Ctrl+Alt+Slash as alternative
				const altSlashRegistered = globalShortcut.register('Ctrl+Alt+/', () => {
					log.info('🔍 Ctrl+Alt+/ pressed - alternative shortcut for overlay window');
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
				if (altSlashRegistered) {
					log.info('✅ Ctrl+Alt+/ shortcut registered as alternative');
				} else {
					log.error('❌ Failed to register Ctrl+Alt+/ alternative shortcut');
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
		const f12Registered = globalShortcut.register('F12', () => {
			if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				if (this.overlayWindow.webContents.isDevToolsOpened()) {
					this.overlayWindow.webContents.closeDevTools();
				} else {
					this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
				}
			}
		});

		// Register Cmd+Shift+I as alternative for developer tools
		const cmdShiftIRegistered = globalShortcut.register('CommandOrControl+Shift+I', () => {
			if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				if (this.overlayWindow.webContents.isDevToolsOpened()) {
					this.overlayWindow.webContents.closeDevTools();
				} else {
					this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
				}
			}
		});
		// const cmdEnterRegistered = globalShortcut.register('CommandOrControl+Enter', () => {
		// 	log.info('Cmd+Enter pressed - toggling Ask AI window');
		// 	this.toggleAskAIWindow();
		// });

		// Log registration status
		log.info('📊 Global shortcut registration status:');
		log.info('='.repeat(50));
		log.info(`🔧 Cmd+\\ (Ctrl+\\): ${cmdBackslashRegistered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(`🔧 Cmd+/ (Ctrl+/) : ${cmdSlashRegistered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(
			`🔧 Cmd+Enter (Ctrl+Enter): ${cmdEnterRegistered ? '✅ REGISTERED' : '❌ FAILED'}`,
		);
		log.info(`🔧 Cmd+Left (Ctrl+Left): ${leftRegistered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(`🔧 Cmd+Right (Ctrl+Right): ${rightRegistered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(`🔧 Cmd+Up (Ctrl+Up): ${upRegistered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(`🔧 Cmd+Down (Ctrl+Down): ${downRegistered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(`🔧 F12: ${f12Registered ? '✅ REGISTERED' : '❌ FAILED'}`);
		log.info(
			`🔧 Cmd+Shift+I (Ctrl+Shift+I): ${cmdShiftIRegistered ? '✅ REGISTERED' : '❌ FAILED'}`,
		);
		log.info('='.repeat(50));

		// Summary for Ctrl+/ specifically
		if (cmdSlashRegistered) {
			log.info('🎉 Ctrl+/ shortcut is READY for testing!');
			log.info('💡 To test: Press Ctrl+/ (Windows) or Cmd+/ (macOS)');
			log.info('📝 Check console logs for detailed execution info');
		} else {
			log.warn('⚠️  Ctrl+/ shortcut registration FAILED!');
			log.warn('🔍 Check if another app is using this shortcut');
			log.warn('🔄 Alternative shortcuts may be available');
		}

		app.on('will-quit', () => globalShortcut.unregisterAll());
		log.info('✅ Global shortcuts registration process completed');
	}

	// Test function to verify shortcuts are working
	testShortcuts() {
		log.info('🧪 Testing global shortcuts...');
		log.info('🔍 Press Ctrl+/ (Windows) or Cmd+/ (macOS) to test overlay toggle');
		log.info('🔍 Press Ctrl+Enter (Windows) or Cmd+Enter (macOS) to test Ask AI toggle');
		log.info('🔍 Press F12 to test developer tools toggle');
		log.info('📝 Watch console logs for detailed execution logs');

		// Check if shortcuts are already registered by other apps
		this.checkShortcutConflicts();
	}

	// Check for potential shortcut conflicts
	checkShortcutConflicts() {
		log.info('🔍 Checking for potential shortcut conflicts...');

		const shortcutsToCheck = [
			'CommandOrControl+/',
			'CommandOrControl+\\',
			'CommandOrControl+Return',
			'F12',
		];

		shortcutsToCheck.forEach((shortcut) => {
			const isRegistered = globalShortcut.isRegistered(shortcut);
			log.info(`🔧 ${shortcut}: ${isRegistered ? '✅ REGISTERED' : '❌ NOT REGISTERED'}`);
		});

		log.info('💡 If shortcuts show as NOT REGISTERED, they may be used by other applications');
		log.info('🔄 Try closing other applications that might use these shortcuts');
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
		} else {
			log.info('   Linux-specific info:');
			log.info('     Note: Linux global shortcuts should work by default');
		}
	}

	// Cleanup method to properly close all windows and resources
	cleanup() {
		log.info('🧹 WindowHelper cleanup started...');

		try {
			// Clean up overlay window
			if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				log.info('🧹 Closing overlay window...');
				this.overlayWindow.destroy();
				this.overlayWindow = null;
				this.isOverlayVisible = false;
			}

			// Clean up Ask AI window
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				log.info('🧹 Closing Ask AI window...');
				this.askAIWindow.destroy();
				this.askAIWindow = null;
				this.isAskAIVisible = false;
			}

			// Unregister all global shortcuts
			try {
				globalShortcut.unregisterAll();
				log.info('✅ WindowHelper global shortcuts unregistered');
			} catch (error) {
				log.error('Error unregistering WindowHelper global shortcuts:', error);
			}

			log.info('✅ WindowHelper cleanup completed');
		} catch (error) {
			log.error('Error during WindowHelper cleanup:', error);
		}
	}
}

module.exports = { WindowHelper };
