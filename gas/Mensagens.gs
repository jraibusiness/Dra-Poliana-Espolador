/** ============================================================
 * Mensagens.gs · Motor de templates (doc 02, aba Templates)
 * REGRA DE OURO (princípio nº 1): nada é ENVIADO por aqui.
 * Tudo é gerado como rascunho editável. Quem envia é ela.
 * ============================================================ */

function renderTemplate_(corpo, vars){
  return String(corpo||'').replace(/\{\{(\w+)\}\}/g, (m,k) => vars[k] !== undefined ? vars[k] : m);
}

function varsPara_(lead, cliente, caso, docsPendentes){
  const nome = (cliente && cliente.nome_completo) || (lead && lead.nome) || '';
  return {
    nome: nome,
    primeiro_nome: nome.split(' ')[0] || '',
    beneficio: (caso && caso.tipo_beneficio) || (lead && lead.beneficio_pretendido) || '',
    fase: (caso && caso.fase) || '',
    protocolo: (caso && (caso.numero_requerimento_nb || caso.numero_processo_cnj)) || '',
    docs_pendentes: (docsPendentes||[]).map(d=>'• '+d).join('\n'),
    advogada: cfg('ESCRITORIO_ADVOGADA'),
    data: '', hora: ''  // preenchidos pelo chamador quando aplicável
  };
}

/** Gera a mensagem de um template para um alvo. NÃO envia. */
function gerarMensagem(idTemplate, alvo){
  const t = lerAba(ABAS.TEMPLATES).find(x => x.id_template === idTemplate && String(x.ativo) === 'Sim');
  if (!t) throw new Error('Template não encontrado ou inativo');
  const lead    = alvo.id_lead    ? lerAba(ABAS.LEADS).find(l=>l.id_lead===alvo.id_lead)          : null;
  const cliente = alvo.id_cliente ? lerAba(ABAS.CLIENTES).find(c=>c.id_cliente===alvo.id_cliente) : null;
  const caso    = alvo.id_caso    ? lerAba(ABAS.CASOS).find(c=>c.id_caso===alvo.id_caso)          : null;
  const pend    = alvo.id_caso    ? lerAba(ABAS.DOCS).filter(d=>d.id_caso===alvo.id_caso &&
                    /Pendente|Solicitado/.test(d.status)).map(d=>d.nome_documento) : [];
  const vars = varsPara_(lead, cliente, caso, pend);
  if (alvo.data) vars.data = alvo.data;
  if (alvo.hora) vars.hora = alvo.hora;
  const corpo = renderTemplate_(t.corpo, vars);
  const tel = (cliente && cliente.telefone) || (lead && lead.telefone) || '';
  return {
    canal: t.canal,
    assunto: renderTemplate_(t.assunto, vars),
    corpo: corpo,
    telefone: tel,
    email: (cliente && cliente.email) || (lead && lead.email) || '',
    waLink: linkWa_(tel, corpo)
  };
}

/** wa.me com texto pré-preenchido (D-002). Ela revisa e envia do celular. */
function linkWa_(telefone, texto){
  const num = String(telefone||'').replace(/\D/g,'');
  return num ? 'https://wa.me/'+num+'?text='+encodeURIComponent(texto) : '';
}

/** Cria RASCUNHO no Gmail dela (não envia). */
function criarRascunhoEmail(destinatario, assunto, corpo){
  if (!destinatario) throw new Error('Sem e-mail de destino');
  GmailApp.createDraft(destinatario, assunto, corpo + '\n\n—\n' + cfg('RODAPE_LGPD'));
  return { ok:true };
}

/** Boas-vindas ao lead recém-chegado: rascunho automático na caixa dela. */
function criarRascunhoBoasVindas_(lead){
  try{
    const t = lerAba(ABAS.TEMPLATES).find(x => x.gatilho === 'Lead recebido pela LP' && String(x.ativo)==='Sim');
    if (!t || !lead.email) return;
    const vars = varsPara_(lead, null, null, []);
    GmailApp.createDraft(lead.email, renderTemplate_(t.assunto, vars),
      renderTemplate_(t.corpo, vars) + '\n\n—\n' + cfg('RODAPE_LGPD'));
  }catch(e){ /* rascunho é conveniência; falha não pode derrubar o intake */ }
}
