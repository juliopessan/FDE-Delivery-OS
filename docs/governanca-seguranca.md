# Governança e Segurança

Aplicável a partir da Fase 2 (Context) e obrigatório antes de qualquer virada para produção na Fase 3.

## 0. Princípio de Permissão Herdada (sem conta de serviço separada)

* O agente **nunca** deve operar com um nível de acesso maior do que o FDE (ou o usuário em nome de quem o agente age) já possui. Se o FDE não tem permissão para escrever em um sistema, o agente também não tem — não crie uma conta de serviço com privilégios ampliados "para o agente funcionar melhor".
* Toda ação do agente deve ser atribuível a uma identidade individual na trilha de auditoria (ver seção 5) — nunca a uma conta genérica/compartilhada.
* Perda de acesso do FDE a um sistema (fim de contrato, revogação) deve revogar automaticamente o acesso do agente ao mesmo sistema.

## 1. LGPD / Dados Pessoais

* Mapear, antes da ingestão, se os documentos/dados contêm dados pessoais ou sensíveis (CPF, saúde, dados financeiros de PF, biometria).
* Preferir **mascaramento/anonimização na ingestão**, não apenas no output — dado pessoal não deve nem chegar ao VectorDB se não for estritamente necessário para a tarefa.
* Definir e documentar a **base legal** do tratamento (execução de contrato, legítimo interesse etc.) junto ao DPO do cliente, se existir.
* Definir **retenção de logs** (inputs/outputs do agente) com prazo explícito — nunca "para sempre por padrão".

## 2. Guardrails de Input

* Sanitização contra *prompt injection* (conteúdo malicioso embutido em documentos/e-mails processados pelo agente).
* Limite de tamanho e taxa (*rate limiting*) por usuário/sessão.
* Separação clara entre **instruções do sistema** (confiáveis) e **conteúdo de dados** (não confiável) em todo prompt construído dinamicamente.

## 3. Guardrails de Output

* Validação de schema estruturado (JSON Schema ou equivalente) antes de qualquer output ser usado por outro sistema.
* Checagem de alucinação: para respostas baseadas em RAG, exigir citação da fonte e rejeitar respostas sem grounding no golden set/contexto recuperado.
* Filtro de conteúdo sensível antes de qualquer output visível ao usuário final ou enviado a terceiros.

## 4. Matriz de Autonomia de Ações

Toda ação que um agente pode executar deve ser classificada e aprovada por escrito pelo patrocinador do cliente:

| Classe | Definição | Exemplo | Aprovação necessária |
| --- | --- | --- | --- |
| **Autônoma** | Reversível, baixo impacto, sem custo/dado sensível envolvido | Resumir um documento, classificar um ticket | Nenhuma (log apenas) |
| **Aprovação Prévia** | Irreversível ou de impacto médio/alto | Enviar e-mail, criar registro em CRM | Humano confirma antes da execução (HITL) |
| **Bloqueada** | Ação financeira, exclusão de dados, mudança de configuração crítica | Transferência, hard-delete, alteração de permissão | Nunca automatizada pelo agente |

### Dimensão adicional: autonomia sensível a ambiente

A mesma ação pode ter classe diferente dependendo do ambiente onde roda — não trate autonomia como uma constante global do sistema:

| Ambiente | Regra |
| --- | --- |
| **Sandbox / PoC / dev** | A classe "Aprovação Prévia" pode ser relaxada para "Autônoma com log" — o dado não é real ou o impacto é isolado e reversível. |
| **Produção** | A matriz aprovada vale exatamente como definida — nenhuma ação sobe de classe automaticamente, mesmo que o histórico em sandbox tenha sido limpo. |

A promoção de sandbox para produção nunca herda a permissividade do sandbox — cada ambiente é reclassificado (ver `checklists/go-live-fase3.md`).

## 5. Trilha de Auditoria

* Logar: timestamp, ator (usuário/sistema), input, ferramentas chamadas, output, decisão de guardrail (aprovado/bloqueado/escalado).
* Logs de auditoria não devem ser editáveis pelo próprio agente.
* Definir plano de resposta a incidente: o que fazer em caso de alucinação com impacto real, vazamento de dado, ou custo de tokens fora do esperado.

## 6. Checklist mínimo antes de produção

Ver [`checklists/go-live-fase3.md`](../checklists/go-live-fase3.md).
