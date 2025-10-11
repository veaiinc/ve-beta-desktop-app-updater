const log = require('electron-log');
const { BrowserWindow, globalShortcut, app } = require('electron');

// Flag to prevent multiple cleanup calls
let isCleaningUp = false;

// Function to handle cleanup and quit
export function cleanupAndQuit({
	dynamicIslandHelper,
	windowHelper,
	mainWindow,
	areYouThereTimer,
	transcriptionDetectionTimer,
}) {
	// Prevent multiple cleanup calls
	if (isCleaningUp) {
		return;
	}
	isCleaningUp = true;

	try {
		// Clean up dynamic island helper
		// if (dynamicIslandHelper) {
		// 	try {
		// 		dynamicIslandHelper.destroy();
		// 	} catch (error) {
		// 		log.error('Error destroying dynamicIslandHelper:', error);
		// 	}
		// 	dynamicIslandHelper = null;
		// }

		// Clean up window helper
		if (windowHelper) {
			try {
				windowHelper.cleanup();
			} catch (error) {
				log.error('Error cleaning up windowHelper:', error);
			}
			windowHelper = null;
		}

		// Close main window if it exists and not destroyed
		if (mainWindow && !mainWindow.isDestroyed()) {
			try {
				mainWindow.close();
			} catch (error) {
				log.error('Error closing main window:', error);
			}
		}

		// Force quit all remaining windows safely
		try {
			BrowserWindow.getAllWindows().forEach((window) => {
				if (window && !window.isDestroyed()) {
					try {
						window.destroy();
					} catch (error) {
						log.error('Error destroying window:', error);
					}
				}
			});
		} catch (error) {
			log.error('Error getting all windows:', error);
		}

		// Clean up Are You There timer
		// if (areYouThereTimer) {
		// 	try {
		// 		clearInterval(areYouThereTimer);
		// 	} catch (error) {
		// 		log.error('Error clearing areYouThereTimer:', error);
		// 	}
		// 	areYouThereTimer = null;
		// }

		// // Clean up transcription detection timer
		// if (transcriptionDetectionTimer) {
		// 	try {
		// 		clearInterval(transcriptionDetectionTimer);
		// 	} catch (error) {
		// 		log.error('Error clearing transcriptionDetectionTimer:', error);
		// 	}
		// 	transcriptionDetectionTimer = null;
		// }

		// Unregister all global shortcuts
		try {
			globalShortcut.unregisterAll();
		} catch (error) {
			log.error('Error unregistering global shortcuts:', error);
		}

		// Force quit the app
		setTimeout(() => {
			try {
				app.exit(0);
			} catch (error) {
				log.error('Error during app exit:', error);
				process.exit(0);
			}
		}, 100);
	} catch (error) {
		log.error('Error during cleanup:', error);
		// Force quit even if cleanup fails
		try {
			app.exit(0);
		} catch (exitError) {
			log.error('Error during forced exit:', exitError);
			process.exit(0);
		}
	}
}
