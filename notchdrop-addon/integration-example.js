// Example integration of NotchDrop UI with main Electron app
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Import the NotchDrop integration
const NotchDropIntegration = require('./electron-integration.js');

let mainWindow;
let notchDropIntegration;

async function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'main-preload.js'),
		},
	});

	// Load your main app
	await mainWindow.loadFile('index.html');

	// Initialize NotchDrop integration
	notchDropIntegration = NotchDropIntegration.integration;
	await notchDropIntegration.initialize(mainWindow);

	console.log('✅ Main window and NotchDrop integration initialized');
}

// Set up IPC handlers for main window to control NotchDrop
ipcMain.handle('main:showNotchDrop', () => {
	notchDropIntegration.show();
	return { success: true };
});

ipcMain.handle('main:hideNotchDrop', () => {
	notchDropIntegration.hide();
	return { success: true };
});

ipcMain.handle('main:toggleNotchDrop', () => {
	notchDropIntegration.toggle();
	return { success: true };
});

// Handle overlay state changes from main app
ipcMain.handle('main:updateOverlayState', (event, state) => {
	// Forward overlay state to NotchDrop UI
	notchDropIntegration.bridge.onOverlayStateChange(state);
	return { success: true };
});

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});

// Cleanup on app quit
app.on('before-quit', () => {
	if (notchDropIntegration) {
		notchDropIntegration.destroy();
	}
});
