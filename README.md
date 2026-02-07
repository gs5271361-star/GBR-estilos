# GBR ESTILOS — Luxury Fashion E-commerce Platform

## 💎 Project Overview
A high-end, immersive e-commerce application designed for luxury fashion brands. Built with **React 19**, **Tailwind CSS**, and **Framer Motion**, focusing on editorial storytelling, micro-interactions, and a premium user experience.

## 🚀 Tech Stack
- **Frontend:** React 19, TypeScript, Vite/Next.js
- **Styling:** Tailwind CSS, Custom Cursor Logic
- **Animations:** Framer Motion (Scroll Velocity, Parallax, Layout Animations)
- **State Management:** React Context API (Auth, Cart, Settings, Theme, Language)
- **Icons:** Lucide React

## 📦 Features
- **Immersive UX:** Custom magnetic cursor, velocity-based scroll animations, cinematic reveals.
- **Dynamic Theming:** Dark/Light mode with automatic ambient detection.
- **Internationalization (i18n):** Native support for PT-BR and EN-US.
- **Real-time Logistics:** Admin panel with instant status updates (Pending -> Delivered).
- **Secure Authentication:** JWT-based flow simulation with role-based access control (RBAC) and Brute Force protection.
- **Omnichannel Support:** Integrated WhatsApp concierge and automated email notifications.

## 🛠 Deployment Guide

### Vercel (Frontend)
1. Fork this repository.
2. Import project to Vercel.
3. Configure Environment Variables (if connecting to real backend).
4. Deploy.

### Backend Architecture
This project currently runs with a sophisticated **Mock Service Layer** (`services/api.ts`) that simulates a real backend environment including:
- Network Latency Simulation (800ms)
- Stateful Data Persistence (In-Memory)
- Authentication Logic (JWT Simulation)
- Email/WhatsApp Notification Logs

For production, migrate `services/api.ts` logic to **NestJS** + **Prisma** + **PostgreSQL**.

## 🔒 Security & Performance
- **RBAC:** Admin routes protected via Context validation.
- **Performance:** Component lazy loading and optimized asset delivery.
- **Accessibility:** ARIA labels and semantic HTML structure.

---
© 2024 GBR Estilos. Ready for Production.