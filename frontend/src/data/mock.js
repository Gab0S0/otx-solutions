// Mock data for OTX Solutions IT Support Landing Page

export const companyInfo = {
  name: "OTX Solutions",
  tagline: "Excelencia en Operaciones Tecnológicas",
  whatsapp: "5491124021747",
  email: "solutionsotx@gmail.com",
  location: "CABA, Buenos Aires, Argentina",
  experience: "+10",
  casesResolved: "+1.000"
};

export const services = [
  {
    id: 1,
    title: "Soporte Técnico Remoto",
    description: "Nos conectamos a tu equipo con tu autorización para diagnosticar y resolver problemas técnicos comunes.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Optimización de PC",
    description: "Revisamos lentitud, programas innecesarios, configuración de inicio, estado general de Windows y funcionamiento básico.",
    icon: "Sparkles"
  },
  {
    id: 3,
    title: "Configuración de Software",
    description: "Instalamos y configuramos programas, drivers, herramientas de trabajo, correo, Office y aplicaciones de uso diario.",
    icon: "Settings"
  },
  {
    id: 4,
    title: "Backup y Recuperación Básica",
    description: "Configuramos respaldos simples y recuperamos archivos desde backups existentes. No incluye recuperación forense ni daño físico de discos.",
    icon: "HardDrive"
  },
  {
    id: 5,
    title: "Soporte para Home Office",
    description: "Configuramos herramientas de trabajo remoto, correo, accesos, impresoras, VPN y aplicaciones colaborativas.",
    icon: "Home"
  },
  {
    id: 6,
    title: "Asesoramiento IT para Pymes",
    description: "Ayudamos a pequeños negocios a ordenar sus equipos, software, correo, usuarios y necesidades técnicas básicas.",
    icon: "Lightbulb"
  },
  {
    id: 7,
    title: "Microsoft 365 para Pymes",
    description: "Implementamos y gestionamos entornos Microsoft 365 para mejorar correo, usuarios, seguridad y colaboración.",
    icon: "Cloud"
  }
];

