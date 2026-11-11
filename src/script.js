// ==============================================
// DADOS DE DEMONSTRAÇÃO
// ==============================================
const produtos = [
  { id: 1, categoria: 'Frutas — Na safra (jun. a out.)', nome: 'Morango', precoConsumidor: 12.00, unidade: 'bandeja', precoLoja: null, minLoja: null, quantidade: 60, local: 'Uberaba/MG', produtor: 'Sítio Boa Vista', data: '7 out. 2026', inspecao: false, regraVenda: 'Todo o Brasil' },
  { id: 2, categoria: 'Ovos — O ano todo', nome: 'Ovos caipira', precoConsumidor: 14.00, unidade: 'dúzia', precoLoja: 10.50, minLoja: 10, quantidade: 80, local: 'Uberaba/MG', produtor: 'Sítio Boa Vista', data: '7 out. 2026', inspecao: true, regraVenda: 'Apenas Uberaba/MG', registro: 'SIM 012' },
  { id: 3, categoria: 'Hortaliças — O ano todo', nome: 'Tomate italiano', precoConsumidor: 7.90, unidade: 'kg', precoLoja: 5.50, minLoja: 20, quantidade: 150, local: 'Uberaba/MG', produtor: 'Sítio Boa Vista', data: '7 out. 2026', inspecao: false, regraVenda: 'Todo o Brasil' },
  { id: 4, categoria: 'Hortaliças — O ano todo', nome: 'Alface crespa', precoConsumidor: 3.50, unidade: 'maço', precoLoja: 2.40, minLoja: 50, quantidade: 200, local: 'Uberaba/MG', produtor: 'Sítio Boa Vista', data: '7 out. 2026', inspecao: false, regraVenda: 'Todo o Brasil' },
  { id: 5, categoria: 'Bebidas — O ano todo', nome: 'Café torrado e moído 500g', precoConsumidor: 32.00, unidade: 'pacote', precoLoja: 24.00, minLoja: 20, quantidade: 400, local: 'Conceição das Alagoas/MG', produtor: 'Fazenda Santa Clara', data: '7 out. 2026', inspecao: false, regraVenda: 'Todo o Brasil' },
  { id: 6, categoria: 'Queijos e laticínios — O ano todo', nome: 'Queijo minas artesanal', precoConsumidor: 48.00, unidade: 'kg', precoLoja: 36.00, minLoja: 5, quantidade: 120, local: 'Sacramento/MG', produtor: 'Queijaria Serra Azul', data: '7 out. 2026', inspecao: true, regraVenda: 'Todo o Brasil', registro: 'ARTE 0001' },
]

const produtores = [
  { id: 1, nome: 'Sítio Boa Vista', cidade: 'Uberaba/MG', tipo: 'Orgânico (declarado)', produtos: 4, formas: ['Retirada', 'Entrega', 'Feira'] },
  { id: 2, nome: 'Fazenda Santa Clara', cidade: 'Conceição das Alagoas/MG', tipo: 'Convencional', produtos: 1, formas: ['Entrega', 'A combinar'] },
  { id: 3, nome: 'Queijaria Serra Azul', cidade: 'Sacramento/MG', tipo: 'Artesanal', produtos: 1, formas: ['Retirada', 'Envio'] },
]

const encomendas = [
  { id: 1, titulo: 'Alface crespa toda semana', categoria: 'Hortaliças', quantidade: '300 maços', cidade: 'Uberaba/MG', prazo: '27 out. 2026', comprador: 'Rita — Mercado Bom Preço', status: 'Aberta', propostas: 0 },
]

// Estado da aplicação
let usuarioAtual = null
let precosLojaVisiveis = false
let produtoSelecionado = null
let minhasPropostas = []
let encomendaSelecionada = null
let minhasPerguntas = []
let produtorSelecionado = null
let perguntaContexto = null

// ==============================================
// NAVEGAÇÃO PRINCIPAL — Botões Criar Conta / Entrar
// ==============================================
document.addEventListener('click', function(e) {
  const link = e.target.closest('[data-pagina]')
  if (link) {
    e.preventDefault()
    const pagina = link.getAttribute('data-pagina')
    const tipo = link.getAttribute('data-tipo')
    navegarPara(pagina, tipo)
  }
})

