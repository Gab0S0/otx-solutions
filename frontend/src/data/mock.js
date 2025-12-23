// Mock data for OTX Solutions IT Support Landing Page

export const companyInfo = {
  name: "OTX Solutions",
  tagline: "Excelencia en Operaciones Tecnológicas",
  whatsapp: "5491124021747",
  email: "otame.drive@gmail.com",
  location: "CABA, Buenos Aires, Argentina",
  experience: "10+",
  casesResolved: "3000+"
};

export const services = [
  {
    id: 1,
    title: "Soporte Técnico Remoto",
    description: "Nos conectamos a tu equipo y solucionamos el problema en tiempo real.",
    icon: "Monitor"
  },
  {
    id: 2,
    title: "Limpieza y Optimización de PC",
    description: "Eliminamos virus, malware y dejamos tu computadora volando.",
    icon: "Sparkles"
  },
  {
    id: 3,
    title: "Configuración de Software",
    description: "Instalamos y configuramos programas, drivers y sistemas operativos.",
    icon: "Settings"
  },
  {
    id: 4,
    title: "Backup y Recuperación de Datos",
    description: "Configuramos backups automáticos y recuperamos archivos desde respaldos existentes. Casos de daño físico de disco o recuperación forense no están incluidos.",
    icon: "HardDrive"
  },
  {
    id: 5,
    title: "Soporte para Home Office",
    description: "Configuramos VPN, herramientas colaborativas y todo lo que necesités para trabajar remoto.",
    icon: "Home"
  },
  {
    id: 6,
    title: "Asesoramiento IT para Pymes",
    description: "Te ayudamos a elegir el hardware y software ideal para tu negocio.",
    icon: "Lightbulb"
  },
  {
    id: 7,
    title: "Microsoft 365 para Pymes",
    description: "Implementamos y gestionamos tu entorno Microsoft 365 de forma profesional.",
    icon: "Cloud"
  }
];

