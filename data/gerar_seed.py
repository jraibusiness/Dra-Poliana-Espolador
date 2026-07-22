#!/usr/bin/env python3
"""
Gera os CSVs de seed do projeto Dra. Poliana.
10 personagens 100% fictícios. CPFs, NITs e telefones são inválidos por construção.
Uso: python3 gerar_seed.py
"""
import csv, os

OUT = os.path.dirname(os.path.abspath(__file__))

def w(nome, header, rows):
    with open(os.path.join(OUT, nome), "w", newline="", encoding="utf-8") as f:
        wr = csv.writer(f)
        wr.writerow(header)
        wr.writerows(rows)
    print(f"  {nome}: {len(rows)} linhas")

# ─────────────────────────────────────────────────────────────── LEADS
leads_h = ["id_lead","data_entrada","nome","telefone","email","cidade","origem","quem_indicou",
           "beneficio_pretendido","situacao","ja_teve_negativa","tem_documentos","urgencia","relato",
           "score","faixa","janela_1","janela_2","janela_3","janela_escolhida","status_lead",
           "id_cliente","observacoes"]

leads = [
["L001","2026-07-20","Iolanda Prestes Camargo","+5541999010001","iolanda.camargo@exemplo.com","Curitiba","Indicação","Sebastião Nogueira",
 "Pensão por morte","Requeri e foi negado","Sim","Tenho parte","Estou sem renda",
 "Vivi 22 anos com o Aristides sem papel passado. Quando ele faleceu em março, entrei no Meu INSS e negaram dizendo que eu não provei que a gente era casado. Tenho conta de luz no nome dele no meu endereço, foto de festa de família, e o pessoal da igreja se dispõe a testemunhar. Estou vivendo com ajuda da minha filha.",
 95,"Prioritário","2026-07-23 14:00","2026-07-24 09:00","2026-07-25 10:00","","Novo","",""],

["L002","2026-07-20","Renata Kowalski","+5541999010002","renata.kowalski@exemplo.com","Pinhais","Instagram","",
 "Auxílio por incapacidade temporária","Recebia e foi cessado","Sim","Tenho tudo","Estou sem renda",
 "Sou técnica de enfermagem, tenho tenossinovite nos dois punhos. Recebia o auxílio e cortaram na alta programada sem nova perícia. Não consigo voltar a trabalhar, meu ortopedista foi claro. Tenho todos os laudos.",
 90,"Prioritário","2026-07-22 18:00","2026-07-23 18:30","2026-07-24 19:00","","Novo","",""],

["L003","2026-07-17","Wilson Tadeu Brancalione","+5541999010003","wilson.brancalione@exemplo.com","São José dos Pinhais","Indicação","Osvaldo Kruger",
 "Aposentadoria especial","Nunca requeri","Não","Tenho parte","Preciso resolver em breve",
 "Trabalhei 26 anos como soldador em três empresas, sempre com ruído alto e fumos metálicos. Duas ainda existem e acho que consigo o PPP. A terceira fechou em 2009 e não sei o que fazer. O Osvaldo disse que a senhora resolveu o caso dele.",
 50,"Qualificado","2026-07-22 08:00","2026-07-24 08:00","2026-07-25 08:00","2026-07-22 08:00","Agendado","",""],

["L004","2026-07-15","Gilberto Prosdócimo Hauer","+5541999010004","gilberto.hauer@exemplo.com","Curitiba","Indicação","Marlene Ferreira",
 "Revisão de benefício","Recebo e quero revisar","Não","Tenho tudo","Sem pressa",
 "Me aposentei em 2013 e vi num vídeo que pode ter revisão pra quem contribuiu antes de 1994. Queria entender se vale a pena no meu caso.",
 30,"Em avaliação","2026-07-28 15:00","2026-07-29 15:00","2026-07-30 15:00","","Contatado","",""],

["L005","2026-07-19","Josué Antunes da Silveira","+5541999010005","josue.silveira@exemplo.com","Colombo","Google","",
 "Auxílio-acidente","Nunca requeri","Não","Não tenho nada","Sem pressa",
 "Trabalho como entregador de aplicativo e pago o carnê como autônomo. Queria só saber se, no caso de acontecer alguma coisa comigo na rua, eu teria direito a alguma coisa do INSS. Não é nada urgente, é mais pra me organizar mesmo.",
 0,"Informativo","","","","","Novo","",""],

# ── leads já convertidos (histórico) — sustentam os 5 clientes
["L006","2026-03-02","Sebastião Aparecido Nogueira","+5541999010006","sebastiao.nogueira@exemplo.com","Araucária","Indicação","Marilza (vizinha)",
 "Aposentadoria por tempo de contribuição (híbrida)","Nunca requeri","Não","Tenho parte","Preciso resolver em breve",
 "Trabalhei na roça em Nova Cantu dos 12 aos 24 anos, sem carteira. Depois vim pra Curitiba e fiquei 28 anos na metalúrgica, esse tempo está tudo registrado. Queria contar o tempo da roça também.",
 50,"Qualificado","2026-03-04 10:00","2026-03-05 10:00","2026-03-06 14:00","2026-03-04 10:00","Convertido","C001",""],

["L007","2026-04-11","Adriana Bueno Stresser","+5541999010007","adriana.stresser@exemplo.com","Curitiba","Indicação","Renata (colega de trabalho)",
 "Auxílio por incapacidade temporária","Recebia e foi cessado","Sim","Tenho tudo","Estou sem renda",
 "Sou professora da rede municipal há 14 anos. Desenvolvi disfonia crônica com nódulos nas cordas vocais e um quadro de transtorno de ansiedade. O benefício foi cessado e a escola não tem função readaptada disponível.",
 100,"Prioritário","2026-04-13 17:00","2026-04-14 17:00","2026-04-15 17:00","2026-04-13 17:00","Convertido","C002",""],

["L008","2026-02-06","Osvaldo Kruger Filho","+5541999010008","osvaldo.kruger@exemplo.com","Curitiba","Indicação","Cleuza Nakagawa",
 "Aposentadoria por idade urbana","Requeri e foi negado","Sim","Tenho parte","Preciso resolver em breve",
 "Fui frentista a vida toda, em cinco postos diferentes. Pedi a aposentadoria sozinho pelo aplicativo e negaram por falta de carência. Tenho carteiras antigas guardadas.",
 75,"Prioritário","2026-02-09 09:00","2026-02-10 09:00","2026-02-11 09:00","2026-02-09 09:00","Convertido","C003",""],

["L009","2026-01-16","Marlene do Rocio Ferreira","+5541999010009","marlene.ferreira@exemplo.com","Almirante Tamandaré","Indicação","Igreja / grupo de mães",
 "BPC/LOAS - Pessoa com deficiência","Requeri e foi negado","Sim","Tenho parte","Estou sem renda",
 "Meu filho Kauê tem 9 anos e é autista nível 2, precisa de acompanhamento em tempo integral. Larguei o emprego para cuidar dele. Pedi o BPC e negaram dizendo que a renda da casa passa do limite, mas eles contaram o salário do meu irmão que só mora junto por necessidade.",
 95,"Prioritário","2026-01-19 13:00","2026-01-20 13:00","2026-01-21 13:00","2026-01-19 13:00","Convertido","C004",""],

["L010","2025-11-24","Cleuza Mitiko Nakagawa","+5541999010010","cleuza.nakagawa@exemplo.com","Curitiba","Indicação","Cliente antiga",
 "Aposentadoria por idade urbana","Nunca requeri","Não","Tenho parte","Sem pressa",
 "Costurei por conta própria a vida inteira. Paguei carnê muitos anos mas perdi vários comprovantes numa mudança. Fiz 66 anos e queria ver se dá pra me aposentar.",
 40,"Qualificado","2025-11-27 11:00","2025-11-28 11:00","2025-12-01 11:00","2025-11-27 11:00","Convertido","C005",""],
]

