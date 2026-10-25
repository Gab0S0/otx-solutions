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
    title: "Soporte Técnico Remoto",
    description: "Nos conectamos a tu equipo con tu autorización para diagnosticar y resolver incidentes en Windows, Office, correo, impresoras, conectividad y aplicaciones de uso diario.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Seguridad y optimización",
    description: "Revisamos lentitud, arranque del sistema, programas innecesarios, actualizaciones, copias de seguridad básicas y protección preventiva para mantener tus equipos ágiles.",
    icon: "Sparkles"
  },
  {
    id: 3,
    title: "Asesoramiento y equipamiento",
    description: "Seleccionamos notebooks, PC gamer, computadoras para oficinas completas, monitores y periféricos. Armamos presupuestos integrales según tu uso real e inversión.",
    icon: "Lightbulb"
  },
  {
    id: 4,
    title: "Armado y reparación",
    description: "Ensamblado de equipos a medida, mejoras de almacenamiento o memoria (SSD y RAM) y reparación de hardware sujetos a evaluación y diagnóstico previo.",
    icon: "Settings"
  },
  {
    id: 5,
    title: "Microsoft 365",
    description: "Implementamos y gestionamos cuentas corporativas, dominios, licencias, seguridad MFA y herramientas colaborativas en Outlook, Teams, OneDrive y SharePoint.",
    icon: "Cloud"
  },
  {
    id: 6,
    title: "Web y formularios",
    description: "Diseñamos y desarrollamos páginas web profesionales, sitios comerciales y formularios optimizados para móvil con derivación a WhatsApp, correo o tickets.",
    icon: "Globe"
  },
  {
    id: 7,
    title: "Automatizaciones e IA",
    description: "Proyectos a medida para automatizar tareas operativas, integrar formularios con planillas o notificaciones e implementar asistentes con inteligencia artificial.",
    icon: "Cpu"
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
    title: "Escribinos",
    description: "Contanos por WhatsApp o formulario qué necesitás resolver o cotizar."
  },
  {
    step: 2,
    title: "Definimos el alcance",
    description: "Confirmamos diagnóstico, modalidad y presupuesto antes de empezar."
  },
  {
    step: 3,
    title: "Resolvemos",
    description: "Nos conectamos con tu autorización o desarrollamos el proyecto acordado."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "Alcance confirmado antes de empezar",
    description: "Informamos qué incluye cada asistencia o presupuesto de antemano. Si requiere más tiempo o evaluación adicional, se consulta antes de avanzar."
  },
  {
    id: 2,
    title: "Conexión remota autorizada",
    description: "Intervenimos en pantalla únicamente con tu permiso para resolver problemas cotidianos sin trasladar tus equipos."
  },
  {
    id: 3,
    title: "Criterio real en equipamiento",
    description: "Asesoramos en compra, armado y mejora de notebooks, PC gamer y puestos de oficina según el uso real."
  },
  {
    id: 4,
    title: "Soluciones web e IA a medida",
    description: "Desarrollamos sitios comerciales, formularios y automatizaciones pensadas para simplificar tu trabajo diario."
  }
];

export const faqData = [
  {
    id: 1,
    question: "¿Cómo funciona el soporte remoto y es seguro?",
    answer:
      "Coordinamos la sesión mediante AnyDesk o TeamViewer y nos conectamos únicamente con tu autorización. Ves todo el trabajo en pantalla y, al finalizar, el acceso se cierra."
  },
  {
    id: 2,
    question: "¿Qué incluye una asistencia remota y cuánto dura?",
    answer:
      "Cubre el diagnóstico y la resolución de un caso principal dentro de hasta 1 hora de trabajo técnico remoto: Windows, Office, correo, impresoras, lentitud o configuración general."
  },
  {
    id: 3,
    question: "¿Qué pasa si el problema requiere más tiempo o evaluación física?",
    answer:
      "Si el caso excede la hora o requiere intervención de hardware, te informamos el diagnóstico y cotizamos la extensión o reparación antes de continuar. Nunca aplicamos cargos sin aviso previo."
  },
  {
    id: 4,
    question: "¿Cómo funcionan los planes mensuales para empresas?",
    answer:
      "Incluyen una cantidad mensual de asistencias remotas para puestos de trabajo registrados al contratar. Se cuentan por períodos de 30 días y las asistencias no utilizadas no se acumulan."
  },
  {
    id: 5,
    question: "¿Cómo trabajan el asesoramiento, armado y reparación de equipos?",
    answer:
      "Armamos presupuestos completos para compra de notebooks, PC gamer, oficinas, monitores y periféricos. El ensamblado a medida, mejoras de SSD/RAM y reparaciones se realizan según evaluación previa."
  },
  {
    id: 6,
    question: "¿Cómo se cotizan las páginas web, formularios y automatizaciones con IA?",
    answer:
      "Se desarrollan como proyectos a medida. Relevamos tu necesidad, definimos el alcance concreto y entregamos un presupuesto cerrado antes de iniciar."
  },
  {
    id: 7,
    question: "¿Qué incluye el servicio de Microsoft 365?",
    answer:
      "Abarca implementación inicial, dominio, alta de usuarios, seguridad MFA, Outlook, Teams, OneDrive y SharePoint básico. Las licencias de Microsoft se abonan por separado."
  }
];

export const condicionesGenerales =
  "Precios en ARS. Cada asistencia remota cubre un caso principal e incluye hasta 1 hora de trabajo técnico. El tiempo no utilizado no es acumulable ni transferible. Si el caso requiere más tiempo o queda fuera del alcance remoto, se informa y cotiza antes de continuar. No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física ni trabajos presenciales. Los planes mensuales no son acumulables y se cuentan por períodos de 30 días desde la activación.";

export const whatsappMessage = `Hola, quiero consultar a OTX Solutions.%0A%0ANecesito ayuda con: [Soporte remoto / Equipamiento / Web o IA]%0ADetalle breve: [DESCRIBIR CONSULTA]%0A%0AGracias.`;
