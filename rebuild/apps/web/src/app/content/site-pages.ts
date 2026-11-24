export interface SitePageSection {
  title: string;
  description: string;
}

export interface SitePageContent {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: SitePageSection[];
  note?: string;
  ctaLabel?: string;
  ctaPath?: string;
}

export const sitePages: SitePageContent[] = [
  {
    path: 'servicios',
    eyebrow: 'NUESTROS SERVICIOS',
    title: 'Servicios para ordenar, desarrollar y mejorar proyectos turísticos.',
    intro: 'El alcance se define después de comprender la necesidad, la etapa del proyecto y la información disponible.',
    sections: [
      { title: 'Diagnóstico y planificación', description: 'Identificar brechas, prioridades y próximos pasos.' },
      { title: 'Desarrollo de proyectos', description: 'Estructurar iniciativas por etapas y componentes.' },
      { title: 'Gestión y operación', description: 'Revisar procesos, coordinación y experiencia.' },
      { title: 'Comercialización y sistemas', description: 'Evaluar canales y herramientas según necesidad.' }
    ],
    note: 'La línea de Comercialización y Sistemas se publicará con alcance definitivo después de validar capacidades, herramientas y soporte disponibles.',
    ctaLabel: 'Cuéntanos sobre tu proyecto',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'servicios/terrenos-potencial-turistico',
    eyebrow: 'PARA PROPIETARIOS Y GESTORES',
    title: '¿Tienes un terreno y quieres explorar su potencial turístico?',
    intro: 'Un paisaje atractivo puede ser el comienzo de una oportunidad, pero no basta para saber si un proyecto es viable.',
    sections: [
      { title: 'Ubicación y accesibilidad', description: 'Conectividad, rutas y tiempos de acceso.' },
      { title: 'Entorno territorial', description: 'Atractivos, oferta cercana y contexto.' },
      { title: 'Servicios y condiciones', description: 'Agua, energía, saneamiento y conectividad conocida.' },
      { title: 'Brechas y requisitos', description: 'Qué debe verificarse con especialistas o autoridades.' }
    ],
    note: 'Un diagnóstico inicial no equivale a estudio de ingeniería, informe legal, permiso, certificación ni garantía de rentabilidad.',
    ctaLabel: 'Evaluar mi terreno',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'servicios/diagnostico-planificacion',
    eyebrow: 'CLARIDAD ANTES DE DECIDIR',
    title: 'Primero entendamos dónde está tu proyecto.',
    intro: 'Un diagnóstico ordenado ayuda a separar hechos, dudas, prioridades y decisiones que requieren apoyo especializado.',
    sections: [
      { title: 'Definir el problema', description: 'Conversación y objetivo.' },
      { title: 'Levantar antecedentes', description: 'Revisión de información.' },
      { title: 'Analizar brechas', description: 'Hallazgos y dependencias.' },
      { title: 'Priorizar', description: 'Qué resolver primero.' },
      { title: 'Trazar próximos pasos', description: 'Hoja de ruta y responsables.' }
    ],
    note: 'Los entregables, profundidad, visitas, reuniones y plazos se definen en la propuesta.',
    ctaLabel: 'Conversar sobre un diagnóstico',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'servicios/desarrollo-proyectos',
    eyebrow: 'DE LA IDEA A LA ESTRUCTURA',
    title: 'Convierte una idea turística en un proyecto ordenado.',
    intro: 'Conectamos objetivos, componentes, requerimientos y recursos en una ruta de trabajo que permita avanzar con criterio.',
    sections: [
      { title: 'Concepto y experiencia', description: 'Propósito, público y propuesta de valor.' },
      { title: 'Componentes y requerimientos', description: 'Infraestructura, operación y aspectos por estudiar.' },
      { title: 'Etapas y coordinación', description: 'Hitos, responsables, dependencias y próximos pasos.' }
    ],
    note: 'JoinHook no ejecuta automáticamente obras, firma proyectos técnicos ni obtiene permisos. Los especialistas y terceros se identifican por separado.',
    ctaLabel: 'Cuéntanos qué quieres desarrollar',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'servicios/gestion-operacion',
    eyebrow: 'PARA ESTABLECIMIENTOS TURÍSTICOS',
    title: 'Una mejor experiencia también necesita una operación bien organizada.',
    intro: 'Reservas, recepción, limpieza, mantenimiento, alimentos y bebidas e información deben funcionar como partes de un mismo servicio.',
    sections: [
      { title: 'Procesos', description: 'Qué ocurre y en qué orden.' },
      { title: 'Responsabilidades', description: 'Quién hace qué y cuándo.' },
      { title: 'Experiencia', description: 'Qué vive el visitante.' },
      { title: 'Información', description: 'Qué datos apoyan decisiones.' }
    ],
    note: 'Los entregables pueden incluir mapa de procesos, procedimientos, indicadores básicos y plan de mejora por etapas.',
    ctaLabel: 'Revisar mi negocio turístico',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'servicios/comercializacion-sistemas',
    eyebrow: 'TECNOLOGÍA CON PROPÓSITO',
    title: 'La tecnología debe responder a la operación, no al revés.',
    intro: 'Antes de elegir una plataforma, conviene comprender cómo llegan las consultas, cómo se cotiza y cómo se confirma un servicio.',
    sections: [
      { title: 'Canales y ventas', description: 'Recorrido desde la consulta hasta la reserva o contratación.' },
      { title: 'Requerimientos', description: 'Formularios, CRM, reservas y reportes que realmente se necesitan.' },
      { title: 'Selección de herramientas', description: 'Comparación según operación, presupuesto y capacidad del equipo.' }
    ],
    note: 'No afirmar motor propio, integraciones o automatizaciones activas hasta que estén implementadas y verificadas.',
    ctaLabel: 'Consultar por esta línea',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'servicios/negocios-turisticos',
    eyebrow: 'PARA NEGOCIOS EN FUNCIONAMIENTO',
    title: 'Tu negocio puede mejorar sin perder lo que lo hace propio.',
    intro: 'Alojamientos, restaurantes, operadores y servicios turísticos tienen temporadas, equipos y expectativas distintas.',
    sections: [
      { title: 'Operación', description: '¿Qué parte de la operación te quita más tiempo?' },
      { title: 'Coordinación', description: '¿Dónde se pierde información o coordinación?' },
      { title: 'Problemas repetidos', description: '¿Qué dificultades se repiten?' },
      { title: 'Decisiones pendientes', description: '¿Qué decisión estás postergando?' }
    ],
    ctaLabel: 'Ordenar mi negocio turístico',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'como-trabajamos',
    eyebrow: 'MÉTODO JOINHOOK',
    title: 'Entender antes de intervenir.',
    intro: 'No partimos recomendando una herramienta ni ofreciendo una solución estándar.',
    sections: [
      { title: '01 · Escuchamos', description: 'Objetivos y necesidad.' },
      { title: '02 · Observamos', description: 'Contexto y antecedentes.' },
      { title: '03 · Ordenamos', description: 'Brechas y prioridades.' },
      { title: '04 · Diseñamos', description: 'Alcance y ruta.' },
      { title: '05 · Conectamos', description: 'Personas y recursos.' },
      { title: '06 · Impulsamos', description: 'Acciones y seguimiento.' }
    ],
    note: 'Alcances, entregables, supuestos, dependencias y responsabilidades quedan acordados.',
    ctaLabel: 'Conversar sobre tu proyecto',
    ctaPath: '/formulario-clientes'
  },
  {
    path: 'proyectos',
    eyebrow: 'EVIDENCIA ANTES QUE PROMOCIÓN',
    title: 'Cada proyecto tiene un contexto. Cada avance necesita evidencia.',
    intro: 'Publicaremos solo trabajos documentados de forma transparente y con autorización.',
    sections: [
      { title: 'Contexto y desafío', description: 'Qué necesitaba el proyecto y en qué etapa estaba.' },
      { title: 'Alcance JoinHook', description: 'Qué actividades y entregables se realizaron realmente.' },
      { title: 'Resultado comprobable', description: 'Mostrar solo resultados demostrables y autorizados.' }
    ],
    note: 'Mientras no existan casos públicos autorizados, esta sección puede mantenerse en preparación y dirigir al método de trabajo.',
    ctaLabel: 'Conocer cómo trabajamos',
    ctaPath: '/como-trabajamos'
  },
  {
    path: 'conocimiento',
    eyebrow: 'CONOCIMIENTO JOINHOOK',
    title: 'Ideas y herramientas para decidir con más contexto.',
    intro: 'Contenidos sobre planificación turística, hospitalidad, operación y desarrollo de proyectos.',
    sections: [
      { title: 'Terrenos y destinos', description: 'Condiciones, brechas y oportunidades territoriales.' },
      { title: 'Gestión y operación', description: 'Procesos, servicio y coordinación.' },
      { title: 'Comercialización y sistemas', description: 'Canales, información y herramientas.' }
    ],
    note: 'Cada artículo debe mostrar fecha, autor, fuentes y revisión cuando corresponda.',
    ctaLabel: 'Explorar el blog',
    ctaPath: '/blog'
  },
  {
    path: 'blog',
    eyebrow: 'BLOG JOINHOOK',
    title: 'Guías para pensar y mejorar proyectos turísticos.',
    intro: 'Contenido útil, con fuentes y contexto, sin titulares exagerados.',
    sections: [
      { title: 'Qué revisar antes de desarrollar un terreno turístico', description: 'Accesibilidad, servicios, entorno, restricciones y preguntas pendientes.' },
      { title: 'Etapas para ordenar una idea turística', description: 'De la intención inicial a un alcance y una hoja de ruta.' },
      { title: 'Señales de que un negocio necesita ordenar su operación', description: 'Procesos repetidos, información dispersa y responsabilidades poco claras.' }
    ],
    note: 'Los artículos deben incluir autor, fecha, actualización, introducción, fuentes y CTA.'
  },
  {
    path: 'actualidad',
    eyebrow: 'NOTAS DE TERRENO Y NOVEDADES PROPIAS',
    title: 'Actualidad JoinHook.',
    intro: 'Publicaremos actividades y avances propios que puedan documentarse y verificarse.',
    sections: [
      { title: 'Actividad o visita documentada', description: 'Qué ocurrió, cuándo, dónde y qué se aprendió. Participantes identificados solo con autorización.' },
      { title: 'Avance de un proyecto propio', description: 'Estado real, siguiente paso confirmado y límites de lo que se puede comunicar.' }
    ],
    note: 'Si no hay una novedad verificable, la sección permanece sin publicaciones. No presentar noticias de terceros como novedades propias.'
  },
  {
    path: 'nosotros',
    eyebrow: 'QUIÉN ESTÁ DETRÁS',
    title: 'Una mirada práctica para proyectos que necesitan avanzar.',
    intro: 'JoinHook nace de la convicción de que antes de recomendar una solución hay que comprender cómo funciona un proyecto.',
    sections: [
      { title: 'JoinHook', description: 'Gestión · hospitalidad · turismo.' },
      { title: 'Principios', description: 'Transparencia · Respeto · Escucha · Responsabilidad · Aprendizaje.' }
    ],
    note: 'La biografía, fechas, cargos y formación deben validarse antes de publicar.'
  },
  {
    path: 'colaboraciones',
    eyebrow: 'UNA RED ABIERTA A EXPLORAR',
    title: 'Los buenos proyectos también se construyen conectando capacidades.',
    intro: 'Nos interesa conocer profesionales, empresas, proveedores y organizaciones que aporten experiencia, soluciones o presencia territorial.',
    sections: [
      { title: 'Especialistas', description: 'Profesionales técnicos y consultores.' },
      { title: 'Proveedores', description: 'Infraestructura, equipamiento y servicios.' },
      { title: 'Territorio', description: 'Organizaciones, destinos y actores locales.' },
      { title: 'Tecnología', description: 'Sistemas, plataformas y servicios digitales.' },
      { title: 'Comercialización', description: 'Operadores, canales y distribución.' },
      { title: 'Conocimiento', description: 'Formación, investigación y capacitación.' }
    ],
    note: 'Esta página explora posibilidades; no afirma que existan alianzas ni que colaboradores estén aprobados.',
    ctaLabel: 'Presentar mi interés en colaborar',
    ctaPath: '/formulario-colaboradores'
  },
  {
    path: 'modelos-colaboracion',
    eyebrow: 'FORMAS POSIBLES DE COLABORAR',
    title: 'Cada colaboración debe tener un propósito, un alcance y reglas claras.',
    intro: 'Las modalidades se evalúan según el proyecto, la capacidad y las condiciones de las partes.',
    sections: [
      { title: 'Especialista por encargo', description: 'Participación técnica delimitada en un proyecto.' },
      { title: 'Proveedor evaluado', description: 'Solución para una necesidad concreta; sin homologación automática.' },
      { title: 'Derivación o referido', description: 'Presentación de oportunidades con autorización y reglas acordadas.' },
      { title: 'Alianza territorial', description: 'Actividades o proyectos compartidos mediante acuerdo.' },
      { title: 'Conocimiento', description: 'Artículos, talleres, investigación y formación.' },
      { title: 'Piloto conjunto', description: 'Prueba acotada de una solución o servicio.' }
    ],
    note: 'Antes de compartir datos, anunciar alianzas o acordar comisiones, se deben definir autorizaciones, responsabilidades, costos, confidencialidad y propiedad intelectual.'
  },
  {
    path: 'formulario-clientes',
    eyebrow: 'FORMULARIO DE CLIENTES',
    title: 'Cuéntanos sobre tu proyecto.',
    intro: 'Con información general es suficiente para iniciar la conversación. No necesitas adjuntar documentos ni tener el proyecto terminado.',
    sections: [
      { title: 'Información inicial', description: 'Nombre, medio de contacto, tipo de proyecto y ubicación aproximada.' },
      { title: 'Etapa del proyecto', description: 'Idea inicial, evaluación, desarrollo o negocio en funcionamiento.' },
      { title: 'Necesidad principal', description: 'Qué quieres comprender, ordenar o resolver.' }
    ],
    note: 'La interfaz de captación todavía no guarda ni envía datos. No adjuntar RUT, escrituras, datos bancarios, planos privados ni documentos sensibles.'
  },
  {
    path: 'formulario-colaboradores',
    eyebrow: 'FORMULARIO DE COLABORADORES',
    title: 'Cuéntanos qué podrías aportar.',
    intro: 'Una presentación breve ayuda a conocer tu experiencia, cobertura y el tipo de colaboración que te interesa explorar.',
    sections: [
      { title: 'Contacto', description: 'Nombre, organización, correo y región.' },
      { title: 'Colaboración', description: 'Tipo de colaboración, área de experiencia y servicios.' },
      { title: 'Antecedentes', description: 'Portafolio o sitio web opcional.' }
    ],
    note: 'Enviar un futuro formulario no crea por sí solo una relación contractual, exclusividad ni condición de socio o proveedor aprobado.'
  },
  {
    path: 'contacto',
    eyebrow: 'CONTACTO',
    title: 'Conversemos sobre lo que quieres desarrollar o mejorar.',
    intro: 'Si eres cliente, utiliza el formulario para que podamos comprender tu necesidad. Si quieres colaborar, visita la página de Colaboraciones.',
    sections: [
      { title: 'Clientes', description: 'Presenta tu proyecto y la necesidad que quieres revisar.' },
      { title: 'Colaboradores', description: 'Comparte tu experiencia y el aporte que te interesa explorar.' }
    ]
  },
  {
    path: 'privacidad',
    eyebrow: 'PÁGINA DE SOPORTE',
    title: 'Privacidad clara y navegación sin callejones.',
    intro: 'La política final requiere identificar al responsable, finalidades, proveedores, transferencias, conservación, derechos y canal de contacto.',
    sections: [
      { title: 'Responsable', description: 'Completar con los datos legales y de contacto que correspondan.' },
      { title: 'Uso de datos', description: 'Definir finalidades, bases jurídicas, proveedores y plazos de conservación.' },
      { title: 'Derechos', description: 'Definir el canal de solicitudes de las personas.' }
    ],
    note: 'No publicar como política vigente hasta completar los datos reales y la revisión legal correspondiente.'
  }
];
