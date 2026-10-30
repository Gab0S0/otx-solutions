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
    hint: "Asistencia remota y visitas presenciales coordinadas según disponibilidad para particulares y empresas.",
    description: "Diagnosticamos y resolvemos incidentes en Windows, Office, correo, impresoras, redes y programas de uso diario mediante conexión remota autorizada o visitas técnicas coordinadas a domicilio u oficina, confirmando alcance y presupuesto antes de intervenir.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Mantenimiento, seguridad y respaldo",
    hint: "Optimización del sistema, protección de cuentas y copias de seguridad preventivas.",
    description: "Mejoramos el rendimiento e inicio de Windows, aplicamos actualizaciones críticas, configuramos copias de seguridad y reforzamos la seguridad de cuentas y equipos de trabajo.",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    title: "Equipamiento, armado y oficinas",
    hint: "Selección de notebooks y PC gamer, armado a medida, mejoras de hardware y puestos de oficina.",
    description: "Asesoramos en la compra de notebooks, PC gamer, monitores y periféricos según uso real y presupuesto. Realizamos armado de equipos a medida, ampliaciones de SSD y memoria RAM, equipamiento de oficinas y reparaciones sujetas a evaluación previa.",
    icon: "Laptop"
  },
  {
    id: 4,
    title: "Asesoramiento tecnológico y productividad",
    hint: "Selección y configuración de herramientas, organización de información y aprendizaje aplicado.",
    description: "Recomendamos, configuramos e integramos las herramientas adecuadas para cada actividad, mejoramos métodos de trabajo y estudio, organizamos información y acompañamos en el uso práctico de aplicaciones (Windows, Excel, correo e IA) cuando sea necesario.",
    icon: "GraduationCap"
  },
  {
    id: 5,
    title: "Microsoft 365 y soluciones empresariales",
    hint: "Correo corporativo, archivos compartidos, permisos por área y administración de seguridad.",
    description: "Implementamos y gestionamos entornos Microsoft 365 (Outlook, Teams, OneDrive, SharePoint), control de accesos y verificación MFA con Microsoft Entra, protección con Defender y administración con Intune según licencias y alcance acordado.",
    icon: "Building2"
  },
  {
    id: 6,
    title: "Optimización de procesos e integraciones",
    hint: "Análisis de herramientas de trabajo y conexión entre formularios, correo y planillas.",
    description: "Relevamos qué aplicaciones utiliza tu equipo, recomendamos alternativas concretas, las configuramos e integramos para evitar tareas duplicadas y ordenar el flujo de información.",
    icon: "Wrench"
  },
  {
    id: 7,
    title: "Automatizaciones e inteligencia artificial",
    hint: "Flujos automáticos y asistentes de IA mediante proyectos a medida según viabilidad.",
    description: "Evaluamos cada proceso para automatizar registros, clasificaciones y avisos repetitivos, e integramos asistentes y herramientas de inteligencia artificial (como Claude o Microsoft Copilot) adaptados a la operatoria real de tu negocio.",
    icon: "Sparkles"
  },
  {
    id: 8,
    title: "Desarrollo web y formularios comerciales",
    hint: "Páginas web profesionales y formularios conectados con tus canales de atención.",
    description: "Diseñamos y desarrollamos sitios web modernos, rápidos y claros en escritorio y móvil, con formularios integrados a WhatsApp, correo electrónico o tickets.",
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
    title: "Relevamiento del caso",
    description: "Analizamos el incidente técnico, el equipamiento requerido o el proceso de trabajo que buscás mejorar."
  },
  {
    step: 2,
    title: "Alcance y presupuesto previos",
    description: "Definimos la modalidad (remota, visita coordinada o proyecto a medida) y confirmamos el costo antes de avanzar."
  },
  {
    step: 3,
    title: "Ejecución ordenada",
    description: "Intervenimos con tu autorización remota, asistimos en el lugar según disponibilidad o implementamos el proyecto acordado."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "Primero el problema, después la herramienta",
    description: "No vendemos tecnología por moda: evaluamos cómo trabajás para recomendar únicamente lo que aporta eficiencia real."
  },
  {
    id: 2,
    title: "Alcance y costos confirmados de antemano",
    description: "Sabés qué incluye cada asistencia, abono o proyecto antes de empezar. Cualquier extensión o tarea adicional se consulta primero."
  },
  {
    id: 3,
    title: "Asistencia remota y visitas coordinadas",
    description: "Resolvemos problemas de software y configuración a distancia con tu permiso, y coordinamos visitas técnicas según disponibilidad y zona."
  },
  {
    id: 4,
    title: "Continuidad técnica y mejora de procesos",
    description: "Un mismo criterio profesional para mantener tus equipos operativos, organizar Microsoft 365 o automatizar tareas repetitivas."
  }
];

