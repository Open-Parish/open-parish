# Open Parish — Dashboard

**Open Parish** is an open-source parish certificate management system for Catholic parishes. It provides a clean admin dashboard to create, manage, and print sacramental certificates — baptismal, confirmation, marriage, and death.

---

## Features

- **Baptismal Certificates** — Record and manage baptismal sacrament details including parents, sponsors, and officiating priest
- **Confirmation Certificates** — Track confirmation records with sponsor and priest information
- **Marriage Certificates** — Manage matrimonial records for bride, groom, sponsors, and license details
- **Death Certificates** — Maintain death and burial records including survivors and sacraments
- **Print Support** — Generate and print certificates directly from the dashboard
- **Parish Settings** — Configure parish header lines, priest name, signature, and logo used on all certificates
- **Search & Pagination** — Search records by name with paginated results
- **Dark Mode** — Full light/dark theme support

---

## Tech Stack

| Layer        | Library           |
| ------------ | ----------------- |
| Framework    | React 18 + Vite   |
| UI           | Mantine v7        |
| Routing      | React Router v6   |
| State        | Zustand           |
| Server state | TanStack Query v5 |
| Forms        | Mantine Form      |
| Icons        | Tabler Icons      |
| Auth         | Better Auth       |
| Rich text    | Tiptap            |

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [Open Parish API](../api) running locally

### Install & run

```bash
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173` by default.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Scripts

| Script         | Description                   |
| -------------- | ----------------------------- |
| `dev`          | Start development server      |
| `build`        | Production build              |
| `preview`      | Preview production build      |
| `lint`         | Run ESLint                    |
| `lint:fix`     | Auto-fix lint issues          |
| `format`       | Format with Prettier          |
| `typecheck`    | Run TypeScript compiler check |
| `check`        | Lint + format + typecheck     |
| `test`         | Run unit tests                |
| `test:e2e`     | Run Cypress end-to-end tests  |
| `cypress:open` | Open Cypress test runner      |

---

## Project Structure

```
src/
├── app/              # App entry, routes
├── components/       # Shared UI components
│   ├── DashboardLayout/
│   ├── PageShell/
│   ├── Breadcrumbs/
│   └── ...
├── features/
│   ├── certificates/ # Certificate configs, API, utils, types
│   └── settings/     # Settings API
├── pages/
│   ├── auth/         # Login
│   ├── dashboard/    # Dashboard home
│   ├── certificates/ # List + form pages (shared for all certificate types)
│   └── settings/     # Parish settings
├── store/            # Zustand UI store (sidebar, color scheme)
├── styles/           # Global CSS, Mantine theme
└── context/          # Auth context
```

---

## Certificate Types

Certificate behaviour is driven by config objects in `src/features/certificates/config.ts`. Each config defines:

- API module and certificate type
- Form fields (with type: `text`, `date`, or `number`)
- Default values
- How to derive a display name from a record

Adding a new certificate type requires only a new config entry — no new pages needed.

---

## License

Open source. See repository root for license details.
