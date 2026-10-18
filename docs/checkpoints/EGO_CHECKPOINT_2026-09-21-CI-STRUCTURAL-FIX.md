# EGO — Checkpoint de desbloqueo CI y separación de Reporting

**Checkpoint ID:** EGO-CI-STRUCTURAL-FIX-2026-09-21  
**Repositorio:** fjcamp/joinhook  
**Rama:** ego-identity-migration-2026-09-20  
**Pull Request:** #48 — refactor: complete CGE → EGO identity migration  
**Commit de checkpoint:** `69fb9b9d1404f4bed06db5936229150c48f91d52`

## Punto de partida
Se retomó desde **EGO-IDENTITY-MIGRATION-2026-09-20**. El PR #48 estaba corregido en rama, pero Redesign CI terminaba con 0 jobs.

## Diagnóstico demostrado

La causa estructural del 0-job fue aislada.

- `fjcamp/joinhook` es **público**.
- `fjcamp/reporting` es **privado**.
- `.github/workflows/redesign-ci.yml` intentaba declarar, dentro de un workflow que atiende `pull_request`, un reusable workflow privado de `fjcamp/reporting`.
- GitHub no permite que un repositorio público consuma directamente un reusable workflow alojado en un repositorio privado.
- La declaración estaba además condicionada para no ejecutar `reporting-evidence` en PR, pero la incompatibilidad de accesibilidad seguía afectando la validación/arranque del workflow.

## Corrección ejecutada

Se eliminó del **Redesign CI de PR** la declaración del reusable workflow privado de Reporting.

No se eliminó la necesidad arquitectónica de publicar evidencia; se separó esa integración del CI público de PR para resolverla mediante un mecanismo compatible con la visibilidad de los repositorios.

También se eliminaron los archivos temporales usados para aislar el comportamiento del scheduler.

## Verificación real

Commit de corrección: `42a3c1103856432448063085b0b68f6a92cdf450`

Redesign CI run **#429**:
- Run ID: `35649603414`
- Estado: **completed**
- Conclusión: **success**
- Jobs verificables: `build`, `commercial-checkout`, `browser-qa`
- `build`: SUCCESS
- `commercial-checkout`: SUCCESS
- `browser-qa`: SUCCESS

Secret History Scan run **#366**:
- Run ID: `35649603392`
- Conclusión: **success**

Esto demuestra que el bloqueo de 0 jobs no era un fallo demostrado de la aplicación EGO ni de lint/build/browser QA.

## Estado

**CI DESBLOQUEADO / REDESIGN CI VERIFICADO / PR #48 AÚN NO MERGEAR.**

## Próximo paso controlado

1. Diseñar y verificar la publicación de evidencia hacia `fjcamp/reporting` sin reusable workflow privado desde el repositorio público.
2. Mantener el PR #48 sin merge hasta que la estrategia de evidencia quede definida y no introduzca una nueva dependencia estructural.
3. Realizar una última revisión de referencias CGE, separando identidad pública EGO de compatibilidad técnica heredada.
4. Solo después de completar esos gates, evaluar el merge.