export const faqData = [
  {
    id: 1,
    question: "¿Cómo funciona la asistencia remota y qué seguridad tiene?",
    answer:
      "Coordinamos la conexión mediante AnyDesk o TeamViewer y accedemos únicamente con tu autorización. Ves todo el procedimiento en pantalla y, al finalizar la sesión, el vínculo se cierra."
  },
  {
    id: 2,
    question: "¿Qué incluye la Asistencia Remota de $20.000?",
    answer:
      "Incluye el diagnóstico y la resolución de un caso principal con hasta 1 hora de trabajo técnico remoto (Windows, Office, correo, impresoras, rendimiento o configuración). Si requiere más tiempo o revisión física, se informa y cotiza antes de continuar."
  },
  {
    id: 3,
    question: "¿Cómo se coordinan las visitas técnicas presenciales?",
    answer:
      "Cuando el caso requiere instalar equipos, configurar redes o impresoras en el lugar, o evaluar hardware, coordinamos una visita a domicilio u oficina confirmando previamente disponibilidad, zona, traslado y presupuesto."
  },
  {
    id: 4,
    question: "¿En qué consiste el asesoramiento tecnológico y de productividad?",
    answer:
      "Analizamos qué herramientas utilizás para trabajar o estudiar, recomendamos alternativas, las configuramos, organizamos la información y enseñamos el uso práctico de las aplicaciones (como Excel, Windows, correo o IA) según tu necesidad."
  },
  {
    id: 5,
    question: "¿Cómo evalúan las automatizaciones e integraciones con IA?",
    answer:
      "Relevamos el proceso actual para verificar su viabilidad técnica y operativa. El ahorro de tiempo depende de cada flujo de trabajo; por eso definimos un alcance concreto y un presupuesto cerrado antes de desarrollar."
  },
  {
    id: 6,
    question: "¿Cómo trabajan la selección de equipos, el armado y las reparaciones?",
    answer:
      "Elaboramos presupuestos según tu uso real para notebooks, PC gamer, oficinas completas, monitores y periféricos. El armado a medida, las mejoras de SSD/RAM y las reparaciones se realizan bajo evaluación previa."
  },
  {
    id: 7,
    question: "¿Qué diferencia hay entre los abonos empresariales y los proyectos a medida?",
    answer:
      "Los abonos mensuales cubren asistencias remotas para los puestos registrados del negocio (por períodos de 30 días, no acumulables). Las implementaciones de Microsoft 365, páginas web o automatizaciones se cotizan como proyectos independientes."
  }
];

export const condicionesGenerales =
  "Precios en ARS. Cada asistencia remota cubre un caso principal e incluye hasta 1 hora de trabajo técnico. El tiempo no utilizado no es acumulable ni transferible. Si el caso requiere más tiempo o queda fuera del alcance remoto, se informa y cotiza antes de continuar. No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física ni trabajos presenciales. Los planes mensuales no son acumulables y se cuentan por períodos de 30 días desde la activación.";

export const whatsappMessage = `Hola, quiero consultar a OTX Solutions.%0A%0ANecesito ayuda con: [Soporte remoto / Equipamiento / Web o IA]%0ADetalle breve: [DESCRIBIR CONSULTA]%0A%0AGracias.`;