function navegarPara(pagina, tipo = null) {
  // Esconde todas as páginas
  document.querySelectorAll('.pagina').forEach(p => p.classList.remove('ativa'))
  
  // Mostra a página alvo
  const alvo = document.getElementById(`pagina-${pagina}`)
  if (alvo) alvo.classList.add('ativa')
  
  // Marca item de navegação ativo
  document.querySelectorAll('.navegacao a').forEach(a => a.classList.remove('ativa'))
  document.querySelector(`.navegacao a[data-pagina="${pagina}"]`)?.classList.add('ativa')

  // Carrega conteúdo conforme a página
  switch(pagina) {
    case 'inicio': carregarProdutosDestaque(); break
    case 'produtos': carregarListaProdutos(); break
    case 'produtores': carregarListaProdutores(); break
    case 'encomendas': carregarListaEncomendas(); break
    case 'painel': carregarPainel(); break
    case 'produto': carregarDetalheProduto(); break
    case 'pedido': prepararFormPedido(); break
    case 'proposta-encomenda': prepararFormEncomenda(); break
    case 'vitrine': carregarVitrine(); break
    case 'pergunta': prepararFormPergunta(); break
    case 'cadastrar':
      if (tipo) {
        const radio = document.querySelector(`input[name="tipo-pessoa"][value="${tipo}"]`)
        if (radio) radio.checked = true
      }
      break
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ==============================================
// RENDERIZAÇÃO DE PRODUTOS
// ==============================================
function carregarProdutosDestaque() {
  const container = document.getElementById('produtos-destaque')
  if (!container) return
  container.innerHTML = produtos.slice(0, 6).map(p => gerarCardProduto(p)).join('')
  atribuirCliquesProdutos()
  carregarQuadroPrecos()
  carregarNumeros()
}

function carregarQuadroPrecos() {
  const lista = document.getElementById('quadro-precos')
  if (!lista) return
  lista.innerHTML = produtos.slice(0, 5).map(p => `
    <li>
      <span class="nome">${p.nome}</span>
      <span class="pontilhado"></span>
      <span class="valor">R$ ${p.precoConsumidor.toFixed(2).replace('.', ',')} <small>/${p.unidade}</small></span>
    </li>
  `).join('')
}

function carregarNumeros() {
  const cidades = new Set(produtos.map(p => p.local))
  const valores = {
    'num-produtores': produtores.length,
    'num-produtos': produtos.length,
    'num-cidades': cidades.size,
    'num-encomendas': encomendas.filter(e => e.status === 'Aberta').length
  }
  Object.entries(valores).forEach(([id, valor]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = valor
  })
}

function classeCapa(categoria) {
  const c = categoria.toLowerCase()
  if (c.startsWith('frutas')) return 'capa-frutas'
  if (c.startsWith('ovos')) return 'capa-ovos'
  if (c.startsWith('hortali')) return 'capa-hortalicas'
  if (c.startsWith('bebidas')) return 'capa-bebidas'
  if (c.startsWith('queijos')) return 'capa-queijos'
  return 'capa-padrao'
}

function carregarListaProdutos() {
  const container = document.getElementById('lista-produtos')
  if (!container) return
  container.innerHTML = produtos.map(p => gerarCardProduto(p)).join('')
  atribuirCliquesProdutos()
  atualizarBotaoFiltro()
}

function gerarCardProduto(p) {
  const precoPrincipal = precosLojaVisiveis && p.precoLoja
    ? `<span class="preco-loja">Loja: R$ ${p.precoLoja.toFixed(2)}/${p.unidade} · Mínimo ${p.minLoja} ${p.unidade}</span>`
    : `R$ ${p.precoConsumidor.toFixed(2)} <span>por ${p.unidade}</span>`

  const aviso = p.inspecao
    ? `<span class="aviso-inspecao ${p.regraVenda.includes('Apenas') ? 'aviso-bloqueado' : ''}">✓ Inspeção: ${p.regraVenda}</span>`
    : ''

  const bloqueado = precosLojaVisiveis && p.precoLoja === null
    ? '<div class="aviso-inspecao aviso-bloqueado">Preço de atacado não disponível</div>'
    : ''

  return `
    <div class="card-produto" data-produto-id="${p.id}" tabindex="0" role="button" aria-label="Ver ${p.nome}">
      <div class="card-capa ${classeCapa(p.categoria)}" aria-hidden="true">
        <span class="safra">${p.categoria.split('—')[1]?.trim() || ''}</span>
        <span class="inicial">${p.nome.charAt(0)}</span>
      </div>
      <div class="card-corpo">
        <span class="categoria">${p.categoria.split('—')[0].trim()}</span>
        <h3>${p.nome}</h3>
        <p class="preco">${precoPrincipal}</p>
        ${bloqueado}
        <p class="local">${p.local} · ${p.quantidade} disponíveis</p>
        <p class="origem">Por ${p.produtor} · ${p.data}</p>
        ${aviso}
      </div>
    </div>
  `
}

function atribuirCliquesProdutos() {
  document.querySelectorAll('.card-produto').forEach(card => {
    const abrir = () => {
      produtoSelecionado = produtos.find(p => p.id === parseInt(card.dataset.produtoId))
      navegarPara('produto')
    }
    card.addEventListener('click', abrir)
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir() }
    })
  })
}

