# Proyecto: Comic Timeline App — Frontend

## Qué es esta app
App web para ubicar a lectores de cómics en cómo leer los timelines de DC y Marvel.
Categorías/subcategorías con recomendaciones de compra y links. Usuarios con JWT
pueden crear colecciones y marcar lecturas. Objetivo: portfolio técnico senior para
búsqueda de empleo en Barcelona (objetivo: 60k€+, rol Senior Full Stack, sin track
de Tech Lead).

## Stack actual
- Next.js + TypeScript
- Tests unitarios con Jest — **[2026-09-03]** 21 suites / 169 tests (antes:
  159, ver sesión de refresh token + chat SSE abajo)
- TypeScript estricto real: sin `any` en código de producción, ESLint con
  `next/typescript` activo (antes solo `next/core-web-vitals`, no pillaba
  `any` ni variables sin usar)
- Auth con **access token (15min) + refresh token en cookie httpOnly**,
  igualado al backend — **[2026-09-03]** ver sesión abajo. `authenticatedFetch`
  en `AuthContext.tsx` es el punto único para llamadas autenticadas: adjunta
  el token y hace un refresh-y-reintento silencioso en cualquier 401
- Chat RAG (`/chat`) consume **streaming SSE**, igualado al backend —
  **[2026-09-03]**, validado end-to-end contra el backend real corriendo en
  local (login, refresh automático, logout, y respuesta del chat en streaming)
- **Desplegado en producción real — [2026-09-04]**:
  `https://www.houseofheroes.dev` en Vercel (deploy automático desde
  `master`), apuntando al backend de Hetzner/k3s. Ver sesión abajo
- Tests E2E con Playwright — **[2026-09-04]** 2 specs (`e2e/`), ver sesión
  abajo
- Vista de auto-categorización (`/categorize`) — **[2026-09-04]**, ver
  sesión abajo

## Stack objetivo
- Mantener Next.js + TypeScript
- ~~Añadir tests E2E con Playwright~~ — **completo, 2026-09-04** (ver sesión
  abajo)
- ~~Re-desplegar en Vercel~~ — **completo, 2026-09-04**, `houseofheroes.dev`
  (ver sesión abajo)
- ~~UI para el chat conversacional de IA (RAG)~~ — **completo y validado
  end-to-end, 2026-09-03** (ver sesión abajo)
- ~~Integración con backend para auto-categorización (vista de admin)~~ —
  **completo, 2026-09-04** (ver sesión abajo). Con esto, el roadmap
  original del front queda cerrado por completo

## Deuda técnica pendiente, sin fecha asignada
- ~~`JWT_SECRET_KEY` comiteado en `.env`~~ — **resuelto, 2026-09-05**:
  borrado de `next.config.js` y `.env`. Sigue en el historial de git de
  commits anteriores (no se reescribió el historial); el valor no protegía
  nada real, así que no se consideró necesario rotar/purgar más a fondo.
- ~~Sin CI en este repo~~ — **resuelto, 2026-09-05**:
  `.github/workflows/ci.yml`, ver sesión abajo. Solo Jest (typecheck +
  lint + test + build), no Playwright — el E2E necesita el backend real +
  Atlas corriendo, complicaría demasiado el pipeline para el beneficio
  (checkout de otro repo, secrets de Mongo/Gemini/Claude duplicados aquí)
- ~~El backend no tenía un rol de admin real, y encima `POST/PUT/DELETE
  /issues`/`/events` no exigían ni login~~ — **el hueco de escritura
  anónima se cerró, 2026-09-05** (ver sesión abajo): ahora exigen
  `isAuthenticated`, igual que `/categorize`. Sigue sin existir un rol de
  admin de verdad (`User.role` no se usa en ningún sitio) — no hizo falta
  para cerrar el hueco real, que era la falta de login, no la falta de
  rol. Si algún día se necesita un admin de verdad, sigue pendiente.

## Backend relacionado (repo separado)
El backend está en otro repositorio, migrando de Express+JavaScript a TypeScript,
con MongoDB, JWT (añadiendo refresh tokens), y una capa de IA con RAG sobre
MongoDB Atlas Vector Search. Ver roadmap completo en CLAUDE.md del backend.

## Roadmap relevante para este repo
- ~~E2E con Playwright~~ — **completa, 2026-09-04**: `e2e/signup.spec.ts` +
  `e2e/critical-flow.spec.ts`, corriendo contra el stack real (no mocks).
  Ver sesión abajo
