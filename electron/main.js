// main.js
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow = null;

// ── Create the BrowserWindow ─────────────────────────────────────────────────
app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		title: 'Main window',
		width: 800,
		height: 600,
		webPreferences: {
			preload: 'preload.js',
			contextIsolation: true,
			nodeIntegration: false
		}
	});

	ipcMain.on('reload-app', () => {
		mainWindow.reload();
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile('build/index.html');
	}
});

// ── Graceful exit on macOS ───────────────────────────────────────────────────
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
