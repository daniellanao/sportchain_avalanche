# SportChain

**Plataforma para invertir y recibir ganancias mediante instalaciones deportivas en Latinoamérica.**

SportChain permite a inversores participar en proyectos de infraestructura deportiva (complejos de pádel, fútbol, tenis, etc.), realizar compromisos de inversión y seguir el progreso de sus inversiones desde un dashboard. El proyecto está preparado para integración futura con **Avalanche** (tokenización y trazabilidad on-chain).

---

## Características

- **Landing y contenido** — Hero, misión/visión, roadmap y comunidad
- **Catálogo de proyectos** — Listado y fichas de proyectos con metas, progreso y rendimiento esperado
- **Compromisos de inversión** — Formulario de compromiso por proyecto, persistido en Supabase
- **Autenticación** — Magic link / OTP con Supabase Auth; perfiles con nombre/apellido
- **Dashboard privado** — Métricas, inversiones activas, historial de transacciones y reclamo de pagos (UI con datos mock; backend por conectar)
- **Eventos** — Sección de eventos deportivos
- **Responsive y accesible** — Tailwind CSS, variables CSS, soporte light/dark según preferencia del sistema

---

## Tech Stack, arquitectura e implementación

### Tech stack

| Capa | Tecnología |
|------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com), variables CSS (tema light/dark) |
| **Backend / Auth / DB** | [Supabase](https://supabase.com) (Auth, PostgreSQL, realtime opcional) |
| **Iconos** | [Font Awesome](https://fontawesome.com) (React) |
| **Fuentes** | Google Fonts: Open Sans (cuerpo), Montserrat (títulos) |

### Decisiones de arquitectura

- **Next.js App Router** — Rutas en `app/`, Server Components por defecto y Client Components solo donde hace falta (forms, auth, dashboard). Favorece SEO y reducción de JS en cliente.
- **Supabase como BaaS** — Un solo backend para auth, perfiles (`profiles`), proyectos (`projects`) y compromisos (`commitments`). Se evita un backend Node/Express propio en esta fase; la anon key y RLS permiten seguridad por fila.
- **Auth con Magic Link / OTP** — Sin contraseñas para el MVP; flujo manejado con `@supabase/ssr` en middleware para refresco de sesión y rutas protegidas (p. ej. `/dashboard`, `/login`).
- **Contexto de auth en cliente** — `AuthContext` + `Providers` envuelven la app para exponer `user`, `session`, `loading` y `signOut` a cualquier componente. El middleware se encarga de refrescar cookies de sesión en cada request.
- **Dos clientes Supabase** — `createClient()` en `lib/supabase/client.ts` para uso en navegador (Client Components); `createClient()` en `lib/supabase/server.ts` para Server Components y Route Handlers, usando cookies de Next.
- **Datos del dashboard** — La pantalla de dashboard usa actualmente datos mock (inversiones, transacciones, métricas). La estructura está pensada para reemplazarlos por datos reales de Supabase (y en el futuro, de Avalanche) sin cambiar la UI.
- **Proyectos desde Supabase** — Las fichas de proyecto (ej. `/proyectos/padel_buenos_aires`) leen de la tabla `projects` por `slug`; los compromisos se guardan en `commitments` y se reflejan en el progreso del proyecto cuando se actualice `amount_committed_usd` (vía triggers o jobs).

### Enfoque de implementación

- **Componentes por sección** — `components/home/` (Hero, MisionVision, Roadmap, Community), `components/projects/` (ProjectHero), `components/Auth/` (MagicOtpLogin, CompleteProfileForm). Navbar y Footer globales.
- **Rutas principales** — `/` (landing), `/proyectos` (listado), `/proyectos/[slug]` (ficha + formulario de inversión), `/eventos`, `/dashboard` (protegida), `/login`, `/demo`. Callback de auth en `/auth/callback`.
- **Hooks y utilidades** — `useAuth()` para estado global de auth; `useProfile()` para cargar/completar perfil; helpers en `lib/supabase/profiles.ts` (p. ej. `isProfileComplete`).
- **Estilos** — Paleta en `app/globals.css` (primary, accent-gold, surface, subtle-text) y `@theme` de Tailwind para uso consistente; clases utilitarias y componentes reutilizables (botones, cards) alineados con la marca.
- **Preparación para Avalanche** — El nombre del repo y la presencia de conceptos como “tokens” y “transaction hash” en el dashboard apuntan a una segunda fase con blockchain (tokenización de participaciones, pagos y auditoría on-chain).

---

## Requisitos previos

- [Node.js](https://nodejs.org) 20+
- Cuenta [Supabase](https://supabase.com) (proyecto con tablas `profiles`, `projects`, `commitments` y Auth habilitado)

---

## Instalación y ejecución

```bash
# Clonar e instalar dependencias
git clone <repo-url>
cd sportchain_avalanche
npm install

# Variables de entorno (crear .env.local)
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Uso |
|--------|-----|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter (ESLint) |

---

## Variables de entorno

Crea `.env.local` en la raíz:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública) de Supabase |

---

## Estructura del proyecto (resumen)

```
├── app/                    # App Router: páginas y layouts
│   ├── page.tsx            # Landing
│   ├── layout.tsx          # Layout raíz (fonts, metadata, Providers, Footer)
│   ├── globals.css         # Variables de tema y Tailwind
│   ├── proyectos/          # Listado y ficha de proyectos
│   ├── eventos/
│   ├── dashboard/          # Área privada (inversiones, métricas)
│   ├── login/
│   ├── auth/               # callback, error
│   └── demo/
├── components/             # Componentes React (Navbar, Footer, forms, cards, etc.)
├── context/                # AuthContext
├── hooks/                  # useProfile, etc.
├── lib/supabase/           # Cliente browser, servidor, middleware, profiles
├── data/                   # Datos estáticos (ej. events)
└── middleware.ts           # Refresco de sesión Supabase
```

---

## Despliegue

Puedes desplegar en [Vercel](https://vercel.com) u otra plataforma compatible con Next.js. Configura las variables de entorno en el panel del proveedor. Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
