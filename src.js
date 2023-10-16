"use strict";

let tick = 0;

let objects = [];
let enemies = [];
let trains = [];
let score = 0;
let timerid = null;

const forestsize = 20;
let parentDiv = null;


function clear(list) {
    list.forEach(elem => {
        parentDiv.removeChild(elem);
    });
}

function drawscore() {
    document.getElementById("score").textContent = score;
}

function initdraw() {
    clear(objects);
    objects = [];
    clear(enemies);
    enemies = [];
    clear(trains);
    trains = [];
    score = 0;
    drawscore() ;
    
    //森の追加
    for (let j = 0; j < 6; ++j) { 
        let top =  (j < 3) ? (forestsize * j) : (500 - forestsize * (j - 2)); 
        for (let i = 0; i < 28; ++i) {
            const newForest = document.createElement("div");
            newForest.textContent = "🌳";
            parentDiv.appendChild(newForest);
            newForest.style.left = forestsize * (i - 3);
            newForest.style.top = top;
            newForest.classList.add("forest");

            objects.push(newForest);
        }
    }

    //線路の追加
    for (let i = 0; i < 28; ++i) {
        const newRali = document.createElement("div");
        newRali.textContent = "‡‡‡‡‡";
        parentDiv.appendChild(newRali);
        newRali.style.left = forestsize * (i - 3);
        newRali.style.top = 255;
        newRali.classList.add("rail");

        objects.push(newRali);
    }

    //電車の追加
    const newTrain = document.createElement("div");
    newTrain.textContent = "🚃🚃🚃🚃";
    parentDiv.appendChild(newTrain);
    newTrain.style.left = 220;
    newTrain.style.top = 248;
    newTrain.classList.add("train");
    trains.push(newTrain);
}

function removeElement(event) {
    parentDiv.removeChild(event.currentTarget);
    score += 1;
    drawscore();

    enemies = enemies.filter(elem => elem != event.target);
}

function addEnemy() {
    let top = (Math.random() < 0.5) ? forestsize * 3 : 500 - forestsize * 4;
    let left = Math.random() * (500 - forestsize);

    const newEnemy = document.createElement("div");
    newEnemy.textContent = "🐧";
    parentDiv.appendChild(newEnemy);
    newEnemy.style.left = left;
    newEnemy.style.top = top;
    newEnemy.classList.add("enemy");
    newEnemy.addEventListener("click", removeElement);

    enemies.push(newEnemy);
}

function tickmove(elem, loop) {
    let currentLeft = parseInt(elem.style.left) || 0;
    currentLeft += 1;
    if (loop && currentLeft >= 500) currentLeft = -forestsize*3;
    elem.style.left = currentLeft + "px";
};

function freemove(elem, x, y) {
    let currentLeft = parseInt(elem.style.left) || 0;
    let currentTop = parseInt(elem.style.top) || 0;
    currentLeft += x;
    currentTop += y;
    elem.style.left = currentLeft + "px";
    elem.style.top = currentTop + "px";
};

function enemymove(elem) {
    let currentLeft = parseInt(elem.style.left) || 0;
    let currentTop = parseInt(elem.style.top) || 0;

    let x = currentLeft < 240 ? 3 : -1;
    let y = currentTop < 250 ? 2 : -2;

    freemove(elem, x, y);
}

function checkEnemy(elem) {
    let x = parseInt(elem.style.left) || 0;
    let y = parseInt(elem.style.top) || 0;

    if (x < 200) return false;
    if (x > 300) return false;
    if (y < 245) return false;
    if (y > 260) return false;

    return true;
}

function draw() {
    objects.forEach(elem => tickmove(elem, true));
    //enemies.forEach(elem => tickmove(elem, false));
    if (tick % 15 == 0) addEnemy();
    tick += 1;

    enemies.forEach(elem => enemymove(elem));
    if (enemies.some(elem => checkEnemy(elem))){
        if (timerid) clearInterval(timerid);

        const gameOver = document.createElement("div");
        gameOver.textContent = "Game Over";
        parentDiv.appendChild(gameOver);
        gameOver.style.left = 100;
        gameOver.style.top = 200;
        gameOver.classList.add("gameover");
        objects.push(gameOver);

        gameOver.addEventListener("click", start);
    }
}

function start() {
    if (timerid) clearInterval(timerid);
    timerid = null;

    initdraw();
    timerid = setInterval(draw, 50);
}

document.addEventListener("DOMContentLoaded",()=>{
    parentDiv = document.getElementById("md");
    start();
});
