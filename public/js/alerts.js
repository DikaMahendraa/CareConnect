/*
 * Optional lightweight refresh for the alert badge/count.
 * Backend contract: GET /caregiver/alerts/summary -> { unhandledCount: number }
 * If this endpoint is not provided by backend anggota 1, this script safely does nothing.
 */
(() => {
  const countNode = document.getElementById("unhandled-alert-count");
  const badgeNode = document.querySelector(".cc-alert-nav__count");
  const endpoint = "/caregiver/alerts/summary";

  async function refreshAlertCount() {
    try {
      const response = await fetch(endpoint, {
        headers: { "Accept": "application/json" },
        credentials: "same-origin"
      });
      if (!response.ok) return;
      const data = await response.json();
      if (!Number.isFinite(Number(data.unhandledCount))) return;
      const count = Math.max(0, Number(data.unhandledCount));
      if (countNode) countNode.textContent = String(count);
      if (badgeNode) {
        badgeNode.textContent = String(count);
        badgeNode.hidden = count === 0;
      }
    } catch (_) {
      // Tidak mengganggu halaman jika endpoint ringkasan belum tersedia.
    }
  }

  if (countNode || badgeNode) {
    refreshAlertCount();
    window.setInterval(refreshAlertCount, 60000);
  }
})();