export const planesParticulares = {
  planes: [
    {
      id: 1,
      name: "Asistencia Única",
      price: "$15.000",
      period: "",
      description: "1 intervención remota (hasta 1 hora). Diagnóstico incluido.",
      features: [
        "1 intervención remota",
        "Hasta 1 hora de soporte",
        "Diagnóstico incluido"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Pack 5 Intervenciones",
      price: "$65.000",
      period: "",
      description: "5 intervenciones (hasta 1 hora c/u). Válido por 3 meses.",
      features: [
        "5 intervenciones remotas",
        "Hasta 1 hora cada una",
        "Válido por 3 meses",
        "Ahorrás $10.000"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Plan Mensual",
      price: "$25.000",
      period: "/mes",
      description: "2 intervenciones cada 30 días (hasta 1 hora c/u). No acumulables. Hasta 2 dispositivos.",
      features: [
        "2 intervenciones por mes",
        "Hasta 1 hora cada una",
        "Hasta 2 dispositivos",
        "No acumulables"
      ],
      popular: false
    }
  ],
  descuentos: [
    { compromiso: "Mes a mes", descuento: "—", precioFinal: "$25.000" },
    { compromiso: "3 meses", descuento: "-15%", precioFinal: "$21.250" },
    { compromiso: "12 meses", descuento: "-20%", precioFinal: "$20.000" }
  ],
  extras: [
    { concepto: "Intervención adicional (con plan activo)", precio: "$9.000" },
    { concepto: "Intervención sin plan (hasta 1h)", precio: "$25.000" },
    { concepto: "Dispositivo adicional", precio: "$2.500 (alta única)" }
  ]
};

export const planesPymes = {
  planes: [
    {
      id: 1,
      name: "Pyme Basic",
      price: "$70.000",
      period: "/mes",
      hours: "6 horas",
      equipos: "Hasta 10",
      features: [
        "6 horas de soporte mensual",
        "Hasta 10 equipos",
        "Prioridad media",
        "Reporte mensual de intervenciones"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Pyme Pro",
      price: "$120.000",
      period: "/mes",
      hours: "12 horas",
      equipos: "Hasta 20",
      features: [
        "12 horas de soporte mensual",
        "Hasta 20 equipos",
        "Prioridad alta (<15 min respuesta)",
        "Monitoreo básico",
        "Asesoramiento IT incluido"
      ],
      popular: true
    }
  ],
  extras: [
    { concepto: "Hora extra (con plan activo)", precio: "$15.000 + IVA" },
    { concepto: "Hora suelta (sin plan)", precio: "$25.000 + IVA" },
    { concepto: "Equipo adicional", precio: "$3.500/mes" }
  ]
};

export const planesM365 = [
  {
    id: 1,
    name: "Implementación Inicial",
    price: "Desde $85.000",
    description: "Hasta 10 usuarios. Tenant, dominio, usuarios, MFA, config básica.",
    features: [
      "Creación de tenant",
      "Configuración de dominios",
      "Alta de usuarios y licencias",
      "Activación de MFA",
      "Configuración básica de seguridad"
    ]
  },
  {
    id: 2,
    name: "Gestión Mensual",
    price: "Desde $25.000/mes",
    description: "Hasta 10 usuarios. Altas/bajas, soporte Teams/Outlook, gestión MFA.",
    features: [
      "Altas y bajas de usuarios",
      "Gestión de MFA",
      "Soporte Teams y Outlook",
      "Resolución de incidencias"
    ]
  },
  {
    id: 3,
    name: "SharePoint/OneDrive Básico",
    price: "Desde $45.000",
    description: "Estructura + permisos + capacitación. Pago único.",
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
    description: "Escribinos por WhatsApp o abrí un ticket describiendo tu problema."
  },
  {
    step: 2,
    title: "Diagnóstico Rápido",
    description: "En minutos evaluamos la situación y te pasamos presupuesto si corresponde."
  },
  {
    step: 3,
    title: "Lo Resolvemos",
    description: "Nos conectamos remotamente y solucionamos. Listo, sin vueltas."
  }
];

export const whyUs = [
  {
    id: 1,
    title: "10+ Años de Experiencia",
    description: "Conocemos el rubro de punta a punta.",
    icon: "Award"
  },
  {
    id: 2,
    title: "+3.000 Casos Resueltos",
    description: "En CABA y alrededores, con clientes que vuelven.",
    icon: "CheckCircle"
  },
  {
    id: 3,
    title: "Respuesta Rápida",
    description: "Contestamos en menos de 30 minutos en horario laboral.",
    icon: "Clock"
  },
  {
    id: 4,
    title: "Sin Letra Chica",
    description: "Presupuestos claros antes de empezar. Sin sorpresas.",
    icon: "FileText"
  },
  {
    id: 5,
    title: "100% Remoto",
    description: "No necesitás llevar tu equipo a ningún lado.",
    icon: "Wifi"
  }
];

export const faqData = [
  {
    id: 1,
    question: "¿Cómo funciona el soporte remoto?",
    answer: "Usamos software seguro (como TeamViewer o AnyDesk) para conectarnos a tu equipo con tu autorización. Vos ves todo lo que hacemos en pantalla."
  },
  {
    id: 2,
    question: "¿Es seguro darles acceso a mi computadora?",
    answer: "Totalmente. Usamos conexiones encriptadas y solo accedemos cuando vos lo autorizás. Apenas terminamos, la sesión se cierra."
  },
  {
    id: 3,
    question: "¿Qué cuenta como una intervención?",
    answer: "Una intervención es la resolución de un incidente o tarea principal (ej: eliminar un virus, configurar el mail, solucionar un error). Si durante la sesión surge otra tarea distinta, se coordina como intervención aparte."
  },
  {
    id: 4,
    question: "¿Cómo se cuenta el mes en los planes?",
    answer: "El mes se cuenta como 30 días desde la fecha de activación, no por mes calendario. Por ejemplo, si activás el 15 de marzo, tu ciclo va del 15/3 al 14/4."
  },
  {
    id: 5,
    question: "¿Las intervenciones o horas no usadas se acumulan?",
    answer: "No. Las intervenciones (particulares) y horas (pymes) son por período y no se transfieren al siguiente. Te recomendamos aprovecharlas para mantenimiento preventivo."
  },
  {
    id: 6,
    question: "¿Los precios pueden cambiar?",
    answer: "Sí, los precios de lista se actualizan mensualmente según IPC INDEC. Sin embargo, el precio se mantiene durante el período que ya abonaste. Las renovaciones se facturan al precio vigente. En el plan anual, el precio se congela 90 días y luego se ajusta trimestralmente."
  },
  {
    id: 7,
    question: "¿Puedo cancelar mi plan en cualquier momento?",
    answer: "Sí. Podés solicitar la baja cuando quieras y se efectiviza al finalizar el período ya abonado (no se devuelve proporcional). Si contrataste con descuento (3 o 12 meses) y cancelás antes de cumplir el compromiso, se recalcula a tarifa sin descuento y se cobra la diferencia."
  },
  {
    id: 8,
    question: "¿Qué pasa si no pueden resolver el problema de forma remota?",
    answer: "Te lo decimos antes de cobrarte. Si el problema requiere intervención física (ej: cambio de disco, reparación de hardware), te informamos y la gestión de un servicio técnico externo queda a tu cargo."
  },
  {
    id: 9,
    question: "¿Recuperan datos de discos dañados?",
    answer: "Hacemos recuperación básica de archivos y restauración desde backups existentes. Casos de daño físico o recuperación forense no están incluidos. Si necesitás un laboratorio especializado, te orientamos pero la contratación la gestionás vos."
  },
  {
    id: 10,
    question: "¿Cómo es el proceso de implementación de Microsoft 365?",
    answer: "Relevamos tu situación actual, creamos el tenant, configuramos dominio/usuarios/MFA y capacitamos a tu equipo. El proceso lleva entre 3 y 10 días hábiles según complejidad."
  }
];

export const condicionesGenerales = "Precios en ARS. Actualizables según IPC. El precio se mantiene durante el período ya abonado. La baja puede solicitarse en cualquier momento y se efectiviza al finalizar el período pago. En planes con descuento, la cancelación anticipada implica ajuste retroactivo a tarifa sin descuento. En plan anual: precio congelado 90 días y ajustes trimestrales por IPC INDEC.";

export const whatsappMessage = `Hola, necesito soporte técnico remoto.%0A%0AMi problema es: [DESCRIBIR BREVEMENTE]%0ATipo de equipo: [PC / Notebook / Mac]%0ASistema operativo: [Windows / macOS / Otro]%0ASoy: [Particular / Pyme]%0A%0A¡Gracias!`;