document.getElementById('filtro-precos')?.addEventListener('click', () => {
  precosLojaVisiveis = !precosLojaVisiveis
  carregarListaProdutos()
})

function atualizarBotaoFiltro() {
  const btn = document.getElementById('filtro-precos')
  if (!btn) return
  btn.textContent = precosLojaVisiveis ? 'Ver preços de consumidor' : 'Ver preços de loja'
}

// ==============================================
// DETALHE DO PRODUTO
// ==============================================
function carregarDetalheProduto() {
  const p = produtoSelecionado
  if (!p) return

  const precoExibir = precosLojaVisiveis && p.precoLoja
    ? `R$ ${p.precoLoja.toFixed(2)} / ${p.unidade} (mínimo ${p.minLoja} ${p.unidade})`
    : `R$ ${p.precoConsumidor.toFixed(2)} / ${p.unidade}`

  const podeComprar = !precosLojaVisiveis || p.precoLoja

  document.getElementById('detalhe-produto').innerHTML = `
    <a href="#" class="voltar-link" data-pagina="produtos">← Voltar para produtos</a>
    <div class="detalhe-produto">
      <div class="detalhe-cabecalho">
        <div>
          <span class="categoria">${p.categoria}</span>
          <h2>${p.nome}</h2>
          <p class="preco">${precoExibir}</p>
          ${p.inspecao ? `<p><strong>Inspeção:</strong> ${p.regraVenda} · Registro ${p.registro}</p>` : ''}
        </div>
      </div>
      <div class="detalhe-info">
        <p><strong>Local:</strong> ${p.local}</p>
        <p><strong>Disponível:</strong> ${p.quantidade} ${p.unidade}</p>
        <p><strong>Produtor:</strong> <a href="#" class="link-produtor" id="link-produtor-detalhe">${p.produtor}</a></p>
        <p><strong>Publicado em:</strong> ${p.data}</p>
      </div>
      <div class="detalhe-acoes">
        ${podeComprar
          ? `<button class="btn btn-primario btn-grande" id="btn-fazer-pedido">Fazer Pedido / Proposta</button>`
          : `<button class="btn btn-primario btn-grande" disabled>Indisponível para lojas</button>`
        }
        <button class="btn btn-secundario btn-grande" id="btn-perguntar">Perguntar ao produtor</button>
        <button class="btn btn-terciario btn-grande" id="btn-ver-vitrine-produto">Ver vitrine de ${p.produtor}</button>
      </div>
    </div>
  `

  document.getElementById('btn-fazer-pedido')?.addEventListener('click', () => {
    if (!usuarioAtual) {
      mostrarModal('Faça login', 'Você precisa entrar ou criar conta para enviar propostas.')
      setTimeout(() => navegarPara('entrar'), 1500)
      return
    }
    navegarPara('pedido')
  })

  document.getElementById('btn-perguntar')?.addEventListener('click', () => abrirPergunta(p.produtor, p.nome, 'produto'))
  const irVitrine = e => { e.preventDefault(); abrirVitrine(p.produtor) }
  document.getElementById('btn-ver-vitrine-produto')?.addEventListener('click', irVitrine)
  document.getElementById('link-produtor-detalhe')?.addEventListener('click', irVitrine)
}

// ==============================================
// FORMULÁRIO DE PEDIDO
// ==============================================
function precoAtual(p) {
  return precosLojaVisiveis && p.precoLoja ? p.precoLoja : p.precoConsumidor
}

function moeda(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',')
}

