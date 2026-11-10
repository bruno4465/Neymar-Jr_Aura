# NEYMAR JR — O Menino da Vila · Série Vila

Site conceitual de design sobre Neymar Jr, com direção de arte de luxo:
preto alvinegro, dourado e marfim, tipografia editorial (Fraunces + Space
Grotesk + IBM Plex Mono) e uma camada de micro-interações em JavaScript
puro — sem frameworks, sem build, sem dependências.

> Projeto de fan-site / estudo de design. Não oficial, sem afiliação com
> Neymar Jr., Santos FC ou qualquer clube.

## Como abrir

Basta abrir `index.html` no navegador (duplo clique). Não há processo de
build. Opcionalmente, sirva com qualquer servidor estático:

```
python -m http.server 8000
```

## Estrutura

```
index.html            página única — 7 capítulos numerados
assets/css/styles.css design system + layout (temas noite/marfim)
assets/js/app.js      interações (vanilla JS)
assets/img/           fotografias (Wikimedia Commons — ver credits.json)
```

## Interações

### Motor de scroll (inspirado no landonorris.com)

- **Smooth scroll com lerp** — a página é um wrapper `fixed` transladado
  por `requestAnimationFrame`; o scroll nativo vira alvo e a página
  "atina" com easing exponencial (estilo Lenis). Só em ponteiro fino,
  desktop; `prefers-reduced-motion` desliga tudo.
- **Galeria horizontal dirigida pelo scroll** — a seção "Recortes" tem
  altura esticada conforme a largura da faixa; rolar a página para o
  scroll lateral, com as fotos presas no topo (`position: sticky`).
- **Skew por velocidade** — fotos da galeria e a foto do capítulo
  inclinam sutilmente conforme a velocidade do scroll.
- **Marquees aceleradas** — o ticker e a marquise do rodapé somam a
  velocidade do scroll à velocidade base; aceleram ao rolar.
- **Títulos fatiados em linhas** — os `h2` viram linhas mascaradas que
  sobem de dentro de si mesmas ao entrar na viewport (técnica
  `clip-path`/`overflow` do split-text do Lando).
- **Reveal de mídia** — fotos da galeria abrem de um crop interno
  (`clip-path: inset`) + zoom out ao entrar na tela.
- **Saída do hero** — o conteúdo do hero sobe e esmaece no primeiro
  scroll, com a foto saindo em velocidade diferente (parallax duplo).
- **Âncoras** — os links do menu pulam instantâneo no scroll nativo e o
  lerp desliza até o destino.

### Demais interações

- Preloader com contador e cortina
- Cursor customizado (ponto + anel com lerp) — só em ponteiro fino
- Foto do hero em duotone dourado; cor revelada no hover
- Troca de capítulos por clube (Santos, Barça, PSG, Al-Hilal, Santos)
  com foto, cor e estatísticas animadas por capítulo
- Galeria "Recortes" com tratamento P&B que revela a cor no hover
  (no mobile: arraste nativo; no desktop: dirigida pelo scroll)
- Contadores animados + gráfico de barras de gols por capítulo
- Tema noite / marfim persistente (localStorage)
- Swatches que copiam HEX e botão que copia os tokens do design system
- Pôsteres com tilt 3D e brilho especular
- Confete dourado: clique no "10" do hero ou no "NJ" do rodapé
- Selo giratório, grão de filme, barra de progresso de leitura
- Menu mobile em tela cheia com stagger

## Design system

| Papel        | Fonte          | Uso                    |
|--------------|----------------|------------------------|
| Display      | Fraunces       | manchetes e números    |
| Interface    | Space Grotesk  | corpo e UI             |
| Dados        | IBM Plex Mono  | etiquetas e placares   |

Paleta: Alvinegro `#09090C` · Marfim `#EFEAE0` · Ouro `#C6A15B` ·
Ouro claro `#E7CE9A` · Jade `#2F6B58` · Garnet `#A50044` · Azul Paris `#004170`

## Créditos das fotografias

Todas as fotos vêm do Wikimedia Commons sob licenças Creative Commons.
A lista completa — autor, licença e link de origem de cada arquivo — está
em [`assets/img/credits.json`](assets/img/credits.json).
