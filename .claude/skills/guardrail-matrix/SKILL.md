---
name: guardrail-matrix
description: Constrói a matriz de autonomia de ações (Autônoma / Aprovação Prévia / Bloqueada) para um sistema agêntico, classificando cada ação que o agente pode executar. Use na Fase 3, antes de qualquer go-live, e sempre que uma nova ferramenta/conector for adicionada a um sistema já em produção.
---

# Skill: Matriz de Autonomia de Ações

## Quando usar

- Na Fase 3, como parte do trabalho de `fde-guardrails`, antes de aprovar o go-live.
- Na Fase 4, sempre que uma nova ferramenta/conector for proposta para um sistema já em produção (`fde-scale-ops` sinaliza, `fde-guardrails` reclassifica).

## Passo a passo

1. Liste todas as ações que o(s) agente(s) podem executar (uma linha por ação, não por conector — um conector pode ter múltiplas ações com riscos diferentes).
2. Para cada ação, classifique:
   - **Autônoma**: reversível, baixo impacto, sem dado sensível envolvido.
   - **Aprovação Prévia**: irreversível ou impacto médio/alto — humano confirma antes da execução.
   - **Bloqueada**: ação financeira, exclusão de dados, mudança de configuração crítica — nunca automatizada.
3. Ajuste por setor (ver `docs/adaptacao-por-perfil-cliente.md`):
   - Saúde: nenhuma ação de impacto clínico é "Autônoma".
   - Financeiro: toda ação de escrita em sistema transacional passa por compliance antes de ser "Aprovação Prévia".
   - Jurídico: toda saída deve citar fonte; sem citação, tratar como "Aprovação Prévia" no mínimo.
4. O padrão conservador é: se há dúvida entre duas classes, escolha a mais restritiva.
5. Submeta a matriz completa para aprovação por escrito do patrocinador executivo do cliente.
6. Salve em `harness/engagements/<cliente>/03-engineering/matriz-autonomia.md`.

## Erros comuns a evitar

- Classificar por conector inteiro em vez de por ação — um conector de CRM pode ter leitura (Autônoma) e escrita (Aprovação Prévia) misturadas.
- Aprovar a matriz sem assinatura/confirmação explícita do patrocinador — sem isso, não há respaldo em caso de incidente.
- Deixar a matriz desatualizada quando uma nova ferramenta é adicionada em produção (Fase 4) — toda nova ferramenta exige reclassificação, não herda a permissividade das existentes.
