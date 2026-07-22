# 03 · Scoring de leads

Determinístico, auditável, editável. **Sem IA** — o cálculo é uma soma de pesos, e ela pode ver e mudar cada peso.

## O que o score responde

Não é "este caso vai ganhar". É: **"quem eu atendo primeiro?"**
Um score alto significa alta probabilidade de contratação combinada com necessidade real e imediata.
A avaliação jurídica continua sendo dela, na consulta. O sistema nunca opina sobre mérito.

## Fatores e pesos (padrão — ajustáveis na aba Config)

| Fator | Condição | Peso |
|---|---|---|
| `PESO_NEGATIVA` | Benefício requerido e **negado** | +30 |
| `PESO_CESSADO` | Benefício **cessado** (recebia e parou) | +30 |
| `PESO_URGENCIA_ALTA` | "Estou sem renda" | +25 |
| `PESO_URGENCIA_MEDIA` | "Preciso resolver em breve" | +10 |
| `PESO_DOCS_COMPLETOS` | "Tenho tudo" | +20 |
| `PESO_DOCS_PARCIAIS` | "Tenho parte" | +10 |
| `PESO_BENEFICIO_ALTO` | Aposentadorias, incapacidade, pensão por morte, BPC | +15 |
| `PESO_INDICACAO_NOMINAL` | Informou quem indicou | +10 |
| `PESO_RELATO_DETALHADO` | Relato com mais de 200 caracteres | +5 |
| `PESO_SO_DUVIDAS` | "Sem pressa" **e** "Nunca requeri" **e** sem documentos | −20 |
| `PESO_FORA_AREA` | Benefício = "Não sei / Outro assunto" | −15 |

## Faixas

| Faixa | Corte | Leitura | Sugestão do painel |
|---|---|---|---|
| **Prioritário** | ≥ 70 | Dor imediata, pronto para contratar | Responder em até 24h |
| **Qualificado** | 40–69 | Caso real, precisa de nutrição | Responder em até 3 dias |
| **Em avaliação** | 20–39 | Interesse genuíno, sem urgência | Agendar quando houver folga |
| **Informativo** | < 20 | Busca informação, não serviço | Resposta padrão cordial |

> Faixa **não** é rótulo visível ao lead. Ninguém é informado de que foi classificado.
> É uma ferramenta interna de ordenação da atenção dela.

## Pseudocódigo

```
score = 0
se situacao == "Requeri e foi negado"      -> score += PESO_NEGATIVA
se situacao == "Recebia e foi cessado"     -> score += PESO_CESSADO
se urgencia == "Estou sem renda"           -> score += PESO_URGENCIA_ALTA
senão se urgencia == "Preciso resolver..." -> score += PESO_URGENCIA_MEDIA
se tem_documentos == "Tenho tudo"          -> score += PESO_DOCS_COMPLETOS
senão se tem_documentos == "Tenho parte"   -> score += PESO_DOCS_PARCIAIS
se beneficio em LISTA_ALTO_VALOR           -> score += PESO_BENEFICIO_ALTO
se quem_indicou preenchido                 -> score += PESO_INDICACAO_NOMINAL
se tamanho(relato) > 200                   -> score += PESO_RELATO_DETALHADO
se (sem pressa E nunca requeri E sem docs) -> score += PESO_SO_DUVIDAS
se beneficio == "Não sei / Outro"          -> score += PESO_FORA_AREA
score = limitar(score, 0, 100)
```

## Por que isto é defensável

1. **Explicável.** O painel mostra a decomposição: "92 = negativa (30) + sem renda (25) + docs (20) + benefício (15) + indicação (10) − ...". Ela vê a conta.
2. **Editável.** Se ela achar que "tem documentos" vale mais que urgência, muda o número na Config.
3. **Estável.** O mesmo lead, no mesmo dia, sempre recebe o mesmo score. Um modelo de linguagem não garante isso.
4. **Sem custo e sem exposição de dados.** Roda dentro da planilha dela.