- ~~UI del chat RAG~~ — **completa**: página `/chat`, `ChatWindow.tsx`,
  `parseChatStream`/`assertChatResponseOk` en `lib/api.ts`. Migrada a SSE y
  validada end-to-end contra el backend real el 2026-09-03 (ver sesión abajo)
- ~~Re-despliegue~~ — **completo, 2026-09-04**: front en Vercel
  (`houseofheroes.dev`, dominio propio ya verificado para Resend en el
  backend), apuntando al backend de Hetzner/k3s
  (`https://157-90-114-16.sslip.io`). Ver sesión abajo
- Backend: **roadmap cerrado** desde su sesión 18 (solo queda E2E propio del
  backend, marcado opcional). Cualquier integración pendiente de aquí en
  adelante es sobre un backend ya estable, no en desarrollo activo en
  paralelo
- Único pendiente real del roadmap del front: **vista de admin para
  auto-categorización** (consumir `POST /categorize` del backend)

## Limpieza técnica reciente [2026-08-06]
Auditoría y arreglo del estado de testing/TypeScript en todo el repo, en
paralelo mientras el backend RAG estaba bloqueado por cuota:
- Cobertura de tests: `lib/api.ts` (0%→100%), las 5 páginas de auth
  (0%→100%), `ProfileView.tsx` (61%→100%), `AditionalContext.tsx`
  (10%→100%), `EventDetails.tsx` (91%→100% líneas / 95% ramas)
- Código muerto eliminado: rutas API huérfanas en `app/pages/api/auth/*`
  (nunca se ejecutaban, tenían un login sin validar contraseña — riesgo de
  mala impresión en una entrevista técnica), `lib/auth.ts` (`withAuth` sin
  usar), `toggleIssueReadStatus` en `lib/api.ts` (duplicado, la lógica real
  vive inline en `ProfileView.tsx`), 2 tests huérfanos en `Navbar.test.tsx`
  que no probaban nada real
- Bug real encontrado vía tests: `login/page.tsx` y `reset-password/page.tsx`
  no importaban `React` — funcionaba en producción (runtime automático de
  Next) pero rompía bajo Babel en tests. Corregido
- `package.json`: quitadas dependencias `cookies` y `jsonwebtoken` (y sus
  `@types`), ya sin uso tras borrar las rutas API huérfanas

## Sesión 2026-09-03 — refresh token + chat SSE, para ponerse al día con el backend ya cerrado (completa)
El backend cerró su roadmap con dos cambios de contrato que el frontend
nunca llegó a seguir porque se congeló antes de que el backend los
implementara (sesiones 7 y 10 del backend): access token de 15min +
refresh token en cookie httpOnly, y `/chat` pasó de JSON a streaming SSE.
Sin esto, cualquier sesión real habría empezado a fallar a los 15 minutos, y
el chat habría roto directamente contra el backend real.

**Parte 1 — refresh token:**
- `lib/api.ts`: `refreshAccessToken()` y `logout()` (ambos con
  `credentials:'include'`, imprescindible para mandar/recibir la cookie
  httpOnly cross-origin), y `SessionExpiredError` para que
  `app/profile/[id]/page.tsx` (Server Component) distinga sesión expirada de
  perfil inexistente.
- `AuthContext.tsx`: nuevo `authenticatedFetch(path, init)` — punto único
  para llamadas autenticadas, adjunta el token y hace un
  refresh-y-reintento silencioso en cualquier 401. `logoutUser()` ahora
  llama a `/auth/logout` de verdad (antes solo limpiaba estado local, el
  refresh token seguía vivo en Mongo). Migrados a este helper:
  `ProfileView.tsx` (4 sitios), `ProfileEdit.tsx`, `EventDetails.tsx`.
- `login/page.tsx`: añadido `credentials:'include'` — sin esto el navegador
  descarta el `Set-Cookie` del refresh token por ser cross-origin.
- **Bug real #1, encontrado probando en vivo contra el backend (no en
  tests)**: el chequeo de arranque (`authenticateUser`, la llamada a
  `/auth/me` en el `useEffect` de montaje) no pasaba por
  `authenticatedFetch` — tenía su propia lógica, sin refresh. Efecto real:
  recargar la pestaña con el access token ya caducado (pero el refresh
  token todavía válido) desconectaba al usuario en vez de refrescar en
  silencio, justo el escenario más común que el refresh token debía cubrir.
  Corregido extrayendo la lógica de refresh-y-reintento a un helper
  compartido (`fetchWithRefresh`), usado tanto por `authenticateUser` como
  por `authenticatedFetch`.
