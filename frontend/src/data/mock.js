// Mock data for OTX Solutions IT Support Landing Page

export const companyInfo = {
  name: "OTX Solutions",
  tagline: "Soporte IT, equipamiento y soluciones digitales",
  whatsapp: "5491124021747",
  email: "solutionsotx@gmail.com",
  location: "CABA, Buenos Aires, Argentina"
};

export const services = [
  {
    id: 1,
    title: "Soporte técnico remoto y visitas coordinadas",
    hint: "Resolución en el día para equipos personales y de oficina, a distancia o en el lugar.",
    description: "Atendemos fallas de Windows, Office, correo, impresoras, conectividad y programas de uso diario mediante conexión remota autorizada o visitas técnicas coordinadas a domicilio u oficina, confirmando alcance y presupuesto antes de intervenir.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Mantenimiento, seguridad y respaldo",
    hint: "Equipos ágiles, cuentas protegidas y copias de seguridad configuradas con criterio.",
    description: "Optimizamos el rendimiento de Windows, aplicamos actualizaciones críticas, configuramos copias de seguridad y reforzamos la protección de cuentas y dispositivos de trabajo.",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    title: "Asesoramiento, armado y equipamiento",
    hint: "Selección de notebooks, PC gamer, puestos de oficina, mejoras y reparaciones.",
    description: "Recomendamos qué comprar según uso real y presupuesto. Realizamos armado a medida, ampliación de discos SSD y memoria RAM, equipamiento de oficinas completas y reparaciones sujetas a evaluación previa.",
    icon: "Laptop"
  },
  {
    id: 4,
    title: "Capacitación personalizada",
    hint: "Clases prácticas de Windows, Excel, correo e herramientas digitales a medida.",
    description: "Formación práctica individual o para equipos en Windows, Office, Excel, correo electrónico y herramientas de inteligencia artificial, en modalidad remota o presencial a coordinar.",
    icon: "GraduationCap"
  },
  {
    id: 5,
    title: "Microsoft 365 y organización empresarial",
    hint: "Correo corporativo, archivos compartidos, permisos por área y seguridad.",
    description: "Implementamos y administramos entornos Microsoft 365 (Outlook, Teams, OneDrive, SharePoint), control de accesos y verificación MFA con Microsoft Entra, protección con Defender y administración con Intune según licencias y alcance acordado.",
    icon: "Building2"
  },
  {
    id: 6,
    title: "Optimización de herramientas e integraciones",
    hint: "Análisis de aplicaciones de trabajo, conexión entre sistemas y orden operativo.",
    description: "Relevamos qué herramientas utiliza tu equipo, recomendamos alternativas concretas, las configuramos y conectamos formularios, correo, planillas y notificaciones para evitar carga manual duplicada.",
    icon: "Wrench"
  },
  {
    id: 7,
    title: "Automatización de procesos e IA aplicada",
    hint: "Flujos automáticos y asistentes de inteligencia artificial sobre procesos reales.",
    description: "Evaluamos la viabilidad técnica y operativa de cada proceso para automatizar tareas repetitivas, registrar y clasificar información e integrar asistentes de IA (como Claude o Microsoft Copilot) cuando aportan eficiencia real.",
    icon: "Sparkles"
  },
  {
    id: 8,
    title: "Sitios web y formularios comerciales",
    hint: "Presencia profesional rápida y recepción ordenada de consultas en WhatsApp o correo.",
    description: "Diseñamos y desarrollamos páginas web modernas y formularios comerciales pensados para convertir visitas en consultas claras y ordenadas desde cualquier dispositivo.",
    icon: "Globe"
  }
];

export const planesParticulares = {
  planes: [
    {
      id: 1,
      name: "Asistencia Remota",
      price: "$20.000",
      period: "",
      description:
        "Diagnóstico y resolución remota para un problema puntual en tu PC o notebook.",
      features: [
        "1 asistencia remota",
        "Diagnóstico inicial incluido",
        "Resolución de problemas comunes",
        "1 caso principal con hasta 1 hora de trabajo técnico remoto",
        "Windows, Office, correo, impresoras, programas y configuración general",
        "Recomendación final si requiere reparación física o trabajo avanzado"
      ],
      popular: true
    },
    {
      id: 2,
      name: "Pack 5 Asistencias",
      price: "$90.000",
      period: "",
      description:
        "Para quienes necesitan soporte recurrente sin pagar cada asistencia por separado.",
      features: [
        "5 asistencias remotas",
        "Cada asistencia cubre 1 caso principal de hasta 1 hora",
        "Válido por 3 meses",
        "Ideal para personas, freelancers o profesionales independientes",
        "Ahorrás $10.000 frente a contratarlas por separado"
      ],
      popular: true
    }
  ],
  extras: [
    {
      concepto: "Extensión o trabajo adicional",
      precio: "Se cotiza antes de continuar"
    },
    {
      concepto: "Trabajo fuera de alcance",
      precio: "Se cotiza antes de continuar"
    }
  ]
};