function prepararFormPedido() {
  const p = produtoSelecionado
  if (!p) return
  const minimo = precosLojaVisiveis && p.precoLoja ? p.minLoja : 1
  document.getElementById('resumo-pedido').innerHTML =
    `<strong>${p.nome}</strong> de ${p.produtor} · ${moeda(precoAtual(p))} / ${p.unidade}`
  document.getElementById('dica-quant').textContent = `(${p.unidade} · mín. ${minimo}, máx. ${p.quantidade})`
  const quant = document.getElementById('pedido-quant')
  quant.min = minimo; quant.max = p.quantidade
  if (!quant.value) quant.value = minimo
  document.getElementById('pedido-valor').value = precoAtual(p).toFixed(2)
  const amanha = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const data = document.getElementById('pedido-data')
  data.min = amanha
  if (!data.value) data.value = amanha
  document.getElementById('erro-pedido').textContent = ''
  atualizarTotalPedido()
}

function atualizarTotalPedido() {
  const p = produtoSelecionado
  if (!p) return
  const qtd = parseFloat(document.getElementById('pedido-quant').value) || 0
  const valor = parseFloat(document.getElementById('pedido-valor').value) || 0
  const desconto = valor < precoAtual(p) ? ` <span class="dica">(oferta abaixo do anunciado)</span>` : ''
  document.getElementById('resumo-total').innerHTML =
    `Total da proposta: <strong>${moeda(qtd * valor)}</strong>${desconto}`
}
['pedido-quant', 'pedido-valor'].forEach(id =>
  document.getElementById(id).addEventListener('input', atualizarTotalPedido))

document.getElementById('form-pedido').addEventListener('submit', e => {
  e.preventDefault()
  const p = produtoSelecionado
  if (!p) return
  const erro = document.getElementById('erro-pedido')
  const quant = document.getElementById('pedido-quant')
  const qtd = parseFloat(quant.value)
  const valor = parseFloat(document.getElementById('pedido-valor').value)
  const data = document.getElementById('pedido-data').value

  if (!qtd || qtd < Number(quant.min)) { erro.textContent = `A quantidade mínima é ${quant.min} ${p.unidade}.`; return }
  if (qtd > p.quantidade) { erro.textContent = `O produtor só tem ${p.quantidade} ${p.unidade} disponíveis.`; return }
  if (!valor || valor <= 0) { erro.textContent = 'Informe o valor oferecido.'; return }
  if (!data) { erro.textContent = 'Escolha a data de entrega ou retirada.'; return }

  const proposta = {
    produto: p.nome,
    produtor: p.produtor,
    quantidade: `${qtd} ${p.unidade}`,
    valorUnit: valor,
    total: qtd * valor,
    data: new Date(data + 'T12:00').toLocaleDateString('pt-BR'),
    transporte: document.getElementById('pedido-transporte').value,
    pagamento: document.getElementById('pedido-pagamento').value,
    status: 'Pendente',
    dataEnvio: new Date().toLocaleDateString('pt-BR')
  }
  minhasPropostas.unshift(proposta)
  simularResposta(proposta, valor >= precoAtual(p) * 0.85)

  mostrarModal('Proposta enviada!', `${p.produtor} recebeu sua proposta de ${moeda(proposta.total)}. Acompanhe no painel.`)
  e.target.reset()
  setTimeout(() => navegarPara('painel'), 1800)
})

// Simula o andamento: produtor responde e, se aceitar, a compra avança até a entrega
function simularResposta(proposta, aceita) {
  const etapas = aceita
    ? [['Aceita', 4000, `${proposta.produtor} aceitou sua proposta!`],
       ['Pagamento combinado', 8000, `Pagamento via ${proposta.pagamento} combinado.`],
       ['A caminho', 12000, `Seu pedido de ${proposta.produto} está a caminho.`],
       ['Entregue', 16000, `${proposta.produto} entregue. Bom proveito!`]]
    : [['Recusada', 5000, `${proposta.produtor} recusou: valor muito abaixo do anunciado.`]]
  etapas.forEach(([status, atraso, msg]) => setTimeout(() => {
    if (!minhasPropostas.includes(proposta)) return
    proposta.status = status
    mostrarAviso(msg)
    if (document.getElementById('pagina-painel').classList.contains('ativa')) carregarPainel()
  }, atraso))
}

function mostrarAviso(texto) {
  const area = document.getElementById('avisos-toast')
  if (!area) return
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = texto
  area.appendChild(el)
  setTimeout(() => el.remove(), 4500)
}

// Simulação guiada: entra com conta demo e leva ao pedido de um produto
document.getElementById('btn-simular-compra')?.addEventListener('click', () => {
  if (!usuarioAtual) {
    usuarioAtual = { nome: 'Visitante', email: 'visitante@exemplo.com', tipo: 'consumidor', cidade: 'Uberaba/MG' }
    atualizarCabecalho()
  }
  produtoSelecionado = produtos[1]
  navegarPara('pedido')
  mostrarAviso('Simulação: confira os dados e clique em "Enviar proposta".')
})

