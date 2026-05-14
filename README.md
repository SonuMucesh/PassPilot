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
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to the `main` branch.

If the workflow fails at `actions/configure-pages@v5` with `Get Pages site failed`,
Pages has not been enabled for the repo yet. Complete step 3 above, then rerun the
failed workflow from the `Actions` tab.

Vite is configured with `base: "./"` so the built app works on GitHub Pages project URLs like:

```text
https://your-username.github.io/your-repo-name/
```
