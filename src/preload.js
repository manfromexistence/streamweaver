const { app, BrowserWindow } = require('electron')
const path = require('path')
const config = require('./webrtc-config');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadURL('https://xbox.com')
}

const modifySdp = (sdp) => {
  sdp = sdp.replace(/a=imageattr:.*\r\n/g, '');
  sdp += `a=imageattr:* recv [x=[0-${config.webrtc.resolution.width}],y=[0-${config.webrtc.resolution.height}]]\r\n`;
  sdp = sdp.replace(/(a=fmtp:\d+ .*)\r\n/g, 
    `$1;x-google-max-bitrate=${config.webrtc.bitrate.max};x-google-min-bitrate=${config.webrtc.bitrate.min}\r\n`);
  return sdp;
};

window.addEventListener('load', () => {
  const originalRTCPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection = function(...args) {
    const pc = new originalRTCPeerConnection(...args);
    
    const originalCreateOffer = pc.createOffer.bind(pc);
    pc.createOffer = async (...args) => {
      const offer = await originalCreateOffer(...args);
      offer.sdp = modifySdp(offer.sdp);
      return offer;
    };
    
    return pc;
  };
});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})