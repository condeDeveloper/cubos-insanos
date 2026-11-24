# Cubos da Insanidade

O quebra-cabeça dos quatro cubos varrido por domínio inteiro, em JavaScript puro, sem dependência nenhuma.

Quatro cubos com as faces pintadas de quatro cores. Empilhe os quatro numa coluna de modo que cada lado da coluna (frente, direita, fundo e esquerda) mostre as quatro cores, cada uma uma vez.

**Página jogável:** <https://condedeveloper.github.io/cubos-insanos/>

---

## Os quatro achados

**1. Com seis faces de cada cor, nenhum conjunto tem solução única.** Nos **476.919** conjuntos de quatro cubos com seis faces de cada cor, **28,03%** têm solução, e o número de soluções é sempre múltiplo de 3: o menor é 3, o maior 648. O motivo: numa pilha resolvida, frente e fundo usam cada cor duas vezes, e esquerda e direita também. Em cima e embaixo sobram exatamente duas faces de cada cor, e então o par escondido também é uma escolha válida. Qualquer um dos três pares de cada cubo pode ficar escondido, e as soluções andam de três em três.

**2. Solução única pede cores desiguais.** Exigindo só que cada cubo mostre as quatro cores, sem contar faces, **47,35%** dos **341.055** conjuntos resolvem, e **50.346** têm solução única (31,18% dos que resolvem). O exemplo da página tem nove faces vermelhas.

**3. Um cubo, para este jogo, é só três pares de faces opostas, e o juiz confere isso com cubos de verdade.** O núcleo reduz o jogo a um grafo; o juiz gira cubos pintados nas 24 rotações e conta as posições da pilha uma por uma. Os dois concordam em **todos os 30.856** conjuntos de 3 cubos e 3 cores, nos **10.939** do quebra-cabeça e nos **341.055** do domínio de cima. Com metade dos cubos **espelhada** (uma reflexão, que nenhuma rotação produz), a conta dá igual: para o jogo, um cubo e o seu espelho são o mesmo.

**4. Achar uma solução custa 7,35% de contar todas.** Nos conjuntos de seis faces de cada cor que têm solução, a busca que para na primeira abre 958.418 nós, contra 13.037.943 da que conta todas.

---

## A redução

Na coluna, um par de faces opostas vira frente e fundo, outro vira esquerda e direita, e o terceiro fica em cima e embaixo, onde ninguém vê. As 24 rotações do cubo realizam **qualquer** escolha: qual par vai para frente e fundo (3), qual dos outros dois vai para os lados (2), e de que lado fica cada face de cada par (2 × 2). São 3 × 2 × 2 × 2 = 24, todas as rotações, sem sobrar nenhuma.

Então o jogo vira grafo: as cores são vértices e cada par é uma aresta. Uma pilha resolvida escolhe, de cada cubo, uma aresta para frente e fundo e outra para os lados, e cada um dos dois conjuntos de arestas passa duas vezes por cada cor. Isso é um subgrafo 2-regular, uma união de ciclos, e cada ciclo tem exatamente dois jeitos de ser percorrido. O número de posições físicas da pilha que resolvem é a soma, sobre as escolhas de eixos que funcionam, de 2 elevado ao número de ciclos dos dois subgrafos.

Uma **solução essencialmente diferente** é o par de subgrafos: trocar os dois papéis é girar a pilha 90 graus, e virar um ciclo é trocar frente por fundo em alguns cubos. É esse número que as tabelas contam.

---

## As tabelas

Todos os números abaixo saem de `node ferramentas/medidor.js` e estão presos em `testes/`. Nenhum foi digitado à mão.

### Os quatro domínios

| domínio | conjuntos | com solução | solução única | soluções por conjunto |
| --- | --- | --- | --- | --- |
| 3 cubos, 3 cores, todos | 30.856 | 6.789 (22,00%) | 477 | de 1 a 108 |
| 4 cubos, cada um com as 4 cores, 6 faces de cada cor | 10.939 | 3.864 (35,32%) | **0** | de 3 a 120, só múltiplos de 3 |
| 4 cubos quaisquer, 6 faces de cada cor | 476.919 | 133.691 (28,03%) | **0** | de 3 a 648, só múltiplos de 3 |
| 4 cubos, cada um com as 4 cores, qualquer contagem | 341.055 | 161.490 (47,35%) | 50.346 | de 1 a 120 |

