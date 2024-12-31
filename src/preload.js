const deviceInfo = {
  appInfo: {
    env: {
      clientAppId: 'www.xbox.com',
      clientAppType: 'browser',
      clientAppVersion: '26.1.97',
      clientSdkVersion: '10.3.7',
      httpEnvironment: 'prod'
    }
  },
  dev: {
    os: { name: 'android', ver: '13.0', platform: 'mobile' },
    hw: { make: 'Samsung', model: 'SM-T970', sdktype: 'web' },
    displayInfo: {
      dimensions: { widthInPixels: 1280, heightInPixels: 720 },
      pixelDensity: { dpiX: 1, dpiY: 1 }
    },
    browser: { browserName: 'chrome', browserVersion: '116.0.0.0' }
  }
};

window.addEventListener('load', () => {
  localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
  
  Object.defineProperty(navigator, 'platform', { get: () => 'Android' });
  Object.defineProperty(navigator, 'userAgent', { 
    get: () => 'Mozilla/5.0 (Linux; Android 13; SM-T970) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
  });

  const originalXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if(url.includes('/sessions/cloud/play') || url.includes('/configuration') || url.includes('/ice')) {
      this.addEventListener('readystatechange', function() {
        if(this.readyState === 1) {
          this.setRequestHeader('x-ms-device-info', localStorage.getItem('deviceInfo'));
        }
      });
    }
    return originalXHR.apply(this, arguments);
  };
});