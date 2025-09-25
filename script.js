// Helper: safe access
const safe = (fn, fallback = null) => {
  try { return fn(); } catch { return fallback; }
};

const now = new Date();

// Browser fingerprint
const fingerprint = {
  browserInfo: {
    userAgent: safe(() => navigator.userAgent, "unknown"),
    timezoneOffset: safe(() => now.getTimezoneOffset(), null),
    localeDateTime: safe(() => now.toLocaleString('en-US'), null),
    localUnixTime: Math.floor(Date.now() / 1000),
    calendar: safe(() => Intl.DateTimeFormat().resolvedOptions().calendar, "gregory"),
    day: "numeric",
    locale: safe(() => navigator.language || 'en-US', 'en-US'),
    month: "numeric",
    numberingSystem: safe(() => Intl.NumberFormat().resolvedOptions().numberingSystem, "latn"),
    year: "numeric",
    appVersion: safe(() => navigator.appVersion, null),
    cookieEnabled: safe(() => navigator.cookieEnabled, false),
    javaEnabled: safe(() => (typeof navigator.javaEnabled === 'function') ? navigator.javaEnabled() : false, false),
    referrerHeader: safe(() => document.referrer || "", ""),
    httpsConnection: location.protocol === 'https:' ? "Yes" : "No",
    historyLength: safe(() => history.length, 0),
    mimeTypes: safe(() => navigator.mimeTypes ? navigator.mimeTypes.length : null, null),
    plugins: safe(() => navigator.plugins ? navigator.plugins.length : null, null),
    webdriver: safe(() => !!navigator.webdriver, false),
    isBot: (() => {
      const ua = (navigator.userAgent || "").toLowerCase();
      const suspicious = ['bot','crawl','spider','slurp','fetch','loader','python','curl','wget'];
      return (navigator.webdriver || suspicious.some(s => ua.includes(s))) ? "Yes" : "No";
    })()
  }
};

// DOM elements
const generateBtn = document.getElementById('generateBtn');
const validateBtn = document.getElementById('validateBtn');
const jwtOutput = document.getElementById('jwtOutput');
const jwtInput = document.getElementById('jwtInput');
const validateOutput = document.getElementById('validateOutput');

// Generate JWT
generateBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('https://http-auth-website.vercel.app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint }) // wrap in fingerprint
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    jwtOutput.value = data.token || JSON.stringify(data, null, 2);

    // Optional: auto-fill validate input
    jwtInput.value = data.token || '';
  } catch (err) {
    console.error('Fetch failed:', err);
    jwtOutput.value = `Error fetching token: ${err.message}`;
  }
});

// Validate JWT
validateBtn.addEventListener('click', async () => {
  try {
    const token = jwtInput.value.trim();
    if (!token) {
      validateOutput.value = "Please enter a token to validate";
      return;
    }

    const res = await fetch('https://http-auth-website.vercel.app/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, fingerprint })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    validateOutput.value = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('Validation failed:', err);
    validateOutput.value = `Error validating token: ${err.message}`;
  }
});
