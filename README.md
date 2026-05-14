# PassPilot

PassPilot is a React/Vite travel-pass calculator for comparing Greek ferry tickets, Interrail Greek Islands Pass assumptions, and custom travel pass prices.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages Hosting

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

To publish:

1. Push the project to a GitHub repository.
2. In GitHub, open `Settings -> Pages`.
3. Set `Build and deployment` to `GitHub Actions`.
4. Push to the `main` branch.

Vite is configured with `base: "./"` so the built app works on GitHub Pages project URLs like:

```text
https://your-username.github.io/your-repo-name/
```