export const planesPymes = {
  planes: [
    {
      id: 1,
      name: "Empresa Inicial",
      price: "$120.000",
      period: "/mes",
      asistencias: "3 asistencias",
      puestos: "Hasta 3 puestos",
      description:
        "Para negocios chicos que necesitan soporte remoto sin contratar técnico fijo.",
      features: [
        "Hasta 3 asistencias remotas por mes",
        "Cobertura para hasta 3 puestos de trabajo",
        "Soporte para Windows, Office, correo, impresoras y configuración general",
        "Atención por WhatsApp para coordinar casos",
        "Diagnóstico de problemas recurrentes",
        "Asistencias no acumulables"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Empresa Operativa",
      price: "$180.000",
      period: "/mes",
      asistencias: "5 asistencias",
      puestos: "Hasta 6 puestos",
      description:
        "Para oficinas o comercios que dependen de sus equipos para trabajar todos los días.",
      features: [
        "Hasta 5 asistencias remotas por mes",
        "Cobertura para hasta 6 puestos de trabajo",
        "Prioridad frente a asistencias sueltas",
        "Revisión básica mensual del estado de los equipos",
        "Soporte sobre Windows, Office, correo, impresoras, aplicaciones y configuración",
        "Recomendaciones de mejora para evitar problemas recurrentes"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Empresa Plus",
      price: "A cotizar",
      period: "",
      asistencias: "A medida",
      puestos: "Más de 6 puestos",
      description:
        "Para empresas con más equipos, usuarios o necesidades técnicas más complejas.",
      features: [
        "Soporte remoto recurrente según alcance",
        "Más de 6 puestos de trabajo",
        "Microsoft 365, correo, usuarios y permisos",
        "Revisión básica de red y entorno de trabajo",
        "Documentación técnica simple",
        "Automatizaciones o mejoras operativas según necesidad"
      ],
      popular: false
    }
  ],
  extras: [
    {
      concepto: "Asistencia adicional con plan activo",
      precio: "$40.000"
    },
    {
      concepto: "Puesto adicional",
      precio: "A cotizar según entorno"
    },
    {
      concepto: "Trabajo fuera de alcance",
      precio: "Se informa y cotiza antes de continuar"
    }
  ]
};

export const planesM365 = [
  {
    id: 1,
    name: "Implementación Inicial",
    price: "Desde $85.000",
    description: "Hasta 10 usuarios. Tenant, dominio, usuarios, MFA y configuración básica.",
    features: [
      "Creación de tenant",
      "Configuración de dominio",
      "Alta de usuarios y licencias",
      "Activación de MFA",
      "Configuración básica de seguridad"
    ]
  },
  {
    id: 2,
    name: "Gestión Mensual",
    price: "Desde $25.000/mes",
    description: "Hasta 10 usuarios. Altas, bajas, soporte básico en Teams/Outlook y gestión MFA.",
    features: [
      "Altas y bajas de usuarios",
      "Gestión de MFA",
      "Soporte básico en Teams y Outlook",
      "Resolución de incidencias comunes"
    ]
  },
  {
    id: 3,
    name: "SharePoint/OneDrive Básico",
    price: "Desde $45.000",
    description: "Estructura inicial, permisos y capacitación básica. Pago único.",
    features: [
      "Diseño de estructura de carpetas",
      "Configuración de permisos",
      "Capacitación básica de uso"
    ]
  }
];

export const howItWorks = [
  {
    step: 1,
    title: "Diagnóstico y relevamiento",
    description: "Relevamos el incidente técnico o la forma en que trabaja tu equipo antes de sugerir herramientas o cambios."
  },
  {
    step: 2,
    title: "Alcance y presupuesto cerrados",
    description: "Definimos modalidad (remota, presencial o proyecto a medida) y confirmamos el costo antes de intervenir."
  },
  {
    step: 3,
    title: "Ejecución y puesta en marcha",
    description: "Resolvemos la asistencia en pantalla, realizamos la visita coordinada o entregamos la solución configurada."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "Criterio antes que moda tecnológica",
    description: "No recomendamos licencias, equipos ni automatizaciones innecesarias: elegimos la solución según el problema real."
  },
  {
    id: 2,
    title: "Alcance confirmado de antemano",
    description: "Cada asistencia, abono o proyecto comienza con un alcance y un presupuesto explícitos, sin cargos imprevistos."
  },
  {
    id: 3,
    title: "Continuidad remota y presencial",
    description: "Resolvemos en el día mediante conexión remota autorizada y coordinamos visitas técnicas cuando el caso requiere presencia."
  },
  {
    id: 4,
    title: "De soporte puntual a procesos integrados",
    description: "Acompañamos tanto la urgencia técnica cotidiana como la organización de herramientas, Microsoft 365 y automatizaciones."
  }
];

export const faqData = [
  {
    id: 1,
    question: "¿Cómo funciona la asistencia remota y qué seguridad tiene?",
    answer:
      "Nos conectamos mediante AnyDesk o TeamViewer únicamente con tu autorización explícita. Ves cada acción en pantalla en tiempo real y, al finalizar la sesión, el acceso queda cerrado."
  },
  {
    id: 2,
    question: "¿Qué cubre la Asistencia Remota de $20.000?",
    answer:
      "Cubre el diagnóstico y la resolución de un caso principal dentro de hasta 1 hora de trabajo técnico remoto (Windows, Office, correo, impresoras, rendimiento o configuración). Si requiere una extensión o intervención física, se informa y cotiza antes de continuar."
  },
  {
    id: 3,
    question: "¿Cuándo conviene una visita técnica presencial y cómo se coordina?",
    answer:
      "Cuando hay que instalar equipos, configurar redes o impresoras en el lugar, o evaluar fallas físicas. Se coordina previamente confirmando disponibilidad, zona, traslado y presupuesto."
  },
  {
    id: 4,
    question: "¿Qué diferencia hay entre los abonos empresariales y los proyectos a medida?",
    answer:
      "Los abonos mensuales cubren el soporte continuo de los puestos de trabajo registrados (por períodos de 30 días, sin acumulación). Las implementaciones de Microsoft 365, sitios web, integraciones o automatizaciones se cotizan por separado con alcance definido."
  },
  {
    id: 5,
    question: "¿Cómo evalúan si un proceso se puede automatizar?",
    answer:
      "Analizamos primero qué herramientas utiliza tu equipo, cómo circula la información y si el volumen o la repetición justifican automatizar. El impacto en tiempos depende de cada proceso y de la compatibilidad entre aplicaciones."
  },
  {
    id: 6,
    question: "¿Cómo trabajan el asesoramiento de compra, armado y mejora de equipos?",
    answer:
      "Definimos el equipamiento según el uso real y el presupuesto disponible: notebooks, PC gamer, puestos de oficina, monitores y periféricos. El armado a medida, las ampliaciones de SSD/RAM y las reparaciones se realizan bajo evaluación previa."
  },
  {
    id: 7,
    question: "¿En qué consiste la capacitación personalizada?",
    answer:
      "Son sesiones prácticas adaptadas a las herramientas concretas que necesita usar una persona o un equipo (Windows, Excel, correo, organización de archivos o inteligencia artificial), sin cursos prearmados, de forma remota o presencial."
  }
];

export const condicionesGenerales =
  "Precios en ARS. Cada asistencia remota cubre un caso principal e incluye hasta 1 hora de trabajo técnico. El tiempo no utilizado no es acumulable ni transferible. Si el caso requiere más tiempo o queda fuera del alcance remoto, se informa y cotiza antes de continuar. No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física ni trabajos presenciales. Los planes mensuales no son acumulables y se cuentan por períodos de 30 días desde la activación.";

export const whatsappMessage = `Hola, quiero consultar a OTX Solutions.%0A%0ANecesito ayuda con: [Soporte remoto / Equipamiento / Web o IA]%0ADetalle breve: [DESCRIBIR CONSULTA]%0A%0AGracias.`;
