// A geometria contra o grafo nos dominios grandes, e o controle negativo.
// Uns tres minutos juntos: roda UMA vez, no job das tabelas, e nao nos nove
// da matriz.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { confronto } from '../js/medidas.js'

const T = { timeout: 1800000 }

test('a geometria concorda com o grafo nos 10.939 conjuntos do quebra-cabeca, com ou sem espelho', T, () => {
  assert.deepEqual(confronto('quebra'), { total: 10939, dif: 0, posicoes: 672048 })
  assert.deepEqual(confronto('quebra', true), { total: 10939, dif: 0, posicoes: 672048 })
})

test('controle negativo: o juiz olhando so 3 lados discorda', T, () => {
  assert.equal(confronto('tres', false, 3).dif, 19087)
  assert.equal(confronto('quebra', false, 3).dif, 10644)
})

test('a geometria concorda com o grafo nos 341.055 conjuntos com as 4 cores em cada cubo', T, () => {
  const c = confronto('cores')
  assert.equal(c.total, 341055)
  assert.equal(c.dif, 0)
  assert.equal(c.posicoes, 10819248)
})
