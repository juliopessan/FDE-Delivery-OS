# Task Spec — Protocolo de Handoff Entre Fases

Aplica-se a toda transição entre agentes/fases do time FDE. Executado por `fde-master` em conjunto com o agente que está entregando e o agente que está recebendo.

## Pré-condições

- O checklist Go/No-Go da fase que está terminando existe e está preenchido (`checklists/` no repo de referência).
- Todos os artefatos obrigatórios da fase estão salvos em `harness/engagements/<cliente>/<fase>/`.

## Passos

1. **Agente que entrega** roda (ou solicita a `fde-qa`, quando aplicável) o checklist Go/No-Go da fase.
2. Se **NO-GO**: o agente que entrega lista pendências específicas e acionáveis; `fde-master` mantém o engajamento na fase atual e não delega adiante.
3. Se **GO**: o agente que entrega grava um resumo de handoff (`handoff.md`) na pasta da fase, contendo:
   - Lista de artefatos produzidos com caminho.
   - Decisões-chave tomadas e o porquê (especialmente onde houve desvio do padrão do playbook).
   - Pendências não-bloqueantes que a próxima fase deve saber (ex.: "cliente ainda não confirmou X, mas não impede início da Fase 2").
4. `fde-master` atualiza `state.md` do engajamento: fase concluída, data, decisão do checklist, próxima fase.
5. `fde-master` delega ao agente da próxima fase, passando o caminho do `handoff.md` como contexto inicial.

## Pós-condições

- `state.md` reflete a fase atual corretamente.
- O agente que recebe consegue começar seu trabalho lendo apenas os arquivos do engajamento, sem depender de memória de conversa anterior.

## Casos especiais

- **Handoff paralelo (Fase 3):** `fde-architect` e `fde-guardrails` trabalham simultaneamente; `fde-qa` só recebe o handoff quando **ambos** tiverem concluído e gravado seus artefatos.
- **Handoff de retorno (Fase 4 → Fase 0):** quando um novo caso de uso surge durante o retainer, `fde-scale-ops` não implementa diretamente — grava uma nota de oportunidade e devolve a `fde-master`, que abre um novo sub-engajamento a partir da Fase 0.
