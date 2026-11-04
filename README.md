# André Tedesco · Landing page

HTML + Tailwind (CDN) + JavaScript puro. Basta abrir o `index.html` no navegador ou subir a pasta inteira para qualquer hospedagem estática (Vercel, Netlify, Hostinger etc.).

## Estrutura

```
index.html   → todas as seções (Variação C do Figma)
script.js    → animações e interações
img/         → imagens, logo e favicon
```

## Imagens para colocar na pasta `img/`

Exporte do Figma (página "Variação C · Founderled + Allia", botão Export em JPG) com estes nomes:

| Arquivo            | Onde aparece                                   |
|--------------------|------------------------------------------------|
| `hero.jpg`         | Hero (mulher escrevendo) e revelação do loader |
| `cha.jpg`          | Card "Ferramentas que você leva para casa"     |
| `caminhada.jpg`    | Card "Mudanças que respeitam a sua rotina"     |
| `consultorio.jpg`  | Reserva (versão com abas do Como funciona)     |
| `andre.jpg`        | Sobre, citação do hero, avatar do Instagram    |

Enquanto uma imagem não existir, o site mostra um degradê suave no lugar, sem ícone quebrado.

`logo.svg` e `favicon.svg` já estão prontos.

## Antes de publicar

- Trocar `CRP 06/000000` pelo número real (busque por `06/000000`).
- Trocar os números do mock do Instagram (`000`, `00 mil`).
- Confirmar a resposta de "O atendimento é online ou presencial?" no FAQ.

## Animações

- Loader na primeira visita da sessão: grid se desenhando, símbolo se conectando nó a nó, contador e revelação da foto.
- Título do hero entrando palavra por palavra com blur.
- Faixas emolduradas: linhas se desenham, marcas de canto aparecem, conteúdo sobe.
- Botões com rolagem de texto e seta no hover.
- Marquee de temas, foco da lista "O que muda" no scroll, roadmap com barras crescendo em sequência.
- FAQ com uma pergunta aberta por vez, botão flutuante do WhatsApp e parallax no CTA.
- Com "reduzir movimento" ativado no sistema, tudo aparece sem animação.
