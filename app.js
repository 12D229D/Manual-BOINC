// app.js - Entrada principal de Manual-BOINC
import { DISTRIBUTED_MODELS } from "./js/distributed-models.js";
import { VOLUNTEER_PROJECTS, DIJKSTRA_LAUREATES } from "./js/volunteer-projects.js";
import { BoincClusterSimulator } from "./js/cluster-simulator.js";
import { db } from "./js/db-sqlite.js";

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de simulador
  let simulator = null;
  const terminal = document.getElementById("simTerminal");

  function logTerminal(message, type = "info") {
    if (!terminal) return;
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    const time = new Date().toLocaleTimeString();
    line.textContent = `[${time}] ${message}`;
    terminal.insertBefore(line, terminal.firstChild);
  }

  function updateSimulatorStats(stats) {
    const elGflops = document.getElementById("statGigaflops");
    const elCredits = document.getElementById("statCobblestones");
    const elCompleted = document.getElementById("statCompleted");
    const elByzantine = document.getElementById("statByzantine");

    if (elGflops) elGflops.textContent = Math.round(stats.totalGigaflops).toLocaleString();
    if (elCredits) elCredits.textContent = Math.round(stats.totalCobblestones).toLocaleString();
    if (elCompleted) elCompleted.textContent = stats.wuCompleted;
    if (elByzantine) elByzantine.textContent = stats.byzantineDetected;

    renderRunsHistory();
  }

  try {
    simulator = new BoincClusterSimulator("simulatorCanvas", {
      onLog: (msg) => logTerminal(msg, msg.includes("QUÓRUM") ? "success" : (msg.includes("FALLO") ? "error" : "info")),
      onStatsUpdate: updateSimulatorStats,
      onWorkunitFinished: () => renderRunsHistory()
    });
  } catch (err) {
    console.error("No se pudo iniciar el canvas del simulador:", err);
  }

  // Enrutador por pestañas / Hash
  const navButtons = document.querySelectorAll(".nav-tab-btn");
  const viewPanels = document.querySelectorAll(".view-panel");

  function switchTab(targetTabId) {
    navButtons.forEach(btn => {
      const isActive = btn.dataset.target === targetTabId;
      btn.classList.toggle("active", isActive);
    });

    viewPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === targetTabId);
    });

    if (targetTabId === "panel-simulator" && simulator) {
      setTimeout(() => simulator.resizeCanvas(), 50);
    }

    window.location.hash = targetTabId.replace("panel-", "");
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.target));
  });

  // Restaurar pestaña según URL Hash
  if (window.location.hash) {
    const targetId = `panel-${window.location.hash.substring(1)}`;
    if (document.getElementById(targetId)) {
      switchTab(targetId);
    }
  }

  // Renderizado del Atlas de los 25 Modelos
  const atlasContainer = document.getElementById("atlasGrid");
  const modelCategoryFilter = document.getElementById("modelCategoryFilter");
  const searchInput = document.getElementById("globalSearchInput");

  function renderModels(filterText = "", categoryFilter = "all") {
    if (!atlasContainer) return;
    atlasContainer.innerHTML = "";

    const query = filterText.toLowerCase().trim();
    const filtered = DISTRIBUTED_MODELS.filter(m => {
      const matchText = m.name.toLowerCase().includes(query) ||
                        m.summary.toLowerCase().includes(query) ||
                        m.details.toLowerCase().includes(query) ||
                        m.tags.some(t => t.toLowerCase().includes(query));
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      return matchText && matchCat;
    });

    if (filtered.length === 0) {
      atlasContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron modelos con el criterio ingresado.</p>`;
      return;
    }

    filtered.forEach(model => {
      const card = document.createElement("article");
      card.className = "model-card";
      card.innerHTML = `
        <div class="model-card-top">
          <span class="model-icon">${model.icon}</span>
          <span class="model-cat-badge">${model.category}</span>
        </div>
        <h3>${model.name}</h3>
        <p>${model.summary}</p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${model.details}</p>
        <div class="model-formula"><code>${model.formula}</code></div>
        <div class="model-tags">
          ${model.tags.map(t => `<span class="model-tag">#${t}</span>`).join("")}
        </div>
      `;
      atlasContainer.appendChild(card);
    });
  }

  // Rellenar categorías únicas de modelos
  if (modelCategoryFilter) {
    const categories = ["all", ...new Set(DISTRIBUTED_MODELS.map(m => m.category))];
    modelCategoryFilter.innerHTML = categories.map(c => `<option value="${c}">${c === "all" ? "Todas las Categorías (25)" : c}</option>`).join("");
    modelCategoryFilter.addEventListener("change", (e) => {
      renderModels(searchInput ? searchInput.value : "", e.target.value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const currentCat = modelCategoryFilter ? modelCategoryFilter.value : "all";
      renderModels(e.target.value, currentCat);
    });
  }

  renderModels();

  // Renderizado de Proyectos Voluntarios y Dijkstra
  const projectsTableBody = document.getElementById("projectsTableBody");
  const dijkstraList = document.getElementById("dijkstraList");

  if (projectsTableBody) {
    projectsTableBody.innerHTML = VOLUNTEER_PROJECTS.map(p => `
      <tr>
        <td><strong>${p.name}</strong><br><small style="color:var(--text-muted);">${p.institution}</small></td>
        <td><span class="model-tag" style="background:hsla(210,100%,60%,0.2);color:var(--accent-primary);">${p.badge}</span></td>
        <td><span class="badge-tag">${p.status}</span></td>
        <td style="font-size:0.8rem;">${p.target}</td>
        <td><code style="font-size:0.75rem;color:var(--accent-amber);">${p.hardware}</code></td>
      </tr>
    `).join("");
  }

  if (dijkstraList) {
    dijkstraList.innerHTML = DIJKSTRA_LAUREATES.map(d => `
      <div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-sm);border-left:3px solid var(--accent-primary);margin-bottom:0.75rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;">
          <strong style="color:var(--accent-amber);font-size:0.9rem;">Premio ${d.year}</strong>
          <span style="font-size:0.8rem;color:var(--text-secondary);">${d.authors}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-primary);font-weight:500;">${d.paper}</p>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">${d.impact}</p>
      </div>
    `).join("");
  }

  // Controles del Simulador
  const btnDispatchWU = document.getElementById("btnDispatchWU");
  const btnAddNode = document.getElementById("btnAddNode");
  const btnResetCluster = document.getElementById("btnResetCluster");
  const projectSelector = document.getElementById("projectSelector");

  if (btnDispatchWU && simulator) {
    btnDispatchWU.addEventListener("click", () => {
      const proj = projectSelector ? projectSelector.value : "SETI@home";
      simulator.config.selectedProject = proj;
      simulator.dispatchWorkunit();
    });
  }

  if (btnAddNode && simulator) {
    btnAddNode.addEventListener("click", () => {
      simulator.config.nodeCount = Math.min(10, simulator.config.nodeCount + 1);
      simulator.initCluster();
      logTerminal(`Añadido nuevo nodo al clúster (Total: ${simulator.config.nodeCount} nodos).`, "info");
    });
  }

  if (btnResetCluster && simulator) {
    btnResetCluster.addEventListener("click", () => {
      simulator.config.nodeCount = 5;
      simulator.initCluster();
      logTerminal("Clúster reiniciado a topología base de 5 nodos.", "warn");
    });
  }

  // Calculadoras matemáticas interactivas (Amdahl, Gustafson y Cobblestone)
  const amdahlParallelRange = document.getElementById("amdahlParallel");
  const amdahlCoresRange = document.getElementById("amdahlCores");
  const amdahlValP = document.getElementById("amdahlValP");
  const amdahlValN = document.getElementById("amdahlValN");
  const amdahlResult = document.getElementById("amdahlResult");
  const gustafsonResult = document.getElementById("gustafsonResult");

  function updateScalingLaws() {
    if (!amdahlParallelRange || !amdahlCoresRange) return;
    const p = parseFloat(amdahlParallelRange.value);
    const n = parseInt(amdahlCoresRange.value, 10);

    if (amdahlValP) amdahlValP.textContent = `${Math.round(p * 100)}%`;
    if (amdahlValN) amdahlValN.textContent = `${n} Cores`;

    if (simulator) {
      const aSpeedup = simulator.calculateAmdahlSpeedup(p, n);
      const gSpeedup = simulator.calculateGustafsonSpeedup(p, n);
      if (amdahlResult) amdahlResult.textContent = `${aSpeedup}x`;
      if (gustafsonResult) gustafsonResult.textContent = `${gSpeedup}x`;
    }
  }

  if (amdahlParallelRange && amdahlCoresRange) {
    amdahlParallelRange.addEventListener("input", updateScalingLaws);
    amdahlCoresRange.addEventListener("input", updateScalingLaws);
    updateScalingLaws();
  }

  // Calculadora Cobblestones en Vivo
  const calcFlopsInput = document.getElementById("calcFlopsInput");
  const calcHoursInput = document.getElementById("calcHoursInput");
  const calcCobblestoneResult = document.getElementById("calcCobblestoneResult");

  function updateCobblestoneCalc() {
    if (!calcFlopsInput || !calcHoursInput || !calcCobblestoneResult || !simulator) return;
    const gflops = parseFloat(calcFlopsInput.value) || 0;
    const hours = parseFloat(calcHoursInput.value) || 0;
    const totalFlops = gflops * 1e9 * (hours * 3600);
    const credits = simulator.calculateCobblestones(totalFlops);
    calcCobblestoneResult.textContent = `${credits.toLocaleString()} Cobblestones`;
  }

  if (calcFlopsInput && calcHoursInput) {
    calcFlopsInput.addEventListener("input", updateCobblestoneCalc);
    calcHoursInput.addEventListener("input", updateCobblestoneCalc);
    updateCobblestoneCalc();
  }

  // Renderizado del Historial de SQLite
  function renderRunsHistory() {
    const tableBody = document.getElementById("runsHistoryBody");
    if (!tableBody) return;
    const runs = db.getRuns().slice(0, 8);
    if (runs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">Sin simulaciones registradas aún en SQLite.</td></tr>`;
      return;
    }
    tableBody.innerHTML = runs.map(r => `
      <tr>
        <td><code>${r.wu_name}</code></td>
        <td>${r.project_name}</td>
        <td><span class="badge-tag" style="${r.quorum_status === 'SUCCESS' ? 'color:var(--success);border-color:var(--success);' : 'color:var(--danger);border-color:var(--danger);'}">${r.quorum_status}</span></td>
        <td><strong>${r.cobblestones_awarded}</strong> CB</td>
        <td><small style="color:var(--text-muted);">${r.execution_time_sec}s</small></td>
      </tr>
    `).join("");
  }
  renderRunsHistory();

  // Exportar dump SQL
  const btnExportSQL = document.getElementById("btnExportSQL");
  if (btnExportSQL) {
    btnExportSQL.addEventListener("click", () => {
      const dump = db.exportSQLDump();
      const blob = new Blob([dump], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boinc_manual_dump_${Date.now()}.sql`;
      a.click();
      URL.revokeObjectURL(url);
      logTerminal("Descargado archivo SQL exportado desde la base de datos local.", "success");
    });
  }

  // Quiz Interactivo
  const quizQuestions = [
    {
      q: "¿Cuál es la unidad histórica estándar de crédito en la red BOINC equivalente a 1/100 de un día de cómputo en un nodo de 1 GigaFLOPS?",
      options: ["CreditPoint", "Cobblestone", "BogoMIPS", "QuantumHash"],
      answer: 1,
      feedback: "¡Exacto! El Cobblestone fue nombrado en honor a Jeff Cobbley y cuantifica el trabajo científico homologado."
    },
    {
      q: "¿Qué modelo de computación distribuida utiliza BOINC para que los clientes ejecuten tareas sin memoria ni disco compartido?",
      options: ["Shared-Memory SMP", "Shared-Nothing Architecture", "Distributed Lock Manager", "Flat Shared Storage"],
      answer: 1,
      feedback: "¡Correcto! Shared-Nothing garantiza que los nodos trabajen con total desacoplamiento e independencia."
    },
    {
      q: "¿Cómo detecta y neutraliza el servidor BOINC a clientes defectuosos o que intentan falsificar créditos (nodos bizantinos)?",
      options: ["Pruebas de conocimiento cero", "Redundancia Homogénea y Validación por Quórum", "Verificación mediante Blockchain", "Bloqueo por dirección MAC"],
      answer: 1,
      feedback: "¡Muy bien! Se envían réplicas idénticas de la misma Workunit a diferentes clientes y se requiere coincidencia estricta de hash (Quórum)."
    },
    {
      q: "Según la Ley de Amdahl, si un problema científico solo tiene un 50% de código paralelizable, ¿cuál es el Speedup máximo teórico con infinitos cores?",
      options: ["2.0x", "5.0x", "10.0x", "Infinito"],
      answer: 0,
      feedback: "¡Correcto! 1 / ((1 - 0.5) + (0.5 / ∞)) = 1 / 0.5 = 2.0x."
    }
  ];

  const quizContainer = document.getElementById("interactiveQuiz");
  if (quizContainer) {
    quizContainer.innerHTML = quizQuestions.map((item, idx) => `
      <div class="quiz-question-box" data-qindex="${idx}">
        <h4>${idx + 1}. ${item.q}</h4>
        <div class="quiz-options">
          ${item.options.map((opt, oIdx) => `
            <button class="quiz-option-btn" data-option="${oIdx}">${opt}</button>
          `).join("")}
        </div>
        <div class="quiz-feedback" style="margin-top:0.6rem;font-size:0.82rem;display:none;"></div>
      </div>
    `).join("");

    quizContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".quiz-option-btn");
      if (!btn) return;
      const box = btn.closest(".quiz-question-box");
      const qIndex = parseInt(box.dataset.qindex, 10);
      const optIndex = parseInt(btn.dataset.option, 10);
      const question = quizQuestions[qIndex];
      const feedbackEl = box.querySelector(".quiz-feedback");

      box.querySelectorAll(".quiz-option-btn").forEach(b => {
        b.disabled = true;
        b.classList.remove("correct", "incorrect");
      });

      if (optIndex === question.answer) {
        btn.classList.add("correct");
        feedbackEl.style.display = "block";
        feedbackEl.style.color = "var(--success)";
        feedbackEl.textContent = question.feedback;
      } else {
        btn.classList.add("incorrect");
        feedbackEl.style.display = "block";
        feedbackEl.style.color = "var(--danger)";
        feedbackEl.textContent = `Incorrecto. La respuesta acertada era: "${question.options[question.answer]}".`;
      }
    });
  }
});
