# HANDOFF — deps (#22)
Repo rc-food-hut (Angular 19, pnpm 9, builder @angular/build:application). Issue #22. Base: develop. Faça SOMENTE a sua parte, commits locais na branch atual (formato `:emoji: type(22_rc-food-hut_<desc>): ...`, pt-BR), NÃO faça push, NÃO mexa em outras worktrees. Nunca commite segredos nem .env. Mantenha Clarity yyrpw7vjoz, GA4 G-MSX663TSDY e counter.dev funcionando (src/lib/analytics/config.ts, src/services/analytics.service.ts). Antes de mudar código que já funciona, garanta um teste/verificação de comportamento (gate). Ao terminar, rode a verificação indicada e escreva o resultado (comandos + saída resumida) no fim deste HANDOFF.md, numa seção "## Resultado".

Tarefa: reduzir as vulnerabilidades do `pnpm audit` (crít 6, altas 110). Atualize o Angular para a última 19.2.x (ou 20 só se o build passar sem refatorar código), as devDependencies (@angular-devkit, @angular/build, @angular/cli, tsx, tailwind 3.x, @sonar/scan etc.) e use `pnpm.overrides` para dependências transitivas vulneráveis. Remova o `package-lock.json` (o projeto usa pnpm). Fixe o Node: crie `.nvmrc` com 22, `"engines": {"node": ">=22 <23"}` e `"packageManager"` com a versão do pnpm instalada.
Verificação: `pnpm install && npx tsc -p tsconfig.app.json --noEmit && pnpm run build && pnpm audit --audit-level=high` (relate as vulnerabilidades que sobraram e por quê).

## Resultado

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
