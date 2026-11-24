// A pagina: so desenho e clique. Os giros, os exemplos e a solucao vem de
// pilha.js, que os testes conferem.

import { pinta } from './juiz.js'
import { girar, tombar, rolar, EXEMPLOS, lados, resolvida, pilhaResolvida } from './pilha.js'

const NOMES = ['vermelho', 'verde', 'amarelo', 'azul']
const elPilha = document.getElementById('pilha')
const elEstado = document.getElementById('estado')
const elConj = document.getElementById('conjunto')

let pilha

function comeca () {
  pilha = EXEMPLOS[elConj.value].map((p) => pinta(p))
  desenha()
}

function quadrado (cor, rotulo) {
  const s = document.createElement('span')
  s.className = 'face c' + cor
  s.title = rotulo + ': ' + NOMES[cor]
  return s
}

function desenha () {
  elPilha.innerHTML = ''
  const ls = lados(pilha)
  const ruins = ls.map((l) => new Set(l).size < pilha.length)
  pilha.forEach((faces, i) => {
    const linha = document.createElement('div')
    linha.className = 'cubo'
    const rot = document.createElement('span')
    rot.className = 'num'
    rot.textContent = i + 1
    linha.appendChild(rot)
    const vis = document.createElement('div')
    vis.className = 'faces'
    ;[[0, 'frente'], [2, 'direita'], [1, 'fundo'], [3, 'esquerda']].forEach(([d, r], k) => {
      const q = quadrado(faces[d], r)
      if (ruins[k]) q.classList.add('ruim')
      vis.appendChild(q)
    })
    const topo = quadrado(faces[4], 'cima')
    topo.classList.add('topo')
    vis.appendChild(topo)
    linha.appendChild(vis)
    for (const [txt, f, nome] of [['↻', girar, 'girar em pé'], ['⤓', tombar, 'tombar para a frente'], ['⇆', rolar, 'rolar de lado']]) {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = txt
      b.setAttribute('aria-label', `${nome}, cubo ${i + 1}`)
      b.addEventListener('click', () => { pilha[i] = f(pilha[i]); desenha() })
      linha.appendChild(b)
    }
    elPilha.appendChild(linha)
  })
  const cab = document.createElement('div')
  cab.className = 'cubo rotulos'
  cab.innerHTML = '<span class="num"></span><div class="faces"><em>frente</em><em>dir.</em><em>fundo</em><em>esq.</em><em>cima</em></div>'
  elPilha.prepend(cab)
  if (resolvida(pilha)) {
    elEstado.innerHTML = '<span class="ok">Resolvida.</span> Os quatro lados mostram as quatro cores.'
  } else {
    const k = ruins.filter(Boolean).length
    elEstado.textContent = `${k} ${k === 1 ? 'lado repete' : 'lados repetem'} cor.`
  }
}

function embaralha () {
  pilha = pilha.map((c) => {
    let o = c
    const n = Math.floor(Math.random() * 12)
    for (let i = 0; i < n; i++) o = [girar, tombar, rolar][Math.floor(Math.random() * 3)](o)
    return o
  })
  desenha()
}

function resolve () {
  const p = pilhaResolvida(EXEMPLOS[elConj.value])
  if (!p) {
    elEstado.innerHTML = '<span class="aviso">Este conjunto não tem solução.</span> A busca tentou todas as escolhas de pares e nenhuma fecha os quatro lados.'
    return
  }
  pilha = p
  desenha()
}

elConj.addEventListener('change', comeca)
document.getElementById('embaralhar').addEventListener('click', embaralha)
document.getElementById('resolver').addEventListener('click', resolve)

comeca()
embaralha()
