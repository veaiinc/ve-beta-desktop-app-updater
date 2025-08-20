const { BrowserWindow, globalShortcut, screen, app } = require('electron');
const log = require('electron-log');
const path = require('node:path');

class WindowHelper {
	constructor() {
		this.overlayWindow = null;
		this.isOverlayVisible = false;
		this.windowPosition = { x: 0, y: 0 };
		this.windowSize = { width: 400, height: 150 };
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

	getOverlayWindow() {
		return this.overlayWindow;
	}

	isVisible() {
		return this.isOverlayVisible && this.overlayWindow && !this.overlayWindow.isDestroyed();
	}

	hideOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		const bounds = this.overlayWindow.getBounds();
		this.windowPosition = { x: bounds.x, y: bounds.y };
		this.windowSize = { width: bounds.width, height: bounds.height };
		this.overlayWindow.hide();
		this.isOverlayVisible = false;
	}

	showOverlayWindow() {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;

		// Always position at center top when showing
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		const centerX = Math.floor(workArea.width / 2) - Math.floor(this.windowSize.width / 2);
		const topY = 30;

		this.overlayWindow.setBounds({
			x: centerX,
			y: topY,
			width: this.windowSize.width,
			height: this.windowSize.height,
		});

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

		// Update current position tracking
		this.currentX = centerX;
		this.currentY = topY;
		this.windowPosition = { x: centerX, y: topY };

		// Show overlay and ensure main window is hidden
		this.overlayWindow.show();

		if (this.mainWindow && !this.mainWindow.isDestroyed()) {
			this.mainWindow.hide();
		}

		this.isOverlayVisible = true;
	}

	toggleOverlayWindow() {
		if (this.isOverlayVisible) {
			this.hideOverlayWindow();
		} else {
			this.showOverlayWindow();
		}
	}

	updateWindowDimensions(width, height) {
		if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
		const { screen } = require('electron');
		const workArea = screen.getPrimaryDisplay().workAreaSize;
		const newWidth = Math.min(width + 32, Math.floor(workArea.width * 0.6));
		const newHeight = Math.ceil(height + 16);

		// Keep window centered horizontally at top
		const centerX = Math.floor(workArea.width / 2) - Math.floor(newWidth / 2);
		const topY = 30;

		this.overlayWindow.setBounds({ x: centerX, y: topY, width: newWidth, height: newHeight });
		this.windowPosition = { x: centerX, y: topY };
		this.windowSize = { width: newWidth, height: newHeight };
		this.currentX = centerX;
		this.currentY = topY;
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
		globalShortcut.register('CommandOrControl+B', () => {
			log.info('Cmd+B pressed - toggling overlay window');

			// Create overlay window if it doesn't exist
			if (!this.getOverlayWindow()) {
				this.createOverlayWindow();
			}

			const isOverlayVisible = this.isVisible();

			if (isOverlayVisible) {
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

		// Register arrow keys for window movement
		globalShortcut.register('CommandOrControl+Left', () => {
			if (this.isVisible()) this.moveWindowLeft();
		});

		globalShortcut.register('CommandOrControl+Right', () => {
			if (this.isVisible()) this.moveWindowRight();
		});

		globalShortcut.register('CommandOrControl+Up', () => {
			if (this.isVisible()) this.moveWindowUp();
		});

		globalShortcut.register('CommandOrControl+Down', () => {
			if (this.isVisible()) this.moveWindowDown();
		});

		// Register F12 to toggle developer tools for overlay window
		globalShortcut.register('F12', () => {
			if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				if (this.overlayWindow.webContents.isDevToolsOpened()) {
					this.overlayWindow.webContents.closeDevTools();
				} else {
					this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
				}
			}
		});

		// Register Cmd+Shift+I as alternative for developer tools
		globalShortcut.register('CommandOrControl+Shift+I', () => {
			if (this.isVisible() && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
				if (this.overlayWindow.webContents.isDevToolsOpened()) {
					this.overlayWindow.webContents.closeDevTools();
				} else {
					this.overlayWindow.webContents.openDevTools({ mode: 'detach' });
				}
			}
		});

		app.on('will-quit', () => globalShortcut.unregisterAll());
		log.info('Global shortcuts registered successfully');
	}
}

module.exports = { WindowHelper };
