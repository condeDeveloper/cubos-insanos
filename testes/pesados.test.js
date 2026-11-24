// Os dois dominios de centenas de milhares de conjuntos. Meio minuto cada.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dominio } from '../js/medidas.js'

const T = { timeout: 900000 }

test('6 faces de cada cor, qualquer cubo: 476.919 conjuntos, 28,03% resolvem, e as solucoes vem sempre de 3 em 3', T, () => {
  const d = dominio('seis')
  assert.equal(d.total, 476919)
  assert.equal(d.resolvem, 133691)
  assert.equal(d.unicas, 0)
  assert.equal(d.menor, 3)
  assert.equal(d.maior, 648)
  assert.equal(d.todasMultiplasDe3, true)
  assert.equal(d.nosTodasResolvem, 13037943)
  assert.equal(d.nosUmaResolvem, 958418)
})

test('cada cubo com as 4 cores, qualquer contagem: 341.055 conjuntos, 47,35% resolvem, 50.346 com solucao unica', T, () => {
  const d = dominio('cores')
  assert.equal(d.total, 341055)
  assert.equal(d.resolvem, 161490)
  assert.equal(d.unicas, 50346)
  assert.equal(d.menor, 1)
  assert.equal(d.maior, 120)
  assert.equal(d.todasMultiplasDe3, false)
})
