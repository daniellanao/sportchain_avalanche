# SportChain

**Plataforma para invertir y recibir ganancias mediante la operación de instalaciones deportivas en Latinoamérica.**

SportChain permite a inversores participar en proyectos de infraestructura deportiva (complejos de pádel, fútbol, tenis, etc.), realizar inversiones, seguir el progreso de sus participaciones y reclamar pagos desde un dashboard. El proyecto está preparado para integración futura con **Avalanche** (tokenización y trazabilidad on-chain).

---

## Características

- **Landing y contenido** — Hero, misión/visión, roadmap y comunidad
- **Catálogo de proyectos** — Listado (`/proyectos`) y fichas por proyecto con metas, progreso (comprometido/recaudado) y rendimiento esperado
- **Inversión por proyecto** — Página dedicada `/invertir/[slug]`: formulario de monto (múltiplos de 100 USD), wallet simulada y registro en `transactions` y lógica de negocio para `profile_investments`
- **Autenticación** — Magic link / OTP con Supabase Auth; perfiles con nombre y apellido; rutas protegidas (dashboard, invertir)
- **Dashboard privado** — Métricas agregadas desde `profile_investments`, tabla de inversiones por proyecto (con imagen, ubicación, tokens, pagos por cobrar/recibidos), tabla de todos los proyectos con CTA “Invertir”, historial de transacciones desde `transactions`. Reclamar pago genera transacción tipo expense y actualiza inversiones; modales de confirmación para inversión y pago reclamado
- **Eventos** — Sección de eventos deportivos
- **Responsive y accesible** — Tailwind CSS v4, variables CSS, soporte light/dark según preferencia del sistema

---

## Tech stack

| Capa | Tecnología |
|------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com), variables CSS (tema light/dark) |
| **Backend / Auth / DB** | [Supabase](https://supabase.com) (Auth, PostgreSQL) |
| **Iconos** | [Font Awesome](https://fontawesome.com) (React) |
| **Fuentes** | Google Fonts: Open Sans (cuerpo), Montserrat (títulos) |

---

## Arquitectura y decisiones

- **Next.js App Router** — Rutas en `app/`. Client Components donde hace falta (formularios, auth, dashboard, tablas).
- **Supabase como BaaS** — Auth, perfiles (`profiles`), proyectos (`projects`), compromisos (`commitments`), inversiones por perfil (`profile_investments`) y transacciones (`transactions`). Cliente browser en `lib/supabase/client.ts` y cliente servidor en `lib/supabase/server.ts`; middleware para refresco de sesión.
- **Auth** — Magic link / OTP; `AuthContext` + `Providers` en cliente; `useProfile()` y `isProfileComplete()` para completar perfil antes de acceder al dashboard.
- **Dashboard por componentes** — `MetricsBoxes` (desde `profile_investments`), `InvestmentsTable` (inversiones por proyecto, reclamar pago), `ProjectsTable` (listado de proyectos con Invertir), `TransactionsTable` (historial desde `transactions`). Confirmaciones con `ConfirmationModal` reutilizable.
- **Flujo de inversión** — Dashboard o proyectos → “Invertir” → `/invertir/[slug]` (solo si logueado). Formulario: monto (múltiplos de 100), wallet simulada; al enviar: insert en `transactions` (tipo income) y lógica/triggers para mantener `profile_investments`; redirección a dashboard con modal de confirmación.
- **Preparación para Avalanche** — Utilidad en `lib/wallet.ts` para conectar wallet (Avalanche C-Chain). En la app, el flujo de invertir usa por ahora una wallet simulada; los hashes de transacción son generados localmente para trazabilidad futura.

---

## Requisitos previos

- [Node.js](https://nodejs.org) 20+
- Cuenta [Supabase](https://supabase.com) con:
  - Auth habilitado
  - Tablas: `profiles`, `projects`, `commitments`, `profile_investments`, `transactions` (y triggers/vistas que mantengan agregados y progreso)

---

## Instalación y ejecución

```bash
# Clonar e instalar dependencias
git clone https://github.com/daniellanao/sportchain_avalanche.git
cd sportchain_avalanche
npm install
```

Crea `.env.local` en la raíz con las variables de Supabase (ver sección siguiente).

```bash
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
| `npm run lint` | ESLint |

---

## Variables de entorno

En la raíz, crea `.env.local`:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública) de Supabase |

---

## Estructura del proyecto

```
├── app/
│   ├── page.tsx                 # Landing
│   ├── layout.tsx               # Layout raíz (fonts, metadata, Providers, Footer)
│   ├── globals.css              # Variables de tema y Tailwind
│   ├── proyectos/               # Listado y ficha de proyectos
│   │   ├── page.tsx             # Listado de proyectos
│   │   └── padel_buenos_aires/  # Ficha ejemplo (slug)
│   ├── invertir/[slug]/         # Página de inversión por proyecto (protegida)
│   ├── dashboard/               # Dashboard (protegido)
│   ├── eventos/
│   ├── login/
│   ├── auth/                    # callback, error
│   └── demo/
├── components/
│   ├── dashboard/               # Componentes del dashboard
│   │   ├── MetricsBoxes.tsx     # Métricas desde profile_investments
│   │   ├── InvestmentsTable.tsx # Mis inversiones, reclamar pago
│   │   ├── ProjectsTable.tsx    # Todos los proyectos, CTA Invertir
│   │   └── TransactionsTable.tsx# Historial de transacciones
│   ├── Auth/                    # MagicOtpLogin, CompleteProfileForm
│   ├── home/                    # Hero, MisionVision, Roadmap, Community
│   ├── projects/                # ProjectHero
│   ├── ConfirmationModal.tsx    # Modal reutilizable (éxito pago/inversión)
│   ├── ProjectCard.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useProfile.ts
├── lib/
│   ├── supabase/                # client, server, middleware, profiles
│   └── wallet.ts                # Utilidad Avalanche C-Chain (opcional)
└── middleware.ts                # Refresco de sesión Supabase
```

---

## Rutas principales

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Landing | Público |
| `/proyectos` | Listado de proyectos | Público |
| `/proyectos/[slug]` | Ficha de proyecto (ej. padel_buenos_aires) | Público |
| `/invertir/[slug]` | Formulario de inversión (monto, wallet) | Logueado |
| `/dashboard` | Métricas, mis inversiones, proyectos, transacciones | Logueado + perfil completo |
| `/login` | Inicio de sesión (Magic link / OTP) | Público |
| `/eventos` | Eventos deportivos | Público |

---

## Despliegue

Puedes desplegar en [Vercel](https://vercel.com) u otra plataforma compatible con Next.js. Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el panel del proveedor. Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
