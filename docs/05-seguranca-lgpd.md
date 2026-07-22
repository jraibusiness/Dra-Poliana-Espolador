# 05 · Segurança, confidencialidade e LGPD

> Isto não é um anexo de compliance. É uma **garantia de marca da Opus AI** e precisa ser
> verdadeira, verificável e visível em todas as telas.

## Por que este projeto é sensível

Um escritório previdenciário manipula, por definição, **dados pessoais sensíveis** no sentido do
art. 5º, II da LGPD: laudos médicos, CID, histórico de incapacidade, composição familiar, renda.
O tratamento é lícito (execução de contrato e exercício regular de direitos), mas exige zelo real.

## As cinco garantias

### 1. Os dados moram na conta dela
Planilha, pastas e scripts vivem na conta Google da Dra. Poliana. O Apps Script é publicado sob a conta
dela. **A Opus AI não hospeda nenhum dado de cliente final em servidor próprio.**
Se o contrato terminar amanhã, ela não perde nada e não precisa migrar nada.

### 2. Nenhuma IA processa dados de clientes
A Fase 1 não tem modelo de linguagem em ponto algum do fluxo. Scoring, mensagens e relatórios são
lógica determinística. Não há chamada a API de terceiros com conteúdo de cliente.
Esta é a frase que vai no rodapé, e ela é literalmente verdadeira:

> *Seus dados permanecem na infraestrutura do escritório, protegidos nos termos da LGPD,
> e não são enviados a sistemas de inteligência artificial.*

### 3. Acesso controlado
- Painel com autenticação; sessão expira por inatividade.
- Compartilhamento da planilha restrito — nunca "qualquer pessoa com o link".
- Pastas do Drive por cliente, sem herança pública.
- Webhooks (Asaas) com token na URL + reverificação na API de origem antes de confirmar qualquer evento.

### 4. Minimização
A LP coleta o mínimo necessário para triar e agendar. Não pedimos CPF, RG, laudo ou documento
no primeiro contato — só depois da contratação, quando existe base contratual para isso.

### 5. Transparência visível
Selo `🔒 Dados protegidos · LGPD` fixo no rodapé da LP, do painel e dos e-mails.
Na LP, aviso de consentimento antes do envio, com finalidade declarada.
No painel, nota de confidencialidade nos relatórios em PDF.

## Riscos residuais (declarados, não escondidos)

| Risco | Mitigação |
|---|---|
| Conta Google dela comprometida | Recomendar 2FA obrigatório na conta. É o ponto único de falha real. |
| Compartilhamento acidental de planilha | Revisar permissões na homologação e a cada semestre. |
| Documento enviado ao cliente errado | Toda mensagem é revisada por ela antes do envio — o "humano no circuito" é o controle. |
| Dados sensíveis em anexo de e-mail | Preferir link para pasta do Drive com permissão nominal, não anexo. |

## O que isto vale comercialmente

Concorrentes vendem "automação com IA". Nós vendemos **automação que declara onde a IA não está**.
Para uma advogada com dever de sigilo profissional, essa distinção não é detalhe técnico — é o critério de decisão.
