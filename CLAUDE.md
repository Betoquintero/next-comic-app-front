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
- Desplegado antes en Vercel, actualmente caído

## Stack objetivo
- Mantener Next.js + TypeScript
- Añadir tests E2E con Playwright (flujo crítico: registro → login → marcar
  cómic como leído → guardar colección)
- Re-desplegar en Vercel (o servir junto al backend según decisión final de infra)
- ~~UI para el chat conversacional de IA (RAG)~~ — **completo y validado
  end-to-end, 2026-09-03** (ver sesión abajo)
- Integración con backend para auto-categorización (vista de admin)

## Backend relacionado (repo separado)
El backend está en otro repositorio, migrando de Express+JavaScript a TypeScript,
con MongoDB, JWT (añadiendo refresh tokens), y una capa de IA con RAG sobre
MongoDB Atlas Vector Search. Ver roadmap completo en CLAUDE.md del backend.

## Roadmap relevante para este repo
- E2E con Playwright: fase de Oct-Nov (junto con testing backend). El flujo
  crítico (registro → login → marcar cómic como leído → guardar colección)
  ya tiene red de seguridad a nivel unitario desde 2026-08-06 (ver abajo),
  así que Playwright en Oct-Nov se apoya sobre una base ya sólida en vez de
  partir de cero
- ~~UI del chat RAG~~ — **completa**: página `/chat`, `ChatWindow.tsx`,
  `parseChatStream`/`assertChatResponseOk` en `lib/api.ts`. Migrada a SSE y
  validada end-to-end contra el backend real el 2026-09-03 (ver sesión abajo)
- Re-despliegue: depende de la decisión de infra del backend (VPS+k3s vs
  Vercel+Railway), fase Sept-Oct. El backend ya está desplegado en
  Hetzner+k3s (`https://157-90-114-16.sslip.io`) desde su sesión 12 — falta
  decidir si el front va a Vercel apuntando ahí, o se sirve desde el mismo
  cluster
- Backend: **roadmap cerrado** desde su sesión 18 (solo queda E2E, marcado
  opcional). Cualquier integración pendiente de aquí en adelante es sobre un
  backend ya estable, no en desarrollo activo en paralelo

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

## Convenciones de trabajo con Claude Code
- El desarrollador dispone de ~2-3 noches/semana, pocas horas cada una: preferir
  tareas troceables en sesiones cortas y auto-contenidas.
- Al iniciar una sesión, indicar en qué fase del roadmap se está trabajando.
- TypeScript estricto, evitar `any`.
- Mantener consistencia de tipos entre frontend y backend donde sea posible
  (considerar compartir tipos si en algún momento se evalúa monorepo).
