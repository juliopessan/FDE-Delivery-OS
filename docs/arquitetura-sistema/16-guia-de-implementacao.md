# Guia de Implementação (visão)

## Ordem de Construção

1. schemas;
2. persistência;
3. transições de estado;
4. validadores determinísticos;
5. interfaces de agente;
6. orquestração;
7. UI.

Não comece criando muitos agentes autônomos.

## Módulos Sugeridos

```text
src/aces/
├── domain/
├── application/
├── agents/
├── orchestration/
├── patterns/
├── evals/
├── governance/
├── release/
├── observability/
├── incidents/
└── adapters/
```

## CLI de MVP

```bash
aces engagement new example-corp
aces engagement status example-corp
aces discover ingest transcript.txt
aces assess opportunity
aces compose solution
aces eval run rc-0.1.0
aces release check rc-0.1.0
aces pattern list
```

## Fronteira de Ferramenta

Agente → Tool Gateway → Política → Credencial → Sistema Externo

## Primeira Demo

Automação de fatura/documento usando documentos sintéticos, mock de SAP, HITL, evals e dashboard de valor. Ver [`exemplos/automacao-faturas-fornecedor/`](exemplos/automacao-faturas-fornecedor).
