// Lien officiel vers la communauté locale d'entraide (Heartbeat)
  const HEARTBEAT_URL = "https://app.heartbeat.chat/inkusif/invitation?code=28FJ4C";

  function openHeartbeat(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    window.open(HEARTBEAT_URL, '_blank', 'noopener,noreferrer');
  }

  /* RECHERCHE OVERLAY : STYLE PATAGONIA ÉPURÉ */
  function openSearch() {
    document.getElementById('searchBar').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('searchInput');
    if (input) { input.value = ''; doSearch(''); setTimeout(() => input.focus(), 50); }
  }
  function closeSearch() {
    document.getElementById('searchBar').style.display = 'none';
    document.body.style.overflow = '';
  }

  /* RECHERCHE FONCTIONNELLE : filtre un index des pages/articles du site.
     Site éditorial (pas de base d'activités) → on indexe les rubriques et récits. */
  const SEARCH_INDEX = [
    { t: "Activités locales", d: "Sports, arts, loisirs créatifs, stages de vacances", k: "sport art culture loisir dojo judo musique théâtre stage vacances 3 5 6 11 12 17 ans", v: "activites" },
    { t: "Aides & Accompagnement", d: "Quotient Familial, Pass'Sport, Pass Culture, aides communales", k: "aide caf quotient familial pass sport culture financement reste à charge subvention argent", v: "aides" },
    { t: "Acteurs locaux", d: "Clubs, MJC, centres sociaux, collectivités", k: "club mjc centre social collectivité mairie association structure partenaire", v: "organismes" },
    { t: "Histoires du terrain", d: "Récits de familles, reportages, mobilité", k: "histoire récit reportage terrain famille magazine", v: "histoires" },
    { t: "Le vélo change le quotidien à Montreynaud", d: "Récit — écomobilité", k: "vélo écomobilité mobilité transport montreynaud famille martin", v: "article-velo" },
    { t: "Le sport partagé et l'inclusion", d: "Récit — handicap", k: "inclusion handicap sport partagé tarentaize différence", v: "article-inclusion" },
    { t: "Premier été en colonie", d: "Récit — vacances", k: "colonie vacances séjour caf pilat aide départ", v: "article-vacances" },
    { t: "Foire aux questions", d: "Questions fréquentes", k: "faq question aide inscription comment", v: "faq" },
    { t: "Contact", d: "Nous écrire", k: "contact écrire email message partenariat", v: "contact" },
    { t: "Mentions légales", d: "Informations légales", k: "mention légale éditeur siret association", v: "mentions" },
    { t: "Confidentialité", d: "Protection des données (RGPD)", k: "confidentialité rgpd donnée personnelle cookie", v: "confidentialite" }
  ];

  let _searchDefaultHTML = null;
  function doSearch(query) {
    const results = document.getElementById('searchResults');
    const heading = document.getElementById('searchHeading');
    if (_searchDefaultHTML === null) _searchDefaultHTML = results.innerHTML;
    const q = (query || '').trim().toLowerCase();
    if (q.length < 2) { // trop court → on ré-affiche les recherches fréquentes
      heading.textContent = 'Recherches fréquentes';
      results.innerHTML = _searchDefaultHTML;
      return;
    }
    const matches = SEARCH_INDEX.filter(item =>
      (item.t + ' ' + item.d + ' ' + item.k).toLowerCase().includes(q)
    );
    if (!matches.length) {
      heading.textContent = 'Aucun résultat';
      results.innerHTML = '<li style="color:var(--tx2);font-size:15px;">Rien trouvé pour « ' + q.replace(/</g,'&lt;') + ' ». Essayez « aides », « sport », « vacances »…</li>';
      return;
    }
    heading.textContent = matches.length + ' résultat' + (matches.length > 1 ? 's' : '');
    results.innerHTML = matches.map(m =>
      '<li role="option"><a onclick="navigateTo(\'' + m.v + '\'); closeSearch();">' +
      '<strong>' + m.t + '</strong> — <span style="color:var(--tx2);font-weight:400;">' + m.d + '</span></a></li>'
    ).join('');
  }

  /* FONCTIONNEMENT SPA : ROUTING PAR ANCRE (#aides, #contact, #article-velo…)
     Chaque vue a son ancre → le bouton "Précédent" du navigateur et le partage
     d'un lien direct fonctionnent. hashchange déclenche l'affichage. */
  function showView(viewId) {
    // Cache toutes les sections, affiche la cible (repli sur accueil si inconnue)
    if (!document.getElementById('view-' + viewId)) viewId = 'accueil';
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});

    // Le bandeau global "Rejoignez la Flooow Family" n'a pas sa place au-dessus
    // des pages de détail (articles) ni des pages utilitaires (légal/contact).
    const banner = document.getElementById('joinBanner');
    if (banner) {
      const hide = viewId.startsWith('article-') || ['mentions','confidentialite','contact','faq'].includes(viewId);
      banner.style.display = hide ? 'none' : '';
    }
  }

  function currentViewId() {
    return (location.hash || '#accueil').replace(/^#/, '') || 'accueil';
  }

  function navigateTo(viewId) {
    // Met à jour l'ancre ; si elle ne change pas, on ré-affiche directement.
    if (('#' + viewId) === location.hash) showView(viewId);
    else location.hash = viewId;
  }

  window.addEventListener('hashchange', function() { showView(currentViewId()); });

  /* FONCTION COMBINÉE POUR LA BARRE DE RECHERCHE */
  function closeAndScroll(targetHash) {
    closeSearch();
    showToast("Redirection vers la thématique...");
  }

  /* NOTIFICATIONS ÉLÉGANTES (Remplacement des alert() natives) */
  function showToast(text) {
    const toast = document.getElementById('toastBox');
    toast.innerText = text;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }

  /* MENU MOBILE (burger) */
  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const burger = document.getElementById('navBurger');
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu.classList.contains('open')) return;
    menu.classList.remove('open');
    const burger = document.getElementById('navBurger');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  }
  function navMobile(viewId) { closeMobileMenu(); navigateTo(viewId); }

  /* FORMULAIRE DE CONTACT (ouvre le client mail — pas de backend nécessaire) */
  const CONTACT_EMAIL = "contact@flooow.fr"; // adresse de contact de l'association JUNGLE ATTITUDE
  function sendContact(e) {
    e.preventDefault();
    const name = document.getElementById('ct-name').value.trim();
    const email = document.getElementById('ct-email').value.trim();
    const msg = document.getElementById('ct-msg').value.trim();
    const subject = encodeURIComponent('Contact site Flooow — ' + name);
    const body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
    showToast("Votre logiciel de messagerie va s'ouvrir…");
    return false;
  }