# ───────────────────────────────────────────────────────────── CLIENTES
cli_h = ["id_cliente","id_lead_origem","nome_completo","cpf","rg","orgao_emissor","data_nascimento",
         "estado_civil","profissao","nacionalidade","nome_mae","nit_pis","logradouro","numero",
         "complemento","bairro","cidade","uf","cep","telefone","email","link_pasta_drive",
         "data_contratacao","status","observacoes"]

clientes = [
["C001","L006","Sebastião Aparecido Nogueira","111.222.333-44","3.884.221-0","SSP/PR","1963-05-14","Casado","Metalúrgico aposentável","Brasileira","Benedita Aparecida Nogueira","120.11122.33-4",
 "Rua Antônio Bordignon","742","","Costeira","Araucária","PR","83702-000","+5541999010006","sebastiao.nogueira@exemplo.com",
 "https://drive.google.com/drive/folders/EXEMPLO-C001","2026-03-06","Ativo","Tempo rural depende de prova material + testemunhal. Sindicato rural de Nova Cantu emitiu declaração."],

["C002","L007","Adriana Bueno Stresser","222.333.444-55","7.112.905-3","SSP/PR","1988-02-27","Divorciada","Professora","Brasileira","Neusa Bueno","121.22233.44-5",
 "Rua Nunes Machado","1180","apto 803","Rebouças","Curitiba","PR","80230-090","+5541999010007","adriana.stresser@exemplo.com",
 "https://drive.google.com/drive/folders/EXEMPLO-C002","2026-04-15","Ativo","Perícia médica agendada. Cliente ansiosa — pergunta status com frequência."],

["C003","L008","Osvaldo Kruger Filho","333.444.555-66","2.556.401-8","SSP/PR","1966-09-03","Casado","Frentista","Brasileira","Erna Kruger","122.33344.55-6",
 "Rua Rio Grande do Norte","55","fundos","Água Verde","Curitiba","PR","80620-110","+5541999010008","osvaldo.kruger@exemplo.com",
 "https://drive.google.com/drive/folders/EXEMPLO-C003","2026-02-11","Ativo","INSS abriu exigência: vínculo 1989-1993 não consta no CNIS. Buscando CTPS original."],

["C004","L009","Marlene do Rocio Ferreira","444.555.666-77","5.900.773-2","SSP/PR","1977-06-30","Solteira","Do lar / cuidadora","Brasileira","Zilda do Rocio Ferreira","123.44455.66-7",
 "Rua Emílio Romani","208","","Jardim Paranaense","Almirante Tamandaré","PR","83504-000","+5541999010009","marlene.ferreira@exemplo.com",
 "https://drive.google.com/drive/folders/EXEMPLO-C004","2026-01-21","Ativo","Indeferimento administrativo mantido. Ação ajuizada — discussão sobre composição do grupo familiar."],

["C005","L010","Cleuza Mitiko Nakagawa","555.666.777-88","4.203.118-5","SSP/PR","1959-10-08","Viúva","Costureira","Brasileira","Sumiko Nakagawa","124.55566.77-8",
 "Rua Itupava","933","casa 2","Alto da Rua XV","Curitiba","PR","80040-000","+5541999010010","cleuza.nakagawa@exemplo.com",
 "https://drive.google.com/drive/folders/EXEMPLO-C005","2025-12-01","Ativo","Benefício concedido em 06/2026. Aguardando primeiro pagamento e cálculo de atrasados."],
]

