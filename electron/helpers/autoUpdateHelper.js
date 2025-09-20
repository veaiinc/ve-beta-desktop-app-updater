const { app, BrowserWindow } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

const checkForUpdates = (mainWindow) => {
	mainWindow?.webContents.send('update-status', { status: 'checking' });
};

const updateAvailable = ({ mainWindow, info, setIsUpdateInProgress }) => {
	log.info('🔄 Update available:', info);
	log.info('📦 Current version:', app.getVersion());
	log.info('🆕 New version:', info.version);
	setIsUpdateInProgress(true);

	// Notify frontend that update is available
	mainWindow?.webContents.send('update-status', {
		status: 'available',
		version: info.version,
		currentVersion: app.getVersion(),
		message: `Updating from ${app.getVersion()} to ${info.version}...`,
	});

	// Download will start automatically since autoDownload is true
	log.info('Update download will start automatically...');
};

const updateNotAvailable = ({ info, setIsUpdateInProgress, mainWindow }) => {
	log.info('Update not available:', info);
	setIsUpdateInProgress(false); // Reset flag
	mainWindow?.webContents.send('update-status', { status: 'not-available' });
};

const downloadProgress = ({ progressObj, mainWindow }) => {
	log.info('Download progress:', progressObj);
	mainWindow?.webContents.send('update-status', {
		status: 'downloading',
		progress: progressObj.percent,
		bytesPerSecond: progressObj.bytesPerSecond,
		total: progressObj.total,
		transferred: progressObj.transferred,
	});
};

const handleError = ({ err, setIsUpdateInProgress, mainWindow }) => {
	// Reset update flag on error
	setIsUpdateInProgress(false);

	let errorStatus = {
		status: 'error',
		error: err.message,
		details: { code: err.code, errno: err.errno },
	};

	log.error('Update error:', err);
	log.error('Update error details:', {
		message: err.message,
		code: err.code,
		errno: err.errno,
		stack: err.stack,
	});

	// Send detailed error information to frontend
	mainWindow?.webContents.send('update-status', errorStatus);

	// Handle specific error types
	if (err.code === 1) {
		log.error(
			'Ditto error detected - this usually indicates file path issues in the update package',
		);
		mainWindow?.webContents.send('update-status', {
			status: 'installation-error',
			error: 'Update package file path error',
			details: {
				suggestion:
					'The update package may be corrupted or incomplete. Please try downloading again.',
				code: err.code,
			},
		});
	}
};

const handleUpdateDownloaded = ({ info, mainWindow, setIsUpdateInProgress }) => {
	log.info('Update downloaded:', info);

	const versionLabel = info?.version ? `Update ${info.version}` : 'Update';

	// Notify renderer so it can surface a restart prompt instead of forcing a quit
	mainWindow?.webContents.send('update-status', {
		status: 'downloaded',
		version: info?.version,
		releaseName: info?.releaseName,
		releaseDate: info?.releaseDate,
		releaseNotes: info?.releaseNotes,
		message: `${versionLabel} downloaded. Restart to apply when you're ready.`,
	});
};

const ipcMainHandleCheckForUpdates = async ({
	getIsUpdateInProgress,
	setIsUpdateInProgress,
}) => {
	log.info('Manual update check triggered');
	if (process.env.NODE_ENV === 'development') {
		return { success: true, message: 'Skipped in dev mode' };
	}

	// Prevent concurrent update checks
	if (getIsUpdateInProgress()) {
		return { success: false, error: 'Update already in progress' };
	}

	try {
		await autoUpdater.checkForUpdatesAndNotify();
		return { success: true, message: 'Check initiated' };
	} catch (error) {
		log.error('Update check failed:', error);
		setIsUpdateInProgress(false); // Reset flag on error
		return { success: false, error: error.message };
	}
};

const ipcMainHandleDownloadUpdates = async ({
	getIsUpdateInProgress,
	setIsUpdateInProgress,
}) => {
	if (process.env.NODE_ENV === 'development') {
		return { success: false, error: 'Not available in dev' };
	}

	// Prevent concurrent downloads
	if (getIsUpdateInProgress()) {
		return { success: false, error: 'Update already in progress' };
	}

	try {
		setIsUpdateInProgress(true);
		await autoUpdater.downloadUpdate();
		return { success: true };
	} catch (error) {
		setIsUpdateInProgress(false); // Reset flag on error
		return { success: false, error: error.message };
	}
};

const ipcMainHandleRestartApp = ({
	setIsUpdateInProgress,
	dynamicIslandHelper,
	windowHelper,
}) => {
	if (process.env.NODE_ENV === 'development') {
		return { success: false, error: 'Not available in development' };
	}

	try {
		// Set update flag to allow proper quit
		setIsUpdateInProgress(true);

		// Clean up services
		if (dynamicIslandHelper) {
			try {
				dynamicIslandHelper.close();
			} catch (error) {
				log.error('Error closing dynamicIslandHelper during restart:', error);
			}
			dynamicIslandHelper = null;
		}

		if (windowHelper) {
			try {
				windowHelper.cleanup();
			} catch (error) {
				log.error('Error cleaning up windowHelper during restart:', error);
			}
			windowHelper = null;
		}

		// Close all windows
		BrowserWindow.getAllWindows().forEach((window) => {
			if (window && !window.isDestroyed()) {
				try {
					window.destroy();
				} catch (error) {
					log.error('Error destroying window during restart:', error);
				}
			}
		});

		log.info('Restarting app to install update...');

		// Use force quit for better reliability
		autoUpdater.quitAndInstall(true, true);

		return { success: true };
	} catch (error) {
		log.error('Error restarting app:', error);
		setIsUpdateInProgress(false); // Reset flag on error
		return { success: false, error: error.message };
	}
};

module.exports = {
	checkForUpdates,
	updateAvailable,
	downloadProgress,
	handleError,
	handleUpdateDownloaded,
	updateNotAvailable,
	ipcMainHandleCheckForUpdates,
	ipcMainHandleDownloadUpdates,
	ipcMainHandleRestartApp,
};
