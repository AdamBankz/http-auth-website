// helper: safe access
const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch (e) {
    return fallback;
  }
};

const now = new Date();

const fingerprint = {
  browserInfo: {
    userAgent: safe(() => navigator.userAgent, "unknown"),
    timezoneOffset: safe(() => new Date().getTimezoneOffset(), null),
    localeDateTime: safe(() => now.toLocaleString('en-US'), null),
    localUnixTime: Math.floor(Date.now() / 1000),
    calendar: safe(() => Intl.DateTimeFormat().resolvedOptions().calendar, "gregory"),
    day: "numeric",
    locale: safe(() => (navigator.language || navigator.userLanguage || 'en-US'), 'en-US'),
    month: "numeric",
    numberingSystem: safe(() => Intl.NumberFormat().resolvedOptions().numberingSystem, "latn"),
    year: "numeric",
    appVersion: safe(() => navigator.appVersion, null),
    cookieEnabled: safe(() => navigator.cookieEnabled, false),
    javaEnabled: safe(() => (typeof navigator.javaEnabled === 'function') ? navigator.javaEnabled() : false, false),
    referrerHeader: safe(() => document.referrer || "", ""),
    httpsConnection: (location && location.protocol === 'https:') ? "Yes" : "No",
    historyLength: safe(() => history.length, 0),
    mimeTypes: safe(() => navigator.mimeTypes ? navigator.mimeTypes.length : null, null),
    plugins: safe(() => navigator.plugins ? navigator.plugins.length : null, null),
    webdriver: safe(() => !!navigator.webdriver, false),
    isBot: (() => {
      const ua = (navigator.userAgent || "").toLowerCase();
      const suspicious = ['bot','crawl','spider','slurp','fetch','loader','python','curl','wget'];
      const hasSuspicious = suspicious.some(s => ua.includes(s));
      return (navigator.webdriver || hasSuspicious) ? "Yes" : "No";
    })()
  }
};

fetch('https://http-auth-website.vercel.app/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(fingerprint)
})
.then(response => response.json())
.then(data => {
  console.log(data);
  // Return the next fetch to chain it properly
  return fetch('https://http-auth-website.vercel.app/api/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
})
.then(response => response.json())
.then(success => {
  console.log(success);
})
.catch(error => {
  console.error('Error:', error);

});

