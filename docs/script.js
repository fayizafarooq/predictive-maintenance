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

function toggleCredentials() {
  const modal = document.getElementById('credentials-modal');
  if (modal) modal.classList.toggle('show');
}

// Close credentials modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('credentials-modal');
  const hint  = document.querySelector('.login-hint');
  if (modal && hint && !hint.contains(e.target) && !modal.contains(e.target)) {
    modal.classList.remove('show');
  }
});

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

function toggleMobileDropdown() {
  const menu = document.getElementById("mobile-dropdown-menu");
  if (menu) menu.classList.toggle("show");
}

// Close mobile dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById("mobile-user-dropdown");
  const menu = document.getElementById("mobile-dropdown-menu");
  if (menu && dropdown && !dropdown.contains(e.target)) {
    menu.classList.remove("show");
  }
});

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
  // Close sidebar when clicking anywhere outside it on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    const toggle = document.getElementById("sidebar-toggle");
    if (sidebarOpen && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.add("collapsed");
      sidebarOpen = false;
    }
  })
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
    // Close sidebar when option selected on mobile
    if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.add("collapsed");
    sidebarOpen = false;
  }
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
// ALERTS PAGE FUNCTIONS (EmailJS powered)
// =============================================

// EmailJS credentials
const EMAILJS_SERVICE_ID  = 'service_yykddvq';
const EMAILJS_TEMPLATE_ID = 'template_iqff18i';
const EMAILJS_PUBLIC_KEY  = 'Za-U8XqzcvRNGE8Rk';
const ALERT_RECIPIENT     = 'fayizafarooqgmail.com'; // ← replace with your email

// Fetch at-risk machines from JSON file
async function fetchAtRiskMachines() {
  const listEl   = document.getElementById('at-risk-list');
  const countEl  = document.getElementById('at-risk-count');
  const dateEl   = document.getElementById('at-risk-date');
  if (!listEl) return;

  try {
    const res  = await fetch('at_risk_machines.json?t=' + Date.now());
    const data = await res.json();

    if (dateEl) dateEl.textContent = 'Data for: ' + data.date;

    if (!data.machines || data.machines.length === 0) {
      listEl.innerHTML = `<div class="alert-empty" style="padding:1.5rem;">
        <p style="color:var(--success);">✅ No high risk or deteriorating machines today!</p>
      </div>`;
      if (countEl) countEl.textContent = '0 machines';
      return;
    }

    if (countEl) countEl.textContent = `${data.machines.length} machine${data.machines.length > 1 ? 's' : ''} need attention`;

    // Show machines in a grid — 3 per row
    listEl.innerHTML = `<div class="at-risk-grid">${data.machines.map(m => {
      const isHigh         = m.failure_risk_level === 'High Risk';
      const isDeterioting  = m.trend === 'Deteriorating';
      const riskColor      = isHigh ? 'var(--danger)' : 'var(--warning)';
      return `
        <div class="at-risk-card">
          <div class="at-risk-card-header">
            <span class="at-risk-machine">${m.machine_id}</span>
            <span class="at-risk-badge" style="color:${riskColor};background:${riskColor}18;">${m.failure_risk_level}</span>
            ${isDeterioting ? `<span class="at-risk-badge" style="color:var(--warning);background:rgba(255,179,71,0.1);">📉 Deteriorating</span>` : ''}
          </div>
          <div class="at-risk-card-body">
            <div class="at-risk-stat"><span>Health</span><strong>${m.health_score}%</strong></div>
            <div class="at-risk-stat"><span>Days Left</span><strong>${m.days_to_failure}</strong></div>
            <div class="at-risk-stat"><span>Temp</span><strong>${m.temperature}°C</strong></div>
          </div>
          <div class="at-risk-card-footer">Est. Failure: ${m.predicted_failure_date}</div>
          <button class="at-risk-send-btn" onclick="sendAlertForMachine('${m.machine_id}', '${m.failure_risk_level}', '${m.days_to_failure}', '${m.predicted_failure_date}', this)">
            <svg viewBox="0 0 24 24" fill="none" style="width:13px;height:13px;">
              <line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
              <polygon points="22,2 15,22 11,13 2,9" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Send Alert
          </button>
        </div>`;
    }).join('')}</div>`;

    // Show maintained machines
    const maintainedEl = document.getElementById('maintained-list');
    if (maintainedEl) {
      if (!data.maintained || data.maintained.length === 0) {
        maintainedEl.innerHTML = `<div class="alert-empty" style="padding:1rem;">
          <p style="color:var(--text-muted); font-size:0.82rem;">No maintenance performed today.</p>
        </div>`;
      } else {
        maintainedEl.innerHTML = `<div class="at-risk-grid">${data.maintained.map(machineId => `
          <div class="at-risk-card" style="border-color:rgba(78,205,196,0.3);">
            <div class="at-risk-card-header">
              <span class="at-risk-machine">${machineId}</span>
              <span class="at-risk-badge" style="color:var(--success);background:rgba(78,205,196,0.1);">✓ Maintained</span>
            </div>
            <div class="at-risk-card-footer" style="border:none;padding:0;">Maintenance performed · ${data.date} · Reset to healthy</div>
          </div>`).join('')}</div>`;
      }
    }

  } catch (err) {
    listEl.innerHTML = `<div class="alert-empty" style="padding:1.5rem;">
      <p style="color:var(--text-muted);">⚠️ Run daily_predict.py to generate today's at-risk data.</p>
    </div>`;
    console.error('JSON fetch error:', err);
  }
}

