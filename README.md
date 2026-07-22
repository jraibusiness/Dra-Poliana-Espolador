# Opus AI · Projeto Dra. Poliana Espolador

**Cliente:** Poliana Espolador Bilk Sociedade Individual de Advocacia (CNPJ 51.570.502/0001-99) — Curitiba/PR
**Consultoria:** Opus AI — João Rocha
**Fase atual:** Fase 1 — Setup
**Repositório:** privado. Não contém dados reais de clientes finais.

---

## O que é este projeto

Camada de **entrada e acompanhamento** para um escritório solo de advocacia previdenciária.
O Astrea permanece como sistema de processos. A Opus AI orquestra o que vem **antes e ao redor** dele:
captação de indicações, triagem, agendamento, coleta documental, painel de fases e comunicação com o cliente.

```
Indicação → LP de intake → Scoring → Agendamento → Consulta (modo guiado)
   → Checklist de documentos → Pasta no Drive → Protocolo → Acompanhamento → Encerramento
                                      ↕
                            Astrea (via Ligações Externas + export de contatos)
```

## Princípios não-negociáveis

1. **Nenhuma mensagem sai sem revisão dela.** Tudo é gerado como rascunho editável.
2. **O sistema nunca dá orientação jurídica.** Triagem coleta e organiza; não opina. (Ética OAB)
3. **Zero IA no fluxo de dados.** Scoring e automações são determinísticos. Garantia LGPD verificável.
4. **Os dados moram na conta Google dela.** A Opus AI não hospeda dados de clientes finais.
5. **Custo mensal adicional: R$ 0.** Além do retainer. Nada de assinatura nova para operar.
6. **Gov.br / Meu INSS fora de escopo.** Sem automação de login de terceiros.

## Stack

| Camada | Ferramenta | Custo |
|---|---|---|
| Banco de dados | Google Sheets | R$ 0 |
| Backend / lógica | Google Apps Script | R$ 0 |
| Interface (LP + painel) | HTML/CSS/JS servido pelo GAS | R$ 0 |
| Arquivos | Google Drive (pasta por cliente) | R$ 0 |
| E-mail | GmailApp (envia da conta dela) | R$ 0 |
| WhatsApp | `wa.me` com texto pré-preenchido, envio manual | R$ 0 |
| PDF | GAS → Google Docs → export PDF | R$ 0 |
| Processos | **Astrea** (dela, já contratado) | — |
| Financeiro | **Asaas** (dela, já contratado) | — |

**Add-ons futuros (opcionais, por conta dela):** Brevo (disparo em bloco), Google Workspace (~R$ 35/mês, e-mail com domínio próprio), Google Calendar (agendamento automático — v2).

## Estrutura do repositório

```
opusai-poliana/
├── README.md                  ← este arquivo
├── DECISOES.md                ← log de decisões de arquitetura (por que fizemos assim)
├── docs/
│   ├── 01-mapeamento-fluxo.md      Entregável contratual nº 1
│   ├── 02-modelo-dados.md          Dicionário de dados das 8 abas
│   ├── 03-scoring.md               Algoritmo de classificação de leads
│   ├── 04-integracao-astrea.md     Como conviver com o Astrea sem redundância
│   └── 05-seguranca-lgpd.md        Garantia de confidencialidade
├── data/                      ← CSVs de seed (personagens fictícios) para importar no Sheets
├── config/                    ← parâmetros editáveis (pesos, fases, benefícios, templates)
├── gas/                       ← código Apps Script (fonte da verdade; o editor GAS é deploy)
└── assets/                    ← identidade visual
```

## Planilha de produção

`https://docs.google.com/spreadsheets/d/1wTdKH5mvdMBSW_zHOdOYg_VR9h7rokwlxZM3xZBv-nw/`

## Estado

- [x] Modelo de dados definido
- [x] Personagens fictícios (10) para demonstração
- [x] Algoritmo de scoring
- [ ] Abas criadas e populadas na planilha
- [ ] LP de intake
- [ ] Painel v1 + tour guiado
- [ ] Apresentação à Dra. Poliana
- [ ] Homologação
