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
    title: "Soporte técnico remoto y presencial",
    hint: "¿Tu computadora está lenta, falla el correo, la impresora o algún programa? Te ayudamos a distancia o coordinamos una visita a domicilio u oficina.",
    description: "Nos conectamos a tu equipo con tu autorización para resolver fallas de Windows, Office, correo, impresoras, Wi-Fi y programas de uso diario. Si el caso requiere presencia física —configuración de equipos, redes o instalaciones en el lugar—, coordinamos una visita técnica a domicilio u oficina confirmando previamente disponibilidad, zona, traslado y presupuesto.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Puesta a punto y protección",
    hint: "¿Tarda en arrancar, salen carteles molestos o querés cuidar tus archivos? Dejamos tu equipo ágil, limpio y protegido.",
    description: "Optimizamos el inicio de Windows, quitamos programas innecesarios, aplicamos actualizaciones importantes, configuramos copias de seguridad para tus archivos y reforzamos la protección preventiva frente a virus, estafas o accesos no deseados.",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    title: "Capacitación personalizada",
    hint: "¿Querés usar mejor la computadora, Excel, el correo o herramientas de IA? Clases prácticas a tu ritmo, sin cursos cerrados.",
    description: "Enseñamos exactamente lo que cada persona o equipo necesita aprender: uso cotidiano de Windows, Word, Excel, correo electrónico, videollamadas, organización de archivos y herramientas de IA. Orientado a particulares, adultos mayores, profesionales y empleados de empresas, en modalidad remota o presencial a coordinar.",
    icon: "GraduationCap"
  },
  {
    id: 4,
    title: "Asesoramiento de compra y equipamiento",
    hint: "¿No sabés qué notebook elegir, buscás una PC gamer para tu presupuesto o querés equipar una oficina? Te guiamos para comprar bien.",
    description: "Escuchamos para qué vas a usar el equipo y cuánto querés invertir para recomendarte opciones concretas y convenientes: notebooks, PC gamer, computadoras de escritorio, monitores, impresoras, periféricos y presupuestos completos para oficinas.",
    icon: "Laptop"
  },
  {
    id: 5,
    title: "Mejoras, armado y reparación de PC",
    hint: "¿Tu computadora actual quedó lenta o dejó de encender? Evaluamos si conviene mejorarla, armar una a medida o repararla.",
    description: "Realizamos diagnóstico técnico, mejoras de velocidad y almacenamiento (discos sólidos SSD y memoria RAM), armado de equipos a medida e instalación o reparación de componentes sujetos a evaluación y presupuesto previo.",
    icon: "Wrench"
  },
  {
    id: 6,
    title: "Tu empresa organizada y segura",
    hint: "¿Querés correo con el nombre de tu negocio, archivos compartidos en orden y cuentas protegidas? Organizamos el trabajo de tu equipo.",
    description: "Configuramos correos profesionales, carpetas compartidas con permisos por área, copias de seguridad y protección de cuentas y equipos de trabajo. A nivel técnico, implementamos y administramos Microsoft 365 (Outlook, Teams, OneDrive, SharePoint), control de accesos y verificación MFA con Microsoft Entra, protección con Defender y gestión de dispositivos con Intune, mediante proyectos a medida según compatibilidad, licencias y alcance acordado.",
    icon: "Building2"
  },
  {
    id: 7,
    title: "Páginas web y formularios comerciales",
    hint: "¿Necesitás mostrar lo que hacés y recibir consultas claras en tu WhatsApp o correo? Creamos sitios rápidos y fáciles de usar.",
    description: "Diseñamos y publicamos páginas web modernas, sitios de presentación comercial y formularios claros pensados para que tus clientes te escriban sin vueltas desde el teléfono o la computadora, derivando cada consulta a WhatsApp, correo o tickets.",
    icon: "Globe"
  },
  {
    id: 8,
    title: "Inteligencia artificial y automatización",
    hint: "¿Perdés tiempo en tareas repetitivas, planillas o respuestas frecuentes? Aplicamos IA y automatizaciones prácticas para ahorrar horas.",
    description: "Desarrollamos proyectos a medida para automatizar tareas repetitivas, conectar formularios con planillas o avisos automáticos e incorporar asistentes y herramientas de IA (como Claude, Microsoft Copilot o flujos personalizados) adaptados a la forma de trabajar de tu negocio.",
    icon: "Sparkles"
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
    title: "Contanos qué necesitás",
    description: "Escribinos por WhatsApp o formulario con tus propias palabras, sin necesidad de saber términos técnicos."
  },
  {
    step: 2,
    title: "Confirmamos cómo ayudarte",
    description: "Te explicamos la solución en simple, si se resuelve a distancia o con una visita, y el precio antes de empezar."
  },
  {
    step: 3,
    title: "Lo resolvemos",
    description: "Nos conectamos con tu permiso, coordinamos la visita o ponemos en marcha el equipo o proyecto acordado."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "Hablamos en tu idioma",
    description: "Explicamos qué pasa y cómo solucionarlo de manera sencilla, sin palabras difíciles ni vueltas innecesarias."
  },
  {
    id: 2,
    title: "Precio y alcance claros antes de empezar",
    description: "Siempre sabés qué incluye cada asistencia o presupuesto de antemano. Nunca avanzamos con gastos extra sin consultarte."
  },
  {
    id: 3,
    title: "Asistencia en el acto o visita coordinada",
    description: "Resolvemos la mayoría de los problemas en minutos por conexión remota segura y coordinamos visitas cuando hace falta estar ahí."
  },
  {
    id: 4,
    title: "Recomendaciones honestas para comprar o mejorar",
    description: "Te aconsejamos la notebook, PC gamer, mejora o herramienta para tu negocio que realmente sirve para tu uso y presupuesto."
  }
];