# ──────────────────────────────────────────────────────────────── CASOS
casos_h = ["id_caso","id_cliente","tipo_beneficio","via","numero_requerimento_nb","numero_processo_cnj",
           "fase","data_entrada","data_protocolo","proxima_acao","data_proxima_acao",
           "probabilidade_exito","honorarios_contratados","historico","observacoes"]

casos = [
["CS001","C001","Aposentadoria por tempo de contribuição (híbrida)","Administrativa","708.221.334-9","",
 "Protocolado - aguardando análise","2026-03-06","2026-04-02","Consultar andamento no Meu INSS","2026-07-24",
 "Alta","30% do proveito econômico",
 "06/03 contratação | 18/03 documentos completos | 02/04 requerimento protocolado | 19/05 sem movimentação | 26/06 sem movimentação",
 "Se indeferir por tempo rural, já temos declaração do sindicato e 2 testemunhas mapeadas para a via judicial."],

["CS002","C002","Auxílio por incapacidade temporária","Administrativa","709.114.870-2","",
 "Aguardando perícia médica","2026-04-15","2026-04-22","Preparar cliente para a perícia - enviar orientações","2026-07-27",
 "Alta","3 salários mínimos",
 "15/04 contratação | 22/04 requerimento protocolado | 12/06 perícia agendada para 30/07",
 "Perícia em 30/07 às 10h20, APS Curitiba-Centro. Levar laudos originais e exame de videolaringoscopia."],

["CS003","C003","Aposentadoria por idade urbana","Administrativa","706.998.201-4","",
 "Exigência de documentação","2026-02-11","2026-02-25","Protocolar resposta à exigência","2026-07-23",
 "Média","30% do proveito econômico",
 "11/02 contratação | 25/02 requerimento protocolado | 09/07 INSS abriu exigência - prazo 30 dias",
 "PRAZO. Falta CTPS do vínculo Posto Bandeirante (1989-1993). Cliente foi buscar caixa de documentos na casa da irmã."],

["CS004","C004","BPC/LOAS - Pessoa com deficiência","Judicial","705.330.112-7","5001234-56.2026.4.04.7000",
 "Judicial - ajuizado","2026-01-21","2026-05-14","Aguardar designação de perícia socioeconômica","2026-08-10",
 "Média","30% das parcelas vencidas",
 "21/01 contratação | 05/02 requerimento administrativo | 28/04 indeferido por renda per capita | 14/05 ação ajuizada na JF de Curitiba",
 "Tese: irmão não integra o grupo familiar para fins do art. 20 da LOAS. Laudo do CAPSi juntado."],

["CS005","C005","Aposentadoria por idade urbana","Administrativa","704.771.556-3","",
 "Deferido - implantação","2025-12-01","2025-12-19","Conferir valor implantado e calcular atrasados","2026-07-25",
 "Concluída","30% do proveito econômico",
 "01/12 contratação | 19/12 requerimento protocolado | 11/03 exigência de comprovantes | 02/04 exigência cumprida | 27/06 DEFERIDO",
 "Concedido com DIB retroativa à DER. Verificar se os carnês recuperados foram todos computados na RMI."],
]

