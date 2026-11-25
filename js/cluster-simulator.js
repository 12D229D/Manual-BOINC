// cluster-simulator.js - Motor de simulación de Clúster BOINC, Workunits, Quórum y Calculadora Cobblestone
import { db } from "./db-sqlite.js";

export class BoincClusterSimulator {
  constructor(canvasId, uiHooks) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.hooks = uiHooks || {};

    this.nodes = [];
    this.workunits = [];
    this.server = { x: 0, y: 0, radius: 28, status: "idle" };
    this.isRunning = false;
    this.animationFrameId = null;

    // Métricas globales
    this.stats = {
      totalGigaflops: 0,
      totalCobblestones: 0,
      wuCompleted: 0,
      wuFailedQuorum: 0,
      byzantineDetected: 0
    };

    // Parámetros de simulación
    this.config = {
      nodeCount: 5,
      cpuCoresPerNode: 8,
      gpuCount: 2,
      byzantineRate: 0.1, // 10% probabilidad de fallo/manipulación
      quorumThreshold: 2, // 2 de 3 concordantes
      replicationFactor: 3,
      selectedProject: "SETI@home"
    };

    if (this.canvas) {
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.initCluster();
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 360;
    this.server.x = this.canvas.width / 2;
    this.server.y = 70;
    this.repositionNodes();
  }

  initCluster() {
    this.nodes = [];
    const count = this.config.nodeCount;
    const width = this.canvas ? this.canvas.width : 800;
    const spacing = width / (count + 1);

    for (let i = 0; i < count; i++) {
      const hasGpu = i < this.config.gpuCount;
      const cores = this.config.cpuCoresPerNode;
      // GigaFLOPS estimado: 1 Core ~ 15 GFLOPS FP64, GPU ~ 250 GFLOPS FP32
      const gflops = (cores * 14.5) + (hasGpu ? 320 : 0);

      this.nodes.push({
        id: `node-${i + 1}`,
        name: `Volunteer-PC#${i + 1}`,
        x: spacing * (i + 1),
        y: 280,
        radius: 20,
        cores,
        hasGpu,
        gflops,
        load: 0, // 0 - 100%
        isByzantine: Math.random() < this.config.byzantineRate,
        currentTask: null,
        credits: 0,
        color: hasGpu ? "hsl(38, 92%, 50%)" : "hsl(210, 100%, 60%)"
      });
    }

    this.calculateTheoreticalThroughput();
    this.render();
  }

  repositionNodes() {
    const count = this.nodes.length;
    if (count === 0 || !this.canvas) return;
    const spacing = this.canvas.width / (count + 1);
    this.nodes.forEach((node, i) => {
      node.x = spacing * (i + 1);
      node.y = 280;
    });
  }

  calculateTheoreticalThroughput() {
    this.stats.totalGigaflops = this.nodes.reduce((acc, n) => acc + n.gflops, 0);
    if (this.hooks.onStatsUpdate) {
      this.hooks.onStatsUpdate(this.stats);
    }
  }

  /**
   * Fórmula histórica de Cobblestones de BOINC:
   * 1 Cobblestone = 1/100 de un día de cómputo en una máquina de referencia (1 GigaFLOPS).
   * 1 día = 86,400 segundos.
   * Cobblestones = (FLOPS_utilizados) / (86,400 * 10^9) * 100 = (FLOPS_utilizados) / 8.64e11
   */
  calculateCobblestones(flops) {
    return Number((flops / 8.64e11).toFixed(2));
  }

  /**
   * Ley de Amdahl:
   * Speedup = 1 / ((1 - P) + (P / N))
   */
  calculateAmdahlSpeedup(parallelFraction, numCores) {
    if (parallelFraction >= 1) return numCores;
    return Number((1 / ((1 - parallelFraction) + (parallelFraction / numCores))).toFixed(2));
  }

  /**
   * Ley de Gustafson:
   * Speedup = N + (1 - N) * (1 - P)
   */
  calculateGustafsonSpeedup(parallelFraction, numCores) {
    return Number((numCores + (1 - numCores) * (1 - parallelFraction)).toFixed(2));
  }

