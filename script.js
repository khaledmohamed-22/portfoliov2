/* ========== PANEL MANAGEMENT ========== */
const panels = {};
const sidebarItems = document.querySelectorAll(".sidebar-item");
let activePanel = null;

document.querySelectorAll(".panel-overlay").forEach((overlay) => {
  const id = overlay.dataset.panel;
  const sheet = document.getElementById("sheet-" + id);
  panels[id] = { overlay, sheet };
});

function openPanel(id) {
  if (activePanel === id) {
    closePanel();
    return;
  }
  if (activePanel) closePanelImmediate();

  const p = panels[id];
  if (!p) return;

  p.overlay.classList.add("active");
  p.sheet.classList.add("active");
  document.body.classList.add("panel-open");
  activePanel = id;

  sidebarItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.panel === id);
  });
}

function closePanel() {
  if (!activePanel) return;
  const p = panels[activePanel];
  p.sheet.classList.remove("active");
  p.overlay.classList.remove("active");
  document.body.classList.remove("panel-open");
  sidebarItems.forEach((item) => item.classList.remove("active"));
  activePanel = null;
}

function closePanelImmediate() {
  if (!activePanel) return;
  const p = panels[activePanel];
  p.sheet.classList.remove("active");
  p.overlay.classList.remove("active");
  activePanel = null;
}

// Sidebar click handlers
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => openPanel(item.dataset.panel));
});
// Close buttons
document.querySelectorAll(".panel-close").forEach((btn) => {
  btn.addEventListener("click", closePanel);
});

// Click overlay to close
document.querySelectorAll(".panel-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePanel();
  });
});

// Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

// Keyboard shortcuts 1-6
const panelKeys = [
  "projects",
  "skills",
  "experience",
  "education",
  "contact",
  "about",
];
document.addEventListener("keydown", (e) => {
  if (
    document.activeElement.tagName === "INPUT" ||
    document.activeElement.tagName === "TEXTAREA"
  )
    return;
  const num = parseInt(e.key);
  if (num >= 1 && num <= 6) {
    openPanel(panelKeys[num - 1]);
  }
});

// "Get in Touch" button opens contact panel
const contactBtn = document.getElementById("btn-open-contact");
if (contactBtn) {
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openPanel("contact");
  });
}

/* ========== TOUCH: SWIPE DOWN TO CLOSE ========== */
let touchStartY = 0;
document.querySelectorAll(".panel-sheet").forEach((sheet) => {
  sheet.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  sheet.addEventListener(
    "touchend",
    (e) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY > 80) closePanel();
    },
    { passive: true },
  );
});

/* ========== EMAILJS CONTACT FORM ========== */
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("RagtsB-39wqJCaAZc");
  }
})();

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nameEl = document.getElementById("c-name");
    const emailEl = document.getElementById("c-email");
    const messageEl = document.getElementById("c-message");
    let valid = true;

    [nameEl, emailEl, messageEl].forEach((el) => {
      const empty = !el.value.trim();
      const invalidEmail =
        el.type === "email" &&
        el.value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      const hasError = empty || invalidEmail;
      el.classList.toggle("is-invalid", hasError);
      if (hasError) valid = false;
    });

    if (!valid) return;

    const btn = document.getElementById("btn-submit");
    const statusDiv = document.getElementById("form-status");
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    emailjs
      .send("service_h27lrij", "template_34x2l8r", {
        from_name: nameEl.value,
        from_email: emailEl.value,
        subject: document.getElementById("c-subject").value,
        message: messageEl.value,
      })
      .then(
        () => {
          statusDiv.style.display = "block";
          statusDiv.style.color = "#4ECD64";
          statusDiv.textContent = "✅ Message sent! I'll get back to you soon.";
          contactForm.reset();
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        },
        () => {
          statusDiv.style.display = "block";
          statusDiv.style.color = "#FF6B6B";
          statusDiv.textContent =
            "❌ Failed to send. Please email me directly.";
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        },
      );
  });

  document.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", () => input.classList.remove("is-invalid"));
  });
}
document.querySelectorAll(".sidebar-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position:absolute; inset:0; border-radius:10px;
      background:rgba(232,184,75,0.15);
      animation: sidebarRipple 0.4s ease forwards;
      pointer-events:none; z-index:5;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  });
});
