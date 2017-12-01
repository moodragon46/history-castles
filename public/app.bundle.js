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
var fallenBlocks = [];
var fallenPieces = [];

var down = false;

var prevDt = Date.now();
function calculateDT(){
    const now = Date.now();
    const delta = (now - prevDt)/1000;
    prevDt = now;
    return delta;
}

function stopBlock(){
    fallenPieces = fallenPieces.concat(currentBlock.getPieces());
    
    fallenBlocks.push(currentBlock);
    currentBlock = undefined;
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

    for(let i=0;i<fallenBlocks.length;i++){
        fallenBlocks[i].render(ctx);
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
                currentBlock.boolMap = rotateList(currentBlock.boolMap);
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
                    pieces.push([this.x+x*50,this.y+y*50]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjMwNDQwNjU3MWJjMjRhOTVkNWYiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6R0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLGFBQWE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGdCQUFnQixhQUFhO0FBQzdCLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsQyIsImZpbGUiOiIuL3B1YmxpYy9hcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjMwNDQwNjU3MWJjMjRhOTVkNWYiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJlY3Q6ZnVuY3Rpb24oY3R4LHgseSx3LGgsY29sKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sfHxcIiMwMDBcIjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCx5LHcsaCk7XHJcbiAgICB9LFxyXG4gICAgcmVjdE91dGxpbmU6ZnVuY3Rpb24oY3R4LHgseSx3LGgsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgucmVjdCh4LHksdyxoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgbGluZTpmdW5jdGlvbihjdHgseDEseTEseDIseTIsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5saW5lQ2FwPVwicm91bmRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSx5MSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4Mix5Mik7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIGxpbmVzOmZ1bmN0aW9uKGN0eCxsaW5lcyxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsaW5lc1swXVswXSxsaW5lc1swXVsxXSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxsaW5lcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhsaW5lc1tpXVswXSxsaW5lc1tpXVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICB0ZXh0OmZ1bmN0aW9uKGN0eCx0ZXh0LHgseSxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBgJHtzaXplfHwxMDB9cHggQ29uc29sYXNgO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcclxuICAgIH0sXHJcbiAgICBpbWFnZTpmdW5jdGlvbihjdHgsaW1nLHgseSl7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcseCx5KTtcclxuICAgIH0sXHJcbiAgICByZW5kZXJCbG9jazpmdW5jdGlvbihjdHgseCx5LGNvbCxzaXplKXtcclxuICAgICAgICBjb25zdCByZWFsUyA9IHNpemUgfHwgNTA7XHJcbiAgICAgICAgdGhpcy5yZWN0KGN0eCx4LHkscmVhbFMscmVhbFMsY29sKTtcclxuICAgICAgICB0aGlzLnJlY3RPdXRsaW5lKGN0eCx4LHkscmVhbFMscmVhbFMpO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvZ3JhcGhpY3MuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByYW5kaW50OmZ1bmN0aW9uKG1pbixtYXgpe1xyXG4gICAgICAgIHJldHVybiBtaW4rTWF0aC5mbG9vcigobWF4LW1pbikqTWF0aC5yYW5kb20oKSk7XHJcbiAgICB9LFxyXG4gICAgY2hvaWNlOmZ1bmN0aW9uKHNhbXBsZXMpe1xyXG4gICAgICAgIHJldHVybiBzYW1wbGVzW3RoaXMucmFuZGludCgwLHNhbXBsZXMubGVuZ3RoKV07XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9yYW5kb20uanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5jb25zdCByb3RhdGVMaXN0ID0gcmVxdWlyZShcIi4vcm90YXRlTGlzdFwiKTtcclxuY29uc3QgYmxvY2tzID0gcmVxdWlyZShcIi4vYmxvY2tzXCIpO1xyXG5cclxuY29uc3QgZ3JpZFg9NjYwO2NvbnN0IGdyaWRZPTQ1MDtjb25zdCBncmlkU2l6ZT02MDA7XHJcbmNvbnN0IGNlbGxTaXplID0gNTA7XHJcbmNvbnN0IHRvcFg9Z3JpZFgrY2VsbFNpemUqNDtcclxuY29uc3QgdG9wWT1ncmlkWS1jZWxsU2l6ZSo2O1xyXG5cclxudmFyIGMsIGN0eDtcclxuY29uc3QgaW1hZ2VzID0ge2Nhc3RsZTp1bmRlZmluZWR9O1xyXG5cclxudmFyIGNvdW50ID0gMDtcclxudmFyIHN0YXJ0ZWQgPSBmYWxzZTtcclxudmFyIGdhbWVPdmVyID0gZmFsc2U7XHJcblxyXG5sZXQgc2NvcmUgPSAwO1xyXG5cclxudmFyIGN1cnJlbnRCbG9jaztcclxudmFyIGZhbGxlbkJsb2NrcyA9IFtdO1xyXG52YXIgZmFsbGVuUGllY2VzID0gW107XHJcblxyXG52YXIgZG93biA9IGZhbHNlO1xyXG5cclxudmFyIHByZXZEdCA9IERhdGUubm93KCk7XHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZURUKCl7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgZGVsdGEgPSAobm93IC0gcHJldkR0KS8xMDAwO1xyXG4gICAgcHJldkR0ID0gbm93O1xyXG4gICAgcmV0dXJuIGRlbHRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9wQmxvY2soKXtcclxuICAgIGZhbGxlblBpZWNlcyA9IGZhbGxlblBpZWNlcy5jb25jYXQoY3VycmVudEJsb2NrLmdldFBpZWNlcygpKTtcclxuICAgIFxyXG4gICAgZmFsbGVuQmxvY2tzLnB1c2goY3VycmVudEJsb2NrKTtcclxuICAgIGN1cnJlbnRCbG9jayA9IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb3ZlKCl7XHJcbiAgICBjb25zdCBwaWVjZXMgPSBjdXJyZW50QmxvY2suZ2V0UGllY2VzKCk7XHJcbiAgICBmb3IobGV0IGk9MDtpPHBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBmb3IobGV0IGo9MDtqPGZhbGxlblBpZWNlcy5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdID09PSBmYWxsZW5QaWVjZXNbal1bMF0gJiYgcGllY2VzW2ldWzFdID09PSBmYWxsZW5QaWVjZXNbal1bMV0pe1xyXG4gICAgICAgICAgICAgICAgLy8gaGl0IGFub3RoZXIgYmxvY2suXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGllY2VzW2ldWzFdIDwgZ3JpZFkpe1xyXG4gICAgICAgICAgICAvLyBJbiB0b3Agc2VjdGlvblxyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMF0gPCB0b3BYIHx8IHBpZWNlc1tpXVswXSA+IHRvcFggKyBjZWxsU2l6ZSAqIDMpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdIDwgZ3JpZFggfHwgcGllY2VzW2ldWzBdID49IGdyaWRYK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzFdID49IGdyaWRZK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVudSAoKSB7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdDtcclxuICAgIHdoaWxlKGNvdW50PjIpe1xyXG4gICAgICAgIGNvdW50IC09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiSmFwYW5lc2UgQ2FzdGxlcyBUZXRyaXNcIiwzMDAsNTAwLDEwMCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJCeSBEYW5pZWwsIEFkcmllbCBhbmQgSmFzb25cIiwgNTUwLCA3MDAsIDUwKTtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgRjExIHRvIGdvIGZ1bGxzY3JlZW5cIiwgNTcwLCA4MDAsIDUwKTtcclxuICAgIFxyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gY291bnQ+MT8yLWNvdW50OmNvdW50O1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyB0aGUgc3BhY2UgYmFyIHRvIHN0YXJ0XCIsNTUwLDkwMCw1MCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lKCl7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdCooNCpkb3duKzEpOy8vIEFjY2VsZXJhdGVzIHdoZW4gZG93biBrZXkgaXMgaGVsZFxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIC8vIERyYXcgZnJhbWVcclxuICAgIGdyYXBoaWNzLmltYWdlKGN0eCxpbWFnZXMuY2FzdGxlLChjLndpZHRoLWltYWdlcy5jYXN0bGUud2lkdGgpLzIsLTgwKTtcclxuXHJcbiAgICAvLyBTY29yZVxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsYFNjb3JlOiAke3Njb3JlfWAsMjAsNTAsNTApO1xyXG5cclxuICAgIC8vIEZyYW1lXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCxncmlkWCxncmlkWSxncmlkU2l6ZSxncmlkU2l6ZSk7XHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCx0b3BYLHRvcFksY2VsbFNpemUqNCxjZWxsU2l6ZSo2KTtcclxuICAgIGdyYXBoaWNzLmxpbmVzKGN0eCxbXHJcbiAgICAgICAgW3RvcFgsdG9wWV0sXHJcbiAgICAgICAgW3RvcFgrY2VsbFNpemUqNCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LGdyaWRZXSxcclxuICAgICAgICBbZ3JpZFgrZ3JpZFNpemUsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWStncmlkU2l6ZV0sXHJcbiAgICAgICAgW2dyaWRYLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLGdyaWRZXSxcclxuICAgICAgICBbdG9wWCx0b3BZXVxyXG4gICAgXSk7XHJcblxyXG4gICAgLy8gRHJhdyBncmlkXHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxncmlkU2l6ZTtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGkrZ3JpZFgsIGdyaWRZLCBpK2dyaWRYLCBncmlkWStncmlkU2l6ZSwgNSk7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGdyaWRYLCBncmlkWStpLCBncmlkWCtncmlkU2l6ZSwgZ3JpZFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo4O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCwgdG9wWStpLCB0b3BYK2NlbGxTaXplKjQsIHRvcFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo0O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCtpLCB0b3BZLCB0b3BYK2ksIHRvcFkrY2VsbFNpemUqNiwgNSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9naWNcclxuICAgIGlmKCFjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IG5ldyAocmFuZG9tLmNob2ljZShibG9ja3MpKSh0b3BYLHRvcFkpO1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay54ID0gdG9wWCArIGNlbGxTaXplICogKDItTWF0aC5mbG9vcihjdXJyZW50QmxvY2sud2lkdGgvMikpO1xyXG5cclxuICAgICAgICBpZihjaGVja01vdmUoKSl7XHJcbiAgICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHNjb3JlICs9IGN1cnJlbnRCbG9jay5nZXRQaWVjZXMoKS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlKGNvdW50PjAuNSl7XHJcbiAgICAgICAgY291bnQtPTAuNTtcclxuXHJcbiAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgLy9Nb3ZlIGN1cnJlbnRCbG9jayBkb3duXHJcbiAgICAgICAgICAgIGN1cnJlbnRCbG9jay55ICs9IGNlbGxTaXplO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2hlY2tNb3ZlKCkpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgLT0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKGxldCBpPTA7aTxmYWxsZW5CbG9ja3MubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgZmFsbGVuQmxvY2tzW2ldLnJlbmRlcihjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnJlbmRlcihjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGdhbWVPdmVyKXtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWVPdmVyTG9vcCgpe1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG5cclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgR2FtZSBPdmVyLiBTY29yZTogJHtzY29yZX1gLDEwMCw1MDAsMTUwKTtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNcIik7XHJcbiAgICBjdHggPSBjLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBpbWFnZXMuY2FzdGxlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZXMuY2FzdGxlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWVudSk7XHJcbiAgICB9XHJcbiAgICBpbWFnZXMuY2FzdGxlLnNyYyA9IFwiLi9pbWFnZXMvcGxhbi5qcGdcIjtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57XHJcbiAgICBjb25zdCB3ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcbiAgICBcclxuICAgIHN3aXRjaCh3KXtcclxuICAgIGNhc2UgMzI6XHJcbiAgICAgICAgLy9TcGFjZVxyXG4gICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzNzpcclxuICAgICAgICAvL0xlZnRcclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCArPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0ID4gMC43KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZGlkbid0IGp1c3QgaGl0IHRoZSBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgICAgLy9SaWdodFxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdD4wLjcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJdCBkaWRuJ3QganVzdCBoaXQgdGhlIHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSA0MDpcclxuICAgICAgICAvL0Rvd25cclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgZG93biA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzODpcclxuICAgICAgICAvL1VwXHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2suYm9vbE1hcCA9IHJvdGF0ZUxpc3QoY3VycmVudEJsb2NrLmJvb2xNYXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PntcclxuICAgIGNvbnN0IHcgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuXHJcbiAgICBpZih3PT09NDApe1xyXG4gICAgICAgIGRvd24gPSBmYWxzZTtcclxuICAgIH1cclxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5cclxuXHJcbmNvbnN0IGNvbG91cnMgPSBbXHJcbiAgICBcIiNmMDBcIixcclxuICAgIFwiI2ZmMFwiLFxyXG4gICAgXCIjMDBmXCIsXHJcbiAgICBcIiMwZjBcIixcclxuICAgIFwiI2YwZlwiLFxyXG4gICAgXCIjMGZhXCJcclxuXTtcclxuXHJcbmNsYXNzIEJsb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKHgseSxib29sTWFwKXtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5ib29sTWFwID0gYm9vbE1hcDtcclxuICAgICAgICB0aGlzLmNvbCA9IHJhbmRvbS5jaG9pY2UoY29sb3Vycyk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBib29sTWFwLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLndpZHRoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKGJvb2xNYXBbaV0ubGVuZ3RoPnRoaXMuaGVpZ2h0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gYm9vbE1hcFtpXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGN0eCl7XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5yZW5kZXJCbG9jayhjdHgsdGhpcy54K3gqNTAsdGhpcy55K3kqNTAsdGhpcy5jb2wpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEJvdHRvbSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmJvb2xNYXAubGVuZ3RoKjUwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBpZWNlcygpe1xyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PHRoaXMuYm9vbE1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7eDx0aGlzLmJvb2xNYXBbeV0ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvb2xNYXBbeV1beF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlcy5wdXNoKFt0aGlzLngreCo1MCx0aGlzLnkreSo1MF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGllY2VzO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBMaXN0VG9CbG9ja3MgKG1hcExpc3Qpe1xyXG4gICAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgICBmb3IobGV0IGk9MDtpPG1hcExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgYmxvY2tzLnB1c2goY2xhc3MgZXh0ZW5kcyBCbG9jayB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHgseSl7XHJcbiAgICAgICAgICAgICAgICBzdXBlcih4LHksbWFwTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBibG9ja3M7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFwTGlzdFRvQmxvY2tzKFtcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFswLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDEsMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDEsMV0sXHJcbiAgICAgICAgWzAsMCwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFswLDFdXHJcbiAgICBdXHJcbl0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ibG9ja3MuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gc25pcChtYXAsIG1pblgsIG1pblkpIHtcclxuICAgIGlmKG1pblghPT0wKXtcclxuICAgICAgICBjb25zdCBwdXNoID0gLW1pblg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29ycmVjdGVkTWFwID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5IGluIG1hcCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeCBpbiBtYXBbeV0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWNvcnJlY3RlZE1hcFt5XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3ldID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbeV1bcGFyc2VJbnQoeCkrcHVzaF0gPSBtYXBbeV1bcGFyc2VJbnQoeCldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXAgPSBjb3JyZWN0ZWRNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYobWluWSE9PTApe1xyXG4gICAgICAgIGNvbnN0IHB1c2ggPSAtbWluWTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb3JyZWN0ZWRNYXAgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHkgaW4gbWFwKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4IGluIG1hcFt5XSl7XHJcbiAgICAgICAgICAgICAgICBpZighY29ycmVjdGVkTWFwW3BhcnNlSW50KHkpK3B1c2hdKXtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbcGFyc2VJbnQoeSkrcHVzaF0gPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvcnJlY3RlZE1hcFtwYXJzZUludCh5KStwdXNoXVt4XSA9IG1hcFtwYXJzZUludCh5KV1beF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hcCA9IGNvcnJlY3RlZE1hcDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWFwO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtYXApIHtcclxuICAgIGNvbnN0IG5ld01hcCA9IFtdO1xyXG5cclxuICAgIGxldCB3aWR0aCA9IDA7XHJcbiAgICBmb3IobGV0IGk9MDtpPG1hcC5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZihtYXBbaV0ubGVuZ3RoPndpZHRoKXtcclxuICAgICAgICAgICAgd2lkdGggPSBtYXBbaV0ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjWCA9IE1hdGguY2VpbCh3aWR0aC8yKTtcclxuICAgIGNvbnN0IGNZID0gTWF0aC5jZWlsKG1hcC5sZW5ndGgvMik7XHJcblxyXG4gICAgbGV0IGxvd2VzdFggPSA5OTk5O1xyXG4gICAgbGV0IGxvd2VzdFkgPSA5OTk5O1xyXG5cclxuICAgIGZvcihsZXQgeT0wO3k8bWFwLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgIGZvcihsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgY29uc3QgZGlmZlggPSB4LWNYO1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmWSA9IHktY1k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdYID0gY1gtZGlmZlk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1kgPSBjWStkaWZmWDtcclxuXHJcbiAgICAgICAgICAgIGlmKCFuZXdNYXBbbmV3WV0pe1xyXG4gICAgICAgICAgICAgICAgbmV3TWFwW25ld1ldID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3TWFwW25ld1ldW25ld1hdID0gbWFwW3ldW3hdO1xyXG5cclxuICAgICAgICAgICAgaWYobmV3WDxsb3dlc3RYKXtcclxuICAgICAgICAgICAgICAgIGxvd2VzdFggPSBuZXdYO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG5ld1k8bG93ZXN0WSl7XHJcbiAgICAgICAgICAgICAgICBsb3dlc3RZID0gbmV3WTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmaW5hbCA9IHNuaXAobmV3TWFwLGxvd2VzdFgsbG93ZXN0WSk7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsO1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvcm90YXRlTGlzdC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9