export const planesParticulares = {
  planes: [
    {
      id: 1,
      name: "Asistencia Remota",
      price: "$50.000",
      period: "",
      description:
        "Diagnóstico y resolución remota para un problema puntual en tu PC o notebook.",
      features: [
        "1 asistencia remota",
        "Diagnóstico inicial incluido",
        "Resolución de problemas comunes",
        "Hasta 1 hora de trabajo técnico remoto",
        "Windows, Office, correo, impresoras, programas y configuración general",
        "Recomendación final si requiere reparación física o trabajo avanzado"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Pack 5 Asistencias",
      price: "$220.000",
      period: "",
      description:
        "Para quienes necesitan soporte recurrente sin pagar cada asistencia por separado.",
      features: [
        "5 asistencias remotas",
        "Hasta 1 hora cada una",
        "Válido por 3 meses",
        "Ideal para personas, freelancers o profesionales independientes",
        "Ahorrás $30.000 frente a contratarlas por separado"
      ],
      popular: true
    }
  ],
  extras: [
    {
      concepto: "Extensión adicional",
      precio: "$30.000 cada 30 min"
    },
    {
      concepto: "Trabajo fuera de alcance",
      precio: "Se cotiza antes de continuar"
    },
    {
      concepto: "Revisión preventiva simple",
      precio: "Desde $50.000"
    }
  ]
};

export const planesPymes = {
  planes: [
    {
      id: 1,
      name: "Pyme Inicial",
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
      name: "Pyme Operativo",
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
      name: "Pyme Plus",
      price: "A cotizar",
      period: "",
      asistencias: "A medida",
      puestos: "Más de 6 puestos",
      description:
        "Para pymes con más equipos, usuarios o necesidades técnicas más complejas.",
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
    title: "Contactanos",
    description: "Escribinos por WhatsApp o abrí un ticket describiendo el problema."
  },
  {
    step: 2,
    title: "Coordinamos la asistencia",
    description: "Revisamos el caso, confirmamos el alcance y coordinamos la conexión remota."
  },
  {
    step: 3,
    title: "Diagnóstico y resolución",
    description: "Nos conectamos con tu autorización, trabajamos sobre el equipo y te informamos el resultado."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "+10 Años de Experiencia",
    description: "Experiencia real en soporte IT, usuarios, equipos, redes y entornos de trabajo.",
    icon: "Award"
  },
  {
    id: 2,
    title: "+1.000 Casos Resueltos",
    description: "Resolución de incidencias técnicas para usuarios, profesionales y empresas.",
    icon: "CheckCircle"
  },
  {
    id: 3,
    title: "Atención Coordinada",
    description: "Organizamos cada asistencia para entender el problema y avanzar con claridad.",
    icon: "Clock"
  },
  {
    id: 4,
    title: "Sin Letra Chica",
    description: "Alcance claro antes de empezar. Si algo requiere más tiempo o está fuera del servicio, se informa.",
    icon: "FileText"
  },
  {
    id: 5,
    title: "100% Remoto",
    description: "No necesitás llevar tu equipo a ningún lado. La asistencia se realiza por conexión remota autorizada.",
    icon: "Wifi"
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
    id: 2,
    question: "¿Es seguro dar acceso remoto a mi computadora?",
    answer:
      "Sí. El acceso se realiza únicamente con tu autorización y durante la sesión acordada. Al finalizar, la conexión se cierra. Recomendamos no compartir contraseñas sensibles y permanecer presente durante la asistencia."
  },
  {
    id: 3,
    question: "¿Qué incluye una asistencia remota?",
    answer:
      "Incluye diagnóstico y resolución remota de un problema técnico común dentro de una intervención de hasta 1 hora. Puede ser Windows, Office, correo, impresoras, programas, lentitud, configuración general o problemas similares."
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
    question: "¿Cómo funcionan los planes para pymes?",
    answer:
      "Los planes pyme incluyen una cantidad mensual de asistencias remotas y una cantidad máxima de puestos de trabajo cubiertos. Los puestos se registran al contratar el plan, por ejemplo: PC Administración, Notebook Dueño o PC Caja."
  },
  {
    id: 7,
    question: "¿Las asistencias no usadas se acumulan?",
    answer:
      "No. Las asistencias incluidas en planes mensuales no se acumulan para el período siguiente. Podés usarlas para mantenimiento preventivo, revisión de equipos o resolver problemas pendientes."
  },
  {
    id: 8,
    question: "¿Qué no incluye el servicio?",
    answer:
      "No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física, trabajos presenciales ni servicios que requieran intervención sobre hardware. Si el caso queda fuera del alcance remoto, se informa antes de continuar."
  },
  {
    id: 9,
    question: "¿Recuperan datos de discos dañados?",
    answer:
      "Realizamos recuperación básica desde backups existentes o archivos accesibles. No hacemos recuperación forense ni trabajos sobre discos con daño físico. En esos casos podemos orientarte, pero la contratación de un laboratorio especializado queda a cargo del cliente."
  },
  {
    id: 10,
    question: "¿Trabajan con Microsoft 365?",
    answer:
      "Sí. Podemos ayudar con implementación inicial, usuarios, licencias, MFA, Outlook, Teams, OneDrive y SharePoint básico. Las licencias Microsoft no están incluidas en el precio del servicio."
  }
];

export const condicionesGenerales =
  "Precios en ARS. Cada asistencia remota incluye diagnóstico y trabajo técnico durante hasta 1 hora. Si el caso requiere más tiempo o queda fuera del alcance remoto, se informa y cotiza antes de continuar. No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física ni trabajos presenciales. Los planes mensuales no son acumulables y se cuentan por períodos de 30 días desde la activación.";

export const whatsappMessage = `Hola, quiero consultar por soporte IT remoto de OTX Solutions.%0A%0AMi problema es: [DESCRIBIR BREVEMENTE]%0ATipo de equipo: [PC / Notebook / Mac]%0ASoy: [Persona / Profesional independiente / Pyme]%0A%0AGracias.`;
