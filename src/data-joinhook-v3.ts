export const projects = [
    {
        key: 'cge',
        name: 'Control Gastronómico Express',
        status: 'BETA DISPONIBLE',
        tone: 'green',
        description: 'Herramienta para pequeños negocios gastronómicos enfocada en inventario, compras, mermas, stock mínimo, proveedores y respaldos.',
        tags: ['Operaciones', 'PWA', 'Inventario'],
        href: '/herramientas/control-gastronomico-express'
    },
    {
        key: 'joinops',
        name: 'JoinOps',
        status: 'EN DESARROLLO',
        tone: 'amber',
        description: 'Sistema modular para ordenar inventario, producción, personas, compras y operación diaria con trazabilidad.',
        tags: ['Operaciones', 'Gestión', 'Dashboard'],
        href: '/proyectos#joinops'
    },
    {
        key: 'snowwise',
        name: 'SnowWise',
        status: 'PROTOTIPO ACTIVO',
        tone: 'blue',
        description: 'Plataforma para apoyar la planificación de actividades de montaña y nieve con información útil, servicios y una experiencia clara.',
        tags: ['Turismo', 'Web', 'Experiencia'],
        href: '/proyectos#snowwise'
    },
    {
        key: 'gestion',
        name: 'Mi Gestión',
        status: 'EXPLORACIÓN',
        tone: 'gray',
        description: 'Espacio administrativo para organizar tareas, indicadores, documentos, proveedores y seguimiento cotidiano.',
        tags: ['Gestión', 'Dashboard', 'Productividad'],
        href: '/proyectos#mi-gestion'
    }
] as const;

export const articles = [
    {
        slug: 'cuando-un-proceso-manual-pide-una-solucion-digital',
        category: 'Operaciones',
        title: 'Cuando un proceso manual pide una solución digital',
        excerpt: 'Cómo detectar si una tarea necesita automatización, mejor información o una interfaz más clara.',
        intro: 'Digitalizar no significa reemplazar cada tarea manual. El primer paso es reconocer dónde existe una fricción real que afecta tiempo, calidad, trazabilidad o capacidad de decisión.',
        sections: [
            ['El síntoma no siempre es el problema', 'Una planilla duplicada, un mensaje perdido o un registro atrasado son síntomas. Antes de construir una herramienta conviene entender qué decisión depende de esa información, quién la genera y qué ocurre cuando llega tarde o incompleta.'],
            ['Señales que justifican revisar el proceso', 'Tareas repetitivas, información distribuida entre varios canales, errores de transcripción, falta de responsables claros y dificultad para reconstruir lo ocurrido son señales de que el proceso merece ser analizado.'],
            ['La solución puede ser pequeña', 'A veces basta un formulario, un panel o una automatización sencilla. Una buena solución digital reduce fricción sin introducir más complejidad que la necesaria.']
        ]
    },
    {
        slug: 'digitalizar-sin-complicar-la-operacion',
        category: 'Automatización',
        title: 'Digitalizar sin complicar la operación',
        excerpt: 'Claves para avanzar paso a paso sin frenar el trabajo del día a día.',
        intro: 'La digitalización funciona mejor cuando respeta el ritmo de la operación y evita imponer cambios que el equipo no puede sostener.',
        sections: [
            ['Partir por un punto crítico', 'El mejor primer paso suele ser un proceso concreto con impacto visible. Resolverlo permite aprender con poco riesgo antes de ampliar el alcance.'],
            ['Diseñar para la persona que lo usa', 'Menos campos, mensajes claros y acciones visibles reducen errores y aceleran adopción. La interfaz debe acompañar el trabajo, no competir con él.'],
            ['Medir antes de escalar', 'Tiempo ahorrado, reducción de errores, mejor disponibilidad de información y facilidad de uso son señales útiles para decidir si vale la pena extender la solución.']
        ]
    },
    {
        slug: 'que-mirar-antes-de-elegir-una-herramienta',
        category: 'Herramientas',
        title: 'Qué mirar antes de elegir una herramienta',
        excerpt: 'Criterios prácticos para elegir herramientas que realmente se adapten a tu equipo.',
        intro: 'Una herramienta puede tener muchas funciones y aun así no resolver el problema correcto. La elección debe comenzar por el proceso y los usuarios.',
        sections: [
            ['Claridad del objetivo', 'Definir qué se quiere mejorar evita comparar soluciones únicamente por cantidad de funciones.'],
            ['Costo total de uso', 'Además del precio, importa el tiempo de configuración, capacitación, soporte, migración de datos y mantenimiento.'],
            ['Capacidad de crecer', 'Una herramienta útil hoy también debe permitir exportar datos, integrar procesos y evolucionar sin encerrar al negocio en una única forma de trabajar.']
        ]
    },
    {
        slug: 'experiencia-de-usuario-en-servicios-reales',
        category: 'Diseño',
        title: 'Experiencia de usuario en servicios reales',
        excerpt: 'Diseñar desde la realidad de las personas que usan y operan el servicio.',
        intro: 'La experiencia digital de un servicio no termina en una pantalla. Está conectada con personas, tiempos, espacios físicos y decisiones operativas.',
        sections: [
            ['El contexto cambia la interfaz', 'Una herramienta utilizada en cocina, recepción, montaña o terreno necesita prioridades distintas a una aplicación usada desde una oficina tranquila.'],
            ['Diseñar para momentos críticos', 'Las acciones urgentes deben ser evidentes. Estados, confirmaciones y errores requieren una jerarquía visual que ayude a actuar con rapidez.'],
            ['La experiencia también es operación', 'Cuando la información fluye mejor, el usuario recibe respuestas más claras y el equipo puede entregar un servicio más consistente.']
        ]
    },
    {
        slug: 'datos-utiles-para-mejores-decisiones',
        category: 'Datos',
        title: 'Datos útiles para mejores decisiones',
        excerpt: 'Cómo transformar datos operativos en información clara que guía acciones.',
        intro: 'Un dashboard no es útil por mostrar muchos números. Es útil cuando ayuda a detectar una desviación, priorizar una acción o confirmar que un proceso funciona.',
        sections: [
            ['Menos indicadores, mejor contexto', 'Un conjunto reducido de métricas relevantes puede ser más valioso que decenas de gráficos sin una pregunta concreta detrás.'],
            ['Datos con trazabilidad', 'Saber de dónde proviene un dato, cuándo se actualizó y qué proceso lo generó aumenta la confianza en las decisiones.'],
            ['La visualización debe sugerir acción', 'Alertas, tendencias y comparaciones deben responder qué está pasando y qué conviene revisar a continuación.']
        ]
    },
    {
        slug: 'del-problema-al-prototipo-funcional',
        category: 'Producto',
        title: 'Del problema al prototipo funcional',
        excerpt: 'Un enfoque práctico para validar ideas rápido y aprender antes de construir.',
        intro: 'Prototipar permite reducir incertidumbre. Antes de invertir en una solución completa es posible validar flujo, lenguaje, prioridades y utilidad.',
        sections: [
            ['Definir una hipótesis', 'Un prototipo debe intentar responder una pregunta concreta, no representar todas las funciones futuras del producto.'],
            ['Probar con contexto', 'La retroalimentación más valiosa aparece cuando las personas enfrentan una tarea real o un escenario cercano a su trabajo cotidiano.'],
            ['Aprender antes de ampliar', 'Lo que se descubre en una prueba temprana puede cambiar prioridades, simplificar el alcance y evitar desarrollo innecesario.']
        ]
    }
] as const;

export type JoinHookArticle = (typeof articles)[number];
