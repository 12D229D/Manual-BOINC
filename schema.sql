-- Schema SQLite para Manual-BOINC
-- Permite almacenar configuraciones de clúster, ejecuciones de simulación de Workunits y progreso del usuario

CREATE TABLE IF NOT EXISTS cluster_presets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    nodes_count INTEGER NOT NULL DEFAULT 4,
    cpu_cores INTEGER NOT NULL DEFAULT 16,
    gpu_devices INTEGER NOT NULL DEFAULT 2,
    byzantine_rate REAL NOT NULL DEFAULT 0.05,
    quorum_needed INTEGER NOT NULL DEFAULT 2,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workunit_runs (
    id TEXT PRIMARY KEY,
    project_name TEXT NOT NULL,
    wu_name TEXT NOT NULL,
    flops_required REAL NOT NULL,
    cobblestones_awarded REAL NOT NULL,
    nodes_involved INTEGER NOT NULL,
    quorum_status TEXT NOT NULL CHECK(quorum_status IN ('SUCCESS', 'QUORUM_FAIL', 'DISCORDANT_RESULT')),
    execution_time_sec REAL NOT NULL,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reading_progress (
    module_id TEXT PRIMARY KEY,
    module_title TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0,
    quiz_score INTEGER DEFAULT NULL,
    last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales de demostración
INSERT OR IGNORE INTO cluster_presets (id, name, description, nodes_count, cpu_cores, gpu_devices, byzantine_rate, quorum_needed)
VALUES 
    ('preset-seti', 'SETI@home Classic Alien Hunter', 'Clúster heterogéneo optimizado para análisis FFT de señales de Arecibo', 6, 24, 4, 0.02, 2),
    ('preset-rosetta', 'Rosetta@home Folding Farm', 'Granja biológica masiva de CPUs para cálculo de energía conformacional libre', 8, 64, 0, 0.01, 2),
    ('preset-einstein', 'Einstein@home Gravitational Search', 'Nodos con aceleración masiva GPU (CUDA/OpenCL) para púlsares y ondas gravitacionales', 4, 16, 8, 0.04, 3);
