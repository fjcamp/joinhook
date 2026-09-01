# Control Gastronómico Express (CGE) — Handoff técnico, comercial y de continuidad

**Fecha de corte:** 2026-08-31  
**Repositorio:** `fjcamp/joinhook`  
**Rama canónica pública:** `main`  
**Estado visible en README:** **Beta 0.3**  
**Rutas:** `/herramientas/control-gastronomico-express` y `/app/control-gastronomico-express`

---

## 0. Instrucciones obligatorias para otra IA

1. No confundir CGE con JoinOps. CGE es un producto ligero/local-first; JoinOps es el ERP operacional de mayor alcance.
2. No expandir el MVP de forma automática hacia POS, SII, recetas, cloud, usuarios o multi-sucursal. Esas capacidades pertenecen a evolución posterior o a JoinOps.
3. El estado comercial/pagos debe verificarse antes de mostrar un CTA de cobro. Existe configuración histórica de Link de Pago y existe además un Commerce Core en PR #31 con kill switch; **no asumir que cobros productivos están habilitados**.
4. Mantener `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` mientras no se hayan aprobado los gates de Commerce productivo.
5. Nunca colocar tokens, access tokens, webhook secrets o claves privadas en `NEXT_PUBLIC_*`, repo, docs, issues o chat.
6. El valor del MVP depende de simplicidad y seguridad frente a pérdida de datos. No convertirlo en un ERP complejo antes de validar uso real.
7. Toda nueva función debe demostrar valor para el flujo diario del pequeño negocio gastronómico.
8. Antes de tocar producción revisar incidentes BlueHosting/Passenger y JH-OPS-002 de routing WordPress/.htaccess.
9. Registrar en bitácora cada cambio con rama/commit, tests, resultado, riesgo, siguiente acción y rollback.
10. No declarar ventas, usuarios, ingresos o disponibilidad productiva sin evidencia.

---

## 1. Qué es CGE

Control Gastronómico Express es una PWA local-first para pequeños negocios gastronómicos que necesitan ordenar inventario, compras, mermas y proveedores sin partir por un POS/ERP complejo ni asumir una infraestructura cloud en la validación inicial.

### Propuesta de valor

**Dar visibilidad inmediata del stock, compras y mermas con una herramienta simple que funciona desde el dispositivo y puede respaldarse/exportarse, reduciendo el desorden de cuadernos y planillas.**

### Cliente inicial

- cafeterías;
- pastelerías;
- pequeños restaurantes;
- food trucks;
- emprendimientos gastronómicos;
- negocios con una operación simple que aún no justifica un ERP completo.

---

## 2. Problema que resuelve

El usuario necesita responder rápidamente:

- ¿qué tengo en stock?;
- ¿qué está bajo mínimo?;
- ¿qué compré y a qué proveedor?;
- ¿qué se perdió/mermó y por qué?;
- ¿cuánto valor aproximado hay inmovilizado?;
- ¿puedo respaldar/exportar la información?;

Sin CGE, esta información suele quedar dispersa entre cuadernos, mensajes y planillas.

---

## 3. Alcance actual documentado

### Incluido

- Dashboard con valor de inventario, stock crítico, compras acumuladas y costo estimado de merma.
- Inventario: crear, editar, eliminar, buscar y definir mínimos.
- Compras/entradas con costo y proveedor, incrementando stock.
- Mermas con causa, descontando stock.
- Proveedores y asociación a compras/productos.
- Ajustes trazables.
- Historial/movimientos.
- Sugerencias simples de reposición.
- Importación/exportación CSV.
- Respaldo/restauración JSON.
- PWA y continuidad local.

### Fuera del alcance actual

- cuentas/usuarios;
- sincronización multi-dispositivo;
- multiempresa/multisucursal;
- POS/caja;
- SII/facturación;
- recetas/producción;
- integraciones externas complejas;
- reportería contable completa.

### Arquitectura funcional actual

- Local-first.
- Datos operativos en navegador/dispositivo durante la beta actual.
- Sin base cloud de JoinHook para el core de datos de CGE.
- Respaldo JSON y exportación CSV como mecanismos de portabilidad.

---

## 4. Navegación/UX — trabajo en PR #40

