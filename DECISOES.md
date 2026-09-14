# Log de decisões

Registro do **porquê**. Toda decisão contestável fica aqui, datada, com a alternativa descartada.

---

### D-001 · Google Drive em vez de OneDrive
**Data:** 21/07/2026 · **Status:** decidido
O contrato prevê Google Workspace; ela usa OneDrive. Três razões decidem a favor do Drive:
(a) o GAS acessa o Drive nativamente e o OneDrive não; (b) ela já usa Google Forms;
(c) **o Astrea integra com Google Drive via "Ligações Externas"** — o link da pasta do cliente é colado
uma vez na ficha do Astrea e os documentos aparecem lá dentro sem sync, sem API, sem custo.
Migração é gradual: o OneDrive segue existindo para o histórico.

### D-002 · WhatsApp assistido (`wa.me`), não API oficial
**Data:** 21/07/2026 · **Status:** decidido
Envio automático exigiria API oficial da Meta via provedor pago, com custo por mensagem e risco de bloqueio.
Descartado por dois motivos: custo mensal recorrente (violaria o compromisso de R$ 0) e, principalmente,
porque o requisito dela é o oposto de automático — **toda mensagem revisada antes do envio**.
O painel gera o texto e abre o WhatsApp dela já preenchido; ela lê e envia.
Bônus competitivo: o WhatsApp do Astrea é pago (pacotes "Turbo") e criticado pelos próprios usuários por
não enviar de forma confiável. Entregamos de graça a lacuna que o líder de mercado cobra caro.

### D-003 · Agendamento manual na v1 (sem Google Calendar)
**Data:** 21/07/2026 · **Status:** decidido, revisar na v2
Ler a disponibilidade do Google Calendar só funciona se a agenda estiver religiosamente bloqueada.
Se não estiver, o sistema oferece horários que na vida real estão ocupados e o lead precisa reagendar —
pior que não ter agendamento nenhum. **v1:** o lead sugere 3 janelas; ela escolhe 1 com um clique.
**v2:** integração com Calendar, quando/se a disciplina de agenda existir.

### D-004 · Scoring determinístico por pesos, sem IA
**Data:** 21/07/2026 · **Status:** decidido
Um modelo de linguagem classificaria leads melhor em teoria. Descartado: introduziria custo por chamada,
dependência externa e — decisivo — quebraria a garantia de que nenhum dado de cliente é processado por IA.
Pesos ficam na aba Config, **editáveis por ela**. Ela pode calibrar o que considera prioritário.

### D-005 · Identidade visual Opus AI, com re-skin de 6 linhas
**Data:** 21/07/2026 · **Status:** provisório
O site dela está fora do ar; não temos a identidade visual. Usamos a paleta Opus AI, mas toda cor e
fonte vive num único bloco `:root` de variáveis CSS. Quando ela fornecer a marca dela, a troca é
imediata e não toca em nenhum componente.

### D-006 · Onboarding por tour guiado, não por manual
**Data:** 21/07/2026 · **Status:** decidido
A primeira versão é funcional com dados fictícios **e se explica sozinha**: overlay com spotlight,
balões numerados apontando cada elemento, percorrendo o ciclo completo de um caso.
Alternativa descartada: MVP puro explicado ao vivo — depende da presença do João e não é revisitável.
O tour permanece acessível por um botão "?" fixo. Vira ativo reutilizável para os próximos clientes Opus AI.

### D-007 · Fases espelham as etiquetas do Astrea
**Data:** 21/07/2026 · **Status:** decidido
Advogados previdenciários usam o Astrea como Kanban manual com etiquetas ("Aguardando perícia",
"Exigência de documentação") porque o robô de captura de publicações não alcança o processo
administrativo do INSS. Adotamos **o mesmo vocabulário**. Ela abre o painel e reconhece a linguagem
que já usa — zero curva de aprendizado, zero conflito de plataforma.

