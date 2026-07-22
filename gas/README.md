# Código Apps Script

Fonte da verdade do código. O editor do Apps Script é **deploy**, não repositório.

| Arquivo | Papel |
|---|---|
| `Code.gs` | roteamento (`doGet`), camada de dados, endpoints, conversão lead→cliente |
| `Scoring.gs` | score determinístico (espelha `data/gerar_seed.py`) + recálculo em massa |
| `Mensagens.gs` | templates → rascunhos; `wa.me`; rascunho no Gmail. **Nada envia sozinho** |
| `Drive.gs` | pasta por cliente, docs a partir do checklist, relatório PDF, export Astrea |
| `LP.html` | intake: uma pergunta por tela, barra de progresso, LGPD |
| `Painel.html` | Hoje · Leads · Clientes & Casos · Documentos; filtros; modo consulta |
| `Tour.html` | tour guiado de 11 passos (auto-inicia quando `MODO_DEMO=SIM`) |
| `Estilo.html` | identidade visual — único lugar (D-005) |

## Deploy (primeira vez, ~15 min)

1. Abrir a planilha de produção → `Extensões → Apps Script`
2. Criar os arquivos acima com os mesmos nomes e colar o conteúdo
   (`.gs` como Script, `.html` como HTML)
3. Na aba `Config` da planilha:
   - `PAINEL_TOKEN` → gerar um token longo aleatório (ex.: 40 caracteres)
   - `DRIVE_PASTA_RAIZ` → ID da pasta raiz dos clientes no Drive
   - e-mail e WhatsApp reais do escritório
4. `Implantar → Nova implantação → App da Web`:
   - Executar como: **você** (a conta dona da planilha)
   - Quem pode acessar: **Qualquer pessoa** *(necessário para a LP pública; o painel
     fica protegido pelo token — sem `?page=painel&k=TOKEN` correto, nada é exibido)*
5. URLs resultantes:
   - **LP:** `URL_DO_APP` (sem parâmetros)
   - **Painel:** `URL_DO_APP?page=painel&k=SEU_TOKEN` → salvar como favorito no celular dela
6. Primeira execução pede autorização de escopos (Sheets, Drive, Gmail, Docs) — aceitar.

## Homologação → produção

Mudar `MODO_DEMO` para `NAO` (desliga o auto-tour), apagar as linhas fictícias das abas
operacionais (manter `Config`, `Checklists`, `Templates`) e trocar o `PAINEL_TOKEN`.

## Teste local

`data/gerar_seed.py` reproduz o algoritmo de `Scoring.gs`; divergência entre os dois = bug.
Preview standalone com mock + Playwright: ver histórico do repositório (harness em `/tmp/preview`).
