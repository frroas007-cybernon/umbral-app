# Estado del Proyecto — Umbral

**Última actualización:** 25 de julio de 2026
**Preparado por:** Claude (sesión Cowork, Mac del trabajo)
**Motivo del documento:** Handoff de contexto completo para continuar el trabajo desde cualquier dispositivo (Mac personal, iPad, iPhone) sin perder el hilo de decisiones tomadas.

---

## 1. Qué es Umbral

App de meditación (React + Supabase + Vercel, con wrapper Android vía Capacitor). Pantallas principales: Home, Meditaciones, Afirmaciones, sesión de meditación individual, sesión de afirmación individual, Perfil. Incluye login/registro (email+password y Google OAuth), modo invitado, selector de mood diario, sesiones con video/audio y guardado offline, y un sistema de apoyo/donación vía Mercado Pago.

Repo local: `/Users/franciscoroasanmartin/umbral-app`
Deploy: Vercel (producción activa)
Base de datos: Supabase (Postgres + Auth + RLS)

---

## 2. Autenticación y perfiles — resuelto

- **Problema inicial:** SMTP/Brevo no entregaba correos de confirmación, lo que bloqueaba el registro. Se desactivó "Confirm email" en Supabase Auth como solución inmediata (confirmado y reprobado, funcionando).
- **Pendiente sin urgencia (Tarea #3):** investigar por qué Brevo no entrega correos, relevante el día que se quiera reactivar confirmación de email o flujo de recuperación de contraseña.
- **RLS en tabla `Perfiles`:** políticas activas basadas en `auth.uid() = id` para INSERT/SELECT/UPDATE. Se descartó explícitamente dejar RLS desactivado por exposición de datos.
- **Bug de columna:** existía un typo `date__of_birth` vs `date_of_birth` en el código — corregido.
- **Usuarios huérfanos:** varios usuarios quedaron en `auth.users` sin fila en `Perfiles` (por el problema de SMTP, y porque el login con Google nunca insertaba perfil). Se hizo backfill manual vía SQL Editor.
- **`CompletarPerfil.js`:** pantalla gate que se activa cuando falta género o fecha de nacimiento. Usa `upsert` (no `insert`) para cubrir tanto usuarios nuevos como incompletos. Conectada en `App.js` como paso obligatorio post-login (excepto modo invitado).
- **Modo invitado:** `user.id === 'guest'` no es un UUID válido, así que se excluye explícitamente del chequeo de perfil completo en `App.js` para evitar que quede atrapado en el gate.
- **Fixes iOS:** inputs de fecha y select de género tenían bugs de renderizado/zoom en iOS — corregidos con `fontSize:16`, `WebkitAppearance:none`, `height:50` fijo. (Un caso de "bug" reportado resultó ser solo el navegador in-app de Instagram renderizando distinto — no era un problema real de código.)

---

## 3. Sistema de apoyo/donación (Mercado Pago) — resuelto, en producción

- **Banner `ApoyoBanner.js`:** colapsado dice "Ayúdanos a mantenerla gratis"; expandido incluye campo opcional "Tu nombre", montos sugeridos ($2.000 / $5.000 / $10.000 CLP), monto personalizado, mensaje opcional (placeholder "Déjanos un mensaje (opcional)"), texto centrado "Esto permite mantener siempre gratuita la aplicación".
- **Ubicación del banner:** Home (cerca del final, margen fijo), y en Meditaciones, Afirmaciones, vista de sesión de meditación, vista de sesión de afirmación, y Perfil (reemplazó el bloque viejo de Ko-fi) — en estas últimas con `marginTop: auto` para quedar pegado cerca del footer sin tocarlo.
- **Backend:**
  - `api/crear-pago.js`: crea fila `pending` en tabla `Apoyos`, crea preferencia de Checkout Pro en Mercado Pago, guarda `mp_preference_id`, retorna `init_point`.
  - `api/webhook-mp.js`: recibe notificación de MP, consulta el pago, actualiza la fila `Apoyos` (status, `mp_payment_id`) usando `external_reference`.
  - `back_urls`: éxito → `/?apoyo=exito`, fallo → `/?apoyo=fallo`, pendiente → `/?apoyo=pendiente`, con `auto_return: approved`.
- **Tabla `Apoyos` (Supabase):** columnas `amount, message, name, email, user_id, status, mp_preference_id, mp_payment_id`. RLS activado, sin políticas (acceso solo vía service role desde backend).
- **Modal de agradecimiento (`ApoyoGraciasModal.js`):** se dispara cuando la URL trae `?apoyo=exito`, mismo estilo visual que `MoodModal`.
- **Credenciales:** en producción con Access Token real de Mercado Pago (`APP_USR-...`) desde el commit `168bc3f`.
- **Bug corregido:** si el usuario volvía atrás desde Mercado Pago a mitad de pago, el botón quedaba en "Redirigiendo..." eternamente por el bfcache del navegador. Se arregló con listener de `pageshow` + `event.persisted` para resetear el estado `loading`.
- **Pendiente futuro, explícitamente diferido (Tarea #11):** reemplazar el banner inline por un 4to ícono "Apoyar" en la barra de navegación + vista dedicada de pantalla completa, reutilizando el mismo contenido del formulario actual. No implementar hasta que se pida.

---

## 4. Analytics y tracking de errores (PostHog) — resuelto, en producción

**Decisión:** se evaluó y confirmó que PostHog es gratuito (1M eventos/mes, 100K exceptions/mes, sin tarjeta de crédito) y cubre tanto analytics de producto como error tracking en una sola herramienta, evitando dejar la integración a medias (referencia explícita del usuario a la integración abandonada de Ko-fi/Cafecito para Argentina, que no se quiere repetir).

- **Proyecto PostHog:** ID `527317`, región US, URL `https://us.posthog.com/project/527317`. El nombre del proyecto quedó como "Default project" dentro de la organización "Umbral-app" — es solo un nombre, no afecta el funcionamiento ni significa que los datos estén en otro lado.
- **Frontend (`posthog-js`):** inicializado en `src/analytics.js`, llamado desde `src/index.js` antes del render. Variables de entorno: `REACT_APP_POSTHOG_KEY`, `REACT_APP_POSTHOG_HOST` (configuradas en Vercel, confirmado que el build es posterior a agregarlas).
- **Backend (`posthog-node`):** helper compartido en `api/_posthog.js`, usado por `api/crear-pago.js` y `api/webhook-mp.js`.

### Eventos trackeados (frontend)
- `$pageview` (propiedad `pantalla`) — navegación manual entre pantallas (no hay rutas reales)
- `login_exitoso`, `login_fallido` (motivo)
- `registro_exitoso`, `registro_fallido` (motivo)
- `login_google_iniciado`
- `cambio_modo_login` (propiedad `a`: modo nuevo)
- `omitir_registro_guest`
- `perfil_completado` (genero, tiene_fecha), `completar_perfil_omitido`
- `mood_seleccionado` (mood)
- `audio_guardado_offline` (sesion: 'respiracion' | 'afirmacion-calma')
- `sesion_completada` (tipo, sesion, rating, modo)
- `logout`
- `apoyo_banner_abierto`
- `apoyo_click_pagar` (monto, tiene_mensaje)
- `$exception` — capturado automáticamente vía `window.onerror` / `unhandledrejection`, más `trackError()` explícito en catch blocks de Login, CompletarPerfil, Sesion, AfirmacionDetalle, ApoyoBanner.

### Eventos trackeados (backend, vía `/api`)
- `pago_iniciado` (amount, apoyo_id)
- `pago_aprobado` / `pago_rechazado` / `pago_estado_actualizado` (amount, status, apoyo_id, mp_payment_id)
- `$exception` vía `trackServerError` en fallos de API de Mercado Pago o catches generales.

### Identificación de usuarios
- Usuarios logueados: `posthog.identify(user.id, {email, name, proveedor})` — permite ver el perfil completo de cada persona en PostHog.
- Usuarios invitados/no logueados: quedan con `distinct_id` anónimo (cookie del navegador), sin datos personales, pero PostHog los reconoce como "la misma persona" si vuelven en el mismo dispositivo/navegador.
- Cada evento trae automáticamente: IP (país/ciudad inferidos), navegador, SO, dispositivo, referrer, y `$session_id` que agrupa eventos de una misma visita.

### Verificación (25 de julio 2026)
Confirmado que los eventos llegan correctamente a producción (`omitir_registro_guest`, `Pageview`, `Web vitals` vistos en Activity con URL `umbral-app-psi.vercel.app`). No hubo ningún problema real de configuración — la confusión inicial fue por navegar el wizard de onboarding de PostHog en vez de ir directo a "Activity".

### Dashboard creado: "Umbral - Métricas"
URL: `https://us.posthog.com/project/527317/dashboard/1902732`
7 insights configurados:
1. **Pageviews por pantalla** — Trend de `$pageview` con breakdown por propiedad `pantalla`, últimos 30 días.
2. **Pageviews (last 7 days)** — insight prearmado de PostHog.
3. **Daily active users (DAUs)** — insight prearmado.
4. **Weekly active users (WAUs)** — insight prearmado.
5. **Funnel de registro** — pasos `cambio_modo_login` → `registro_exitoso`.
6. **Funnel de apoyo (pago)** — pasos `apoyo_banner_abierto` → `apoyo_click_pagar` → `pago_aprobado`.
7. **Errores en el tiempo** — Trend de `$exception`, últimos 30 días.
8. **Sesiones completadas por tipo** — Trend de `sesion_completada` con breakdown por propiedad `tipo`.

Nota: los funnels y el trend de errores aún no muestran datos porque nadie ha completado esos flujos específicos desde el deploy — es esperable, se llenarán con uso real o pruebas manuales.

---

## 5. Archivos clave tocados en esta etapa

```
src/App.js                          — estado central, auth, gate de perfil, routing, analytics wiring
src/analytics.js                    — wrapper de PostHog (nuevo)
src/index.js                        — init de analytics
src/screens/Login.js                — login/registro/Google/guest, instrumentado
src/screens/CompletarPerfil.js      — gate post-login, instrumentado
src/screens/Home.js                 — banner de apoyo + tracking de mood
src/screens/Meditaciones.js         — banner de apoyo
src/screens/Afirmaciones.js         — banner de apoyo
src/screens/Sesion.js               — banner de apoyo + tracking de sesión completada
src/screens/AfirmacionDetalle.js    — banner de apoyo + tracking de sesión completada
src/screens/Perfil.js               — banner de apoyo (reemplazó bloque Ko-fi)
src/components/ApoyoBanner.js       — banner de donación (nuevo)
src/components/ApoyoGraciasModal.js — modal de agradecimiento (nuevo)
api/crear-pago.js                   — crea preferencia MP + trackServerEvent
api/webhook-mp.js                   — webhook de confirmación MP + trackServerEvent
api/_posthog.js                     — helper server-side de PostHog (nuevo)
package.json                        — + posthog-js, posthog-node
```

---

## 6. Workflow de deploy / git

- Los commits y push se hacen directo en la Terminal del Mac del usuario (no desde el sandbox de Cowork), porque el sandbox tuvo problemas recurrentes de permisos con `.git/index.lock` (causado por integración de git en segundo plano de VS Code).
- Flujo recomendado: cerrar VS Code si genera conflictos → `rm -f .git/index.lock` → `git add .` → `git commit -m "..."` → `git push`.
- Vercel hace redeploy automático al recibir push a la rama principal.
- Importante: las variables `REACT_APP_*` de Create React App se compilan al momento del build — si se agregan/cambian variables de entorno en Vercel, hay que forzar un Redeploy para que tomen efecto.

---

## 7. Tareas pendientes

- **#3** — Investigar por qué Brevo no entrega correos de confirmación/reset. No urgente mientras "Confirm email" esté desactivado, pero bloqueante el día que se quiera activar recuperación de contraseña.
- **#11** — Reemplazar el banner de apoyo inline por un 4to ícono "Apoyar" en la nav + vista dedicada de pantalla completa. Explícitamente diferido, no implementar sin pedido directo.

---

## 8. Nota sobre continuidad entre dispositivos (multi-Mac / iPad / iPhone)

Esta conversación específica está conectada a una carpeta local (`/umbral-app`) en un Mac particular, lo que significa que **no sincroniza automáticamente** a otros dispositivos — cada sesión de Cowork con carpeta local vive solo en el equipo donde se abrió.

El código sí está sincronizado siempre vía git/GitHub, sin importar el dispositivo.

Para tener un solo hilo de conversación disponible en todos los dispositivos (2 Macs, iPad, iPhone), la recomendación es abrir una sesión de Cowork **desde la web (claude.ai) o desde la app móvil, sin conectar una carpeta local al inicio**. Esa sesión es "remota", vive en la cuenta de Claude, y aparece igual — a mitad de conversación — en cualquier dispositivo. Cuando se necesite editar archivos del proyecto, esa misma sesión puede leer/escribir en la carpeta local solo mientras la app de escritorio esté abierta y la carpeta conectada en el Mac que se esté usando en ese momento.

Este documento fue creado para que, al abrir esa sesión "maestra" nueva, se le pueda compartir como contexto inicial y así no perder ninguna decisión tomada hasta hoy.

La ubicación geográfica (Chile) no afecta en nada la sincronización entre dispositivos — el modelo de cuenta de Claude funciona igual en cualquier país.
