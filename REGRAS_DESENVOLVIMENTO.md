# REGRAS DE DESENVOLVIMENTO

1. Esse site será desenvolvido em HTML, CSS e JS.
2. Sempre pense no desenvolvimento sendo Mobile First.
3. É extremamente importante desenvolver o site utilizando as melhores práticas de SEO. 
4. Sempre que possível, criar os elementos mantendo um padrão nas classes e tendo a ideia de reutilização sempre que possível, tipo Bootstrap. Porém, acho que é melhor criar as classes conforme a necessidade.

## Alguns Padrões Exigidos:
Abaixo, vou descrever alguns padrões exibidos na criação dos elementos, que devem ser seguidos caso eu não indique nada ou peça especificamente o valor.

Primeiramente, crie um reset padrão de CSS.

Páginas:
- Esse site será composto por mais de uma página. Ao criar uma página nova, o arquivo index.html precisará estar dentro de um diretório com o nome da página. 

Sections:
- Padding 60px no top e bottom.

Rows:
- Width 100% com um max-width de 1080px;
- Padding 0px no desktop e 30px laterais no MOBILE;

Imagem:
- Width 100%, sempre ocupando o tamanho máximo disponível; 
- Geralmente no prompt, vou solicitar um max-width após a visualização;

Títulos:
- Por padrão, costumo usar em medida 1.2em de line-height, dependendo do tamanho do texto;
- Fonte Montserrat;

Textos:
- Font-size 19px por padrão para parágrafos normais;
- Exceção: parágrafo da Hero Section pode usar 21px;
- Por padrão, costumo usar em medida 1.5em de line-height, dependendo do tamanho do texto;
- Fonte Montserrat;

Cores:
- Ciano Claro: #4ABDCF
- Roxo: #1B123D
- Amarelo: #E09900
- Vermelho: #A70202
- Verde: #029791

## Padrões Gerais para Novos Sites

Links externos:
- Sempre abrir links externos em nova aba usando `target="_blank"` e `rel="noopener noreferrer"`.

Menu:
- Em layouts escuros, evitar hover com mudança de background nos links comuns do menu; preferir alterar a cor do texto para o Verde Neon.
- Botões de destaque no menu podem manter background laranja e hover próprio.

Botões / CTAs:
- Botões principais devem usar background Laranja `#E09900`.
- Por padrão, usar texto branco nos botões principais, salvo quando for pedido outro contraste específico.
- Usar fonte 17px no mobile e 19px no desktop, salvo ajuste específico.
- Usar sombra distribuída ao redor do botão, não apenas abaixo.
- Criar uma animação infinita de zoom in  e zoom out.

Links de conversão e formulários:
- Quando um botão abrir formulário em popup, o modal deve ser responsivo, acessível e fácil de fechar pelo botão, clique fora e tecla Esc.
- Scripts externos de formulários ou monitoramento devem ficar organizados, carregando apenas uma vez quando possível.

Imagens:
- Priorizar imagens em `.webp` para o site.
- Caso alguma imagem ainda esteja em `.png`, `.jpg` ou outro formato, listar no `README.md` para conversão posterior.
- Manter a proporção real de ícones e imagens pequenas; não forçar width/height que distorçam o arquivo.

Responsividade:
- Garantir que textos de botões e cards não estourem no mobile.
- Conferir espaçamentos e larguras em mobile antes de ajustar desktop.
