/**
 * Baghzy APK Download Portal
 * Single Source of Truth for App Version and Download Mechanics
 */

const APP_VERSION = "1.0.0";
const APK_FILENAME = "baghzy.apk";
const APK_DOWNLOAD_PATH = "https://github.com/Rayees1234/baghzy-web/releases/download/v1.0.0/baghzy.apk";
const APK_SIZE_LABEL = "48 MB";
const RELEASE_DATE = "August 2026";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Populate all version elements dynamically
  document.querySelectorAll("[data-app-version]").forEach((el) => {
    el.textContent = `v${APP_VERSION}`;
  });

  document.querySelectorAll("[data-apk-size]").forEach((el) => {
    el.textContent = APK_SIZE_LABEL;
  });

  document.querySelectorAll("[data-release-date]").forEach((el) => {
    el.textContent = RELEASE_DATE;
  });

  // 2. Set dynamic download links
  document.querySelectorAll("[data-download-link]").forEach((el) => {
    el.setAttribute("href", APK_DOWNLOAD_PATH);
    el.setAttribute("download", APK_FILENAME);
  });

  // 3. Detect In-App Browsers (WhatsApp, Facebook, Instagram, etc.)
  const ua = navigator.userAgent || navigator.vendor || window.opera || "";
  const isWhatsApp = /WhatsApp/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isFB = /FBAN|FBAV/i.test(ua);
  const isInAppBrowser = isWhatsApp || isInstagram || isFB || /wv|Android.*Version\/[0-9.]+/i.test(ua);

  const inAppNotice = document.getElementById("in-app-notice");
  if (isInAppBrowser && inAppNotice) {
    inAppNotice.classList.remove("hidden");
    if (isWhatsApp) {
      const noticeText = inAppNotice.querySelector(".notice-text");
      if (noticeText) {
        noticeText.innerHTML = `<strong>WhatsApp In-App Browser Detected:</strong> If download doesn't start, tap <span class="dots-badge">⋮</span> in top right corner & select <strong>"Open in Chrome"</strong>.`;
      }
    }
  }

  // 4. Handle Download Button Interactivity & Fallback Affordance
  const downloadButtons = document.querySelectorAll(".js-download-trigger");
  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Allow default <a> download behavior, but assist with fallback triggers
      setTimeout(() => {
        // Trigger manual location fallback if browser swallowed download attribute
        try {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = APK_DOWNLOAD_PATH;
          document.body.appendChild(iframe);
          setTimeout(() => document.body.removeChild(iframe), 3000);
        } catch (err) {
          console.log("Download triggered via direct navigation fallback.");
        }
      }, 300);

      // If in WhatsApp / In-App browser, show helpful toast after 2s if still on page
      if (isInAppBrowser) {
        setTimeout(() => {
          showDownloadHelpModal();
        }, 1500);
      }
    });
  });

  // 5. Copy Link Support
  const copyBtn = document.getElementById("copy-link-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Link Copied!</span>
        `;
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove("copied");
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const input = document.createElement("input");
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        alert("Link copied to clipboard!");
      }
    });
  }

  // 6. Help Modal Dismiss
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const helpModal = document.getElementById("help-modal");
  if (modalCloseBtn && helpModal) {
    modalCloseBtn.addEventListener("click", () => {
      helpModal.classList.add("hidden");
    });
    helpModal.addEventListener("click", (e) => {
      if (e.target === helpModal) {
        helpModal.classList.add("hidden");
      }
    });
  }
});

function showDownloadHelpModal() {
  const helpModal = document.getElementById("help-modal");
  if (helpModal) {
    helpModal.classList.remove("hidden");
  }
}