**PR #40:** `CGE — navegación operacional y UX responsive`  
**Rama:** `cge-navigation-ux-2026-08-27`  
**Head observado:** `24335cce52c849cd6d539762bd2872de52eead6f`  
**Estado al corte:** abierto, draft, mergeable; no fusionado.

Incluye:

- rail persistente en escritorio;
- rail compacto en tablet;
- barra inferior móvil;
- jerarquía operación diaria vs funciones secundarias;
- topbar sticky;
- foco de teclado;
- feedback táctil/hover;
- convivencia con PWA;
- `prefers-reduced-motion`.

### Próxima iteración definida en el PR

- Actividad/Movimientos completos.
- filtros por fecha.
- recordatorio de respaldo.
- cierre operacional diario.

### Regla

No fusionar por apariencia solamente. Ejecutar build/tests, revisar responsive, PWA/offline, accesibilidad y que no se rompa persistencia local.

---

## 5. Checkout y Commerce — estado delicado

Existe documentación histórica de un Link de Pago de Mercado Pago y un precio de lanzamiento configurado de **$4.990 CLP**. Esa configuración no debe interpretarse como autorización permanente para cobrar.

Paralelamente existe **PR #31 — Commerce Core v1**, rama `feat/commerce-core-mercadopago`, head observado `b0e65dfd30700dfbb53a7fc8e57385398f50bbba`, que prepara:

- Mercado Pago Orders + Card Payment Brick;
- idempotencia;
- webhooks firmados;
- reconciliación server-side;
- entitlements backend-only;
- recuperación de compra;
- entrega digital segura;
- Supabase Commerce separado;
- estados de reembolso/contracargo;
- `PaymentProviderAdapter`;
- kill switch `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false`.

### Regla canónica para pagos

**No habilitar cobros productivos hasta completar los gates de PR #31 y la formalización/compliance aplicable.**

### Gates principales pendientes de Commerce

1. Desplegar/validar runtime de la rama en BlueHosting.
2. Mantener kill switch en `false` durante QA.
3. Secretos auxiliares de descarga/recuperación server-side.
4. Artefacto digital privado fuera de `public_html`/repo.
5. Sandbox real: aprobado, rechazado, processing/action_required, timeout/5xx, idempotencia y doble intento.
6. Webhooks válidos/incorrectos/duplicados/fuera de orden, chargeback/fraude.
7. Reembolsos total/parcial y revocación de acceso.
8. Expiración, límites y concurrencia de descargas.
9. Correo transaccional server-to-server.
10. QA end-to-end + rollback.
11. Formalización tributaria antes de cobro productivo.

---

## 6. Producción y routing

### JH-OPS-002

Se documentó que WordPress/.htaccess podía interceptar rutas internas de Next.js y devolver un 404 del sitio legacy aun cuando la ruta CGE existía.

Antes de tocar producción:

1. respaldar `.htaccess`;
2. conservar reglas/bloque CloudLinux Passenger necesarios;
3. revisar rewrites WordPress;
4. desplegar artifact completo;
5. sincronizar document root/assets;
6. reiniciar Passenger solo cuando corresponda;
7. smoke tests de landing + app + manifest + assets;
8. comprobar móvil/escritorio;
9. conservar rollback.

### Regla de build

No compilar a ciegas en hosting compartido si el proceso oficial usa artifact generado por CI. Seguir el runbook vigente del repo.

---

## 7. Seguridad y privacidad del MVP

Aunque el MVP es local-first:

- explicar dónde quedan los datos;
- ofrecer respaldo/exportación;
- evitar borrado accidental;
- no transmitir datos sin comunicarlo;
- no pedir información que no es necesaria;
- tratar importaciones como datos no confiables;
- sanitizar CSV/JSON;
- limitar tamaños/formatos;
- proteger contra corrupción de estado local;
- proporcionar recuperación razonable.

Si se incorpora cloud, cambia el perfil de riesgo y deben definirse identidad, RLS, retención, privacidad, backup y exportación antes de lanzar.

---

## 8. Modelo de negocio

### Hipótesis principal

Existe un segmento de pequeños negocios que necesita más control que una planilla, pero menos complejidad y costo que un ERP/POS completo.

### Oferta inicial

Producto simple con onboarding corto y foco en valor inmediato.

### Modelos posibles

