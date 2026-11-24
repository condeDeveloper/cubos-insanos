#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js            as tabelas rapidas (tres e quebra)
//   node ferramentas/medidor.js tres       3 cubos, 3 cores, todos os conjuntos
//   node ferramentas/medidor.js quebra     4 cubos com as 4 cores cada, 6 de cada cor
//   node ferramentas/medidor.js seis       4 cubos quaisquer, 6 de cada cor (meio minuto)
//   node ferramentas/medidor.js cores      4 cubos com as 4 cores cada, qualquer contagem
//   node ferramentas/medidor.js juiz       a geometria contra o grafo nos dominios rapidos
//   node ferramentas/medidor.js juizcores  idem no dominio "cores" (uns dois minutos)

import { dominio, confronto } from '../js/medidas.js'

const n = (x) => x.toLocaleString('pt-BR')
const pc = (a, b) => (100 * a / b).toFixed(2).replace('.', ',') + '%'

const NOMES = {
  tres: '3 cubos, 3 cores, todos os conjuntos',
  quebra: '4 cubos, cada um com as 4 cores, 6 faces de cada cor',
  seis: '4 cubos quaisquer, 6 faces de cada cor',
  cores: '4 cubos, cada um com as 4 cores, qualquer contagem'
}

function tDominio (nome) {
  const d = dominio(nome)
  console.log(`\n== ${NOMES[nome]} ==`)
  console.log(`  conjuntos            ${n(d.total)}`)
  console.log(`  com solucao          ${n(d.resolvem)} (${pc(d.resolvem, d.total)})`)
  console.log(`  solucao unica        ${n(d.unicas)} (${pc(d.unicas, d.resolvem)} dos que tem)`)
  console.log(`  solucoes por conjunto: de ${d.menor} a ${d.maior}; todas multiplas de 3? ${d.todasMultiplasDe3 ? 'sim' : 'nao'}`)
  console.log(`  as mais comuns: ${d.hist.slice().sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} (${n(v)})`).join(', ')}`)
  console.log(`  posicoes fisicas que resolvem, somadas: ${n(d.posicoes)}`)
  console.log(`  nos da busca: contar todas ${n(d.nosTodas)}, parar na primeira ${n(d.nosUma)} (${pc(d.nosUma, d.nosTodas)})`)
  console.log(`  so nos conjuntos com solucao: ${n(d.nosTodasResolvem)} contra ${n(d.nosUmaResolvem)} (${pc(d.nosUmaResolvem, d.nosTodasResolvem)})`)
}

function tJuiz (nomes) {
  console.log('\n== a geometria (24 rotacoes, 24^n posicoes) contra o grafo ==')
  for (const nome of nomes) {
    for (const espelho of [false, true]) {
      const c = confronto(nome, espelho)
      console.log(`  ${nome.padEnd(6)} ${espelho ? 'metade espelhada' : 'cubos como sao '}: ${n(c.total)} conjuntos, ${n(c.posicoes)} posicoes, ${c.dif} divergencias`)
    }
    const c = confronto(nome, false, 3)
    console.log(`  ${nome.padEnd(6)} controle, juiz olhando so 3 lados: ${n(c.total)} conjuntos, ${n(c.dif)} divergencias`)
  }
}

const tabelas = {
  tres: () => tDominio('tres'),
  quebra: () => tDominio('quebra'),
  seis: () => tDominio('seis'),
  cores: () => tDominio('cores'),
  juiz: () => tJuiz(['tres', 'quebra']),
  juizcores: () => tJuiz(['cores'])
}
const pedidas = process.argv.slice(2)
for (const k of pedidas.length ? pedidas : ['tres', 'quebra', 'juiz']) {
  if (!tabelas[k]) { console.error('tabela desconhecida: ' + k); process.exit(1) }
  tabelas[k]()
}
