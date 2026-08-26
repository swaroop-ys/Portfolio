
const fallbackProjects = [
  {
    title: "Cyber Vegetable Calculator",
    description: "A functional calculator for converting quantities in kg/grams and calculating produce prices.",
    technologies: ["HTML", "CSS", "JavaScript"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Anime Character Quiz",
    description: "A neon quiz experience for identifying anime characters with score tracking and animated UI.",
    technologies: ["JavaScript", "CSS", "DOM"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    title: "2D Retro Adventure",
    description: "A browser-based retro platformer concept with original characters, levels and game logic.",
    technologies: ["HTML5", "Canvas", "JavaScript"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Personal Portfolio API",
    description: "Full-stack portfolio architecture with REST endpoints, MongoDB storage and contact submissions.",
    technologies: ["Node.js", "Express", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#"
  }
];

function projectCard(p, i) {
  return `<article class="project reveal">
    <div class="project-id">MISSION_${String(i + 1).padStart(3, "0")}</div>
    <h3>${escapeHtml(p.title)}</h3>
    <p>${escapeHtml(p.description)}</p>
    <div class="tags">${(p.technologies || []).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
    <div class="project-links">
      ${p.githubUrl && p.githubUrl !== "#" ? `<a href="${p.githubUrl}" target="_blank" rel="noreferrer">GITHUB ↗</a>` : ""}
      ${p.liveUrl && p.liveUrl !== "#" ? `<a href="${p.liveUrl}" target="_blank" rel="noreferrer">LIVE DEMO ↗</a>` : ""}
    </div>
  </article>`;
}

async function loadProjects() {
  const grid = document.getElementById("projectGrid");
  try {
    const res = await fetch(`${API}/projects`);
    if (!res.ok) throw new Error("API unavailable");
    const projects = await res.json();
    grid.innerHTML = projects.length ? projects.map(projectCard).join("") : fallbackProjects.map(projectCard).join("");
  } catch (e) {
    grid.innerHTML = fallbackProjects.map(projectCard).join("");
  }
  observeReveals();
}

document.getElementById("contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  const data = Object.fromEntries(new FormData(e.target));
  status.textContent = "TRANSMITTING...";
  try {
    const res = await fetch(`${API}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Transmission failed");
    status.textContent = "[OK] TRANSMISSION RECEIVED.";
    e.target.reset();
  } catch (err) {
    status.textContent = "[ERROR] BACKEND OFFLINE. START THE SERVER AND TRY AGAIN.";
  }
});

document.getElementById("menu").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}

function observeReveals() {
  const observer = new IntersectionObserver(entries => entries.forEach(x => {
    if (x.isIntersecting) x.target.classList.add("show");
  }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}
observeReveals();
loadProjects();

// Lightweight matrix rain background
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
let drops = [];
function resizeMatrix() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  drops = Array(Math.floor(canvas.width / 18)).fill(1);
}
function drawMatrix() {
  ctx.fillStyle = "rgba(5,4,10,.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "14px monospace";
  ctx.fillStyle = "#00f6ff";
  drops.forEach((y, i) => {
    const text = Math.random() > .5 ? "1" : "0";
    ctx.fillText(text, i * 18, y * 18);
    if (y * 18 > canvas.height && Math.random() > .975) drops[i] = 0;
    drops[i]++;
  });
  requestAnimationFrame(drawMatrix);
}
addEventListener("resize", resizeMatrix);
resizeMatrix();
drawMatrix();
