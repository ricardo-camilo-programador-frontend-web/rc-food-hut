# HANDOFF — headers + GA4 (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefas:
1. Crie `netlify.toml` na raiz SEM mudar o build atual do Netlify (não defina [build] command/publish; só `[build.environment] NODE_VERSION = "22"` e headers). Headers para "/*": Content-Security-Policy compatível com o app (Angular sem eval; scripts de https://www.googletagmanager.com, https://www.google-analytics.com, https://*.clarity.ms, https://cdn.counter.dev, inline necessários — o index.html tem JSON-LD e onload na fonte; connect-src para *.google-analytics.com, *.analytics.google.com, *.googletagmanager.com, *.clarity.ms, c.bing.com, https://t.counter.dev, https://cdn.counter.dev; img-src self data: blob: https:; font/style para fonts.googleapis.com e fonts.gstatic.com; worker-src self; manifest-src self; frame-ancestors none), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy restritiva (camera=(), microphone=(), geolocation=(), payment=(), usb=()). Mantenha o HSTS existente (Strict-Transport-Security max-age=31536000; includeSubDomains). Cache longo para assets com hash (/*.js, /*.css) e para /assets/*.
2. Bug do GA4: em `src/services/analytics.service.ts`, o `gtag` empurra `args` (array) para o dataLayer. O gtag.js só processa o objeto `arguments`, então o hit /g/collect nunca sai. Corrija para `function gtag(){ w.dataLayer.push(arguments) }` (com eslint-disable/tipagem adequada) e chame `gtag('js', new Date())` antes de `gtag('config', id)`. Revise também o loadGtm.
Verificação: `pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build`, e confirme que netlify.toml é um TOML válido (python3 -c "import tomllib; tomllib.load(open('netlify.toml','rb'))").

## Resultado

### Comandos executados e saídas

1. Gate de comportamento (regressão e contratos):
```bash
npx tsx scripts/test-analytics-gate.ts
```
Saída:
```
🧪 Running Analytics & Headers Behavior Gate...
✅ Gate 1: Analytics defaults verified.
✅ Gate 2: GA4 dataLayer Arguments contract verified.
✅ Gate 3: counter.dev script verified.
✅ Gate 4: netlify.toml and security headers verified.
🎉 All behavior gates PASSED!
```

2. Validação sintática do `netlify.toml`:
```bash
python3 -c "import tomllib; tomllib.load(open('netlify.toml','rb'))"
```
Saída: Sucesso (código de saída 0).

3. Verificação de tipos e compilação de produção:
```bash
pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build
```
Saída:
```
✅ Generated /workspace/analise-projetos/repos/rc-food-hut-headers/src/configs/env.ts
✔ Building...
Initial chunk files   | Names             |  Raw size | Estimated transfer size
chunk-VGYB7QG6.js     | -                 | 183.99 kB |                54.50 kB
main-6GNK7H2K.js      | main              | 113.76 kB |                29.26 kB
polyfills-SC4UBBZS.js | polyfills         |  34.52 kB |                11.28 kB
styles-CLZAHTR5.css   | styles            |  33.94 kB |                 5.93 kB
chunk-CFGBVKI7.js     | -                 |  23.96 kB |                 7.50 kB
                      | Initial total     | 390.17 kB |               108.48 kB

Lazy chunk files      | Names             |  Raw size | Estimated transfer size
chunk-LSODQE5D.js     | home-component    |  34.52 kB |                 7.46 kB
chunk-X23LD2HD.js     | privacy-component |   9.00 kB |                 2.03 kB

Application bundle generation complete.
Output location: /workspace/analise-projetos/repos/rc-food-hut-headers/dist/first-app
```
