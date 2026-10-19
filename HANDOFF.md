# HANDOFF — #22 auditoria food-hut (integração)

Branch de integração: fix/22-auditoria-food-hut. Cada parte foi feita por uma sessão Hermes (ag/gemini-3.8-flash-high) numa worktree própria (fix/22-<parte>). Abaixo, o handoff e o resultado de cada uma.

---

## HANDOFF — deps (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefa: reduzir as vulnerabilidades do `pnpm audit` (crít 6, altas 110). Atualize o Angular para a última 19.2.x (ou 20 só se o build passar sem refatorar código), as devDependencies (@angular-devkit, @angular/build, @angular/cli, tsx, tailwind 3.x, @sonar/scan etc.) e use `pnpm.overrides` para dependências transitivas vulneráveis. Remova o `package-lock.json` (o projeto usa pnpm). Fixe o Node: crie `.nvmrc` com 22, `"engines": {"node": ">=22 <23"}` e `"packageManager"` com a versão do pnpm instalada.
Verificação: `pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build && pnpm audit --audit-level=high` (relate as vulnerabilidades que sobraram e por quê).

### Resultado

### Comandos executados e saídas

1. Gate de comportamento de analytics:
```bash
npx tsx -e "
import { resolveAnalyticsConfig, ANALYTICS_DEFAULTS } from './src/lib/analytics/config';
import assert from 'node:assert';

const cfg = resolveAnalyticsConfig({});
assert.strictEqual(cfg.clarityId, 'yyrpw7vjoz');
assert.strictEqual(cfg.ga4Id, 'G-MSX663TSDY');
assert.strictEqual(cfg.counterId, 'f30df6f3-776d-4154-959d-0210ac8a8325');
assert.strictEqual(cfg.enabled, true);
assert.strictEqual(cfg.loadGtag, true);
assert.strictEqual(cfg.loadClarity, true);
console.log('Analytics behavior gate: PASS');
"
```
Saída:
```
Analytics behavior gate: PASS
```

2. Verificação completa de dependências, tipos, build e auditoria:
```bash
pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build && pnpm audit --audit-level=high
```
Saída resumida:
- `pnpm install`: Lockfile atualizado com pnpm v9.15.9 (`Already up to date`).
- `npx tsc -p tsconfig.app.json --noEmit`: Sucesso, sem erros de compilação/tipagem.
- `pnpm run build`:
```
✅ Generated src/configs/env.ts
✔ Building...
Initial total     | 399.98 kB | 111.35 kB
Application bundle generation complete.
Output location: dist/first-app
```
- `pnpm audit --audit-level=high`:
Redução de vulnerabilidades:
- Antes: 207 vulnerabilidades (6 críticas, 110 altas, 80 moderadas, 11 baixas)
- Depois: 9 vulnerabilidades no total (0 críticas, 2 altas, 5 moderadas, 2 baixas)
- Críticas: 0 (100% resolvidas)
- Altas: 2 (redução de 98.2%)

### Vulnerabilidades restantes e justificativa

As 2 únicas vulnerabilidades de nível `high` restantes não possuem correção disponível upstream (`patched: <0.0.0`):
1. `node-forge <= 1.4.0` (`GHSA-86w9-cpqp-85rv` - high):
   - Caminho: `. > @sonar/scan@5.0.2 > node-forge@1.4.0`
   - Motivo: `@sonar/scan@5.0.2` já está na versão mais recente possível. O pacote upstream `node-forge` na versão 1.4.0 é a mais recente publicada e não possui patch lançado pelos mantenedores.
2. `braces <= 3.0.3` (`GHSA-vfj7-8cjw-p6xm` - high):
   - Caminho: `. > @angular-devkit/build-angular@20.3.40 > ... > chokidar@3.6.0 > braces@3.0.3` e `micromatch@4.0.8 > braces@3.0.3`
   - Motivo: `braces@3.0.3` é a versão mais recente da linha v3 utilizada pelo ecossistema de build tools (chokidar/micromatch). Não há versão corrigida lançada pelos mantenedores upstream.

---

