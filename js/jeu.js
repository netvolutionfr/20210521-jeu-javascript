/*
Jeu en JavaScript
Attrapez les monstres !
 */

// Création du canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

document.body.appendChild(canvas);

// Création d'un div pour le score
const divScore = document.createElement("div");
document.body.appendChild(divScore);

const nombreMonstres = 6;
const monstreReady = [];
const monstreImage = [];
const monstre = [];

let bgReady = false;
const bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/background.png";

let herosReady = false;
const herosImage = new Image();
herosImage.onload = function() {
    herosReady = true;
}
herosImage.src = "images/hero.png";

for (let i=0; i < nombreMonstres; i++) {
    monstreReady[i] = false;
    monstreImage[i] = new Image();
    monstreImage[i].onload = function() {
        monstreReady[i] = true;
    }
    if (i % 2) {
        monstreImage[i].src = "images/monster2.png";
    } else {
        monstreImage[i].src = "images/monster.png";
    }
    monstre[i] = {
        x: 0,
        y: 0
    };
}

const heros = {
    speed: 256,
    x: 0,
    y: 0
};
let monstresAttrapes = 0;
let score = 0;

const touchesAppyees = {};

function convertirCode(code) {
    let keyCode = 0;
    switch (code) {
        case ("ArrowDown"):
        case ("KeyS"):
            keyCode = 40;
            break;
        case ("ArrowUp"):
        case ("KeyW"):
            keyCode = 38;
            break;
        case ("ArrowLeft"):
        case ("KeyA"):
            keyCode = 37;
            break;
        case ("ArrowRight"):
        case ("KeyD"):
            keyCode = 39;
            break;
    }
    return keyCode;
}
addEventListener("keydown", function(e) {
    const keyCode = convertirCode(e.code);
    if (keyCode > 0) {
        touchesAppyees[keyCode] = true;
    }
});
addEventListener("keyup", function(e) {
    const keyCode = convertirCode(e.code);
    if (keyCode > 0) {
        delete touchesAppyees[keyCode];
    }
});

function reset() {
    monstresAttrapes = 0;
    heros.x = canvas.width / 2;
    heros.y = canvas.height / 2;

    for (let i = 0; i < nombreMonstres; i++) {
        monstre[i].x = 32 + (Math.random() * (canvas.width - 96));
        monstre[i].y = 32 + (Math.random() * (canvas.height - 96));
    }
}

function update(modifier) {
    if (37 in touchesAppyees && heros.x > 32) {
        heros.x -= heros.speed * modifier;
    }
    if (38 in touchesAppyees && heros.y > 32) {
        heros.y -= heros.speed * modifier;
    }
    if (39 in touchesAppyees && heros.x < (canvas.width - 64)) {
        heros.x += heros.speed * modifier;
    }
    if (40 in touchesAppyees && heros.y < (canvas.height - 64)) {
        heros.y += heros.speed * modifier;
    }

    // Y a-t-il contact ?
    for (i = 0; i < nombreMonstres; i++) {
        if (
            heros.x <= (monstre[i].x + 32)
            && monstre[i].x <= (heros.x + 32)
            && heros.y <= (monstre[i].y + 32)
            && monstre[i].y <= (heros.y + 32)
        ) {
            ++monstresAttrapes;
            ++score;
            monstre[i].x = -33;
            monstre[i].y = -33;
        }
    }

    if (monstresAttrapes === nombreMonstres) {
        reset();
    }
}

function render() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (herosReady) {
        ctx.drawImage(herosImage, heros.x, heros.y);
    }
    for (let i = 0; i < nombreMonstres; i++) {
        if (monstreReady[i]) {
            ctx.drawImage(monstreImage[i], monstre[i].x, monstre[i].y);
        }
    }

    // Score
    divScore.innerHTML = "Score : " + score;
}

function main() {
    const now = Date.now();
    const delta = now - then;
    update(delta / 1000);
    render();

    then = now;
}

reset();
let then = Date.now();
setInterval(main, 1);