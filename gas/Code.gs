/** ============================================================
 * Code.gs · Roteamento e camada de dados
 * Projeto: Opus AI · Dra. Poliana Espolador · Fase 1
 * A planilha ativa (container-bound) é o banco de dados.
 * ============================================================ */

const ABAS = {
  LEADS:'Leads', CLIENTES:'Clientes', CASOS:'Casos', DOCS:'Documentos',
  AGENDA:'Agendamentos', TEMPLATES:'Templates', CHECK:'Checklists', CONFIG:'Config'
};

/* ---------- Roteamento ---------- */
function doGet(e){
  const page = (e && e.parameter.page) || 'lp';
  if (page === 'painel'){
    if (!acessoPainelOk_(e)) return htmlSimples_('Acesso restrito',
      'Este painel é de uso exclusivo do escritório. Se você é a Dra. Poliana, use o seu link pessoal.');
    return render_('Painel', 'Painel · ' + cfg('ESCRITORIO_ADVOGADA'));
  }
  return render_('LP', cfg('ESCRITORIO_ADVOGADA') + ' · Advocacia Previdenciária');
}

function render_(arquivo, titulo){
  return HtmlService.createTemplateFromFile(arquivo).evaluate()
    .setTitle(titulo)
    .addMetaTag('viewport','width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function include(f){ return HtmlService.createHtmlOutputFromFile(f).getContent(); }
function htmlSimples_(t, msg){
  return HtmlService.createHtmlOutput(
    '<body style="background:#0F141E;color:#F0EDE6;font-family:serif;display:grid;place-items:center;height:100vh;text-align:center;padding:24px">'+
    '<div><h2>'+t+'</h2><p style="color:#9AA3B2">'+msg+'</p></div></body>');
}

/* Acesso ao painel: token na URL (?k=) comparado à Config.
   Camada extra à restrição de acesso da própria implantação GAS. */
function acessoPainelOk_(e){
  const t = cfg('PAINEL_TOKEN');
  return t && e && e.parameter.k === t;
}

/* ---------- Camada de dados ---------- */
function sheet_(nome){ return SpreadsheetApp.getActive().getSheetByName(nome); }

function lerAba(nome){
  const v = sheet_(nome).getDataRange().getValues();
  const h = v.shift();
  return v.filter(r => String(r[0]).trim() !== '')
          .map(r => Object.fromEntries(h.map((c,i)=>[c, r[i]])));
}
function appendObj_(nome, obj){
  const sh = sheet_(nome);
  const h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  sh.appendRow(h.map(c => obj[c] !== undefined ? obj[c] : ''));
}
function atualizarCampo(nome, colId, id, campo, valor){
  const sh = sheet_(nome);
  const v = sh.getDataRange().getValues(); const h = v[0];
  const ci = h.indexOf(colId), cf = h.indexOf(campo);
  if (ci < 0 || cf < 0) throw new Error('Coluna não encontrada: '+colId+'/'+campo);
  for (let i=1;i<v.length;i++){
    if (String(v[i][ci]) === String(id)){ sh.getRange(i+1, cf+1).setValue(valor); return true; }
  }
  return false;
}
function proximoId_(aba, prefixo){
  const n = lerAba(aba).length + 1;
  return prefixo + ('000'+n).slice(-3);
}

/* ---------- Config ---------- */
let _cfgCache = null;
function cfg(chave){
  if (!_cfgCache){
    _cfgCache = {};
    lerAba(ABAS.CONFIG).forEach(r => _cfgCache[r.chave] = String(r.valor));
  }
  return _cfgCache[chave] !== undefined ? _cfgCache[chave] : '';
}
function cfgNum(chave){ return Number(cfg(chave)) || 0; }
function cfgLista(chave){ return cfg(chave).split('|').map(s=>s.trim()).filter(Boolean); }

/* ============================================================
 * ENDPOINTS (google.script.run)
 * ============================================================ */

/** LP: recebe o intake do lead. Único endpoint público de escrita. */
function submitLead(p){
  try{
    // Minimização (doc 05): a LP não coleta CPF/RG/documentos.
    const lead = {
      id_lead: proximoId_(ABAS.LEADS,'L'),
      data_entrada: new Date(),
      nome: san_(p.nome, 120), telefone: san_(p.telefone, 25), email: san_(p.email, 120),
      cidade: san_(p.cidade, 80), origem: san_(p.origem, 40), quem_indicou: san_(p.quem_indicou, 120),
      beneficio_pretendido: san_(p.beneficio, 80), situacao: san_(p.situacao, 60),
      ja_teve_negativa: /negado|cessado/i.test(p.situacao) ? 'Sim' : 'Não',
      tem_documentos: san_(p.tem_documentos, 40), urgencia: san_(p.urgencia, 40),
      relato: san_(p.relato, 4000),
      janela_1: san_(p.janela_1, 30), janela_2: san_(p.janela_2, 30), janela_3: san_(p.janela_3, 30),
      status_lead: 'Novo'
    };
    const s = calcularScore(lead);
    lead.score = s.score; lead.faixa = s.faixa;
    appendObj_(ABAS.LEADS, lead);
    appendObj_(ABAS.AGENDA, {
      id_agendamento: proximoId_(ABAS.AGENDA,'A'), id_lead: lead.id_lead,
      tipo:'Consulta inicial', janela_1: lead.janela_1, janela_2: lead.janela_2, janela_3: lead.janela_3,
      status:'Aguardando escolha da advogada', lembrete_enviado:'Não'
    });
    criarRascunhoBoasVindas_(lead);          // rascunho no Gmail dela — nada sai sozinho
    return { ok:true };
  }catch(err){ return { ok:false, erro:String(err) }; }
}
function san_(v, max){ return String(v||'').replace(/[<>]/g,'').trim().slice(0, max); }

/** Painel: pacote completo de dados. */
function getPainelData(){
  return {
    leads: lerAba(ABAS.LEADS), clientes: lerAba(ABAS.CLIENTES), casos: lerAba(ABAS.CASOS),
    docs: lerAba(ABAS.DOCS), agenda: lerAba(ABAS.AGENDA), templates: lerAba(ABAS.TEMPLATES),
    checklists: lerAba(ABAS.CHECK),
    config: {
      advogada: cfg('ESCRITORIO_ADVOGADA'), fases: cfgLista('FASES'),
      rodapeLgpd: cfg('RODAPE_LGPD'), modoDemo: cfg('MODO_DEMO') === 'SIM',
      sla: { prior: cfgNum('SLA_PRIORITARIO'), qual: cfgNum('SLA_QUALIFICADO') }
    }
  };
}

/** Painel: ela escolhe 1 das 3 janelas (D-003). */
function escolherJanela(idLead, janela){
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'janela_escolhida', janela);
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'status_lead', 'Agendado');
  atualizarCampo(ABAS.AGENDA,'id_lead', idLead, 'data_confirmada', janela);
  atualizarCampo(ABAS.AGENDA,'id_lead', idLead, 'status', 'Confirmado');
  criarEventoCalendar_(idLead, janela);
  return { ok:true };
}

