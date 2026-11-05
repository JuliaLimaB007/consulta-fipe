# consulta-fipe

# Consulta Tabela FIPE 🚗

Atividade de JavaScript: Manipulação da DOM + Request HTTP.

Página web que consulta o preço de um carro na Tabela FIPE usando a [BrasilAPI](https://brasilapi.com.br/).

## Como usar

1. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code).
2. Clique em **Buscar Marcas**.
3. Digite e escolha uma marca na lista.
4. Escolha o modelo e depois o ano.
5. Clique em **Consultar preço**.

Enquanto a página espera a resposta da API, aparece a ampulheta ⏳.

## Arquivos

- `index.html` → a estrutura da página
- `style.css` → as cores e o visual
- `script.js` → conversa com a API e mostra o resultado

## Rotas da API usadas

| Etapa | Rota |
| --- | --- |
| Marcas | `https://brasilapi.com.br/api/fipe/marcas/v1/{tipo}` |
| Modelos | `https://brasilapi.com.br/api/fipe/veiculos/v1/{tipo}/{codigoMarca}` |
| Anos | `https://brasilapi.com.br/api/fipe/anos/v1/{tipo}/{codigoMarca}/{codigoModelo}` |
| Preço | `https://brasilapi.com.br/api/fipe/detalhes/v1/{tipo}/{codigoMarca}/{codigoModelo}/{codigoAno}` |

## Tecnologias

HTML, CSS e JavaScript (`fetch`, `async/await` e manipulação da DOM).

## Autora

Júlia 
