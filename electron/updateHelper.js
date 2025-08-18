const log = require('electron-log'); // Import electron-log

export const checkUpdates = (mainWindow) => {
	log.info('Checking for updates...');
	if (mainWindow) {
		mainWindow.webContents.send('update-status', { status: 'checking' });
	}
};

export const updateAvailable = (info, mainWindow) => {
	log.info('Update available, download started:', info);
	if (mainWindow) {
		mainWindow.webContents.send('update-status', {
			status: 'download-started',
			version: info.version,
		});
	}
};

export const updateNotAvailable = (info, mainWindow) => {
	log.info('Update not available:', info);
	if (mainWindow) {
		mainWindow.webContents.send('update-status', { status: 'not-available' });
	}
};

export const updateErrorLog = (err, mainWindow) => {
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
};

export const updateDownloaded = (info, mainWindow) => {
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
};
