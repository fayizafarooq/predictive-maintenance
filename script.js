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

let sidebarOpen = true;

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebarOpen = !sidebarOpen;
  if (sidebarOpen) {
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.add("collapsed");
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

// Set last-updated timestamp in sidebar
function setLastUpdated() {
  const el = document.getElementById("last-updated");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// =============================================
// INIT
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  // Login page
  createParticles();

  // Dashboard page
  loadEmbeds();
  setLastUpdated();
});