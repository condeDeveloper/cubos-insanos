// O nucleo dos Cubos da Insanidade. ESM puro, sem DOM.
//
// O quebra-cabeca: n cubos com as faces pintadas de n cores. Empilhar os n
// cubos numa coluna de modo que cada um dos quatro lados da coluna (frente,
// tras, esquerda, direita) mostre as n cores, cada uma uma vez. O classico e
// com 4 cubos e 4 cores.
//
// A observacao que faz tudo caber: para o quebra-cabeca, um cubo e so os seus
// TRES PARES DE FACES OPOSTAS. Na coluna, um par vira frente/tras, outro vira
// esquerda/direita, e o terceiro fica em cima/embaixo, onde ninguem ve. E as 24
// rotacoes do cubo realizam QUALQUER escolha: qual par vai para frente/tras
// (3), qual dos outros dois vai para esquerda/direita (2), e de que lado fica
// cada face de cada par (2 x 2). 3 x 2 x 2 x 2 = 24, todas as rotacoes, sem
// sobrar nenhuma. Entao um cubo e um multiconjunto de 3 pares de cores, e dois
// cubos espelhados sao o mesmo cubo para o jogo. O juiz confere isso com a
// geometria de verdade.
//
// Com isso o problema vira grafo: as cores sao vertices e cada par e uma
// aresta. Uma pilha resolvida escolhe, de cada cubo, uma aresta para
// frente/tras e outra para esquerda/direita, e cada um dos dois conjuntos de
// arestas tem de passar duas vezes por cada cor (uma na frente, outra atras).
// Isso e um subgrafo 2-regular: uma uniao de ciclos.

// Os pares de n cores, {a, b} com a <= b.
export function pares (n) {
  const r = []
  for (let a = 0; a < n; a++) for (let b = a; b < n; b++) r.push([a, b])
  return r
}

// Os tipos de cubo: multiconjuntos de 3 pares.
export function tipos (n) {
  const ps = pares(n)
  const r = []
  for (let i = 0; i < ps.length; i++) for (let j = i; j < ps.length; j++) for (let k = j; k < ps.length; k++) r.push([ps[i], ps[j], ps[k]])
  return r
}

// As 6 escolhas de eixos de um cubo: [par da frente/tras, par da esquerda/direita].
const EIXOS = [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]

// Quantas componentes tem o grafo das arestas escolhidas. Cada componente de
// um grafo 2-regular e um ciclo, e um ciclo (mesmo de uma aresta so, o laco
// {a, a}, ou de duas, o par repetido) tem exatamente 2 jeitos de ser orientado
// com cada cor uma vez na frente: um sentido ou o outro. No laco os dois
// "sentidos" sao as duas faces de mesma cor trocando de lugar, que sao duas
// posicoes fisicas diferentes do cubo.
function componentes (arestas, n) {
  const pai = Array.from({ length: n }, (_, i) => i)
  const acha = (x) => { while (pai[x] !== x) { pai[x] = pai[pai[x]]; x = pai[x] } return x }
  let c = n
  for (const [a, b] of arestas) {
    const ra = acha(a)
    const rb = acha(b)
    if (ra !== rb) { pai[ra] = rb; c-- }
  }
  return c
}

// Quantas posicoes fisicas da pilha resolvem o conjunto. Cada cubo tem 24
// posicoes, entao o total vai de 0 a 24^n. Devolve tambem quantas escolhas de
// eixos funcionam, antes de multiplicar pelas orientacoes.
export function solucoes (cubos, n = cubos.length) {
  const k = cubos.length
  const grauF = new Array(n).fill(0)
  const grauL = new Array(n).fill(0)
  const F = []
  const Lr = []
  let total = 0
  let escolhas = 0
  let nos = 0
  function vai (i) {
    nos++
    if (i === k) {
      escolhas++
      total += 2 ** (componentes(F, n) + componentes(Lr, n))
      return
    }
    for (const [f, l] of EIXOS) {
      const pf = cubos[i][f]
      const pl = cubos[i][l]
      grauF[pf[0]]++; grauF[pf[1]]++
      grauL[pl[0]]++; grauL[pl[1]]++
      if (grauF[pf[0]] <= 2 && grauF[pf[1]] <= 2 && grauL[pl[0]] <= 2 && grauL[pl[1]] <= 2) {
        F.push(pf); Lr.push(pl)
        vai(i + 1)
        F.pop(); Lr.pop()
      }
      grauF[pf[0]]--; grauF[pf[1]]--
      grauL[pl[0]]--; grauL[pl[1]]--
    }
  }
  vai(0)
  return { total, escolhas, nos }
}