document.addEventListener('DOMContentLoaded', function() {
  const toast = document.getElementById('toastBox');
  if (toast) toast.classList.remove('show');
  // NB : les mégamenus sont masqués par défaut en CSS (.megamenu / .white-megamenu { display:none }).
  // Ne pas leur poser de display:none inline ici : un style inline bat la règle :hover et bloque leur ouverture.

  // Affiche la vue correspondant à l'ancre de l'URL (permet le partage de lien direct).
  showView(currentViewId());

  // ACCESSIBILITÉ : rendre focusables au clavier les liens/onglets qui n'ont pas de href.
  document.querySelectorAll('a[onclick]:not([href]), .top-links-left > li > a, .top-links-center > li > a, .nav-links > li > a')
    .forEach(a => { if (!a.hasAttribute('href') && !a.hasAttribute('tabindex')) a.setAttribute('tabindex', '0'); });

  // Les cartes d'article sont des <div onclick> : on les rend focusables et on
  // leur donne un rôle de bouton pour les lecteurs d'écran et la navigation clavier.
  document.querySelectorAll('.article-card[onclick]').forEach(c => {
    c.setAttribute('role', 'button');
    c.setAttribute('tabindex', '0');
    const title = c.querySelector('h3');
    if (title) c.setAttribute('aria-label', 'Lire le récit : ' + title.textContent);
  });

  // Activation clavier (Entrée / Espace) sur tous ces éléments cliquables.
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeMobileMenu(); closeSearch(); return; }
    if ((e.key === 'Enter' || e.key === ' ')) {
      const t = e.target;
      if (t.matches('a[onclick]:not([href]), .search-pill-container[role="button"], .article-card[role="button"]')) {
        e.preventDefault(); t.click();
      }
    }
  });
});