- **Bug real #2, encontrado arreglando el #1**: `fetchWithRefresh` devolvía
  `token ?? null`, así que una petición SIN token que aun así tenía éxito
  (caso de test, pero también cualquier ruta que no exigiera auth) se
  interpretaba como "el refresh falló" y disparaba un logout espurio.
  Corregido devolviendo un flag explícito `refreshFailed: boolean` en vez de
  sobrecargar el significado de `token`.
- **Límite conocido, aceptado a propósito**: `app/profile/[id]/page.tsx`
  sigue leyendo la cookie del lado servidor (Server Component) para el
  fetch inicial — si el access token ya caducó en una recarga dura, ese
  fetch server-side falla con 401 antes de que el JS del cliente tenga
  oportunidad de refrescar, y se muestra "session expired" aunque el
  refresh token siga siendo válido. Arreglarlo de verdad necesitaría un
  Route Handler que reciba y reenvíe un `Set-Cookie` nuevo — se dejó fuera
  de esta sesión. El resto de la app (`middleware.ts`, todo lo client-side)
  no tiene este problema porque sí pasa por `authenticatedFetch`.

**Parte 2 — chat SSE:**
- `lib/api.ts`: `sendChatMessage` (JSON) reemplazado por
  `assertChatResponseOk` (mismo manejo de errores 401/429 que antes, ya que
  esos siguen llegando como JSON normal antes de que arranque el stream) +
  `parseChatStream(response, onDelta)` — parser SSE puro sobre
  `response.body.getReader()`, evento `delta` por cada trozo de texto y
  `done` final con `sources`.
- `ChatWindow.tsx`: usa `authenticatedFetch('/chat', ...)` en vez de leer
  `document.cookie` a mano — hereda gratis el refresh-y-reintento de la
  Parte 1. Efecto typewriter: la respuesta se pinta incrementalmente según
  llegan los `delta`.
- **Bug real #3, encontrado escribiendo los tests, no en producción
  todavía**: la bandera `assistantMessageStarted` se mutaba dentro del
  *updater* de `setMessages`, pero React puede diferir esa llamada — el
  código que corría justo después de que el stream terminara la leía
  todavía en `false` y nunca adjuntaba las `sources` al mensaje. Corregido
  mutándola de forma síncrona en `appendDelta`, fuera del updater de React.
- jsdom no trae `TextEncoder`/`TextDecoder` (los usa `parseChatStream` para
  decodificar el stream) — polyfill añadido en `jest.setup.js` con los del
  módulo `util` de Node.
- **Verificado end-to-end contra el backend real** (no solo con tests):
  login, refresh automático (bajando el TTL del backend a 8s temporalmente
  para no esperar 15min, luego revertido), logout con revocación real del
  refresh token en Mongo, y una pregunta real al chat con streaming visible
  y `sources` correctas.

**Deuda dejada fuera, señalada pero no tocada**: `next-comic-app-front/.env`
tiene `JWT_SECRET_KEY` comiteado en git (`git ls-files` lo confirma) y sin
ningún uso en el código actual — quedó huérfano tras la limpieza de rutas
API del 2026-08-06. Debería borrarse de `next.config.js`/`.env` y
considerarse comprometido (rotar si alguna vez tuvo un valor real).

Tests: 163→169 (los 6 nuevos cubren los 2 bugs de refresh + el caso 401 de
`fetchProfileData`). `tsc --noEmit` y `yarn lint` limpios.

## Sesión 2026-09-04 — re-despliegue en Vercel + E2E con Playwright + vista de auto-categorización (completa, roadmap del front cerrado)

**Parte 1 — re-despliegue:**
- Antes de tocar infra, limpieza de referencias muertas encontradas
  explorando el repo: `next-sitemap.config.js`, `app/page.tsx`,
  `app/layout.tsx` apuntaban a `superheroeslegacy.com` — dominio que el
  proyecto ya no posee (re-registrado por otro titular en mayo 2026, según
  el backend). `app/privacy-policy/page.tsx` y `app/tou/page.tsx`
  referenciaban `contact@superheroeslegacy.com`, un buzón que tampoco es
  del proyecto — reemplazado por links al `/contact` real. De paso, `yarn
  build` avisó de que faltaba `metadataBase` en `layout.tsx`: sin eso,
  Next.js resuelve las imágenes Open Graph a `localhost:3000` en
  producción (preview roto al compartir el link) — corregido.
