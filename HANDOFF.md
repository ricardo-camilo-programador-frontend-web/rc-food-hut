# HANDOFF — lint + testes + CI (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefas:
1. Lint: adicione angular-eslint (ESLint 9 flat config, `eslint.config.js`, compatível com Angular 19) e o script `"lint": "ng lint"` ou `"lint": "eslint src"`. Corrija os erros (não silencie tudo); regras muito ruidosas podem virar "warn".
2. Testes mínimos: hoje `ng test` falha/não está configurado e não há specs. Configure um runner headless que funcione sem navegador gráfico — prefira Vitest + jsdom (com @analogjs/vitest-angular ou uma configuração simples) ou Karma com ChromeHeadless se houver Chrome. Crie specs mínimos: a função de config de analytics (`src/lib/analytics/config.ts`), o AnalyticsService (gtag empurra para dataLayer e insere o script com G-MSX663TSDY) e um smoke do AppComponent/HomeComponent se for viável. Scripts: `"test": "...--run/--watch=false"`, `"typecheck": "tsc -p tsconfig.app.json --noEmit"`.
3. CI (.github/workflows/ci.yml): rodar também em pull_request para develop; adicionar etapas lint, typecheck e test antes do build. Mantenha `runs-on: self-hosted` e o resto como está.
Verificação: `pnpm install && pnpm run typecheck && pnpm run lint && pnpm test && pnpm run build`.

## Resultado

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
