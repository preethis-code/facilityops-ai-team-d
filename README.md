# Agentic FacilityOps AI Platform - Team D

An intelligent multi-agent platform designed to support modern facility operations through autonomous AI agents.

## Week 3 Milestone – Comprehensive Module Implementation

The Week 3 milestone focuses on fully building and integrating the core facility management modules with professional UI, responsive design, realistic dummy data, interactive elements, and proper navigation, all while preserving the existing project design and structure.

### ✅ Completed Features

- **Fully Functional Views**: Transformed previously stubbed views into complete, polished pages with detailed layouts.
- **Realistic Data Integration**: Added realistic facility management dummy data across all new modules.
- **Interactive Components**: Implemented interactive charts, KPI cards, tables with status badges, and dynamic alerts.
- **Consistent Design Language**: Maintained the existing blue theme, typography, and card-based layout without introducing any breaking changes.
- **Enhanced Navigation**: Connected all new modules directly into the existing sidebar routing framework.

### 📄 Fully Implemented Modules

The following modules have been entirely implemented and integrated into the dashboard:
- **Overview**: High-level summary of facility health, total energy, active work orders, and recent agent actions.
- **Dashboard**: Core command center with KPI summaries, AI actions, and active alerts.
- **AI Agents**: Centralized fleet management view for Energy, Maintenance, Occupancy, Security, and Cleaning agents.
- **Modules**: Extension marketplace interface for HVAC, Access Control, Inventory, and Smart Parking.
- **Work Orders**: Comprehensive tracking table with priority badges, status filters, and assignee data.
- **Assets**: Detailed asset registry with health scores, online statuses, and categorization.
- **Monitoring**: Real-time telemetry streams, live environmental charts, and zone sensor statuses.
- **Analytics**: Deep dive insights, energy cost vs baseline comparisons, and savings summaries.
- **Reports**: Compliance dashboard with scheduled reports and recent actionable downloads.
- **Alerts**: Centralized notification center with critical, warning, and informational system alerts.


## Week 2 Milestone – Complete UI & Agent Workflows

The Week 2 milestone focuses on completing all functional views and integrating the full suite of AI agents into the dashboard, ensuring a comprehensive and responsive facility management UI.

### ✅ Completed Features

- **Expanded Dashboard Navigation**: Added full sidebar categories with active routing logic.
- **Agent Views Balancing**: Removed unnecessary empty space and balanced layouts by injecting new modules (Live Alerts, Maintenance Schedules) across all agent pages.
- **Data Displays & Tables**: Implemented comprehensive grid displays and structured tables for Work Orders, Assets, Schedules, and Reports.
- **Profile Integration**: Updated the active user profile across the system to Team D.

### 📄 Implemented Pages

The Single-Page Application (SPA) now fully supports the following interactive views:
- Dashboard (Default view)
- Overview (KPIs and Recent Activity)
- AI Agents Directory
- Modules Overview
- Work Orders Management
- Assets Status
- Facility Monitoring
- Analytics & Insights
- Reports
- Alerts Dashboard
- Schedules Management
- Third-Party Integrations
- Platform Settings

### 🤖 AI Agents Implemented

All four core autonomous agents are now active and fully designed with dedicated interfaces:
- **Energy Agent**: Monitors energy trends, costs, and carbon footprint. Includes automated schedules.
- **Maintenance Agent**: Predicts equipment failure, tracks work orders, and handles upcoming maintenance schedules.
- **Occupancy Agent**: Tracks space utilization, forecasts zones, and provides live air quality and capacity alerts.
- **Security Agent**: Monitors CCTV, access control, security events trends, and threat detection accuracy.

### 🎨 UI/UX Improvements Completed

- Dynamic view-switching logic integrated directly into `script.js` enabling seamless transitions without page reloads.
- Removed unnecessary white space on agent pages by re-balancing grid columns with newly designed widgets.
- Consistent typography, animations, SVG iconography, and color schemes maintained across all 13+ new views.
- Fully responsive layout with Light/Dark mode support.

### 📊 Current Project Status

The frontend prototype is fully complete with all required UI components, pages, and interactive features working locally. The Week 3 milestone brings the platform to a near-production-ready frontend state. The platform relies on vanilla frontend technologies and requires no build step to run.

### 🛠️ Tech Stack

- **HTML5**: Semantic structure and SVG icon integration.
- **CSS3**: Custom design system using CSS Variables (Vanilla), Flexbox, and CSS Grid.
- **JavaScript (Vanilla)**: DOM manipulation, interactive charts, and SPA routing logic.

### 🚀 Next Milestone

- Connect frontend views to a backend API/database.
- Integrate real-time data streaming for the AI Agent dashboards.
