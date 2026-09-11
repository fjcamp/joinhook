# 08 — JoinHook.cl

## Propósito
Sitio corporativo de JoinHook: empresa, servicios, productos, proyectos, contenidos, contacto y futura sección de alianzas.

## Tecnologías candidatas
- **Ruby on Rails:** CMS/API y formularios.
- **Next.js + TypeScript:** frontend principal y SEO.
- **Django + Python:** CMS/API alternativa.
- **WordPress + PHP:** alternativa práctica sobre BlueHosting/cPanel.

## Estructura
```text
app/                    # páginas y rutas
components/              # componentes UI
content/                 # contenido versionado
public/                  # recursos estáticos
lib/                     # analytics, formularios, integraciones
```

## Requisitos
Contacto, newsletter, analítica, WhatsApp discreto, SEO, privacidad, accesibilidad y sección preparada para alianzas.

## Infraestructura
Vercel/Next.js para la aplicación principal; BlueHosting para servicios cPanel/WordPress/correo cuando corresponda. No reemplazar producción sin staging y backup.
