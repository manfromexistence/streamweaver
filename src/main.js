const { app, BrowserWindow } = require('electron');
const path = require('path');

// Force Chrome version
app.commandLine.appendSwitch('chrome-version', '102.0.0.0');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // ✅ DevTools enabled
  mainWindow.webContents.openDevTools();
  // ✅ Loads Xbox URL
  mainWindow.loadURL('https://xbox.com');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});