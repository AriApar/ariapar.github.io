// Static hosting has no country headers. Route by browser language instead,
// preserving every campaign parameter and respecting explicit language choices.
const pageLanguage = document.documentElement.lang;
const languageSwitches = document.querySelectorAll(".language-switch");
const requestedLanguage = new URLSearchParams(location.search).get("lang");
const supportedLanguages = ["en", "de"];
let savedLanguage;
try {
  savedLanguage = localStorage.getItem("downtime-language");
  if (supportedLanguages.includes(requestedLanguage)) {
    localStorage.setItem("downtime-language", requestedLanguage);
  }
} catch {
  // Explicit ?lang= links still work when browser storage is unavailable.
}
const browserLanguage = (navigator.languages || [navigator.language])
  .map(language => language.toLowerCase().split("-")[0])
  .find(language => supportedLanguages.includes(language));
const preferredLanguage = supportedLanguages.includes(requestedLanguage)
  ? requestedLanguage
  : supportedLanguages.includes(savedLanguage) ? savedLanguage : browserLanguage;
const shouldChangeLanguage = preferredLanguage !== pageLanguage
  && (supportedLanguages.includes(requestedLanguage)
    || (pageLanguage === "en" && preferredLanguage === "de"));
const alternateLanguageLink = [...languageSwitches]
  .find(link => link.hreflang === preferredLanguage);
if (shouldChangeLanguage && alternateLanguageLink) {
  const destination = new URL(alternateLanguageLink.href);
  destination.search = location.search;
  destination.hash = location.hash;
  location.replace(destination.href);
}
for (const link of languageSwitches) {
  link.addEventListener("click", () => {
    try {
      localStorage.setItem("downtime-language", link.hreflang);
    } catch {
      // The language query parameter provides the same override without storage.
    }
  });
}

// Native disclosures remain usable when JavaScript is unavailable.
const menu = document.querySelector(".mobile-menu");
if (menu) {
  const trigger = menu.querySelector("summary");
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      trigger.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest("a"))) {
      menu.open = false;
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) menu.open = false;
  });
}

// Direct FAQ links open the answer as well as scrolling to it.
function openLinkedAnswer() {
  const id = location.hash.slice(1);
  if (!id) return;
  const answer = document.getElementById(id);
  if (answer?.matches("details.faq-item")) answer.open = true;
}
openLinkedAnswer();
window.addEventListener("hashchange", openLinkedAnswer);

// Keep campaign attribution and explicit language choices through navigation.
const customProductPageID = new URLSearchParams(location.search).get("ppid");
if (customProductPageID || supportedLanguages.includes(requestedLanguage)) {
  for (const link of document.querySelectorAll("a[href]")) {
    const destination = new URL(link.href);
    const isDowntimeDownload = destination.protocol === "https:"
      && destination.hostname === "apps.apple.com"
      && /\/id6760601177\/?$/.test(destination.pathname);
    const isDowntimePage = destination.origin === location.origin
      && (destination.pathname === "/downtime" || destination.pathname.startsWith("/downtime/"));

    if (isDowntimeDownload || isDowntimePage) {
      if (customProductPageID) {
        destination.searchParams.set("ppid", customProductPageID);
      }
      if (isDowntimePage && supportedLanguages.includes(requestedLanguage)
          && !link.classList.contains("language-switch")) {
        destination.searchParams.set("lang", requestedLanguage);
      }
      link.href = destination.href;
    }
  }
}
