# Guia de herramientas del proyecto

Esta guia resume el repo local `appweb-base` y el proyecto base
[`ixartz/Next-js-Boilerplate`](https://github.com/ixartz/Next-js-Boilerplate).
La idea es que puedas entender que hace cada herramienta, por que existe y que
ventaja te trae.

## Lectura rapida
Este proyecto es una base de Next.js para construir una app web moderna con:

- Frontend: Next.js App Router, React 19, TypeScript y Tailwind CSS 4.
- Auth: Clerk para login, registro, MFA, magic links, passkeys y proveedores sociales.
- Base de datos: Drizzle ORM, Postgres, PGlite local y Neon en produccion.
- Calidad de codigo: TypeScript estricto, Ultracite, Oxlint, Oxfmt, Knip e i18n-check.
- Tests: Vitest, Vitest Browser Mode, Playwright, Storybook y visual regression.
- Produccion: Sentry, Spotlight, LogTape, Better Stack, Checkly, Codecov, Arcjet y GitHub Actions.
- Automatizacion: Lefthook, Commitlint, Semantic Release, Dependabot, Crowdin y CodeRabbit.

## Importante: README vs proyecto local

El README del boilerplate menciona algunas herramientas historicas o reemplazadas.
En este proyecto local, lo real es:

| Tema | En el README | En este proyecto local |
| --- | --- | --- |
| Linter | A veces menciona ESLint | Se usa Oxlint mediante Ultracite |
| Formatter | A veces menciona Prettier | Se usa Oxfmt mediante Ultracite |
| Git hooks | Husky reemplazado | Se usa Lefthook |
| Lint staged | Mencionado en el README oficial | No hay paquete `lint-staged` ni en remoto ni en local; Lefthook cubre ese flujo con `glob` y `stage_fixed` |
| Commitizen | Mencionado | Se usa `@commitlint/prompt-cli` con `npm run commit` |
| React Testing Library | Mencionado en texto antiguo | El proyecto usa Vitest Browser Mode y Playwright |
| PostHog | Mencionado como analytics | Hay env vars y logos, pero no hay paquete `posthog-js` directo |
| Three.js | No es parte central del boilerplate | Esta instalado en tu proyecto por la demo del sistema solar |
| Node | README remoto puede pedir Node 24+ | `package.json` local dice `>=20`; CI prueba Node 22 y 24 |

## Flujo de calidad de codigo

### TypeScript

TypeScript revisa tipos antes de compilar. En este proyecto esta en modo estricto.
Eso ayuda a encontrar errores antes de abrir la app en el navegador.

Archivo principal: `tsconfig.json`.

Ventajas:

- Detecta `undefined`, parametros sin usar, imports con problemas y tipos inseguros.
- Permite imports absolutos con `@/`.
- Mejora autocompletado y refactors en VS Code.

Comando:

```bash
npm run check:types
```

### Ultracite

Ultracite es el preset que unifica reglas de lint y formato. En vez de configurar
decenas de reglas manualmente, el proyecto usa presets listos para TypeScript,
React y Next.js.

Archivos:

- `oxlint.config.ts`
- `oxfmt.config.ts`
- `package.json` scripts `lint` y `lint:fix`

Comandos:

```bash
npm run lint
npm run lint:fix
```

Ventajas:

- Menos configuracion manual.
- Reglas consistentes para humanos y agentes de IA.
- Lint con tipos usando `--type-aware --type-check`.

### Oxlint

Oxlint es el linter. Busca bugs, codigo inutil, malas practicas, problemas de
React, TypeScript y Next.js.

Archivo: `oxlint.config.ts`.

En este proyecto:

- Extiende `ultracite/oxlint/core`.
- Extiende reglas para React.
- Extiende reglas para Next.js.
- Ignora `.agents/skills/**`.
- Apaga algunas reglas demasiado estrictas para este boilerplate.
- Activa reglas JSDoc como `jsdoc/require-param` y `jsdoc/require-returns`.

Ventajas:

- Mucho mas rapido que ESLint en proyectos grandes.
- Puede detectar errores con informacion de tipos.
- Ayuda a mantener el codigo uniforme.

### Oxfmt

Oxfmt es el formatter. Reemplaza el rol que normalmente tenia Prettier.

Archivo: `oxfmt.config.ts`.

En este proyecto:

- Usa comillas simples.
- Ordena imports.
- Ordena clases de Tailwind usando `src/styles/global.css`.
- Ignora migraciones, markdown y skills.

Ventajas:

- Evita discusiones de estilo.
- Ordena imports automaticamente.
- Mantiene clases Tailwind mas consistentes.

### Knip

Knip detecta archivos, exports y dependencias no usados.

Archivo: `knip.config.ts`.

Comando:

```bash
npm run check:deps
```

Ventajas:

- Ayuda a limpiar dependencias que ya no usas.
- Reduce peso y mantenimiento.
- Detecta archivos muertos antes de que el proyecto crezca.

### i18n-check

Valida traducciones de `src/locales`.

Comando:

```bash
npm run check:i18n
```

Ventajas:

- Evita que una pagina falle porque falta una key traducida.
- Compara el idioma base con los demas idiomas.
- Mantiene i18n ordenado.

### Lefthook

Lefthook ejecuta tareas antes de confirmar cambios con Git.

Archivo: `lefthook.yml`.

En este proyecto:

- `pre-commit`: ejecuta `npx ultracite fix --type-aware --type-check`.
- `pre-commit`: ejecuta `npm run check:deps`.
- `commit-msg`: ejecuta Commitlint.

Ventajas:

- Evita subir commits con formato roto.
- Corrige codigo automaticamente antes del commit.
- Valida mensajes de commit.

### Commitlint

Commitlint valida que los commits sigan Conventional Commits.

Archivo: `commitlint.config.ts`.

Ejemplos validos:

```text
feat: add dashboard page
fix: repair auth redirect
docs: explain project tooling
```

Ventajas:

- Permite generar changelog automatico.
- Hace mas facil leer el historial.
- Funciona con Semantic Release.

### Commit prompt

`npm run commit` lanza un flujo interactivo para escribir mensajes compatibles.
En este proyecto el paquete directo es `@commitlint/prompt-cli`, no `commitizen`.

Ventajas:

- Te guia para escribir commits correctos.
- Reduce errores con Commitlint.

## Tailwind CSS y estilos

Tailwind CSS 4 es el sistema de estilos principal.

Archivos:

- `src/styles/global.css`
- `package.json` seccion `postcss`
- Dependencias `tailwindcss` y `@tailwindcss/postcss`
- `oxfmt.config.ts` para ordenar clases

`src/styles/global.css` contiene:

```css
@layer theme, base, clerk, components, utilities;
@import 'tailwindcss';
```

Que significa:

- `@import 'tailwindcss'`: carga Tailwind 4.
- `@layer ... clerk ...`: reserva una capa CSS para Clerk y evita conflictos.
- No hay `tailwind.config.js` porque Tailwind 4 puede funcionar con configuracion
  CSS-first.

Ventajas:

- Creas UI rapido con clases utilitarias.
- Menos CSS manual.
- Responsive mas directo con clases como `sm:`, `md:`, `lg:`.
- Oxfmt puede ordenar clases para que no queden caoticas.

## Herramientas del README explicadas una por una

| Herramienta o feature | Que es | Para que sirve | Ventaja practica |
| --- | --- | --- | --- |
| Next.js App Router | Framework React full-stack | Rutas, layouts, server components, metadata, APIs | Base moderna para apps productivas |
| TypeScript | JavaScript con tipos | Detectar errores antes de ejecutar | Menos bugs y mejor autocompletado |
| Tailwind CSS | Framework CSS utility-first | Estilos responsive con clases | UI rapida y consistente |
| AI agent instructions | Archivos como `AGENTS.md` y skills | Dar reglas a Codex, Claude, Cursor, Copilot | Menos cambios fuera de estilo |
| Strict Mode TS/React | Validaciones estrictas | Encontrar efectos y tipos problematicos | Codigo mas robusto |
| Clerk | Auth administrada | Login, registro, perfil, sesiones | Evita construir auth desde cero |
| Magic Links | Login sin password | Enviar link por correo | Menos friccion para usuarios |
| MFA | Multi-factor auth | Segundo factor de seguridad | Menos riesgo de cuentas robadas |
| Social Auth | Login con Google, GitHub, Apple, etc. | Entrar con proveedores externos | Registro mas rapido |
| Passkeys | Auth moderna con biometria/dispositivo | Passwordless seguro | Mejor UX y seguridad |
| User impersonation | Entrar como otro usuario autorizado | Soporte/admin/debug | Diagnostico mas rapido |
| Drizzle ORM | ORM type-safe | Consultas y schema de DB en TypeScript | Menos SQL frágil y migraciones claras |
| PGlite | Postgres local embebido | DB local sin Docker | Desarrollo local mas facil |
| Neon | Postgres serverless | DB remota/produccion | Escala y hosting administrado |
| next-intl | i18n para Next.js | Traducciones y rutas por locale | App multi-idioma ordenada |
| Crowdin | Plataforma de traducciones | Sincronizar JSON de idiomas | Colaboracion con traductores |
| T3 Env | Validacion de env vars | Validar `.env` con Zod | Falla rapido si falta una variable |
| React Hook Form | Formularios React | Manejar inputs, errores y submit | Formularios rapidos y con menos renders |
| Zod | Validacion de datos | Schemas para forms, APIs y env | Misma validacion en varias capas |
| Oxlint | Linter rapido | Detectar errores y malas practicas | Feedback rapido local y en CI |
| Ultracite | Preset de calidad | Reglas listas para lint/formato | Menos configuracion manual |
| Oxfmt | Formatter | Formato, imports y Tailwind | Codigo uniforme |
| Lefthook | Git hooks | Ejecutar chequeos antes del commit | Evita commits rotos |
| Lint-staged | Flujo sobre staged files | Correr checks solo sobre cambios | El README lo menciona, pero el repo actual no instala `lint-staged`; lo resuelve con Lefthook |
| Commitlint | Valida commits | Conventional Commits | Releases y changelog automaticos |
| Commitizen | Asistente de commits | Escribir commits guiados | En local se usa Commitlint prompt |
| Knip | Detecta no usados | Dependencias y archivos muertos | Proyecto mas limpio |
| i18n-check | Valida traducciones | Buscar keys faltantes | Menos errores por idioma |
| Vitest | Test runner | Unit tests y UI tests | Rapido y compatible con Vite |
| Vitest Browser Mode | Tests en navegador real | Probar componentes con DOM real | Mas realista que mocks de DOM |
| Playwright | E2E/browser tests | Probar flujos completos | Detecta bugs reales de navegacion |
| GitHub Actions | CI/CD | Build, lint, tests y release en PR/push | Evita romper main |
| Storybook | Laboratorio de UI | Ver componentes aislados | Diseñar y testear componentes sin toda la app |
| CodeRabbit | Review con IA | Comentarios automaticos en PR | Ayuda a detectar problemas antes del merge |
| Sentry | Error monitoring | Captura errores frontend/backend | Debug de produccion mas rapido |
| Sentry Spotlight | Sentry local | Ver errores locales en UI | Debug sin enviar datos a la nube |
| Codecov | Cobertura de tests | Subir coverage desde CI | Ver zonas sin tests |
| LogTape | Logging | Logs estructurados | Mejor trazabilidad |
| Better Stack | Gestion de logs | Centralizar y consultar logs | Debug en produccion |
| Checkly | Monitoring as Code | Checks Playwright programados | Saber si produccion se cae |
| Arcjet | Seguridad | Bot detection, WAF, rate/security rules | Proteccion sin montar todo manual |
| PostHog | Analytics | Eventos y comportamiento de usuario | Medir uso del producto |
| Semantic Release | Releases automaticos | Versionar y generar changelog | Menos trabajo manual |
| Visual regression | Comparacion visual | Detectar cambios UI no deseados | Evita romper pantallas |
| Absolute imports `@/` | Alias de imports | Importar desde `src` facilmente | Imports mas limpios |
| VS Code config | Settings/extensiones/tasks/debug | Experiencia uniforme de editor | Menos setup manual |
| SEO metadata | Metadata, JSON-LD, OG | Mejor preview y buscadores | Mas visibilidad |
| sitemap.xml | Mapa de URLs | Ayuda a buscadores | Mejor indexacion |
| robots.txt | Reglas para crawlers | Controla crawling | SEO mas controlado |
| Dependabot | Actualizaciones automaticas | PRs de dependencias | Mantener paquetes al dia |
| Drizzle Studio | UI para DB | Explorar tablas y datos | Debug de datos mas facil |
| Drizzle Kit | Migraciones | Generar/aplicar migraciones | Schema controlado por codigo |
| Bundle Analyzer | Analisis de bundle | Ver peso JS | Optimizar performance |
| Tema minimalista | UI base simple | Punto inicial visual | Facil de personalizar |
| Lighthouse score | Performance/a11y/SEO | Medir calidad web | Mejor experiencia y SEO |
| Minify HTML/CSS | Optimizacion Next.js | Reducir tamano de salida | Carga mas rapida |
| Live reload | Dev server | Refrescar al cambiar codigo | Desarrollo rapido |
| Cache busting | Versionar assets | Evitar cache vieja | Usuarios ven cambios correctos |
| Multi-tenancy | Varios clientes/organizaciones | SaaS B2B | Separar datos por tenant |
| RBAC | Roles y permisos | Control de acceso | Seguridad por permisos |
| OAuth SSO | Login empresarial | SSO, SAML, OIDC | Requisito comun B2B |
| Web3 | Wallets cripto | Base, MetaMask, Coinbase Wallet | Apps con identidad wallet |

## Dependencias de produccion

Estas son las dependencias directas bajo `dependencies` en `package.json`.
No incluye dependencias transitivas internas de `package-lock.json`.

| Paquete | Que hace | Donde se ve |
| --- | --- | --- |
| `@arcjet/next` | Integracion de Arcjet con Next.js para seguridad y bot protection | `src/libs/Arcjet.ts`, `src/proxy.ts` |
| `@clerk/localizations` | Traducciones oficiales de UI de Clerk | `src/utils/AppConfig.ts` |
| `@clerk/nextjs` | Auth de Clerk para Next.js | layouts auth y `src/proxy.ts` |
| `@hookform/resolvers` | Conecta React Hook Form con validadores como Zod | `src/components/CounterForm.tsx` |
| `@logtape/logtape` | Logger estructurado | `src/libs/Logger.ts` |
| `@sentry/nextjs` | Error monitoring para Next.js | `next.config.ts`, `src/instrumentation.ts` |
| `@t3-oss/env-nextjs` | Validacion type-safe de variables de entorno | `src/libs/Env.ts` |
| `drizzle-orm` | ORM type-safe para base de datos | `src/models/Schema.ts`, queries |
| `next` | Framework principal | `src/app`, scripts de build/dev |
| `next-intl` | Internacionalizacion y rutas por idioma | `src/libs/I18n*.ts`, `src/locales` |
| `pg` | Driver Postgres para Node.js | `src/utils/DBConnection.ts` |
| `react` | Libreria UI | Componentes TSX |
| `react-dom` | Render de React en navegador | Base de Next.js |
| `react-hook-form` | Manejo de formularios | `src/components/CounterForm.tsx` |
| `three` | Graficos 3D/WebGPU/WebGL | Demo solar `src/components/SolarSystemExperience.tsx` |
| `zod` | Validacion de schemas | `src/libs/Env.ts`, `src/validations` |

## Dependencias de desarrollo

Estas son las herramientas directas bajo `devDependencies`.

| Paquete | Para que sirve |
| --- | --- |
| `@chromatic-com/playwright` | Integracion de visual regression con Playwright/Chromatic |
| `@commitlint/cli` | CLI para validar mensajes de commit |
| `@commitlint/config-conventional` | Reglas Conventional Commits |
| `@commitlint/prompt-cli` | Prompt interactivo para escribir commits |
| `@electric-sql/pglite-socket` | Servidor/socket local para PGlite compatible con Postgres |
| `@faker-js/faker` | Datos falsos para tests o seeds |
| `@lingual/i18n-check` | Validar archivos de traduccion |
| `@next/bundle-analyzer` | Analizar peso de bundles Next.js |
| `@playwright/test` | Test runner E2E de Playwright |
| `@spotlightjs/spotlight` | UI local de errores para Sentry Spotlight |
| `@storybook/addon-a11y` | Checks de accesibilidad en Storybook |
| `@storybook/addon-docs` | Documentacion automatica de componentes |
| `@storybook/addon-vitest` | Ejecutar stories como tests con Vitest |
| `@storybook/nextjs-vite` | Storybook integrado con Next.js usando Vite |
| `@swc/helpers` | Helpers runtime para compilacion SWC/Next |
| `@tailwindcss/postcss` | Plugin PostCSS de Tailwind CSS 4 |
| `@types/node` | Tipos TypeScript para Node.js |
| `@types/pg` | Tipos TypeScript para `pg` |
| `@types/react` | Tipos TypeScript para React |
| `@types/three` | Tipos TypeScript para Three.js |
| `@vitejs/plugin-react` | Plugin React para Vite/Vitest |
| `@vitest/browser` | Browser Mode de Vitest |
| `@vitest/browser-playwright` | Proveedor Playwright para Vitest Browser Mode |
| `@vitest/coverage-v8` | Cobertura de tests usando V8 |
| `babel-plugin-react-compiler` | React Compiler en builds de produccion |
| `checkly` | Monitoring as Code y checks Playwright remotos |
| `cross-env` | Variables de entorno multiplataforma |
| `dotenv-cli` | Cargar `.env` en comandos |
| `drizzle-kit` | Generar/aplicar migraciones y abrir Drizzle Studio |
| `knip` | Detectar dependencias/exports/archivos sin usar |
| `lefthook` | Git hooks rapidos |
| `npm-run-all` | Ejecutar scripts en paralelo o secuencia (`run-p`, `run-s`) |
| `oxfmt` | Formatter de Oxc |
| `oxlint` | Linter de Oxc |
| `oxlint-tsgolint` | Soporte type-aware/type-check para Oxlint |
| `rimraf` | Borrar carpetas cross-platform |
| `semantic-release` | Releases automaticos |
| `storybook` | UI workshop para componentes |
| `tailwindcss` | Framework CSS |
| `typescript` | Compilador y chequeo de tipos |
| `ultracite` | Preset para Oxlint/Oxfmt |
| `vitest` | Unit/UI test runner |
| `vitest-browser-react` | Utilidades React para Vitest Browser Mode |

## Scripts de package.json

| Script | Que ejecuta | Para que lo usas |
| --- | --- | --- |
| `dev` | `run-p db-server:file dev:*` | Levanta DB local, Spotlight y Next dev |
| `dev:next` | `next dev` | Solo Next dev server |
| `dev:spotlight` | `npx @spotlightjs/spotlight` | UI local de errores Sentry |
| `build-local` | `node scripts/build-local.mjs` | Probar build local con PGlite en memoria sin DB externa |
| `build` | Migraciones + `next build` | Build con DB configurada |
| `start` | `next start` | Servir build de produccion |
| `build-stats` | `ANALYZE=true npm run build` | Ver analisis del bundle |
| `clean` | Borra `.next`, `out`, `coverage` | Limpiar artefactos |
| `lint` | `ultracite check --type-aware --type-check` | Revisar calidad |
| `lint:fix` | `ultracite fix --type-aware --type-check` | Corregir formato/lint posible |
| `check:types` | `tsc --noEmit --pretty` | Type check completo |
| `check:deps` | `knip` | Detectar no usados |
| `check:i18n` | `i18n-check ...` | Validar traducciones |
| `commit` | `commit` | Prompt interactivo de commit |
| `test` | `vitest run` | Unit/UI tests |
| `test:e2e` | `playwright test` | Tests E2E |
| `db-server:file` | PGlite local persistente + migraciones | DB local en `local.db` |
| `db-server:memory` | PGlite en memoria + migraciones | Build/test temporal |
| `db:up` | `drizzle-kit up` | Revisar y actualizar metadata interna de migraciones |
| `db:generate` | `drizzle-kit generate` | Crear migracion desde schema |
| `db:check` | `drizzle-kit check` | Validar que las migraciones Drizzle estan correctas |
| `db:migrate` | `dotenv -c -- drizzle-kit migrate` | Aplicar migraciones |
| `db:studio` | `drizzle-kit studio` | Abrir UI de DB |
| `storybook` | `storybook dev -p 6006` | Abrir Storybook |
| `storybook:test` | Vitest con config Storybook | Testear stories |
| `build-storybook` | `storybook build` | Build estatico de Storybook |

## Archivos y carpetas en la raiz

| Ruta | Tipo | Para que sirve |
| --- | --- | --- |
| `.agents/` | Carpeta | Skills/agentes locales usados por Codex y otras herramientas |
| `.git/` | Carpeta | Metadata interna de Git; no editar manualmente |
| `.github/` | Carpeta | Workflows CI, Dependabot, funding y acciones reutilizables |
| `.next/` | Carpeta generada | Build/cache de Next.js; se puede borrar si hay problemas de cache |
| `.next-docs/` | Carpeta | Copia local de docs Next.js para agentes |
| `.storybook/` | Carpeta | Configuracion de Storybook y tests de stories |
| `.vscode/` | Carpeta | Settings, extensiones, tareas y debug para VS Code |
| `local.db/` | Carpeta generada | Base de datos local PGlite persistente |
| `migrations/` | Carpeta | Migraciones SQL generadas por Drizzle Kit en formato de carpetas v3 |
| `node_modules/` | Carpeta generada | Dependencias instaladas por npm |
| `public/` | Carpeta | Assets publicos, favicons, imagenes y logos |
| `scripts/` | Carpeta | Scripts propios del proyecto para automatizar tareas que no caben bien en `package.json` |
| `src/` | Carpeta | Codigo fuente principal de la app |
| `tests/` | Carpeta | Tests E2E e integracion |
| `.coderabbit.yaml` | Config | Reglas del review automatico de CodeRabbit |
| `.env` | Config local | Variables de entorno de desarrollo; no publicar secretos |
| `.env.production` | Config prod | Variables para produccion |
| `.gitignore` | Config Git | Archivos/carpetas que Git debe ignorar |
| `.next-dev.err.log` | Log generado | Errores del dev server capturados localmente |
| `.next-dev.log` | Log generado | Salida del dev server capturada localmente |
| `AGENTS.md` | Instrucciones | Reglas del repo para agentes de IA |
| `arbol-folders.md` | Documento | Archivo local para documentar arbol de carpetas |
| `checkly.config.ts` | Config | Checks remotos de Checkly |
| `CLAUDE.md` | Instrucciones | Puente/instrucciones para Claude Code |
| `codecov.yml` | Config | Reglas de reporte de cobertura |
| `commitlint.config.ts` | Config | Reglas Conventional Commits |
| `crowdin.yml` | Config | Sincronizacion de traducciones con Crowdin |
| `drizzle.config.ts` | Config | Schema, salida y conexion de Drizzle Kit |
| `knip.config.ts` | Config | Exclusiones y reglas de Knip |
| `lefthook.yml` | Config | Git hooks de pre-commit y commit-msg |
| `LICENSE` | Legal | Licencia MIT del proyecto |
| `next-env.d.ts` | Generado Next.js | Tipos globales de Next.js |
| `next.config.ts` | Config | Config principal de Next.js, next-intl, Sentry y bundle analyzer |
| `oxfmt.config.ts` | Config | Formato, imports y orden de clases Tailwind |
| `oxlint.config.ts` | Config | Reglas de lint para TypeScript/React/Next |
| `package-lock.json` | Lockfile | Versiones exactas de dependencias npm |
| `package.json` | Config npm | Scripts, dependencias, engines, overrides y release |
| `playwright.config.ts` | Config | Tests E2E, webServer, traces, videos y browsers |
| `README.md` | Documento | Documentacion original del boilerplate |
| `skills-lock.json` | Config skills | Skills instaladas y hashes |
| `tsconfig.json` | Config | Reglas TypeScript y alias `@/` |
| `tsconfig.tsbuildinfo` | Cache generada | Cache incremental de TypeScript |
| `vitest.config.ts` | Config | Unit tests, browser tests y coverage |
| `herramientas-proyecto.md` | Documento | Esta guia |

## Archivos de herramientas dentro del arbol

Esta seccion completa los archivos de herramientas que aparecen dentro de
`arbol-folders.md` y no quedaban explicados uno por uno en la tabla anterior.

### GitHub, CI y automatizacion

| Ruta | Herramienta | Para que sirve |
| --- | --- | --- |
| `.github/actions/setup-project/action.yml` | GitHub Actions | Accion compuesta reutilizable: instala Node, cachea `node_modules`, corre `npm ci` y puede restaurar cache de `.next` |
| `.github/workflows/CI.yml` | GitHub Actions | Pipeline principal: build con Node 22/24, lint, Knip, i18n, tests, Storybook, E2E, visual regression y coverage |
| `.github/workflows/checkly.yml` | Checkly | Ejecuta checks de monitoreo despues de deployments |
| `.github/workflows/crowdin.yml` | Crowdin | Sincroniza archivos de traduccion entre el repo y Crowdin |
| `.github/workflows/release.yml` | Semantic Release | Publica releases automaticos cuando CI pasa en `main` |
| `.github/dependabot.yml` | Dependabot | Abre PRs mensuales para npm y GitHub Actions, agrupando minor/patch |
| `.github/FUNDING.yml` | GitHub Sponsors | Configura enlaces de financiamiento del proyecto upstream |

### Storybook y tests de componentes

| Ruta | Herramienta | Para que sirve |
| --- | --- | --- |
| `.storybook/main.ts` | Storybook | Define donde buscar stories, carga addons de docs/a11y, usa `@storybook/nextjs-vite`, expone `public/` y activa soporte App Router/RSC |
| `.storybook/preview.ts` | Storybook | Importa `global.css`, configura controles, App Router, tabla de contenido de docs y checks a11y opcionales |
| `.storybook/vitest.config.mts` | Vitest + Storybook | Ejecuta stories como tests en Chromium headless usando Playwright |
| `.storybook/vitest.setup.ts` | Storybook portable stories | Aplica anotaciones de Storybook y del addon a11y antes de correr tests de stories |

### VS Code y experiencia local

| Ruta | Herramienta | Para que sirve |
| --- | --- | --- |
| `.vscode/extensions.json` | VS Code | Recomienda extensiones del proyecto: Oxc, Dotenv, Tailwind, Vitest, REST Client, Playwright, GitHub Actions e i18n Ally |
| `.vscode/settings.json` | VS Code | Fuerza TypeScript del workspace, configura i18n Ally, Oxfmt/Oxlint al guardar, Tailwind/imports y preferencias de autocompletado |
| `.vscode/tasks.json` | VS Code Tasks | Define tarea de type checking con `npm run check:types` como build task principal |
| `.vscode/launch.json` | VS Code Debugger | Lanza Next.js con inspector Node y abre Chrome cuando el dev server esta listo |
| `.vscode/c_cpp_properties.json` | VS Code C/C++ | Configuracion residual para extension C/C++; no afecta Next.js, Drizzle, Tailwind ni tests |

### Drizzle, base de datos y migraciones

| Ruta | Herramienta | Para que sirve |
| --- | --- | --- |
| `drizzle.config.ts` | Drizzle Kit | Define dialecto PostgreSQL, schema `src/models/Schema.ts`, carpeta `migrations/`, `schemaFilter: ['public']` y `DATABASE_URL` |
| `migrations/20250424180756_init-db/migration.sql` | Drizzle Kit | SQL generado para crear/aplicar la estructura inicial de la base de datos |
| `migrations/20250424180756_init-db/snapshot.json` | Drizzle Kit | Snapshot interno del schema usado por Drizzle Kit para comparar cambios futuros |
| `src/models/Schema.ts` | Drizzle ORM | Define las tablas en TypeScript; Drizzle Kit lee este archivo para generar migraciones |
| `src/libs/DB.ts` | Drizzle ORM | Expone la instancia `db` y la cachea en desarrollo para evitar multiples conexiones por hot reload |
| `src/utils/DBConnection.ts` | Drizzle ORM + `pg` | Crea el pool PostgreSQL y conecta Drizzle con `drizzle({ client: pool })` |
| `scripts/build-local.mjs` | PGlite + Drizzle + Next.js | Levanta PGlite en memoria, espera el puerto 5432, aplica migraciones y corre `next build` sin depender de una DB externa |

Nota: si `arbol-folders.md` todavia muestra `migrations/meta`,
`migrations/0000_init-db.sql` o `_journal.json`, esa parte quedo vieja. El
estado actual usa migraciones por carpeta, como recomienda Drizzle Kit nuevo.

### Assets publicos de herramientas

| Ruta | Herramienta relacionada | Para que sirve |
| --- | --- | --- |
| `public/assets/images/arcjet-*` | Arcjet | Logos usados en paginas/demo para mostrar integracion de seguridad |
| `public/assets/images/better-stack-*` | Better Stack | Logos usados para documentar/mostrar gestion de logs |
| `public/assets/images/checkly-logo-*` | Checkly | Logos usados para monitoreo as code |
| `public/assets/images/clerk-logo-dark.png` | Clerk | Logo de auth usado en contenido/demo |
| `public/assets/images/coderabbit-logo-*` | CodeRabbit | Logos usados para review automatico con IA |
| `public/assets/images/crowdin-*` | Crowdin | Logos usados para i18n/traducciones |
| `public/assets/images/posthog-logo.svg` | PostHog | Logo de analytics mencionado por el boilerplate |
| `public/assets/images/sentry-*` | Sentry | Logos usados para error monitoring |
| `public/assets/images/nextjs-boilerplate-*` | Boilerplate | Imagenes promocionales y capturas del starter |

## Carpetas internas importantes

| Ruta | Para que sirve |
| --- | --- |
| `src/app` | Rutas Next.js App Router, layouts, pages, route handlers, sitemap y robots |
| `src/components` | Componentes reutilizables de React |
| `src/libs` | Configuracion de librerias: Arcjet, DB, Env, i18n, logger |
| `src/locales` | Archivos JSON de traduccion |
| `src/models` | Schema de base de datos Drizzle |
| `src/styles` | CSS global y entrada Tailwind |
| `src/templates` | Templates compartidos y stories/tests |
| `src/types` | Tipos compartidos |
| `src/utils` | Configuracion y helpers |
| `src/validations` | Schemas Zod |
| `tests/e2e` | Tests de navegador completo |
| `tests/integration` | Tests de integracion |

## CI y automatizacion

| Archivo | Que hace |
| --- | --- |
| `.github/workflows/CI.yml` | Build, lint, deps, i18n, unit tests, Storybook, E2E, visual regression y coverage |
| `.github/workflows/checkly.yml` | Ejecuta Checkly cuando hay deployment exitoso |
| `.github/workflows/crowdin.yml` | Sincroniza traducciones con Crowdin |
| `.github/workflows/release.yml` | Crea releases con Semantic Release despues de CI |
| `.github/dependabot.yml` | Abre PRs mensuales para dependencias npm y GitHub Actions |
| `.github/actions/setup-project/action.yml` | Reutiliza setup de Node, cache e `npm ci` |

## Configuraciones clave explicadas

### `next.config.ts`

Configura:

- `reactStrictMode: true`.
- React Compiler solo en produccion.
- `next-intl` como plugin de i18n.
- Bundle analyzer cuando `ANALYZE=true`.
- Sentry si `NEXT_PUBLIC_SENTRY_DISABLED` no esta activo.
- `poweredByHeader: false` para no exponer cabecera `x-powered-by`.
- Incluye migraciones en output file tracing.

### `src/proxy.ts`

Es el middleware/proxy de Next.js.

Hace:

- Bot protection con Arcjet.
- Proteccion de rutas dashboard con Clerk.
- Rutas i18n con next-intl.

### `src/libs/Env.ts`

Valida variables de entorno con T3 Env y Zod.

Ventaja:

- Si falta `DATABASE_URL`, `CLERK_SECRET_KEY` o una key publica necesaria, la app falla temprano.
- Evita leer `process.env` desordenadamente por toda la app.

### `src/libs/Logger.ts`

Configura LogTape.

Hace:

- Logs JSON en consola.
- Envia logs a Better Stack si existen token y host.

### `src/instrumentation.ts` y `src/instrumentation-client.ts`

Inicializan Sentry en servidor, edge y navegador.

Incluyen:

- Captura de errores.
- Browser tracing.
- Replay.
- Console logging.
- Spotlight local en desarrollo.

## Que comando usar segun la tarea

| Necesitas | Comando |
| --- | --- |
| Correr la app local | `npm run dev` |
| Ver errores locales de Sentry | `npm run dev:spotlight` |
| Revisar lint | `npm run lint` |
| Arreglar formato/lint automatico | `npm run lint:fix` |
| Revisar tipos | `npm run check:types` |
| Revisar dependencias muertas | `npm run check:deps` |
| Revisar traducciones | `npm run check:i18n` |
| Correr unit/UI tests | `npm run test` |
| Correr E2E | `npm run test:e2e` |
| Generar migracion DB | `npm run db:generate` |
| Aplicar migraciones DB | `npm run db:migrate` |
| Explorar DB | `npm run db:studio` |
| Abrir Storybook | `npm run storybook` |
| Build local seguro | `npm run build-local` |
| Ver peso del bundle | `npm run build-stats` |

## Ventajas reales para ti

- Menos errores antes de publicar: TypeScript, Oxlint, tests y CI fallan temprano.
- Menos desorden: Oxfmt, import sorting, Tailwind sorting y Knip ayudan a mantener limpio el codigo.
- Mejor flujo de equipo: Commitlint, Lefthook, Semantic Release y CodeRabbit ordenan PRs y commits.
- Desarrollo local mas facil: PGlite evita instalar Postgres/Docker para comenzar.
- App lista para produccion: Sentry, logs, Checkly, Codecov, Arcjet y GitHub Actions cubren monitoreo, seguridad y validacion.
- Crecimiento mas facil: i18n, auth, DB schema y rutas ya tienen estructura.

## Fuentes revisadas

- Repo oficial: https://github.com/ixartz/Next-js-Boilerplate
- README raw del repo oficial: https://raw.githubusercontent.com/ixartz/Next-js-Boilerplate/main/README.md
- Docs locales Next.js: `node_modules/next/dist/docs/index.md`
- Next.js App Router: https://nextjs.org/docs/app/getting-started
- Oxlint: https://oxc.rs/docs/guide/usage/linter.html
- Ultracite: https://docs.ultracite.ai/
- Tailwind CSS con Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Playwright config: https://playwright.dev/docs/test-configuration
- Vitest Browser Mode: https://vitest.dev/guide/browser/
- Storybook con Next.js: https://storybook.js.org/docs/get-started/frameworks/nextjs
- next-intl routing: https://next-intl.dev/docs/routing/setup
- Archivos locales revisados: `package.json`, `README.md`, `next.config.ts`, `oxlint.config.ts`,
  `oxfmt.config.ts`, `knip.config.ts`, `lefthook.yml`, `commitlint.config.ts`,
  `drizzle.config.ts`, `playwright.config.ts`, `vitest.config.ts`, `.github/**`,
  `.storybook/**`, `.vscode/**`, `src/libs/**`, `src/proxy.ts` y `src/styles/global.css`.
