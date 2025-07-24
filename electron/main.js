// main.js
const { app, BrowserWindow, Menu } = require('electron');
const ipcMain = require('electron').ipcMain;
const { autoUpdater } = require('electron-updater');
const log = require('electron-log'); // Import electron-log
const path = require('node:path');
let mainWindow = null;

// Set the autoUpdater logger to electron-log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info'; // Adjust log level as needed
log.info('App started'); // Log app start

let template = [];

// if (process.platform === 'darwin') {
// 	const name = app.getName();
// 	template.unshift({
// 		label: name,
// 		submenu: [
// 			{
// 				label: 'About ' + name,
// 				role: 'about',
// 			},
// 			{
// 				label: 'Quit',
// 				accelerator: 'Command+Q',
// 				click() {
// 					app.quit();
// 				},
// 			},
// 		],
// 	});
// }

function createWindow() {
	mainWindow = new BrowserWindow({
		title: 'Main window',
		width: 1366,
		height: 768,
		show: false, // wait to show until ready
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	// Load your front-end
	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile('build/index.html');
	}

	// When content is ready, show the window
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		log.info('Window ready-to-show'); // Log window ready event
	});

	// Check for updates after the app is ready (only in production)
	if (process.env.NODE_ENV !== 'development') {
		autoUpdater.checkForUpdatesAndNotify();
	}
}

// Setup update events and log them
autoUpdater.on('checking-for-update', () => {
	log.info('Checking for updates...');
	if (mainWindow) {
		mainWindow.webContents.send('update-status', { status: 'checking' });
	}
});
autoUpdater.on('update-available', (info) => {
	log.info('Update available, download started:', info);
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'download-started',
			version: info.version,
		});
	}
});
autoUpdater.on('update-not-available', (info) => {
	log.info('Update not available:', info);
	if (mainWindow) {
		mainWindow.webContents.send('update-status', { status: 'not-available' });
	}
});
autoUpdater.on('error', (err) => {
	log.error('Error during update:', err); // Log error
	log.error('Error details:', {
		message: err.message,
		stack: err.stack,
		code: err.code,
		errno: err.errno,
	});
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'error',
			error: err.message,
			details: {
				code: err.code,
				errno: err.errno,
			},
		});
	}
});
// Removed download-progress event handler to avoid showing downloading status

autoUpdater.on('update-downloaded', (info) => {
	log.info('Update download completed:', info); // Log downloaded update
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'download-completed',
			version: info.version,
		});

		// Show notification to user that app will restart
		mainWindow.webContents.send('update-status', {
			status: 'restarting',
			version: info.version,
			message:
				'Update downloaded successfully. The app will restart in 3 seconds to install the new version.',
		});

		// Wait 3 seconds then quit and install
		setTimeout(() => {
			log.info('Quitting app to install update');
			autoUpdater.quitAndInstall();
		}, 3000);
	} else {
		// If mainWindow is not available, quit immediately
		autoUpdater.quitAndInstall();
	}
});

app.whenReady().then(() => {
	// const menu = Menu.buildFromTemplate(template);
	// Menu.setApplicationMenu(menu);
	createWindow();
});

ipcMain.handle('check-for-updates', async () => {
	log.info('Check for updates triggered by renderer'); // Log triggered update check
	try {
		// Check if we're in development mode
		if (process.env.NODE_ENV === 'development') {
			log.info('Skipping update check in development mode');
			return { success: true, message: 'Update check skipped in development mode' };
		}

		// Just trigger the update check, don't return the result
		// The result will be handled by the autoUpdater events
		await autoUpdater.checkForUpdatesAndNotify();
		return { success: true, message: 'Update check initiated' };
	} catch (error) {
		log.error('Error checking for updates:', error);
		return { success: false, error: error.message };
	}
});

// Add handler for manual download trigger
ipcMain.handle('download-update', async () => {
	log.info('Manual download triggered by renderer');
	try {
		if (process.env.NODE_ENV === 'development') {
			return { success: false, error: 'Download not available in development mode' };
		}

		await autoUpdater.downloadUpdate();
		return { success: true, message: 'Download started' };
	} catch (error) {
		log.error('Error downloading update:', error);
		return { success: false, error: error.message };
	}
});

// Add handler for manual restart after update
ipcMain.handle('restart-app', async () => {
	log.info('Manual restart triggered by renderer');
	try {
		if (process.env.NODE_ENV === 'development') {
			return { success: false, error: 'Restart not available in development mode' };
		}

		// Quit and install the update
		autoUpdater.quitAndInstall();
		return { success: true, message: 'App restarting to install update' };
	} catch (error) {
		log.error('Error restarting app:', error);
		return { success: false, error: error.message };
	}
});

// Graceful exit on macOS
app.on('window-all-closed', () => {
	app.quit();
});
