# Segurança e Governança

> Ver também [`docs/governanca-seguranca.md`](../governanca-seguranca.md) — o guia operacional já em uso pelo time de agentes hoje. Este documento descreve o modelo-alvo de política em runtime para quando houver um Tool Gateway de fato.

## Modelo de Confiança

Assumir que a saída do modelo pode estar errada, que conteúdo de cliente pode ser adversarial, que ferramentas podem estar malformadas e que APIs são mutáveis. Segurança é aplicada por política em runtime, não por prompt.

## Classes de Ação

| Classe | Exemplo | Padrão |
|---|---|---|
| Somente leitura | buscar em base de conhecimento | autônoma |
| Escrita reversível | criar rascunho | autônoma/revisão |
| Comunicação externa | enviar e-mail | aprovação humana |
| Mudança de estado de negócio | atualizar ERP | aprovação humana |
| Financeira/destrutiva | transferir/excluir | bloqueada, salvo workflow explícito |

## Política de Ferramentas

Avaliar principal, engajamento, ferramenta/ação, recurso, classificação de dado, classe de risco, argumentos, ambiente e token de aprovação.

Decisão: `ALLOW` / `ALLOW_WITH_REDACTION` / `REQUIRE_APPROVAL` / `DENY`.

## Token de Aprovação HITL

Vincular a aprovação a ator, ferramenta, ação, hash do payload, engajamento, ambiente e expiração. Mudança no payload invalida a aprovação.