  dispatchWorkunit(wuCustomName) {
    const wuId = `WU-${Date.now().toString().slice(-6)}`;
    const wuName = wuCustomName || `${this.config.selectedProject}_${wuId}`;
    
    // Asignar réplicas a nodos según factor de replicación (ej. 3)
    const availableNodes = [...this.nodes].sort(() => Math.random() - 0.5);
    const assignedNodes = availableNodes.slice(0, Math.min(this.config.replicationFactor, this.nodes.length));

    if (assignedNodes.length === 0) return;

    const flopsDemand = 1.5e12 + Math.random() * 2e12; // 1.5 a 3.5 TeraFLOPS por WU
    const wu = {
      id: wuId,
      name: wuName,
      project: this.config.selectedProject,
      flopsDemand,
      replicas: assignedNodes.map(node => ({
        nodeId: node.id,
        nodeName: node.name,
        progress: 0,
        isByzantine: node.isByzantine,
        computedHash: null,
        status: "processing"
      })),
      quorumThreshold: this.config.quorumThreshold,
      status: "in-flight",
      result: null,
      startTime: Date.now()
    };

    this.workunits.push(wu);
    this.server.status = "dispatching";
    setTimeout(() => { this.server.status = "idle"; }, 400);

    // Activar carga en los nodos
    assignedNodes.forEach(node => {
      node.load = Math.min(100, node.load + (node.hasGpu ? 45 : 75));
    });

    if (this.hooks.onLog) {
      this.hooks.onLog(`[DESPACHO] Generada ${wu.name} con ${assignedNodes.length} réplicas asignadas.`);
    }

    if (!this.isRunning) {
      this.startLoop();
    }
  }

  startLoop() {
    this.isRunning = true;
    const step = () => {
      this.update();
      this.render();
      if (this.isRunning) {
        this.animationFrameId = requestAnimationFrame(step);
      }
    };
    this.animationFrameId = requestAnimationFrame(step);
  }

  stopLoop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  update() {
    let activeWUs = 0;

    for (const wu of this.workunits) {
      if (wu.status !== "in-flight") continue;
      activeWUs++;

      let allDone = true;
      for (const rep of wu.replicas) {
        if (rep.progress < 100) {
          allDone = false;
          // Velocidad según el nodo
          const node = this.nodes.find(n => n.id === rep.nodeId);
          const delta = (node && node.hasGpu ? 1.6 : 0.8) + (Math.random() * 0.4);
          rep.progress = Math.min(100, rep.progress + delta);
          
          if (rep.progress === 100) {
            // Generar hash de resultado: nodos normales coinciden, bizantinos alteran
            if (rep.isByzantine) {
              rep.computedHash = `CORRUPT_${Math.floor(Math.random() * 99999).toString(16)}`;
              this.stats.byzantineDetected++;
            } else {
              rep.computedHash = `CANONICAL_HASH_${wu.id}_VALIDATED`;
            }
            if (node) {
              node.load = Math.max(0, node.load - 40);
            }
          }
        }
      }

      if (allDone) {
        this.resolveQuorum(wu);
      }
    }

    if (activeWUs === 0 && this.workunits.length > 0) {
      // Clúster en reposo
      this.nodes.forEach(n => { n.load = Math.max(0, n.load - 2); });
    }
  }

