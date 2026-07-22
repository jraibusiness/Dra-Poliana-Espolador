/** ============================================================
 * Drive.gs · Pasta por cliente + docs a partir do checklist
 * O link da pasta é colado UMA VEZ no Astrea como Ligação
 * Externa (doc 04, Ponte 1).
 * ============================================================ */

function criarPastaCliente(nomeCliente, idCliente){
  const raizId = cfg('DRIVE_PASTA_RAIZ');
  const raiz = (raizId && raizId !== 'ID_DA_PASTA_RAIZ')
    ? DriveApp.getFolderById(raizId)
    : DriveApp.getRootFolder();
  const pasta = raiz.createFolder(idCliente + ' · ' + nomeCliente);
  ['01 Documentos pessoais','02 Documentos do caso','03 Laudos e exames','04 INSS - comunicações','05 Procuração e contrato']
    .forEach(s => pasta.createFolder(s));
  return { id: pasta.getId(), url: pasta.getUrl() };
}

/** Gera as linhas da aba Documentos a partir do checklist do benefício. */
function gerarDocsDoChecklist(idCaso, beneficio){
  const itens = lerAba(ABAS.CHECK)
    .filter(c => c.beneficio === beneficio)
    .sort((a,b) => Number(a.ordem)-Number(b.ordem));
  itens.forEach(c => appendObj_(ABAS.DOCS, {
    id_doc: proximoId_(ABAS.DOCS,'D'), id_caso: idCaso,
    nome_documento: c.documento, obrigatorio: c.obrigatorio,
    status: 'Pendente', observacao: c.orientacao_ao_cliente || ''
  }));
  return { ok:true, gerados: itens.length };
}

/** ============================================================
 * Relatorio.gs · Relatório de status em PDF (GAS → Doc → PDF)
 * ============================================================ */

function gerarRelatorioPdf(idCaso){
  const caso = lerAba(ABAS.CASOS).find(c => c.id_caso === idCaso);
  if (!caso) throw new Error('Caso não encontrado');
  const cli = lerAba(ABAS.CLIENTES).find(c => c.id_cliente === caso.id_cliente) || {};
  const docs = lerAba(ABAS.DOCS).filter(d => d.id_caso === idCaso);

  const doc = DocumentApp.create('Relatório · '+(cli.nome_completo||'')+' · '+idCaso);
  const b = doc.getBody();
  b.appendParagraph(cfg('ESCRITORIO_ADVOGADA')).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  b.appendParagraph('Relatório de andamento — emitido em '+
    Utilities.formatDate(new Date(),'America/Sao_Paulo','dd/MM/yyyy'));
  b.appendHorizontalRule();
  b.appendParagraph('Cliente: '+(cli.nome_completo||'')).setBold(true);
  b.appendParagraph('Benefício: '+caso.tipo_beneficio);
  b.appendParagraph('Situação atual: '+caso.fase).setBold(true);
  if (caso.numero_requerimento_nb) b.appendParagraph('Requerimento (NB): '+caso.numero_requerimento_nb);
  if (caso.numero_processo_cnj)    b.appendParagraph('Processo judicial: '+caso.numero_processo_cnj);
  if (caso.proxima_acao) b.appendParagraph('Próximo passo: '+caso.proxima_acao);
  if (docs.length){
    b.appendParagraph(' ');
    b.appendParagraph('Documentos').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    docs.forEach(d => b.appendListItem(d.nome_documento+' — '+d.status));
  }
  if (caso.historico){
    b.appendParagraph(' ');
    b.appendParagraph('Histórico').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    String(caso.historico).split('|').forEach(h => b.appendListItem(h.trim()));
  }
  b.appendParagraph(' ');
  b.appendParagraph('Nota de confidencialidade: este relatório contém dados pessoais protegidos. '+
    cfg('RODAPE_LGPD')).setItalic(true).setFontSize(9);
  doc.saveAndClose();

  const pdf = DriveApp.getFileById(doc.getId()).getAs('application/pdf');
  let destino = DriveApp.getRootFolder();
  if (cli.link_pasta_drive){
    const m = String(cli.link_pasta_drive).match(/folders\/([\w-]+)/);
    if (m) try{ destino = DriveApp.getFolderById(m[1]); }catch(e){}
  }
  const arq = destino.createFile(pdf).setName('Relatorio_'+idCaso+'_'+
    Utilities.formatDate(new Date(),'America/Sao_Paulo','yyyyMMdd')+'.pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);  // o Doc é só molde
  return { ok:true, url: arq.getUrl() };
}

/** ============================================================
 * Astrea.gs · Exportação de contatos (doc 04, Ponte 2)
 * Sem API pública → CSV para importação + bloco copiar/colar.
 * ⚠ Validar layout do CSV de importação na homologação.
 * ============================================================ */

const CAMPOS_ASTREA = ['nome_completo','cpf','rg','orgao_emissor','data_nascimento','estado_civil',
  'profissao','nacionalidade','nome_mae','nit_pis','logradouro','numero','complemento','bairro',
  'cidade','uf','cep','telefone','email'];

const ROTULOS_ASTREA = {
  nome_completo:'Nome', cpf:'CPF', rg:'RG', orgao_emissor:'Órgão emissor',
  data_nascimento:'Data de nascimento', estado_civil:'Estado civil', profissao:'Profissão',
  nacionalidade:'Nacionalidade', nome_mae:'Nome da mãe', nit_pis:'NIT/PIS',
  logradouro:'Endereço', numero:'Número', complemento:'Complemento', bairro:'Bairro',
  cidade:'Cidade', uf:'UF', cep:'CEP', telefone:'Telefone', email:'E-mail'
};

function exportarAstrea(idCliente){
  const c = lerAba(ABAS.CLIENTES).find(x => x.id_cliente === idCliente);
  if (!c) throw new Error('Cliente não encontrado');
  const fmt = v => (v instanceof Date)
    ? Utilities.formatDate(v,'America/Sao_Paulo','dd/MM/yyyy') : String(v||'');
  const csv = CAMPOS_ASTREA.map(k=>ROTULOS_ASTREA[k]).join(',') + '\n' +
              CAMPOS_ASTREA.map(k => '"'+fmt(c[k]).replace(/"/g,'""')+'"').join(',');
  const bloco = CAMPOS_ASTREA.map(k => ROTULOS_ASTREA[k]+': '+fmt(c[k]))
                             .filter(l => !/:\s*$/.test(l)).join('\n');
  return { ok:true, csv: csv, bloco: bloco, nome: c.nome_completo };
}
