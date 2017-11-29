const graphics = require("./graphics");
const random = require("./random");
const blocks = require("./blocks");

const gridX=660;const gridY=450;const gridSize=600;
const cellSize = 50;
const topX=gridX+cellSize*4;
const topY=gridY-cellSize*6;

var c, ctx;
const images = {castle:undefined};

var count = 0;
var started = false;

let score = 0;

var currentBlock;
var fallenBlocks = [];

var prevDt = Date.now();
function calculateDT(){
    const now = Date.now();
    const delta = (now - prevDt)/1000;
    prevDt = now;
    return delta;
}

function menu () {
    const dt = calculateDT();
    count += dt;
    while(count>2){
        count -= 2;
    }

    graphics.rect(ctx,0,0,c.width,c.height);

    graphics.text(ctx,"Japanese Castles Tetris",300,500,100);

    graphics.text(ctx,"By Daniel, Adriel and Jason", 550, 700, 50);
    graphics.text(ctx,"Press F11 to go fullscreen", 570, 800, 50);
    
    ctx.globalAlpha = count>1?2-count:count;
    graphics.text(ctx,"Press the space bar to start",550,900,50);
    ctx.globalAlpha = 1;

    if(started){
        count = 0;
        requestAnimationFrame(game);
    }else {
        requestAnimationFrame(menu);
    }
}

function game(){
    const dt = calculateDT();
    count += dt;
    graphics.rect(ctx,0,0,c.width,c.height);

    // Draw frame
    graphics.image(ctx,images.castle,(c.width-images.castle.width)/2,-80);

    // Score
    graphics.text(ctx,`Score: ${score}`,20,50,50);

    // Frame
    graphics.rect(ctx,gridX,gridY,gridSize,gridSize);
    graphics.rect(ctx,topX,topY,cellSize*4,cellSize*6);
    graphics.lines(ctx,[
        [topX,topY],
        [topX+cellSize*4,topY],
        [topX+cellSize*4,gridY],
        [gridX+gridSize,gridY],
        [gridX+gridSize,gridY+gridSize],
        [gridX,gridY+gridSize],
        [gridX,gridY],
        [topX,gridY],
        [topX,topY]
    ]);

    // Draw grid
    for(let i=cellSize;i<gridSize;i+=cellSize){
        graphics.line(ctx, i+gridX, gridY, i+gridX, gridY+gridSize, 5);
        graphics.line(ctx, gridX, gridY+i, gridX+gridSize, gridY+i, 5);
    }
    for(let i=cellSize;i<cellSize*4;i+=cellSize){
        graphics.line(ctx, topX, topY+i, topX+cellSize*2, topY+i, 5);
    }
    graphics.line(ctx, topX+cellSize, topY, topX+cellSize, topY+cellSize*3, 5);

    // Logic
    if(!currentBlock){
        currentBlock = new (random.choice(blocks))(topX,topY);
    }

    while(count>0.5){
        count-=0.5;

        //Move currentBlock down
        currentBlock.y += cellSize;
    }

    for(let i=0;i<fallenBlocks.length;i++){
        fallenBlocks[i].render(ctx);
    }

    currentBlock.render(ctx);

    if(currentBlock.getBottom()>=gridY+gridSize){
        fallenBlocks.push(currentBlock);
        currentBlock = undefined;
    }

    requestAnimationFrame(game);
}

window.onload = () => {
    c = document.getElementById("c");
    ctx = c.getContext("2d");

    images.castle = new Image();
    images.castle.onload = () => {
        requestAnimationFrame(menu);
    }
    images.castle.src = "./images/plan.jpg";
}

window.addEventListener("keydown",(e)=>{
    const w = e.which || e.keyCode;
    
    switch(w){
    case 32:
        //Space
        started = true;
        break;
    }
});