// db-sqlite.js - Capa de persistencia local SQLite-compatible para Manual-BOINC
// Permite guardar estados de simulación, presets y progreso de lectura en localStorage y exportar .sql/.json

const STORAGE_KEYS = {
  PRESETS: "boinc_manual_presets",
  RUNS: "boinc_manual_wu_runs",
  PROGRESS: "boinc_manual_progress"
};

export class BoincLocalDB {
  constructor() {
    this.initDefaultData();
  }

  initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.PRESETS)) {
      const defaultPresets = [
        {
          id: "preset-seti",
          name: "SETI@home Classic Alien Hunter",
          description: "Clúster heterogéneo optimizado para análisis FFT de señales de Arecibo",
          nodes_count: 6,
          cpu_cores: 24,
          gpu_devices: 4,
          byzantine_rate: 0.02,
          quorum_needed: 2,
          created_at: new Date().toISOString()
        },
        {
          id: "preset-rosetta",
          name: "Rosetta@home Folding Farm",
          description: "Granja biológica masiva de CPUs para cálculo de energía libre conformacional",
          nodes_count: 8,
          cpu_cores: 64,
          gpu_devices: 0,
          byzantine_rate: 0.01,
          quorum_needed: 2,
          created_at: new Date().toISOString()
        },
        {
          id: "preset-einstein",
          name: "Einstein@home Gravitational Search",
          description: "Nodos con aceleración masiva GPU (CUDA/OpenCL) para púlsares y ondas gravitacionales",
          nodes_count: 4,
          cpu_cores: 16,
          gpu_devices: 8,
          byzantine_rate: 0.04,
          quorum_needed: 3,
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(defaultPresets));
    }

    if (!localStorage.getItem(STORAGE_KEYS.RUNS)) {
      localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
      const initialProgress = {
        "mod-intro": { completed: true, score: 100 },
        "mod-arch": { completed: false, score: null },
        "mod-atlas": { completed: false, score: null },
        "mod-projects": { completed: false, score: null },
        "mod-simulator": { completed: false, score: null },
        "mod-quantum": { completed: false, score: null }
      };
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(initialProgress));
    }
  }

  getPresets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESETS) || "[]");
    } catch {
      return [];
    }
  }

  savePreset(preset) {
    const list = this.getPresets();
    const existingIndex = list.findIndex(p => p.id === preset.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...preset };
    } else {
      list.push({ ...preset, id: preset.id || `preset-${Date.now()}`, created_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(list));
    return list;
  }

  deletePreset(id) {
    let list = this.getPresets();
    list = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(list));
    return list;
  }

  getRuns() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RUNS) || "[]");
    } catch {
      return [];
    }
  }

  logWorkunitRun(run) {
    const runs = this.getRuns();
    const entry = {
      id: `run-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      project_name: run.projectName,
      wu_name: run.wuName,
      flops_required: run.flopsRequired,
      cobblestones_awarded: run.cobblestones,
      nodes_involved: run.nodesInvolved,
      quorum_status: run.quorumStatus,
      execution_time_sec: run.executionTimeSec,
      executed_at: new Date().toISOString()
    };
    runs.unshift(entry);
    if (runs.length > 50) runs.pop();
    localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
    return entry;
  }

  clearRuns() {
    localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify([]));
  }

  getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}");
    } catch {
      return {};
    }
  }

  setProgress(moduleId, completed = true, score = null) {
    const prog = this.getProgress();
    prog[moduleId] = {
      completed,
      score: score !== null ? score : (prog[moduleId]?.score || null),
      last_read_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(prog));
    return prog;
  }

  exportSQLDump() {
    const presets = this.getPresets();
    const runs = this.getRuns();
    const progress = this.getProgress();

    let sql = `-- Manual-BOINC SQLite Export Dump\n-- Generado el: ${new Date().toISOString()}\n\n`;

    sql += `-- Tabla: cluster_presets\n`;
    for (const p of presets) {
      sql += `INSERT OR REPLACE INTO cluster_presets (id, name, description, nodes_count, cpu_cores, gpu_devices, byzantine_rate, quorum_needed, created_at) VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${(p.description || "").replace(/'/g, "''")}', ${p.nodes_count}, ${p.cpu_cores}, ${p.gpu_devices}, ${p.byzantine_rate}, ${p.quorum_needed}, '${p.created_at}');\n`;
    }

    sql += `\n-- Tabla: workunit_runs\n`;
    for (const r of runs) {
      sql += `INSERT INTO workunit_runs (id, project_name, wu_name, flops_required, cobblestones_awarded, nodes_involved, quorum_status, execution_time_sec, executed_at) VALUES ('${r.id}', '${r.project_name.replace(/'/g, "''")}', '${r.wu_name.replace(/'/g, "''")}', ${r.flops_required}, ${r.cobblestones_awarded}, ${r.nodes_involved}, '${r.quorum_status}', ${r.execution_time_sec}, '${r.executed_at}');\n`;
    }

    sql += `\n-- Tabla: reading_progress\n`;
    for (const [modId, data] of Object.entries(progress)) {
      sql += `INSERT OR REPLACE INTO reading_progress (module_id, module_title, is_completed, quiz_score, last_read_at) VALUES ('${modId}', '${modId}', ${data.completed ? 1 : 0}, ${data.score !== null ? data.score : 'NULL'}, '${data.last_read_at || new Date().toISOString()}');\n`;
    }

    return sql;
  }
}

export const db = new BoincLocalDB();