// So responde se tem solucao, parando na primeira. Serve para medir quanto
// custa ACHAR uma contra contar todas.
export function temSolucao (cubos, n = cubos.length) {
  const k = cubos.length
  const grauF = new Array(n).fill(0)
  const grauL = new Array(n).fill(0)
  let nos = 0
  function vai (i) {
    nos++
    if (i === k) return true
    for (const [f, l] of EIXOS) {
      const pf = cubos[i][f]
      const pl = cubos[i][l]
      grauF[pf[0]]++; grauF[pf[1]]++
      grauL[pl[0]]++; grauL[pl[1]]++
      const ok = grauF[pf[0]] <= 2 && grauF[pf[1]] <= 2 && grauL[pl[0]] <= 2 && grauL[pl[1]] <= 2 && vai(i + 1)
      grauF[pf[0]]--; grauF[pf[1]]--
      grauL[pl[0]]--; grauL[pl[1]]--
      if (ok) return true
    }
    return false
  }
  const r = vai(0)
  return { tem: r, nos }
}

// Quantas vezes cada cor aparece no conjunto.
export function contagem (cubos, n) {
  const c = new Array(n).fill(0)
  for (const t of cubos) for (const [a, b] of t) { c[a]++; c[b]++ }
  return c
}

// Os conjuntos de n cubos (multiconjuntos de tipos). `filtroTipo` escolhe que
// cubos entram. `teto`, se vier, e o maximo de faces de cada cor no conjunto
// inteiro: a geracao poda assim que uma cor passa do teto, em vez de gerar
// tudo e filtrar depois (gerar os 101 milhoes de conjuntos de 4 cubos para
// ficar com meio milhao custava 100 s).
export function * conjuntos (n, { filtroTipo = () => true, teto = Infinity, exato = false } = {}) {
  const ts = tipos(n).filter(filtroTipo)
  const cont = ts.map((t) => contagem([t], n))
  const soma = new Array(n).fill(0)
  const idx = new Array(n).fill(0)
  function * vai (i, de) {
    if (i === n) {
      if (exato && soma.some((x) => x !== teto)) return
      yield idx.map((j) => ts[j])
      return
    }
    for (let j = de; j < ts.length; j++) {
      let ok = true
      for (let c = 0; c < n; c++) { soma[c] += cont[j][c]; if (soma[c] > teto) ok = false }
      if (ok) { idx[i] = j; yield * vai(i + 1, j) }
      for (let c = 0; c < n; c++) soma[c] -= cont[j][c]
    }
  }
  yield * vai(0, 0)
}

// Filtros dos dominios medidos.
export const usaTodasAsCores = (n) => (t) => new Set(t.flat()).size === n

// A pilha resolvida em si, para a pagina: para cada cubo, [par da frente/tras
// orientado, par da esquerda/direita orientado], ou null se nao tem solucao.
export function umaSolucao (cubos, n = cubos.length) {
  const k = cubos.length
  const esc = []
  function vai (i) {
    if (i === k) return orienta()
    for (const [f, l] of EIXOS) {
      esc.push([f, l])
      const r = vai(i + 1)
      if (r) return r
      esc.pop()
    }
    return null
  }
  // tenta todas as viradas dos pares escolhidos ate cada lado ter as n cores
  function orienta () {
    for (let m = 0; m < 4 ** k; m++) {
      const lados = [new Set(), new Set(), new Set(), new Set()]
      const pilha = []
      let x = m
      for (let i = 0; i < k; i++) {
        const [f, l] = esc[i]
        const vf = x & 1
        const vl = (x >> 1) & 1
        x >>= 2
        const pf = vf ? [cubos[i][f][1], cubos[i][f][0]] : cubos[i][f]
        const pl = vl ? [cubos[i][l][1], cubos[i][l][0]] : cubos[i][l]
        lados[0].add(pf[0]); lados[1].add(pf[1]); lados[2].add(pl[0]); lados[3].add(pl[1])
        pilha.push({ frente: pf[0], tras: pf[1], esquerda: pl[0], direita: pl[1], cima: cubos[i][3 - f - l] })
      }
      if (lados.every((s) => s.size === n)) return pilha
    }
    return null
  }
  return vai(0)
}
