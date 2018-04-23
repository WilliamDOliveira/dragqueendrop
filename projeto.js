// 'use strict';

var box;

// cria as box e prepara o ambiente para poder mover os  objetos
function init(){

    //tamanho das boxes no container
let tamanhoBox = 50;

// Calcula o tamanho das boxes e arredonda para baixo
// Calculo é feito em base de uma caixa quadrada
function calcBox(el) {
    return Math.floor(el / tamanhoBox);
}

box = document.querySelector('#wrapper');//Recupera o elemento que contem o background com a planta, e os elementos internos
let boxAltura = box.offsetHeight;// Recupera altura do elemento 12 cnv intger
// console.log('boxAltura: ', boxAltura);

let boxLargura = box.offsetWidth;// Recupera a largura 24
// console.log('boxLargura: ', boxLargura);

// Calcula a quantidade total de boxes que tera o container e retorna um valor para ser iterado
let qtdadeCaixas = calcBox(boxAltura) * calcBox(boxLargura);
// console.log('qtdadeCaixas: ', qtdadeCaixas);

//cria um objeto array que irá armazenar os seletores das boxes que serão criadas
let arrContainer = [];
//recupera o primeiro espaço de armazenamento das imagens
arrContainer[0] = document.querySelector('.box0');
//itera e cria os seletores das boxes que serão inseridas no container
for (let i = 1; i <= qtdadeCaixas; i++) {
    box.insertAdjacentHTML('beforeend', '<div id="box" class="box' + i + '"></div>');
    arrContainer[i] = document.querySelector('.box' + i);
}//for



dragula(arrContainer, {
    isContainer: function (el) {
        return false; // only elements in drake.containers will be taken into account
    },
    moves: function (el, source, handle, sibling) {
        // console.log('moves: =====================');        
        // console.log('el: ', el);
        // let el = el;
        // console.log('source: ', source);
        // console.log('handle: ', handle);
        // console.log('sibling: ', sibling);
        return true; // elements are always draggable by default
    },
    accepts: function (el, target, source, sibling) {
        // console.log('accepts: =====================');
        // console.log('el: ', el);
        // console.log('target: ', target);
        // console.log('source: ', source);
        // console.log('sibling: ', sibling);
        return true; // elements can be dropped in any of the `containers` by default
    },
    invalid: function (el, handle) {
        return false; // don't prevent any drags from initiating by default
    },
    direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
    copy: false,                       // elements are moved by default, not copied
    copySortSource: false,             // elements in copy-source containers can be reordered
    revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
    removeOnSpill: false,              // spilling will `.remove` the element, if this is true
    mirrorContainer: document.body,    // set the element that gets mirror elements appended
    ignoreInputTextSelection: true     // allows users to select input text, see details below
})
// .on('dragend', function (el) { console.log('el: ', el); })
// .on('drag', function (el) {
//     el.className = el.className.replace('ex-moved', '');
// })
// .on('drop', function (el) {
//     el.className += ' ex-moved';
// })
// .on('over', function (el, container) {
//     container.className += ' ex-over';
// })
// .on('out', function (el, container) {
//     container.className = container.className.replace('ex-over', '');
// });

    //Renderiza na tela as imagens dentro do container caso elas existam no localstorage
    __renderImgsGetLocalStorage();

}// init() ========================================================//


// Salva as imagens de acordo com a posição da box
function savePositionsBox(){
    // recupera os seletores que possuem uma imagem
    let seletores = $(box).children().children().parent();
    let objSeletor = []
    // Cria um array de objetos com a imagem e o seletor que a contem
    // cada seletor possui uma classe numerada ex .box25 
    for(let seletor of seletores){
        let item = {
            "seletor":seletor.classList[0], // recupera a classe que contem o numero/id da box
            "imagem": $(seletor).children()[0]['attributes'][0]['value'] // recupera o nome da imagem
        }
        objSeletor.push(item)
    }
    // console.log('objSeletor',objSeletor);
    return objSeletor;
}// savePositionsBox() ========================================================//



function prepareLocalStorage(){
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        return this;
    } else {
        // Sorry! No Web Storage support..
        console.error('Local Storage não definido');
    }
}

function savePositionLocalStorage(){
    if( prepareLocalStorage() ){
        console.log('==set==');
        let postitionsboxes =  JSON.stringify( savePositionsBox() ) ;
        console.log('postitionsboxes: ', postitionsboxes);
        let setStorage = localStorage.setItem( "positions",  postitionsboxes  );
        alert('Dados Salvos');
    }
}

function recoveryImgsPositionLocalStorage(){
    if( prepareLocalStorage() ){
        // console.log('==get==');
        let getStorage = localStorage.getItem( "positions" );
        // console.log('getStorage: ', getStorage);
        return getStorage;
    }
}

// Recupera as boxes do localstorage para renderizar na tela
function __renderImgsGetLocalStorage(){
    if(!recoveryImgsPositionLocalStorage()) {
        console.error('LocalStorage está vazio');
        return ;
    }
    // recupera objeto referente as imagens que estão no localstorage
    let boxes = JSON.parse( recoveryImgsPositionLocalStorage() ) ;
    
    if( !$(box) ){
        console.error('Container não encontrado.');
        return;
    }
    else{
        // Renderiza na tela todas as imagens
        // console.log('boxes: ', boxes);
        for(let cx of boxes){
            let img = $( '.' + cx['seletor'] ).append('<img src="'+ cx['imagem'] +'">');
        }
    }
}

function clearImgsPositionLocalStorage(){
    if( prepareLocalStorage() ){
        localStorage.clear();
        alert('Storage Clear');
        return
    }
}