# ─────────────────────────────────────────────────────────── DOCUMENTOS
docs_h = ["id_doc","id_caso","nome_documento","obrigatorio","status","data_solicitacao",
          "data_recebimento","link_arquivo","observacao"]

documentos = [
["D001","CS001","Documento de identidade (RG/CNH)","Sim","Validado","2026-03-06","2026-03-08","https://drive.google.com/EXEMPLO/d001",""],
["D002","CS001","CPF","Sim","Validado","2026-03-06","2026-03-08","https://drive.google.com/EXEMPLO/d002",""],
["D003","CS001","Comprovante de residência","Sim","Validado","2026-03-06","2026-03-08","https://drive.google.com/EXEMPLO/d003",""],
["D004","CS001","CTPS (todas as páginas)","Sim","Validado","2026-03-06","2026-03-11","https://drive.google.com/EXEMPLO/d004","3 carteiras"],
["D005","CS001","Extrato CNIS","Sim","Validado","2026-03-06","2026-03-11","https://drive.google.com/EXEMPLO/d005",""],
["D006","CS001","Declaração do sindicato rural","Sim","Validado","2026-03-06","2026-03-18","https://drive.google.com/EXEMPLO/d006","Sindicato de Nova Cantu"],
["D007","CS001","Notas de produtor rural / documentos do sítio","Não","Recebido","2026-03-06","2026-03-18","https://drive.google.com/EXEMPLO/d007","Do pai; parcial"],
["D008","CS002","Documento de identidade (RG/CNH)","Sim","Validado","2026-04-15","2026-04-16","https://drive.google.com/EXEMPLO/d008",""],
["D009","CS002","Laudos e relatórios médicos","Sim","Validado","2026-04-15","2026-04-16","https://drive.google.com/EXEMPLO/d009","Otorrino + psiquiatra"],
["D010","CS002","Exames complementares","Sim","Validado","2026-04-15","2026-04-18","https://drive.google.com/EXEMPLO/d010","Videolaringoscopia"],
["D011","CS002","Comunicação de decisão de cessação","Sim","Validado","2026-04-15","2026-04-16","https://drive.google.com/EXEMPLO/d011",""],
["D012","CS002","Declaração do empregador sobre readaptação","Não","Solicitado","2026-06-30","","","Secretaria de Educação não respondeu"],
["D013","CS003","CTPS - Posto Bandeirante (1989-1993)","Sim","Pendente","2026-07-10","","","EXIGÊNCIA INSS - prazo 08/08"],
["D014","CS003","Extrato CNIS","Sim","Validado","2026-02-11","2026-02-13","https://drive.google.com/EXEMPLO/d014",""],
["D015","CS003","Comunicação de decisão (indeferimento)","Sim","Validado","2026-02-11","2026-02-13","https://drive.google.com/EXEMPLO/d015",""],
["D016","CS004","Laudo médico circunstanciado (CID)","Sim","Validado","2026-01-21","2026-01-24","https://drive.google.com/EXEMPLO/d016","CAPSi - TEA nível 2"],
["D017","CS004","Relatório escolar / APAE","Sim","Validado","2026-01-21","2026-01-29","https://drive.google.com/EXEMPLO/d017",""],
["D018","CS004","CadÚnico atualizado","Sim","Validado","2026-01-21","2026-01-27","https://drive.google.com/EXEMPLO/d018",""],
["D019","CS004","Comprovantes de renda do grupo familiar","Sim","Validado","2026-01-21","2026-02-02","https://drive.google.com/EXEMPLO/d019","Ponto controvertido"],
["D020","CS005","Carnês de contribuição recuperados","Sim","Validado","2025-12-01","2026-03-25","https://drive.google.com/EXEMPLO/d020","Recuperados via extrato bancário"],
["D021","CS005","Extrato CNIS","Sim","Validado","2025-12-01","2025-12-05","https://drive.google.com/EXEMPLO/d021",""],
["D022","CS005","Carta de concessão","Sim","Recebido","2026-06-27","2026-06-29","https://drive.google.com/EXEMPLO/d022",""],
]

