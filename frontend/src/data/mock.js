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
    description: "Atención remota para particulares y empresas. Nos conectamos a tu equipo con tu autorización para diagnosticar y resolver incidentes en Windows, Office, correo, impresoras, conectividad y aplicaciones de uso diario.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Seguridad Informática, Optimización y Mantenimiento",
    description: "Revisamos lentitud, configuración de inicio, programas innecesarios, actualizaciones, respaldos básicos y prácticas de seguridad informática para mantener tus equipos ágiles y protegidos.",
    icon: "Sparkles"
  },
  {
    id: 3,
    title: "Asesoramiento Tecnológico y Presupuestos",
    description: "Te ayudamos a elegir notebooks, PC gamer, computadoras para oficinas, monitores y periféricos. Elaboramos presupuestos completos según el uso real y la inversión disponible.",
    icon: "Lightbulb"
  },
  {
    id: 4,
    title: "Armado, Actualización y Reparación de Equipos",
    description: "Armado de equipos a medida, ampliación de almacenamiento o memoria (SSD y RAM) y reparación de computadoras sujetas a evaluación y diagnóstico previo.",
    icon: "Settings"
  },
  {
    id: 5,
    title: "Microsoft 365 para Empresas",
    description: "Implementamos y gestionamos entornos Microsoft 365 para mejorar correo corporativo, administración de usuarios, seguridad MFA y colaboración en Teams, OneDrive y SharePoint.",
    icon: "Cloud"
  },
  {
    id: 6,
    title: "Desarrollo de Páginas Web y Formularios",
    description: "Diseño y desarrollo de páginas web profesionales, sitios institucionales, landing pages y formularios integrados para captar consultas, presupuestos o tickets de atención.",
    icon: "Globe"
  },
  {
    id: 7,
    title: "Automatizaciones, Asistentes e Integraciones con IA",
    description: "Proyectos a medida para automatizar tareas operativas, conectar formularios con planillas o canales de notificación e implementar asistentes e integraciones con inteligencia artificial.",
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
    title: "Consultanos tu caso",
    description: "Escribinos por WhatsApp o abrí un ticket indicando si necesitás soporte remoto, asesoramiento en equipos o un proyecto a medida."
  },
  {
    step: 2,
    title: "Confirmamos alcance y modalidad",
    description: "Evaluamos el requerimiento, definimos los pasos a seguir y te informamos el costo o presupuesto antes de avanzar."
  },
  {
    step: 3,
    title: "Resolución y seguimiento",
    description: "Realizamos la conexión remota autorizada, la intervención técnica o la entrega acordada, validando el funcionamiento final."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "Alcance claro y sin letra chica",
    description: "Definimos qué incluye cada asistencia o presupuesto antes de empezar. Si algo requiere más tiempo o evaluación adicional, se informa primero."
  },
  {
    id: 2,
    title: "Soporte remoto con autorización",
    description: "Resolvemos incidentes cotidianos por conexión remota segura y supervisada por vos, sin trasladar equipos ni perder tiempo."
  },
  {
    id: 3,
    title: "Criterio técnico para comprar y actualizar",
    description: "Recomendamos notebooks, PC gamer, puestos de oficina, monitores y mejoras de hardware pensando en el uso real y la durabilidad."
  },
  {
    id: 4,
    title: "Desarrollo web, formularios e IA a medida",
    description: "Acompañamos a profesionales y empresas con páginas web rápidas, formularios comerciales, automatizaciones y asistentes con IA."
  }
];