// ==============================================
// PROPOSTA PARA ENCOMENDA
// ==============================================
function prepararFormEncomenda() {
  const e = encomendaSelecionada
  if (!e) return
  document.getElementById('resumo-encomenda').innerHTML =
    `<strong>${e.titulo}</strong> · ${e.quantidade} para ${e.comprador} · até ${e.prazo}`
  document.getElementById('dica-enc-quant').textContent = `(pedido: ${e.quantidade})`
  document.getElementById('enc-quant').value = parseInt(e.quantidade) || ''
  document.getElementById('erro-encomenda').textContent = ''
  atualizarTotalEncomenda()
}

function atualizarTotalEncomenda() {
  const q = parseFloat(document.getElementById('enc-quant').value) || 0
  const v = parseFloat(document.getElementById('enc-valor').value) || 0
  document.getElementById('resumo-total-enc').innerHTML = `Total por entrega: <strong>${moeda(q * v)}</strong>`
}
['enc-quant', 'enc-valor'].forEach(id =>
  document.getElementById(id).addEventListener('input', atualizarTotalEncomenda))

document.getElementById('form-proposta-encomenda').addEventListener('submit', ev => {
  ev.preventDefault()
  const e = encomendaSelecionada
  if (!e) return
  const erro = document.getElementById('erro-encomenda')
  const valor = parseFloat(document.getElementById('enc-valor').value)
  const qtd = parseFloat(document.getElementById('enc-quant').value)
  const data = document.getElementById('enc-data').value
  if (!valor || valor <= 0) { erro.textContent = 'Informe seu preço por unidade.'; return }
  if (!qtd || qtd <= 0) { erro.textContent = 'Informe a quantidade.'; return }
  if (!data) { erro.textContent = 'Escolha a data da primeira entrega.'; return }

  e.propostas++
  const proposta = {
    produto: e.titulo, produtor: e.comprador, quantidade: `${qtd}`, valorUnit: valor, total: qtd * valor,
    data: new Date(data + 'T12:00').toLocaleDateString('pt-BR'), pagamento: 'Pix', status: 'Pendente'
  }
  minhasPropostas.unshift(proposta)
  simularResposta(proposta, true)
  mostrarModal('Proposta enviada!', `${e.comprador} recebeu sua proposta de ${moeda(proposta.total)}.`)
  ev.target.reset()
  setTimeout(() => navegarPara('painel'), 1800)
})

// ==============================================
// PRODUTORES
// ==============================================
function carregarListaProdutores() {
  const container = document.getElementById('lista-produtores')
  if (!container) return
  container.innerHTML = produtores.map(p => `
    <div class="card-produtor">
      <h3>${p.nome}</h3>
      <p>${p.cidade}</p>
      <p><em>${p.tipo}</em></p>
      <p>${p.produtos} produtos à venda</p>
      <div class="tags">${p.formas.map(f => `<span class="tag">${f}</span>`).join('')}</div>
      <button class="btn btn-secundario btn-ver-vitrine" data-produtor="${p.nome}" style="margin-top:12px; width:100%">Ver vitrine</button>
    </div>
  `).join('')

  container.querySelectorAll('.btn-ver-vitrine').forEach(btn => {
    btn.addEventListener('click', () => abrirVitrine(btn.dataset.produtor))
  })
}

// ==============================================
// VITRINE DO PRODUTOR
// ==============================================
function abrirVitrine(nomeProdutor) {
  produtorSelecionado = produtores.find(p => p.nome === nomeProdutor) || null
  navegarPara('vitrine')
}

function carregarVitrine() {
  const container = document.getElementById('conteudo-vitrine')
  const prod = produtorSelecionado
  if (!container) return
  if (!prod) {
    container.innerHTML = '<p>Produtor não encontrado. <a href="#" data-pagina="produtores">Ver produtores</a></p>'
    return
  }

  const itens = produtos.filter(p => p.produtor === prod.nome)

  container.innerHTML = `
    <a href="#" class="voltar-link" data-pagina="produtores">← Voltar para produtores</a>
    <div class="vitrine-cabecalho">
      <div class="vitrine-avatar" aria-hidden="true">${prod.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
      <div class="vitrine-info">
        <span class="sobretitulo">Vitrine do produtor</span>
        <h2>${prod.nome}</h2>
        <p>${prod.cidade} · <em>${prod.tipo}</em> · ${itens.length} produto(s) à venda</p>
        <div class="tags">${prod.formas.map(f => `<span class="tag">${f}</span>`).join('')}</div>
      </div>
      <button class="btn btn-primario btn-grande" id="btn-perguntar-vitrine">Perguntar ao produtor</button>
    </div>
    ${itens.length
      ? `<div class="grade-produtos">${itens.map(p => gerarCardProduto(p)).join('')}</div>`
      : '<div class="vazio">Este produtor ainda não publicou produtos.</div>'}
  `

  atribuirCliquesProdutos()
  document.getElementById('btn-perguntar-vitrine').addEventListener('click', () => abrirPergunta(prod.nome, null, 'vitrine'))
}

