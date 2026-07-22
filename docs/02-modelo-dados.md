# 02 · Modelo de dados

8 abas na planilha. Regra geral: **um dado é digitado uma única vez, no ponto mais próximo de onde nasce.**
Sempre que possível, quem digita é o próprio lead — não ela.

---

## Aba 1 · `Leads`
Quem chegou mas ainda não contratou. Alimentada pela LP.

| Coluna | Tipo | Origem | Nota |
|---|---|---|---|
| `id_lead` | texto | auto | `L001`, `L002`… |
| `data_entrada` | data | auto | |
| `nome` | texto | LP | |
| `telefone` | texto | LP | formato E.164 para o `wa.me` |
| `email` | texto | LP | |
| `cidade` | texto | LP | |
| `origem` | lista | LP | Indicação · Instagram · Google · Outro |
| `quem_indicou` | texto | LP | alimenta o agradecimento a quem indica |
| `beneficio_pretendido` | lista | LP | ver `config/beneficios.csv` |
| `situacao` | lista | LP | Nunca requeri · Requeri e foi negado · Recebo e quero revisar · Recebia e foi cessado |
| `ja_teve_negativa` | sim/não | LP | fator de score |
| `tem_documentos` | lista | LP | Tenho tudo · Tenho parte · Não tenho nada |
| `urgencia` | lista | LP | Estou sem renda · Preciso resolver em breve · Sem pressa |
| `relato` | texto longo | LP | campo livre — é aqui que mora a história |
| `score` | número | calculado | ver `03-scoring.md` |
| `faixa` | texto | calculado | Prioritário · Qualificado · Em avaliação · Informativo |
| `janela_1/2/3` | data-hora | LP | as 3 sugestões do lead |
| `janela_escolhida` | data-hora | painel | ela clica em uma |
| `status_lead` | lista | painel | Novo · Contatado · Agendado · Consulta realizada · Convertido · Não convertido |
| `id_cliente` | texto | auto | preenchido na conversão |
| `observacoes` | texto | painel | |

## Aba 2 · `Clientes`
Contratou. **As colunas são exatamente os metadados que o Astrea usa** para preencher procurações,
declarações e contratos. Digitados aqui, exportados de lá. Ver `04-integracao-astrea.md`.

`id_cliente` · `id_lead_origem` · `nome_completo` · `cpf` · `rg` · `orgao_emissor` · `data_nascimento` ·
`estado_civil` · `profissao` · `nacionalidade` · `nome_mae` · `nit_pis` · `logradouro` · `numero` ·
`complemento` · `bairro` · `cidade` · `uf` · `cep` · `telefone` · `email` · `link_pasta_drive` ·
`data_contratacao` · `status` · `observacoes`

## Aba 3 · `Casos`
Um cliente pode ter mais de um caso.

`id_caso` · `id_cliente` · `tipo_beneficio` · `via` (Administrativa/Judicial) · `numero_requerimento_nb` ·
`numero_processo_cnj` · `fase` · `data_entrada` · `data_protocolo` · `proxima_acao` · `data_proxima_acao` ·
`probabilidade_exito` (estimativa dela) · `honorarios_contratados` · `historico` · `observacoes`

> `data_proxima_acao` é o motor dos lembretes. É o que substitui a consulta cíclica manual ao Meu INSS.

## Aba 4 · `Documentos`
Uma linha por documento exigido, gerada a partir do checklist do benefício.

`id_doc` · `id_caso` · `nome_documento` · `obrigatorio` · `status` (Pendente/Solicitado/Recebido/Validado) ·
`data_solicitacao` · `data_recebimento` · `link_arquivo` · `observacao`

## Aba 5 · `Agendamentos`

`id_agendamento` · `id_lead` · `id_cliente` · `tipo` (Consulta inicial/Retorno/Perícia/Audiência) ·
`janela_1/2/3` · `data_confirmada` · `modalidade` (Presencial/Vídeo/Telefone) · `link_reuniao` ·
`status` · `lembrete_enviado`

## Aba 6 · `Templates`
Mensagens editáveis por gatilho. **Nenhum template dispara sozinho** — todos geram rascunho.

`id_template` · `gatilho` · `canal` (WhatsApp/E-mail) · `assunto` · `corpo` · `ativo`

Variáveis disponíveis: `{{nome}}` `{{primeiro_nome}}` `{{beneficio}}` `{{fase}}` `{{data}}` `{{hora}}`
`{{docs_pendentes}}` `{{protocolo}}` `{{advogada}}`

## Aba 7 · `Checklists`
Os PDFs de documentos por benefício, transformados em dados. Editável por ela.

`beneficio` · `documento` · `obrigatorio` · `ordem` · `orientacao_ao_cliente`

## Aba 8 · `Config`
Parâmetros do sistema. Um único lugar para calibrar.

`chave` · `valor` · `descricao`

Contém: pesos do scoring, cortes de faixa, lista de benefícios, lista de fases, dados do escritório,
horários de atendimento, texto do rodapé LGPD.

---

## Relacionamentos

```
Leads ──(conversão)──> Clientes ──1:N──> Casos ──1:N──> Documentos
  │                        │                 │
  └──────────────> Agendamentos <────────────┘

Checklists ──(gera)──> Documentos          Config ──(parametriza)──> tudo
Templates  ──(gera)──> rascunhos de mensagem
```