- **Frontend desplegado en Vercel** con dominio propio `houseofheroes.dev`
  (ya verificado en Porkbun para el email de Resend del backend, se
  reutilizó en vez de un `*.vercel.app` genérico). `NEXT_PUBLIC_API_URL`
  apunta al backend real (`https://157-90-114-16.sslip.io/api/v1`).
- DNS en Porkbun: el dominio traía por defecto un registro `ALIAS`/`CNAME`
  al parking de Porkbun (`pixie.porkbun.com`) tanto en la raíz como en
  `www` — había que borrarlo antes de poder apuntar esos hosts a Vercel (`A`
  a la IP de Vercel en la raíz, `CNAME` a `cname.vercel-dns.com` en `www`).
  Vercel usa `www.houseofheroes.dev` como dominio canónico (la raíz hace
  redirect 308 ahí) — el `ORIGIN` del backend debe ser exactamente ese,
  **con el `www`**, no la raíz.
- **Backend actualizado en producción** (SSH al VPS de Hetzner):
  `ORIGIN` y `FRONTEND_URL` en el Secret `hoh-api-secrets` pasaron de
  `localhost:4000` / el dominio perdido a `https://www.houseofheroes.dev`,
  vía `kubectl patch secret --type merge -p '{"stringData":{...}}'` (parche
  quirúrgico de esas dos claves, no un `--from-env-file` que hubiera
  pisado el resto del secret) + `kubectl rollout restart
  deployment/hoh-api`.
- Nota de entorno: el clasificador de modo automático de Claude Code
  bloqueó los comandos SSH que modificaban producción (el de solo lectura
  pasó, el `kubectl patch` con `sudo` no) — el usuario los corrió él mismo
  vía `!` en el chat.
- **Verificado end-to-end contra producción real**: preflight CORS,
  login real vía `curl`, y luego un login completo desde el navegador en
  `https://www.houseofheroes.dev` hasta el perfil autenticado.

**Parte 2 — E2E con Playwright:**
- Decisión clave: `POST /auth/signup` exige verificar el email (link de
  Resend) antes de que `/auth/login` funcione — no se puede automatizar
  ese clic. Se separó en dos specs en vez de forzar una cadena imposible:
  `e2e/signup.spec.ts` (registro real, sin intentar loguear) y
  `e2e/critical-flow.spec.ts` (login con la cuenta fija ya verificada
  `test@houseofheroes.dev` / `Test1234` de
  `back-HouseOfHeroes/scripts/createTestUser.ts` → navega el catálogo por
  UI hasta un evento real → lo guarda en la colección → marca un issue
  como leído → recarga la página para confirmar que persiste de verdad
  contra el backend, no solo estado de React → limpieza: revierte a no
  leído y borra el evento de la colección, para que la cuenta compartida
  quede igual que al empezar).
- Selectores por rol/texto accesible en vez de IDs de Mongo hardcodeados
  (`aria-label="View details for ${part.name}"` en `PartsList.tsx`/
  `PartDetails.tsx`) — resistente a que cambie el catálogo real.
- `playwright.config.ts`: solo arranca el frontend (`webServer: yarn dev`)
  — el backend vive en otro repo/directorio, así que hay que arrancarlo a
  mano antes de `yarn e2e` (`yarn dev` en `back-HouseOfHeroes`, puerto
  8000). Sin integración en CI todavía (el repo no tiene GitHub Actions).
- Corre contra el stack real en local (Atlas real incluida), no contra
  producción (evitaría contaminar `houseofheroes.dev` con datos de test y
  el rate limit real de `/auth/login`) y sin mocks (para eso ya están los
  169 tests de Jest).
- Instalación con `npm`, no `yarn` — a diferencia del backend, este repo
  trackea `package-lock.json`, no `yarn.lock` (un primer intento con `yarn
  add` generó un `yarn.lock` suelto sin trackear; revertido).
- Verificado corriendo `yarn e2e` dos veces seguidas (confirma que la
  limpieza dentro del test deja la cuenta compartida lista para la
  siguiente corrida) — ambas en verde. `yarn test` (169 Jest) y `tsc
  --noEmit` sin romperse.

