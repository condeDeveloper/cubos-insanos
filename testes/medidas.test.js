// Os numeros do README presos. Se o codigo mudar e um numero mudar, quebra.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dominio, confronto } from '../js/medidas.js'

test('3 cubos e 3 cores: 30.856 conjuntos, 6.789 resolvem, 477 com solucao unica', () => {
  const d = dominio('tres')
  assert.equal(d.total, 30856)
  assert.equal(d.resolvem, 6789)
  assert.equal(d.unicas, 477)
  assert.equal(d.menor, 1)
  assert.equal(d.maior, 108)
  assert.equal(d.posicoes, 1489488)
})

test('o quebra-cabeca de 4 cubos com 6 faces de cada cor: 35,32% resolvem, e NENHUM com solucao unica', () => {
  const d = dominio('quebra')
  assert.equal(d.total, 10939)
  assert.equal(d.resolvem, 3864)
  assert.equal(d.unicas, 0)
  assert.equal(d.menor, 3)
  assert.equal(d.maior, 120)
  assert.equal(d.todasMultiplasDe3, true)
  assert.deepEqual(d.hist.slice(0, 3), [[3, 1817], [6, 1422], [9, 102]])
})

test('achar a primeira solucao custa 10,57% de contar todas, nos conjuntos do quebra-cabeca que resolvem', () => {
  const d = dominio('quebra')
  assert.equal(d.nosTodasResolvem, 344372)
  assert.equal(d.nosUmaResolvem, 36395)
})

test('a geometria concorda com o grafo em todo conjunto de 3 cubos, com ou sem espelho', () => {
  assert.deepEqual(confronto('tres'), { total: 30856, dif: 0, posicoes: 1489488 })
  assert.deepEqual(confronto('tres', true), { total: 30856, dif: 0, posicoes: 1489488 })
})
