(function () {
  'use strict';

  var CONSENT_KEY = 'consent-status';
  var CONSENT_EXPIRY_KEY = 'consent-expiry';
  var CONSENT_DAYS = 30;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getConsent() {
    var expiry = localStorage.getItem(CONSENT_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_EXPIRY_KEY);
      return null;
    }
    return localStorage.getItem(CONSENT_KEY);
  }

  function saveConsent(value) {
    var expiry = Date.now() + CONSENT_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(CONSENT_KEY, value);
    localStorage.setItem(CONSENT_EXPIRY_KEY, String(expiry));
  }

  // ── termin.html: show/hide consent gate ───────────────────────────────────

  function handleTerminPage() {
    var form = document.getElementById('booking-form-container');
    var gate = document.getElementById('consent-gate-termin');
    if (!form) return; // not on termin.html

    var status = getConsent();
    if (status === 'accepted') {
      if (gate) gate.style.display = 'none';
      if (form) form.style.display = '';
    } else {
      if (form) form.style.display = 'none';
      if (!gate) {
        gate = document.createElement('div');
        gate.id = 'consent-gate-termin';
        gate.style.cssText = [
          'background:#f5f5f7',
          'border-radius:12px',
          'padding:32px 24px',
          'text-align:center',
          'max-width:480px',
          'margin:0 auto'
        ].join(';');
        gate.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="1.5" style="width:48px;height:48px;margin:0 auto 16px;display:block">' +
            '<circle cx="12" cy="12" r="10"/>' +
            '<line x1="12" y1="8" x2="12" y2="12"/>' +
            '<line x1="12" y1="16" x2="12.01" y2="16"/>' +
          '</svg>' +
          '<p style="font-weight:600;font-size:1rem;color:#1d1d1f;margin-bottom:8px">Externe Dienste erforderlich</p>' +
          '<p style="font-size:0.9375rem;color:#6e6e73;margin-bottom:20px">Bitte akzeptieren Sie die externen Dienste, um die Online-Terminbuchung zu nutzen.</p>' +
          '<button id="consent-gate-btn" style="' +
            'display:inline-flex;align-items:center;justify-content:center;' +
            'padding:14px 28px;font-size:0.9375rem;font-weight:600;border:none;' +
            'border-radius:9999px;cursor:pointer;' +
            'background:linear-gradient(135deg,#0071e3 0%,#00c7be 100%);' +
            'color:#fff;box-shadow:0 4px 14px rgba(0,113,227,0.25)' +
          '">Dienste akzeptieren & Termin buchen</button>';
        form.parentNode.insertBefore(gate, form);

        document.getElementById('consent-gate-btn').addEventListener('click', function () {
          saveConsent('accepted');
          gate.style.display = 'none';
          form.style.display = '';
        });
      } else {
        gate.style.display = '';
      }
    }
  }

  // ── Banner HTML & CSS (injected) ──────────────────────────────────────────

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '#cookie-banner {',
        'position:fixed;',
        'bottom:0;left:0;right:0;',
        'background:#ffffff;',
        'border-top:1px solid #e8e8ed;',
        'box-shadow:0 -4px 20px rgba(0,0,0,0.08);',
        'z-index:9999;',
        'padding:16px 20px;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
      '}',
      '#cookie-banner-inner {',
        'max-width:1200px;',
        'margin:0 auto;',
        'display:flex;',
        'align-items:center;',
        'justify-content:space-between;',
        'gap:16px;',
        'flex-wrap:wrap;',
      '}',
      '#cookie-banner-text {',
        'flex:1;',
        'min-width:220px;',
        'font-size:0.875rem;',
        'line-height:1.6;',
        'color:#6e6e73;',
      '}',
      '#cookie-banner-text a {',
        'color:#0071e3;',
        'text-decoration:underline;',
      '}',
      '#cookie-banner-actions {',
        'display:flex;',
        'gap:10px;',
        'flex-shrink:0;',
        'flex-wrap:wrap;',
        'align-items:center;',
      '}',
      '#cookie-btn-accept {',
        'padding:11px 22px;',
        'font-size:0.875rem;',
        'font-weight:600;',
        'border:none;',
        'border-radius:9999px;',
        'cursor:pointer;',
        'background:linear-gradient(135deg,#0071e3 0%,#00c7be 100%);',
        'color:#ffffff;',
        'box-shadow:0 4px 14px rgba(0,113,227,0.25);',
        'white-space:nowrap;',
      '}',
      '#cookie-btn-essential {',
        'padding:11px 22px;',
        'font-size:0.875rem;',
        'font-weight:600;',
        'border:2px solid #d2d2d7;',
        'border-radius:9999px;',
        'cursor:pointer;',
        'background:transparent;',
        'color:#6e6e73;',
        'white-space:nowrap;',
      '}',
      '@media(max-width:600px){',
        '#cookie-banner-inner{flex-direction:column;align-items:flex-start;}',
        '#cookie-banner-actions{width:100%;}',
        '#cookie-btn-accept,#cookie-btn-essential{flex:1;text-align:center;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function createBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML =
      '<div id="cookie-banner-inner">' +
        '<p id="cookie-banner-text">' +
          'Diese Website nutzt externe Dienste f&#252;r Kontaktformulare und Terminbuchung. ' +
          'Dabei werden Daten an Drittanbieter &#252;bermittelt. ' +
          '<a href="datenschutz.html">Datenschutzerkl&#228;rung</a>' +
        '</p>' +
        '<div id="cookie-banner-actions">' +
          '<button id="cookie-btn-essential">Nur essenzielle</button>' +
          '<button id="cookie-btn-accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-btn-accept').addEventListener('click', function () {
      saveConsent('accepted');
      hideBanner();
      handleTerminPage();
    });

    document.getElementById('cookie-btn-essential').addEventListener('click', function () {
      saveConsent('essential');
      hideBanner();
      handleTerminPage();
    });
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    var status = getConsent();

    if (!status) {
      injectStyles();
      createBanner();
    }

    handleTerminPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
