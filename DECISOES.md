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