/** Cria o evento no Google Calendar. Nunca lança erro para fora:
 *  se o Calendar falhar por qualquer motivo, a consulta já está
 *  gravada na planilha e o fluxo da advogada não pode travar. */
function criarEventoCalendar_(idLead, janela){
  try{
    const partes = String(janela).split(' ');
    if (partes.length < 2) return;
    const inicio = new Date(partes[0] + 'T' + partes[1] + ':00');
    if (isNaN(inicio.getTime())) return;

    const duracaoMin = cfgNum('CONSULTA_DURACAO_MIN') || 30;
    const fim = new Date(inicio.getTime() + duracaoMin * 60000);

    const lead = lerAba(ABAS.LEADS).find(l => l.id_lead === idLead) || {};
    const calId = cfg('CALENDAR_ID') || 'primary';
    const cal = (calId === 'primary')
      ? CalendarApp.getDefaultCalendar()
      : CalendarApp.getCalendarById(calId);
    if (!cal) return;

    cal.createEvent(
      'Consulta · ' + (lead.nome || 'Lead'),
      inicio, fim,
      {
        description: 'Benefício: ' + (lead.beneficio_pretendido || '') +
          '\nTelefone: ' + (lead.telefone || '') +
          '\nOrigem: painel Opus AI · id_lead ' + idLead,
        location: cfg('ESCRITORIO_CIDADE') || ''
      }
    );
  }catch(e){
    console.error('Falha ao criar evento no Calendar (idLead=' + idLead + '): ' + e);
  }
}

function mudarFase(idCaso, fase){
  atualizarCampo(ABAS.CASOS,'id_caso', idCaso, 'fase', fase);
  return { ok:true };
}
function mudarStatusDoc(idDoc, status){
  atualizarCampo(ABAS.DOCS,'id_doc', idDoc, 'status', status);
  if (status === 'Recebido') atualizarCampo(ABAS.DOCS,'id_doc', idDoc, 'data_recebimento', new Date());
  return { ok:true };
}
function mudarStatusLead(idLead, status){
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'status_lead', status);
  return { ok:true };
}
function salvarObservacaoLead(idLead, texto){
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'observacoes', san_(texto, 4000));
  return { ok:true };
}

/** Consulta guiada concluída: converte lead em cliente + caso + docs + pasta. */
function converterLead(idLead, dadosCliente){
  const lead = lerAba(ABAS.LEADS).find(l => l.id_lead === idLead);
  if (!lead) throw new Error('Lead não encontrado');
  const idCliente = proximoId_(ABAS.CLIENTES,'C');
  const pasta = criarPastaCliente(dadosCliente.nome_completo || lead.nome, idCliente);
  appendObj_(ABAS.CLIENTES, Object.assign({
    id_cliente: idCliente, id_lead_origem: idLead,
    nome_completo: lead.nome, telefone: lead.telefone, email: lead.email,
    link_pasta_drive: pasta.url, data_contratacao: new Date(), status:'Ativo'
  }, dadosCliente || {}));
  const idCaso = proximoId_(ABAS.CASOS,'CS');
  appendObj_(ABAS.CASOS, {
    id_caso: idCaso, id_cliente: idCliente, tipo_beneficio: lead.beneficio_pretendido,
    via:'Administrativa', fase:'Coleta de documentos', data_entrada: new Date()
  });
  gerarDocsDoChecklist(idCaso, lead.beneficio_pretendido);
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'status_lead','Convertido');
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'id_cliente', idCliente);
  return { ok:true, id_cliente:idCliente, id_caso:idCaso, pasta:pasta.url };
}
