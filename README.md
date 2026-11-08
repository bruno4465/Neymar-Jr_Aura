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

- Preloader com contador e cortina
- Cursor customizado (ponto + anel com lerp) — só em ponteiro fino
- Foto do hero em duotone dourado; cor revelada no hover
- Troca de capítulos por clube (Santos, Barça, PSG, Al-Hilal, Santos)
  com foto, cor e estatísticas animadas por capítulo
- Galeria "Recortes" rolável (arraste ou scroll horizontal) com
  tratamento P&B que revela a cor no hover
- Contadores animados + gráfico de barras de gols por capítulo
- Tema noite / marfim persistente (localStorage)
- Swatches que copiam HEX e botão que copia os tokens do design system
- Pôsteres com tilt 3D e brilho especular
- Confete dourado: clique no "10" do hero ou no "NJ" do rodapé
- Ticker em marquise, selo giratório, grão de filme, barra de progresso
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