**Parte 3 — vista de auto-categorización (`/categorize`):**
- Antes de picar código, dos hallazgos explorando el backend que acotaron
  el alcance (decididos con el usuario):
  1. **No hay rol de admin real**: `User.role` existe en el modelo
     (`back-HouseOfHeroes/models/User.ts`) pero ningún middleware lo
     comprueba en ningún sitio — y peor, **`POST/PUT/DELETE
     /issues`/`/events` no tienen ni `isAuthenticated`**, cualquiera sin
     loguear puede llamarlos hoy. El JWT tampoco expone `role`. Decisión:
     la página queda abierta a cualquier usuario logueado, igual que
     `/categorize` en el backend — sin tocar el backend esta sesión (queda
     anotado en deuda técnica arriba).
  2. **`/categorize` solo sugiere, no escribe en Mongo** — y el `POST
     /issues` real ni siquiera acepta `order` ni el evento al que
     pertenece (`schemas/catalog.schema.ts` del backend), así que
     "aplicar" la sugerencia completa no es posible vía la API actual de
     todas formas. Decisión: la vista solo muestra la sugerencia, no
     intenta crear el cómic.
- `lib/api.ts`: tipos `CategorizationSuggestion`/`CategorizationMatch`/
  `CategorizeResult` + `parseCategorizeResponse(response)` — mismo patrón
  de errores que `assertChatResponseOk` (401/429/genérico), más 400
  (falta `name`, ese campo sí es obligatorio en el backend).
- `CategorizeForm.tsx` + `app/categorize/page.tsx` + link "Categorize" en
  `NavBar.tsx`: mismo esqueleto que `ChatWindow.tsx` (auth gate,
  `authenticatedFetch`, toast de error) — sin inventar un patrón nuevo.
  Formulario `name`/`summary`/`description` → panel de resultado con
  universo, evento (badge "New event" si aplica), orden sugerido,
  razonamiento, y los cómics similares en los que se basó.
- Sin bugs nuevos esta parte — reutilizar el patrón ya validado de
  `ChatWindow`/`authenticatedFetch` salió limpio a la primera (180/180
  tests en verde, `tsc`/`lint` limpios).
- **Verificado end-to-end contra el backend real**: con el usuario de
  prueba, pedida la sugerencia para "Injustice: Year Zero #2" (el mismo
  cómic que el backend probó manualmente en su sesión 10) — resultado
  idéntico: universo DC, evento Injustice, orden sugerido 2, razonamiento
  en español, 6 cómics similares listados.

Con esto, **el roadmap original del frontend queda cerrado por
completo** — solo queda la deuda técnica sin fecha listada arriba.

## Sesión 2026-09-05 — limpieza de deuda técnica: secret muerto, CI, y un
fix de seguridad real en el backend (completa)

- ~~`JWT_SECRET_KEY`~~ borrado de `next.config.js`/`.env` (huérfano desde
  la limpieza del 2026-08-06, sin uso real). Sigue en commits antiguos del
  historial de git — no se reescribió el historial, el valor no protegía
  nada real.
- **`.github/workflows/ci.yml`** (nuevo): `npm ci` → `tsc --noEmit` →
  `next lint` → `yarn test` (180 tests) → `yarn build`, en push/PR a
  `master`. Sin Playwright en CI — decisión explícita, el E2E necesita el
  backend real + Atlas corriendo (ver `e2e/` de la sesión 2026-09-04), y
  duplicar esos secrets aquí no compensaba para un repo de portfolio.
- **Fix de seguridad real, en el backend** (`back-HouseOfHeroes`, no este
  repo): explorando qué protegía `/categorize` para la vista de
  auto-categorización (sesión 2026-09-04) se encontró que
  `POST/PUT/DELETE /issues`, `/events` y `/parts` **nunca tuvieron
  `isAuthenticated`** — cualquiera en internet podía escribir en el
  catálogo de producción sin loguearse. Decidido con el usuario: exigir
  login (no inventar un rol de admin que no se usa en ningún otro sitio).
  Corregido en las 3 rutas (9 endpoints), con un test de integración nuevo
  que verifica el 401 sin token, y verificado en runtime real contra Atlas
  (`POST /issues` sin token → 401). Detalle completo en el `CLAUDE.md` del
  backend, sesión 19.

## Convenciones de trabajo con Claude Code
- El desarrollador dispone de ~2-3 noches/semana, pocas horas cada una: preferir
  tareas troceables en sesiones cortas y auto-contenidas.
- Al iniciar una sesión, indicar en qué fase del roadmap se está trabajando.
- TypeScript estricto, evitar `any`.
- Mantener consistencia de tipos entre frontend y backend donde sea posible
  (considerar compartir tipos si en algún momento se evalúa monorepo).