// ==============================================
// PERGUNTAR AO PRODUTOR
// ==============================================
function abrirPergunta(nomeProdutor, nomeProduto, origem) {
  if (!usuarioAtual) {
    mostrarModal('Faça login', 'Você precisa entrar ou criar conta para falar com o produtor.')
    setTimeout(() => navegarPara('entrar'), 1500)
    return
  }
  perguntaContexto = { produtor: nomeProdutor, produto: nomeProduto, origem }
  navegarPara('pergunta')
}

function prepararFormPergunta() {
  const ctx = perguntaContexto
  if (!ctx) return
  document.getElementById('resumo-pergunta').innerHTML =
    `Sua mensagem vai para <strong>${ctx.produtor}</strong>. A resposta aparece no seu painel.`

  const itens = produtos.filter(p => p.produtor === ctx.produtor)
  const select = document.getElementById('pergunta-assunto')
  select.innerHTML = '<option value="">Assunto geral</option>' +
    itens.map(p => `<option value="${p.nome}" ${p.nome === ctx.produto ? 'selected' : ''}>${p.nome}</option>`).join('')
}

document.getElementById('voltar-pergunta')?.addEventListener('click', e => {
  e.preventDefault()
  navegarPara(perguntaContexto?.origem === 'vitrine' ? 'vitrine' : 'produto')
})

document.getElementById('form-pergunta').addEventListener('submit', e => {
  e.preventDefault()
  const ctx = perguntaContexto
  if (!ctx) return

  const texto = document.getElementById('pergunta-texto').value.trim()
  if (texto.length < 5) {
    mostrarModal('Pergunta muito curta', 'Escreva um pouco mais para o produtor entender.')
    return
  }

  const pergunta = {
    produtor: ctx.produtor,
    assunto: document.getElementById('pergunta-assunto').value || 'Assunto geral',
    texto,
    resposta: null,
    dataEnvio: new Date().toLocaleDateString('pt-BR')
  }
  minhasPerguntas.unshift(pergunta)

  // Simula a resposta do produtor alguns segundos depois
  setTimeout(() => {
    pergunta.resposta = gerarRespostaSimulada(ctx.produtor, pergunta.assunto)
    if (document.getElementById('pagina-painel').classList.contains('ativa')) carregarPainel()
  }, 6000)

  mostrarModal('Pergunta enviada!', `${ctx.produtor} recebeu sua mensagem. Acompanhe a resposta no seu painel.`)
  e.target.reset()
  setTimeout(() => navegarPara('painel'), 2000)
})

function gerarRespostaSimulada(nomeProdutor, assunto) {
  const prod = produtores.find(p => p.nome === nomeProdutor)
  const formas = prod ? prod.formas.join(', ').toLowerCase() : 'a combinar'
  const sobre = assunto === 'Assunto geral' ? '' : ` Sobre ${assunto.toLowerCase()}: temos disponível esta semana.`
  return `Olá! Obrigado pelo contato.${sobre} Trabalhamos com ${formas}. Pode mandar sua proposta pelo site que respondemos rápido.`
}

// ==============================================
// ENCOMENDAS
// ==============================================
function carregarListaEncomendas() {
  const container = document.getElementById('lista-encomendas')
  if (!container) return
  container.innerHTML = encomendas.map(e => `
    <div class="card-encomenda">
      <h3>${e.titulo}</h3>
      <p><strong>Categoria:</strong> ${e.categoria}</p>
      <p><strong>Quantidade:</strong> ${e.quantidade}</p>
      <p><strong>Entrega em:</strong> ${e.cidade}</p>
      <p class="prazo">Prazo: até ${e.prazo}</p>
      <p><strong>Comprador:</strong> ${e.comprador}</p>
      <p>Status: ${e.status} · ${e.propostas} proposta(s)</p>
      <button class="btn btn-primario btn-enviar-encomenda" data-id="${e.id}" style="margin-top:10px">Enviar proposta</button>
    </div>
  `).join('')

  container.querySelectorAll('.btn-enviar-encomenda').forEach(btn => btn.addEventListener('click', () => {
    if (!usuarioAtual) {
      mostrarModal('Faça login', 'Você precisa entrar ou criar conta para enviar propostas.')
      setTimeout(() => navegarPara('entrar'), 1500)
      return
    }
    encomendaSelecionada = encomendas.find(x => x.id === parseInt(btn.dataset.id))
    navegarPara('proposta-encomenda')
  }))
}

