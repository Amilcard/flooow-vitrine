/* ============================================================
   Flooow — Simulateur d'aides financières (site vitrine)
   Source de vérité : RPC Supabase get_eligible_aids_generic
   (même moteur de règles que l'application Flooow).
   Aucune dépendance externe. Aucune donnée personnelle stockée.
   ============================================================ */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://kbrgwezkjaakoecispom.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imticmd3ZXpramFha29lY2lzcG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjIzMDksImV4cCI6MjA3NjA5ODMwOX0.C-kOFzmIZsMWKVbaZzp_HnVR7iQxsXMSE3u9pAlZ96w';

  var AID_LABELS = {
    pass_sport: "Pass'Sport",
    pass_culture: 'Pass Culture',
    pass_colo: 'Pass Colo',
    caf_loire_temps_libre: 'Aide Temps Libre (CAF de la Loire)',
    vacaf_ave: 'VACAF — Aide aux Vacances Enfants',
    ancv: 'Chèques-Vacances (ANCV)',
    cheques_loisirs_loire: 'Chèques Loisirs (Loire)',
    bonus_qpv: 'Bonus quartier prioritaire',
    reduction_fratrie: 'Réduction fratrie'
  };

  function eur(n) {
    return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
  }

  function el(id) { return document.getElementById(id); }

  function togglePeriodeFields() {
    var vac = el('sim-periode-vacances').checked;
    el('sim-nuitee-wrap').style.display = vac ? 'block' : 'none';
    if (!vac) el('sim-nuitee').checked = false;
  }

  function setLoading(loading) {
    var btn = el('sim-submit');
    btn.disabled = loading;
    btn.textContent = loading ? 'Calcul en cours…' : 'Estimer mes aides';
  }

  function showError(msg) {
    var box = el('sim-results');
    box.style.display = 'block';
    box.innerHTML =
      '<p style="font-size:15px; color:var(--tx); line-height:1.6; margin:0;">' + msg + '</p>';
  }

  function renderResults(rows, price) {
    var box = el('sim-results');
    box.style.display = 'block';

    if (!rows || rows.length === 0) {
      box.innerHTML =
        '<h4 style="font-size:18px; font-weight:800; margin-bottom:8px;">Aucune aide identifiée pour cette situation</h4>' +
        '<p style="font-size:14px; color:var(--tx2); line-height:1.6; margin:0;">' +
        'Cela ne signifie pas qu&rsquo;aucun soutien n&rsquo;existe : certaines aides locales ou de structures ne sont pas encore répertoriées ici. ' +
        'N&rsquo;hésitez pas à en parler directement au club ou à la MJC.</p>';
      return;
    }

    var total = 0;
    var items = rows
      .filter(function (r) { return Number(r.aid_amount) > 0; })
      .map(function (r) {
        total += Number(r.aid_amount);
        var label = AID_LABELS[r.aid_name] || r.aid_name;
        var capped = r.reason && r.reason.indexOf('Plafonnée') === 0;
        return (
          '<li style="display:flex; justify-content:space-between; gap:16px; padding:10px 0; border-bottom:1px solid var(--flooow-orange-bd); font-size:15px;">' +
          '<span>' + label + (capped ? ' <span style="font-size:12px; color:var(--tx2);">(plafonnée)</span>' : '') + '</span>' +
          '<strong style="white-space:nowrap;">− ' + eur(r.aid_amount) + '</strong>' +
          '</li>'
        );
      })
      .join('');

    var reste = Math.max(0, price - total);

    box.innerHTML =
      '<h4 style="font-size:18px; font-weight:800; margin-bottom:12px;">Estimation de vos aides</h4>' +
      '<ul style="list-style:none; margin:0 0 16px; padding:0;">' + items + '</ul>' +
      '<div style="display:flex; justify-content:space-between; gap:16px; font-size:15px; padding:6px 0;">' +
      '<span>Coût estimé de l&rsquo;activité</span><strong>' + eur(price) + '</strong></div>' +
      '<div style="display:flex; justify-content:space-between; gap:16px; font-size:15px; padding:6px 0;">' +
      '<span>Total des aides estimées</span><strong>− ' + eur(total) + '</strong></div>' +
      '<div style="display:flex; justify-content:space-between; gap:16px; font-size:17px; font-weight:800; padding:12px 0 0; margin-top:8px; border-top:2px solid var(--flooow-orange);">' +
      '<span>Reste à charge estimé</span><span>' + eur(reste) + '</span></div>' +
      '<p style="font-size:12px; color:var(--tx2); line-height:1.5; margin:16px 0 0;">' +
      'Montants indicatifs, calculés à partir des barèmes que nous suivons. ' +
      'Seuls les barèmes officiels des organismes (CAF, État, collectivités) font foi. ' +
      'Un reste à charge minimum de 30&nbsp;% s&rsquo;applique. Aucune donnée n&rsquo;est enregistrée.</p>';
  }

  function submitSimulation(ev) {
    if (ev) ev.preventDefault();

    var price = parseFloat(el('sim-prix').value);
    if (isNaN(price) || price <= 0) {
      showError('Indiquez un coût estimé de l&rsquo;activité (en euros) pour lancer le calcul.');
      return false;
    }

    var age = parseInt(el('sim-age').value, 10);
    var qf = parseInt(el('sim-qf').value, 10);
    var nb = parseInt(el('sim-enfants').value, 10);

    var payload = {
      p_price_estimate: price,
      p_period_type: el('sim-periode-vacances').checked ? 'vacances' : 'scolaire',
      p_age: isNaN(age) ? null : age,
      p_qf: isNaN(qf) ? null : qf,
      p_is_qpv: el('sim-qpv').checked,
      p_territory_code: el('sim-loire').checked ? '42' : null,
      p_nb_children: isNaN(nb) || nb < 1 ? 1 : nb,
      p_is_overnight: el('sim-nuitee').checked
    };

    setLoading(true);
    fetch(SUPABASE_URL + '/rest/v1/rpc/get_eligible_aids_generic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (rows) { renderResults(rows, price); })
      .catch(function () {
        showError('Le calcul est momentanément indisponible. Réessayez dans quelques instants, ou consultez les dispositifs décrits ci-dessus.');
      })
      .finally(function () { setLoading(false); });

    return false;
  }

  function init() {
    var form = el('sim-form');
    if (!form) return;
    form.addEventListener('submit', submitSimulation);
    el('sim-periode-scolaire').addEventListener('change', togglePeriodeFields);
    el('sim-periode-vacances').addEventListener('change', togglePeriodeFields);
    togglePeriodeFields();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
