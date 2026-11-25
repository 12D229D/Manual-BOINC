// volunteer-projects.js - Directorio de Proyectos BOINC y Galardonados Dijkstra
export const VOLUNTEER_PROJECTS = [
  {
    id: "seti-at-home",
    name: "SETI@home",
    institution: "UC Berkeley Space Sciences Laboratory",
    founded: 1999,
    status: "Histórico (Hibernación)",
    category: "Astrofísica",
    target: "Búsqueda de inteligencia extraterrestre mediante análisis espectral de banda estrecha de señales de radio del radiotelescopio de Arecibo.",
    hardware: "CPU / GPU (Nvidia CUDA, AMD OpenCL)",
    achievements: "Pionero absoluto de la computación voluntaria; más de 5 millones de participantes en todo el mundo. Sentó las bases directas que motivaron la creación de BOINC.",
    badge: "📡 Astrofísica"
  },
  {
    id: "folding-at-home",
    name: "Folding@home",
    institution: "Washington University in St. Louis / Stanford",
    founded: 2000,
    status: "Activo",
    category: "Biomedicina",
    target: "Simulación de dinámicas moleculares de plegamiento de proteínas para estudiar enfermedades como Alzheimer, Parkinson, cáncer y COVID-19.",
    hardware: "CPU multinúcleo / GPU masiva (CUDA/OpenCL)",
    achievements: "En abril de 2020 superó los 2.4 ExaFLOPS durante la investigación de la espícula del SARS-CoV-2, convirtiéndose en el sistema de cómputo más potente de la historia de la humanidad.",
    badge: "🧬 Biomedicina"
  },
  {
    id: "einstein-at-home",
    name: "Einstein@Home",
    institution: "Max Planck Institute for Gravitational Physics / University of Wisconsin-Milwaukee",
    founded: 2005,
    status: "Activo (BOINC)",
    category: "Astrofísica",
    target: "Búsqueda de ondas gravitacionales continuas a partir de datos de los detectores LIGO, Virgo y KAGRA, y búsqueda de púlsares de radio y rayos gamma.",
    hardware: "CPU / GPU de alto rendimiento",
    achievements: "Descubrimiento de más de 80 nuevos púlsares de radio y púlsares de rayos gamma en datos del telescopio espacial Fermi.",
    badge: "🌌 Ondas Gravitacionales"
  },
  {
    id: "rosetta-at-home",
    name: "Rosetta@home",
    institution: "Baker Laboratory, University of Washington",
    founded: 2005,
    status: "Activo (BOINC)",
    category: "Biología Computacional",
    target: "Predicción de estructuras tridimensionales de proteínas y diseño de nuevas macromoléculas terapéuticas mediante el paquete de modelado Rosetta.",
    hardware: "CPU intensivo (x86_64, ARM / Android)",
    achievements: "Diseño de proteínas sintéticas para neutralizar virus y precursores que derivaron en avances premiados como RoseTTAFold.",
    badge: "🔬 Plegamiento Molecular"
  },
  {
    id: "world-community-grid",
    name: "World Community Grid (WCG)",
    institution: "Krembil Research Institute / Iniciado originalmente por IBM",
    founded: 2004,
    status: "Activo (BOINC)",
    category: "Multidisciplinar Humanitario",
    target: "Alojamiento de subproyectos humanitarios: FightAIDS@home, Help Stop TB, OpenPandemics y Mapping Cancer Markers.",
    hardware: "CPU / GPU en proyectos específicos",
    achievements: "Más de mil millones de años de cálculo científico donados; identificación de candidatos a fármacos para el virus Zika y neuroblastoma.",
    badge: "🌍 Salud Global"
  },
  {
    id: "climateprediction-net",
    name: "Climateprediction.net (CPDN)",
    institution: "University of Oxford / Met Office",
    founded: 2003,
    status: "Activo (BOINC)",
    category: "Climatología",
    target: "Simulación de modelos climáticos globales (HadAM, HadCM) a escala decenal y centenaria para cuantificar incertidumbres en el calentamiento global.",
    hardware: "CPU / Alta demanda de RAM y almacenamiento",
    achievements: "Produjo el mayor conjunto de simulaciones de ensamblado climático global jamás computado, cuantificando riesgos de fenómenos meteorológicos extremos.",
    badge: "🌡️ Clima"
  },
  {
    id: "milkyway-at-home",
    name: "MilkyWay@home",
    institution: "Rensselaer Polytechnic Institute (RPI)",
    founded: 2007,
    status: "Activo (BOINC)",
    category: "Astrofísica Galáctica",
    target: "Generación de modelos tridimensionales del halo de la Vía Láctea mediante ajuste probabilístico de corrientes de marea estelares (Sagitario).",
    hardware: "GPU de doble precisión (FP64 recomendada)",
    achievements: "Mapeo detallado de la distribución de materia oscura en el halo galáctico.",
    badge: "✨ Astrofísica Galáctica"
  },
  {
    id: "lhc-at-home",
    name: "LHC@home",
    institution: "CERN (Organización Europea para la Investigación Nuclear)",
    founded: 2004,
    status: "Activo (BOINC + VirtualBox)",
    category: "Física de Partículas",
    target: "Simulación de trayectorias de haces de protones en el Gran Colisionador de Hadrones (SixTrack) y simulaciones de física teórica (Test4Theory / CMS / ATLAS).",
    hardware: "CPU x86_64 con soporte de virtualización VT-x/AMD-V",
    achievements: "Optimización de la estabilidad de la órbita de los haces del LHC y soporte a los análisis de física del bosón de Higgs.",
    badge: "⚛️ Física Nuclear"
  },
  {
    id: "primegrid",
    name: "PrimeGrid",
    institution: "Iniciativa Comunitaria Independiente",
    founded: 2005,
    status: "Activo (BOINC)",
    category: "Matemáticas Puras",
    target: "Búsqueda de números primos gigantescos (primos de Fermat, Cullen, Woodall, Proth y Sierpinski) mediante pruebas de primalidad deterministas.",
    hardware: "CPU / Aceleración extrema por GPU (LLR en CUDA/OpenCL)",
    achievements: "Descubrimiento de múltiples de los mayores números primos conocidos fuera del GIMPS y resolución parcial de la conjetura de Sierpinski.",
    badge: "🔢 Matemáticas"
  },
  {
    id: "gpugrid",
    name: "GPUGrid.net",
    institution: "Universitat Pompeu Fabra (Barcelona Biomedical Research Park)",
    founded: 2007,
    status: "Activo (BOINC)",
    category: "Bioquímica",
    target: "Simulaciones de dinámica molecular de átomo completo (software ACEMD) para investigación farmacológica y biomédica.",
    hardware: "GPU Nvidia CUDA de alta gama",
    achievements: "Primer proyecto de computación voluntaria en ejecutar simulaciones de dinámica molecular a escala de microsegundos íntegramente en GPUs.",
    badge: "💊 Farmacología"
  }
];

