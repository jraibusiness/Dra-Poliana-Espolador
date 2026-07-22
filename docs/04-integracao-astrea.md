# 04 · Integração com o Astrea (anti-redundância)

## Premissa

O Astrea **não tem API pública**. Qualquer promessa de sincronização profunda seria frágil e violaria os
termos de uso. Não fazemos scraping. A integração é por **pontes documentadas e oficiais** — e elas bastam.

## Onde cada sistema atua

| | Opus AI | Astrea |
|---|---|---|
| Captação e triagem de indicações | ✅ | ❌ (começa no cliente já cadastrado) |
| Agendamento da consulta inicial | ✅ | parcial |
| Coleta e conferência documental | ✅ | ❌ |
| Acompanhamento do **processo administrativo INSS** | ✅ | ❌ *(o robô não alcança — não há publicação em diário)* |
| Acompanhamento do **processo judicial** | ❌ | ✅ *(captura de publicações — é o forte dele)* |
| Prazos, agenda processual, petições | ❌ | ✅ |
| Geração de procuração e contrato | ❌ | ✅ *(Documentos Padrão)* |
| Financeiro / honorários | ❌ | Asaas |

Zero sobreposição. Duas lanes.

---

## Ponte 1 · Documentos → "Ligações Externas"

O Astrea permite anexar **links externos** do Google Drive à ficha do processo, justamente para não
consumir a cota de armazenamento com laudos médicos pesados. É o padrão de mercado na advocacia previdenciária.

**Como usamos:** cada cliente ganha uma pasta no Drive no momento da conversão.
O link vive na coluna `link_pasta_drive`. Ela cola esse link **uma vez** na ficha do Astrea.
A partir daí, todo documento coletado pela nossa plataforma aparece "dentro" do Astrea, sem sync, sem custo.

## Ponte 2 · Cadastro → Documentos Padrão

O Astrea preenche procurações, declarações de hipossuficiência e contratos automaticamente a partir dos
**metadados do cliente**. Por isso as colunas da aba `Clientes` foram desenhadas para serem exatamente esses campos:

`nome_completo` · `cpf` · `rg` + `orgao_emissor` · `data_nascimento` · `estado_civil` · `profissao` ·
`nacionalidade` · `nome_mae` · `nit_pis` · endereço completo · `telefone` · `email`

**Botão "Exportar para Astrea"** no painel, com duas saídas:
- **CSV** no layout de importação de contatos do Astrea (importação em lote);
- **Bloco formatado** para copiar e colar em um cadastro individual.

Resultado: o dado é digitado **uma vez** — e, na maioria dos casos, pelo próprio lead no formulário.
Ela nunca redigita.

> ⚠️ Validar o layout exato do CSV de importação do Astrea antes da homologação.
> Se o formato divergir, ajustamos o mapeamento de colunas — mudança de minutos, não de arquitetura.

## Ponte 3 · Vocabulário de fases

As fases do nosso painel usam as mesmas etiquetas que escritórios previdenciários criam manualmente no
Astrea ("Aguardando perícia médica", "Exigência de documentação", "Em análise de cálculo").
Ela olha os dois sistemas e lê a mesma língua.

---

## O que deliberadamente **não** fazemos

- Login automatizado no Astrea, no Gov.br ou no Meu INSS.
- Scraping de qualquer plataforma.
- Substituir o controle de prazos judiciais — esse é o valor central do Astrea e ele faz bem.
