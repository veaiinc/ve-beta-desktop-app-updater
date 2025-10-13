const { app, BrowserWindow } = require('electron');
const log = require('electron-log');
let autoUpdater;
if (process?.type === 'browser') {
	({ autoUpdater } = require('electron-updater'));
} else {
	const noop = () => {};
	autoUpdater = {
		on: noop,
		once: noop,
		removeAllListeners: noop,
		setFeedURL: noop,
		downloadUpdate: async () => {},
		checkForUpdates: async () => ({ updateInfo: null }),
		checkForUpdatesAndNotify: async () => ({ updateInfo: null }),
		quitAndInstall: noop,
		autoDownload: false,
		autoInstallOnAppQuit: false,
		allowDowngrade: false,
	};
	autoUpdater.logger = {
		info: noop,
		warn: noop,
		error: noop,
		debug: noop,
		transports: {
			file: { level: 'info' },
		},
	};
}
const {
	getAutoUpdateIdleThresholdMinutes,
	getAutoUpdateIdleThresholdMilliseconds,
	getAutoUpdateCheckIntervalMinutes,
	getAutoUpdateCheckIntervalMilliseconds,
} = require('./envHelper');

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

	log.error('❌ Update error:', err);
	log.error('❌ Update error details:', {
		message: err.message,
		code: err.code,
		errno: err.errno,
		stack: err.stack,
	});

	// Send detailed error information to frontend
	mainWindow?.webContents.send('update-status', errorStatus);

	// Handle specific error types with more detailed messages
	if (err.code === 1) {
		log.error('🔒 Ditto error detected - file path issues in update package');
		mainWindow?.webContents.send('update-status', {
			status: 'installation-error',
			error: 'Update package file path error',
			details: {
				suggestion:
					'The update package may be corrupted or incomplete. Please try downloading again.',
				code: err.code,
			},
		});
	} else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
		log.error('🌐 Network error - cannot reach update server');
		mainWindow?.webContents.send('update-status', {
			status: 'network-error',
			error: 'Cannot reach update server',
			details: {
				suggestion: 'Please check your internet connection and try again.',
				code: err.code,
			},
		});
	} else if (err.code === 'EACCES' || err.code === 'EPERM') {
		log.error('🔐 Permission error during update');
		mainWindow?.webContents.send('update-status', {
			status: 'permission-error',
			error: 'Permission denied during update',
			details: {
				suggestion: 'Please run the application with appropriate permissions.',
				code: err.code,
			},
		});
	} else if (err.message && err.message.includes('checksum')) {
		log.error('🔒 Checksum verification failed');
		mainWindow?.webContents.send('update-status', {
			status: 'checksum-error',
			error: 'Update file verification failed',
			details: {
				suggestion: 'The downloaded update file may be corrupted. Please try again.',
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

const ipcMainHandleCheckForUpdates = async ({ getIsUpdateInProgress, setIsUpdateInProgress }) => {
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

const ipcMainHandleDownloadUpdates = async ({ getIsUpdateInProgress, setIsUpdateInProgress }) => {
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

const ipcMainHandleRestartApp = ({ setIsUpdateInProgress, dynamicIslandHelper, windowHelper }) => {
	if (process.env.NODE_ENV === 'development') {
		return { success: false, error: 'Not available in development' };
	}

	try {
		log.info('🔄 Starting app restart for update installation...');

		// Set update flag to allow proper quit
		setIsUpdateInProgress(true);

		// Validate that an update is actually downloaded
		if (!autoUpdater.isUpdaterActive()) {
			log.warn('⚠️ No update available for installation');
			setIsUpdateInProgress(false);
			return { success: false, error: 'No update available for installation' };
		}

		// Clean up services gracefully
		if (dynamicIslandHelper) {
			try {
				log.info('🧹 Cleaning up Dynamic Island helper...');
				dynamicIslandHelper.close();
			} catch (error) {
				log.error('❌ Error closing dynamicIslandHelper during restart:', error);
			}
			dynamicIslandHelper = null;
		}

		if (windowHelper) {
			try {
				log.info('🧹 Cleaning up window helper...');
				windowHelper.cleanup();
			} catch (error) {
				log.error('❌ Error cleaning up windowHelper during restart:', error);
			}
			windowHelper = null;
		}

		// Close all windows gracefully
		log.info('🪟 Closing all windows...');
		BrowserWindow.getAllWindows().forEach((window) => {
			if (window && !window.isDestroyed()) {
				try {
					window.destroy();
				} catch (error) {
					log.error('❌ Error destroying window during restart:', error);
				}
			}
		});

		// Wait a moment for cleanup to complete
		setTimeout(() => {
			log.info('🚀 Restarting app to install update...');

			// Use force quit for better reliability
			autoUpdater.quitAndInstall(true, true);
		}, 1000);

		return { success: true };
	} catch (error) {
		log.error('❌ Error restarting app:', error);
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
	getAutoUpdateIdleThresholdMinutes,
	getAutoUpdateIdleThresholdMilliseconds,
	getAutoUpdateCheckIntervalMinutes,
	getAutoUpdateCheckIntervalMilliseconds,
};
