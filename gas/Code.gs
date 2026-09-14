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
  const p = (e && e.parameter) || {};
  const page = p.page || 'lp';
  if (page === 'painel'){
    if (!acessoPainelOk_(e)) return htmlSimples_('Acesso restrito',
      'Este painel é de uso exclusivo do escritório. Se você é a Dra. Poliana, use o seu link pessoal.');
    return render_('Painel', 'Painel · ' + cfg('ESCRITORIO_ADVOGADA'));
  }
  /* Confirmação de horário direto pelo e-mail que ela recebe. */
  if (page === 'confirmar'){
    if (!acessoPainelOk_(e)) return htmlSimples_('Link inválido',
      'Este link de confirmação não é válido ou expirou.');
    try{
      const r = confirmarPeloEmail_(p.lead, Number(p.j || 1));
      return htmlSimples_('Horário confirmado',
        'A consulta com ' + r.nome + ' ficou marcada para ' + r.janela +
        '. O evento já está no seu Google Agenda e o convite foi enviado ao cliente.');
    }catch(err){
      return htmlSimples_('Não foi possível confirmar', String(err));
    }
  }
  /* LP pública. ?tipo=inss ou ?tipo=servidor pula a pergunta de vínculo. */
  return render_('LP', cfg('ESCRITORIO_ADVOGADA') + ' · Advocacia Previdenciária',
                 { tipoPreset: p.tipo || '' });
}

