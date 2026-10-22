/* Orarise : consentement cookies + balise Google Ads (AW-18526362860).
   La balise ne se charge qu'après « Accepter ». Choix gardé 6 mois. */
(function () {
  var ID = 'AW-18526362860';
  var CONV = 'AW-18526362860/LtEpCLHYi6MdEOy5h4JF';
  var CLE = 'orarise_consent';
  var SIX_MOIS = 1000 * 60 * 60 * 24 * 182;
  var charge = false;

  function lire() {
    try { var v = JSON.parse(localStorage.getItem(CLE)); if (v && Date.now() - v.t < SIX_MOIS) return v.c; } catch (e) {}
    return null;
  }
  function ecrire(c) { try { localStorage.setItem(CLE, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {} }

  function chargerGoogle() {
    if (charge) return; charge = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'denied' });
    gtag('js', new Date());
    gtag('config', ID);
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="play.google.com"]');
    if (a && charge && window.gtag) gtag('event', 'conversion', { send_to: CONV, transport_type: 'beacon' });
  }, true);

  function bandeau() {
    if (document.getElementById('or-cookies')) return;
    var d = document.createElement('div'); d.id = 'or-cookies';
    d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookies');
    d.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#1A1840;color:#F3EEE6;border:1px solid rgba(240,169,59,.45);border-radius:18px;padding:18px 20px;font:15px/1.5 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45)';
    d.innerHTML = '<p style="margin:0 0 14px">Orarise utilise un cookie publicitaire Google pour mesurer l\u2019efficacit\u00e9 de ses annonces. Rien n\u2019est d\u00e9pos\u00e9 sans ton accord. <a href="confidentialite.html" style="color:#F0A93B">En savoir plus</a></p>'
      + '<div style="display:flex;gap:10px"><button id="or-non" style="flex:1;padding:11px;border-radius:12px;border:1px solid #F0A93B;background:transparent;color:#F3EEE6;font-weight:700;cursor:pointer">Refuser</button>'
      + '<button id="or-oui" style="flex:1;padding:11px;border-radius:12px;border:1px solid #F0A93B;background:#F0A93B;color:#0B1121;font-weight:700;cursor:pointer">Accepter</button></div>';
    document.body.appendChild(d);
    document.getElementById('or-oui').onclick = function () { ecrire('oui'); d.remove(); chargerGoogle(); };
    document.getElementById('or-non').onclick = function () { ecrire('non'); d.remove(); };
  }

  window.orariseCookies = function () { try { localStorage.removeItem(CLE); } catch (e) {} bandeau(); };

  var choix = lire();
  if (choix === 'oui') chargerGoogle();
  else if (choix === null) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bandeau); else bandeau();
  }
})();