export const DIJKSTRA_LAUREATES = [
  {
    year: 2000,
    authors: "Leslie Lamport",
    paper: "Time, Clocks, and the Ordering of Events in a Distributed System (1978)",
    impact: "Introdujo los relojes lógicos, la relación 'happened-before' y sentó la base de la sincronización y la consistencia en sistemas distribuidos."
  },
  {
    year: 2001,
    authors: "Michael J. Fischer, Nancy A. Lynch, Michael S. Paterson",
    paper: "Impossibility of Distributed Consensus with One Unreliable Process (FLP - 1985)",
    impact: "Demostró el célebre teorema FLP: es imposible garantizar consenso determinista en un sistema asíncrono si existe la posibilidad de que falle un solo nodo."
  },
  {
    year: 2003,
    authors: "Maurice Herlihy",
    paper: "Wait-Free Synchronization (1991)",
    impact: "Definió la jerarquía de consenso y las estructuras de datos concurrentes libres de esperas y bloqueos (lock-free y wait-free)."
  },
  {
    year: 2005,
    authors: "Marshall Pease, Robert Shostak, Leslie Lamport",
    paper: "Reaching Agreement in the Presence of Faults / The Byzantine Generals Problem (1980/1982)",
    impact: "Formalizó la tolerancia a fallos bizantinos (BFT), requiriendo 3m + 1 nodos para resistir m nodos con comportamiento arbitrario o malicioso."
  },
  {
    year: 2007,
    authors: "Leslie Lamport",
    paper: "The Part-Time Parliament / Paxos Made Simple (1998/2001)",
    impact: "El estándar dorado de algoritmos de consenso para réplicas activas tolerantes a fallos por colapso (crash faults)."
  },
  {
    year: 2014,
    authors: "Cynthia Dwork, Nancy Lynch, Larry Stockmeyer",
    paper: "Consensus in the presence of partial synchrony (1988)",
    impact: "Definió el modelo de sincronía parcial, puente esencial entre la teoría estricta y los protocolos prácticos de red actuales como Raft y PBFT."
  }
];
