# Estratégia de Testes

## Camadas

- **Unitária:** scoring, transições de estado, política, schema e custo.
- **Contrato:** I/O de agente, tool gateway, manifestos de pattern/release.
- **Comportamento de Agente:** seleção de ferramenta, ações proibidas, escalonamento.
- **Workflow:** discovery → protótipo, protótipo → release, incidente → remediação.
- **Avaliação:** golden sets, segurança, regressão, performance.
- **Resiliência:** timeout de modelo/ferramenta, resposta malformada, indisponibilidade de provedor, eventos duplicados.

## Invariantes Críticos

- Veto de segurança não pode ser contornado.
- Ações de ferramenta em produção exigem permissão de política.
- Payload de aprovação não pode mudar após aprovado.
- Dado do Cliente A não pode entrar no contexto do Cliente B.
