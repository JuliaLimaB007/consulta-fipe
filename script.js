const URL_BASE =                                                    // Endereço da API (como o endereço de uma casa)
  "https://brasilapi.com.br/api/fipe/";
const TIPO = "carros";                                              // Tipo de veículo da consulta (também existem motos e caminhoes)

const btnMarcas = document.getElementById("btnMarcas");             // Pega o botão "Buscar Marcas"
const campoMarca = document.getElementById("campoMarca");           // Pega o campo onde se digita a marca
const listaMarcas = document.getElementById("listaMarcas");         // Pega a lista de sugestões de marcas
const selectModelo = document.getElementById("selectModelo");       // Pega a caixinha de modelos
const selectAno = document.getElementById("selectAno");             // Pega a caixinha de anos
const btnConsultar = document.getElementById("btnConsultar");       // Pega o botão "Consultar preço"
const carregando = document.getElementById("carregando");           // Pega a ampulheta ⏳
const mensagem = document.getElementById("mensagem");               // Pega o lugar dos avisos e erros
const resultado = document.getElementById("resultado");             // Pega o lugar onde o preço aparece

let marcas = [];                                                    // Caderninho: vai guardar a lista de marcas (nome + código)
let codigoMarca = "";                                               // Guarda o código da marca que a pessoa escolheu

function mostrarAviso(texto) {                                      // Receita para mostrar um aviso na tela
  mensagem.textContent = texto;                                     // Escreve o texto do aviso
  mensagem.hidden = false;                                          // Mostra o aviso
}                                                                   // Fecha a receita

async function buscarJson(caminho) {                                // Receita que pergunta algo à API e espera
  const resposta = await fetch(URL_BASE + caminho);                 // Pede à API e ESPERA a resposta chegar
  if (!resposta.ok) throw new Error("Erro na API");                 // Se a API disse "deu ruim", cria um erro
  return await resposta.json();                                     // Transforma a resposta em dados que o JS entende
}                                                                   // Fecha a receita

async function comEspera(texto, tarefa) {                           // Receita: mostra a ampulheta enquanto a tarefa roda
  mensagem.hidden = true;                                           // Esconde o aviso antigo
  carregando.textContent = "⏳ " + texto;                            // Escreve o que está acontecendo
  carregando.hidden = false;                                        // Mostra a ampulheta
  try {                                                             // Tenta fazer a tarefa (pode dar errado)
    await tarefa();                                                 // Faz a tarefa e espera ela terminar
  } catch (erro) {                                                  // Se algo deu errado, cai aqui
    mostrarAviso("Não deu certo. Tente de novo.");                  // Avisa a pessoa
  } finally {                                                       // Isto acontece SEMPRE, deu certo ou errado
    carregando.hidden = true;                                       // Esconde a ampulheta
  }                                                                 // Fecha o try/catch/finally
}                                                                   // Fecha a receita

function esvaziarCaixa(caixa, titulo) {                             // Receita que deixa uma caixinha vazia e travada
  caixa.innerHTML = "";                                             // Apaga todas as opções
  caixa.appendChild(new Option(titulo, ""));                        // Põe só a primeira opção ("Selecione...")
  caixa.disabled = true;                                            // Trava a caixinha
}                                                                   // Fecha a receita

function preencherCaixa(caixa, lista) {                             // Receita que enche uma caixinha com opções
  lista.forEach(function (item) {                                   // Para cada item da lista...
    caixa.appendChild(new Option(item.texto, item.valor));          // ...cria uma opção (texto + código) e coloca nela
  });                                                               // Fecha o "para cada item"
  caixa.disabled = false;                                           // Destrava a caixinha
}                                                                   // Fecha a receita

function criarElemento(tag, texto, classe) {                        // Receita para criar uma peça nova da página
  const elemento = document.createElement(tag);                     // Cria a peça (ex.: um parágrafo)
  elemento.textContent = texto;                                     // Escreve o texto dentro dela
  if (classe) elemento.className = classe;                          // Se tiver classe, dá a "roupa" para ela
  return elemento;                                                  // Entrega a peça pronta
}                                                                   // Fecha a receita

function adicionar(tag, texto, classe) {                            // Receita que cria uma peça e já põe no resultado
  const peca = criarElemento(tag, texto, classe);                   // Cria a peça
  resultado.appendChild(peca);                                      // Coloca a peça no resultado
}                                                                   // Fecha a receita

function adicionarLinha(titulo, valor) {                            // Receita que põe uma linha de detalhe no resultado
  const linha = criarElemento("div", "", "linha");                  // Cria uma linha vazia
  linha.appendChild(criarElemento("span", titulo));                 // Coloca o nome do detalhe (ex.: Ano)
  linha.appendChild(criarElemento("span", valor, "dado"));          // Coloca o valor do detalhe
  resultado.appendChild(linha);                                     // Coloca a linha pronta no resultado
}                                                                   // Fecha a receita