  resolveQuorum(wu) {
    wu.status = "completed";
    const duration = ((Date.now() - wu.startTime) / 1000).toFixed(1);

    // Contar ocurrencias de cada hash
    const hashCounts = {};
    for (const rep of wu.replicas) {
      hashCounts[rep.computedHash] = (hashCounts[rep.computedHash] || 0) + 1;
    }

    let consensusHash = null;
    let maxVotes = 0;
    for (const [hash, count] of Object.entries(hashCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        consensusHash = hash;
      }
    }

    const quorumReached = maxVotes >= wu.quorumThreshold && !consensusHash.startsWith("CORRUPT");
    const cobblestones = quorumReached ? this.calculateCobblestones(wu.flopsDemand) : 0;

    if (quorumReached) {
      wu.result = "SUCCESS";
      this.stats.wuCompleted++;
      this.stats.totalCobblestones += cobblestones;

      // Otorgar créditos a nodos concordantes
      wu.replicas.forEach(rep => {
        if (rep.computedHash === consensusHash) {
          const node = this.nodes.find(n => n.id === rep.nodeId);
          if (node) node.credits += Math.round(cobblestones / maxVotes);
        }
      });

      if (this.hooks.onLog) {
        this.hooks.onLog(`[QUÓRUM ALCANZADO] ${wu.name}: ${maxVotes}/${wu.replicas.length} concordantes. Otorgados ${cobblestones} Cobblestones.`);
      }
    } else {
      wu.result = "QUORUM_FAIL";
      this.stats.wuFailedQuorum++;
      if (this.hooks.onLog) {
        this.hooks.onLog(`[FALLO DE QUÓRUM] ${wu.name}: Votos dispersos o resultado bizantino (${maxVotes}/${wu.replicas.length}). Tarea descartada.`);
      }
    }

    // Persistir en SQLite
    db.logWorkunitRun({
      projectName: wu.project,
      wuName: wu.name,
      flopsRequired: wu.flopsDemand,
      cobblestones: cobblestones,
      nodesInvolved: wu.replicas.length,
      quorumStatus: wu.result,
      executionTimeSec: Number(duration)
    });

    if (this.hooks.onStatsUpdate) {
      this.hooks.onStatsUpdate(this.stats);
    }
    if (this.hooks.onWorkunitFinished) {
      this.hooks.onWorkunitFinished(wu);
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Líneas de conexión Servidor -> Nodos
    this.nodes.forEach(node => {
      ctx.beginPath();
      ctx.moveTo(this.server.x, this.server.y);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = "hsla(217, 33%, 35%, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Paquetes en tránsito (Workunits en vuelo)
    for (const wu of this.workunits) {
      if (wu.status === "in-flight") {
        wu.replicas.forEach(rep => {
          const node = this.nodes.find(n => n.id === rep.nodeId);
          if (!node) return;
          const pct = rep.progress / 100;
          // Paquete bajando al nodo (0 a 50%) o subiendo resultado (50 a 100%)
          let px, py;
          if (pct < 0.5) {
            const downPct = pct * 2;
            px = this.server.x + (node.x - this.server.x) * downPct;
            py = this.server.y + (node.y - this.server.y) * downPct;
          } else {
            const upPct = (pct - 0.5) * 2;
            px = node.x + (this.server.x - node.x) * upPct;
            py = node.y + (this.server.y - node.y) * upPct;
          }

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = rep.isByzantine ? "hsl(354, 70%, 54%)" : (pct < 0.5 ? "hsl(210, 100%, 60%)" : "hsl(150, 70%, 45%)");
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }
    }

    // Dibujar Servidor BOINC (Scheduler + Validator)
    ctx.beginPath();
    ctx.arc(this.server.x, this.server.y, this.server.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.server.status === "dispatching" ? "hsl(38, 92%, 50%)" : "hsl(217, 33%, 22%)";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "hsl(210, 100%, 60%)";
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BOINC SERVER", this.server.x, this.server.y - 4);
    ctx.font = "9px Inter, sans-serif";
    ctx.fillStyle = "hsl(215, 20%, 75%)";
    ctx.fillText("Scheduler/DB", this.server.x, this.server.y + 8);

    // Dibujar Nodos Trabajadores
    this.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.load > 10 ? "hsl(217, 33%, 26%)" : "hsl(217, 33%, 17%)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = node.isByzantine ? "hsl(354, 70%, 54%)" : node.color;
      ctx.stroke();

      // Anillo de carga (Load %)
      if (node.load > 0) {
        ctx.beginPath();
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * (node.load / 100));
        ctx.arc(node.x, node.y, node.radius + 4, startAngle, endAngle);
        ctx.strokeStyle = node.isByzantine ? "hsl(354, 70%, 54%)" : "hsl(150, 70%, 45%)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText(node.hasGpu ? "GPU+CPU" : "CPU", node.x, node.y - 2);
      ctx.font = "9px Inter, sans-serif";
      ctx.fillStyle = "hsl(215, 20%, 65%)";
      ctx.fillText(`${Math.round(node.gflops)} GF`, node.x, node.y + 10);

      // Etiquetas inferiores
      ctx.fillStyle = node.isByzantine ? "hsl(354, 70%, 60%)" : "hsl(210, 40%, 90%)";
      ctx.font = "10px Outfit, sans-serif";
      ctx.fillText(node.name, node.x, node.y + 32);

      ctx.fillStyle = "hsl(38, 92%, 55%)";
      ctx.font = "9px JetBrains Mono, monospace";
      ctx.fillText(`${node.credits} CB`, node.x, node.y + 45);
    });
  }
}
