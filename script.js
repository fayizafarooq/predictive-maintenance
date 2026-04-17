/* =============================================
  PREDICTIVE MAINTENANCE SYSTEM — JAVASCRIPT
   ============================================= */

// ---- Power BI Embed Links ----
const POWERBI_FLEET_URL    = "https://app.powerbi.com/view?r=eyJrIjoiYjI5OGI2M2EtNDgwNy00OWE4LThjMmYtODZmOGE1MmFjM2U2IiwidCI6ImNmNzIyMWNkLTNiYzYtNDEwMS04NzYyLTU0ZjQ0ZjNiYzg5YSIsImMiOjl9&pageName=99ee6b91b716d0dee616";
const POWERBI_MACHINE_URL  = "https://app.powerbi.com/view?r=eyJrIjoiYjI5OGI2M2EtNDgwNy00OWE4LThjMmYtODZmOGE1MmFjM2U2IiwidCI6ImNmNzIyMWNkLTNiYzYtNDEwMS04NzYyLTU0ZjQ0ZjNiYzg5YSIsImMiOjl9&pageName=c1668f0aea17b7e60869";

// ---- Credentials ----
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";

// =============================================
// LOGIN PAGE FUNCTIONS
// =============================================

function handleLogin(e) {
  e.preventDefault();

  const username  = document.getElementById("username").value.trim();
  const password  = document.getElementById("password").value;
  const errorMsg  = document.getElementById("error-msg");
  const btnText   = document.querySelector(".btn-text");
  const btnLoader = document.getElementById("btn-loader");
  const btnArrow  = document.querySelector(".btn-arrow");
  const loginBtn  = document.getElementById("login-btn");

  // Hide previous error
  errorMsg.classList.remove("show");

  // Show loading state
  btnText.style.display  = "none";
  btnArrow.style.display = "none";
  btnLoader.style.display = "flex";
  loginBtn.disabled = true;

  // Simulate authentication delay (makes it feel real!)
  setTimeout(() => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // Success — show brief "Authenticated" before redirect
      btnLoader.style.display = "none";
      btnText.style.display = "inline";
      btnText.textContent = "✓ Authenticated";
      loginBtn.style.background = "linear-gradient(135deg, #1A8A6E, #4ECDC4)";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 600);

    } else {
      // Failure
      btnLoader.style.display = "none";
      btnText.style.display  = "inline";
      btnArrow.style.display = "inline";
      loginBtn.disabled = false;
      errorMsg.classList.add("show");

      // Shake the card
      const card = document.querySelector(".login-card");
      card.style.animation = "none";
      card.offsetHeight; // reflow
      card.style.animation = "shake 0.4s ease";
    }
  }, 1800); // 1.8 second "auth" delay
}

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// Generate floating particles
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left    = Math.random() * 100 + "vw";
    p.style.setProperty("--dur",   (6 + Math.random() * 10) + "s");
    p.style.setProperty("--delay", (Math.random() * 8) + "s");
    p.style.width   = (Math.random() > 0.7 ? 3 : 2) + "px";
    p.style.height  = p.style.width;
    container.appendChild(p);
  }
}

// =============================================
// DASHBOARD PAGE FUNCTIONS
// =============================================

let sidebarOpen = window.innerWidth > 768;

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebarOpen = !sidebarOpen;
  if (sidebarOpen) {
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.add("collapsed");
  }
}

// Collapse sidebar on mobile at startup
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  if (window.innerWidth <= 768) {
    sidebar.classList.add("collapsed");
    sidebarOpen = false;
  }
}

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page-content").forEach(p => p.classList.remove("active"));
  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  // Show target page
  const page = document.getElementById("page-" + pageName);
  if (page) page.classList.add("active");

  // Set active nav item
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("onclick") && item.getAttribute("onclick").includes(pageName)) {
      item.classList.add("active");
    }
  });
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    window.location.href = "index.html";
  }
}

