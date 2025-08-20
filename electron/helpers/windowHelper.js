const { BrowserWindow, globalShortcut, screen, app } = require('electron');
const log = require('electron-log');
const path = require('node:path');

class WindowHelper {
	constructor() {
		this.overlayWindow = null;
		this.isOverlayVisible = false;
		this.windowPosition = { x: 0, y: 0 };
		this.windowSize = { width: 400, height: 150 };
		
		// Ask AI window properties
		this.askAIWindow = null;
		this.isAskAIVisible = false;
		this.askAIWindowPosition = { x: 0, y: 0 };
		this.askAIWindowSize = { width: 500, height: 400 };
		
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

			// Start with click-through enabled - will be controlled dynamically
			this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
			this.overlayWindow.setMovable(true);
		} else {
			// For non-macOS platforms
			this.overlayWindow.setAlwaysOnTop(true, 'floating');
			// Start with click-through enabled - will be controlled dynamically
			this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
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

		// Position Ask AI window to the right side of overlay (side by side)
		const overlayX = Math.floor(this.screenWidth / 2) - Math.floor((this.windowSize.width + this.askAIWindowSize.width + 20) / 2);
		const askAIX = overlayX + this.windowSize.width + 20; // 20px gap between windows
		const askAIY = 30; // Same top position as overlay

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

		// Set up mouse event handling for precise click-through behavior
		this.overlayWindow.webContents.on('dom-ready', () => {
			// Inject JavaScript to handle mouse events more precisely
			this.overlayWindow.webContents.executeJavaScript(`
				let isOverContent = false;
				
				// Function to check if mouse is over actual overlay content
				function isMouseOverContent(x, y) {
					// Look for multiple possible selectors
					const selectors = [
						'[data-overlay-content]',
						'.overlay-content', 
						'.overlay-container',
						'.overlay-app',
						'.live-intelligence-panel',
						'.transcript-panel',
						'.shortcut-bar'
					];
					
					for (const selector of selectors) {
						const element = document.querySelector(selector);
						if (element) {
							const rect = element.getBoundingClientRect();
							const isOver = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
							if (isOver) {
								return true;
							}
						}
					}
					
					// Also check if mouse is over any button or interactive element
					const elementAtPoint = document.elementFromPoint(x, y);
					if (elementAtPoint) {
						const tagName = elementAtPoint.tagName.toLowerCase();
						const isInteractive = tagName === 'button' || tagName === 'input' || 
											 tagName === 'a' || elementAtPoint.onclick ||
											 elementAtPoint.closest('button') ||
											 elementAtPoint.closest('[data-overlay-content]');
						if (isInteractive) {
							console.log('Mouse over interactive element:', elementAtPoint);
							return true;
						}
					}
					
					return false;
				}
				
				// Function to disable click-through for the entire overlay area
				function disableClickThrough() {
					console.log('Disabling click-through');
					window.electronApi?.setIgnoreMouseEvents?.(false);
					isOverContent = true;
				}
				
				// Function to enable click-through
				function enableClickThrough() {
					console.log('Enabling click-through');
					window.electronApi?.setIgnoreMouseEvents?.(true);
					isOverContent = false;
				}
				
				// Initially disable click-through when DOM is ready
				setTimeout(() => {
					console.log('DOM ready - disabling click-through initially');
					disableClickThrough();
				}, 100);
				
				// Handle mouse movement to determine if over content area
				document.addEventListener('mousemove', (e) => {
					const overContent = isMouseOverContent(e.clientX, e.clientY);
					
					if (overContent !== isOverContent) {
						if (overContent) {
							disableClickThrough();
						} else {
							enableClickThrough();
						}
					}
				});
				
				// Handle mouse entering the window - disable click-through
				document.addEventListener('mouseenter', (e) => {
					console.log('Mouse entered overlay window');
					disableClickThrough();
				});
				
				// Handle mouse leaving the window - enable click-through after delay
				document.addEventListener('mouseleave', () => {
					console.log('Mouse left overlay window');
					setTimeout(() => {
						enableClickThrough();
					}, 100); // Small delay to prevent flicker
				});
				
				// Disable click-through when clicking anywhere in the overlay
				document.addEventListener('click', (e) => {
					console.log('Click detected in overlay');
					disableClickThrough();
				});
			`);
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
		if (!this.askAIWindow || this.askAIWindow.isDestroyed()) return;

		// Position side by side with overlay window
		const primaryDisplay = screen.getPrimaryDisplay();
		const workArea = primaryDisplay.workAreaSize;
		
		// Calculate positions for side-by-side layout
		const totalWidth = this.windowSize.width + this.askAIWindowSize.width + 10; // 10px gap
		const startX = Math.floor(workArea.width / 2) - Math.floor(totalWidth / 2);
		
		// Overlay on the left
		const overlayX = startX;
		// Ask AI on the right - moved left and down
		const askAIX = startX + this.windowSize.width + 10; // Reduced gap from 20 to 10
		const askAIY = 60; // Moved down from 30 to 60

		this.askAIWindow.setBounds({
			x: askAIX,
			y: askAIY,
			width: this.askAIWindowSize.width,
			height: this.askAIWindowSize.height,
		});

		// Update overlay window position to align side by side
		if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
			this.overlayWindow.setBounds({
				x: overlayX,
				y: 30, // Keep overlay at top
				width: this.windowSize.width,
				height: this.windowSize.height,
			});
		}

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
		this.windowPosition = { x: overlayX, y: 30 };
		this.currentX = overlayX;
		this.currentY = 30;

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
			this.overlayWindow.setBounds({ x: overlayX, y: overlayY, width: newWidth, height: newHeight });
			this.askAIWindow.setBounds({ 
				x: askAIX, 
				y: askAIY, 
				width: this.askAIWindowSize.width, 
				height: this.askAIWindowSize.height 
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


			this.overlayWindow.setBounds({ x: centerX, y: topY, width: newWidth, height: newHeight });
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
		
		const newWidth = Math.min(width + 32, 500); // Fixed width for Ask AI
		const newHeight = Math.ceil(height + 16);

		// Keep Ask AI window position relative to overlay
		const totalWidth = this.windowSize.width + newWidth + 20;
		const startX = Math.floor(workArea.width / 2) - Math.floor(totalWidth / 2);
		const askAIX = startX + this.windowSize.width + 20;
		const topY = 30;

		console.log('WindowHelper: Updating Ask AI dimensions', { 
			requested: { width, height },
			calculated: { width: newWidth, height: newHeight }
		});

		this.askAIWindow.setBounds({ x: askAIX, y: topY, width: newWidth, height: newHeight });
		this.askAIWindowPosition = { x: askAIX, y: topY };
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

		// Register arrow keys for window movement (only when Ask AI window is not visible)
		globalShortcut.register('CommandOrControl+Left', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowLeft();
		});

		globalShortcut.register('CommandOrControl+Right', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowRight();
		});

		globalShortcut.register('CommandOrControl+Up', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowUp();
		});

		globalShortcut.register('CommandOrControl+Down', () => {
			if (this.isVisible() && !this.isAskAIVisible) this.moveWindowDown();
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
