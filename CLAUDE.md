# Proyecto: Comic Timeline App — Frontend

## Qué es esta app
App web para ubicar a lectores de cómics en cómo leer los timelines de DC y Marvel.
Categorías/subcategorías con recomendaciones de compra y links. Usuarios con JWT
pueden crear colecciones y marcar lecturas. Objetivo: portfolio técnico senior para
búsqueda de empleo en Barcelona (objetivo: 60k€+, rol Senior Full Stack, sin track
de Tech Lead).

## Stack actual
- Next.js + TypeScript
- Tests unitarios con Jest (ya implementado)
- Desplegado antes en Vercel, actualmente caído

## Stack objetivo
- Mantener Next.js + TypeScript
- Añadir tests E2E con Playwright (flujo crítico: registro → login → marcar
  cómic como leído → guardar colección)
- Re-desplegar en Vercel (o servir junto al backend según decisión final de infra)
- UI para el chat conversacional de IA (RAG) — "qué leer si me gustó X sin
  spoilers de Y" — **[frontend hecho, 2026-08-05]** página `/chat`, requiere
  login (endpoint backend exige JWT). Pendiente: backend bloqueado por cuota,
  endpoint `/chat` aún no desplegado — validar end-to-end cuando esté listo
- Integración con backend para auto-categorización (vista de admin)

## Backend relacionado (repo separado)
El backend está en otro repositorio, migrando de Express+JavaScript a TypeScript,
con MongoDB, JWT (añadiendo refresh tokens), y una capa de IA con RAG sobre
MongoDB Atlas Vector Search. Ver roadmap completo en CLAUDE.md del backend.

## Roadmap relevante para este repo
- E2E con Playwright: fase de Oct-Nov (junto con testing backend)
- UI del chat RAG: en paralelo a la fase de IA del backend (Agosto-Sept) —
  frontend completado 2026-08-05 (página `/chat`, componente `ChatWindow`,
  `sendChatMessage` en `lib/api.ts`, tests en Jest). Falta que el backend
  despliegue `/chat` (bloqueado por límites de cuota) para probar end-to-end
- Re-despliegue: depende de la decisión de infra del backend (VPS+k3s vs
  Vercel+Railway), fase Sept-Oct

## Convenciones de trabajo con Claude Code
- El desarrollador dispone de ~2-3 noches/semana, pocas horas cada una: preferir
  tareas troceables en sesiones cortas y auto-contenidas.
- Al iniciar una sesión, indicar en qué fase del roadmap se está trabajando.
- TypeScript estricto, evitar `any`.
- Mantener consistencia de tipos entre frontend y backend donde sea posible
  (considerar compartir tipos si en algún momento se evalúa monorepo).
