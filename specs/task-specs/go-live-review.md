# Task Spec — Go-Live Review (Fim da Fase 3)

Executado conjuntamente por `fde-architect`, `fde-guardrails` e `fde-qa`, coordenado por `fde-master`. É o gate mais crítico do framework — a virada para produção.

## Pré-condições

- `fde-architect` entregou `arquitetura.md` com a topologia e roteamento de modelos definidos.
- `fde-guardrails` entregou `matriz-autonomia.md`, `guardrails.md` e `revisao-lgpd.md`, com aprovação por escrito do patrocinador executivo do cliente.

## Passos

1. `fde-qa` roda o checklist `checklists/go-live-fase3.md` completo:
   - Seção Guardrails/Matriz de Autonomia/Segurança/Compliance → evidência vem dos artefatos de `fde-guardrails`.
   - Seção Testes/Observabilidade → `fde-qa` executa diretamente (golden set, carga, red-team, dashboards).
2. Para cada item marcado como concluído, deve existir artefato de evidência associado — nenhuma marcação "de confiança".
3. Se qualquer item de segurança/compliance estiver pendente, `fde-guardrails` tem **veto**: o go-live não é aprovado, independentemente do estado dos demais itens.
4. Se todos os itens estiverem concluídos com evidência, `fde-qa` registra "GO-LIVE aprovado" com data e lista os responsáveis que assinam (FDE + patrocinador do cliente).
5. `fde-master` atualiza `state.md` do engajamento para Fase 4 e delega a `fde-scale-ops`.

## Pós-condições

- Sistema em produção com trilha de auditoria ativa desde o primeiro dia.
- Runbook de incidentes já existente (mesmo que inicial) antes do primeiro uso real.

## Regra inegociável

Nenhuma pressão de prazo comercial justifica pular item de segurança/compliance deste checklist. Se o cliente pressionar, a resposta padrão é comprimir escopo (reduzir o que vai para produção), nunca comprimir o rigor do checklist.