// ==============================================
// CADASTRO — FUNCIONANDO ✅
// ==============================================
document.getElementById('form-cadastro').addEventListener('submit', e => {
  e.preventDefault()
  
  const nome = document.getElementById('cad-nome').value.trim()
  const email = document.getElementById('cad-email').value.trim()
  const tipo = document.querySelector('input[name="tipo-pessoa"]:checked').value
  const cidade = document.getElementById('cad-cidade').value.trim()
  const senha = document.getElementById('cad-senha').value
  const senha2 = document.getElementById('cad-senha2').value

  // Validações
  if (nome.length < 2) {
    mostrarModal('Nome inválido', 'Digite seu nome completo.')
    return
  }
  if (!email.includes('@')) {
    mostrarModal('E-mail inválido', 'Digite um e-mail válido.')
    return
  }
  if (senha.length < 8) {
    mostrarModal('Senha curta', 'Use pelo menos 8 caracteres.')
    return
  }
  if (senha !== senha2) {
    mostrarModal('Senhas diferentes', 'As senhas não coincidem.')
    return
  }

  // Cria usuário
  usuarioAtual = { nome, email, tipo, cidade }
  
  // Atualiza cabeçalho
  atualizarCabecalho()
  
  mostrarModal('Conta criada! 🎉', `Bem-vindo(a), ${nome}! Sua conta está ativa.`)
  e.target.reset()
  
  setTimeout(() => navegarPara('painel'), 2000)
})

// ==============================================
// LOGIN — FUNCIONANDO ✅
// ==============================================
document.getElementById('form-entrar').addEventListener('submit', e => {
  e.preventDefault()
  
  const email = document.getElementById('entrar-email').value.trim()
  const senha = document.getElementById('entrar-senha').value

  if (!email.includes('@')) {
    mostrarModal('E-mail inválido', 'Digite um e-mail válido.')
    return
  }
  if (senha.length < 8) {
    mostrarModal('Senha incorreta', 'Use pelo menos 8 caracteres.')
    return
  }

  // Simula login bem-sucedido
  usuarioAtual = {
    nome: email.split('@')[0],
    email,
    tipo: 'consumidor',
    cidade: 'Uberaba/MG'
  }
  
  atualizarCabecalho()
  mostrarModal('Bem-vindo(a)! ✅', `Você entrou como ${usuarioAtual.nome}.`)
  e.target.reset()
  
  setTimeout(() => navegarPara('painel'), 1500)
})

