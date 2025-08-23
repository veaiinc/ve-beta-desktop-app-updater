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
		this.askAIWindowSize = { width: 1000, height: 600 };

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
		// Position at center top
		this.currentX = Math.floor(this.screenWidth / 2) - Math.floor(this.windowSize.width / 2);
		this.currentY = 30; // Closer to top

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

		this.overlayWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		const overlayUrl =
			process.env.NODE_ENV === 'development'
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
		} else {
			// For non-macOS platforms
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

		// Center Ask AI window on screen
		const askAIX =
			Math.floor(this.screenWidth / 2) - Math.floor(this.askAIWindowSize.width / 2);
		const askAIY =
			Math.floor(this.screenHeight / 2) - Math.floor(this.askAIWindowSize.height / 2);

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

		this.askAIWindow = new BrowserWindow(windowSettings);

		const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
		const askAIUrl =
			process.env.NODE_ENV === 'development'
				? `${devURL}/askAI.html`
				: `file://${path.join(__dirname, '..', '..', 'build', 'askAI.html')}`;

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
		} else {
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

	showOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;

		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		const topY = 30;

		// Check if Ask AI window is already visible
		if (this.isAskAIVisible && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
			// Position side by side with existing Ask AI window
			const totalWidth = this.windowSize.width + this.askAIWindowSize.width + 10; // Reduced gap
			const startX = Math.floor(workArea.width / 2) - Math.floor(totalWidth / 2);
			const overlayX = startX;
			const askAIX = startX + this.windowSize.width + 10;

			this.overlayWindow.setBounds({
				x: overlayX,
				y: 30, // Keep overlay at top
				width: this.windowSize.width,
				height: this.windowSize.height,
			});

			// Reposition Ask AI window
			this.askAIWindow.setBounds({
				x: askAIX,
				y: 60, // Ask AI moved down
				width: this.askAIWindowSize.width,
				height: this.askAIWindowSize.height,
			});

			// Update current position tracking
			this.currentX = overlayX;
			this.currentY = 30;
			this.windowPosition = { x: overlayX, y: 30 };
			this.askAIWindowPosition = { x: askAIX, y: 60 };
		} else {
			// Standard center positioning when Ask AI is not visible
			const centerX = Math.floor(workArea.width / 2) - Math.floor(this.windowSize.width / 2);

			this.overlayWindow.setBounds({
				x: centerX,
				y: topY,
				width: this.windowSize.width,
				height: this.windowSize.height,
			});

			// Update current position tracking
			this.currentX = centerX;
			this.currentY = topY;
			this.windowPosition = { x: centerX, y: topY };
		}

		// Ensure window properties for all desktops/spaces on macOS
		if (process.platform === 'darwin') {
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			this.overlayWindow.setVisibleOnAllWorkspaces(true, {
				visibleOnFullScreen: true,
				skipTransformProcessType: true,
			});
		} else {
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
		}

		// Show overlay and ensure main window is hidden
		this.overlayWindow.show();

		// If Ask AI window is visible, make sure it stays on top
		if (this.isAskAIVisible && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
			setTimeout(() => {
				this.askAIWindow.moveTop();
			}, 50);
		}

		if (this.mainWindow && !this.mainWindow.isDestroyed()) {
			this.mainWindow.hide();
		}

		this.isOverlayVisible = true;
	}

	showAskAIWindow() {
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) {
			this.createAskAIWindow();
		}

		// Position Ask AI window centered on screen
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;

		// Center the Ask AI window
		const askAIX = Math.floor(workArea.width / 2) - Math.floor(this.askAIWindowSize.width / 2);
		const askAIY =
			Math.floor(workArea.height / 2) - Math.floor(this.askAIWindowSize.height / 2);

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
		} else {
			this.askAIWindow.setAlwaysOnTop(true, 'floating');
		}

		// Update position tracking
		this.askAIWindowPosition = { x: askAIX, y: askAIY };

		// Show Ask AI window and ensure main window is hidden
		this.askAIWindow.show();

		// Make sure Ask AI window is on top after showing
		setTimeout(() => {
			if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
				this.askAIWindow.moveTop();
				this.askAIWindow.focus();
			}
		}, 100);

		if (this.mainWindow && !this.mainWindow.isDestroyed()) {
			this.mainWindow.hide();
		}

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

		// Allow for larger widths to accommodate side-by-side layout
		// Dynamic width limits based on requested width
		let maxWidthPercent = 0.6; // default 60%
		if (width > 1200) {
			maxWidthPercent = 0.9; // Allow up to 90% for side-by-side layout
		} else if (width > 800) {
			maxWidthPercent = 0.75; // Allow up to 75% for single large panels
		}

		const newWidth = Math.min(width + 32, Math.floor(workArea.width * maxWidthPercent));
		const newHeight = Math.ceil(height + 16);

		// Maintain side-by-side positioning if Ask AI window is visible
		if (this.isAskAIVisible && this.askAIWindow && !this.askAIWindow.isDestroyed()) {
			// Calculate side-by-side positions
			const totalWidth = newWidth + this.askAIWindowSize.width + 10; // Reduced gap
			const startX = Math.floor(workArea.width / 2) - Math.floor(totalWidth / 2);
			const overlayX = startX;
			const askAIX = startX + newWidth + 10;
			const overlayY = 30;
			const askAIY = 60; // Ask AI positioned lower

			// Update both windows
			this.overlayWindow.setBounds({
				x: overlayX,
				y: overlayY,
				width: newWidth,
				height: newHeight,
			});
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

			// Make sure Ask AI stays on top
			setTimeout(() => {
				if (this.askAIWindow && !this.askAIWindow.isDestroyed()) {
					this.askAIWindow.moveTop();
				}
			}, 50);
		} else {
			// Standard centering when Ask AI is not visible
			const centerX = Math.floor(workArea.width / 2) - Math.floor(newWidth / 2);
			const topY = 30;

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

		const newWidth = Math.min(width, 1000); // Allow up to 1000px width
		const newHeight = Math.min(height, 700); // Max height 700px

		// Keep Ask AI window centered
		const askAIX = Math.floor(workArea.width / 2) - Math.floor(newWidth / 2);
		const askAIY = Math.floor(workArea.height / 2) - Math.floor(newHeight / 2);

		this.askAIWindow.setBounds({ x: askAIX, y: askAIY, width: newWidth, height: newHeight });
		this.askAIWindowPosition = { x: askAIX, y: askAIY };
		this.askAIWindowSize = { width: newWidth, height: newHeight };
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

		// Register Cmd+B to toggle overlay window

		const cmdBRegistered = globalShortcut.register('CommandOrControl+B', () => {
			log.info('Cmd+B pressed - toggling overlay window');

			// Create overlay window if it doesn't exist
			if (!this.getOverlayWindow()) {
				this.createOverlayWindow();
			}

			const isOverlayVisible = this.isVisible();

			if (isOverlayVisible) {
				if (this.isAskAIVisible) {
					this.hideAskAIWindow(); // This hides and updates state
				}
				// Hide overlay and show main window
				this.hideOverlayWindow();
				if (this.mainWindow && !this.mainWindow.isDestroyed()) {
					this.mainWindow.show();
					this.mainWindow.focus();
					this.mainWindow.moveTop(); // Ensure main window is brought to front
				}
			} else {
				// Show overlay (which will automatically hide main window)
				this.showOverlayWindow();
			}
		});

		if (cmdBRegistered) {
			log.info('✅ Cmd+B shortcut registered successfully');
		} else {
			log.error('❌ Failed to register Cmd+B shortcut');
		}

		// Register arrow keys for window movement (only when Ask AI window is not visible)
		const leftRegistered = globalShortcut.register('CommandOrControl+Left', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowLeft();
		});

		const rightRegistered = globalShortcut.register('CommandOrControl+Right', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowRight();
		});

		const upRegistered = globalShortcut.register('CommandOrControl+Up', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowUp();
		});

		const downRegistered = globalShortcut.register('CommandOrControl+Down', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowDown();
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
		const cmdEnterRegistered = globalShortcut.register('CommandOrControl+Enter', () => {
			log.info('Cmd+Enter pressed - toggling Ask AI window');
			this.toggleAskAIWindow();
		});

		// Log registration status
		log.info('Global shortcut registration status:');
		log.info(`  Cmd+B: ${cmdBRegistered ? '✅' : '❌'}`);
		log.info(`  Cmd+Left: ${leftRegistered ? '✅' : '❌'}`);
		log.info(`  Cmd+Right: ${rightRegistered ? '✅' : '❌'}`);
		log.info(`  Cmd+Up: ${upRegistered ? '✅' : '❌'}`);
		log.info(`  Cmd+Down: ${downRegistered ? '✅' : '❌'}`);
		log.info(`  F12: ${f12Registered ? '✅' : '❌'}`);
		log.info(`  Cmd+Shift+I: ${cmdShiftIRegistered ? '✅' : '❌'}`);
		log.info(`  Cmd+Enter: ${cmdEnterRegistered ? '✅' : '❌'}`);

		app.on('will-quit', () => globalShortcut.unregisterAll());
		log.info('Global shortcuts registered successfully');
	}
}

module.exports = { WindowHelper };