### As soluções mais comuns

| domínio | as mais frequentes (soluções: conjuntos) |
| --- | --- |
| 3 cubos | 4: 2.370 · 2: 2.070 · 12: 685 · 8: 486 · 1: 477 · 6: 423 |
| quebra-cabeça | 3: 1.817 · 6: 1.422 · 12: 364 · 9: 102 · 24: 75 · 18: 45 |
| 6 de cada cor | 6: 47.225 · 12: 36.693 · 3: 23.426 · 24: 14.115 · 36: 3.612 · 18: 3.024 |
| 4 cores em cada cubo | 2: 58.596 · 1: 50.346 · 4: 23.190 · 3: 13.403 · 6: 6.438 · 8: 4.380 |

### Achar uma contra contar todas

| domínio | nós para contar todas | nós para achar a primeira | razão |
| --- | --- | --- | --- |
| 3 cubos, só os que resolvem | 220.653 | 42.317 | 19,18% |
| quebra-cabeça, só os que resolvem | 344.372 | 36.395 | 10,57% |
| 6 de cada cor, só os que resolvem | 13.037.943 | 958.418 | 7,35% |
| 4 cores em cada cubo, só os que resolvem | 11.134.458 | 2.634.712 | 23,66% |

### O juiz contra o núcleo

| domínio | conjuntos | posições que resolvem | divergências |
| --- | --- | --- | --- |
| 3 cubos | 30.856 | 1.489.488 | 0 |
| 3 cubos, metade espelhada | 30.856 | 1.489.488 | 0 |
| quebra-cabeça | 10.939 | 672.048 | 0 |
| quebra-cabeça, metade espelhada | 10.939 | 672.048 | 0 |
| 4 cores em cada cubo | 341.055 | 10.819.248 | 0 |
| controle: juiz olhando só 3 lados, 3 cubos | 30.856 | | **19.087** |
| controle: juiz olhando só 3 lados, quebra-cabeça | 10.939 | | **10.644** |

As duas últimas linhas são o controle negativo: um juiz que concorda com tudo não prova nada.

---

## Como funciona

**O núcleo** (`js/insanidade.js`) escolhe, cubo a cubo, um par para frente e fundo e outro para os lados, e poda assim que alguma cor passa de grau 2 em qualquer dos dois subgrafos. Nas folhas, conta os ciclos por união e busca.

**O juiz** (`js/juiz.js`) não sabe nada de pares nem de grafos. Um cubo é seis faces nas direções ±x, ±y, ±z; as 24 rotações saem das 48 matrizes de permutação com sinal, ficando as de determinante +1. Ele tenta as 24ⁿ posições da pilha, com poda: um cubo só entra se não repetir cor em nenhum dos quatro lados.

**A geração dos domínios** poda pela contagem: assim que uma cor passa de seis faces, o ramo morre. Gerar os 101 milhões de conjuntos de quatro cubos e filtrar depois custava 100 segundos para ficar com meio milhão.

**A página** usa a geometria do juiz para mostrar a solução: o núcleo diz que cor vai em cada lado, e a página procura, entre as 24 rotações do cubo pintado, a que põe aquelas cores lá. Repintar o cubo também resolveria, mas podia ser o cubo espelhado, que não é o que está na mesa.

---

## O que as medidas me corrigiram

- **Escrevi num teste que quatro cubos de uma cor só cada, todos de cores diferentes, não resolviam.** Resolvem, e em todas as 24⁴ = 331.776 posições: cada lado da pilha mostra as quatro cores, de qualquer jeito que se empilhe. O teste quebrou na primeira rodada, e o que era para ser o exemplo do impossível virou o exemplo do trivial. O impossível de verdade está no teste ao lado: dois cubos inteiros da mesma cor.
- **Gerar tudo e filtrar depois custava 100 segundos.** A primeira versão gerava os 101 milhões de conjuntos de quatro cubos e jogava fora os que não tinham seis faces de cada cor. Podar durante a geração levou o domínio para 30 segundos, com o mesmo número de conjuntos.

---

## Como rodar

Precisa de Node 20 ou mais novo. Sem dependência nenhuma.

```bash
npm test                              # a suíte inteira (uns minutos)
npm run medir                         # as tabelas rápidas
node ferramentas/medidor.js seis      # um domínio só
node ferramentas/medidor.js juizcores # a geometria no domínio grande
```

## Licença

MIT