# ────────────────────────────────────────────────────────── AGENDAMENTOS
ag_h = ["id_agendamento","id_lead","id_cliente","tipo","janela_1","janela_2","janela_3",
        "data_confirmada","modalidade","link_reuniao","status","lembrete_enviado"]

agendamentos = [
["A001","L001","","Consulta inicial","2026-07-23 14:00","2026-07-24 09:00","2026-07-25 10:00","","","","Aguardando escolha da advogada","Não"],
["A002","L002","","Consulta inicial","2026-07-22 18:00","2026-07-23 18:30","2026-07-24 19:00","","","","Aguardando escolha da advogada","Não"],
["A003","L003","","Consulta inicial","2026-07-22 08:00","2026-07-24 08:00","2026-07-25 08:00","2026-07-22 08:00","Vídeo","https://meet.google.com/exemplo-a003","Confirmado","Sim"],
["A004","L004","","Consulta inicial","2026-07-28 15:00","2026-07-29 15:00","2026-07-30 15:00","","","","Aguardando escolha da advogada","Não"],
["A005","","C002","Perícia médica (INSS)","","","","2026-07-30 10:20","Presencial","APS Curitiba-Centro","Confirmado","Não"],
["A006","","C003","Retorno - entrega de documento","","","","2026-07-23 16:00","Telefone","","Confirmado","Sim"],
["A007","","C005","Retorno - conferência de valores","","","","2026-07-25 09:30","Vídeo","https://meet.google.com/exemplo-a007","Confirmado","Não"],
]

# ───────────────────────────────────────────────────────────── TEMPLATES
tpl_h = ["id_template","gatilho","canal","assunto","corpo","ativo"]

