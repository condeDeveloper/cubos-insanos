import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pares, tipos, solucoes, temSolucao, contagem, conjuntos, usaTodasAsCores, umaSolucao } from '../js/insanidade.js'
import { ROTACOES, vistas, pinta, orienta, contaNaForca } from '../js/juiz.js'

test('4 cores: 10 pares e 220 tipos de cubo; 3 cores: 6 pares e 56 tipos', () => {
  assert.equal(pares(4).length, 10)
  assert.equal(tipos(4).length, 220)
  assert.equal(pares(3).length, 6)
  assert.equal(tipos(3).length, 56)
})

test('52 tipos de cubo mostram as 4 cores', () => {
  assert.equal(tipos(4).filter(usaTodasAsCores(4)).length, 52)
})

test('as 24 rotacoes sao 24 vistas diferentes de um cubo de seis cores', () => {
  assert.equal(ROTACOES.length, 24)
  assert.equal(new Set(vistas([0, 1, 2, 3, 4, 5]).map(String)).size, 24)
  // e cada rotacao leva o cubo inteiro, sem perder face
  for (let r = 0; r < 24; r++) assert.deepEqual(orienta([0, 1, 2, 3, 4, 5], r).slice().sort(), [0, 1, 2, 3, 4, 5])
})

test('a rotacao preserva os pares opostos: so troca de eixo e de lado', () => {
  const faces = [0, 1, 2, 3, 4, 5]
  for (let r = 0; r < 24; r++) {
    const o = orienta(faces, r)
    const ps = [[o[0], o[1]], [o[2], o[3]], [o[4], o[5]]].map((p) => p.slice().sort().join()).sort()
    assert.deepEqual(ps, ['0,1', '2,3', '4,5'])
  }
})

test('o espelho nao e rotacao: nenhuma das 24 vistas do cubo espelhado e uma vista do original', () => {
  const orig = new Set(ROTACOES.map((_, r) => orienta([0, 1, 2, 3, 4, 5], r).join()))
  const esp = pinta([[0, 1], [2, 3], [4, 5]], true)
  for (let r = 0; r < 24; r++) assert.ok(!orig.has(orienta(esp, r).join()))
})

test('quatro cubos de uma cor so cada, cores diferentes, resolvem em TODAS as 24^4 posicoes', () => {
  // eu tinha escrito que nao resolviam; resolvem de qualquer jeito, porque
  // cada lado da pilha mostra as quatro cores
  const cs = [0, 1, 2, 3].map((c) => [[c, c], [c, c], [c, c]])
  assert.equal(solucoes(cs).total, 24 ** 4)
  assert.equal(contaNaForca(cs.map((p) => pinta(p))), 24 ** 4)
})

test('dois cubos inteiros da mesma cor nunca resolvem', () => {
  const cs = [[[0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0]], [[1, 2], [2, 3], [3, 1]], [[1, 2], [2, 3], [3, 1]]]
  assert.equal(solucoes(cs).total, 0)
  assert.equal(temSolucao(cs).tem, false)
})

test('um conjunto que resolve conta as mesmas posicoes pelo grafo e pela forca', () => {
  const cs = [[[0, 0], [0, 1], [2, 3]], [[0, 0], [0, 1], [2, 3]], [[0, 0], [1, 2], [3, 3]], [[0, 3], [1, 1], [2, 2]]]
  const r = solucoes(cs)
  assert.equal(r.total, contaNaForca(cs.map((p) => pinta(p))))
  assert.equal(r.escolhas, 2)
})

test('o total de posicoes e sempre multiplo de 8: girar a pilha e tombar a pilha', () => {
  let n = 0
  for (const cs of conjuntos(3)) {
    assert.equal(solucoes(cs).total % 8, 0)
    if (++n > 3000) break
  }
})

test('a geracao com teto nao perde conjunto: confere contra gerar tudo e filtrar', () => {
  let a = 0
  for (const cs of conjuntos(3)) if (contagem(cs, 3).every((x) => x === 6)) a++
  let b = 0
  for (const cs of conjuntos(3, { teto: 6, exato: true })) { b++; assert.deepEqual(contagem(cs, 3), [6, 6, 6]) }
  assert.equal(a, b)
  assert.ok(a > 0)
})

test('umaSolucao devolve uma pilha com as quatro cores em cada lado', () => {
  const cs = [[[0, 0], [0, 1], [2, 3]], [[0, 1], [1, 1], [2, 3]], [[0, 2], [1, 3], [2, 2]], [[0, 3], [1, 2], [3, 3]]]
  const p = umaSolucao(cs)
  for (const lado of ['frente', 'tras', 'esquerda', 'direita']) assert.equal(new Set(p.map((c) => c[lado])).size, 4)
})

test('umaSolucao devolve null quando nao ha solucao', () => {
  const cs = [[[0, 0], [0, 1], [2, 3]], [[0, 1], [1, 1], [2, 3]], [[0, 1], [2, 2], [2, 3]], [[0, 2], [1, 3], [3, 3]]]
  assert.equal(umaSolucao(cs), null)
})

test('os tres giros da pagina sao rotacoes de verdade e voltam ao comeco em quatro', async () => {
  const { girar, tombar, rolar } = await import('../js/pilha.js')
  const base = [0, 1, 2, 3, 4, 5]
  const vs = new Set(ROTACOES.map((_, r) => orienta(base, r).join()))
  for (const g of [girar, tombar, rolar]) {
    assert.ok(vs.has(g(base).join()))
    assert.notDeepEqual(g(base), base)
    assert.deepEqual(g(g(g(g(base)))), base)
  }
})

test('os exemplos da pagina tem 1, 3 e 0 solucoes, e a pilha resolvida resolve', async () => {
  const { EXEMPLOS, pilhaResolvida, resolvida } = await import('../js/pilha.js')
  assert.equal(solucoes(EXEMPLOS.unica).escolhas / 2, 1)
  assert.equal(solucoes(EXEMPLOS.tres).escolhas / 2, 3)
  assert.equal(solucoes(EXEMPLOS.impossivel).escolhas, 0)
  for (const k of ['unica', 'tres']) {
    const p = pilhaResolvida(EXEMPLOS[k])
    assert.ok(p.every((c) => c !== null))
    assert.ok(resolvida(p))
  }
  assert.equal(pilhaResolvida(EXEMPLOS.impossivel), null)
})
