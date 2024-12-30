const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const config = require('./webrtc-config');

app.commandLine.appendSwitch('chrome-version', '102.0.0.0');

function createWindow() {
  // WebRTC configuration
  app.commandLine.appendSwitch('force-webrtc-ip-handling-policy', 'default_public_interface_only');
  app.commandLine.appendSwitch('enable-features', 'WebRTC-H264WithOpenH264FFmpeg');
  app.commandLine.appendSwitch('force-fieldtrials', 'WebRTC-H264Simulcast/Enabled/');

  // Set Android user agent
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = config.userAgent;
    callback({ requestHeaders: details.requestHeaders });
  });

  const mainWindow = new BrowserWindow({
    width: config.webrtc.resolution.width,
    height: config.webrtc.resolution.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('https://xbox.com');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});