templates = [
["T001","Lead recebido pela LP","E-mail","Recebi seu contato - Dra. Poliana Espolador",
 "Olá, {{primeiro_nome}}!\n\nRecebi as informações que você enviou sobre {{beneficio}} e já estão comigo.\n\nVou analisar o seu caso com atenção e retorno para confirmarmos o melhor horário entre os que você indicou.\n\nQualquer documento que você já tenha em mãos, pode ir separando — vamos conversar sobre isso.\n\nUm abraço,\nPoliana Espolador\nOAB/PR — Advocacia Previdenciária","Sim"],

["T002","Consulta confirmada","WhatsApp","",
 "{{primeiro_nome}}, tudo bem? Aqui é a Dra. Poliana.\n\nConfirmando nossa conversa para {{data}} às {{hora}}. Vou te ligar neste mesmo número.\n\nSe puder, deixe por perto seus documentos pessoais e qualquer papel do INSS que você tenha. Não precisa organizar nada — é só ter à mão.\n\nAté lá!","Sim"],

["T003","Envio do checklist de documentos","E-mail","Documentos para o seu pedido de {{beneficio}}",
 "{{primeiro_nome}}, foi muito bom conversar com você.\n\nComo combinamos, segue a lista dos documentos que preciso para dar entrada no seu pedido:\n\n{{docs_pendentes}}\n\nVocê pode me enviar por foto mesmo, desde que dê para ler. Se algum documento você não tiver, me avise — na maioria das vezes existe outro caminho.\n\nQualquer dúvida, é só chamar.\n\nPoliana Espolador","Sim"],

["T004","Lembrete de documento pendente","WhatsApp","",
 "Oi, {{primeiro_nome}}! Passando para lembrar dos documentos que ainda faltam para o seu caso:\n\n{{docs_pendentes}}\n\nAssim que chegarem, já dou entrada. Se estiver difícil conseguir algum, me fala que a gente pensa junto numa alternativa.","Sim"],

["T005","Resposta a pedido de status","WhatsApp","",
 "{{primeiro_nome}}, tudo bem?\n\nSeu processo de {{beneficio}} está em: {{fase}}.\nProtocolo: {{protocolo}}\n\nAssim que houver qualquer movimentação, eu te aviso — você não precisa ficar acompanhando.","Sim"],

["T006","Preparação para perícia médica","WhatsApp","",
 "{{primeiro_nome}}, sua perícia está marcada para {{data}} às {{hora}}.\n\nAlgumas orientações importantes:\n• Chegue com 30 minutos de antecedência\n• Leve documento com foto\n• Leve TODOS os laudos e exames, de preferência os originais\n• Responda ao perito com clareza sobre suas limitações no dia a dia\n\nQualquer dúvida antes do dia, me chame.","Sim"],

["T007","Exigência do INSS","WhatsApp","",
 "{{primeiro_nome}}, o INSS pediu um documento a mais para analisar o seu pedido. Isso é comum e não significa negativa.\n\nPreciso de: {{docs_pendentes}}\n\nTemos prazo até {{data}}. Assim que você conseguir, me envie que eu protocolo a resposta.","Sim"],

["T008","Benefício deferido","WhatsApp","",
 "{{primeiro_nome}}, tenho uma ótima notícia! 🎉\n\nSeu pedido de {{beneficio}} foi DEFERIDO.\n\nVou conferir os valores e o cálculo para garantir que está tudo correto, e te explico os próximos passos.\n\nParabéns — foi um caminho longo e deu certo.","Sim"],

["T009","Agradecimento a quem indicou","WhatsApp","",
 "Oi! Aqui é a Dra. Poliana.\n\nSó passei para agradecer por ter indicado meu trabalho. Confiança que vem de indicação é a que mais me honra.\n\nMuito obrigada mesmo!","Sim"],

["T010","Lead informativo (sem urgência)","E-mail","Sobre a sua dúvida - Dra. Poliana Espolador",
 "Olá, {{primeiro_nome}}!\n\nRecebi sua mensagem. Sua dúvida é pertinente e merece uma resposta cuidadosa, que depende de alguns detalhes da sua situação específica.\n\nQuando quiser conversar com calma, é só me chamar — deixo o canal aberto, sem compromisso.\n\nAté breve,\nPoliana Espolador","Sim"],
]

# ──────────────────────────────────────────────────────────── CHECKLISTS
chk_h = ["beneficio","documento","obrigatorio","ordem","orientacao_ao_cliente"]

BASE = [("Documento de identidade (RG ou CNH)","Sim","Frente e verso, legível"),
        ("CPF","Sim","Pode ser o número no RG/CNH"),
        ("Comprovante de residência atualizado","Sim","Últimos 3 meses"),
        ("Certidão de nascimento ou casamento","Sim","Atualizada"),
        ("Extrato CNIS","Sim","Baixe no Meu INSS ou eu obtenho para você"),
        ("Senha do Meu INSS","Não","Só se você quiser que eu acompanhe junto com você")]