function render_(arquivo, titulo, extras){
  const t = HtmlService.createTemplateFromFile(arquivo);
  t.tipoPreset = (extras && extras.tipoPreset) || '';
  return t.evaluate()
    .setTitle(titulo)
    .addMetaTag('viewport','width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(f){ return HtmlService.createHtmlOutputFromFile(f).getContent(); }

function htmlSimples_(t, msg){
  return HtmlService.createHtmlOutput(
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<body style="background:#F8FAFC;color:#1E293B;font-family:system-ui,sans-serif;' +
    'display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px;margin:0">' +
    '<div style="max-width:420px"><h2 style="color:#52091c;margin:0 0 12px">'+t+'</h2>' +
    '<p style="color:#64748B;line-height:1.6;margin:0">'+msg+'</p></div></body>');
}

/* Acesso ao painel: token na URL (?k=) comparado à Config.
   Camada extra à restrição de acesso da própria implantação GAS. */

function acessoPainelOk_(e){
  const t = cfg('PAINEL_TOKEN');
  return t && e && e.parameter.k === t;
}

/** URL base do app publicado — usada nos links dos e-mails. */

function urlApp_(){
  try { return ScriptApp.getService().getUrl(); } catch(e){ return ''; }
}

/** E-mail do escritório. Cai para a conta dona do script se não houver Config. */

function emailEscritorio_(){
  return cfg('ESCRITORIO_EMAIL') || Session.getEffectiveUser().getEmail();
}

/** Cópia oculta de acompanhamento (Config: EMAIL_COPIA). Serve ao período de
 *  testes: ela usa a plataforma normalmente e o implantador vê o que sai. */

function opcoesEnvio_(nome){
  const o = { name: nome || cfg('ESCRITORIO_ADVOGADA') || 'Escritório' };
  const copia = cfg('EMAIL_COPIA');
  if (copia) o.bcc = copia;
  return o;
}

/** "2026-08-19 10:00" -> "quarta-feira, 19 de agosto às 10h" */

function fmtJanela_(j){
  const m = String(j||'').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return String(j||'');
  const dias  = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto',
                 'setembro','outubro','novembro','dezembro'];
  const d = new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
  return dias[d.getDay()] + ', ' + Number(m[3]) + ' de ' + meses[Number(m[2])-1] +
         ' às ' + m[4] + 'h' + (m[5] === '00' ? '' : m[5]);
}

/** Versão curta para botões: "ter, 19 ago · 10:00" */

function fmtJanelaCurta_(j){
  const m = String(j||'').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return String(j||'');
  const dias  = ['dom','seg','ter','qua','qui','sex','sáb'];
  const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const d = new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
  return dias[d.getDay()] + ', ' + Number(m[3]) + ' ' + meses[Number(m[2])-1] +
         ' · ' + m[4] + ':' + m[5];
}

/* ---------- Peças reaproveitadas nos e-mails ----------
   Regra de ouro do HTML em e-mail: tabelas e estilo inline.
   Larguras fixas evitam a "palavra órfã" na quebra de linha. */

const EMAIL_ABRE = '<div style="margin:0;padding:0;background:#F8FAFC">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC">' +
  '<tr><td align="center" style="padding:26px 12px">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
  'style="max-width:560px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px">' +
  '<tr><td style="padding:30px 28px;font-family:Helvetica,Arial,sans-serif;color:#1E293B;' +
  'font-size:15px;line-height:1.65">';

const EMAIL_FECHA = '</td></tr></table></td></tr></table></div>';

/** Bloco de dados em tabela — usado nos dois e-mails. */

function tabelaDados_(pares){
  let t = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
          'style="border-collapse:collapse;font-size:14.5px;margin:4px 0 0">';
  pares.forEach(([rot, val]) => {
    if (!val) return;
    t += '<tr>' +
      '<td style="padding:9px 12px 9px 0;color:#64748B;width:132px;vertical-align:top;' +
      'border-bottom:1px solid #F1F5F9;white-space:nowrap">' + rot + '</td>' +
      '<td style="padding:9px 0;color:#1E293B;font-weight:600;vertical-align:top;' +
      'border-bottom:1px solid #F1F5F9">' + val + '</td></tr>';
  });
  return t + '</table>';
}

/** Aviso de proteção de dados — fecha os dois e-mails. */

function blocoLgpd_(){
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="margin:26px 0 0;border-top:1px solid #E2E8F0"><tr><td style="padding:16px 0 0">' +
    '<p style="margin:0 0 6px;font-size:12.5px;color:#475569;font-weight:600">' +
    '&#128274; Seus dados ficam protegidos na infraestrutura do escritório.</p>' +
    '<p style="margin:0;font-size:11.5px;color:#94A3B8;line-height:1.7">' +
    'Adotamos as medidas de segurança do Art. 46 da LGPD (Lei nº 13.709/2018). ' +
    'Em respeito aos princípios da finalidade e da segurança (Art. 6º, I e VII), ' +
    'suas informações não são enviadas a sistemas externos de inteligência artificial.</p>' +
    '</td></tr></table>';
}

/** Termômetro de triagem: barra de 4 faixas com a atual destacada. */

function termometro_(faixa, score){
  const faixas = [
    { nome:'Informativo',  cor:'#475569', bg:'#F1F5F9' },
    { nome:'Em avaliação', cor:'#1D4ED8', bg:'#EFF6FF' },
    { nome:'Qualificado',  cor:'#B45309', bg:'#FFFBEB' },
    { nome:'Prioritário',  cor:'#B91C1C', bg:'#FEF2F2' }
  ];
  const ativa = Math.max(0, faixas.map(f=>f.nome).indexOf(faixa));
  const atual = faixas[ativa];
  let barra = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
              'style="border-collapse:separate;border-spacing:3px 0"><tr>';
  faixas.forEach((f, i) => {
    barra += '<td style="height:8px;border-radius:99px;background:' +
             (i <= ativa ? atual.cor : '#E2E8F0') + '"></td>';
  });
  barra += '</tr><tr>';
  faixas.forEach((f, i) => {
    barra += '<td style="padding:7px 0 0;text-align:center;font-size:10.5px;' +
             'font-family:Helvetica,Arial,sans-serif;color:' +
             (i === ativa ? atual.cor : '#CBD5E1') + ';font-weight:' +
             (i === ativa ? '700' : '400') + '">' + f.nome + '</td>';
  });
  barra += '</tr></table>';
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="margin:22px 0 0;background:' + atual.bg + ';border-radius:12px"><tr>' +
    '<td style="padding:16px 18px">' +
    '<p style="margin:0 0 12px;font-size:13px;color:#64748B">Triagem automática: ' +
    '<strong style="color:' + atual.cor + '">' + faixa + '</strong> · ' + score + ' pontos</p>' +
    barra + '</td></tr></table>';
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
    const servidor = /Servidor/i.test(p.vinculo || '');
    /* A aba Leads não tem colunas próprias para a trilha do servidor público.
       Em vez de exigir mudança de schema, a informação é dobrada em campos
       que já existem — e continua visível no painel. */
    let beneficio = san_(p.beneficio, 80);
    let relato    = san_(p.relato, 4000);
    if (servidor){
      beneficio = ('Servidor Público · ' + (p.objetivo_sp || 'Consultoria')).slice(0, 80);
      const cabec = 'Servidor ' + (p.esfera || '') +
        (p.estado_municipio ? ' (' + p.estado_municipio + ')' : '') +
        (p.relato_sp ? ' — ' + p.relato_sp : '');
      relato = san_(cabec + (relato ? '\n\n' + relato : ''), 4000);
    }
    const lead = {
      id_lead: proximoId_(ABAS.LEADS,'L'),
      data_entrada: new Date(),
      nome: san_(p.nome, 120), telefone: san_(p.telefone, 25), email: san_(p.email, 120),
      cidade: san_(p.cidade, 80), origem: san_(p.origem, 40), quem_indicou: san_(p.quem_indicou, 120),
      beneficio_pretendido: beneficio, situacao: san_(p.situacao, 60),
      ja_teve_negativa: /negado|cessado/i.test(p.situacao || '') ? 'Sim' : 'Não',
      tem_documentos: san_(p.tem_documentos, 40), urgencia: san_(p.urgencia, 40),
      relato: relato,
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
    notificarAdvogada_(lead, s);        // e-mail para ela, com os 3 horários clicáveis
    avisarLeadRecebido_(lead);          // acuse de recebimento para o cliente
    return { ok:true };
  }catch(err){ return { ok:false, erro:String(err) }; }
}

function san_(v, max){ return String(v||'').replace(/[<>]/g,'').trim().slice(0, max); }

/* ---------- E-mails automáticos ----------
   Regra da casa: mensagens de RELACIONAMENTO com o cliente continuam
   sendo rascunho (Mensagens.gs). Só saem sozinhos dois e-mails puramente
   transacionais: o aviso interno para ela e a confirmação de horário. */

/** Avisa a advogada que chegou um contato novo.
 *  Dados em tabela, horários como botões, triagem só no rodapé com termômetro. */

function notificarAdvogada_(lead, s){
  try{
    const base = urlApp_(), tok = cfg('PAINEL_TOKEN');
    const janelas = [lead.janela_1, lead.janela_2, lead.janela_3].filter(Boolean);
    const primeiro = String(lead.nome || '').split(' ')[0];
    let botoes = '';
    janelas.forEach((j, i) => {
      botoes += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
        'style="margin:0 0 9px"><tr><td align="center" style="border-radius:10px;background:#52091c">' +
        '<a href="' + base + '?page=confirmar&lead=' + lead.id_lead + '&j=' + (i+1) + '&k=' + tok +
        '" style="display:block;padding:14px 18px;color:#FFFFFF;text-decoration:none;' +
        'font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;border-radius:10px">' +
        fmtJanelaCurta_(j) + '</a></td></tr></table>';
    });
    const html = EMAIL_ABRE +
      '<p style="margin:0 0 4px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
      'letter-spacing:.08em;font-weight:700">Novo contato pela página de indicação</p>' +
      '<h1 style="margin:0 0 20px;font-size:24px;color:#52091c;font-weight:700;' +
      'letter-spacing:-.01em;line-height:1.25">' + lead.nome + '</h1>' +
      tabelaDados_([
        ['Assunto',      lead.beneficio_pretendido],
        ['Situação',     lead.situacao],
        ['Cidade',       lead.cidade],
        ['Telefone',     lead.telefone],
        ['E-mail',       lead.email],
        ['Documentos',   lead.tem_documentos],
        ['Urgência',     lead.urgencia],
        ['Indicado por', lead.quem_indicou]
      ]) +
      (lead.relato
        ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0">' +
          '<tr><td style="padding:15px 17px;background:#F8FAFC;border-left:3px solid #52091c;' +
          'border-radius:0 10px 10px 0;font-size:14.5px;color:#475569;line-height:1.7;font-style:italic">' +
          String(lead.relato).replace(/\n/g, '<br>') + '</td></tr></table>'
        : '') +
      (janelas.length
        ? '<p style="margin:26px 0 12px;font-size:14.5px;color:#475569;line-height:1.6">' +
          'Horários sugeridos por ' + primeiro + '. Um toque confirma, cria o evento na sua ' +
          'agenda e envia a confirmação por e-mail.</p>' + botoes
        : '') +
      '<p style="margin:22px 0 0;font-size:14px">' +
      '<a href="' + base + '?page=painel&k=' + tok +
      '" style="color:#52091c;font-weight:600;text-decoration:none">Abrir o painel &rarr;</a></p>' +
      termometro_(s.faixa, s.score) +
      '<p style="margin:12px 0 0;font-size:11.5px;color:#94A3B8;line-height:1.7">' +
      'A pontuação vem das respostas do formulário (' + s.decomposicao + ') e serve apenas ' +
      'para ordenar a fila de atendimento. Ela não avalia mérito jurídico.</p>' +
      EMAIL_FECHA;
    GmailApp.sendEmail(emailEscritorio_(),
      'Novo contato · ' + lead.nome,
      'Novo contato pela página de indicação: ' + lead.nome + '. Abra o painel para ver os detalhes.',
      Object.assign({ htmlBody: html }, opcoesEnvio_('Painel · ' + cfg('ESCRITORIO_ADVOGADA'))));
  }catch(e){ console.error('notificarAdvogada_: ' + e); }
}

/** Acuse de recebimento para quem preencheu o formulário — com os dados informados. */

function avisarLeadRecebido_(lead){
  try{
    if (!lead.email) return;
    const adv = cfg('ESCRITORIO_ADVOGADA') || 'Dra. Poliana Espolador';
    const primeiro = String(lead.nome || '').split(' ')[0];
    const janelas = [lead.janela_1, lead.janela_2, lead.janela_3].filter(Boolean);
    const html = EMAIL_ABRE +
      '<h1 style="margin:0 0 18px;font-size:23px;color:#52091c;font-weight:700;' +
      'letter-spacing:-.01em;line-height:1.3">Recebemos o seu contato</h1>' +
      '<p style="margin:0 0 14px">Olá, ' + primeiro + '.</p>' +
      '<p style="margin:0 0 14px">Suas informações chegaram ao escritório. A ' + adv +
      ' vai analisar o seu caso e confirmar um dos horários que você sugeriu — ' +
      'você receberá um novo e-mail assim que isso acontecer.</p>' +
      '<p style="margin:24px 0 10px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
      'letter-spacing:.08em;font-weight:700">O que você nos informou</p>' +
      tabelaDados_([
        ['Nome',       lead.nome],
        ['Assunto',    lead.beneficio_pretendido],
        ['Situação',   lead.situacao],
        ['Cidade',     lead.cidade],
        ['Telefone',   lead.telefone],
        ['E-mail',     lead.email],
        ['Documentos', lead.tem_documentos]
      ]) +
      (janelas.length
        ? '<p style="margin:24px 0 10px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
          'letter-spacing:.08em;font-weight:700">Horários que você sugeriu</p>' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
          'style="font-size:14.5px">' +
          janelas.map(j => '<tr><td style="padding:7px 0;color:#1E293B">&bull;&nbsp;&nbsp;' +
            fmtJanela_(j) + '</td></tr>').join('') + '</table>'
        : '') +
      '<p style="margin:22px 0 0;color:#64748B;font-size:14px">' +
      'Se algum dado acima estiver errado, é só responder a este e-mail. ' +
      'E se tiver documentos guardados, pode ir separando — sem pressa e sem organizar nada.</p>' +
      blocoLgpd_() + EMAIL_FECHA;
    GmailApp.sendEmail(lead.email,
      'Recebemos o seu contato · ' + adv,
      'Recebemos o seu contato. Em breve confirmaremos o horário do atendimento.',
      Object.assign({ htmlBody: html }, opcoesEnvio_(adv)));
  }catch(e){ console.error('avisarLeadRecebido_: ' + e); }
}

/** Confirmação formal do atendimento para o cliente.
 *  Enviado pelo Gmail, e NÃO pelo convite do Calendar: o Google não envia
 *  convite quando o convidado é a própria conta dona do calendário, e um
 *  convite recusado ou filtrado deixaria o cliente sem confirmação nenhuma. */

function confirmarConsultaAoLead_(lead, janela){
  try{
    if (!lead || !lead.email) return { ok:false, motivo:'lead sem e-mail' };
    const adv = cfg('ESCRITORIO_ADVOGADA') || 'Dra. Poliana Espolador';
    const primeiro = String(lead.nome || '').split(' ')[0];
    const dur = cfgNum('CONSULTA_DURACAO_MIN') || 30;
    const html = EMAIL_ABRE +
      '<p style="margin:0 0 4px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
      'letter-spacing:.08em;font-weight:700">Atendimento confirmado</p>' +
      '<h1 style="margin:0 0 20px;font-size:23px;color:#52091c;font-weight:700;' +
      'letter-spacing:-.01em;line-height:1.3">Sua consulta está marcada</h1>' +
      '<p style="margin:0 0 18px">Olá, ' + primeiro + '. A ' + adv +
      ' confirmou o seu atendimento no horário abaixo.</p>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
      'style="margin:0 0 20px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px">' +
      '<tr><td style="padding:20px 22px;text-align:center">' +
      '<p style="margin:0 0 6px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
      'letter-spacing:.08em;font-weight:700">Data e horário</p>' +
      '<p style="margin:0;font-size:18px;color:#52091c;font-weight:700;line-height:1.4">' +
      fmtJanela_(janela) + '</p>' +
      '<p style="margin:8px 0 0;font-size:13px;color:#64748B">Duração prevista: ' + dur + ' minutos</p>' +
      '</td></tr></table>' +
      tabelaDados_([
        ['Assunto',    lead.beneficio_pretendido],
        ['Atendimento com', adv],
        ['Contato',    cfg('ESCRITORIO_WHATSAPP') || cfg('ESCRITORIO_EMAIL')]
      ]) +
      '<p style="margin:22px 0 0;color:#64748B;font-size:14px">' +
      'Se precisar remarcar, responda a este e-mail e resolvemos. ' +
      'Guarde esta mensagem: ela é o registro do seu agendamento.</p>' +
      blocoLgpd_() + EMAIL_FECHA;
    GmailApp.sendEmail(lead.email,
      'Consulta confirmada · ' + fmtJanelaCurta_(janela),
      'Sua consulta com ' + adv + ' está confirmada para ' + fmtJanela_(janela) + '.',
      Object.assign({ htmlBody: html }, opcoesEnvio_(adv)));
    return { ok:true };
  }catch(e){
    console.error('confirmarConsultaAoLead_: ' + e);
    return { ok:false, motivo:String(e) };
  }
}

/* ============================================================
 * DISPONIBILIDADE REAL — lida do Google Calendar
 * A LP só oferece horários que estão de fato livres na agenda.
 * Config: AGENDA_HORARIOS (09:00|10:00|...), AGENDA_DIAS,
 *         AGENDA_ANTECEDENCIA_H, CONSULTA_DURACAO_MIN, CALENDAR_ID
 * ============================================================ */

const DIAS_ABREV  = ['dom','seg','ter','qua','qui','sex','sáb'];

const MESES_ABREV = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

/** Calendário de trabalho (Config CALENDAR_ID ou o principal da conta). */

function calendarioDoEscritorio_(){
  const id = cfg('CALENDAR_ID');
  return (!id || id === 'primary') ? CalendarApp.getDefaultCalendar()
                                   : CalendarApp.getCalendarById(id);
}

/** Endpoint público chamado pela LP. Nunca lança erro: se o Calendar
 *  falhar, devolve a grade cheia para o formulário não travar — e sinaliza
 *  a origem, para que a falha apareça no diagnóstico em vez de sumir. */

function horariosDisponiveis(){
  const horarios = cfgLista('AGENDA_HORARIOS').length
    ? cfgLista('AGENDA_HORARIOS')
    : ['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
  const nDias   = cfgNum('AGENDA_DIAS') || 14;
  const durMin  = cfgNum('CONSULTA_DURACAO_MIN') || 30;
  const antecH  = cfgNum('AGENDA_ANTECEDENCIA_H') || 12;
  /* Janela de busca: de amanhã até nDias úteis à frente. */
  const agora  = new Date();
  const limite = new Date(agora.getTime() + antecH * 3600000);
  const inicioBusca = new Date(agora); inicioBusca.setHours(0,0,0,0);
  const fimBusca = new Date(inicioBusca);
  fimBusca.setDate(fimBusca.getDate() + Math.ceil(nDias * 1.6) + 2);
  let ocupados = [];
  let fonte = 'calendar';
  try{
    const cal = calendarioDoEscritorio_();
    if (!cal) throw new Error('calendário não encontrado');
    /* Uma única chamada cobre toda a janela — barato e rápido. */
    ocupados = cal.getEvents(inicioBusca, fimBusca)
      .filter(ev => !ev.isAllDayEvent())          // eventos de dia inteiro não bloqueiam consulta
      .map(ev => ({ ini: ev.getStartTime().getTime(), fim: ev.getEndTime().getTime() }));
  }catch(e){
    console.error('horariosDisponiveis (Calendar): ' + e);
    fonte = 'indisponivel';                        // grade cheia, sem filtro
  }
  const livre = (ini, fim) => !ocupados.some(o => ini < o.fim && fim > o.ini);
  const dias = [];
  const d = new Date(inicioBusca);
  let contador = 0;
  while (dias.length < nDias && contador < 40){
    contador++;
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;   // só dias úteis
    const horas = horarios.filter(h => {
      const p = String(h).split(':');
      const ini = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                           Number(p[0]), Number(p[1] || 0), 0);
      if (ini <= limite) return false;                    // respeita a antecedência mínima
      const fim = new Date(ini.getTime() + durMin * 60000);
      return livre(ini.getTime(), fim.getTime());
    });
    if (!horas.length) continue;                          // dia cheio não aparece
    const mm = ('0' + (d.getMonth()+1)).slice(-2), dd = ('0' + d.getDate()).slice(-2);
    dias.push({
      iso: d.getFullYear() + '-' + mm + '-' + dd,
      ds: DIAS_ABREV[d.getDay()], dn: d.getDate(), dm: MESES_ABREV[d.getMonth()],
      horas: horas
    });
  }
  return { ok:true, fonte: fonte, dias: dias };
}

/** Confirma para a advogada que o evento entrou na agenda dela.
 *  Serve de recibo: se algo falhar no Calendar, ela vê aqui. */

function avisarAdvogadaAgendamento_(lead, janela, cal){
  try{
    const dur = cfgNum('CONSULTA_DURACAO_MIN') || 30;
    const base = urlApp_(), tok = cfg('PAINEL_TOKEN');
    const okCal = cal && cal.ok;
    const html = EMAIL_ABRE +
      '<p style="margin:0 0 4px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
      'letter-spacing:.08em;font-weight:700">Consulta agendada</p>' +
      '<h1 style="margin:0 0 20px;font-size:23px;color:#52091c;font-weight:700;' +
      'letter-spacing:-.01em;line-height:1.3">' + lead.nome + '</h1>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
      'style="margin:0 0 20px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px">' +
      '<tr><td style="padding:20px 22px;text-align:center">' +
      '<p style="margin:0 0 6px;font-size:12px;color:#94A3B8;text-transform:uppercase;' +
      'letter-spacing:.08em;font-weight:700">Data e horário</p>' +
      '<p style="margin:0;font-size:18px;color:#52091c;font-weight:700;line-height:1.4">' +
      fmtJanela_(janela) + '</p>' +
      '<p style="margin:8px 0 0;font-size:13px;color:#64748B">' + dur + ' minutos</p>' +
      '</td></tr></table>' +
      tabelaDados_([
        ['Assunto',  lead.beneficio_pretendido],
        ['Telefone', lead.telefone],
        ['E-mail',   lead.email],
        ['Cidade',   lead.cidade]
      ]) +
      (okCal
        ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
          'style="margin:20px 0 0;background:#ECFDF5;border-radius:10px"><tr>' +
          '<td style="padding:14px 16px;font-size:14px;color:#047857;line-height:1.6">' +
          '&#10003; Evento criado em <strong>' + (cal.calendario || 'sua agenda') + '</strong>, ' +
          'com lembrete no aplicativo do Google Agenda.<br>' +
          '&#10003; Confirmação enviada por e-mail ao cliente.</td></tr></table>'
        : '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
          'style="margin:20px 0 0;background:#FEF2F2;border-radius:10px"><tr>' +
          '<td style="padding:14px 16px;font-size:14px;color:#B91C1C;line-height:1.6">' +
          '<strong>O evento não entrou na agenda.</strong> Anote manualmente e avise o suporte.<br>' +
          '<span style="font-size:12.5px;color:#94A3B8">Detalhe técnico: ' +
          ((cal && cal.motivo) || 'desconhecido') + '</span></td></tr></table>') +
      '<p style="margin:22px 0 0;font-size:14px">' +
      '<a href="' + base + '?page=painel&k=' + tok +
      '" style="color:#52091c;font-weight:600;text-decoration:none">Abrir o painel &rarr;</a></p>' +
      EMAIL_FECHA;
    GmailApp.sendEmail(emailEscritorio_(),
      'Consulta agendada · ' + lead.nome + ' · ' + fmtJanelaCurta_(janela),
      'Consulta com ' + lead.nome + ' agendada para ' + fmtJanela_(janela) + '.',
      Object.assign({ htmlBody: html }, opcoesEnvio_('Painel · ' + cfg('ESCRITORIO_ADVOGADA'))));
    return { ok:true };
  }catch(e){
    console.error('avisarAdvogadaAgendamento_: ' + e);
    return { ok:false, motivo:String(e) };
  }
}

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
  const lead = lerAba(ABAS.LEADS).find(l => l.id_lead === idLead) || {};
  const cal   = criarEventoCalendar_(lead, janela);
  const email = confirmarConsultaAoLead_(lead, janela);
  const aviso = avisarAdvogadaAgendamento_(lead, janela, cal);
  return { ok:true, calendario: cal, emailCliente: email, emailAdvogada: aviso };
}

