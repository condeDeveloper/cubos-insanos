// As tabelas do README, uma funcao por tabela. O medidor imprime, os testes
// prendem.

import { conjuntos, solucoes, temSolucao, usaTodasAsCores } from './insanidade.js'
import { contaNaForca, pinta } from './juiz.js'

// Os dominios varridos.
//   tres    3 cubos, 3 cores, todos os conjuntos
//   quebra  4 cubos, cada cubo com as 4 cores, 6 faces de cada cor no total
//   seis    4 cubos, 6 faces de cada cor no total, qualquer cubo
//   cores   4 cubos, cada cubo com as 4 cores, qualquer contagem
export const DOMINIOS = {
  tres: () => conjuntos(3),
  quebra: () => conjuntos(4, { filtroTipo: usaTodasAsCores(4), teto: 6, exato: true }),
  seis: () => conjuntos(4, { teto: 6, exato: true }),
  cores: () => conjuntos(4, { filtroTipo: usaTodasAsCores(4) })
}

const memo = new Map()

// Quantos conjuntos tem solucao, e quantas solucoes essencialmente diferentes
// cada um tem. Uma solucao essencialmente diferente e um par de subgrafos
// {frente/tras, esquerda/direita}: o numero de escolhas de eixos dividido por
// 2, porque trocar os dois papeis e girar a pilha 90 graus. As 2^(ciclos)
// viradas de cada ciclo tambem nao contam como solucao nova.
export function dominio (nome) {
  if (memo.has(nome)) return memo.get(nome)
  let total = 0
  let resolvem = 0
  let nosTodas = 0
  let nosUma = 0
  let nosUmaResolvem = 0
  let nosTodasResolvem = 0
  let posicoes = 0
  const hist = new Map()
  for (const cs of DOMINIOS[nome]()) {
    total++
    const r = solucoes(cs)
    const u = temSolucao(cs)
    nosTodas += r.nos
    nosUma += u.nos
    posicoes += r.total
    if (r.escolhas) {
      resolvem++
      nosTodasResolvem += r.nos
      nosUmaResolvem += u.nos
      const e = r.escolhas / 2
      hist.set(e, (hist.get(e) || 0) + 1)
    }
  }
  const chaves = [...hist.keys()].sort((a, b) => a - b)
  const res = {
    total,
    resolvem,
    unicas: hist.get(1) || 0,
    menor: chaves[0],
    maior: chaves[chaves.length - 1],
    todasMultiplasDe3: chaves.every((k) => k % 3 === 0),
    hist: chaves.map((k) => [k, hist.get(k)]),
    posicoes,
    nosTodas,
    nosUma,
    nosTodasResolvem,
    nosUmaResolvem
  }
  memo.set(nome, res)
  return res
}

// O juiz contra o nucleo: para cada conjunto do dominio, as posicoes fisicas
// contadas pela geometria contra as contadas pelo grafo. Com espelho, metade
// dos cubos entra espelhada (reflexao, que nao e rotacao) e a conta tem de dar
// igual do mesmo jeito.
export function confronto (nome, espelho = false, lados = 4) {
  let total = 0
  let dif = 0
  let posicoes = 0
  for (const cs of DOMINIOS[nome]()) {
    total++
    const a = solucoes(cs).total
    const b = contaNaForca(cs.map((p, i) => pinta(p, espelho && i % 2 === 0)), cs.length, lados)
    posicoes += b
    if (a !== b) dif++
  }
  return { total, dif, posicoes }
}