## HANDOFF — headers + GA4 (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefas:
1. Crie `netlify.toml` na raiz SEM mudar o build atual do Netlify (não defina [build] command/publish; só `[build.environment] NODE_VERSION = "22"` e headers). Headers para "/*": Content-Security-Policy compatível com o app (Angular sem eval; scripts de https://www.googletagmanager.com, https://www.google-analytics.com, https://*.clarity.ms, https://cdn.counter.dev, inline necessários — o index.html tem JSON-LD e onload na fonte; connect-src para *.google-analytics.com, *.analytics.google.com, *.googletagmanager.com, *.clarity.ms, c.bing.com, https://t.counter.dev, https://cdn.counter.dev; img-src self data: blob: https:; font/style para fonts.googleapis.com e fonts.gstatic.com; worker-src self; manifest-src self; frame-ancestors none), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy restritiva (camera=(), microphone=(), geolocation=(), payment=(), usb=()). Mantenha o HSTS existente (Strict-Transport-Security max-age=31536000; includeSubDomains). Cache longo para assets com hash (/*.js, /*.css) e para /assets/*.
2. Bug do GA4: em `src/services/analytics.service.ts`, o `gtag` empurra `args` (array) para o dataLayer. O gtag.js só processa o objeto `arguments`, então o hit /g/collect nunca sai. Corrija para `function gtag(){ w.dataLayer.push(arguments) }` (com eslint-disable/tipagem adequada) e chame `gtag('js', new Date())` antes de `gtag('config', id)`. Revise também o loadGtm.
Verificação: `pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build`, e confirme que netlify.toml é um TOML válido (python3 -c "import tomllib; tomllib.load(open('netlify.toml','rb'))").

### Resultado

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

---

## HANDOFF — perf + a11y (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefa: o LCP mobile está em 25.7 s (Lighthouse perf 54), e o contraste falha no Lighthouse (a11y 85). Foco:
1. `src/assets/gif/food-hut.gif` (5.6 MB): veja onde é usado (templates/css/README). Se a página usa, converta para vídeo (mp4/webm via ffmpeg, se disponível) ou WebP animado, ou remova do bundle de assets se não for usado no app.
2. Imagens grandes em `src/assets/images`: redimensione/recomprima (cwebp/sharp, se houver) para o tamanho exibido. Use `NgOptimizedImage` (`ngSrc`, width/height) com `priority` na imagem do hero/LCP e `loading="lazy"` nas demais.
3. JS inicial: lazy load das rotas (`loadComponent`) e `@defer` para seções abaixo da dobra; carregue a fonte do Google sem bloquear.
4. Contraste: ajuste as cores de texto/botões com contraste baixo (ex.: text-gray-400 sobre branco, branco sobre vermelho-claro) para WCAG AA (>= 4.5:1), sem mudar o visual de forma drástica.
Verificação: `pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build` e relate os tamanhos do bundle inicial antes/depois (saída do ng build).

### Resultado

### Comandos de Verificação
```bash
npx tsx scripts/behavior-gate.ts
npx tsc -p tsconfig.app.json --noEmit
pnpm run build
```

### Saída Resumida dos Gates
- `scripts/behavior-gate.ts`: PASSED (Clarity `yyrpw7vjoz`, GA4 `G-MSX663TSDY`, counter.dev `f30df6f3-776d-4154-959d-0210ac8a8325` intactos e validados).
- `npx tsc -p tsconfig.app.json --noEmit`: 0 erros.
- `ng build`: compilação concluída com sucesso em 3.0s.

### Comparativo de Bundle Inicial (ng build)

| Métrica | Antes | Depois | Redução |
|---|---|---|---|
| **Initial Total (Raw)** | 390.08 kB | 335.31 kB | **-54.77 kB (-14.0%)** |
| **Initial Transfer Size** | 108.43 kB | 92.99 kB | **-15.44 kB (-14.2%)** |
| **main.js (Raw)** | 113.66 kB | 9.23 kB | **-104.43 kB (-91.9%)** |
| **main.js (Transfer)** | 29.21 kB | 3.08 kB | **-26.13 kB (-89.5%)** |

#### Chunks Iniciais Antes:
```
Initial chunk files   | Names             |  Raw size | Estimated transfer size
chunk-VGYB7QG6.js     | -                 | 183.99 kB |                54.50 kB
main-4SO6I4Z6.js      | main              | 113.66 kB |                29.21 kB
polyfills-SC4UBBZS.js | polyfills         |  34.52 kB |                11.28 kB
styles-CLZAHTR5.css   | styles            |  33.94 kB |                 5.93 kB
chunk-CFGBVKI7.js     | -                 |  23.96 kB |                 7.50 kB
                      | Initial total     | 390.08 kB |               108.43 kB
```

#### Chunks Iniciais Depois:
```
Initial chunk files   | Names                 |  Raw size | Estimated transfer size
chunk-SY72ENB6.js     | -                     | 163.55 kB |                48.02 kB
chunk-UHVOJ3MZ.js     | -                     |  78.08 kB |                19.45 kB
polyfills-SC4UBBZS.js | polyfills             |  34.52 kB |                11.28 kB
styles-K42OG6FV.css   | styles                |  33.49 kB |                 5.89 kB
chunk-FRS5KH76.js     | -                     |  15.32 kB |                 4.73 kB
main-CZA24KW6.js      | main                  |   9.23 kB |                 3.08 kB
chunk-GPAXIWZ2.js     | -                     |   1.12 kB |               548 bytes
                      | Initial total         | 335.31 kB |                92.99 kB
```

#### Chunks Lazy Gerados (@defer e loadComponent):
```
Lazy chunk files      | Names                 |  Raw size | Estimated transfer size
chunk-3ZXXBIF3.js     | -                     |  32.99 kB |                10.23 kB
chunk-OKRLRIXT.js     | MainLayout-component  |  27.05 kB |                 7.75 kB
chunk-ZI274H2A.js     | home-component        |  13.38 kB |                 3.77 kB
chunk-JYF7FB2C.js     | privacy-component     |   9.03 kB |                 2.05 kB
chunk-HZKKPZFD.js     | menu-section          |   6.47 kB |                 1.85 kB
chunk-JFMAYLUQ.js     | -                     |   6.05 kB |                 2.07 kB
chunk-P76I66QJ.js     | aboutUs-section       |   5.99 kB |                 1.95 kB
chunk-S2QXKSBO.js     | app-section           |   4.10 kB |                 1.48 kB
chunk-35OXOYPW.js     | specialOffers-section |   3.86 kB |                 1.26 kB
chunk-43IS5I3E.js     | -                     |   3.80 kB |                 1.45 kB
chunk-M5M7M2BT.js     | -                     |   1.72 kB |               698 bytes
chunk-XVZ7LIKH.js     | -                     | 802 bytes |               802 bytes
chunk-PTCQBJVR.js     | -                     | 169 bytes |               169 bytes
```

### Otimização de Assets e Imagens
1. `src/assets/gif/food-hut.gif` (5.62 MB): não utilizado no app, removido do bundle de assets (-5.62 MB).
2. `src/assets/images`:
   - Peso total anterior: **7.91 MB**
   - Peso total atual: **0.84 MB** (**-89.4% / economia de 7.07 MB**)
   - `black-transparent-background.webp`: de 1986.9 kB para 262.3 kB
   - `chef-presenting-app.webp`: de 1263.8 kB para 19.1 kB
   - `vintage-kitchen-display.webp`: de 1207.3 kB para 27.9 kB
   - `happy-customer.webp` (LCP hero): de 156.1 kB para 47.0 kB
   - Imagens de produtos: de ~380 kB para ~20-30 kB cada.
3. `NgOptimizedImage`: integrado em `ImageComponent`, com `priority="true"` na imagem LCP (`happy-customer.webp`) e `loading="lazy"` nas demais com `width`/`height` explícitos.
4. Fonte Google: carregamento assíncrono não-bloqueante (`media="print" onload="this.media='all'"` com preload e fallback `<noscript>`).
5. Acessibilidade e Contraste (WCAG AA >= 4.5:1):
   - Branco sobre vermelho (`bg-red-500` 3.76:1) ajustado para `bg-red-600` (4.83:1).
   - `text-red-500` sobre branco (3.76:1) ajustado para `text-red-600` (4.83:1).
   - `text-yellow-500`/`amber-400` sobre branco (1.67:1 - 1.92:1) ajustados para `text-amber-700` (5.02:1).
   - `TagComponent` `text-orange-600` sobre `orange-100` (3.1:1) ajustado para `text-orange-800` (6.38:1).
   - Modal `to-red-100` com `text-white` corrigido para `from-red-600 to-red-700`.
   - Placeholders de inputs configurados com `placeholder:text-gray-600` (7.56:1) eliminando falha de `text-gray-400 sobre branco`.

---

## HANDOFF — lint + testes + CI (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefas:
1. Lint: adicione angular-eslint (ESLint 9 flat config, `eslint.config.js`, compatível com Angular 19) e o script `"lint": "ng lint"` ou `"lint": "eslint src"`. Corrija os erros (não silencie tudo); regras muito ruidosas podem virar "warn".
2. Testes mínimos: hoje `ng test` falha/não está configurado e não há specs. Configure um runner headless que funcione sem navegador gráfico — prefira Vitest + jsdom (com @analogjs/vitest-angular ou uma configuração simples) ou Karma com ChromeHeadless se houver Chrome. Crie specs mínimos: a função de config de analytics (`src/lib/analytics/config.ts`), o AnalyticsService (gtag empurra para dataLayer e insere o script com G-MSX663TSDY) e um smoke do AppComponent/HomeComponent se for viável. Scripts: `"test": "...--run/--watch=false"`, `"typecheck": "tsc -p tsconfig.app.json --noEmit"`.
3. CI (.github/workflows/ci.yml): rodar também em pull_request para develop; adicionar etapas lint, typecheck e test antes do build. Mantenha `runs-on: self-hosted` e o resto como está.
Verificação: `pnpm install && pnpm run typecheck && pnpm run lint && pnpm test && pnpm run build`.

### Resultado

Comando executado:
```bash
pnpm install && pnpm run typecheck && pnpm run lint && pnpm test && pnpm run build
```

Saída resumida:
- `pnpm install`: Lockfile up to date, dependências sincronizadas.
- `pnpm run typecheck` (`tsc -p tsconfig.app.json --noEmit`): concluído com sucesso sem nenhum erro de tipo.
- `pnpm run lint` (`ng lint`): concluído com 0 erros e 7 warnings tolerados para regras de acessibilidade de cliques em overlay e convenção de prefixo.
- `pnpm test` (`vitest run`): 4 arquivos de teste e 12 testes aprovados em ambiente headless jsdom:
  - `src/lib/analytics/config.spec.ts`: 5 testes aprovados (defaults, Clarity `yyrpw7vjoz`, GA4 `G-MSX663TSDY`, counter.dev, deduplicação e fallback de placeholders).
  - `src/services/analytics.service.spec.ts`: 4 testes aprovados (gtag push para dataLayer com G-MSX663TSDY, injeção de script counter.dev, inicialização de Clarity e respeito ao consentimento).
  - `src/app/app.component.spec.ts`: 1 teste aprovado (smoke de criação e injeção de rotas/metadados).
  - `src/app/home/home.component.spec.ts`: 2 testes aprovados (smoke de instanciação e montagem com subseções).
- `pnpm run build` (`npx tsx scripts/generate-env.ts && ng build`): bundle gerado com sucesso em `dist/first-app` (Initial total: 390.08 kB, dentro do budget).

---

## Integração — Resultado

### Comandos executados e saídas

1. Gates de comportamento e integridade de analytics:
```bash
npx tsx scripts/test-analytics-gate.ts && npx tsx scripts/behavior-gate.ts
```
Saída:
```
🧪 Running Analytics & Headers Behavior Gate...
✅ Gate 1: Analytics defaults verified.
✅ Gate 2: GA4 dataLayer Arguments contract verified.
✅ Gate 3: counter.dev script verified.
✅ Gate 4: netlify.toml and security headers verified.
🎉 All behavior gates PASSED!
--- RUNNING BEHAVIOR GATE ---
✅ Analytics and Routes Gate PASSED
```

2. Pipeline de verificação completa:
```bash
pnpm install && pnpm run typecheck && pnpm run lint && pnpm test && pnpm run build
```

Saída resumida:
- `pnpm install`: Lockfile sincronizado (v9.15.9), dependências atualizadas.
- `pnpm run typecheck` (`tsc -p tsconfig.app.json --noEmit`): Exit code 0, nenhum erro de tipagem.
- `pnpm run lint` (`ng lint`): Exit code 0, 0 erros (resolvidos `@angular-eslint/prefer-inject` em `IntroWarningModal.section.ts`, `@typescript-eslint/no-inferrable-types` em `Image.component.ts` e diretiva não utilizada em `analytics.service.ts`). 7 warnings de acessibilidade/convenção tolerados.
- `pnpm test` (`vitest run`): Exit code 0, 4 arquivos de teste e 12/12 testes aprovados (validação de `dataLayer` como objeto `Arguments` com 'js'/'config' e compatibilidade com o runtime do GA4).
- `pnpm run build` (`npx tsx scripts/generate-env.ts && ng build`): Exit code 0, bundle gerado com sucesso em `dist/first-app` (Initial total: 345.55 kB, 95.78 kB transfer).

## Ajustes finais (integração)
- `pnpm.overrides.tinypool = ^2.1.2`: zera as 2 críticas trazidas pelo vitest 3 (tinypool 1.x).
- `src/test-setup.ts`: stub de IntersectionObserver para o `@defer (on viewport)` no jsdom.
- `pnpm audit` final: 0 críticas, 2 altas sem correção publicada upstream (node-forge via @sonar/scan; braces 3.0.3 via webpack-dev-server/chokidar), 6 moderadas, 2 baixas.
