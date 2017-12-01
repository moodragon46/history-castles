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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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
/***/ (function(module, exports, __webpack_require__) {

const graphics = __webpack_require__(0);
const random = __webpack_require__(1);
const rotateList = __webpack_require__(4);
const blocks = __webpack_require__(3);

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
                for(let k=0;k<amntInRow;k++){
                    fallenPieces.splice(fallenPieces.indexOf(rows[j][k]),1);//Removes all pieces in finished row
                }
            }
        }
    }
}

function stopBlock(){
    fallenPieces = fallenPieces.concat(currentBlock.getPieces());
    
    currentBlock = undefined;

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
    count += dt*(4*down+1);// Accelerates when down key is held
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const graphics = __webpack_require__(0);
const random = __webpack_require__(1);


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

        this.width = boolMap.length;
        this.height = 0;
        for(let i=0;i<this.width;i++){
            if(boolMap[i].length>this.height){
                this.height = boolMap[i].length;
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

module.exports = mapListToBlocks([
    [
        [1],
        [1,1]
    ],
    [
        [1,1],
        [1]
    ],
    [
        [0,1],
        [1,1]
    ],
    [
        [1,1],
        [0,1]
    ],
    [
        [1,1,1],
        [1]
    ],
    [
        [1,1,1],
        [0,0,1]
    ],
    [
        [1,1],
        [1],
        [1]
    ],
    [
        [1,1],
        [0,1],
        [0,1]
    ]
]);


/***/ }),
/* 4 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWQwZGRmZjRjNmZkN2IzZjQ2MjgiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixzQkFBc0I7QUFDMUMsd0JBQXdCLHlCQUF5QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDekdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixhQUFhO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxnQkFBZ0IsYUFBYTtBQUM3QixvQkFBb0IsUUFBUTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEMiLCJmaWxlIjoiLi9wdWJsaWMvYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDVkMGRkZmY0YzZmZDdiM2Y0NjI4IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByZWN0OmZ1bmN0aW9uKGN0eCx4LHksdyxoLGNvbCl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbHx8XCIjMDAwXCI7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgseSx3LGgpO1xyXG4gICAgfSxcclxuICAgIHJlY3RPdXRsaW5lOmZ1bmN0aW9uKGN0eCx4LHksdyxoLHNpemUsY29sKXtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlY3QoeCx5LHcsaCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIGxpbmU6ZnVuY3Rpb24oY3R4LHgxLHkxLHgyLHkyLHNpemUsY29sKXtcclxuICAgICAgICBjdHgubGluZUNhcD1cInJvdW5kXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeDEseTEpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeDIseTIpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICBsaW5lczpmdW5jdGlvbihjdHgsbGluZXMsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5saW5lQ2FwPVwicm91bmRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGluZXNbMF1bMF0sbGluZXNbMF1bMV0pO1xyXG4gICAgICAgIGZvcihsZXQgaT0xO2k8bGluZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8obGluZXNbaV1bMF0sbGluZXNbaV1bMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgdGV4dDpmdW5jdGlvbihjdHgsdGV4dCx4LHksc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5mb250ID0gYCR7c2l6ZXx8MTAwfXB4IENvbnNvbGFzYDtcclxuICAgICAgICBjdHguZmlsbFRleHQodGV4dCwgeCwgeSk7XHJcbiAgICB9LFxyXG4gICAgaW1hZ2U6ZnVuY3Rpb24oY3R4LGltZyx4LHkpe1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLHgseSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQmxvY2s6ZnVuY3Rpb24oY3R4LHgseSxjb2wsc2l6ZSl7XHJcbiAgICAgICAgY29uc3QgcmVhbFMgPSBzaXplIHx8IDUwO1xyXG4gICAgICAgIHRoaXMucmVjdChjdHgseCx5LHJlYWxTLHJlYWxTLGNvbCk7XHJcbiAgICAgICAgdGhpcy5yZWN0T3V0bGluZShjdHgseCx5LHJlYWxTLHJlYWxTKTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2dyYXBoaWNzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmFuZGludDpmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gbWluK01hdGguZmxvb3IoKG1heC1taW4pKk1hdGgucmFuZG9tKCkpO1xyXG4gICAgfSxcclxuICAgIGNob2ljZTpmdW5jdGlvbihzYW1wbGVzKXtcclxuICAgICAgICByZXR1cm4gc2FtcGxlc1t0aGlzLnJhbmRpbnQoMCxzYW1wbGVzLmxlbmd0aCldO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvcmFuZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGdyYXBoaWNzID0gcmVxdWlyZShcIi4vZ3JhcGhpY3NcIik7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRvbVwiKTtcclxuY29uc3Qgcm90YXRlTGlzdCA9IHJlcXVpcmUoXCIuL3JvdGF0ZUxpc3RcIik7XHJcbmNvbnN0IGJsb2NrcyA9IHJlcXVpcmUoXCIuL2Jsb2Nrc1wiKTtcclxuXHJcbmNvbnN0IGdyaWRYPTY2MDtjb25zdCBncmlkWT00NTA7Y29uc3QgZ3JpZFNpemU9NjAwO1xyXG5jb25zdCBjZWxsU2l6ZSA9IDUwO1xyXG5jb25zdCB0b3BYPWdyaWRYK2NlbGxTaXplKjQ7XHJcbmNvbnN0IHRvcFk9Z3JpZFktY2VsbFNpemUqNjtcclxuXHJcbnZhciBjLCBjdHg7XHJcbmNvbnN0IGltYWdlcyA9IHtjYXN0bGU6dW5kZWZpbmVkfTtcclxuXHJcbnZhciBjb3VudCA9IDA7XHJcbnZhciBzdGFydGVkID0gZmFsc2U7XHJcbnZhciBnYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxubGV0IHNjb3JlID0gMDtcclxuXHJcbnZhciBjdXJyZW50QmxvY2s7XHJcbnZhciBmYWxsZW5QaWVjZXMgPSBbXTtcclxuXHJcbnZhciBkb3duID0gZmFsc2U7XHJcblxyXG52YXIgcHJldkR0ID0gRGF0ZS5ub3coKTtcclxuZnVuY3Rpb24gY2FsY3VsYXRlRFQoKXtcclxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCBkZWx0YSA9IChub3cgLSBwcmV2RHQpLzEwMDA7XHJcbiAgICBwcmV2RHQgPSBub3c7XHJcbiAgICByZXR1cm4gZGVsdGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvd0NoZWNrKCl7XHJcbiAgICBjb25zdCByb3dzID0gW107XHJcblxyXG4gICAgLy9PcmdhbmlzZXMgaW5kZXhlcyBpbnRvIHJvd3NcclxuICAgIGZvcihsZXQgaT0wO2k8ZmFsbGVuUGllY2VzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGNvbnN0IHkgPSBmYWxsZW5QaWVjZXNbaV1bMV07XHJcblxyXG4gICAgICAgIGNvbnN0IHJvd0lkID0gTWF0aC5mbG9vcigoeS10b3BZKS9jZWxsU2l6ZSk7XHJcblxyXG4gICAgICAgIGlmKCFyb3dzW3Jvd0lkXSl7Ly8gQ3JlYXRlcyByb3cgaWYgbm90IGFscmVhZHkgbWFkZVxyXG4gICAgICAgICAgICByb3dzW3Jvd0lkXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93c1tyb3dJZF0ucHVzaChmYWxsZW5QaWVjZXNbaV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcihsZXQgaj0wO2o8cm93cy5sZW5ndGg7aisrKXtcclxuICAgICAgICBpZihyb3dzW2pdKXsvLyBJZiBhIHBpZWNlIHdhcyBhY3R1YWxseSBpbiB0aGlzIHJvd1xyXG4gICAgICAgICAgICBjb25zdCBhbW50SW5Sb3cgPSByb3dzW2pdLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIDEyIGlzIHRoZSBhbW91bnQgZm9yIGEgYnJlYWsuXHJcbiAgICAgICAgICAgIGlmKGFtbnRJblJvdz4xMSl7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGs9MDtrPGFtbnRJblJvdztrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGZhbGxlblBpZWNlcy5zcGxpY2UoZmFsbGVuUGllY2VzLmluZGV4T2Yocm93c1tqXVtrXSksMSk7Ly9SZW1vdmVzIGFsbCBwaWVjZXMgaW4gZmluaXNoZWQgcm93XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0b3BCbG9jaygpe1xyXG4gICAgZmFsbGVuUGllY2VzID0gZmFsbGVuUGllY2VzLmNvbmNhdChjdXJyZW50QmxvY2suZ2V0UGllY2VzKCkpO1xyXG4gICAgXHJcbiAgICBjdXJyZW50QmxvY2sgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgcm93Q2hlY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb3ZlKCl7XHJcbiAgICBjb25zdCBwaWVjZXMgPSBjdXJyZW50QmxvY2suZ2V0UGllY2VzKCk7XHJcbiAgICBmb3IobGV0IGk9MDtpPHBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBmb3IobGV0IGo9MDtqPGZhbGxlblBpZWNlcy5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdID09PSBmYWxsZW5QaWVjZXNbal1bMF0gJiYgcGllY2VzW2ldWzFdID09PSBmYWxsZW5QaWVjZXNbal1bMV0pe1xyXG4gICAgICAgICAgICAgICAgLy8gaGl0IGFub3RoZXIgYmxvY2suXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGllY2VzW2ldWzFdIDwgZ3JpZFkpe1xyXG4gICAgICAgICAgICAvLyBJbiB0b3Agc2VjdGlvblxyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMF0gPCB0b3BYIHx8IHBpZWNlc1tpXVswXSA+IHRvcFggKyBjZWxsU2l6ZSAqIDMpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdIDwgZ3JpZFggfHwgcGllY2VzW2ldWzBdID49IGdyaWRYK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzFdID49IGdyaWRZK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVudSAoKSB7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdDtcclxuICAgIHdoaWxlKGNvdW50PjIpe1xyXG4gICAgICAgIGNvdW50IC09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiSmFwYW5lc2UgQ2FzdGxlcyBUZXRyaXNcIiwzMDAsNTAwLDEwMCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJCeSBEYW5pZWwsIEFkcmllbCBhbmQgSmFzb25cIiwgNTUwLCA3MDAsIDUwKTtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgRjExIHRvIGdvIGZ1bGxzY3JlZW5cIiwgNTcwLCA4MDAsIDUwKTtcclxuICAgIFxyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gY291bnQ+MT8yLWNvdW50OmNvdW50O1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyB0aGUgc3BhY2UgYmFyIHRvIHN0YXJ0XCIsNTUwLDkwMCw1MCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lKCl7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdCooNCpkb3duKzEpOy8vIEFjY2VsZXJhdGVzIHdoZW4gZG93biBrZXkgaXMgaGVsZFxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIC8vIERyYXcgZnJhbWVcclxuICAgIGdyYXBoaWNzLmltYWdlKGN0eCxpbWFnZXMuY2FzdGxlLChjLndpZHRoLWltYWdlcy5jYXN0bGUud2lkdGgpLzIsLTgwKTtcclxuXHJcbiAgICAvLyBTY29yZVxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsYFNjb3JlOiAke3Njb3JlfWAsMjAsNTAsNTApO1xyXG5cclxuICAgIC8vIEZyYW1lXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCxncmlkWCxncmlkWSxncmlkU2l6ZSxncmlkU2l6ZSk7XHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCx0b3BYLHRvcFksY2VsbFNpemUqNCxjZWxsU2l6ZSo2KTtcclxuICAgIGdyYXBoaWNzLmxpbmVzKGN0eCxbXHJcbiAgICAgICAgW3RvcFgsdG9wWV0sXHJcbiAgICAgICAgW3RvcFgrY2VsbFNpemUqNCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LGdyaWRZXSxcclxuICAgICAgICBbZ3JpZFgrZ3JpZFNpemUsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWStncmlkU2l6ZV0sXHJcbiAgICAgICAgW2dyaWRYLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLGdyaWRZXSxcclxuICAgICAgICBbdG9wWCx0b3BZXVxyXG4gICAgXSk7XHJcblxyXG4gICAgLy8gRHJhdyBncmlkXHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxncmlkU2l6ZTtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGkrZ3JpZFgsIGdyaWRZLCBpK2dyaWRYLCBncmlkWStncmlkU2l6ZSwgNSk7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGdyaWRYLCBncmlkWStpLCBncmlkWCtncmlkU2l6ZSwgZ3JpZFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo4O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCwgdG9wWStpLCB0b3BYK2NlbGxTaXplKjQsIHRvcFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo0O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCtpLCB0b3BZLCB0b3BYK2ksIHRvcFkrY2VsbFNpemUqNiwgNSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9naWNcclxuICAgIGlmKCFjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IG5ldyAocmFuZG9tLmNob2ljZShibG9ja3MpKSh0b3BYLHRvcFkpO1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay54ID0gdG9wWCArIGNlbGxTaXplICogKDItTWF0aC5mbG9vcihjdXJyZW50QmxvY2sud2lkdGgvMikpO1xyXG5cclxuICAgICAgICBpZihjaGVja01vdmUoKSl7XHJcbiAgICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHNjb3JlICs9IGN1cnJlbnRCbG9jay5nZXRQaWVjZXMoKS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlKGNvdW50PjAuNSl7XHJcbiAgICAgICAgY291bnQtPTAuNTtcclxuXHJcbiAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgLy9Nb3ZlIGN1cnJlbnRCbG9jayBkb3duXHJcbiAgICAgICAgICAgIGN1cnJlbnRCbG9jay55ICs9IGNlbGxTaXplO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2hlY2tNb3ZlKCkpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgLT0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKGxldCBpPTA7aTxmYWxsZW5QaWVjZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgZ3JhcGhpY3MucmVuZGVyQmxvY2soY3R4LGZhbGxlblBpZWNlc1tpXVswXSxmYWxsZW5QaWVjZXNbaV1bMV0sZmFsbGVuUGllY2VzW2ldWzJdKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihnYW1lT3Zlcil7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVPdmVyTG9vcCk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lT3Zlckxvb3AoKXtcclxuICAgIGNvbnN0IGR0ID0gY2FsY3VsYXRlRFQoKTtcclxuXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCwwLDAsYy53aWR0aCxjLmhlaWdodCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsYEdhbWUgT3Zlci4gU2NvcmU6ICR7c2NvcmV9YCwxMDAsNTAwLDE1MCk7XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVPdmVyTG9vcCk7XHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjXCIpO1xyXG4gICAgY3R4ID0gYy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgaW1hZ2VzLmNhc3RsZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2VzLmNhc3RsZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2VzLmNhc3RsZS5zcmMgPSBcIi4vaW1hZ2VzL3BsYW4uanBnXCI7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+e1xyXG4gICAgY29uc3QgdyA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xyXG4gICAgXHJcbiAgICBzd2l0Y2godyl7XHJcbiAgICBjYXNlIDMyOlxyXG4gICAgICAgIC8vU3BhY2VcclxuICAgICAgICBzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzc6XHJcbiAgICAgICAgLy9MZWZ0XHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCAtPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjaGVja01vdmUoKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCA+IDAuNyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0IGRpZG4ndCBqdXN0IGhpdCB0aGUgc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wQmxvY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM5OlxyXG4gICAgICAgIC8vUmlnaHRcclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54ICs9IGNlbGxTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCAtPSBjZWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQ+MC43KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZGlkbid0IGp1c3QgaGl0IHRoZSBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgICAgLy9Eb3duXHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGRvd24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzg6XHJcbiAgICAgICAgLy9VcFxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gY3VycmVudEJsb2NrLmJvb2xNYXAuY29uY2F0KFtdKTsvLyBEdXBsaWNhdGVzIGJvb2xNYXBcclxuXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2suYm9vbE1hcCA9IHJvdGF0ZUxpc3QoY3VycmVudEJsb2NrLmJvb2xNYXApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2suYm9vbE1hcCA9IG9sZDtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQgPiAwLjcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBoaXQgc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsKGUpPT57XHJcbiAgICBjb25zdCB3ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcblxyXG4gICAgaWYodz09PTQwKXtcclxuICAgICAgICBkb3duID0gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGdyYXBoaWNzID0gcmVxdWlyZShcIi4vZ3JhcGhpY3NcIik7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRvbVwiKTtcclxuXHJcblxyXG5jb25zdCBjb2xvdXJzID0gW1xyXG4gICAgXCIjZjAwXCIsXHJcbiAgICBcIiNmZjBcIixcclxuICAgIFwiIzAwZlwiLFxyXG4gICAgXCIjMGYwXCIsXHJcbiAgICBcIiNmMGZcIixcclxuICAgIFwiIzBmYVwiXHJcbl07XHJcblxyXG5jbGFzcyBCbG9jayB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LHksYm9vbE1hcCl7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuYm9vbE1hcCA9IGJvb2xNYXA7XHJcbiAgICAgICAgdGhpcy5jb2wgPSByYW5kb20uY2hvaWNlKGNvbG91cnMpO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gYm9vbE1hcC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy53aWR0aDtpKyspe1xyXG4gICAgICAgICAgICBpZihib29sTWFwW2ldLmxlbmd0aD50aGlzLmhlaWdodCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IGJvb2xNYXBbaV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjdHgpe1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8dGhpcy5ib29sTWFwLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHg9MDt4PHRoaXMuYm9vbE1hcFt5XS5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9vbE1hcFt5XVt4XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MucmVuZGVyQmxvY2soY3R4LHRoaXMueCt4KjUwLHRoaXMueSt5KjUwLHRoaXMuY29sKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRCb3R0b20oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5ib29sTWFwLmxlbmd0aCo1MDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQaWVjZXMoKXtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBwaWVjZXMucHVzaChbdGhpcy54K3gqNTAsdGhpcy55K3kqNTAsdGhpcy5jb2xdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBpZWNlcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFwTGlzdFRvQmxvY2tzIChtYXBMaXN0KXtcclxuICAgIGNvbnN0IGJsb2NrcyA9IFtdO1xyXG4gICAgZm9yKGxldCBpPTA7aTxtYXBMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGJsb2Nrcy5wdXNoKGNsYXNzIGV4dGVuZHMgQmxvY2sge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvcih4LHkpe1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoeCx5LG1hcExpc3RbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmxvY2tzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hcExpc3RUb0Jsb2NrcyhbXHJcbiAgICBbXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMCwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxLDFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxLDFdLFxyXG4gICAgICAgIFswLDAsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMCwxXVxyXG4gICAgXVxyXG5dKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvYmxvY2tzLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIHNuaXAobWFwLCBtaW5YLCBtaW5ZKSB7XHJcbiAgICBpZihtaW5YIT09MCl7XHJcbiAgICAgICAgY29uc3QgcHVzaCA9IC1taW5YO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvcnJlY3RlZE1hcCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgeSBpbiBtYXApe1xyXG4gICAgICAgICAgICBmb3IobGV0IHggaW4gbWFwW3ldKXtcclxuICAgICAgICAgICAgICAgIGlmKCFjb3JyZWN0ZWRNYXBbeV0pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlY3RlZE1hcFt5XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3ldW3BhcnNlSW50KHgpK3B1c2hdID0gbWFwW3ldW3BhcnNlSW50KHgpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFwID0gY29ycmVjdGVkTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKG1pblkhPT0wKXtcclxuICAgICAgICBjb25zdCBwdXNoID0gLW1pblk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29ycmVjdGVkTWFwID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5IGluIG1hcCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeCBpbiBtYXBbeV0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWNvcnJlY3RlZE1hcFtwYXJzZUludCh5KStwdXNoXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3BhcnNlSW50KHkpK3B1c2hdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbcGFyc2VJbnQoeSkrcHVzaF1beF0gPSBtYXBbcGFyc2VJbnQoeSldW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXAgPSBjb3JyZWN0ZWRNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICBjb25zdCBuZXdNYXAgPSBbXTtcclxuXHJcbiAgICBsZXQgd2lkdGggPSAwO1xyXG4gICAgZm9yKGxldCBpPTA7aTxtYXAubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgaWYobWFwW2ldLmxlbmd0aD53aWR0aCl7XHJcbiAgICAgICAgICAgIHdpZHRoID0gbWFwW2ldLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY1ggPSBNYXRoLmNlaWwod2lkdGgvMik7XHJcbiAgICBjb25zdCBjWSA9IE1hdGguY2VpbChtYXAubGVuZ3RoLzIpO1xyXG5cclxuICAgIGxldCBsb3dlc3RYID0gOTk5OTtcclxuICAgIGxldCBsb3dlc3RZID0gOTk5OTtcclxuXHJcbiAgICBmb3IobGV0IHk9MDt5PG1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICBmb3IobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmZYID0geC1jWDtcclxuICAgICAgICAgICAgY29uc3QgZGlmZlkgPSB5LWNZO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3WCA9IGNYLWRpZmZZO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdZID0gY1krZGlmZlg7XHJcblxyXG4gICAgICAgICAgICBpZighbmV3TWFwW25ld1ldKXtcclxuICAgICAgICAgICAgICAgIG5ld01hcFtuZXdZXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld01hcFtuZXdZXVtuZXdYXSA9IG1hcFt5XVt4XTtcclxuXHJcbiAgICAgICAgICAgIGlmKG5ld1g8bG93ZXN0WCl7XHJcbiAgICAgICAgICAgICAgICBsb3dlc3RYID0gbmV3WDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihuZXdZPGxvd2VzdFkpe1xyXG4gICAgICAgICAgICAgICAgbG93ZXN0WSA9IG5ld1k7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmluYWwgPSBzbmlwKG5ld01hcCxsb3dlc3RYLGxvd2VzdFkpO1xyXG5cclxuICAgIHJldHVybiBmaW5hbDtcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==