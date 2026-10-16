(() => {
  const measurementID = document.querySelector('meta[name="google-analytics-id"]')?.content;
  if (!/^G-[A-Z0-9]+$/.test(measurementID || "")
      || document.documentElement.dataset.languageRedirect === "true") return;

  const language = document.documentElement.lang === "de" ? "de" : "en";
  const copy = language === "de" ? {
    title: "Website-Analysen",
    description: "Dürfen wir Google Analytics nutzen, um Besuche und Klicks auf App-Store-Links auszuwerten? Ohne deine Zustimmung bleibt es deaktiviert.",
    allow: "Analysen erlauben",
    deny: "Ablehnen",
    privacy: "Datenschutzerklärung",
    preferences: "Analyse-Einstellungen",
    privacyURL: "datenschutz.html"
  } : {
    title: "Website analytics",
    description: "May we use Google Analytics to measure visits and App Store link clicks? It stays off unless you allow it.",
    allow: "Allow analytics",
    deny: "Decline",
    privacy: "Privacy policy",
    preferences: "Analytics preferences",
    privacyURL: "privacy.html"
  };
  const consentKey = "downtime-website-analytics-v1";
  const consentLifetime = 180 * 24 * 60 * 60 * 1000;
  let consent;
  let configured = false;
  let banner;
  let preferenceTrigger;
  let loaded = false;
  let resolveLoad;
  const tagLoaded = new Promise(resolve => { resolveLoad = resolve; });
  const adConsent = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  };
  const landingPPID = new URLSearchParams(location.search).get("ppid");
  const validPPID = value => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || "");

  try {
    const stored = JSON.parse(localStorage.getItem(consentKey));
    if (stored && ["granted", "denied"].includes(stored.value)
        && Number.isFinite(stored.timestamp) && stored.timestamp <= Date.now()
        && Date.now() - stored.timestamp < consentLifetime) consent = stored.value;
  } catch {
    // A visitor can still choose for this page when storage is unavailable.
  }

  function pageLocation() {
    const current = new URL(location.href);
    const sanitized = new URL(location.pathname, location.origin);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term"]) {
      const value = current.searchParams.get(key);
      if (value) sanitized.searchParams.set(key, value.slice(0, 100));
    }
    const ppid = current.searchParams.get("ppid");
    if (validPPID(ppid)) sanitized.searchParams.set("ppid", ppid);
    return sanitized.href;
  }

  function enableAnalytics() {
    window["ga-disable-" + measurementID] = false;
    if (configured) {
      window.gtag("consent", "update", { ...adConsent, analytics_storage: "granted" });
      return;
    }
    configured = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ...adConsent, analytics_storage: "denied" });
    window.gtag("consent", "update", { ...adConsent, analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", measurementID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: pageLocation(),
      site_language: language,
      ...(validPPID(landingPPID) ? { ppid: landingPPID } : {}),
      cookie_path: "/downtime/",
      cookie_expires: consentLifetime / 1000,
      cookie_update: false
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementID);
    script.addEventListener("load", () => { loaded = true; resolveLoad(); });
    script.addEventListener("error", resolveLoad);
    document.head.append(script);
  }

  function disableAnalytics() {
    window["ga-disable-" + measurementID] = true;
    if (configured) {
      window.gtag("consent", "update", { ...adConsent, analytics_storage: "denied" });
    }
    // Clear this site's GA cookies without touching language or app settings.
    for (const item of document.cookie.split(";")) {
      const name = item.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      const hostname = location.hostname;
      for (const domain of ["", hostname, "." + hostname]) {
        for (const path of ["/", "/downtime", "/downtime/"]) {
          document.cookie = name + "=; Max-Age=0; Path=" + path
            + (domain ? "; Domain=" + domain : "") + "; SameSite=Lax";
        }
      }
    }
  }

  function choose(value) {
    consent = value;
    try {
      localStorage.setItem(consentKey, JSON.stringify({ value, timestamp: Date.now() }));
    } catch {
      // Consent is kept only in memory if the browser disallows local storage.
    }
    if (value === "granted") enableAnalytics();
    else disableAnalytics();
    const restoreFocus = banner?.contains(document.activeElement);
    if (banner) banner.hidden = true;
    if (restoreFocus) preferenceTrigger?.focus();
  }

  function showPreferences() {
    if (!banner) {
      banner = document.createElement("section");
      banner.className = "analytics-consent";
      banner.setAttribute("aria-label", copy.title);
      const text = document.createElement("div");
      const title = document.createElement("h2");
      title.textContent = copy.title;
      const description = document.createElement("p");
      description.textContent = copy.description;
      const privacy = document.createElement("a");
      privacy.href = copy.privacyURL;
      privacy.textContent = copy.privacy;
      text.append(title, description, privacy);
      const actions = document.createElement("div");
      actions.className = "analytics-consent-actions";
      for (const [value, label] of [["denied", copy.deny], ["granted", copy.allow]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "analytics-choice";
        button.textContent = label;
        button.addEventListener("click", () => choose(value));
        actions.append(button);
      }
      banner.append(text, actions);
      document.body.append(banner);
    }
    banner.hidden = false;
  }

  preferenceTrigger = document.createElement("button");
  preferenceTrigger.type = "button";
  preferenceTrigger.className = "analytics-preferences";
  preferenceTrigger.textContent = copy.preferences;
  preferenceTrigger.addEventListener("click", () => {
    showPreferences();
    banner.querySelector("button")?.focus();
  });
  document.querySelector(".footer-links")?.append(preferenceTrigger);

  if (consent === "granted") enableAnalytics();
  else if (!consent) showPreferences();

  document.addEventListener("click", event => {
    if (consent !== "granted" || !configured) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    const destination = new URL(link.href);
    if (destination.hostname !== "apps.apple.com"
        || !/\/id6760601177\/?$/.test(destination.pathname)) return;
    const placement = link.closest(".site-header") ? "header"
      : link.closest(".final-cta") ? "final_cta"
      : link.closest(".pricing-footer") ? "pricing"
      : link.closest(".footer") ? "footer"
      : link.closest(".page-cta") ? "guide_cta"
      : link.closest(".hero, .page-hero") ? "hero" : "content";
    const ppid = destination.searchParams.get("ppid");
    const parameters = {
      placement,
      site_language: language,
      page_location: pageLocation(),
      link_url: destination.origin + destination.pathname
    };
    if (validPPID(ppid)) parameters.ppid = ppid;

    const normalNavigation = event.button === 0 && !event.defaultPrevented
      && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
      && (!link.target || link.target === "_self");
    let navigated = false;
    const navigate = () => {
      if (!navigated) { navigated = true; location.assign(destination.href); }
    };
    if (normalNavigation) {
      event.preventDefault();
      // A blocked or slow tag must never prevent opening the App Store.
      setTimeout(navigate, 350);
      parameters.event_callback = navigate;
      parameters.event_timeout = 300;
    }
    if (loaded) window.gtag("event", "app_store_click", parameters);
    else {
      tagLoaded.then(() => {
        if (consent === "granted" && loaded) {
          window.gtag("event", "app_store_click", parameters);
        }
      });
    }
  });
})();