export const faqData = [
  {
    id: 1,
    question: "¿Cómo me ayudan a distancia y qué tan seguro es?",
    answer:
      "Usamos un programa seguro (AnyDesk o TeamViewer) y entramos únicamente cuando vos nos das permiso. Ves todo lo que hacemos en tu pantalla y, al terminar, la conexión se cierra por completo."
  },
  {
    id: 2,
    question: "¿Qué incluye la Asistencia Remota de $20.000?",
    answer:
      "Cubre el diagnóstico y la solución de un problema puntual en hasta 1 hora de trabajo remoto: computadora lenta, correo, Office, impresoras, virus o configuración. Si requiere más tiempo o revisión física, te avisamos y cotizamos antes de seguir."
  },
  {
    id: 3,
    question: "¿Hacen visitas técnicas a domicilio o a oficinas?",
    answer:
      "Sí. Para instalar equipos, configurar impresoras o redes en el lugar, o revisar fallas físicas, coordinamos visitas a domicilio u oficina confirmando antes disponibilidad, zona, traslado y presupuesto."
  },
  {
    id: 4,
    question: "¿Cómo son las clases y capacitaciones personalizadas?",
    answer:
      "Son encuentros prácticos adaptados a tu ritmo para aprender Windows, Office, Excel, correo o herramientas de inteligencia artificial. No vendemos cursos cerrados: enseñamos exactamente lo que vos o tu equipo necesitan, a distancia o presencial."
  },
  {
    id: 5,
    question: "¿Me ayudan a elegir una notebook, armar una PC gamer o mejorar mi computadora?",
    answer:
      "Sí. Nos contás para qué la vas a usar y tu presupuesto, y te recomendamos opciones concretas para comprar bien. También realizamos mejoras de velocidad (disco sólido SSD y memoria RAM), armado a medida y reparaciones según evaluación."
  },
  {
    id: 6,
    question: "¿Cómo funcionan los planes mensuales para negocios y empresas?",
    answer:
      "Incluyen una cantidad mensual de asistencias remotas para los puestos registrados del negocio, con coordinación directa por WhatsApp. Se cuentan por períodos de 30 días y las asistencias no utilizadas no se acumulan."
  },
  {
    id: 7,
    question: "¿Cómo se contratan las páginas web, mejoras para empresas o proyectos con IA?",
    answer:
      "Las páginas web, la organización de cuentas y seguridad empresarial (como Microsoft 365) y las automatizaciones con inteligencia artificial se presupuestan como proyectos a medida, independientes de los planes mensuales."
  }
];

export const condicionesGenerales =
  "Precios en ARS. Cada asistencia remota cubre un caso principal e incluye hasta 1 hora de trabajo técnico. El tiempo no utilizado no es acumulable ni transferible. Si el caso requiere más tiempo o queda fuera del alcance remoto, se informa y cotiza antes de continuar. No incluye licencias de software, repuestos, recuperación avanzada de datos, reparación física ni trabajos presenciales. Los planes mensuales no son acumulables y se cuentan por períodos de 30 días desde la activación.";

export const whatsappMessage = `Hola, quiero consultar a OTX Solutions.%0A%0ANecesito ayuda con: [Soporte remoto / Equipamiento / Web o IA]%0ADetalle breve: [DESCRIBIR CONSULTA]%0A%0AGracias.`;
