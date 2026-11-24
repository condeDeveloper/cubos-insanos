// A pilha da pagina, sem DOM: os tres giros de um cubo, os conjuntos de
// exemplo e a conferencia dos quatro lados. Os testes conferem que cada giro e
// uma das 24 rotacoes e que quatro giros voltam ao comeco.
//
// As faces vem na ordem das direcoes: +x (frente), -x (tras), +y (direita),
// -y (esquerda), +z (cima), -z (baixo).

import { umaSolucao } from './insanidade.js'
import { pinta, orienta, ROTACOES } from './juiz.js'

// Girar em pe (eixo vertical), tombar para a frente (eixo esquerda-direita) e
// rolar de lado (eixo frente-tras), sempre um quarto de volta.
export const girar = (o) => [o[3], o[2], o[0], o[1], o[4], o[5]]
export const tombar = (o) => [o[4], o[5], o[2], o[3], o[1], o[0]]
export const rolar = (o) => [o[0], o[1], o[5], o[4], o[2], o[3]]

// Os tres conjuntos da pagina, achados pela varredura (o teste confere o
// numero de solucoes de cada um).
export const EXEMPLOS = {
  unica: [[[0, 0], [0, 1], [2, 3]], [[0, 0], [0, 1], [2, 3]], [[0, 0], [1, 2], [3, 3]], [[0, 3], [1, 1], [2, 2]]],
  tres: [[[0, 0], [0, 1], [2, 3]], [[0, 1], [1, 1], [2, 3]], [[0, 2], [1, 3], [2, 2]], [[0, 3], [1, 2], [3, 3]]],
  impossivel: [[[0, 0], [0, 1], [2, 3]], [[0, 1], [1, 1], [2, 3]], [[0, 1], [2, 2], [2, 3]], [[0, 2], [1, 3], [3, 3]]]
}

// Os quatro lados da pilha: frente, direita, tras, esquerda.
export function lados (pilha) {
  return [0, 2, 1, 3].map((d) => pilha.map((faces) => faces[d]))
}

export function resolvida (pilha) {
  return lados(pilha).every((l) => new Set(l).size === pilha.length)
}

// A pilha resolvida com cubos de verdade: para cada cubo, a rotacao do cubo
// pintado que poe na frente, atras, a direita e a esquerda as cores que o
// nucleo escolheu. Uma rotacao, e nao um cubo repintado: o cubo espelhado
// tambem resolveria, mas nao seria o cubo que esta na mesa.
export function pilhaResolvida (conjunto) {
  const s = umaSolucao(conjunto)
  if (!s) return null
  return conjunto.map((pares, i) => {
    const base = pinta(pares)
    for (let r = 0; r < ROTACOES.length; r++) {
      const o = orienta(base, r)
      if (o[0] === s[i].frente && o[1] === s[i].tras && o[2] === s[i].direita && o[3] === s[i].esquerda) return o
    }
    return null
  })
}