// Load Power BI iframes if URLs are set
function loadEmbeds() {
  if (POWERBI_FLEET_URL) {
    document.getElementById("embed-fleet").style.display   = "none";
    const f1 = document.getElementById("iframe-fleet");
    f1.src = POWERBI_FLEET_URL;
    f1.classList.remove("hidden");
  }
  if (POWERBI_MACHINE_URL) {
    document.getElementById("embed-machine").style.display = "none";
    const f2 = document.getElementById("iframe-machine");
    f2.src = POWERBI_MACHINE_URL;
    f2.classList.remove("hidden");
  }
}

// Set current date in sidebar
function setCurrentDate() {
  const el = document.getElementById("current-date");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// =============================================
// ALERTS PAGE FUNCTIONS
// =============================================

function loadAlerts() {
  const alerts = JSON.parse(localStorage.getItem('maintenanceAlerts') || '[]');
  const logList = document.getElementById('alert-log-list');
  const emptyState = document.getElementById('alert-log-empty');
  const badge = document.getElementById('alert-badge');
  const countBadge = document.getElementById('alert-count-badge');

  if (!logList) return;

  if (alerts.length === 0) {
    emptyState.style.display = 'flex';
    logList.innerHTML = '';
    if (badge) badge.style.display = 'none';
    if (countBadge) countBadge.textContent = '0 Alerts Sent';
    return;
  }

  emptyState.style.display = 'none';
  if (badge) { badge.style.display = 'flex'; badge.textContent = alerts.length; }
  if (countBadge) countBadge.textContent = alerts.length + ' Alert' + (alerts.length > 1 ? 's' : '') + ' Sent';

  logList.innerHTML = alerts.slice().reverse().map((a, i) => {
    const riskColor = a.risk === 'High Risk' ? 'var(--danger)' : a.risk === 'Medium Risk' ? 'var(--warning)' : 'var(--success)';
    return `
      <div class="alert-log-item" style="animation-delay:${i * 0.05}s">
        <div class="alert-log-icon" style="background: ${riskColor}22; border: 1px solid ${riskColor}44; width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" style="width:16px;height:16px;">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="${riskColor}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="${riskColor}" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="alert-log-body">
          <div class="alert-log-title">
            <span class="alert-log-machine">${a.machine}</span>
            <span class="alert-log-risk" style="color:${riskColor}; background:${riskColor}18; font-size:0.7rem; padding:0.2rem 0.5rem; border-radius:20px; font-weight:600;">${a.risk}</span>
          </div>
          ${a.note ? `<div class="alert-log-note">${a.note}</div>` : ''}
        </div>
        <div class="alert-log-time">${a.time}</div>
      </div>
    `;
  }).join('');
}

function sendAlert() {
  const machine = document.getElementById('alert-machine').value;
  const risk = document.getElementById('alert-risk').value;
  const note = document.getElementById('alert-note').value.trim();

  if (!machine || !risk) {
    alert('Please select a Machine ID and Risk Level.');
    return;
  }

  const alerts = JSON.parse(localStorage.getItem('maintenanceAlerts') || '[]');
  const now = new Date();
  const time = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
               ' · ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  alerts.push({ machine, risk, note, time });
  localStorage.setItem('maintenanceAlerts', JSON.stringify(alerts));

  document.getElementById('alert-machine').value = '';
  document.getElementById('alert-risk').value = '';
  document.getElementById('alert-note').value = '';

  const toast = document.getElementById('alert-toast');
  document.getElementById('alert-toast-msg').textContent = `Alert sent for ${machine} — ${risk}!`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);

  loadAlerts();
}

function clearAlerts() {
  if (confirm('Clear all alerts?')) {
    localStorage.removeItem('maintenanceAlerts');
    loadAlerts();
  }
}

// =============================================
// INIT
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  // Login page
  createParticles();

  // Dashboard page
  loadEmbeds();
  setCurrentDate();
  initSidebar();
  loadAlerts();
});
