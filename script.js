<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JWT Auth Demo</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet">
</head>
<body>
  <h1>JWT Authentication Demo</h1>

  <div class="section">
    <button id="generateBtn">Generate JWT</button>
    <textarea id="jwtOutput" readonly placeholder="JWT token will appear here"></textarea>
  </div>

  <div class="section">
    <input type="text" id="jwtInput" placeholder="Enter JWT token to validate">
    <button id="validateBtn">Validate JWT</button>
    <textarea id="validateOutput" readonly placeholder="Validation result will appear here"></textarea>
  </div>

  <script>
    // Helper: safe access
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

    // DOM elements
    const generateBtn = document.getElementById('generateBtn');
    const validateBtn = document.getElementById('validateBtn');
    const jwtOutput = document.getElementById('jwtOutput');
    const jwtInput = document.getElementById('jwtInput');
    const validateOutput = document.getElementById('validateOutput');

    // Generate token
    generateBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('https://http-auth-website.vercel.app/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fingerprint)  // send full fingerprint directly
        });
        const data = await res.json();
        jwtOutput.value = data.token || JSON.stringify(data, null, 2);
      } catch (err) {
        jwtOutput.value = 'Error fetching token';
      }
    });

    // Validate token
    validateBtn.addEventListener('click', async () => {
      try {
        const token = jwtInput.value.trim();
        const res = await fetch('https://http-auth-website.vercel.app/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, fingerprint }) // send token + fingerprint
        });
        const data = await res.json();
        validateOutput.value = JSON.stringify(data, null, 2);
      } catch (err) {
        validateOutput.value = 'Error validating token';
      }
    });
  </script>
</body>
</html>
