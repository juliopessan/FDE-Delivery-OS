# Adaptação da Metodologia A.C.E.S. por Perfil de Cliente

A metodologia A.C.E.S. é agnóstica de setor e porte — as 4 fases (+ Fase 0) não mudam. O que muda é **profundidade, formalidade e duração** de cada fase. Este documento serve como guia de calibragem antes de fechar o escopo na Fase 0.

## 1. Eixos de adaptação

| Eixo | Pergunta a responder na Fase 0 |
| --- | --- |
| Porte | Quantos funcionários/quanta receita? Existe orçamento formal de TI? |
| Setor/regulação | O setor é regulado (saúde, financeiro, jurídico, público) ou não? |
| Maturidade digital | O cliente já usa APIs/integrações, ou tudo é manual/planilha? |
| Estrutura de decisão | Existe um único decisor, ou é preciso comitê/compliance para aprovar? |

## 2. Calibragem por Porte

### Pequena empresa / PME (até ~100 funcionários)

- **Fase 0-1:** compactar para 1 semana; decisor costuma ser o próprio dono/sócio.
- **Fase 2:** priorizar stack gerenciada (SaaS) em vez de self-hosted — o cliente não tem TI para manter infraestrutura própria.
- **Fase 3:** guardrails ainda obrigatórios, mas a matriz de autonomia pode ser mais permissiva (menor exposição regulatória, decisões mais rápidas).
- **Fase 4:** retainer menor (5-8h/semana) costuma ser suficiente; ROI deve ser reportado em linguagem de caixa/fluxo, não em métricas técnicas.

### Média empresa (100-1.000 funcionários)

- Segue o playbook "como está" — é o perfil-alvo padrão da metodologia.
- Esperar um patrocinador executivo diferente do usuário operacional (mais um stakeholder no RACI).
- TI/Segurança já existe como área formal — envolver a partir da Fase 2, não só na Fase 3.

### Grande empresa / Enterprise (1.000+ funcionários)

- **Fase 0:** alongar para 2-3 semanas; múltiplos decisores, possível processo de compras formal (RFP/procurement).
- **Fase 1:** o PoC frequentemente precisa rodar em ambiente sandbox isolado da rede corporativa — negocie isso explicitamente no SOW.
- **Fase 2:** integração via times de plataforma/dados internos, não acesso direto do FDE aos sistemas — adicione tempo de espera por acessos ao cronograma.
- **Fase 3:** guardrails, auditoria e matriz de autonomia tendem a exigir aprovação formal de um comitê de segurança/arquitetura — trate como gate obrigatório, não opcional.
- **Fase 4:** retainer tende a virar contrato via procurement (não pessoa física direta); considere estrutura de PJ/empresa para faturar.
- Um FDE solo dificilmente sustenta múltiplos clientes enterprise simultâneos — priorize 1-2 contas grandes por vez.

## 3. Calibragem por Setor

| Setor | Ajuste principal |
| --- | --- |
| Saúde | LGPD + regras específicas de dado de saúde; HITL quase sempre obrigatório para qualquer ação de impacto clínico; nunca classificar ações clínicas como "Autônoma" |
| Financeiro | Auditoria e trilha de logs são requisito regulatório, não opcional; validar com compliance antes de qualquer ação de escrita em sistemas transacionais |
| Jurídico | Alucinação tem custo alto — golden set deve ser maior (50+ casos) e recall exigido mais alto (≥ 95%); toda saída deve citar fonte |
| Varejo/E-commerce | Setor tipicamente menos regulado — foco pode ir direto para volume e latência (SLA de resposta ao cliente final) |
| Setor público | Processo de contratação formal desde a Fase 0; transparência e explicabilidade das decisões do agente costumam ser requisito, não só desempenho |
| Indústria/Manufatura | Processos costumam ser mais "Rígido e Repetitivo" (matriz da Fase 1) — validar se Gen AI é realmente a solução certa antes de vender o engajamento |

## 4. Regra de decisão rápida

Antes de fechar a Fase 0, responda:

1. **Este é um processo regulado?** → Se sim, Fase 3 (guardrails/auditoria) não pode ser reduzida, independentemente do porte do cliente.
2. **O cliente tem TI própria?** → Se não, prefira stack gerenciada e simplifique o handoff da Fase 4 (não haverá time interno para receber o runbook).
3. **Existe um único decisor?** → Se não, alongue a Fase 0 e formalize o RACI por escrito antes de iniciar a Fase 1.

> O framework não muda de forma — o que muda é o quanto você formaliza, quem você envolve e quanto tempo cada fase leva. Nunca pule a Fase 3 (guardrails) para "ir mais rápido", independentemente do perfil do cliente.