function mostrarResultado(dados) {                                  // Receita que desenha o preço na tela
  const carro = Array.isArray(dados) ? dados[0] : dados;            // Se vier uma lista, pega o primeiro carro
  const zeroKm = carro.anoModelo === 32000;                         // Ano 32000 quer dizer carro zero km
  resultado.innerHTML = "";                                         // Apaga o resultado antigo
  adicionar("h2", carro.marca + " " + carro.modelo);                // Nome do carro (marca + modelo)
  adicionar("p", carro.valor, "preco-grande");                      // O preço em letras grandes
  adicionarLinha("Ano", zeroKm ? "0 km" : carro.anoModelo);         // Linha com o ano
  adicionarLinha("Combustível", carro.combustivel);                 // Linha com o combustível
  adicionarLinha("Código FIPE", carro.codigoFipe);                  // Linha com o código FIPE
  adicionarLinha("Mês da tabela", carro.mesReferencia.trim());      // Linha com o mês da tabela
  resultado.hidden = false;                                         // Mostra o resultado na tela
}                                                                   // Fecha a receita

btnMarcas.addEventListener("click", function () {                   // Quando clicar em "Buscar Marcas"...
  comEspera("Buscando marcas...", async function () {               // ...mostra a ampulheta e faz o que está abaixo
    marcas = await buscarJson("marcas/v1/" + TIPO);                 // Pede as marcas à API e guarda no caderninho
    listaMarcas.innerHTML = "";                                     // Esvazia as sugestões antigas
    marcas.forEach(function (marca) {                               // Para cada marca recebida...
      listaMarcas.appendChild(new Option(marca.nome));              // ...coloca o nome nas sugestões
    });                                                             // Fecha o "para cada marca"
    campoMarca.disabled = false;                                    // Destrava o campo da marca
    campoMarca.focus();                                             // Já deixa o cursor piscando nele
  });                                                               // Fecha o comEspera
});                                                                 // Fecha o "quando clicar"

campoMarca.addEventListener("change", function () {                 // Quando a pessoa escolher uma marca...
  const nome = campoMarca.value.trim().toLowerCase();               // Lê o que foi escrito (em letras minúsculas)
  const marca = marcas.find(function (m) {                          // Procura no caderninho a marca com esse nome
    return m.nome.toLowerCase() === nome;                           // É a marca certa se o nome for igual
  });                                                               // Fecha a procura
  esvaziarCaixa(selectModelo, "Selecione um modelo");               // Limpa os modelos antigos
  esvaziarCaixa(selectAno, "Selecione o ano");                      // Limpa os anos antigos
  btnConsultar.disabled = true;                                     // Trava o botão de consultar
  resultado.hidden = true;                                          // Esconde o resultado antigo
  if (!marca) {                                                     // Se não achou a marca...
    if (nome !== "") mostrarAviso("Escolha uma marca da lista.");   // ...pede para escolher da lista
    return;                                                         // Para aqui
  }                                                                 // Fecha o "se não achou"
  codigoMarca = marca.valor;                                        // Guarda o código da marca escolhida
  comEspera("Buscando modelos...", async function () {              // Mostra a ampulheta e busca os modelos
    const rota = `veiculos/v1/${TIPO}/${codigoMarca}`;              // Monta o endereço da pergunta
    const modelos = await buscarJson(rota);                         // Pede os modelos da marca
    preencherCaixa(selectModelo, modelos.map(function (m) {         // Enche a caixinha de modelos
      return { texto: m.modelo, valor: m.valor };                   // Cada opção: nome do modelo + código
    }));                                                            // Fecha o preenchimento
  });                                                               // Fecha o comEspera
});                                                                 // Fecha o "quando escolher a marca"

selectModelo.addEventListener("change", function () {               // Quando a pessoa escolher um modelo...
  esvaziarCaixa(selectAno, "Selecione o ano");                      // Limpa os anos antigos
  btnConsultar.disabled = true;                                     // Trava o botão de consultar
  resultado.hidden = true;                                          // Esconde o resultado antigo
  if (selectModelo.value === "") return;                            // Se não escolheu nada, para aqui
  comEspera("Buscando anos...", async function () {                 // Mostra a ampulheta e busca os anos
    const rota = `anos/v1/${TIPO}/${codigoMarca}/${selectModelo.value}`;  // Monta o endereço da pergunta
    const anos = await buscarJson(rota);                            // Pede os anos do modelo
    preencherCaixa(selectAno, anos.map(function (a) {               // Enche a caixinha de anos
      return { texto: a.nome, valor: a.valor };                     // Cada opção: ano + combustível e o código
    }));                                                            // Fecha o preenchimento
  });                                                               // Fecha o comEspera
});                                                                 // Fecha o "quando escolher o modelo"

selectAno.addEventListener("change", function () {                  // Quando a pessoa escolher um ano...
  btnConsultar.disabled = selectAno.value === "";                   // Destrava o botão se escolheu um ano de verdade
  resultado.hidden = true;                                          // Esconde o resultado antigo
});                                                                 // Fecha o "quando escolher o ano"

btnConsultar.addEventListener("click", function () {                // Quando clicar em "Consultar preço"...
  comEspera("Consultando o preço...", async function () {           // Mostra a ampulheta e faz o que está abaixo
    const modelo = selectModelo.value;                              // Guarda o modelo escolhido
    const ano = selectAno.value;                                    // Guarda o ano escolhido
    const rota = `detalhes/v1/${TIPO}/${codigoMarca}/${modelo}/${ano}`;  // Monta o endereço com as 4 escolhas
    const dados = await buscarJson(rota);                           // Pede o preço à API
    mostrarResultado(dados);                                        // Desenha o preço na tela
  });                                                               // Fecha o comEspera
});                                                                 // Fecha o "quando clicar"