function sendAlertForMachine(machineId, riskLevel, daysLeft, failureDate, btnEl) {
  btnEl.disabled = true;
  btnEl.innerHTML = `<span>Sending...</span>`;

  const now  = new Date();
  const time = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
                ' · ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email  : ALERT_RECIPIENT,
    machine_id: machineId,
    risk_level: riskLevel,
    note      : `Days to failure: ${daysLeft} | Est. failure date: ${failureDate}`,
    time      : time,
    name      : 'Predictive Maintenance System'
  }, EMAILJS_PUBLIC_KEY)
  .then(() => {
    btnEl.style.background = 'linear-gradient(135deg, #1a7a4a, var(--success))';
    btnEl.innerHTML = `✓ Sent!`;

    const alerts = JSON.parse(localStorage.getItem('maintenanceAlerts') || '[]');
    alerts.push({ machine: machineId, risk: riskLevel, note: `Days to failure: ${daysLeft}`, email: ALERT_RECIPIENT, time });
    localStorage.setItem('maintenanceAlerts', JSON.stringify(alerts));

    const toast = document.getElementById('alert-toast');
    document.getElementById('alert-toast-msg').textContent = `Alert sent for ${machineId} — ${riskLevel}!`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);

    loadAlerts();

  }).catch(err => {
    btnEl.disabled = false;
    btnEl.innerHTML = `Send Alert`;
    alert('Failed to send. Please try again.');
    console.error(err);
  });
}

function sendAlert() {
  const machine = document.getElementById('alert-machine').value;
  const risk    = document.getElementById('alert-risk').value;
  const note    = document.getElementById('alert-note').value.trim();
  const btnEl   = document.getElementById('alert-send-btn');

  if (!machine || !risk) {
    alert('Please select a Machine ID and Risk Level.');
    return;
  }

  const now  = new Date();
  const time = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
                ' · ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  btnEl.disabled = true;
  btnEl.innerHTML = `<span>Sending...</span>`;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email  : ALERT_RECIPIENT,
    machine_id: machine,
    risk_level: risk,
    note      : note || 'Manual alert triggered',
    time      : time,
    name      : 'Predictive Maintenance System'
  }, EMAILJS_PUBLIC_KEY)
  .then(() => {
    btnEl.style.background = 'linear-gradient(135deg, #1a7a4a, var(--success))';
    btnEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" style="width:16px;height:16px;">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        <polyline points="22,4 12,14.01 9,11.01" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Alert Sent!`;

    const alerts = JSON.parse(localStorage.getItem('maintenanceAlerts') || '[]');
    alerts.push({ machine, risk, note: note || 'Manual alert', email: ALERT_RECIPIENT, time });
    localStorage.setItem('maintenanceAlerts', JSON.stringify(alerts));

    const toast = document.getElementById('alert-toast');
    document.getElementById('alert-toast-msg').textContent = `Alert sent for ${machine} — ${risk}!`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);

    setTimeout(() => {
      btnEl.disabled = false;
      btnEl.style.background = '';
      btnEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" style="width:16px;height:16px;">
          <line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
          <polygon points="22,2 15,22 11,13 2,9" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Send Alert`;
      document.getElementById('alert-machine').value = '';
      document.getElementById('alert-risk').value    = '';
      document.getElementById('alert-note').value    = '';
    }, 2000);

    loadAlerts();
  }).catch(err => {
    btnEl.disabled = false;
    btnEl.innerHTML = `Send Alert`;
    alert('Failed to send. Please try again.');
    console.error(err);
  });
}

function loadAlerts() {
  const alerts     = JSON.parse(localStorage.getItem('maintenanceAlerts') || '[]');
  const logList    = document.getElementById('alert-log-list');
  const emptyState = document.getElementById('alert-log-empty');
  const badge      = document.getElementById('alert-badge');
  const countBadge = document.getElementById('alert-count-badge');

  if (!logList) return;

  if (alerts.length === 0) {
    emptyState.style.display = 'flex';
    logList.innerHTML = '';
    if (badge)      badge.style.display = 'none';
    if (countBadge) countBadge.textContent = '0 Alerts Sent';
    return;
  }

  emptyState.style.display = 'none';
  if (badge)      { badge.style.display = 'flex'; badge.textContent = alerts.length; }
  if (countBadge) countBadge.textContent = alerts.length + ' Alert' + (alerts.length > 1 ? 's' : '') + ' Sent';

  logList.innerHTML = alerts.slice().reverse().map((a, i) => {
    const riskColor = a.risk === 'High Risk' ? 'var(--danger)' : a.risk === 'Medium Risk' ? 'var(--warning)' : 'var(--success)';
    return `
      <div class="alert-log-item" style="animation-delay:${i * 0.05}s">
        <div style="width:36px;height:36px;border-radius:8px;background:${riskColor}22;border:1px solid ${riskColor}44;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" style="width:16px;height:16px;">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="${riskColor}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="${riskColor}" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="alert-log-body">
          <div class="alert-log-title">
            <span class="alert-log-machine">${a.machine}</span>
            <span class="alert-log-risk" style="color:${riskColor};background:${riskColor}18;font-size:0.7rem;padding:0.2rem 0.5rem;border-radius:20px;font-weight:600;">${a.risk}</span>
          </div>
          <div class="alert-log-note">${a.note} · Sent to: ${a.email || ALERT_RECIPIENT}</div>
        </div>
        <div class="alert-log-time">${a.time}</div>
      </div>`;
  }).join('');
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
  fetchAtRiskMachines();
});
