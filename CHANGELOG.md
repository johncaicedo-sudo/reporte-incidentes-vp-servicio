# Registro de cambios — SQUAD-AGENTES-IA

<!--
Mantenimiento (recomendaciones):
- Actualiza este archivo en el MISMO pull request / commit que el cambio funcional.
- Una entrada por cambio notable; evita listados enormes: agrupa lo menor bajo una sola viñeta.
- Usa [Unreleased] para trabajo ya en main pero sin etiqueta; al publicar, renombra a [X.Y.Z] con fecha ISO (YYYY-MM-DD).
- Sigue SemVer (MAJOR.MINOR.PATCH): rupturas → MAJOR; compatible hacia atrás → MINOR; solo correcciones → PATCH.
- Prefija viñetas con **Ámbito** (Núcleo, Miniverse, Docs, Tooling, Config) para que el changelog único siga siendo legible.
- Generadores (release-please, changesets, conventional changelog): pueden anteponerse a este formato; revisa que las categorías sigan alineadas.
- Para KIRO: en cada release, completa "Notas para migración a KIRO" solo si hay impacto (API, config, dependencias, flujos).
-->

Este documento registra cambios **relevantes** para todos los ámbitos versionados dentro del repositorio **SQUAD-AGENTES-IA** (núcleo de tests y scripts, **Miniverse**, documentación y herramientas). El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere al [Versionamiento semántico (SemVer)](https://semver.org/lang/es/).

## Ámbitos incluidos en este registro

| Ámbito | Descripción breve |
|--------|-------------------|
| **Núcleo** | Paquete raíz, Playwright, Vitest, scripts en `scripts/`, configuración de pruebas |
| **Miniverse** | Aplicación/workspace de agentes en `miniverse/` |
| **Docs** | Contenido en `docs/`, diagramas, onboarding |
| **Tooling** | Scripts en `tools/scripts/`, automatización y reportes |
| **Config** | Plantillas, `platforms.example.json`, reglas Cursor (cuando afecten uso del repo) |

El número de versión del changelog puede alinearse con `version` en `package.json` del núcleo o con etiquetas Git; documenta en cada release qué etiqueta corresponde.

## [Unreleased]

### Agregado

- **Docs** Se actualizó dashboard Portal Intermediarios con alcance detallado (Entregables 4-8, Excelencia Operativa) y nueva pestaña "Dependencias" con grafo radial SVG interactivo (19 nodos, 4 bloqueadores, ruta crítica Saghi)

- **Docs** Se creó plan de implementación (`tasks.md`) para la spec `incremental-weekly-sync` — 14 tareas principales con 21 property tests mapeados a requisitos

- **Docs** Se publicó dashboard de deuda técnica MDSB-5 en GitHub Pages (`docs/dashboard-deuda-tecnica-mdsb-5.html`)

- **Docs** Se agregó tab "Mapa de Dependencias" al dashboard Portal Intermediarios (`docs/dashboard-portal-intermediarios.html`) — visualización radial interactiva con nodo central Portal, 17 nodos orbitales agrupados por categoría (entregables, backend, legacy, externos, nuevas integraciones, infraestructura), ruta crítica resaltada (Saghi, Tronador, FileNet, E6), tooltips con prioridad y descripción, KPIs y leyenda de estados/prioridades
- **Docs** Se agregó tab "Ruta Crítica" al dashboard CUC (`docs/dashboard-cuc.html`) — análisis de dependencias con resumen por fase (3 cards con barras de progreso), lectura ejecutiva, tabla de estatus de 6 componentes bloqueantes con responsables y observaciones, KPIs de estado, y sección de riesgo normativo/jurídico. Diseño replicado del dashboard Bizagi.

- **Docs** Se agregó tab "Grafo Dependencias" al dashboard CUC (`docs/dashboard-cuc.html`) — visualización radial interactiva con nodo central CUC, 7 dominios orbitales, 15 componentes hijos, ruta crítica animada (OCR, Gestor Doc/DAM, Persistencia), tooltips con estado y descripción, KPIs y leyenda de estados
- **Workspace** Se creó carpeta `Workspace/Motor de Suscripcion/` para el proyecto GD-902 (Transformación de Suscripción — Motor suscripción) con informe maestro (.md) y dashboard interactivo HTML (4 tabs: Informe Maestro, Cronograma, Riesgos y Dependencias, Matriz de Coherencia)
- **Docs** Se publicó dashboard de Portal Intermediarios en GitHub Pages (`docs/dashboard-portal-intermediarios.html`) con enlace en `docs/reportes.html`
- **Docs** Se agregó sección "Gestor Documental/DAM/O'Leary — Estado Actual" al informe maestro CUC con datos del reporte O'Leary ECM (funcionalidades, limitaciones, arquitectura desplegada, próximos pasos)
- **Docs** Se agregó diagrama de ruta de migración (FileNet + Stellent → Gestor Documental/DAM/O'Leary) en informe maestro
- **Workspace** Se creó documento HTML de análisis de ingeniería inversa — Reglas de Negocio Simón Ventas Individuales (`Workspace/Simon Ventas/analisis-reglas-negocio-simon-ventas.html`) con 7 secciones: Cotización, Solicitud, Emisión, Modificaciones, Firma Electrónica, Reglas Transversales y Pendientes
- **Workspace** Se creó documento de requerimientos del módulo de Modificaciones de Autos (`Workspace/Simon Ventas/simon-cotizadores-core-wl/.kiro/specs/autos-quotation-new/requirements_modificaciones.md`) — consolida HU GD903-317, GD903-237 y reglas de negocio con 66 requisitos funcionales y 13 no funcionales
- **Workspace** Se inicializó proyecto Node.js 20.x para sincronización incremental semanal (`Workspace/Informe de Incidentes VP de Servicio/`) — package.json con ESM, dependencias exactas (pg, csv-parse, dotenv), devDependencies (vitest, fast-check, testcontainers), estructura de carpetas (src/ con 8 módulos, tests/ con 5 categorías), vitest.config.js y .env.example
- **Workspace** Se implementó jerarquía de errores personalizados (`src/errors.js`) — SyncError base con 7 subclases (ConfigError, JqlError, ExtractionError, TransformError, PersistenceError, RcaError, SnapshotError), cada una con stage, context y timestamp
- **Workspace** Se implementó módulo de utilidades de fecha (`src/utils/date-utils.js`) — función `calculateDays` para diferencia en días calendario con soporte para resolutiondate null
- **Workspace** Se implementó módulo de correlation ID (`src/utils/correlation-id.js`) — generación de UUID v4 usando `crypto.randomUUID()` nativo de Node.js 20.x

### Cambiado

- **Workspace** Se eliminó "Finesse" de todo el informe CUC (dashboard HTML e informe maestro .md) — referencias "FileNet/Stellent/Finesse" simplificadas a "FileNet/Stellent"
- **Workspace** Se eliminó riesgo "Timeout 15 min cargue documentos" de ambos archivos CUC (tabla de riesgos, ruta crítica, dependencias, lectura ejecutiva) — ítems renumerados
- **Workspace** Se reemplazó tabla de riesgos en Tab 4 del dashboard CUC por layout de tarjetas (card-based grid 2 columnas) con badges de severidad, descripciones y mitigaciones

- **Docs** Se renombró "Gestor Documental OLI" / "Gestor OLI" → "Gestor Documental/DAM/O'Leary" en dashboard CUC e informe maestro
- **Docs** Se corrigió arquitectura TO-BE: FileNet y Stellent marcados como AS-IS (a decomisionar), Gestor Doc/DAM/O'Leary como plataforma TO-BE en GCP que los reemplaza
- **Docs** Se actualizaron nodos de arquitectura SVG: cloud provider de Gestor cambiado de AWS a GCP, etiquetas de edges "Migrar" → "Migrar datos"
- **Docs** Se actualizó stack tecnológico inferido con datos reales de O'Leary ECM (GCP Cloud Run, Cloud SQL PostgreSQL, Cloud Storage)

- **Workspace** Se creó carpeta `Workspace/Portal Intermediarios/` con informe maestro y dashboard HTML del proyecto GD-907 (Portal de Intermediarios) — actualización de nomenclatura SAGI→Saghi, reclasificación de riesgos (Backend Saghi a ALTO, Integraciones paralelas a ALTO), eliminación de riesgo Discrepancia SLO

- **Docs** Se generó análisis 360° completo del dashboard Motor Decisión Ágil (`Workspace/plans/analisis-360-dashboard-motor-decision-agil.md`) con datos cuantitativos reales de Datadog: 8 servicios, 30,950 peticiones en 2h, 14 errores 5xx identificados, score de observabilidad 40/60, y 10 recomendaciones priorizadas para el equipo de desarrollo

- **Workspace** Se creó carpeta `Workspace/Bizagi/` con informe maestro del proyecto GD-1136 (Migración e Implementación Bizagi - Flujos de Trabajo BPMS) — incluye resumen ejecutivo, alcance Paquete 1, cronograma, contenido estratégico, matriz de coherencia y riesgos
- **Workspace** Se creó análisis de dependencias arquitectónicas (`Workspace/Bizagi/analisis-dependencias-arquitectura.md`) — mapeo de 30 APIs a 7 bloques de infraestructura (Bizagi SaaS + 3 AWS + 2 GCP + On-Premise), riesgos cross-cloud, cálculo de agotamiento de prompts IA (~3 meses) y 6 recomendaciones para VP TI
- **Workspace** Se creó mapa de dependencias interactivo (`Workspace/Bizagi/mapa-dependencias-apis.html`) — diagrama radial SVG con 12 squads, 30 APIs, tooltips y código de colores por estado/paquete
- **Workspace** Se creó dashboard ejecutivo consolidado (`Workspace/Bizagi/dashboard-bizagi.html`) — 3 tabs: Informe Maestro (documento completo con discrepancias y recomendaciones), Arquitectura (diagrama radial SVG de 7 bloques infra con badges cloud/riesgo), Dependencias APIs por Squad (diagrama radial de 12 squads y 30 APIs con KPIs, leyenda y tooltips)
- **Docs** Se creó presentación HTML interactiva para Presidencia (`docs/presentacion-presidencia-simon-ventas.html`) — Informe de avance Simon Ventas con 6 slides + portada + cierre, colores corporativos ONDA S y navegación por teclado/botones
- **Workspace** Se completó dashboard CUC (`Workspace/Carpeta Unica y Gestor Documental/dashboard-cuc.html`) — agregados tabs 2-4 (Arquitectura TO-BE con 4 capas SVG, Roadmap Gantt 24 semanas con ruta crítica, Dependencias y Riesgos) y script interactivo completo con tooltips y switchTab
- **Config** Se agregó MCP de Draw.io (`@drawio/mcp`) en `.kiro/settings/mcp.json` — servidor oficial de JGraph para crear y abrir diagramas desde el editor
- **Workspace** Se clonó repositorio `simon-cotizadores-core-wl` en `Workspace/Simon Ventas/` y se generó estructura de gobernanza completa (`.kiro/steering/` con 8 archivos de convenciones, `.kiro/specs/` para especificaciones) — documentación del stack legacy (Java 1.8, Struts 1.2.7, DWR, JSP, jQuery, Maven, WebLogic), arquitectura MVC+Facade+Service, naming conventions, reglas de mantenimiento y deuda técnica
- **Workspace** Se creó carpeta `Workspace/Simon Ventas/` para el proyecto GD-903 (PRY Autogestión Pólizas Individuales — Simón Ventas) con informe maestro markdown y dashboard HTML interactivo
- **Workspace** Se creó `Workspace/Simon Ventas/informe-maestro-proyecto.md` — resumen ejecutivo, alcance detallado (6 módulos), cronograma nuevo abordaje (Abril-Julio 2026), contenido estratégico, matriz de coherencia (4 discrepancias), dependencias críticas, arquitectura TO-BE y volumen de negocio (~145K txn/año)
- **Workspace** Se creó `Workspace/Simon Ventas/dashboard-simon-ventas.html` — dashboard ejecutivo con 4 tabs: Informe Maestro (alcance, cronograma, servicios Datadog, matriz de coherencia), Arquitectura TO-BE (diagrama radial SVG interactivo con 8 bloques: OpenL, Tronador, Firma+SARLAFT, Fasecolda, Motor IA, Modificaciones, Documental, Bizagi), Roadmap (Gantt SVG con 4 ramos y marcador HOY), Dependencias y Riesgos (3 pendientes negocio, 4 dependencias técnicas, 5 riesgos con matriz impacto/probabilidad)
- **Workspace** Se creó carpeta `Workspace/Portal Intermediarios/` para el proyecto GD-907 (Portal de Intermediarios) con informe maestro markdown y dashboard HTML interactivo
- **Workspace** Se creó `Workspace/Portal Intermediarios/informe-maestro-proyecto.md` — resumen ejecutivo, alcance (Entregables 4-8 + Excelencia Operativa 31 ítems), cronograma (Abril-Agosto 2026), arquitectura TO-BE (Angular MicroFrontends + Java 11 + Python 3.9 + AWS), 8 integraciones, matriz de coherencia (3 discrepancias), 5 riesgos y equipo completo
- **Workspace** Se creó `Workspace/Portal Intermediarios/dashboard-portal-intermediarios.html` — dashboard ejecutivo con 4 tabs: Informe Maestro (alcance, cronograma, tech stack, matriz de coherencia), Arquitectura TO-BE (diagrama jerárquico SVG 4 capas con 12 nodos: Portal Angular, Microservicios Java, Lambdas Python, API Gateway, Saghi, FCA, FileNet, Tronador, Carpeta Única, Gestor Documental, PostgreSQL RDS, Oracle Legacy), Roadmap (Gantt SVG 20 semanas Abril-Agosto con 5 filas, ruta crítica SAGI, marcador HOY + 5 cards HTML de análisis), Dependencias y Riesgos (3 cards críticas, 4 dependencias técnicas, 5 riesgos con matriz impacto/probabilidad, KPI bar)

### Added

- **Config:** 16 Agent Hooks en `.kiro/hooks/` para enforcement de segregación de funciones del enjambre de agentes:
  - 7 guards de control de acceso MCP (preToolUse): `atlassian-write-guard`, `clarity-mcp-guard`, `datadog-mcp-guard`, `chrome-devtools-guard`, `playwright-mcp-guard`, `github-mcp-guard`, `drawio-mcp-guard`
  - 3 guards de seguridad (preToolUse): `secrets-guard`, `git-safety-guard`, `jira-metadata-check`
  - 1 hook de delegación (promptSubmit): `swarm-delegation-enforcer`
  - 5 hooks de calidad (fileEdited/fileCreated/postToolUse/postTaskExecution): `hardcoded-data-validator`, `doc-updater-reminder`, `agnostico-particular-check`, `lint-on-save`, `post-task-tests`

### Changed

- **Docs:** Actualizado `README.md` — sección Hooks de Agentes refleja los 16 hooks reales; corregido agente autorizado de Draw.io MCP (Doc Updater, no Orquestador).
- **Docs:** Actualizado `docs/architecture/6-inventario-agentes.md` — sección Hooks de enforcement con archivos, categorías y propósitos reales.

### Deprecated

### Removed

### Fixed

- **Docs:** Eliminadas referencias a hooks inexistentes en README (`devtools-mcp-guard`, `agnostic-write-validator`, `readme-auto-updater`, `miniverse-agent-start/stop`).

### Security

- **Config:** Hook `secrets-guard` previene escritura de credenciales hardcodeadas en código fuente.
- **Config:** Hook `git-safety-guard` exige dry-run o stash antes de operaciones git destructivas (basado en incidente real).

### Notas para migración a KIRO

- Los 16 hooks en `.kiro/hooks/` se versionan con el repo y se cargan automáticamente en Kiro al clonar. No requieren configuración manual por usuario.

---

## [1.0.0] — 2026-03-28

Versión de referencia inicial alineada con el núcleo publicado como `1.0.0` en `package.json`. Los datos de ejemplo siguientes son **ilustrativos**; sustitúyelos por tu historial real al adoptar el archivo.

### Added

- **Núcleo:** Proyecto Playwright con smoke agnóstico y artefactos bajo `tests/`.
- **Núcleo:** Scripts npm para auditoría de consola (`audit`) y Lighthouse opcional (`audit:lighthouse`).
- **Miniverse:** Paquete interno con scripts `seed:agents` expuestos vía el paquete raíz.
- **Docs:** Guía de primera interacción y arquitectura de workspace en `docs/`.
- **Tooling:** Generador de reporte HTML de ciclo y despliegue asistido a GitHub Pages.
- **Config:** Plantilla `platforms.example.json` para configuración por plataforma.

### Changed

- **Núcleo:** Configuración de `baseURL` y rutas de informes mediante variables de entorno y `platforms.json` (sin URLs fijas en código).
- **Docs:** Estructura de documentación alineada con enfoque agnóstico por plataforma.

### Deprecated

- **Núcleo:** *(ejemplo)* Uso directo de `LEGACY_REPORT_PATH`; sustituir por `WORKSPACE_ROOT`-aware paths en próximas minor.

### Removed

- *(ejemplo ficticio)* **Tooling:** Script experimental `tools/scripts/old-migrate-paths.cjs` retirado tras estabilizar `workspace-root.js`.

### Fixed

- **Núcleo:** *(ejemplo)* Manejo de timeouts en smoke cuando el `baseURL` devolvía redirecciones encadenadas.
- **Docs:** Enlaces rotos en diagramas exportados a HTML.

### Security

- **Config:** *(ejemplo)* Documentación actualizada para no incluir secretos en `platforms.json` versionado; usar variables de entorno o secret manager.

### Notas para migración a KIRO

Relevancia para una futura migración a **KIRO** (personalizar según tu definición de KIRO: producto, plataforma interna, o estándar de referencia):

| Tema | Relevancia |
|------|------------|
| **Compatibilidad de runtime** | Node.js 18+ requerido; validar equivalente en el entorno KIRO. |
| **Contratos de configuración** | Lectura centralizada desde `WORKSPACE_ROOT` y `platforms.json`; cualquier adaptador KIRO debe mapear estas rutas y variables. |
| **Dependencias** | `playwright`, `vitest`, `eslint`, `prettier` en versiones fijadas en el lockfile; revisar políticas de aprobación en KIRO. |
| **Breaking changes** | Ninguno declarado en 1.0.0 de ejemplo; en releases futuros, lista aquí APIs o env vars eliminadas. |
| **Refactorizaciones** | Separación clara Núcleo / Miniverse facilita migración por fases (tests primero, Miniverse después). |

---

## Plantilla rápida por versión (copiar al publicar)

<!--
Al crear [X.Y.Z], pega y completa:

## [X.Y.Z] — YYYY-MM-DD

### Added
- **Ámbito:** …

### Changed
- …

### Deprecated
- …

### Removed
- …

### Fixed
- …

### Security
- …

### Notas para migración a KIRO
- …
-->

<!--
Enlaces tipo Keep a Changelog (opcional). Sustituye OWNER/REPO por tu remoto:
[Unreleased]: https://github.com/OWNER/REPO/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/OWNER/REPO/releases/tag/v1.0.0
-->
