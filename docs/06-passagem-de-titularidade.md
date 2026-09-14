# Passagem de titularidade

Como a plataforma deixa de rodar na conta da Opus AI e passa a rodar na conta
do escritório. Escrito para ser executado na ordem, uma vez só.

---

## O ponto que precisa ser dito primeiro

Compartilhar a agenda e a pasta do Drive **não** transfere a plataforma. Isso
foi verificado, não suposto:

| O que | Onde está hoje | Consequência |
|---|---|---|
| Planilha (o banco de dados inteiro) | Drive de `jr.conductor83@gmail.com` | Leads, clientes, casos e documentos dela moram numa conta pessoal de terceiro |
| Apps Script | Vinculado a essa planilha | Executa como a Opus AI |
| E-mails ao cliente | `GmailApp` da conta que executa | Saem **da conta da Opus AI**, não da dela |
| Cota de 100 e-mails/dia | Da conta que executa | Consome a cota da Opus AI |
| Arquivos criados na pasta CLIENTES | Criados por quem executa | Ficam **dentro** da pasta dela, mas de **propriedade** da Opus AI |

`ESCRITORIO_EMAIL` na Config muda o endereço que aparece escrito na mensagem.
Não muda a conta que envia. O cliente continuaria vendo o remetente real.

Isso contraria o princípio nº 4 do projeto — *"os dados moram na conta Google
dela"* — e é o tipo de coisa que não se descobre depois de assinar um contrato
de administração. **A transferência da planilha é o passo que resolve tudo isso
de uma vez**, e é o passo 1 abaixo.

---

## Passo 1 — Transferir a planilha (resolve titularidade, e-mail e cota)

O Apps Script é *container-bound*: ele mora dentro da planilha e vai junto.

1. Abrir a planilha `Opus AI | MVP - Dra. Poliana Espolador`
   (`1wTdKH5mvdMBSW_zHOdOYg_VR9h7rokwlxZM3xZBv-nw`)
2. **Compartilhar** → adicionar `polianaespoladoradvocacia@gmail.com` como **Editor**
3. No mesmo painel, no menu ao lado do nome dela → **Transferir propriedade**
4. Ela aceita a transferência pelo e-mail que chega
5. Pedir que ela mantenha `jr.conductor83@gmail.com` como **Editor** — sem isso
   não há como dar manutenção

Depois da transferência, **ela** precisa autorizar o script uma vez
(Extensões → Apps Script → executar `verificarInstalacao` → aceitar as
permissões) e **ela** precisa publicar a implantação, porque o app passa a
executar com a conta dela.

A partir daí: e-mails saem do Gmail dela, eventos entram na agenda dela por
direito próprio, pastas de cliente são propriedade dela, e a cota diária é dela.

> Só faz sentido transferir depois de trocar `MODO_DEMO` para `NAO` e limpar os
> dados fictícios — senão ela recebe a plataforma com 56 leads de teste dentro.

## Passo 2 — Config

Os valores já estão em `data/08_config.csv`. Conferir na aba **Config** da
planilha:

| chave | valor |
|---|---|
| `ESCRITORIO_EMAIL` | `polianaespoladoradvocacia@gmail.com` |
| `EMAIL_COPIA` | `jr.conductor83@gmail.com` — esvaziar ao fim da homologação |
| `CALENDAR_ID` | `polianaespoladoradvocacia@gmail.com` |
| `DRIVE_PASTA_RAIZ` | `1paMRgx5Xp0aR0XFS8V7LQBnaWU0D33z8` |
| `ESCRITORIO_WHATSAPP` | **pendente** — o número real dela, em E.164 |
| `PAINEL_TOKEN` | **gerar um novo** |
| `MODO_DEMO` | `NAO` |

Oito chaves que o código lia e que **nunca existiram na planilha** foram
acrescentadas (`AGENDA_HORARIOS`, `AGENDA_DIAS`, `AGENDA_ANTECEDENCIA_H`,
`CONSULTA_DURACAO_MIN`, `LEMBRETE_POPUP_MIN`, `LEMBRETE_EMAIL_MIN`,
`EMAIL_COPIA`, `CALENDAR_ID`). Até agora a agenda rodava inteira em valores
de emergência escritos no código — funcionava, mas ela não tinha como ajustar
horário nenhum sem mexer no código.

### Sobre o PAINEL_TOKEN

O token atual (`pol2026kephra9x4mF7qLzR`) circulou por e-mail e está escrito no
documento de acompanhamento. Quem tem o token abre o painel com todos os dados
dos clientes. Gerar um novo, longo e aleatório, e mandar o link para ela por um
canal só — depois disso, o link do painel é dela.

Os links de confirmação de horário nos e-mails **não usam mais o token**: passaram
a levar uma assinatura válida só para aquele contato e aquele horário. Encaminhar
um desses e-mails não entrega mais o painel junto.

## Passo 3 — Limpar os dados de demonstração

Antes de entregar, apagar as linhas de teste das abas `Leads`, `Clientes`,
`Casos`, `Documentos` e `Agendamentos` — mantendo a linha de cabeçalho.
`Templates`, `Checklists` e `Config` ficam como estão: são conteúdo, não teste.

A numeração se recupera sozinha: `proximoId_` passou a ler o maior id em uso, e
não a contagem de linhas.

## Passo 4 — Republicar e conferir

**Implantar → Gerenciar implantações → lápis → Nova versão → Implantar.**
Nunca "Nova implantação": isso cria uma URL nova e derruba o link que ela já
tem, o link do painel e o redirecionamento do domínio.

Depois, rodar `verificarInstalacao` no editor. Ele reporta URL publicada,
e-mail do escritório, token, cota restante, fuso, leitura **e escrita** no
Calendar e quantos dias de agenda estão livres.

## Passo 5 — Teste de ponta a ponta, feito por ela

1. Ela abre a LP e preenche como se fosse cliente, com o próprio e-mail
2. Confere os dois e-mails: o acuse de recebimento e o aviso de contato novo
3. Confirma um horário pelo botão do e-mail
4. Confere: evento na agenda **dela**, confirmação no e-mail do "cliente"
5. No painel, roda o Modo consulta até criar o caso
6. Confere: a pasta do cliente nasceu **dentro** da pasta CLIENTES dela

O item 6 é o que prova a titularidade. Se a pasta aparecer em outro lugar,
`DRIVE_PASTA_RAIZ` está errado ou a transferência não foi concluída.

---

## Checklist

- [ ] Planilha transferida para a conta dela
- [ ] Ela autorizou o script e publicou a implantação
- [ ] Opus AI mantida como Editor
- [ ] Config conferida, com `ESCRITORIO_WHATSAPP` preenchido
- [ ] `PAINEL_TOKEN` novo, entregue a ela
- [ ] `MODO_DEMO` = `NAO` e dados fictícios apagados
- [ ] Republicado como Nova versão da implantação existente
- [ ] `verificarInstalacao` todo verde
- [ ] Teste de ponta a ponta feito por ela
- [ ] `EMAIL_COPIA` esvaziado ao fim da homologação