ESPEC = {
 "Aposentadoria por idade urbana":[("CTPS - todas as páginas com anotação","Sim","Inclusive carteiras antigas"),
   ("Carnês de contribuição (GPS)","Não","Se contribuiu como autônomo"),
   ("Comprovantes de pagamento em atraso","Não","Se houver")],
 "Aposentadoria por tempo de contribuição (híbrida)":[("CTPS - todas as páginas com anotação","Sim","Todas as carteiras"),
   ("Declaração de sindicato rural","Sim","Do município onde trabalhou na roça"),
   ("Notas fiscais de produtor rural","Não","Podem estar no nome dos pais"),
   ("Certidão de casamento com profissão 'lavrador'","Não","Prova material valiosa"),
   ("Histórico escolar rural","Não","Se estudou em escola rural"),
   ("Contato de 2 testemunhas","Sim","Que trabalharam com você na época")],
 "Aposentadoria especial":[("PPP - Perfil Profissiográfico Previdenciário","Sim","Solicite ao RH de cada empresa"),
   ("LTCAT","Não","Se a empresa fornecer"),
   ("CTPS - todas as páginas","Sim",""),
   ("Contato das empresas onde trabalhou","Sim","Inclusive as que fecharam")],
 "Auxílio por incapacidade temporária":[("Laudos e relatórios médicos","Sim","Com CID e assinatura do médico"),
   ("Exames complementares","Sim","Os mais recentes"),
   ("Receituários e prescrições","Não","Comprovam tratamento continuado"),
   ("Atestados de afastamento","Não",""),
   ("Comunicação de decisão do INSS","Não","Se já houve pedido anterior")],
 "BPC/LOAS - Pessoa com deficiência":[("Laudo médico circunstanciado","Sim","Com CID e descrição das limitações"),
   ("CadÚnico atualizado","Sim","Atualize no CRAS do seu bairro"),
   ("Comprovantes de renda de todos que moram na casa","Sim","De todos, sem exceção"),
   ("Relatório escolar ou de terapias","Não","Muito útil em casos de criança"),
   ("Comprovantes de gastos com saúde","Não","Podem ser deduzidos da renda")],
 "Pensão por morte":[("Certidão de óbito","Sim",""),
   ("Certidão de casamento ou prova de união estável","Sim","Veja a lista de provas abaixo"),
   ("Documentos do falecido (RG, CPF, CNIS)","Sim",""),
   ("Comprovantes de residência em comum","Não","Contas no endereço do casal"),
   ("Fotos, conversas, declarações de terceiros","Não","Provas de convivência"),
   ("Contato de 2 testemunhas","Não","Para casos de união estável sem registro")],
 "Revisão de benefício":[("Carta de concessão do benefício","Sim",""),
   ("Memória de cálculo da RMI","Sim","Solicite no Meu INSS"),
   ("Extrato CNIS completo","Sim",""),
   ("Comprovantes de contribuições anteriores a 1994","Não","Essenciais para a revisão da vida toda")],
 "Auxílio-acidente":[("Laudos médicos com descrição da sequela","Sim",""),
   ("CAT - Comunicação de Acidente de Trabalho","Não","Se houver"),
   ("Boletim de ocorrência","Não","Se acidente de trânsito")],
}

checklists = []
for benef, extras in ESPEC.items():
    o = 1
    for d, ob, orient in BASE:
        checklists.append([benef, d, ob, o, orient]); o += 1
    for d, ob, orient in extras:
        checklists.append([benef, d, ob, o, orient]); o += 1

# ──────────────────────────────────────────────────────────────── CONFIG
cfg_h = ["chave","valor","descricao"]

config = [
["ESCRITORIO_NOME","Poliana Espolador Bilk Sociedade Individual de Advocacia","Razão social"],
["ESCRITORIO_ADVOGADA","Dra. Poliana Espolador","Nome de exibição"],
["ESCRITORIO_CIDADE","Curitiba/PR","Praça de atuação"],
["ESCRITORIO_EMAIL","contato@exemplo.com","⚠ SUBSTITUIR pelo e-mail real"],
["ESCRITORIO_WHATSAPP","+5541999000000","⚠ SUBSTITUIR pelo número real (formato E.164)"],
["HORARIO_ATENDIMENTO","Seg a Sex, 9h-18h","Exibido na LP"],
["PESO_NEGATIVA","30","Benefício requerido e negado"],
["PESO_CESSADO","30","Benefício cessado"],
["PESO_URGENCIA_ALTA","25","Declarou estar sem renda"],
["PESO_URGENCIA_MEDIA","10","Precisa resolver em breve"],
["PESO_DOCS_COMPLETOS","20","Tem todos os documentos"],
["PESO_DOCS_PARCIAIS","10","Tem parte dos documentos"],
["PESO_BENEFICIO_ALTO","15","Benefício da lista de alto valor"],
["PESO_INDICACAO_NOMINAL","10","Informou quem indicou"],
["PESO_RELATO_DETALHADO","5","Relato com mais de 200 caracteres"],
["PESO_SO_DUVIDAS","-20","Sem pressa + nunca requereu + sem documentos"],
["PESO_FORA_AREA","-15","Assunto fora da previdenciária"],
["CORTE_PRIORITARIO","70","Score mínimo da faixa Prioritário"],
["CORTE_QUALIFICADO","40","Score mínimo da faixa Qualificado"],
["CORTE_AVALIACAO","20","Score mínimo da faixa Em avaliação"],
["SLA_PRIORITARIO","24","Horas para responder um lead prioritário"],
["SLA_QUALIFICADO","72","Horas para responder um lead qualificado"],
["BENEFICIOS_ALTO_VALOR","Aposentadoria por idade urbana|Aposentadoria por tempo de contribuição (híbrida)|Aposentadoria especial|Auxílio por incapacidade temporária|BPC/LOAS - Pessoa com deficiência|Pensão por morte","Separados por |"],
["FASES","Consulta agendada|Coleta de documentos|Protocolado - aguardando análise|Aguardando perícia médica|Exigência de documentação|Em análise de cálculo|Deferido - implantação|Indeferido - avaliando recurso|Judicial - ajuizado|Encerrado","Etiquetas espelhando o Astrea"],
["DRIVE_PASTA_RAIZ","ID_DA_PASTA_RAIZ","⚠ Preencher com o ID da pasta raiz no Drive"],
["RODAPE_LGPD","Seus dados permanecem na infraestrutura do escritório, protegidos nos termos da LGPD, e não são enviados a sistemas de inteligência artificial.","Texto fixo em LP, painel e e-mails"],
["PAINEL_TOKEN","TROCAR-POR-TOKEN-LONGO-E-ALEATORIO","⚠ Token do painel (?page=painel&k=...). Gerar um valor aleatório longo antes do go-live"],
["MODO_DEMO","SIM","SIM = dados fictícios e tour guiado ativo. Mudar para NAO na homologação."],
]


