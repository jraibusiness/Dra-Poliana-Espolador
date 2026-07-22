/** ============================================================
 * Scoring.gs · Classificação determinística de leads (doc 03)
 * Espelha data/gerar_seed.py — manter os dois em paralelo é
 * proposital: o seed serve de teste de regressão do algoritmo.
 * Sem IA. Pesos editáveis na aba Config.
 * ============================================================ */

function calcularScore(lead){
  let s = 0;
  const det = [];
  const add = (peso, motivo) => { s += peso; det.push((peso>0?'+':'')+peso+' '+motivo); };

  if (lead.situacao === 'Requeri e foi negado')  add(cfgNum('PESO_NEGATIVA'), 'benefício negado');
  if (lead.situacao === 'Recebia e foi cessado') add(cfgNum('PESO_CESSADO'), 'benefício cessado');

  if (lead.urgencia === 'Estou sem renda')             add(cfgNum('PESO_URGENCIA_ALTA'), 'sem renda');
  else if (lead.urgencia === 'Preciso resolver em breve') add(cfgNum('PESO_URGENCIA_MEDIA'), 'urgência média');

  if (lead.tem_documentos === 'Tenho tudo')       add(cfgNum('PESO_DOCS_COMPLETOS'), 'documentos completos');
  else if (lead.tem_documentos === 'Tenho parte') add(cfgNum('PESO_DOCS_PARCIAIS'), 'documentos parciais');

  if (cfgLista('BENEFICIOS_ALTO_VALOR').indexOf(lead.beneficio_pretendido) >= 0)
    add(cfgNum('PESO_BENEFICIO_ALTO'), 'benefício de alto valor');

  if (String(lead.quem_indicou||'').trim()) add(cfgNum('PESO_INDICACAO_NOMINAL'), 'indicação nominal');
  if (String(lead.relato||'').length > 200) add(cfgNum('PESO_RELATO_DETALHADO'), 'relato detalhado');

  if (lead.urgencia === 'Sem pressa' && lead.situacao === 'Nunca requeri' && lead.tem_documentos === 'Não tenho nada')
    add(cfgNum('PESO_SO_DUVIDAS'), 'perfil informativo');
  if (/Não sei|Outro/i.test(lead.beneficio_pretendido||''))
    add(cfgNum('PESO_FORA_AREA'), 'fora da área');

  s = Math.max(0, Math.min(100, s));
  return { score: s, faixa: faixa_(s), decomposicao: det.join(' | ') };
}

function faixa_(s){
  if (s >= cfgNum('CORTE_PRIORITARIO')) return 'Prioritário';
  if (s >= cfgNum('CORTE_QUALIFICADO')) return 'Qualificado';
  if (s >= cfgNum('CORTE_AVALIACAO'))   return 'Em avaliação';
  return 'Informativo';
}

/** Recalcula todos os leads (usar após mudar pesos na Config). */
function recalcularTodosOsLeads(){
  const sh = sheet_(ABAS.LEADS);
  const v = sh.getDataRange().getValues(); const h = v[0];
  const iS = h.indexOf('score'), iF = h.indexOf('faixa');
  for (let i=1;i<v.length;i++){
    if (!String(v[i][0]).trim()) continue;
    const lead = Object.fromEntries(h.map((c,j)=>[c, v[i][j]]));
    const r = calcularScore(lead);
    sh.getRange(i+1, iS+1).setValue(r.score);
    sh.getRange(i+1, iF+1).setValue(r.faixa);
  }
  _cfgCache = null;
  return { ok:true };
}