1. **Compra única/licencia sencilla** para una versión local estable.
2. **Suscripción baja** si se añaden cloud, sincronización, soporte y mejoras continuas.
3. **Pack fundador/beta** solo con condiciones transparentes y entrega clara.
4. **Upgrade futuro a JoinOps** para negocios que crecen y necesitan multi-sucursal/roles/producción.

El precio `$4.990 CLP` existe como configuración histórica de lanzamiento; debe tratarse como **hipótesis/oferta configurada**, no como decisión irreversible. Revalidar precio, alcance, impuestos, soporte y costos antes de campañas.

### Canales de adquisición

- Facebook/Instagram/LinkedIn de JoinHook;
- grupos/comunidades de gastronomía y emprendimiento;
- venta directa local;
- demostración a cafeterías/pastelerías;
- contenido educativo sobre inventario/merma;
- landing JoinHook.

### Funnel recomendado

1. contenido/problema;
2. landing clara;
3. demo/prueba;
4. feedback;
5. oferta;
6. compra/entrega;
7. onboarding;
8. seguimiento;
9. upgrade/referidos.

---

## 9. Métricas de producto y negocio

### Producto

- activación: usuario registra primer producto + movimiento;
- tiempo hasta primer valor;
- movimientos/semana;
- productos activos;
- mermas registradas;
- backups realizados;
- restauraciones exitosas;
- usuarios que vuelven después de 7/30 días;
- errores de estado/importación.

### Negocio

- visitas landing;
- conversión a demo/uso;
- conversión a compra;
- CAC si hay pauta;
- ingreso por usuario;
- refund/chargeback rate;
- soporte por cliente;
- upgrade a JoinOps;
- margen neto por venta/suscripción.

### Señal de product-market fit temprana

Usuarios que vuelven a registrar movimientos sin que se les recuerde y que usan el sistema para tomar decisiones reales de reposición/merma.

---

## 10. Roadmap recomendado

### P0 — Consolidar Beta 0.3

- verificar `main` actual;
- ejecutar CI/build;
- comprobar persistencia local;
- backup/restore;
- import/export;
- responsive;
- PWA;
- política/condiciones;
- reconciliar PR #40;
- cerrar routing productivo.

### P1 — Flujo diario

- Actividad/Movimientos;
- filtros;
- cierre diario;
- recordatorio de respaldo;
- pequeñas mejoras de reposición.

### P2 — Validación de clientes

- 5–10 usuarios beta reales;
- entrevistas;
- medir tareas/uso;
- eliminar fricción antes de agregar cloud.

### P3 — Monetización segura

- completar Commerce gates;
- formalización;
- sandbox;
- entrega/recuperación;
- soporte;
- política de reembolso.

### P4 — Decisión de evolución

Si el segmento exige multiusuario/multisucursal/recetas, decidir entre:

- extender CGE de forma acotada; o
- migrar/upsell a JoinOps.

Evitar duplicar dos ERPs.

---

## 11. Bitácora resumida

### MVP inicial

Se definió local-first, sin login/backend, con inventario, compras, mermas, proveedores, historial, JSON/CSV y dashboard.

### Beta 0.3

README actual la identifica como Beta 0.3 y lista inventario, stock mínimo, compras, mermas, proveedores, ajustes, reposición simple, CSV, JSON y PWA/local continuity.

### 2026-08-22 a 2026-08-24

Se desarrolló Commerce Core en PR #31; provisioning de prueba y CI quedaron documentados, pero permanecen gates antes de producción.

### 2026-08-27

PR #40 añadió propuesta de navegación operacional responsive, aún draft.

### 2026-08-31

Se crea este handoff. No se activó cobro ni se fusionaron ramas funcionales durante esta actualización de continuidad.

---

## 12. Instrucción lista para otra IA

```text
Estoy retomando Control Gastronómico Express.
Fuente canónica: fjcamp/joinhook + docs/continuity/CONTROL_GASTRONOMICO_EXPRESS_HANDOFF_2026-08-31.md.
CGE es Beta 0.3 local-first; no lo conviertas en JoinOps.
Primero verifica main, CI, PWA, persistencia, backup/restore y routing JH-OPS-002. Luego compara PR #40 y PR #31 con main actual.
No habilites pagos: conserva JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false hasta completar sandbox, seguridad, entrega, QA, formalización y aprobación humana.
Registra bitácora y evidencia de cada cambio.
```

**Fin del handoff — corte 2026-08-31.**