# ── score calculado pelo algoritmo (nunca digitado à mão) ──────────────
_P = {r[0]: int(r[1]) for r in config if r[0].startswith(("PESO_", "CORTE_"))}
_ALTO = set(next(r[1] for r in config if r[0] == "BENEFICIOS_ALTO_VALOR").split("|"))
_i = {c: n for n, c in enumerate(leads_h)}

def _score(r):
    s = 0
    if r[_i["situacao"]] == "Requeri e foi negado":      s += _P["PESO_NEGATIVA"]
    if r[_i["situacao"]] == "Recebia e foi cessado":     s += _P["PESO_CESSADO"]
    if r[_i["urgencia"]] == "Estou sem renda":           s += _P["PESO_URGENCIA_ALTA"]
    elif r[_i["urgencia"]] == "Preciso resolver em breve": s += _P["PESO_URGENCIA_MEDIA"]
    if r[_i["tem_documentos"]] == "Tenho tudo":          s += _P["PESO_DOCS_COMPLETOS"]
    elif r[_i["tem_documentos"]] == "Tenho parte":       s += _P["PESO_DOCS_PARCIAIS"]
    if r[_i["beneficio_pretendido"]] in _ALTO:           s += _P["PESO_BENEFICIO_ALTO"]
    if r[_i["quem_indicou"]].strip():                    s += _P["PESO_INDICACAO_NOMINAL"]
    if len(r[_i["relato"]]) > 200:                       s += _P["PESO_RELATO_DETALHADO"]
    if (r[_i["urgencia"]] == "Sem pressa" and r[_i["situacao"]] == "Nunca requeri"
            and r[_i["tem_documentos"]] == "Não tenho nada"): s += _P["PESO_SO_DUVIDAS"]
    return max(0, min(100, s))

def _faixa(s):
    if s >= _P["CORTE_PRIORITARIO"]: return "Prioritário"
    if s >= _P["CORTE_QUALIFICADO"]: return "Qualificado"
    if s >= _P["CORTE_AVALIACAO"]:   return "Em avaliação"
    return "Informativo"

for _r in leads:
    _r[_i["score"]] = _score(_r)
    _r[_i["faixa"]] = _faixa(_r[_i["score"]])

if __name__ == "__main__":
    print("Gerando seeds:")
    w("01_leads.csv", leads_h, leads)
    w("02_clientes.csv", cli_h, clientes)
    w("03_casos.csv", casos_h, casos)
    w("04_documentos.csv", docs_h, documentos)
    w("05_agendamentos.csv", ag_h, agendamentos)
    w("06_templates.csv", tpl_h, templates)
    w("07_checklists.csv", chk_h, checklists)
    w("08_config.csv", cfg_h, config)
    print("OK.")
