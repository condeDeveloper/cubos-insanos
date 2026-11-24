// O juiz. Nao importa nada do nucleo e nao sabe nada de pares nem de grafos.
//
// Aqui um cubo e o que ele e: seis faces pintadas, nas direcoes +x, -x, +y,
// -y, +z, -z. As 24 rotacoes saem das 48 matrizes de permutacao com sinal,
// ficando as de determinante +1. A pilha e vertical (eixo z), e os quatro
// lados sao +x, -x, +y e -y. O juiz tenta as 24^n posicoes da pilha, com
// poda: um cubo so entra se nao repetir cor em nenhum dos quatro lados.
//
// Se a reducao do nucleo (um cubo = tres pares opostos, e a solucao = dois
// subgrafos 2-regulares) estiver errada em qualquer ponto, a contagem daqui
// discorda.

function permutacoes (v) {
  if (v.length <= 1) return [v]
  const r = []
  v.forEach((x, i) => { for (const p of permutacoes([...v.slice(0, i), ...v.slice(i + 1)])) r.push([x, ...p]) })
  return r
}

// As matrizes como "a coordenada i da imagem e sinal[i] * coordenada perm[i]".
function rotacoes () {
  const r = []
  for (const p of permutacoes([0, 1, 2])) {
    // paridade da permutacao
    let inv = 0
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (p[i] > p[j]) inv++
    for (let s = 0; s < 8; s++) {
      const sinal = [s & 1 ? -1 : 1, s & 2 ? -1 : 1, s & 4 ? -1 : 1]
      const det = (inv % 2 ? -1 : 1) * sinal[0] * sinal[1] * sinal[2]
      if (det === 1) r.push({ p, sinal })
    }
  }
  return r
}

export const ROTACOES = rotacoes()

// Direcoes: 0 +x, 1 -x, 2 +y, 3 -y, 4 +z, 5 -z.
const VETOR = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
function direcao (v) { return VETOR.findIndex((u) => u[0] === v[0] && u[1] === v[1] && u[2] === v[2]) }

// Para cada rotacao, de qual face original vem a face que fica virada para
// cada direcao.
function tabelaDeFaces () {
  return ROTACOES.map(({ p, sinal }) => {
    const destino = VETOR.map((v) => direcao([sinal[0] * v[p[0]], sinal[1] * v[p[1]], sinal[2] * v[p[2]]]))
    const origem = new Array(6)
    destino.forEach((d, f) => { origem[d] = f })
    return origem
  })
}
const FACES = tabelaDeFaces()

// As 24 vistas de um cubo pintado: [frente(+x), tras(-x), direita(+y), esquerda(-y)].
export function vistas (faces) {
  const vs = FACES.map((o) => [faces[o[0]], faces[o[1]], faces[o[2]], faces[o[3]]])
  return vs
}

// Conta as posicoes da pilha que resolvem. cubos = lista de 6 cores por cubo.
// `lados` existe so para o controle negativo: com 3 lados conferidos em vez de
// 4, o juiz tem de DISCORDAR do nucleo, senao ele nao esta medindo nada.
export function contaNaForca (cubos, n = cubos.length, lados = 4) {
  const vs = cubos.map(vistas)
  const usado = [new Array(n).fill(false), new Array(n).fill(false), new Array(n).fill(false), new Array(n).fill(false)]
  let total = 0
  function vai (i) {
    if (i === cubos.length) { total++; return }
    for (const v of vs[i]) {
      let repete = false
      for (let s = 0; s < lados; s++) if (usado[s][v[s]]) repete = true
      if (repete) continue
      for (let s = 0; s < lados; s++) usado[s][v[s]] = true
      vai(i + 1)
      for (let s = 0; s < lados; s++) usado[s][v[s]] = false
    }
  }
  vai(0)
  return total
}

// Pinta um cubo a partir dos tres pares opostos: o par 0 em +x/-x, o 1 em
// +y/-y, o 2 em +z/-z. O espelho troca as duas faces do primeiro par, que e
// uma reflexao: o cubo espelhado em geral NAO e uma rotacao do original.
export function pinta (pares, espelho = false) {
  const [a, b, c] = pares
  return espelho ? [a[1], a[0], b[0], b[1], c[0], c[1]] : [a[0], a[1], b[0], b[1], c[0], c[1]]
}

// O cubo depois da rotacao r: as seis faces nas direcoes +x, -x, +y, -y, +z, -z.
export function orienta (faces, r) {
  return FACES[r].map((o) => faces[o])
}
