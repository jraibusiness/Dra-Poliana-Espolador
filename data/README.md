# Dados de seed

**Todos os 10 personagens são fictícios.** CPFs, RGs, NITs, telefones e e-mails são inválidos por
construção. Nenhum dado real de cliente entra neste repositório — nunca.

## Como importar na planilha

Para cada arquivo, na planilha de produção:

1. Criar a aba com o nome exato: `Leads`, `Clientes`, `Casos`, `Documentos`, `Agendamentos`, `Templates`, `Checklists`, `Config`
2. `Arquivo → Importar → Fazer upload` → selecionar o CSV
3. Local de importação: **Substituir planilha atual** (com a aba certa aberta)
4. Tipo de separador: **Vírgula**
5. Desmarcar "Converter texto em números e datas" — preserva CPFs, telefones e códigos com zero à esquerda

> Ordem recomendada: `08_config` primeiro, `07_checklists` depois, e só então os operacionais.

## Regenerar

```bash
python3 gerar_seed.py
```

O `score` e a `faixa` dos leads **não são digitados** — o script os calcula a partir dos pesos da
aba Config. Mudou um peso, roda de novo e todos os leads se recalculam. É a mesma lógica que o
Apps Script vai executar em produção; manter as duas em paralelo é proposital, serve de teste.

## Os 10 personagens

| ID | Nome | Perfil | Score | Estado |
|---|---|---|---|---|
| L001 | Iolanda Prestes Camargo, 71 | Viúva, união estável de 22 anos sem registro, pensão negada | 95 | **Lead novo** |
| L002 | Renata Kowalski, 34 | Técnica de enfermagem, auxílio cessado por alta programada | 95 | **Lead novo** |
| L003 | Wilson Tadeu Brancalione, 58 | Soldador, 26 anos de insalubridade, uma empresa extinta | 50 | **Lead agendado** |
| L004 | Gilberto Prosdócimo Hauer, 68 | Aposentado, viu vídeo sobre revisão da vida toda | 30 | **Lead contatado** |
| L005 | Josué Antunes da Silveira, 45 | Entregador de app, só quer entender seus direitos | 0 | **Lead informativo** |
| C001 | Sebastião Aparecido Nogueira, 63 | Rural sem registro + 28 anos de metalúrgica | 45 | Protocolado — aguardando análise |
| C002 | Adriana Bueno Stresser, 38 | Professora, disfonia crônica, perícia em 30/07 | 100 | Aguardando perícia médica |
| C003 | Osvaldo Kruger Filho, 60 | Frentista, vínculo 1989-93 fora do CNIS | 75 | **Exigência — prazo 08/08** |
| C004 | Marlene do Rocio Ferreira, 49 | Mãe de criança com TEA, BPC negado por renda | 95 | Judicial — ajuizado |
| C005 | Cleuza Mitiko Nakagawa, 66 | Costureira, carnês perdidos numa mudança | 35 | Deferido — implantação |

### O que cada personagem demonstra no tour

- **Iolanda e Renata** — o painel ordenando por prioridade real, não por ordem de chegada
- **Wilson** — o ciclo de agendamento: 3 janelas sugeridas, ela escolhe 1
- **Gilberto** — lead morno que não deve consumir atenção agora, mas não pode ser perdido
- **Josué** — resposta cordial padronizada para quem busca informação, não serviço
- **Sebastião** — caso administrativo em espera, com lembrete de consulta cíclica ao Meu INSS
- **Adriana** — disparo do template de preparação para perícia
- **Osvaldo** — **o caso com prazo**. A tela "Hoje" existe por causa dele
- **Marlene** — a transição administrativo → judicial, onde o Astrea assume
- **Cleuza** — o final feliz **e a lição mais importante**: entrou com score 35 e ganhou.
  O score ordena atenção; ele não julga mérito. Isso precisa ficar explícito no tour, para
  que ela nunca confunda a ferramenta com um oráculo.
