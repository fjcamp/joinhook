# CGE — Checkpoint de auditoría de estado real
## 2026-09-18 — REAL-AUDIT

**Proyecto:** Control Gastronómico Express (CGE)  
**Nombre actual del producto en código:** Control Gastronómico Express  
**Estado de repositorio:** IMPLEMENTADO DENTRO DE `fjcamp/joinhook`; NO existe actualmente un repositorio independiente CGE identificado entre los repositorios accesibles de `fjcamp`.  
**Estado operativo:** MVP funcional/local-first con capa comercial y checkout documentado; pendiente de cierre de validación real antes de declararlo listo para lanzamiento público estable.  
**Regla arquitectónica:** CGE debe permanecer independiente de JoinOps a nivel funcional y de producto. Este checkpoint registra la situación real del código, no una arquitectura futura.

## 1. Evidencia verificada

Repositorio que contiene el código actual:
- `fjcamp/joinhook`
- rama por defecto: `main`
- repositorio público.
- No aparece un repositorio independiente llamado CGE, Control Gastronómico Express o equivalente en los repositorios accesibles de `fjcamp`.

Archivos principales verificados:
- `src/pages/app/control-gastronomico-express.tsx`
- `src/pages/herramientas/control-gastronomico-express.tsx`
- `docs/control-gastronomico-express-mvp.md`
- `docs/cge-beta-test-10min.md`
- `docs/cge-checkout-config.md`
- `docs/cge-launch-kit-v1.md`
- `docs/launch-control-gastronomico-express.md`
- `docs/pre-staging-qa.md`

## 2. Funcionalidad realmente presente

La documentación y el código verificables muestran:
- onboarding;
- dashboard;
- inventario;
- alta/edición/eliminación/búsqueda de productos;
- stock mínimo;
- compras y actualización de stock;
- mermas por causa;
- ajustes de stock;
- proveedores;
- historial de movimientos;
- sugerencias simples de reposición;
- importación/exportación CSV;
- respaldo/restauración JSON;
- PWA/local-first;
- ausencia de login/backend para la validación inicial.

El flujo beta documentado incluye un recorrido completo de 10 minutos desde onboarding hasta respaldo/restauración y define criterios explícitos de prueba.

## 3. Capa comercial verificada

La landing existente incluye:
- posicionamiento de herramienta simple para pequeños negocios gastronómicos;
- beta gratuita;
- pack fundador;
- precio documentado de $4.990 CLP;
- fallback por correo;
- FAQ;
- datos estructurados/SEO;
- CTA hacia la aplicación.

Existe configuración documentada para checkout de Mercado Pago. La configuración exige HTTPS y bandera explícita; staging debe permanecer sin cobros. Las variables `NEXT_PUBLIC_*` no deben contener secretos.

## 4. Historial relevante verificado

Commits CGE identificados en `fjcamp/joinhook`:
- `4a0e8c99ab38735ad3fe86b9094e977addbd87fd` — landing inicial CGE.
- `514318cd904e14d6fb4ff915e6d382f0570650ef` — CGE MVP 0.2: local-first, onboarding, inventario, compras, mermas, proveedores, ajustes, sugerencias, CSV, respaldo y Soft UI.
- `b7b917a5cc9203ad84118962a7eafdf1945402b2` — capa comercial v1.
- `43799bbf2911f0bb77177a6d02f7590865c57fbd` — checkout comercial condicionado y pack fundador.
- `c3daf50e7500482c1faabab6e37315f8e550461b` — integración/documentación de checkout Mercado Pago y verificación del enlace en artifact.

## 5. Hallazgos

### H1 — Repositorio incorrectamente acoplado
**Severidad: ALTA / estructural**

El código de CGE está dentro de `fjcamp/joinhook`. Esto contradice la decisión de producto de mantener CGE como proyecto independiente y sin conexión técnica con JoinOps.

**Consecuencia:** el código existe y es recuperable, pero la separación de repositorio todavía no está cerrada.

**Acción futura:** extraer/migrar CGE a un repositorio propio sin perder historial ni introducir dependencia de JoinOps. No realizar esta migración como parte de este checkpoint sin una etapa específica de migración y verificación.

### H2 — Lanzamiento real aún no demostrado por esta auditoría
**Severidad: ALTA**

La existencia del código, documentación y configuración no demuestra por sí sola que el recorrido completo haya sido validado en el dominio/staging real con móvil, escritorio, PWA/offline, restauración y checkout.

**Acción:** ejecutar el protocolo `docs/cge-beta-test-10min.md` y el checklist pre-staging/launch en entorno real.

### H3 — Persistencia local implica riesgo operativo
**Severidad: ALTA para uso real**

La beta guarda datos en el navegador/dispositivo y no dispone de sincronización cloud. La pérdida de datos del navegador puede afectar la información si no existe un respaldo.

**Acción:** mantener respaldo/restauración como parte del flujo principal y verificarlo en pruebas reales.

### H4 — Alcance deliberadamente limitado
**Severidad: informativa**

No se debe convertir CGE en un ERP. El alcance inicial excluye POS/caja, SII, multiusuario complejo, remuneraciones, IA avanzada y ERP completo.

### H5 — Checkout requiere validación comercial final
**Severidad: MEDIA**

Existe configuración documentada para Mercado Pago, pero antes de declarar lanzamiento estable deben verificarse en el entorno real CTA, monto, URL, condiciones, datos del vendedor y recorrido de compra.

## 6. Estado por dimensión

| Dimensión | Estado real |
|---|---|
| Concepto/producto | DEFINIDO |
| MVP funcional | IMPLEMENTADO |
| Inventario | IMPLEMENTADO |
| Compras | IMPLEMENTADO |
| Mermas | IMPLEMENTADO |
| Proveedores | IMPLEMENTADO |
| Ajustes/historial | IMPLEMENTADO |
| Stock mínimo/reposición | IMPLEMENTADO |
| CSV | IMPLEMENTADO |
| Backup/restauración | IMPLEMENTADO |
| PWA/local-first | IMPLEMENTADO / PENDIENTE DE VALIDACIÓN REAL COMPLETA |
| Landing comercial | IMPLEMENTADA |
| Checkout | IMPLEMENTADO/CONFIGURADO; VALIDACIÓN REAL PENDIENTE |
| QA beta | DOCUMENTADO; EJECUCIÓN REAL PENDIENTE |
| Repositorio independiente | PENDIENTE |
| Lanzamiento público estable | PENDIENTE |

## 7. Estado oficial del checkpoint

**CGE-REAL-AUDIT-2026-09-18**

Estado: **MVP IMPLEMENTADO — PRE-BETA / PRE-LAUNCH — REVIEW REQUIRED**

No se debe interpretar este checkpoint como “CGE terminado para producción”. La base funcional existe, pero quedan dos cierres estructurales antes de declararlo listo:
1. validación real de beta/staging/producción;
2. separación del código hacia un repositorio CGE independiente, preservando trazabilidad.

## 8. Próxima etapa obligatoria

INVESTIGAR → DISEÑAR → IMPLEMENTAR → VERIFICAR → CORREGIR → RESPALDAR → CHECKPOINT → CONTINUAR

**Próxima etapa:** CGE-R1 — separación de repositorio + auditoría de release.

Antes de modificar funcionalidad, se debe preservar este estado como referencia y no reconstruir el MVP desde cero.