/** Mesma ação, disparada pelo link do e-mail. */

function confirmarPeloEmail_(idLead, n){
  const lead = lerAba(ABAS.LEADS).find(l => l.id_lead === idLead);
  if (!lead) throw new Error('Contato não encontrado.');
  const janela = [lead.janela_1, lead.janela_2, lead.janela_3][(n || 1) - 1];
  if (!janela) throw new Error('Este horário não existe neste contato.');
  escolherJanela(idLead, janela);
  return { nome: lead.nome, janela: janela };
}

/** Cria o evento no Google Calendar e convida o cliente.
 *  Nunca lança erro para fora: se o Calendar falhar por qualquer motivo,
 *  a consulta já está gravada na planilha e o fluxo dela não pode travar. */

function criarEventoCalendar_(lead, janela){
  try{
    const partes = String(janela).split(' ');
    if (partes.length < 2) return { ok:false, motivo:'formato de data inesperado: ' + janela };
    const inicio = new Date(partes[0] + 'T' + partes[1] + ':00');
    if (isNaN(inicio.getTime())) return { ok:false, motivo:'data inválida: ' + janela };
    const duracaoMin = cfgNum('CONSULTA_DURACAO_MIN') || 30;
    const fim = new Date(inicio.getTime() + duracaoMin * 60000);
    const cal = calendarioDoEscritorio_();
    if (!cal) return { ok:false, motivo:'calendário não encontrado (confira CALENDAR_ID na Config)' };
    const opcoes = {
      description: 'Assunto: ' + (lead.beneficio_pretendido || '') +
        '\nTelefone: ' + (lead.telefone || '') +
        '\nE-mail: ' + (lead.email || '') +
        '\nOrigem: painel Opus AI · id_lead ' + (lead.id_lead || ''),
      location: cfg('ESCRITORIO_CIDADE') || ''
    };
    /* Convite do Calendar é um extra. O Google NÃO envia convite quando o
       convidado é a própria conta dona do calendário — por isso a confirmação
       oficial ao cliente sai por e-mail separado (confirmarConsultaAoLead_). */
    let convidado = false;
    if (lead.email && lead.email !== Session.getEffectiveUser().getEmail()){
      opcoes.guests = lead.email; opcoes.sendInvites = true; convidado = true;
    }
    const ev = cal.createEvent('Consulta · ' + (lead.nome || 'Contato'), inicio, fim, opcoes);
    /* Lembretes: é isto que faz o app do Google Agenda notificar no celular. */
    try{
      const popupMin = cfgNum('LEMBRETE_POPUP_MIN') || 30;
      const mailMin  = cfgNum('LEMBRETE_EMAIL_MIN') || 1440;   // 24 h antes
      ev.addPopupReminder(popupMin);
      ev.addEmailReminder(mailMin);
    }catch(e){ console.error('lembretes: ' + e); }
    return { ok:true, convidado: convidado, id: ev.getId(),
             calendario: cal.getName(), quando: fmtJanela_(janela) };
  }catch(e){
    /* O erro é devolvido, e não engolido: sem isso a falha some e
       o painel diz "confirmado" para algo que não aconteceu. */
    console.error('criarEventoCalendar_: ' + e);
    return { ok:false, motivo:String(e && e.message || e) };
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
  const pasta = criarPastaCliente((dadosCliente && dadosCliente.nome_completo) || lead.nome, idCliente);
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
  const g = gerarDocsDoChecklist(idCaso, lead.beneficio_pretendido);
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'status_lead','Convertido');
  atualizarCampo(ABAS.LEADS,'id_lead', idLead, 'id_cliente', idCliente);
  return { ok:true, id_cliente:idCliente, id_caso:idCaso, pasta:pasta.url,
           docs: (g && g.gerados) || 0, nome: lead.nome };
}

