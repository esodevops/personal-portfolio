# Personal Portfolio (v0)

A frontend portfolio project built with React, TypeScript, and Vite.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Formik + Yup
- React Toastify

## Project Structure

This repository currently contains one app:

- `client/`: the portfolio frontend

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/esodevops/personal-portfolio.git
cd personal-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Update `.env` values:

- `VITE_API_BASE_URL`: backend base URL used by contact/blog API calls
- `VITE_RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key

4. Start development server:

```bash
npm run dev
```

## Available Scripts

Run these inside `client/`:

- `npm run dev` - start local development server
- `npm run build` - type-check and build for production
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Build Status

The current codebase passes:

- `npm run build`
- `npm run lint`

## Cloudflare Pages Deployment

This repo is a monorepo-style layout where the frontend app lives in `client/`.

Use these Cloudflare Pages settings:

- Framework preset: `Vite`
- Root directory: `client`
- Build command: `npm run build`
- Build output directory: `dist`

For SPA routing (React Router), the fallback file must be published in build output.
This project includes `client/public/_redirects`:

```txt
/* /index.html 200
```

## Author

Sulaimon Ekundayo
