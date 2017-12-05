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
        [1,1,1]
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDRiMmI3ZTkxZmRhZjI2NTAwMmYiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtB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LyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0NGIyYjdlOTFmZGFmMjY1MDAyZiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVjdDpmdW5jdGlvbihjdHgseCx5LHcsaCxjb2wpe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2x8fFwiIzAwMFwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LHksdyxoKTtcclxuICAgIH0sXHJcbiAgICByZWN0T3V0bGluZTpmdW5jdGlvbihjdHgseCx5LHcsaCxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHgseSx3LGgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICBsaW5lOmZ1bmN0aW9uKGN0eCx4MSx5MSx4Mix5MixzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHgxLHkxKTtcclxuICAgICAgICBjdHgubGluZVRvKHgyLHkyKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgbGluZXM6ZnVuY3Rpb24oY3R4LGxpbmVzLHNpemUsY29sKXtcclxuICAgICAgICBjdHgubGluZUNhcD1cInJvdW5kXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxpbmVzWzBdWzBdLGxpbmVzWzBdWzFdKTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPGxpbmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGxpbmVzW2ldWzBdLGxpbmVzW2ldWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIHRleHQ6ZnVuY3Rpb24oY3R4LHRleHQseCx5LHNpemUsY29sKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHguZm9udCA9IGAke3NpemV8fDEwMH1weCBDb25zb2xhc2A7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xyXG4gICAgfSxcclxuICAgIGltYWdlOmZ1bmN0aW9uKGN0eCxpbWcseCx5KXtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZyx4LHkpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlckJsb2NrOmZ1bmN0aW9uKGN0eCx4LHksY29sLHNpemUpe1xyXG4gICAgICAgIGNvbnN0IHJlYWxTID0gc2l6ZSB8fCA1MDtcclxuICAgICAgICB0aGlzLnJlY3QoY3R4LHgseSxyZWFsUyxyZWFsUyxjb2wpO1xyXG4gICAgICAgIHRoaXMucmVjdE91dGxpbmUoY3R4LHgseSxyZWFsUyxyZWFsUyk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ncmFwaGljcy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJhbmRpbnQ6ZnVuY3Rpb24obWluLG1heCl7XHJcbiAgICAgICAgcmV0dXJuIG1pbitNYXRoLmZsb29yKChtYXgtbWluKSpNYXRoLnJhbmRvbSgpKTtcclxuICAgIH0sXHJcbiAgICBjaG9pY2U6ZnVuY3Rpb24oc2FtcGxlcyl7XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZXNbdGhpcy5yYW5kaW50KDAsc2FtcGxlcy5sZW5ndGgpXTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL3JhbmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBzbmlwKG1hcCwgbWluWCwgbWluWSkge1xyXG4gICAgaWYobWluWCE9PTApe1xyXG4gICAgICAgIGNvbnN0IHB1c2ggPSAtbWluWDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb3JyZWN0ZWRNYXAgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHkgaW4gbWFwKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4IGluIG1hcFt5XSl7XHJcbiAgICAgICAgICAgICAgICBpZighY29ycmVjdGVkTWFwW3ldKXtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbeV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvcnJlY3RlZE1hcFt5XVtwYXJzZUludCh4KStwdXNoXSA9IG1hcFt5XVtwYXJzZUludCh4KV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hcCA9IGNvcnJlY3RlZE1hcDtcclxuICAgIH1cclxuXHJcbiAgICBpZihtaW5ZIT09MCl7XHJcbiAgICAgICAgY29uc3QgcHVzaCA9IC1taW5ZO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvcnJlY3RlZE1hcCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgeSBpbiBtYXApe1xyXG4gICAgICAgICAgICBmb3IobGV0IHggaW4gbWFwW3ldKXtcclxuICAgICAgICAgICAgICAgIGlmKCFjb3JyZWN0ZWRNYXBbcGFyc2VJbnQoeSkrcHVzaF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlY3RlZE1hcFtwYXJzZUludCh5KStwdXNoXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3BhcnNlSW50KHkpK3B1c2hdW3hdID0gbWFwW3BhcnNlSW50KHkpXVt4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFwID0gY29ycmVjdGVkTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtYXA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgY29uc3QgbmV3TWFwID0gW107XHJcblxyXG4gICAgbGV0IHdpZHRoID0gMDtcclxuICAgIGZvcihsZXQgaT0wO2k8bWFwLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmKG1hcFtpXS5sZW5ndGg+d2lkdGgpe1xyXG4gICAgICAgICAgICB3aWR0aCA9IG1hcFtpXS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNYID0gTWF0aC5jZWlsKHdpZHRoLzIpO1xyXG4gICAgY29uc3QgY1kgPSBNYXRoLmNlaWwobWFwLmxlbmd0aC8yKTtcclxuXHJcbiAgICBsZXQgbG93ZXN0WCA9IDk5OTk7XHJcbiAgICBsZXQgbG93ZXN0WSA9IDk5OTk7XHJcblxyXG4gICAgZm9yKGxldCB5PTA7eTxtYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgZm9yKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmWCA9IHgtY1g7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmZZID0geS1jWTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ggPSBjWC1kaWZmWTtcclxuICAgICAgICAgICAgY29uc3QgbmV3WSA9IGNZK2RpZmZYO1xyXG5cclxuICAgICAgICAgICAgaWYoIW5ld01hcFtuZXdZXSl7XHJcbiAgICAgICAgICAgICAgICBuZXdNYXBbbmV3WV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdNYXBbbmV3WV1bbmV3WF0gPSBtYXBbeV1beF07XHJcblxyXG4gICAgICAgICAgICBpZihuZXdYPGxvd2VzdFgpe1xyXG4gICAgICAgICAgICAgICAgbG93ZXN0WCA9IG5ld1g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYobmV3WTxsb3dlc3RZKXtcclxuICAgICAgICAgICAgICAgIGxvd2VzdFkgPSBuZXdZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZpbmFsID0gc25pcChuZXdNYXAsbG93ZXN0WCxsb3dlc3RZKTtcclxuXHJcbiAgICByZXR1cm4gZmluYWw7XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9yb3RhdGVMaXN0LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGdyYXBoaWNzID0gcmVxdWlyZShcIi4vZ3JhcGhpY3NcIik7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRvbVwiKTtcclxuY29uc3Qgcm90YXRlTGlzdCA9IHJlcXVpcmUoXCIuL3JvdGF0ZUxpc3RcIik7XHJcbmNvbnN0IGJsb2NrcyA9IHJlcXVpcmUoXCIuL2Jsb2Nrc1wiKTtcclxuXHJcbmNvbnN0IGdyaWRYPTY2MDtjb25zdCBncmlkWT00NTA7Y29uc3QgZ3JpZFNpemU9NjAwO1xyXG5jb25zdCBjZWxsU2l6ZSA9IDUwO1xyXG5jb25zdCB0b3BYPWdyaWRYK2NlbGxTaXplKjQ7XHJcbmNvbnN0IHRvcFk9Z3JpZFktY2VsbFNpemUqNjtcclxuXHJcbnZhciBjLCBjdHg7XHJcbmNvbnN0IGltYWdlcyA9IHtjYXN0bGU6dW5kZWZpbmVkfTtcclxuXHJcbnZhciBjb3VudCA9IDA7XHJcbnZhciBzdGFydGVkID0gZmFsc2U7XHJcbnZhciBnYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxubGV0IHNjb3JlID0gMDtcclxuXHJcbnZhciBjdXJyZW50QmxvY2s7XHJcbnZhciBmYWxsZW5QaWVjZXMgPSBbXTtcclxuXHJcbnZhciBkb3duID0gZmFsc2U7XHJcblxyXG52YXIgcHJldkR0ID0gRGF0ZS5ub3coKTtcclxuZnVuY3Rpb24gY2FsY3VsYXRlRFQoKXtcclxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCBkZWx0YSA9IChub3cgLSBwcmV2RHQpLzEwMDA7XHJcbiAgICBwcmV2RHQgPSBub3c7XHJcbiAgICByZXR1cm4gZGVsdGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvd0NoZWNrKCl7XHJcbiAgICBjb25zdCByb3dzID0gW107XHJcblxyXG4gICAgLy9PcmdhbmlzZXMgaW5kZXhlcyBpbnRvIHJvd3NcclxuICAgIGZvcihsZXQgaT0wO2k8ZmFsbGVuUGllY2VzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGNvbnN0IHkgPSBmYWxsZW5QaWVjZXNbaV1bMV07XHJcblxyXG4gICAgICAgIGNvbnN0IHJvd0lkID0gTWF0aC5mbG9vcigoeS10b3BZKS9jZWxsU2l6ZSk7XHJcblxyXG4gICAgICAgIGlmKCFyb3dzW3Jvd0lkXSl7Ly8gQ3JlYXRlcyByb3cgaWYgbm90IGFscmVhZHkgbWFkZVxyXG4gICAgICAgICAgICByb3dzW3Jvd0lkXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93c1tyb3dJZF0ucHVzaChmYWxsZW5QaWVjZXNbaV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcihsZXQgaj0wO2o8cm93cy5sZW5ndGg7aisrKXtcclxuICAgICAgICBpZihyb3dzW2pdKXsvLyBJZiBhIHBpZWNlIHdhcyBhY3R1YWxseSBpbiB0aGlzIHJvd1xyXG4gICAgICAgICAgICBjb25zdCBhbW50SW5Sb3cgPSByb3dzW2pdLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIDEyIGlzIHRoZSBhbW91bnQgZm9yIGEgYnJlYWsuXHJcbiAgICAgICAgICAgIGlmKGFtbnRJblJvdz4xMSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3dSZW1vdmVZID0gZmFsbGVuUGllY2VzW2ZhbGxlblBpZWNlcy5pbmRleE9mKHJvd3Nbal1bMF0pXVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGs9MDtrPGFtbnRJblJvdztrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGZhbGxlblBpZWNlcy5zcGxpY2UoZmFsbGVuUGllY2VzLmluZGV4T2Yocm93c1tqXVtrXSksMSk7Ly9SZW1vdmVzIGFsbCBwaWVjZXMgaW4gZmluaXNoZWQgcm93XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW92ZXMgYWxsIGFib3ZlIHBpZWNlcyBkb3duXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNvdW50ZXI9MDtjb3VudGVyPGZhbGxlblBpZWNlcy5sZW5ndGg7Y291bnRlcisrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihmYWxsZW5QaWVjZXNbY291bnRlcl1bMV0gPCByb3dSZW1vdmVZKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSB0aGlzIHBpZWNlIGRvd25cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsbGVuUGllY2VzW2NvdW50ZXJdWzFdICs9IGNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcEJsb2NrKCl7XHJcbiAgICBmYWxsZW5QaWVjZXMgPSBmYWxsZW5QaWVjZXMuY29uY2F0KGN1cnJlbnRCbG9jay5nZXRQaWVjZXMoKSk7XHJcbiAgICBcclxuICAgIGN1cnJlbnRCbG9jayA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICByb3dDaGVjaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja01vdmUoKXtcclxuICAgIGNvbnN0IHBpZWNlcyA9IGN1cnJlbnRCbG9jay5nZXRQaWVjZXMoKTtcclxuICAgIGZvcihsZXQgaT0wO2k8cGllY2VzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGZvcihsZXQgaj0wO2o8ZmFsbGVuUGllY2VzLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMF0gPT09IGZhbGxlblBpZWNlc1tqXVswXSAmJiBwaWVjZXNbaV1bMV0gPT09IGZhbGxlblBpZWNlc1tqXVsxXSl7XHJcbiAgICAgICAgICAgICAgICAvLyBoaXQgYW5vdGhlciBibG9jay5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwaWVjZXNbaV1bMV0gPCBncmlkWSl7XHJcbiAgICAgICAgICAgIC8vIEluIHRvcCBzZWN0aW9uXHJcbiAgICAgICAgICAgIGlmKHBpZWNlc1tpXVswXSA8IHRvcFggfHwgcGllY2VzW2ldWzBdID4gdG9wWCArIGNlbGxTaXplICogMyl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMF0gPCBncmlkWCB8fCBwaWVjZXNbaV1bMF0gPj0gZ3JpZFgrZ3JpZFNpemUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMV0gPj0gZ3JpZFkrZ3JpZFNpemUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZW51ICgpIHtcclxuICAgIGNvbnN0IGR0ID0gY2FsY3VsYXRlRFQoKTtcclxuICAgIGNvdW50ICs9IGR0O1xyXG4gICAgd2hpbGUoY291bnQ+Mil7XHJcbiAgICAgICAgY291bnQgLT0gMjtcclxuICAgIH1cclxuXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCwwLDAsYy53aWR0aCxjLmhlaWdodCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJKYXBhbmVzZSBDYXN0bGVzIFRldHJpc1wiLDMwMCw1MDAsMTAwKTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIkJ5IERhbmllbCwgQWRyaWVsIGFuZCBKYXNvblwiLCA1NTAsIDcwMCwgNTApO1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyBGMTEgdG8gZ28gZnVsbHNjcmVlblwiLCA1NzAsIDgwMCwgNTApO1xyXG4gICAgXHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBjb3VudD4xPzItY291bnQ6Y291bnQ7XHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIlByZXNzIHRoZSBzcGFjZSBiYXIgdG8gc3RhcnRcIiw1NTAsOTAwLDUwKTtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcblxyXG4gICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWVudSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWUoKXtcclxuICAgIGNvbnN0IGR0ID0gY2FsY3VsYXRlRFQoKTtcclxuICAgIGNvdW50ICs9IGR0Kig0KmRvd24rMSk7Ly8gQWNjZWxlcmF0ZXMgd2hlbiBkb3duIGtleSBpcyBoZWxkXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCwwLDAsYy53aWR0aCxjLmhlaWdodCk7XHJcblxyXG4gICAgLy8gRHJhdyBmcmFtZVxyXG4gICAgZ3JhcGhpY3MuaW1hZ2UoY3R4LGltYWdlcy5jYXN0bGUsKGMud2lkdGgtaW1hZ2VzLmNhc3RsZS53aWR0aCkvMiwtODApO1xyXG5cclxuICAgIC8vIFNjb3JlXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgU2NvcmU6ICR7c2NvcmV9YCwyMCw1MCw1MCk7XHJcblxyXG4gICAgLy8gRnJhbWVcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LGdyaWRYLGdyaWRZLGdyaWRTaXplLGdyaWRTaXplKTtcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LHRvcFgsdG9wWSxjZWxsU2l6ZSo0LGNlbGxTaXplKjYpO1xyXG4gICAgZ3JhcGhpY3MubGluZXMoY3R4LFtcclxuICAgICAgICBbdG9wWCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LHRvcFldLFxyXG4gICAgICAgIFt0b3BYK2NlbGxTaXplKjQsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWV0sXHJcbiAgICAgICAgW2dyaWRYK2dyaWRTaXplLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFkrZ3JpZFNpemVdLFxyXG4gICAgICAgIFtncmlkWCxncmlkWV0sXHJcbiAgICAgICAgW3RvcFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLHRvcFldXHJcbiAgICBdKTtcclxuXHJcbiAgICAvLyBEcmF3IGdyaWRcclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGdyaWRTaXplO2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgaStncmlkWCwgZ3JpZFksIGkrZ3JpZFgsIGdyaWRZK2dyaWRTaXplLCA1KTtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgZ3JpZFgsIGdyaWRZK2ksIGdyaWRYK2dyaWRTaXplLCBncmlkWStpLCA1KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGNlbGxTaXplKjg7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCB0b3BYLCB0b3BZK2ksIHRvcFgrY2VsbFNpemUqNCwgdG9wWStpLCA1KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGNlbGxTaXplKjQ7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCB0b3BYK2ksIHRvcFksIHRvcFgraSwgdG9wWStjZWxsU2l6ZSo2LCA1KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMb2dpY1xyXG4gICAgaWYoIWN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrID0gbmV3IChyYW5kb20uY2hvaWNlKGJsb2NrcykpKHRvcFgsdG9wWSk7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnggPSB0b3BYICsgY2VsbFNpemUgKiAoMi1NYXRoLmZsb29yKGN1cnJlbnRCbG9jay53aWR0aC8yKSk7XHJcblxyXG4gICAgICAgIGlmKGNoZWNrTW92ZSgpKXtcclxuICAgICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgc2NvcmUgKz0gY3VycmVudEJsb2NrLmdldFBpZWNlcygpLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUoY291bnQ+MC41KXtcclxuICAgICAgICBjb3VudC09MC41O1xyXG5cclxuICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAvL01vdmUgY3VycmVudEJsb2NrIGRvd25cclxuICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgKz0gY2VsbFNpemU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihjaGVja01vdmUoKSl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueSAtPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBzdG9wQmxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IobGV0IGk9MDtpPGZhbGxlblBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBncmFwaGljcy5yZW5kZXJCbG9jayhjdHgsZmFsbGVuUGllY2VzW2ldWzBdLGZhbGxlblBpZWNlc1tpXVsxXSxmYWxsZW5QaWVjZXNbaV1bMl0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnJlbmRlcihjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGdhbWVPdmVyKXtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWVPdmVyTG9vcCgpe1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG5cclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgR2FtZSBPdmVyLiBTY29yZTogJHtzY29yZX1gLDEwMCw1MDAsMTUwKTtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNcIik7XHJcbiAgICBjdHggPSBjLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBpbWFnZXMuY2FzdGxlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZXMuY2FzdGxlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWVudSk7XHJcbiAgICB9XHJcbiAgICBpbWFnZXMuY2FzdGxlLnNyYyA9IFwiLi9pbWFnZXMvcGxhbi5qcGdcIjtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57XHJcbiAgICBjb25zdCB3ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcbiAgICBcclxuICAgIHN3aXRjaCh3KXtcclxuICAgIGNhc2UgMzI6XHJcbiAgICAgICAgLy9TcGFjZVxyXG4gICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzNzpcclxuICAgICAgICAvL0xlZnRcclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCArPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0ID4gMC43KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZGlkbid0IGp1c3QgaGl0IHRoZSBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgICAgLy9SaWdodFxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdD4wLjcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJdCBkaWRuJ3QganVzdCBoaXQgdGhlIHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSA0MDpcclxuICAgICAgICAvL0Rvd25cclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgZG93biA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzODpcclxuICAgICAgICAvL1VwXHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSBjdXJyZW50QmxvY2suYm9vbE1hcC5jb25jYXQoW10pOy8vIER1cGxpY2F0ZXMgYm9vbE1hcFxyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay5ib29sTWFwID0gcm90YXRlTGlzdChjdXJyZW50QmxvY2suYm9vbE1hcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay5ib29sTWFwID0gb2xkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCA+IDAuNyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGhpdCBzb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PntcclxuICAgIGNvbnN0IHcgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuXHJcbiAgICBpZih3PT09NDApe1xyXG4gICAgICAgIGRvd24gPSBmYWxzZTtcclxuICAgIH1cclxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5jb25zdCByb3RhdGVMaXN0ID0gcmVxdWlyZShcIi4vcm90YXRlTGlzdFwiKTtcclxuXHJcbmNvbnN0IGNvbG91cnMgPSBbXHJcbiAgICBcIiNmMDBcIixcclxuICAgIFwiI2ZmMFwiLFxyXG4gICAgXCIjMDBmXCIsXHJcbiAgICBcIiMwZjBcIixcclxuICAgIFwiI2YwZlwiLFxyXG4gICAgXCIjMGZhXCJcclxuXTtcclxuXHJcbmNsYXNzIEJsb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKHgseSxib29sTWFwKXtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5ib29sTWFwID0gYm9vbE1hcDtcclxuICAgICAgICB0aGlzLmNvbCA9IHJhbmRvbS5jaG9pY2UoY29sb3Vycyk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBib29sTWFwLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLndpZHRoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKGJvb2xNYXBbaV0ubGVuZ3RoPnRoaXMuaGVpZ2h0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gYm9vbE1hcFtpXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGN0eCl7XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5yZW5kZXJCbG9jayhjdHgsdGhpcy54K3gqNTAsdGhpcy55K3kqNTAsdGhpcy5jb2wpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEJvdHRvbSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmJvb2xNYXAubGVuZ3RoKjUwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBpZWNlcygpe1xyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PHRoaXMuYm9vbE1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7eDx0aGlzLmJvb2xNYXBbeV0ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvb2xNYXBbeV1beF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlcy5wdXNoKFt0aGlzLngreCo1MCx0aGlzLnkreSo1MCx0aGlzLmNvbF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGllY2VzO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBMaXN0VG9CbG9ja3MgKG1hcExpc3Qpe1xyXG4gICAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgICBmb3IobGV0IGk9MDtpPG1hcExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgYmxvY2tzLnB1c2goY2xhc3MgZXh0ZW5kcyBCbG9jayB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHgseSl7XHJcbiAgICAgICAgICAgICAgICBzdXBlcih4LHksbWFwTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBibG9ja3M7XHJcbn1cclxuXHJcbmNvbnN0IGJsb2NrTGlzdFJhdyA9IFtcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzAsMSwxXVxyXG4gICAgXVxyXG5dO1xyXG5jb25zdCBibG9ja0xpc3QgPSBbXTtcclxuZm9yKGxldCBpPTA7aTxibG9ja0xpc3RSYXcubGVuZ3RoO2krKyl7XHJcbiAgICBibG9ja0xpc3QucHVzaChibG9ja0xpc3RSYXdbaV0pO1xyXG4gICAgY29uc3QgbmV4dCA9IHJvdGF0ZUxpc3QoYmxvY2tMaXN0UmF3W2ldKTtcclxuICAgIGJsb2NrTGlzdC5wdXNoKG5leHQpO1xyXG4gICAgY29uc3QgYW5kTmV4dCA9IHJvdGF0ZUxpc3QobmV4dCk7XHJcbiAgICBibG9ja0xpc3QucHVzaChhbmROZXh0KTtcclxuICAgIGNvbnN0IGZpbmFsID0gcm90YXRlTGlzdChhbmROZXh0KTtcclxuICAgIGJsb2NrTGlzdC5wdXNoKGZpbmFsKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXBMaXN0VG9CbG9ja3MoYmxvY2tMaXN0KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ibG9ja3MuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==