/** Diagnóstico rápido — rodar no editor para conferir a instalação. */

function verificarInstalacao(){
  const out = [];
  out.push('URL do app: ' + (urlApp_() || 'NÃO PUBLICADO'));
  out.push('E-mail do escritório: ' + emailEscritorio_());
  out.push('PAINEL_TOKEN: ' + (cfg('PAINEL_TOKEN') ? 'OK' : 'AUSENTE — o painel não abrirá'));
  out.push('EMAIL_COPIA (cópia oculta de teste): ' + (cfg('EMAIL_COPIA') || '(nenhuma)'));
  out.push('MODO_DEMO: ' + (cfg('MODO_DEMO') || '(vazio)'));
  out.push('Cota de e-mails restante hoje: ' + MailApp.getRemainingDailyQuota());
  out.push('Fuso do projeto: ' + Session.getScriptTimeZone());
  try {
    const cal = calendarioDoEscritorio_();
    out.push('Calendar (leitura): ' + cal.getName());
    /* Teste de ESCRITA: ler o calendário exige um escopo mais fraco do que
       criar evento. É a escrita que costuma faltar na implantação publicada. */
    const t0 = new Date(Date.now() + 86400000);
    const ev = cal.createEvent('[teste Opus AI] apagar', t0, new Date(t0.getTime() + 600000));
    ev.deleteEvent();
    out.push('Calendar (escrita): OK — evento de teste criado e removido');
  }
  catch(e){ out.push('Calendar: FALHOU — ' + e); }
  try {
    const h = horariosDisponiveis();
    out.push('Disponibilidade: fonte=' + h.fonte + ', ' + h.dias.length + ' dia(s) com vaga' +
             (h.dias.length ? ' (primeiro: ' + h.dias[0].iso + ' → ' + h.dias[0].horas.join(', ') + ')' : ''));
  } catch(e){ out.push('Disponibilidade: FALHOU — ' + e); }
  out.push('Link do painel: ' + urlApp_() + '?page=painel&k=' + cfg('PAINEL_TOKEN'));
  Logger.log(out.join('\n'));
  return out.join('\n');
}
