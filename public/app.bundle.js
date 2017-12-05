/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
    rect:function(ctx,x,y,w,h,col){
        ctx.fillStyle = col||"#000";
        ctx.fillRect(x,y,w,h);
    },
    rectOutline:function(ctx,x,y,w,h,size,col){
        ctx.strokeStyle = col||"#fff";
        ctx.lineWidth = size||10;
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.stroke();
    },
    line:function(ctx,x1,y1,x2,y2,size,col){
        ctx.lineCap="round";
        ctx.strokeStyle = col||"#fff";
        ctx.lineWidth = size||10;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
    },
    lines:function(ctx,lines,size,col){
        ctx.lineCap="round";
        ctx.strokeStyle = col||"#fff";
        ctx.lineWidth = size||10;

        ctx.beginPath();
        ctx.moveTo(lines[0][0],lines[0][1]);
        for(let i=1;i<lines.length;i++){
            ctx.lineTo(lines[i][0],lines[i][1]);
        }
        ctx.stroke();
    },
    text:function(ctx,text,x,y,size,col){
        ctx.fillStyle = col||"#fff";
        ctx.font = `${size||100}px Consolas`;
        ctx.fillText(text, x, y);
    },
    image:function(ctx,img,x,y){
        ctx.drawImage(img,x,y);
    },
    renderBlock:function(ctx,x,y,col,size){
        const realS = size || 50;
        this.rect(ctx,x,y,realS,realS,col);
        this.rectOutline(ctx,x,y,realS,realS);
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
    randint:function(min,max){
        return min+Math.floor((max-min)*Math.random());
    },
    choice:function(samples){
        return samples[this.randint(0,samples.length)];
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function snip(map, minX, minY) {
    if(minX!==0){
        const push = -minX;
        
        const correctedMap = [];
        for(let y in map){
            for(let x in map[y]){
                if(!correctedMap[y]){
                    correctedMap[y] = [];
                }
                correctedMap[y][parseInt(x)+push] = map[y][parseInt(x)];
            }
        }

        map = correctedMap;
    }

    if(minY!==0){
        const push = -minY;
        
        const correctedMap = [];
        for(let y in map){
            for(let x in map[y]){
                if(!correctedMap[parseInt(y)+push]){
                    correctedMap[parseInt(y)+push] = [];
                }
                correctedMap[parseInt(y)+push][x] = map[parseInt(y)][x];
            }
        }

        map = correctedMap;
    }

    return map;
}

module.exports = function (map) {
    const newMap = [];

    let width = 0;
    for(let i=0;i<map.length;i++){
        if(map[i].length>width){
            width = map[i].length;
        }
    }

    const cX = Math.ceil(width/2);
    const cY = Math.ceil(map.length/2);

    let lowestX = 9999;
    let lowestY = 9999;

    for(let y=0;y<map.length;y++){
        for(let x=0;x<width;x++){
            const diffX = x-cX;
            const diffY = y-cY;

            const newX = cX-diffY;
            const newY = cY+diffX;

            if(!newMap[newY]){
                newMap[newY] = [];
            }
            newMap[newY][newX] = map[y][x];

            if(newX<lowestX){
                lowestX = newX;
            }
            if(newY<lowestY){
                lowestY = newY;
            }
        }
    }

    const final = snip(newMap,lowestX,lowestY);

    return final;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const graphics = __webpack_require__(0);
const random = __webpack_require__(1);
const rotateList = __webpack_require__(2);
const blocks = __webpack_require__(4);
const music = __webpack_require__(5);

const gridX=660;const gridY=450;const gridSize=600;
const cellSize = 50;
const topX=gridX+cellSize*4;
const topY=gridY-cellSize*6;

var c, ctx;
const images = {castle:undefined};

var count = 0;
var started = false;
var gameOver = false;

let score = 0;

var currentBlock;
var fallenPieces = [];

var speedUp = 1;
var down = false;

var prevDt = Date.now();
function calculateDT(){
    const now = Date.now();
    const delta = (now - prevDt)/1000;
    prevDt = now;
    return delta;
}

function rowCheck(){
    const rows = [];

    //Organises indexes into rows
    for(let i=0;i<fallenPieces.length;i++){
        const y = fallenPieces[i][1];

        const rowId = Math.floor((y-topY)/cellSize);

        if(!rows[rowId]){// Creates row if not already made
            rows[rowId] = [];
        }

        rows[rowId].push(fallenPieces[i]);
    }

    for(let j=0;j<rows.length;j++){
        if(rows[j]){// If a piece was actually in this row
            const amntInRow = rows[j].length;

            // 12 is the amount for a break.
            if(amntInRow>11){
                const rowRemoveY = fallenPieces[fallenPieces.indexOf(rows[j][0])][1];

                for(let k=0;k<amntInRow;k++){
                    fallenPieces.splice(fallenPieces.indexOf(rows[j][k]),1);//Removes all pieces in finished row
                }

                // Moves all above pieces down
                for(let counter=0;counter<fallenPieces.length;counter++){
                    if(fallenPieces[counter][1] < rowRemoveY){
                        // Move this piece down
                        fallenPieces[counter][1] += cellSize;
                    }
                }
            }
        }
    }
}

function stopBlock(){
    fallenPieces = fallenPieces.concat(currentBlock.getPieces());
    
    currentBlock = undefined;

    speedUp += 0.1;

    rowCheck();
}

function checkMove(){
    const pieces = currentBlock.getPieces();
    for(let i=0;i<pieces.length;i++){
        for(let j=0;j<fallenPieces.length;j++){
            if(pieces[i][0] === fallenPieces[j][0] && pieces[i][1] === fallenPieces[j][1]){
                // hit another block.
                return true;
            }
        }

        if(pieces[i][1] < gridY){
            // In top section
            if(pieces[i][0] < topX || pieces[i][0] > topX + cellSize * 3){
                return 0.5;
            }
        }else {
            if(pieces[i][0] < gridX || pieces[i][0] >= gridX+gridSize){
                return 0.5;
            }
            if(pieces[i][1] >= gridY+gridSize){
                return true;
            }
        }
    }

    return false;
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
    count += dt*(4*down+1)*speedUp;// Accelerates when down key is held
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
    for(let i=cellSize;i<cellSize*8;i+=cellSize){
        graphics.line(ctx, topX, topY+i, topX+cellSize*4, topY+i, 5);
    }
    for(let i=cellSize;i<cellSize*4;i+=cellSize){
        graphics.line(ctx, topX+i, topY, topX+i, topY+cellSize*6, 5);
    }

    // Logic
    if(!currentBlock){
        currentBlock = new (random.choice(blocks))(topX,topY);
        currentBlock.x = topX + cellSize * (2-Math.floor(currentBlock.width/2));

        if(checkMove()){
            gameOver = true;
        }else {
            score += currentBlock.getPieces().length;
        }
    }

    while(count>0.5){
        count-=0.5;

        if(currentBlock){
            //Move currentBlock down
            currentBlock.y += cellSize;
            
            if(checkMove()){
                currentBlock.y -= cellSize;

                stopBlock();
            }
        }
    }

    for(let i=0;i<fallenPieces.length;i++){
        graphics.renderBlock(ctx,fallenPieces[i][0],fallenPieces[i][1],fallenPieces[i][2]);
    }

    if(currentBlock){
        currentBlock.render(ctx);
    }

    if(gameOver){
        requestAnimationFrame(gameOverLoop);
    }else {
        requestAnimationFrame(game);
    }
}

function gameOverLoop(){
    const dt = calculateDT();

    graphics.rect(ctx,0,0,c.width,c.height);

    graphics.text(ctx,`Game Over. Score: ${score}`,100,500,150);

    requestAnimationFrame(gameOverLoop);
}

window.onload = () => {
    c = document.getElementById("c");
    ctx = c.getContext("2d");

    images.castle = new Image();
    images.castle.onload = () => {
        // Starts music
        music.start();

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
    case 37:
        //Left
        if(started){
            if(currentBlock){
                currentBlock.x -= cellSize;

                const result = checkMove();
                if(result){
                    currentBlock.x += cellSize;

                    if(result > 0.7){
                        // It didn't just hit the side
                        stopBlock();
                    }
                }
            }
        }
        break;
    case 39:
        //Right
        if(started){
            if(currentBlock){
                currentBlock.x += cellSize;

                const result = checkMove();
                if(result){
                    currentBlock.x -= cellSize;
                    
                    if(result>0.7){
                        // It didn't just hit the side
                        stopBlock();
                    }
                }
            }
        }
        break;
    case 40:
        //Down
        if(started){
            down = true;
        }
        break;
    case 38:
        //Up
        if(started){
            if(currentBlock){
                const old = currentBlock.boolMap.concat([]);// Duplicates boolMap

                currentBlock.boolMap = rotateList(currentBlock.boolMap);

                const result = checkMove();
                if(result){
                    currentBlock.boolMap = old;
                    if(result > 0.7){
                        // We hit something
                        stopBlock();
                    }
                }
            }
        }
        break;
    }
});

window.addEventListener("keyup",(e)=>{
    const w = e.which || e.keyCode;

    if(w===40){
        down = false;
    }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const graphics = __webpack_require__(0);
const random = __webpack_require__(1);
const rotateList = __webpack_require__(2);

const colours = [
    "#f00",
    "#ff0",
    "#00f",
    "#0f0",
    "#f0f",
    "#0fa"
];

class Block {
    constructor(x,y,boolMap){
        this.x = x;
        this.y = y;
        this.boolMap = boolMap;
        this.col = random.choice(colours);

        this.height = boolMap.length;
        this.width = 0;
        for(let i=0;i<this.height;i++){
            if(boolMap[i].length>this.width){
                this.width = boolMap[i].length;
            }
        }
    }

    render(ctx){
        for(let y=0;y<this.boolMap.length;y++){
            for(let x=0;x<this.boolMap[y].length;x++){
                if(this.boolMap[y][x]){
                    graphics.renderBlock(ctx,this.x+x*50,this.y+y*50,this.col);
                }
            }
        }
    }

    getBottom(){
        return this.y + this.boolMap.length*50;
    }

    getPieces(){
        const pieces = [];

        for(let y=0;y<this.boolMap.length;y++){
            for(let x=0;x<this.boolMap[y].length;x++){
                if(this.boolMap[y][x]){
                    pieces.push([this.x+x*50,this.y+y*50,this.col]);
                }
            }
        }

        return pieces;
    }
}

function mapListToBlocks (mapList){
    const blocks = [];
    for(let i=0;i<mapList.length;i++){
        blocks.push(class extends Block {
            constructor(x,y){
                super(x,y,mapList[i]);
            }
        });
    }
    return blocks;
}

const blockListRaw = [
    [
        [1],
        [1,1]
    ],
    [
        [1],
        [1],
        [1,1]
    ],
    [
        [0,1],
        [0,1],
        [1,1]
    ],
    [
        [1,1],
        [1],
        [1,1]
    ],
    [
        [1],
        [1],
        [1]
    ],
    [
        [1],
        [1,1],
        [0,1,1]
    ]
];
const blockList = [];
for(let i=0;i<blockListRaw.length;i++){
    blockList.push(blockListRaw[i]);
    const next = rotateList(blockListRaw[i]);
    blockList.push(next);
    const andNext = rotateList(next);
    blockList.push(andNext);
    const final = rotateList(andNext);
    blockList.push(final);
}

module.exports = mapListToBlocks(blockList);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var introMusic;
var mainMusic;

var alreadyLoadedIntro = false;
var alreadyLoadedMain = false;

module.exports = {
    start:function(){
        introMusic = new Audio();
        mainMusic = new Audio();

        introMusic.oncanplaythrough = ()=>{
            if(!alreadyLoadedIntro){
                alreadyLoadedIntro = true;

                mainMusic.oncanplaythrough = ()=>{
                    if(!alreadyLoadedMain){
                        alreadyLoadedMain = true;
                        // now everything's loaded:
                        // Play the music
                        introMusic.play();

                        introMusic.onended = () => {
                            // Play the next music
                            mainMusic.loop = true;
                            mainMusic.play();
                        }
                    }
                }

                mainMusic.src = "./music/music_main.wav";
            }
        }

        introMusic.src = "./music/music_intro.wav";
    }
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWRlNWFhYjEyYzI1NjMzOTM2MDgiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL211c2ljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGVBQWU7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7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O0FBQ0E7O0FBRUEsNEM7Ozs7OztBQ2hIQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEMiLCJmaWxlIjoiLi9wdWJsaWMvYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGVkZTVhYWIxMmMyNTYzMzkzNjA4IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByZWN0OmZ1bmN0aW9uKGN0eCx4LHksdyxoLGNvbCl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbHx8XCIjMDAwXCI7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgseSx3LGgpO1xyXG4gICAgfSxcclxuICAgIHJlY3RPdXRsaW5lOmZ1bmN0aW9uKGN0eCx4LHksdyxoLHNpemUsY29sKXtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlY3QoeCx5LHcsaCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIGxpbmU6ZnVuY3Rpb24oY3R4LHgxLHkxLHgyLHkyLHNpemUsY29sKXtcclxuICAgICAgICBjdHgubGluZUNhcD1cInJvdW5kXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeDEseTEpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeDIseTIpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICBsaW5lczpmdW5jdGlvbihjdHgsbGluZXMsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5saW5lQ2FwPVwicm91bmRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGluZXNbMF1bMF0sbGluZXNbMF1bMV0pO1xyXG4gICAgICAgIGZvcihsZXQgaT0xO2k8bGluZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8obGluZXNbaV1bMF0sbGluZXNbaV1bMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgdGV4dDpmdW5jdGlvbihjdHgsdGV4dCx4LHksc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5mb250ID0gYCR7c2l6ZXx8MTAwfXB4IENvbnNvbGFzYDtcclxuICAgICAgICBjdHguZmlsbFRleHQodGV4dCwgeCwgeSk7XHJcbiAgICB9LFxyXG4gICAgaW1hZ2U6ZnVuY3Rpb24oY3R4LGltZyx4LHkpe1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLHgseSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQmxvY2s6ZnVuY3Rpb24oY3R4LHgseSxjb2wsc2l6ZSl7XHJcbiAgICAgICAgY29uc3QgcmVhbFMgPSBzaXplIHx8IDUwO1xyXG4gICAgICAgIHRoaXMucmVjdChjdHgseCx5LHJlYWxTLHJlYWxTLGNvbCk7XHJcbiAgICAgICAgdGhpcy5yZWN0T3V0bGluZShjdHgseCx5LHJlYWxTLHJlYWxTKTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2dyYXBoaWNzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmFuZGludDpmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gbWluK01hdGguZmxvb3IoKG1heC1taW4pKk1hdGgucmFuZG9tKCkpO1xyXG4gICAgfSxcclxuICAgIGNob2ljZTpmdW5jdGlvbihzYW1wbGVzKXtcclxuICAgICAgICByZXR1cm4gc2FtcGxlc1t0aGlzLnJhbmRpbnQoMCxzYW1wbGVzLmxlbmd0aCldO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvcmFuZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIHNuaXAobWFwLCBtaW5YLCBtaW5ZKSB7XHJcbiAgICBpZihtaW5YIT09MCl7XHJcbiAgICAgICAgY29uc3QgcHVzaCA9IC1taW5YO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvcnJlY3RlZE1hcCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgeSBpbiBtYXApe1xyXG4gICAgICAgICAgICBmb3IobGV0IHggaW4gbWFwW3ldKXtcclxuICAgICAgICAgICAgICAgIGlmKCFjb3JyZWN0ZWRNYXBbeV0pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlY3RlZE1hcFt5XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3ldW3BhcnNlSW50KHgpK3B1c2hdID0gbWFwW3ldW3BhcnNlSW50KHgpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFwID0gY29ycmVjdGVkTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKG1pblkhPT0wKXtcclxuICAgICAgICBjb25zdCBwdXNoID0gLW1pblk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29ycmVjdGVkTWFwID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5IGluIG1hcCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeCBpbiBtYXBbeV0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWNvcnJlY3RlZE1hcFtwYXJzZUludCh5KStwdXNoXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3BhcnNlSW50KHkpK3B1c2hdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbcGFyc2VJbnQoeSkrcHVzaF1beF0gPSBtYXBbcGFyc2VJbnQoeSldW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXAgPSBjb3JyZWN0ZWRNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICBjb25zdCBuZXdNYXAgPSBbXTtcclxuXHJcbiAgICBsZXQgd2lkdGggPSAwO1xyXG4gICAgZm9yKGxldCBpPTA7aTxtYXAubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgaWYobWFwW2ldLmxlbmd0aD53aWR0aCl7XHJcbiAgICAgICAgICAgIHdpZHRoID0gbWFwW2ldLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY1ggPSBNYXRoLmNlaWwod2lkdGgvMik7XHJcbiAgICBjb25zdCBjWSA9IE1hdGguY2VpbChtYXAubGVuZ3RoLzIpO1xyXG5cclxuICAgIGxldCBsb3dlc3RYID0gOTk5OTtcclxuICAgIGxldCBsb3dlc3RZID0gOTk5OTtcclxuXHJcbiAgICBmb3IobGV0IHk9MDt5PG1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICBmb3IobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmZYID0geC1jWDtcclxuICAgICAgICAgICAgY29uc3QgZGlmZlkgPSB5LWNZO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3WCA9IGNYLWRpZmZZO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdZID0gY1krZGlmZlg7XHJcblxyXG4gICAgICAgICAgICBpZighbmV3TWFwW25ld1ldKXtcclxuICAgICAgICAgICAgICAgIG5ld01hcFtuZXdZXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld01hcFtuZXdZXVtuZXdYXSA9IG1hcFt5XVt4XTtcclxuXHJcbiAgICAgICAgICAgIGlmKG5ld1g8bG93ZXN0WCl7XHJcbiAgICAgICAgICAgICAgICBsb3dlc3RYID0gbmV3WDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihuZXdZPGxvd2VzdFkpe1xyXG4gICAgICAgICAgICAgICAgbG93ZXN0WSA9IG5ld1k7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmluYWwgPSBzbmlwKG5ld01hcCxsb3dlc3RYLGxvd2VzdFkpO1xyXG5cclxuICAgIHJldHVybiBmaW5hbDtcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5jb25zdCByb3RhdGVMaXN0ID0gcmVxdWlyZShcIi4vcm90YXRlTGlzdFwiKTtcclxuY29uc3QgYmxvY2tzID0gcmVxdWlyZShcIi4vYmxvY2tzXCIpO1xyXG5jb25zdCBtdXNpYyA9IHJlcXVpcmUoXCIuL211c2ljXCIpO1xyXG5cclxuY29uc3QgZ3JpZFg9NjYwO2NvbnN0IGdyaWRZPTQ1MDtjb25zdCBncmlkU2l6ZT02MDA7XHJcbmNvbnN0IGNlbGxTaXplID0gNTA7XHJcbmNvbnN0IHRvcFg9Z3JpZFgrY2VsbFNpemUqNDtcclxuY29uc3QgdG9wWT1ncmlkWS1jZWxsU2l6ZSo2O1xyXG5cclxudmFyIGMsIGN0eDtcclxuY29uc3QgaW1hZ2VzID0ge2Nhc3RsZTp1bmRlZmluZWR9O1xyXG5cclxudmFyIGNvdW50ID0gMDtcclxudmFyIHN0YXJ0ZWQgPSBmYWxzZTtcclxudmFyIGdhbWVPdmVyID0gZmFsc2U7XHJcblxyXG5sZXQgc2NvcmUgPSAwO1xyXG5cclxudmFyIGN1cnJlbnRCbG9jaztcclxudmFyIGZhbGxlblBpZWNlcyA9IFtdO1xyXG5cclxudmFyIHNwZWVkVXAgPSAxO1xyXG52YXIgZG93biA9IGZhbHNlO1xyXG5cclxudmFyIHByZXZEdCA9IERhdGUubm93KCk7XHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZURUKCl7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgZGVsdGEgPSAobm93IC0gcHJldkR0KS8xMDAwO1xyXG4gICAgcHJldkR0ID0gbm93O1xyXG4gICAgcmV0dXJuIGRlbHRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiByb3dDaGVjaygpe1xyXG4gICAgY29uc3Qgcm93cyA9IFtdO1xyXG5cclxuICAgIC8vT3JnYW5pc2VzIGluZGV4ZXMgaW50byByb3dzXHJcbiAgICBmb3IobGV0IGk9MDtpPGZhbGxlblBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBjb25zdCB5ID0gZmFsbGVuUGllY2VzW2ldWzFdO1xyXG5cclxuICAgICAgICBjb25zdCByb3dJZCA9IE1hdGguZmxvb3IoKHktdG9wWSkvY2VsbFNpemUpO1xyXG5cclxuICAgICAgICBpZighcm93c1tyb3dJZF0pey8vIENyZWF0ZXMgcm93IGlmIG5vdCBhbHJlYWR5IG1hZGVcclxuICAgICAgICAgICAgcm93c1tyb3dJZF0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvd3Nbcm93SWRdLnB1c2goZmFsbGVuUGllY2VzW2ldKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IobGV0IGo9MDtqPHJvd3MubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgaWYocm93c1tqXSl7Ly8gSWYgYSBwaWVjZSB3YXMgYWN0dWFsbHkgaW4gdGhpcyByb3dcclxuICAgICAgICAgICAgY29uc3QgYW1udEluUm93ID0gcm93c1tqXS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyAxMiBpcyB0aGUgYW1vdW50IGZvciBhIGJyZWFrLlxyXG4gICAgICAgICAgICBpZihhbW50SW5Sb3c+MTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93UmVtb3ZlWSA9IGZhbGxlblBpZWNlc1tmYWxsZW5QaWVjZXMuaW5kZXhPZihyb3dzW2pdWzBdKV1bMV07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBrPTA7azxhbW50SW5Sb3c7aysrKXtcclxuICAgICAgICAgICAgICAgICAgICBmYWxsZW5QaWVjZXMuc3BsaWNlKGZhbGxlblBpZWNlcy5pbmRleE9mKHJvd3Nbal1ba10pLDEpOy8vUmVtb3ZlcyBhbGwgcGllY2VzIGluIGZpbmlzaGVkIHJvd1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1vdmVzIGFsbCBhYm92ZSBwaWVjZXMgZG93blxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBjb3VudGVyPTA7Y291bnRlcjxmYWxsZW5QaWVjZXMubGVuZ3RoO2NvdW50ZXIrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZmFsbGVuUGllY2VzW2NvdW50ZXJdWzFdIDwgcm93UmVtb3ZlWSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgdGhpcyBwaWVjZSBkb3duXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbGxlblBpZWNlc1tjb3VudGVyXVsxXSArPSBjZWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0b3BCbG9jaygpe1xyXG4gICAgZmFsbGVuUGllY2VzID0gZmFsbGVuUGllY2VzLmNvbmNhdChjdXJyZW50QmxvY2suZ2V0UGllY2VzKCkpO1xyXG4gICAgXHJcbiAgICBjdXJyZW50QmxvY2sgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgc3BlZWRVcCArPSAwLjE7XHJcblxyXG4gICAgcm93Q2hlY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb3ZlKCl7XHJcbiAgICBjb25zdCBwaWVjZXMgPSBjdXJyZW50QmxvY2suZ2V0UGllY2VzKCk7XHJcbiAgICBmb3IobGV0IGk9MDtpPHBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBmb3IobGV0IGo9MDtqPGZhbGxlblBpZWNlcy5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdID09PSBmYWxsZW5QaWVjZXNbal1bMF0gJiYgcGllY2VzW2ldWzFdID09PSBmYWxsZW5QaWVjZXNbal1bMV0pe1xyXG4gICAgICAgICAgICAgICAgLy8gaGl0IGFub3RoZXIgYmxvY2suXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGllY2VzW2ldWzFdIDwgZ3JpZFkpe1xyXG4gICAgICAgICAgICAvLyBJbiB0b3Agc2VjdGlvblxyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMF0gPCB0b3BYIHx8IHBpZWNlc1tpXVswXSA+IHRvcFggKyBjZWxsU2l6ZSAqIDMpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdIDwgZ3JpZFggfHwgcGllY2VzW2ldWzBdID49IGdyaWRYK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzFdID49IGdyaWRZK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVudSAoKSB7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdDtcclxuICAgIHdoaWxlKGNvdW50PjIpe1xyXG4gICAgICAgIGNvdW50IC09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiSmFwYW5lc2UgQ2FzdGxlcyBUZXRyaXNcIiwzMDAsNTAwLDEwMCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJCeSBEYW5pZWwsIEFkcmllbCBhbmQgSmFzb25cIiwgNTUwLCA3MDAsIDUwKTtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgRjExIHRvIGdvIGZ1bGxzY3JlZW5cIiwgNTcwLCA4MDAsIDUwKTtcclxuICAgIFxyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gY291bnQ+MT8yLWNvdW50OmNvdW50O1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyB0aGUgc3BhY2UgYmFyIHRvIHN0YXJ0XCIsNTUwLDkwMCw1MCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lKCl7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdCooNCpkb3duKzEpKnNwZWVkVXA7Ly8gQWNjZWxlcmF0ZXMgd2hlbiBkb3duIGtleSBpcyBoZWxkXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCwwLDAsYy53aWR0aCxjLmhlaWdodCk7XHJcblxyXG4gICAgLy8gRHJhdyBmcmFtZVxyXG4gICAgZ3JhcGhpY3MuaW1hZ2UoY3R4LGltYWdlcy5jYXN0bGUsKGMud2lkdGgtaW1hZ2VzLmNhc3RsZS53aWR0aCkvMiwtODApO1xyXG5cclxuICAgIC8vIFNjb3JlXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgU2NvcmU6ICR7c2NvcmV9YCwyMCw1MCw1MCk7XHJcblxyXG4gICAgLy8gRnJhbWVcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LGdyaWRYLGdyaWRZLGdyaWRTaXplLGdyaWRTaXplKTtcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LHRvcFgsdG9wWSxjZWxsU2l6ZSo0LGNlbGxTaXplKjYpO1xyXG4gICAgZ3JhcGhpY3MubGluZXMoY3R4LFtcclxuICAgICAgICBbdG9wWCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LHRvcFldLFxyXG4gICAgICAgIFt0b3BYK2NlbGxTaXplKjQsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWV0sXHJcbiAgICAgICAgW2dyaWRYK2dyaWRTaXplLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFkrZ3JpZFNpemVdLFxyXG4gICAgICAgIFtncmlkWCxncmlkWV0sXHJcbiAgICAgICAgW3RvcFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLHRvcFldXHJcbiAgICBdKTtcclxuXHJcbiAgICAvLyBEcmF3IGdyaWRcclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGdyaWRTaXplO2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgaStncmlkWCwgZ3JpZFksIGkrZ3JpZFgsIGdyaWRZK2dyaWRTaXplLCA1KTtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgZ3JpZFgsIGdyaWRZK2ksIGdyaWRYK2dyaWRTaXplLCBncmlkWStpLCA1KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGNlbGxTaXplKjg7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCB0b3BYLCB0b3BZK2ksIHRvcFgrY2VsbFNpemUqNCwgdG9wWStpLCA1KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGNlbGxTaXplKjQ7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCB0b3BYK2ksIHRvcFksIHRvcFgraSwgdG9wWStjZWxsU2l6ZSo2LCA1KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMb2dpY1xyXG4gICAgaWYoIWN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrID0gbmV3IChyYW5kb20uY2hvaWNlKGJsb2NrcykpKHRvcFgsdG9wWSk7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnggPSB0b3BYICsgY2VsbFNpemUgKiAoMi1NYXRoLmZsb29yKGN1cnJlbnRCbG9jay53aWR0aC8yKSk7XHJcblxyXG4gICAgICAgIGlmKGNoZWNrTW92ZSgpKXtcclxuICAgICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgc2NvcmUgKz0gY3VycmVudEJsb2NrLmdldFBpZWNlcygpLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUoY291bnQ+MC41KXtcclxuICAgICAgICBjb3VudC09MC41O1xyXG5cclxuICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAvL01vdmUgY3VycmVudEJsb2NrIGRvd25cclxuICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgKz0gY2VsbFNpemU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihjaGVja01vdmUoKSl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueSAtPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBzdG9wQmxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IobGV0IGk9MDtpPGZhbGxlblBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBncmFwaGljcy5yZW5kZXJCbG9jayhjdHgsZmFsbGVuUGllY2VzW2ldWzBdLGZhbGxlblBpZWNlc1tpXVsxXSxmYWxsZW5QaWVjZXNbaV1bMl0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnJlbmRlcihjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGdhbWVPdmVyKXtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWVPdmVyTG9vcCgpe1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG5cclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgR2FtZSBPdmVyLiBTY29yZTogJHtzY29yZX1gLDEwMCw1MDAsMTUwKTtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNcIik7XHJcbiAgICBjdHggPSBjLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBpbWFnZXMuY2FzdGxlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZXMuY2FzdGxlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAvLyBTdGFydHMgbXVzaWNcclxuICAgICAgICBtdXNpYy5zdGFydCgpO1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWVudSk7XHJcbiAgICB9XHJcbiAgICBpbWFnZXMuY2FzdGxlLnNyYyA9IFwiLi9pbWFnZXMvcGxhbi5qcGdcIjtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57XHJcbiAgICBjb25zdCB3ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcbiAgICBcclxuICAgIHN3aXRjaCh3KXtcclxuICAgIGNhc2UgMzI6XHJcbiAgICAgICAgLy9TcGFjZVxyXG4gICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzNzpcclxuICAgICAgICAvL0xlZnRcclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCArPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0ID4gMC43KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZGlkbid0IGp1c3QgaGl0IHRoZSBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgICAgLy9SaWdodFxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdD4wLjcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJdCBkaWRuJ3QganVzdCBoaXQgdGhlIHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSA0MDpcclxuICAgICAgICAvL0Rvd25cclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgZG93biA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzODpcclxuICAgICAgICAvL1VwXHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSBjdXJyZW50QmxvY2suYm9vbE1hcC5jb25jYXQoW10pOy8vIER1cGxpY2F0ZXMgYm9vbE1hcFxyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay5ib29sTWFwID0gcm90YXRlTGlzdChjdXJyZW50QmxvY2suYm9vbE1hcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay5ib29sTWFwID0gb2xkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCA+IDAuNyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGhpdCBzb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PntcclxuICAgIGNvbnN0IHcgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuXHJcbiAgICBpZih3PT09NDApe1xyXG4gICAgICAgIGRvd24gPSBmYWxzZTtcclxuICAgIH1cclxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5jb25zdCByb3RhdGVMaXN0ID0gcmVxdWlyZShcIi4vcm90YXRlTGlzdFwiKTtcclxuXHJcbmNvbnN0IGNvbG91cnMgPSBbXHJcbiAgICBcIiNmMDBcIixcclxuICAgIFwiI2ZmMFwiLFxyXG4gICAgXCIjMDBmXCIsXHJcbiAgICBcIiMwZjBcIixcclxuICAgIFwiI2YwZlwiLFxyXG4gICAgXCIjMGZhXCJcclxuXTtcclxuXHJcbmNsYXNzIEJsb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKHgseSxib29sTWFwKXtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5ib29sTWFwID0gYm9vbE1hcDtcclxuICAgICAgICB0aGlzLmNvbCA9IHJhbmRvbS5jaG9pY2UoY29sb3Vycyk7XHJcblxyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gYm9vbE1hcC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmhlaWdodDtpKyspe1xyXG4gICAgICAgICAgICBpZihib29sTWFwW2ldLmxlbmd0aD50aGlzLndpZHRoKXtcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSBib29sTWFwW2ldLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoY3R4KXtcclxuICAgICAgICBmb3IobGV0IHk9MDt5PHRoaXMuYm9vbE1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7eDx0aGlzLmJvb2xNYXBbeV0ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvb2xNYXBbeV1beF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnJlbmRlckJsb2NrKGN0eCx0aGlzLngreCo1MCx0aGlzLnkreSo1MCx0aGlzLmNvbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Qm90dG9tKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuYm9vbE1hcC5sZW5ndGgqNTA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGllY2VzKCl7XHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8dGhpcy5ib29sTWFwLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHg9MDt4PHRoaXMuYm9vbE1hcFt5XS5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9vbE1hcFt5XVt4XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcGllY2VzLnB1c2goW3RoaXMueCt4KjUwLHRoaXMueSt5KjUwLHRoaXMuY29sXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwaWVjZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcExpc3RUb0Jsb2NrcyAobWFwTGlzdCl7XHJcbiAgICBjb25zdCBibG9ja3MgPSBbXTtcclxuICAgIGZvcihsZXQgaT0wO2k8bWFwTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICBibG9ja3MucHVzaChjbGFzcyBleHRlbmRzIEJsb2NrIHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoeCx5KXtcclxuICAgICAgICAgICAgICAgIHN1cGVyKHgseSxtYXBMaXN0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJsb2NrcztcclxufVxyXG5cclxuY29uc3QgYmxvY2tMaXN0UmF3ID0gW1xyXG4gICAgW1xyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzAsMSwxXVxyXG4gICAgXVxyXG5dO1xyXG5jb25zdCBibG9ja0xpc3QgPSBbXTtcclxuZm9yKGxldCBpPTA7aTxibG9ja0xpc3RSYXcubGVuZ3RoO2krKyl7XHJcbiAgICBibG9ja0xpc3QucHVzaChibG9ja0xpc3RSYXdbaV0pO1xyXG4gICAgY29uc3QgbmV4dCA9IHJvdGF0ZUxpc3QoYmxvY2tMaXN0UmF3W2ldKTtcclxuICAgIGJsb2NrTGlzdC5wdXNoKG5leHQpO1xyXG4gICAgY29uc3QgYW5kTmV4dCA9IHJvdGF0ZUxpc3QobmV4dCk7XHJcbiAgICBibG9ja0xpc3QucHVzaChhbmROZXh0KTtcclxuICAgIGNvbnN0IGZpbmFsID0gcm90YXRlTGlzdChhbmROZXh0KTtcclxuICAgIGJsb2NrTGlzdC5wdXNoKGZpbmFsKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXBMaXN0VG9CbG9ja3MoYmxvY2tMaXN0KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ibG9ja3MuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGludHJvTXVzaWM7XHJcbnZhciBtYWluTXVzaWM7XHJcblxyXG52YXIgYWxyZWFkeUxvYWRlZEludHJvID0gZmFsc2U7XHJcbnZhciBhbHJlYWR5TG9hZGVkTWFpbiA9IGZhbHNlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBzdGFydDpmdW5jdGlvbigpe1xyXG4gICAgICAgIGludHJvTXVzaWMgPSBuZXcgQXVkaW8oKTtcclxuICAgICAgICBtYWluTXVzaWMgPSBuZXcgQXVkaW8oKTtcclxuXHJcbiAgICAgICAgaW50cm9NdXNpYy5vbmNhbnBsYXl0aHJvdWdoID0gKCk9PntcclxuICAgICAgICAgICAgaWYoIWFscmVhZHlMb2FkZWRJbnRybyl7XHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5TG9hZGVkSW50cm8gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIG1haW5NdXNpYy5vbmNhbnBsYXl0aHJvdWdoID0gKCk9PntcclxuICAgICAgICAgICAgICAgICAgICBpZighYWxyZWFkeUxvYWRlZE1haW4pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbHJlYWR5TG9hZGVkTWFpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdyBldmVyeXRoaW5nJ3MgbG9hZGVkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGF5IHRoZSBtdXNpY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRyb011c2ljLnBsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludHJvTXVzaWMub25lbmRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYXkgdGhlIG5leHQgbXVzaWNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NdXNpYy5sb29wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NdXNpYy5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWFpbk11c2ljLnNyYyA9IFwiLi9tdXNpYy9tdXNpY19tYWluLndhdlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRyb011c2ljLnNyYyA9IFwiLi9tdXNpYy9tdXNpY19pbnRyby53YXZcIjtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL211c2ljLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=