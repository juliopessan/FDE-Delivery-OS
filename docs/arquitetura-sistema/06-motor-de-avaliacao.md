# Motor de Avaliação

## Princípio

Qualidade de demo não é evidência de produção.

## Dimensões

- **Funcional:** sucesso da tarefa, acurácia de extração/classificação, sucesso de tool-calling.
- **Retrieval:** recall@k, precision@k, grounding, correção de citação.
- **Agêntica:** escolha de ferramenta, correção de argumentos, taxa de loop, recuperação de erro.
- **Segurança:** prompt injection, exfiltração de dados, vazamento de PII, invocação insegura de ferramenta.
- **Operacional:** latência p50/p95/p99, throughput, retries, disponibilidade.
- **Econômica:** tokens, custo de modelo/ferramenta/nuvem, custo por transação bem-sucedida.

## Golden Set

```yaml
case_id: invoice-0042
category: extraction
expected:
  supplier: Example Ltd
  total: 1043.22
  currency: AED
forbidden_behaviors:
  - invent_missing_invoice_number
```

## Gatilhos de Regressão

Reexecutar quando modelo, prompt, schema de ferramenta, retrieval, chunking, embeddings, regras de negócio ou topologia de agentes mudarem.

## Pacote de Evidência

Persistir manifesto, ambiente, configuração de modelo, resultados, resumo, falhas e evidência para cada execução de avaliação.