### D-008 · Aba Checklists separada da Config
**Data:** 21/07/2026 · **Status:** decidido
O modelo previa 7 abas. Os checklists de documentos por benefício (os PDFs que ela já mantém) têm
cardinalidade própria — dezenas de linhas por benefício — e seriam ilegíveis dentro da Config.
Viram a 8ª aba. Ela edita a lista de documentos sem tocar em parâmetro de sistema.

### D-009 · Verde-azulado no lugar do verde no semáforo de estado
**Data:** 14/09/2026 · **Status:** decidido
Ela é sensível a cores e pediu que o estado do caso fosse legível de relance.
O semáforo óbvio — verde, amarelo, vermelho — foi medido e reprovado: verde e
vermelho ficam a ΔE 6,0 sob deuteranopia, ou seja, para quem tem daltonismo
vermelho-verde (~8% dos homens) "resolvido" e "urgente" são praticamente a
mesma cor. Trocar o verde por verde-azulado leva esse par a ΔE 12,5 e faz a
paleta passar nos cinco testes. Nenhuma cor informa sozinha de qualquer forma:
todo estado vem com ícone e palavra. Não é preferência estética — é a diferença
entre um painel que avisa e um painel que parece avisar.

### D-010 · Prioridade e estado em escalas que não se tocam
**Data:** 14/09/2026 · **Status:** decidido
São duas perguntas diferentes: "quem é mais importante" (faixa do lead) e "o
que está travado" (estado do caso). Usar a mesma família de cores nas duas faria
uma etiqueta de prioridade ser lida como aviso de prazo. Prioridade virou uma
rampa ordinal do próprio vinho da marca, clareando em quatro degraus; estado é o
semáforo. Nenhum tom aparece nas duas escalas.

### D-011 · Quadradinho por caso enquanto o volume é pequeno
**Data:** 14/09/2026 · **Status:** decidido
O gráfico de casos por fase começou como barra proporcional. Com cinco fases de
um caso cada — a carteira real dela hoje — as cinco barras encostavam no fim da
régua e o gráfico dizia "tudo cheio" para cinco casos. Até doze casos numa fase,
um quadrado por caso: é exato e dá para conferir contando. Acima disso, a barra
passa a ser mais legível e entra no lugar.

### D-012 · Netlify como redirecionador, nunca como hospedeiro
**Data:** 14/09/2026 · **Status:** decidido
A ideia era subir a plataforma no Netlify para ter um link apresentável na
mensagem do WhatsApp. Não é possível: a LP é montada no servidor pelo Apps
Script e o formulário envia por `google.script.run`, que só existe dentro da
página servida pelo próprio Apps Script — fora dali o botão Enviar não faz nada.
Junto iriam SpreadsheetApp, GmailApp, CalendarApp e DriveApp. Reescrever para
lá custaria banco hospedado, servidor de e-mail e assinatura mensal, contra o
compromisso de custo zero.
O Netlify entra em outro papel: um site de um arquivo só, com um `_redirects`
que aponta o subdomínio dela para a URL da implantação. Link bonito, código
privado, R$ 0. GitHub Pages foi descartado pelo mesmo motivo técnico e por um
segundo: publicar a partir do repositório exporia o código-fonte do produto.

### D-013 · A titularidade exige transferir a planilha, não só compartilhar
**Data:** 14/09/2026 · **Status:** decidido, bloqueante
Compartilhar a agenda e a pasta CLIENTES não transfere a plataforma. A planilha
— que é o banco de dados inteiro — e o Apps Script vinculado a ela continuam na
conta pessoal da Opus AI. Enquanto for assim: os e-mails ao cliente saem da
conta da Opus AI (`ESCRITORIO_EMAIL` muda o texto, não o remetente), a cota de
100 e-mails/dia é da Opus AI, e os arquivos criados na pasta dela são de
propriedade da Opus AI. Isso contraria o princípio nº 4 do projeto e não é algo
para descobrir depois de assinar o contrato de administração.
A transferência de propriedade da planilha resolve os quatro pontos de uma vez,
porque o script passa a executar como ela. Passo a passo em `docs/06`.
