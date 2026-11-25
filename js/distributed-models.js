// distributed-models.js - Atlas de los 25 Modelos y Conceptos Fundamentales de Computación Distribuida
export const DISTRIBUTED_MODELS = [
  {
    id: "actor-model",
    name: "Actor Model (Modelo de Actores)",
    category: "Concurrencia & Mensajería",
    icon: "🎭",
    summary: "Paradigma donde primitivas aisladas ('actores') reaccionan a mensajes recibidos creando más actores, enviando mensajes o cambiando su estado interno sin memoria compartida.",
    details: "Propuesto por Carl Hewitt, Peter Bishop y Richard Steiger en 1973. Evita bloqueos (locks) y carreras de datos (data races) mediante paso asíncrono de mensajes. Clave en plataformas masivas y sistemas resilientes como Erlang/OTP, Akka y clústeres modernos.",
    formula: "Message(a_target, payload) \\rightarrow \\Delta State + \\{new\\_actors\\} + \\{out\\_messages\\}",
    tags: ["Hewitt", "Erlang", "Akka", "Sin Memoria Compartida"]
  },
  {
    id: "code-mobility",
    name: "Code Mobility (Movilidad de Código)",
    category: "Arquitectura & Agentes",
    icon: "📦",
    summary: "Capacidad de un sistema distribuido para transferir código ejecutable dinámicamente entre nodos remotos para ejecutarlo donde residen los datos.",
    details: "Clasificado en: Code on Demand (el cliente descarga código, como applets/scripts de BOINC), Remote Evaluation (el cliente envía código al servidor) y Mobile Agents (código + estado de ejecución migran autónomamente). BOINC aprovecha 'Code on Demand' entregando binarios de ciencia por plataforma (x86_64, ARM, Apple Silicon).",
    formula: "Latency_{data} \\gg Latency_{code} \\implies \\text{Mover Código a los Datos}",
    tags: ["Mobile Agents", "Code on Demand", "BOINC Core Client"]
  },
  {
    id: "dataflow-programming",
    name: "Dataflow Programming",
    category: "Flujos de Datos",
    icon: "🌊",
    summary: "Modelo conceptual donde la ejecución se modela como un grafo dirigido donde los nodos son operaciones y los enlaces son canales de flujo de datos.",
    details: "Las operaciones se disparan automáticamente en cuanto todos sus operandos de entrada están disponibles, posibilitando concurrencia implícita masiva a nivel de hardware o pipeline distribuido (ej. Apache Flink, TensorFlow Graphs, pipelines de reducción científica).",
    formula: "Node_i \\text{ executes iff } \\forall e \\in InEdges(Node_i), \\text{token}(e) = \\text{ready}",
    tags: ["Grafos DAG", "Pipelines", "Procesamiento Asíncrono"]
  },
  {
    id: "decentralized-computing",
    name: "Decentralized Computing",
    category: "Topología & Gobernanza",
    icon: "🌐",
    summary: "Distribución del hardware y toma de decisiones a través de múltiples partes interesadas sin un punto único de fallo o autoridad central.",
    details: "A diferencia de los sistemas centralizados o simplemente distribuidos bajo un único administrador corporativo, la computación descentralizada distribuye la propiedad, la confianza y el control entre participantes independientes (P2P, BitTorrent, redes de consenso).",
    formula: "Centrality_{max}(G) \\rightarrow 0 \\implies Resiliencia \\rightarrow 1",
    tags: ["P2P", "Tolerancia a Particiones", "Autonomía"]
  },
  {
    id: "distributed-algorithms",
    name: "Distributed Algorithms (Algoritmos Distribuidos)",
    category: "Algoritmia & Consenso",
    icon: "⚙️",
    summary: "Algoritmos diseñados para ejecutarse sobre hardware interconectado donde los procesos tienen memoria desacoplada y se comunican exclusivamente por paso de mensajes con retardos arbitrarios.",
    details: "Abarcan problemas de elección de líder (Bully, Chang-Roberts), exclusión mutua distribuida (Ricart-Agrawala, Maekawa), relojes lógicos (Lamport, Vector Clocks) y consenso tolerante a fallos (Paxos, Raft, PBFT).",
    formula: "a \\prec b \\iff C(a) < C(b) \\quad \\text{(Relojes de Lamport)}",
    tags: ["Lamport", "Raft", "Paxos", "Exclusión Mutua"]
  },
  {
    id: "damd",
    name: "DAMD (Distributed Asynchronous Multiple Data)",
    category: "Taxonomía de Cómputo",
    icon: "⚡",
    summary: "Extensión avanzada de la taxonomía de Flynn para clústeres heterogéneos donde múltiples procesadores independientes ejecutan instrucciones asíncronas sobre flujos de datos dispares.",
    details: "Describe con precisión el funcionamiento de la computación voluntaria (BOINC), donde nodos domésticos con arquitecturas disímiles (Intel Core, AMD Ryzen, Apple M-series, Nvidia RTX) computan partes de un dataset global a su propio ritmo sin sincronización rígida de ciclo de reloj.",
    formula: "\\text{Throughput} = \\sum_{i=1}^N \\frac{W_i}{T_{latency, i} + T_{compute, i}}",
    tags: ["Flynn", "Heterogeneidad", "Computación Asíncrona"]
  },
  {
    id: "distributed-cache",
    name: "Distributed Cache (Caché Distribuida)",
    category: "Almacenamiento & Memoria",
    icon: "🗄️",
    summary: "Capa de memoria volátil agrupada a través de múltiples nodos servidores para acelerar el acceso a datos compartidos y reducir la carga de persistencia en disco.",
    details: "Implementa técnicas de particionado como Consistent Hashing (Hashing Consistente) para minimizar la redistribución de claves cuando entran o salen nodos del anillo (ej. Memcached, Redis Cluster, Hazelcast, bases NoSQL en memoria).",
    formula: "\\text{Node}(Key) = \\arg\\min_{n \\in Ring} \\{Hash(n) \\ge Hash(Key)\\}",
    tags: ["Consistent Hashing", "Redis", "In-Memory", "Baja Latencia"]
  },
  {
    id: "distributed-networking",
    name: "Distributed Networking",
    category: "Redes & Comunicaciones",
    icon: "🕸️",
    summary: "Infraestructura de red donde las decisiones de enrutamiento, conmutación y topología se realizan de forma colaborativa entre los propios nodos.",
    details: "Inspirada en el memorándum pionero de Paul Baran (RAND Corporation, 1964) que dio origen a la conmutación de paquetes e Internet. Si un nodo cae, la red calcula rutas alternativas en tiempo real sin requerir una central de conmutación única.",
    formula: "K_{conectividad}(G) \\ge k \\implies \\text{Sobrevive a la pérdida de } k-1 \\text{ enlaces}",
    tags: ["Paul Baran", "Packet Switching", "Topología Mesh"]
  },
  {
    id: "distributed-os",
    name: "Distributed Operating System (DOS / Sistema Operativo Distribuido)",
    category: "Sistemas & Virtualización",
    icon: "🖥️",
    summary: "Sistema operativo que gestiona un grupo de computadoras independientes y las hace aparecer ante los usuarios como una única computadora integrada (Single System Image).",
    details: "Pioneros como Amoeba (Andrew Tanenbaum), Sprite, Plan 9 de Bell Labs y Locust. Ofrecen transparencia de ubicación, de migración de procesos, de concurrencia y de replicación de archivos sin que el desarrollador gestione direcciones IP individuales.",
    formula: "SSI \\equiv \\text{Single System Image} = \\bigcup_{i=1}^n \\text{Node}_i \\text{ visto como 1 CPU/FS}",
    tags: ["Amoeba", "Tanenbaum", "Plan 9", "Transparencia SSI"]
  },
  {
    id: "eventual-consistency",
    name: "Eventual Consistency (Consistencia Eventual)",
    category: "Almacenamiento & Consenso",
    icon: "⏳",
    summary: "Garantía de consistencia débil en sistemas de datos distribuidos: si no se realizan nuevas actualizaciones sobre un ítem, todos los accesos convergerán eventualmente al mismo valor.",
    details: "Pilar de las bases de datos NoSQL basadas en el Teorema CAP (priorizando Disponibilidad y Tolerancia a Particiones — AP) y el modelo BASE (Basically Available, Soft state, Eventual consistency). Implementado mediante gossip protocols, CRDTs y Vector Clocks.",
    formula: "\\lim_{t \\to \\infty} P(State_A(t) = State_B(t)) = 1 \\quad \\text{si } \\Delta Ops = \\emptyset",
    tags: ["CAP Theorem", "BASE", "DynamoDB", "CRDTs"]
  },
  {
    id: "dijkstra-prize",
    name: "Premio Edsger W. Dijkstra en Computación Distribuida",
    category: "Historia & Teoría",
    icon: "🏆",
    summary: "El galardón más prestigioso otorgado conjuntamente por ACM y EATCS (en PODC y DISC) a trabajos científicos sobresalientes con impacto duradero de al menos 10 años en sistemas distribuidos.",
    details: "Nombrado en honor a Edsger W. Dijkstra, pionero de la auto-estabilización y la exclusión mutua. Galardonados ilustres: Leslie Lamport (Relojes lógicos y Paxos), Michael Fischer, Nancy Lynch y Michael Paterson (Imposibilidad FLP), Maurice Herlihy (Wait-Free Synchronization).",
    formula: "\\text{Premio PODC/DISC} \\implies \\text{Reconocimiento de impacto } \\ge 10 \\text{ años}",
    tags: ["Dijkstra", "Leslie Lamport", "Nancy Lynch", "FLP Impossibility"]
  },
  {
    id: "federation",
    name: "Federation (Sistemas Federados)",
    category: "Topología & Gobernanza",
    icon: "🏛️",
    summary: "Agrupación de dominios administrativos o servidores independientes que acuerdan cooperar mediante protocolos y estándares comunes sin ceder el control interno de sus recursos.",
    details: "Casos emblemáticos: Correo electrónico (SMTP/IMAP), el Fediverso (ActivityPub / Mastodon), Matrix y la Federación de Identidades (SAML, OpenID Connect). En computación científica, mallas federadas permiten compartir tiempo de cálculo entre universidades europeas y norteamericanas.",
    formula: "\\mathcal{F} = \\{D_1, D_2, \\dots, D_n\\} \\quad \\text{con interoperabilidad vía } \\mathcal{P}_{standard}",
    tags: ["ActivityPub", "OpenID", "Interoperabilidad", "Dominios Autónomos"]
  },
  {
    id: "flat-neighborhood-network",
    name: "Flat Neighborhood Network (FNN)",
    category: "Redes & Interconexión",
    icon: "📐",
    summary: "Topología de interconexión para clústeres de supercomputación donde cada procesador tiene interfaces directas con múltiples redes independientes conmutadas sin pasar por enrutadores multinivel.",
    details: "Desarrollada por Hank Dietz en la Universidad de Kentucky para maximizar el ancho de banda biseccional y minimizar la latencia en clústeres 'Beowulf' construidos con switches Ethernet comerciales para cómputo masivo científico paralelo.",
    formula: "\\text{Bisection Bandwidth}_{FNN} \\gg \\text{Tree Bisection} \\quad \\text{a coste estándar commodity}",
    tags: ["Beowulf", "Hank Dietz", "Baja Latencia", "Conmutación Directa"]
  },
  {
    id: "fog-computing",
    name: "Fog Computing (Computación en la Niebla)",
    category: "Arquitectura & Edge",
    icon: "🌫️",
    summary: "Arquitectura horizontal de nivel intermedio que distribuye cómputo, almacenamiento, control y red entre los dispositivos finales de IoT y los centros de datos en la nube central.",
    details: "Acuñado originalmente por Cisco Systems. A diferencia del Cloud Computing tradicional (que centraliza todo a miles de kilómetros), la niebla sitúa pasarelas inteligentes y nodos de borde cerca del usuario, reduciendo el tráfico de enlace troncal y la latencia a milisegundos críticos.",
    formula: "\\text{Latencia}_{Fog} \\sim 5-20\\text{ms} \\ll \\text{Latencia}_{Cloud} \\sim 150-300\\text{ms}",
    tags: ["Cisco", "IoT", "Edge Gateways", "Latencia Crítica"]
  },
  {
    id: "grid-computing",
    name: "Grid Computing (Computación en Malla)",
    category: "Supercomputación & Infraestructura",
    icon: "🌐",
    summary: "Infraestructura que integra y coordina recursos heterogéneos, geográficamente dispersos y pertenecientes a múltiples organizaciones para resolver grandes desafíos científicos.",
    details: "Formalizado por Ian Foster y Carl Kesselman ('The Grid: Blueprint for a New Computing Infrastructure', 1999). Utiliza middleware estandarizado (Globus Toolkit) para autenticación por certificados X.509 y colas compartidas (WLCG del CERN para procesar datos del LHC).",
    formula: "\\text{Grid} = \\text{Virtual Organization (VO)} + \\text{Shared Instruments/Compute}",
    tags: ["Ian Foster", "Globus", "CERN WLCG", "VOs"]
  },
  {
    id: "internet-gis",
    name: "Internet GIS (Sistemas de Información Geográfica Distribuidos)",
    category: "Datos Espaciales",
    icon: "🗺️",
    summary: "Marco de computación distribuida para capturar, almacenar, analizar, visualizar y compartir datos geoespaciales a través de Internet mediante servicios OGC interoperables.",
    details: "Emplea arquitecturas distribuidas n-tier para servir mapas mediante mosaicos piramidales (Tile Map Services), análisis espacial en clúster y estándares como WMS, WFS y GeoJSON sobre infraestructuras globales.",
    formula: "\\text{Tile}(z, x, y) = \\text{Crop}(\\text{MapData}, 2^z, 2^z)",
    tags: ["OGC", "WMS/WFS", "Geospatial", "MapTiling"]
  },
  {
    id: "jungle-computing",
    name: "Jungle Computing (Computación en la Jungla)",
    category: "Heterogeneidad Extrema",
    icon: "🌴",
    summary: "Paradigma de computación de alto rendimiento que aprovecha simultáneamente la combinación desordenada y heterogénea de clústeres, Grids, nubes comerciales, supercomputadores y nodos de escritorio.",
    details: "Investigado por Henri Bal y Jason Maassen en la Vrije Universiteit Amsterdam (proyecto Ibis). Resuelve la fricción operativa de orquestar simultáneamente nodos locales, instancias de Amazon EC2, superordenadores MPI y tarjetas gráficas dispersas.",
    formula: "\\text{Jungle} = \\text{Grids} \\cup \\text{Clouds} \\cup \\text{HPC Clusters} \\cup \\text{Desktop Nodes}",
    tags: ["Henri Bal", "Ibis Framework", "Heterogeneidad Extrema"]
  },
  {
    id: "layered-queueing-network",
    name: "Layered Queueing Network (LQN - Red de Colas Estratificadas)",
    category: "Modelado de Rendimiento",
    icon: "📊",
    summary: "Modelo analítico extendido para evaluar el rendimiento de sistemas distribuidos cliente-servidor donde un servidor puede a su vez bloquearse actuando como cliente de otros servidores.",
    details: "Supera las limitaciones de las redes de colas de Jackson o BCMP clásicas, permitiendo calcular cuellos de botella por anidamiento de llamadas RPC/HTTP síncronas, agotamiento de hilos y tiempos de respuesta en cascada.",
    formula: "R_s = S_s + \\sum_{d \\in Calls(s)} y_{s,d} \\cdot R_d + \\text{Tiempos de Espera en Colas}",
    tags: ["Woodside", "Cuellos de Botella", "Modelado Analítico"]
  },
  {
    id: "loa",
    name: "Library Oriented Architecture (LOA)",
    category: "Arquitectura de Software",
    icon: "📚",
    summary: "Patrón arquitectónico donde la lógica de negocio y las capacidades funcionales se encapsulan en librerías desacopladas, testeables y altamente portables antes de ser expuestas a capas de red.",
    details: "Promueve que los componentes del sistema distribuido conserven pureza funcional y puedan ejecutarse en local, dentro de un worker de BOINC en C++, en un microservicio o dentro del navegador mediante WebAssembly sin depender del protocolo de transporte.",
    formula: "\\text{Lógica Pura (Library)} \\perp \\text{Transporte de Red (HTTP/RPC/IPC)}",
    tags: ["Clean Architecture", "Modularidad", "Reutilización"]
  },
  {
    id: "podc-disc",
    name: "Conferencias PODC y DISC",
    category: "Historia & Teoría",
    icon: "🎓",
    summary: "Las dos cumbres académicas internacionales por excelencia en la teoría y principios de la computación distribuida.",
    details: "ACM PODC (Symposium on Principles of Distributed Computing, fundado en 1982) y EATCS DISC (International Symposium on Distributed Computing). En estas conferencias se publicaron los teoremas seminales de Paxos, Byzantine Fault Tolerance, Self-Stabilization y Causal Consistency.",
    formula: "\\text{PODC (ACM, América)} \\parallel \\text{DISC (EATCS, Europa)}",
    tags: ["ACM", "EATCS", "Seminarios Fundacionales", "Investigación"]
  },
  {
    id: "volunteer-computing",
    name: "Volunteer Computing (Computación Voluntaria)",
    category: "Cómputo Masivo Ciudadano",
    icon: "🤝",
    summary: "Tipo de computación distribuida en la que ciudadanos donan tiempo de procesamiento inactivo y potencia de cálculo de sus computadoras y GPUs personales a proyectos de investigación científica.",
    details: "Iniciada por GIMPS (1996) y popularizada a escala global por SETI@home (1999) y Folding@home (2000). David Anderson formalizó la infraestructura creando BOINC en UC Berkeley (2002) para unificar la gestión de proyectos de astrofísica, biología molecular, climatología y matemáticas.",
    formula: "\\text{Potencia Global} = \\sum_{u=1}^M \\text{Donación}_{idle}(PC_u, GPU_u) \\sim \\text{PetaFLOPS}",
    tags: ["David Anderson", "BOINC", "SETI@home", "Ciencia Ciudadana"]
  },
  {
    id: "model-checking",
    name: "Distributed Model Checking (Verificación de Modelos)",
    category: "Calidad & Verificación Formal",
    icon: "🔍",
    summary: "Técnica de verificación formal automatizada que explora exhaustivamente el espacio de estados de un sistema distribuido para demostrar que cumple sus especificaciones de seguridad y liveness.",
    details: "Para combatir la explosión combinatoria de estados ($2^{variables}$), la verificación distribuida particiona el grafo de estados a través de decenas de máquinas en red usando hashing de estados (ej. Spin distribuido, Murphi, TLA+ de Leslie Lamport).",
    formula: "\\mathcal{M} \\models \\phi \\iff \\forall s \\in \\text{ReachableStates}, s \\text{ satisface invariantes de seguridad}",
    tags: ["TLA+", "Leslie Lamport", "Seguridad Formal", "Liveness"]
  },
  {
    id: "pdp",
    name: "Parallel Distributed Processing (PDP / Conexionismo)",
    category: "Redes Neuronales & IA",
    icon: "🧠",
    summary: "Marco conceptual cognitivo y computacional de Rumelhart y McClelland (1986) que modela la inteligencia como la activación cooperativa de unidades simples densamente interconectadas en paralelo.",
    details: "Sentó las bases del conexionismo moderno y del aprendizaje profundo distribuido (Distributed Deep Learning), donde capas neuronales, tensores y gradientes se dividen en clústeres de GPUs (Data Parallelism, Pipeline Parallelism y Tensor Parallelism).",
    formula: "a_i(t+1) = f\\left( \\sum_j w_{ij} \\cdot a_j(t) - \\theta_i \\right)",
    tags: ["Rumelhart & McClelland", "Conexionismo", "Deep Learning Distribuido"]
  },
  {
    id: "parallel-programming-models",
    name: "Parallel Programming Models (MPI, OpenMP, MapReduce)",
    category: "Programación Paralela",
    icon: "🔀",
    summary: "Abstracciones de programación que permiten expresar la ejecución simultánea de instrucciones sobre memoria compartida, memoria distribuida o almacenamiento masivo.",
    details: "MPI (Message Passing Interface) domina los supercomputadores HPC sin memoria compartida; OpenMP aprovecha múltiples núcleos y sockets compartidos; MapReduce/Spark procesan terabytes desacoplando operaciones de mapeo y reducción sobre sistemas de archivos distribuidos (HDFS).",
    formula: "\\text{Speedup} = \\frac{1}{(1-P) + \\frac{P}{N}} \\quad \\text{(Ley de Amdahl)}",
    tags: ["MPI", "OpenMP", "MapReduce", "Amdahl"]
  },
  {
    id: "shared-nothing",
    name: "Shared-Nothing Architecture (Arquitectura sin Recursos Compartidos)",
    category: "Arquitectura & Escalabilidad",
    icon: "🧩",
    summary: "Arquitectura distribuida donde cada nodo es completamente independiente y autosuficiente; no hay memoria compartida (RAM) ni almacenamiento en disco compartido entre las máquinas.",
    details: "Elimina los cuellos de botella de contención de bus o bloqueo de disco comunes en SMP (Symmetric Multiprocessing) o clústeres SAN/NAS. Si un nodo falla o se añade uno nuevo, el impacto sobre el resto es lineal y determinista. Es la base arquitectónica exacta de BOINC, Cassandra y Hadoop.",
    formula: "\\text{Throughput}(N) \\propto N \\cdot \\text{Throughput}_{nodo} \\quad \\text{(Escalabilidad Lineal)}",
    tags: ["Michael Stonebraker", "Escalabilidad Lineal", "Sin Contención", "Base de BOINC"]
  }
];
