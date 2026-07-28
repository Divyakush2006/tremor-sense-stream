<div align="center">

# TremorSense

### Real-time tremor & vibration monitoring dashboard with ML-driven hazard inference and automated evacuation alerting

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-divyakush.com-C9A96E?style=flat&logo=googlechrome&logoColor=white)](https://www.divyakush.com)

</div>

---

## Overview

**TremorSense** is an operations dashboard for seismic and structural-vibration monitoring. It ingests live sensor telemetry, scores it against a hazard model, surfaces the current risk state at a glance, and — when a threshold is breached — raises audible alerts and drives an automated evacuation workflow.

The application is the **monitoring and control surface**: a responsive, real-time single-page dashboard that a control-room operator uses to watch a fleet of vibration sensors, review the event timeline, and manage alerting policy.

## Key features

- **Live monitoring dashboard** — real-time overview of every sensor with current readings, trend charts, and an at-a-glance system risk state.
- **Sensor fleet management** — per-sensor status, thresholds, and health, presented as individual sensor cards.
- **ML hazard inference** — telemetry is scored by a model service to classify the current hazard level rather than relying on a single fixed threshold.
- **Automated evacuation workflow** — a dedicated service triggers the evacuation sequence when hazard conditions are met.
- **Audible alerting** — threshold breaches raise on-screen and audio alerts so they are not missed in a control room.
- **Manual alert control** — operators can raise an alert manually for drills or observed conditions.
- **Event history** — a searchable timeline of past tremor events and alerts for review and audit.
- **Data upload** — import recorded telemetry for replay and analysis.
- **Configurable settings** — thresholds, database connection, and alerting behaviour are operator-configurable and persisted.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     TremorSense (SPA)                      │
├──────────────────────────────────────────────────────────┤
│  Pages      Dashboard · Sensors · Event History ·          │
│             Manual Alert · Upload · Settings               │
├──────────────────────────────────────────────────────────┤
│  Services   MLModelService        → hazard inference       │
│             AutoEvacuationService → evacuation workflow    │
│             DatabaseService       → telemetry persistence  │
├──────────────────────────────────────────────────────────┤
│  State      SettingsContext · React Query · hooks          │
├──────────────────────────────────────────────────────────┤
│  UI         shadcn/ui (Radix) · Tailwind · Recharts        │
└──────────────────────────────────────────────────────────┘
```

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 18, TypeScript, Vite |
| UI | shadcn/ui (Radix primitives), Tailwind CSS, Lucide icons |
| Charts | Recharts |
| Data / state | TanStack React Query, React Context |
| Forms & validation | React Hook Form, Zod |
| Routing | React Router |
| Notifications | Sonner |

## Project structure

```
src/
├── pages/         Dashboard, Sensors, EventHistory, ManualAlert, Upload, Settings
├── services/      MLModelService, AutoEvacuationService, DatabaseService
├── components/    SensorCard, Layout, DatabaseConfig, ui/ (shadcn)
├── contexts/      SettingsContext
├── hooks/         use-mobile, use-toast
└── lib/           utilities
```

## Getting started

```bash
# clone
git clone https://github.com/Divyakush2006/tremor-sense-stream.git
cd tremor-sense-stream

# install
npm install

# run the dev server
npm run dev

# production build
npm run build && npm run preview
```

## Status & scope

This repository is the **frontend dashboard**. Sensor telemetry and the hazard-scoring / persistence services are wired through the service layer (`src/services`), which is the integration point for connecting live hardware and a production backend. It is designed to run against real sensor feeds while remaining fully demonstrable on simulated telemetry.

## Author

**Divyakush Punjabi** — [www.divyakush.com](https://www.divyakush.com) · [GitHub](https://github.com/Divyakush2006) · [LinkedIn](https://linkedin.com/in/divyakush-punjabi)
