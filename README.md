# ✈️ USPS Label Generator – Ship like a Pro, Code like a Senior

> 100 % TypeScript • Next.js 15 • API-first • Pixel–perfect Tailwind UI
> **Built end-to-end in < 1 day – imagine what I deliver in a week.**

## 🚀 **Live Demo**

**[👉 Try it now: https://usps-label-generator-production.up.railway.app/](https://usps-label-generator-production.up.railway.app/)**

* **No setup required** – Just click and start shipping
* **Real USPS integration** – Address verification & label generation
* **Complete workflow** – From form to printed label in 2 minutes
* **Mobile responsive** – Works perfectly on any device

## Why this project matters

Recruiters read dozens of "todo-list" demos. I wanted something real:

* 🤖 **Full-stack** – From responsive React forms to serverless API Routes.
* 📦 **3rd-party integration** – EasyPost SDK for address verification, rate shopping and label purchase.
* 🔐 **Production practices** – ENV secrets, schema validation (Zod), typed hooks, graceful error handling.
* ⚡ **DX obsessed** – 0-config Tailwind, reusable hooks/components, constants file, no console spam.
* 🖨️ **Complete shipping workflow** – Validate ➜ compare ➜ buy ➜ preview ➜ download ➜ print.

The result? A shippable mini-product that could slot into Shopify tomorrow.

---

## 30-second tour

| Step | What you see | Tech highlight |
|------|--------------|----------------|
| 1. Addresses | Two smart forms with pre-filled demo data | React-Hook-Form + Zod |
| 2. Validation | Real-time USPS address verification | EasyPost API \(server-side\) |
| 3. Package | Weight & dimensions with live rules | Zod schema w/ limits |
| 4. Label | Instant PNG/PDF preview, download & 1-click print | Secure blob download & custom print window |

> Demo locally in **one command**:
> ```bash
> git clone https://github.com/<you>/usps-label-generator && cd usps-label-generator
> npm i && cp .env.example .env # add your EasyPost TEST key
> npm run dev
> ```
> Visit http://localhost:3000 – ship your first label in seconds.

---

## Under the hood

* **Next.js 15 App Router** – Layouts, server components, edge-ready.
* **TypeScript everywhere** – Safer refactors, zero `any`.
* **Tailwind CSS** – Dark-mode-ready design system in 5 KB gzip.
* **EasyPost SDK** – Verify, rate, buy, track – all in one client.
* **Custom `useAsync` hook** – Declarative loading/error state.
* **Accessibility** – `role="alert"`, `aria-live`, keyboard-safe buttons.

---

## What this showcases about me

1. **Speed with quality** – Functional MVP with tests & docs in ~4 h.
2. **API integration** – Comfortable reading docs, handling webhooks, auth, etc.
3. **Product thinking** – UX details (pre-fill, spinner states, success toasts) matter.
4. **Code hygiene** – Lint-clean, constants extracted, no magic numbers, scalable structure.
5. **Communication** – Clear commits, self-explanatory README (you're reading it!).
6. **DevOps ready** – Docker containerization, Railway deployment, environment management.

---

## 🚀 **Production Deployment**

This project demonstrates **real-world deployment skills**:

* **Docker containerization** – Multi-stage build, optimized for production
* **Railway deployment** – CI/CD pipeline, automatic deployments on push
* **Environment management** – Secure API keys, production-ready configs
* **Domain & SSL** – Custom subdomain with HTTPS encryption
* **Monitoring** – Built-in logging and error tracking

---

## Next 3 upgrades (given more time)

1. **Multi-carrier price matrix** – UPS, FedEx, DHL side-by-side.
2. **Realtime tracking webhook** – Push status updates to the UI & email.
3. **PWA + barcode scan** – Offline label wallet, scan to mark parcels delivered.

---

## Hiring me means …

You get a developer who ships fast, sweats the details and **turns specs into polished products**.  Let's talk.
**contato@campaner.dev**
