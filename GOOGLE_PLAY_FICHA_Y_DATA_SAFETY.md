# Umbral — Contenido para Google Play Console

Preparado: 25 de julio de 2026. Esto es contenido de referencia para cuando llenes los formularios reales en Play Console — cópialo y pégalo ahí, revisando que cada categoría siga aplicando (Google ajusta sus formularios de tanto en tanto).

---

## 1. Formulario "Data Safety" (Seguridad de los datos)

Play Console te va a pedir marcar categorías de datos una por una. Esta es la guía de qué marcar, basada en lo que Umbral realmente recolecta hoy:

### ¿Tu app recopila o comparte alguno de los tipos de datos de usuario requeridos?
**Sí.**

### Tipos de datos a declarar como recolectados

**Información personal**
- Nombre → Sí (se pide al registrarse)
- Dirección de correo electrónico → Sí
- Otra información personal → Sí — aquí entra género y fecha de nacimiento (Google no tiene una casilla específica para "género"/"fecha de nacimiento" en todas las versiones del formulario; si aparece una categoría separada de "Edad" o "Sexo", úsala; si no, va en "Otra info")

**Información financiera**
- Historial de compras → Sí — se registra el monto cuando alguien hace un aporte/apoyo voluntario vía Mercado Pago (Umbral no almacena datos de tarjeta, eso lo procesa Mercado Pago directamente)

**Actividad en la aplicación**
- Interacciones en la app → Sí (qué pantallas visita, qué sesiones completa — vía PostHog)
- Historial de búsqueda en la app → No
- Otras acciones → No

**Info de la app y rendimiento**
- Registros de fallos (crash logs) → Sí (vía PostHog error tracking)
- Diagnósticos → Sí (información de dispositivo/rendimiento)

**Ubicación**
- Ubicación aproximada → Sí — PostHog infiere ciudad/país a partir de la IP, no es GPS ni ubicación precisa

**Identificadores del dispositivo o de otro tipo**
- Identificadores de dispositivo → Sí (vía PostHog, para analítica)

### Para cada tipo de dato marcado, Google te va a preguntar:

**¿Para qué se usa?**
→ "Funcionalidad de la app" (para nombre, email, género, fecha de nacimiento, historial de compras)
→ "Analítica" (para interacciones en la app, diagnósticos, ubicación aproximada, identificadores de dispositivo)

**¿Es obligatorio o se puede excluir (opt-out)?**
→ Nombre/email/género/fecha de nacimiento: Obligatorio (necesario para crear la cuenta, salvo que uses el modo invitado, en cuyo caso no se recolecta nada de esto)
→ Analítica: Se podría marcar como recolectado siempre (hoy no hay opt-out implementado)

**¿Se comparte con terceros?**
→ Marca "No se comparte con terceros" para todo — Supabase, Mercado Pago y PostHog son *procesadores de datos* (proveedores que operan la infraestructura), no terceros a quienes les "compartes" datos con fines propios de ellos. Este es el estándar de la industria y es correcto declararlo así.

**¿Los datos están cifrados en tránsito?**
→ Sí, para todo (HTTPS en toda la app)

**¿Los usuarios pueden solicitar que se eliminen sus datos?**
→ Sí — ya implementamos el flujo de "Eliminar cuenta" dentro de la app (Perfil → Eliminar cuenta)

### URL de política de privacidad
```
https://umbral-app-psi.vercel.app/privacidad.html
```

---

## 2. Ficha de la tienda (Store Listing)

### Título de la app (30 caracteres máx.)
```
Umbral: Meditación y Calma
```

### Descripción breve (80 caracteres máx.)
```
Meditación, afirmaciones y calma diaria, en español y pensada para ti.
```

### Descripción completa (4000 caracteres máx.)
```
Umbral es tu espacio diario para meditar, respirar y reconectar contigo mismo/a — en español, con una mirada latinoamericana, y a un precio accesible.

¿QUÉ ENCONTRARÁS EN UMBRAL?

🧘 Meditaciones guiadas para comenzar tu práctica, sin experiencia previa.
✨ Afirmaciones diseñadas para reprogramar tu diálogo interno y cultivar calma.
🌅 Un check-in diario de cómo te sientes, para acompañar tu proceso día a día.
🎧 Modo solo-audio para practicar sin pantalla, y guardado offline para escuchar sin conexión.
🔥 Seguimiento de tu racha de práctica, para sostener el hábito en el tiempo.

POR QUÉ UMBRAL

Las apps de meditación más conocidas están en inglés y cuestan más de $60.000 CLP al año. Umbral nace en Chile, pensada para hispanohablantes, con contenido de alta calidad de producción y un precio justo — con acceso gratuito a contenido básico y una suscripción accesible para el catálogo completo.

Comienza hoy tu práctica. Un momento de pausa, todos los días, puede cambiar cómo transitas el resto.
```

### Categoría sugerida
`Salud y bienestar` (Health & Fitness)

### Assets gráficos pendientes de producir (no van en el repo, se suben directo en Play Console)
- Ícono de la app: 512×512 px (ya existe en el proyecto: `public/icon-512.png` — hay que confirmar que cumple los márgenes/safe area que pide Google)
- Feature graphic: 1024×500 px (banner horizontal para la ficha — falta producir)
- Capturas de pantalla: mínimo 2, recomendado 4-8, formato teléfono (proporción 16:9 o 9:16) — se pueden tomar directo desde la app una vez instalada
