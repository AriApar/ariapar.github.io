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

// Keep an ad campaign’s custom product page through the download journey.
const customProductPageID = new URLSearchParams(location.search).get("ppid");
if (customProductPageID) {
  for (const link of document.querySelectorAll("a[href]")) {
    const destination = new URL(link.href);
    const isDowntimeDownload = destination.protocol === "https:"
      && destination.hostname === "apps.apple.com"
      && /\/id6760601177\/?$/.test(destination.pathname);
    const isDowntimePage = destination.origin === location.origin
      && (destination.pathname === "/downtime" || destination.pathname.startsWith("/downtime/"));

    if (isDowntimeDownload || isDowntimePage) {
      destination.searchParams.set("ppid", customProductPageID);
      link.href = destination.href;
    }
  }
}