// ==============================================
// PAINEL DO USUÁRIO
// ==============================================
function carregarPainel() {
  if (!usuarioAtual) {
    document.getElementById('saudacao-usuario').textContent = 'Faça login para ver seu painel'
    document.getElementById('dados-painel').innerHTML = '<p>Você não está conectado.</p>'
    document.getElementById('acoes-painel').innerHTML = '<a href="#" data-pagina="entrar" class="btn btn-primario">Entrar</a> <a href="#" data-pagina="cadastrar" class="btn btn-secundario">Criar conta</a>'
    document.getElementById('minhas-propostas').innerHTML = '<p>Suas propostas aparecerão aqui.</p>'
    document.getElementById('minhas-perguntas').innerHTML = '<p>Suas perguntas aos produtores aparecerão aqui.</p>'
    return
  }

  document.getElementById('saudacao-usuario').textContent = `Olá, ${usuarioAtual.nome}!`
  document.getElementById('dados-painel').innerHTML = `
    <p><strong>E-mail:</strong> ${usuarioAtual.email}</p>
    <p><strong>Perfil:</strong> ${usuarioAtual.tipo === 'produtor' ? 'Produtor' : usuarioAtual.tipo === 'comercio' ? 'Comércio' : 'Consumidor'}</p>
    <p><strong>Cidade:</strong> ${usuarioAtual.cidade}</p>
  `

  const acoes = {
    produtor: [
      { texto: '📦 Ver produtos', pagina: 'produtos' },
      { texto: '🏪 Produtores', pagina: 'produtores' },
      { texto: '📋 Encomendas', pagina: 'encomendas' }
    ],
    comercio: [
      { texto: '🛒 Produtos (atacado)', pagina: 'produtos' },
      { texto: '📝 Encomendas', pagina: 'encomendas' }
    ],
    consumidor: [
      { texto: '🛍️ Comprar do produtor', pagina: 'produtos' },
      { texto: '👨‍🌾 Produtores', pagina: 'produtores' }
    ]
  }[usuarioAtual.tipo]

  document.getElementById('acoes-painel').innerHTML = acoes.map(a =>
    `<a href="#" data-pagina="${a.pagina}" class="btn btn-secundario" style="display:block; margin:8px 0; text-align:left">${a.texto}</a>`
  ).join('')

  const areaPerguntas = document.getElementById('minhas-perguntas')
  if (minhasPerguntas.length === 0) {
    areaPerguntas.innerHTML = '<p>Você ainda não fez perguntas. Abra a vitrine de um produtor para conversar.</p>'
  } else {
    areaPerguntas.innerHTML = minhasPerguntas.map(q => `
      <div class="proposta-item">
        <p><strong>${q.produtor}</strong> · ${q.assunto}</p>
        <p class="pergunta-texto">“${escaparHtml(q.texto)}”</p>
        ${q.resposta
          ? `<p class="resposta-produtor"><strong>Resposta:</strong> ${q.resposta}</p>`
          : '<p class="status-pendente">Aguardando resposta…</p>'}
      </div>
    `).join('')
  }

  if (minhasPropostas.length === 0) {
    document.getElementById('minhas-propostas').innerHTML = '<p>Você ainda não enviou nenhuma proposta.</p>'
  } else {
    document.getElementById('minhas-propostas').innerHTML = minhasPropostas.map(p => `
      <div class="proposta-item">
        <p><strong>${p.produto}</strong> · ${p.produtor || ''}</p>
        <p>Quantidade: ${p.quantidade} · ${moeda(p.valorUnit)}/unidade · Total ${moeda(p.total || 0)}</p>
        <p>Entrega: ${p.data}</p>
        <p class="${p.status === 'Recusada' ? 'status-recusado' : p.status === 'Pendente' ? 'status-pendente' : 'status-aceito'}">Status: ${p.status}</p>
      </div>
    `).join('')
  }
}

// ==============================================
// CABEÇALHO — ATUALIZA APÓS LOGIN/CADASTRO
// ==============================================
function atualizarCabecalho() {
  const area = document.getElementById('area-usuario')
  if (!area) return

  if (usuarioAtual) {
    area.innerHTML = `
      <span class="nome-usuario">${usuarioAtual.nome}</span>
      <a href="#" data-pagina="painel" class="btn btn-secundario">Meu Painel</a>
      <button id="btn-sair" class="btn btn-perigo">Sair</button>
    `
    // Evento de sair
    document.getElementById('btn-sair').addEventListener('click', () => {
      usuarioAtual = null
      minhasPropostas = []
      minhasPerguntas = []
      precosLojaVisiveis = false
      produtoSelecionado = null
      atualizarCabecalho()
      mostrarModal('Desconectado', 'Você saiu da conta.')
      setTimeout(() => navegarPara('inicio'), 1500)
    })
  } else {
    area.innerHTML = `
      <a href="#" data-pagina="entrar" class="btn btn-secundario">Entrar</a>
      <a href="#" data-pagina="cadastrar" class="btn btn-primario">Criar conta</a>
    `
  }
}

function escaparHtml(texto) {
  const div = document.createElement('div')
  div.textContent = texto
  return div.innerHTML
}

// ==============================================
// MODAL DE MENSAGENS
// ==============================================
function mostrarModal(titulo, texto) {
  const modal = document.getElementById('modal-mensagem')
  document.getElementById('modal-titulo').textContent = titulo
  document.getElementById('modal-texto').textContent = texto
  modal.classList.remove('oculto')
}

document.getElementById('modal-fechar').addEventListener('click', () => {
  document.getElementById('modal-mensagem').classList.add('oculto')
})

// ==============================================
// INICIALIZAÇÃO
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  navegarPara('inicio')
  console.log('%c🌾 AgroEncomenda', 'font-size: 18px; font-weight: bold; color: #2c6e49;')
  console.log('Sistema carregado! Botões de login e cadastro funcionando ✅')
})