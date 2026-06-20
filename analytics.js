/*
 * Brilliante site analytics — Google Analytics 4 with Consent Mode v2.
 *
 * The ONLY place to set the Measurement ID. Replace the placeholder below with your
 * GA4 ID (looks like "G-XXXXXXXXXX"), from Google Analytics → Admin → Data Streams.
 * Until a real ID is set, GA is not loaded and the cookie banner stays hidden.
 *
 * Behavior: analytics consent defaults to "denied" (Consent Mode v2). GA's tag is
 * loaded immediately but, with consent denied, it sends only cookieless pings until
 * the visitor clicks Accept on the banner — at which point analytics_storage flips to
 * "granted" and the choice is remembered in localStorage. Decline stores "denied".
 */
(function () {
  'use strict';

  var GA_ID = 'G-SSWBEFZ71C'; // GA4 Measurement ID
  var STORAGE_KEY = 'brilliante-analytics-consent';
  var active = GA_ID && GA_ID.indexOf('XXXX') === -1; // false while the placeholder is in place

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — deny everything until the visitor opts in.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  // Load GA only when a real Measurement ID is configured.
  if (active) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // Wire the cookie banner (markup lives in each page). Only shown if GA is active
  // and the visitor hasn't chosen yet.
  function initBanner() {
    var banner = document.getElementById('consent-banner');
    if (!banner) return;
    var decided = (saved === 'granted' || saved === 'denied');
    if (active && !decided) banner.hidden = false;

    function choose(granted) {
      try { localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied'); } catch (e) {}
      gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
      banner.hidden = true;
    }
    var accept = document.getElementById('consent-accept');
    var decline = document.getElementById('consent-decline');
    if (accept) accept.addEventListener('click', function () { choose(true); });
    if (decline) decline.addEventListener('click', function () { choose(false); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();
