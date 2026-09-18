# Mi Gestión Admin — ERD v0.1

**Estado:** DISEÑADO — pendiente de implementación y verificación.

## Entidades

- users
- responsibilities
- capabilities
- processes
- objectives
- tasks
- results
- controls
- decisions
- learnings
- improvements
- audit_events

## Relaciones

```
users 1 ── N responsibilities
users 1 ── N capabilities
users 1 ── N processes
users 1 ── N objectives
users 1 ── N tasks
users 1 ── N results
users 1 ── N controls
users 1 ── N decisions
users 1 ── N learnings
users 1 ── N improvements
users 1 ── N audit_events

responsibilities 1 ── N tasks
responsibilities 1 ── N processes
responsibilities 1 ── N capabilities

objectives 1 ── N tasks
objectives 1 ── N controls

processes 1 ── N tasks
processes 1 ── N results
processes 1 ── N improvements

tasks 1 ── N results
tasks 1 ── N audit_events

decisions 1 ── N learnings
learnings 1 ── N improvements
```

## Reglas

1. Todas las entidades de dominio pertenecen al usuario de la instancia.
2. No existe una entidad company multiusuario en el MVP: la empresa forma parte del contexto profesional del perfil.
3. Las FK de relación deben ser opcionales cuando la operación rápida no requiera vínculo.
4. Las eliminaciones deben preferir archivado/soft delete en entidades con historial.
5. Timestamps UTC.
6. IDs no secuenciales expuestos públicamente.
7. Índices para owner_id, status, due_at/period cuando corresponda.
8. Audit events son append-only.
9. No almacenar credenciales de proveedores en tablas de dominio.
10. Datos externos deben conservar referencia de fuente/provenance cuando sean persistidos.

## Decisión pendiente

Antes de crear migraciones debe verificarse el stack real del repositorio de implementación. Este ERD es un contrato funcional, no una orden de usar una tecnología específica.