export const faqData = [
  {
    id: 1,
    question: "¿Cómo funciona el soporte remoto?",
    answer:
      "Coordinamos la asistencia, te indicamos cómo abrir una herramienta segura como AnyDesk o TeamViewer y nos conectamos a tu equipo solo con tu autorización. Vos ves todo lo que hacemos en pantalla."
  },
  {
    id: 12,
    question: "¿Qué pasa si el problema vuelve después de la asistencia?",
    answer:
      "Si el mismo inconveniente vuelve dentro de las 48 hs posteriores a la asistencia, revisamos el caso sin costo adicional para validar la solución aplicada. Esta revisión aplica al mismo equipo y al mismo problema atendido originalmente. No aplica a nuevos problemas, cambios realizados posteriormente, fallas de hardware, licencias, proveedores externos o casos fuera del alcance remoto."
  },
  {
    id: 2,
    question: "¿Es seguro dar acceso remoto a mi computadora?",
    answer:
      "Sí. El acceso se realiza únicamente con tu autorización y durante la sesión acordada. Al finalizar, la conexión se cierra. Recomendamos no compartir contraseñas sensibles y permanecer presente durante la asistencia."
  },
  {
    id: 3,
    question: "¿Qué incluye una asistencia remota?",
    answer:
      "Incluye diagnóstico y resolución remota de un problema técnico común dentro de una intervención de hasta 1 hora. Puede ser Windows, Office, correo, impresoras, programas, lentitud, seguridad básica, configuración general o problemas similares."
  },
  {
    id: 4,
    question: "¿Qué pasa si el problema lleva más de 1 hora?",
    answer:
      "Si el caso requiere más tiempo, se informa el avance y se cotiza una extensión antes de continuar. No avanzamos con costos adicionales sin avisarte."
  },
  {
    id: 5,
    question: "¿Qué cuenta como una asistencia?",
    answer:
      "Una asistencia corresponde a un incidente o tarea principal. Por ejemplo: configurar un correo, resolver un error de Windows, revisar una impresora o diagnosticar lentitud. Si aparecen tareas distintas, se coordinan aparte."
  },
  {
    id: 6,
    question: "¿Cómo funcionan los planes para empresas?",
    answer:
      "Los planes de empresa incluyen una cantidad mensual de asistencias remotas y una cantidad máxima de puestos de trabajo cubiertos. Los puestos se registran al contratar el plan, por ejemplo: PC Administración, Notebook Dueño o PC Caja."
  },
  {
    id: 7,
    question: "¿Las asistencias no usadas se acumulan?",
    answer:
      "No. Las asistencias incluidas en planes mensuales no se acumulan para el período siguiente. Podés usarlas para mantenimiento preventivo, optimización de equipos o resolver consultas pendientes."
  },
  {
    id: 8,
    question: "¿Cómo manejan el armado, actualización o reparación de equipos?",
    answer:
      "Los trabajos sobre hardware (armado de PC a medida, ampliación de SSD/RAM o reparaciones) se realizan según evaluación previa del caso. También brindamos asesoramiento y presupuestos completos para compra de notebooks, PC gamer, equipos de oficina, monitores y periféricos."
  },
  {
    id: 9,
    question: "¿Cómo se cotizan las páginas web, formularios y automatizaciones con IA?",
    answer:
      "Se trabajan como proyectos a medida. Relevamos tu necesidad comercial u operativa, definimos el alcance concreto (sitio web, formulario integrado, flujo automatizado o asistente con IA) y presentamos un presupuesto cerrado antes de iniciar."
  },
  {
    id: 10,
    question: "¿Trabajan con Microsoft 365?",
    answer:
      "Sí. Podemos ayudar con implementación inicial, usuarios, licencias, MFA, Outlook, Teams, OneDrive y SharePoint básico. Las licencias Microsoft no están incluidas en el precio del servicio."
  },
  {
    id: 11,
    question: "¿Recuperan datos de discos dañados?",
    answer:
      "Realizamos configuración de copias de seguridad y recuperación básica desde backups existentes o archivos accesibles. No hacemos recuperación forense ni trabajos sobre discos con daño físico."
  }
];

export const condicionesGenerales =
  "Precios en ARS. Cada asistencia remota cubre un caso principal e incluye hasta 1 hora de trabajo técnico. El tiempo no utilizado no es acumulable ni transferible. Si el caso requiere más tiempo o queda fuera del alcance remoto, se informa y cotiza antes de continuar. No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física ni trabajos presenciales. Los planes mensuales no son acumulables y se cuentan por períodos de 30 días desde la activación.";

export const whatsappMessage = `Hola, quiero consultar por los servicios de OTX Solutions.%0A%0ANecesito ayuda con: [Soporte remoto / Asesoramiento de equipos / Desarrollo web o IA]%0ADetalle breve: [DESCRIBIR CONSULTA]%0ASoy: [Particular / Profesional / Empresa]%0A%0AGracias.`;
