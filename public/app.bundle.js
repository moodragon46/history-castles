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
const blocks = __webpack_require__(3);

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
    }

    while(count>0.5){
        count-=0.5;

        if(currentBlock){
            //Move currentBlock down
            currentBlock.y += cellSize;
            
            if(currentBlock.getBottom()>gridY+gridSize){
                currentBlock.y = gridY+gridSize-cellSize*(currentBlock.boolMap.length);

                stopBlock();
            }else {
                if(checkMove()){
                    currentBlock.y -= cellSize;

                    stopBlock();
                }
            }
        }
    }

    for(let i=0;i<fallenBlocks.length;i++){
        fallenBlocks[i].render(ctx);
    }

    if(currentBlock){
        currentBlock.render(ctx);
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
    case 37:
        //Left
        if(started){
            if(currentBlock){
                currentBlock.x -= cellSize;
                if(checkMove()){
                    currentBlock.x += cellSize;

                    stopBlock();
                }
            }
        }
        break;
    case 39:
        //Right
        if(started){
            if(currentBlock){
                currentBlock.x += cellSize;

                if(checkMove()){
                    currentBlock.x -= cellSize;
                    
                    stopBlock();
                }
            }
        }
        break;
    case 40:
        //Down
        if(started){
            down = true;
        }
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDFkM2RlZjc2Y2Q5ZGEyM2I1ZDUiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7O0FDUEE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGdCQUFnQjtBQUNoQyxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyxNQUFNOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGFBQWE7QUFDcEM7QUFDQTtBQUNBLHVCQUF1QixhQUFhO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFOzs7Ozs7QUN0TkQ7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixhQUFhO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDLHdCQUF3Qix5QkFBeUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixzQkFBc0I7QUFDMUMsd0JBQXdCLHlCQUF5QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vcHVibGljL2FwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0MWQzZGVmNzZjZDlkYTIzYjVkNSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVjdDpmdW5jdGlvbihjdHgseCx5LHcsaCxjb2wpe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2x8fFwiIzAwMFwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LHksdyxoKTtcclxuICAgIH0sXHJcbiAgICByZWN0T3V0bGluZTpmdW5jdGlvbihjdHgseCx5LHcsaCxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHgseSx3LGgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICBsaW5lOmZ1bmN0aW9uKGN0eCx4MSx5MSx4Mix5MixzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHgxLHkxKTtcclxuICAgICAgICBjdHgubGluZVRvKHgyLHkyKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgbGluZXM6ZnVuY3Rpb24oY3R4LGxpbmVzLHNpemUsY29sKXtcclxuICAgICAgICBjdHgubGluZUNhcD1cInJvdW5kXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxpbmVzWzBdWzBdLGxpbmVzWzBdWzFdKTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPGxpbmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGxpbmVzW2ldWzBdLGxpbmVzW2ldWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIHRleHQ6ZnVuY3Rpb24oY3R4LHRleHQseCx5LHNpemUsY29sKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHguZm9udCA9IGAke3NpemV8fDEwMH1weCBDb25zb2xhc2A7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xyXG4gICAgfSxcclxuICAgIGltYWdlOmZ1bmN0aW9uKGN0eCxpbWcseCx5KXtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZyx4LHkpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlckJsb2NrOmZ1bmN0aW9uKGN0eCx4LHksY29sLHNpemUpe1xyXG4gICAgICAgIGNvbnN0IHJlYWxTID0gc2l6ZSB8fCA1MDtcclxuICAgICAgICB0aGlzLnJlY3QoY3R4LHgseSxyZWFsUyxyZWFsUyxjb2wpO1xyXG4gICAgICAgIHRoaXMucmVjdE91dGxpbmUoY3R4LHgseSxyZWFsUyxyZWFsUyk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ncmFwaGljcy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJhbmRpbnQ6ZnVuY3Rpb24obWluLG1heCl7XHJcbiAgICAgICAgcmV0dXJuIG1pbitNYXRoLmZsb29yKChtYXgtbWluKSpNYXRoLnJhbmRvbSgpKTtcclxuICAgIH0sXHJcbiAgICBjaG9pY2U6ZnVuY3Rpb24oc2FtcGxlcyl7XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZXNbdGhpcy5yYW5kaW50KDAsc2FtcGxlcy5sZW5ndGgpXTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL3JhbmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBncmFwaGljcyA9IHJlcXVpcmUoXCIuL2dyYXBoaWNzXCIpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKFwiLi9yYW5kb21cIik7XHJcbmNvbnN0IGJsb2NrcyA9IHJlcXVpcmUoXCIuL2Jsb2Nrc1wiKTtcclxuXHJcbmNvbnN0IGdyaWRYPTY2MDtjb25zdCBncmlkWT00NTA7Y29uc3QgZ3JpZFNpemU9NjAwO1xyXG5jb25zdCBjZWxsU2l6ZSA9IDUwO1xyXG5jb25zdCB0b3BYPWdyaWRYK2NlbGxTaXplKjQ7XHJcbmNvbnN0IHRvcFk9Z3JpZFktY2VsbFNpemUqNjtcclxuXHJcbnZhciBjLCBjdHg7XHJcbmNvbnN0IGltYWdlcyA9IHtjYXN0bGU6dW5kZWZpbmVkfTtcclxuXHJcbnZhciBjb3VudCA9IDA7XHJcbnZhciBzdGFydGVkID0gZmFsc2U7XHJcblxyXG5sZXQgc2NvcmUgPSAwO1xyXG5cclxudmFyIGN1cnJlbnRCbG9jaztcclxudmFyIGZhbGxlbkJsb2NrcyA9IFtdO1xyXG52YXIgZmFsbGVuUGllY2VzID0gW107XHJcblxyXG52YXIgZG93biA9IGZhbHNlO1xyXG5cclxudmFyIHByZXZEdCA9IERhdGUubm93KCk7XHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZURUKCl7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgZGVsdGEgPSAobm93IC0gcHJldkR0KS8xMDAwO1xyXG4gICAgcHJldkR0ID0gbm93O1xyXG4gICAgcmV0dXJuIGRlbHRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9wQmxvY2soKXtcclxuICAgIGZhbGxlblBpZWNlcyA9IGZhbGxlblBpZWNlcy5jb25jYXQoY3VycmVudEJsb2NrLmdldFBpZWNlcygpKTtcclxuICAgIFxyXG4gICAgZmFsbGVuQmxvY2tzLnB1c2goY3VycmVudEJsb2NrKTtcclxuICAgIGN1cnJlbnRCbG9jayA9IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb3ZlKCl7XHJcbiAgICBjb25zdCBwaWVjZXMgPSBjdXJyZW50QmxvY2suZ2V0UGllY2VzKCk7XHJcbiAgICBmb3IobGV0IGk9MDtpPHBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBmb3IobGV0IGo9MDtqPGZhbGxlblBpZWNlcy5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdID09PSBmYWxsZW5QaWVjZXNbal1bMF0gJiYgcGllY2VzW2ldWzFdID09PSBmYWxsZW5QaWVjZXNbal1bMV0pe1xyXG4gICAgICAgICAgICAgICAgLy8gaGl0IGFub3RoZXIgYmxvY2suXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lbnUgKCkge1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG4gICAgY291bnQgKz0gZHQ7XHJcbiAgICB3aGlsZShjb3VudD4yKXtcclxuICAgICAgICBjb3VudCAtPSAyO1xyXG4gICAgfVxyXG5cclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIkphcGFuZXNlIENhc3RsZXMgVGV0cmlzXCIsMzAwLDUwMCwxMDApO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiQnkgRGFuaWVsLCBBZHJpZWwgYW5kIEphc29uXCIsIDU1MCwgNzAwLCA1MCk7XHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIlByZXNzIEYxMSB0byBnbyBmdWxsc2NyZWVuXCIsIDU3MCwgODAwLCA1MCk7XHJcbiAgICBcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGNvdW50PjE/Mi1jb3VudDpjb3VudDtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgdGhlIHNwYWNlIGJhciB0byBzdGFydFwiLDU1MCw5MDAsNTApO1xyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuXHJcbiAgICBpZihzdGFydGVkKXtcclxuICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUpO1xyXG4gICAgfWVsc2Uge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtZW51KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2FtZSgpe1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG4gICAgY291bnQgKz0gZHQqKDQqZG93bisxKTsvLyBBY2NlbGVyYXRlcyB3aGVuIGRvd24ga2V5IGlzIGhlbGRcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBEcmF3IGZyYW1lXHJcbiAgICBncmFwaGljcy5pbWFnZShjdHgsaW1hZ2VzLmNhc3RsZSwoYy53aWR0aC1pbWFnZXMuY2FzdGxlLndpZHRoKS8yLC04MCk7XHJcblxyXG4gICAgLy8gU2NvcmVcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LGBTY29yZTogJHtzY29yZX1gLDIwLDUwLDUwKTtcclxuXHJcbiAgICAvLyBGcmFtZVxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsZ3JpZFgsZ3JpZFksZ3JpZFNpemUsZ3JpZFNpemUpO1xyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsdG9wWCx0b3BZLGNlbGxTaXplKjQsY2VsbFNpemUqNik7XHJcbiAgICBncmFwaGljcy5saW5lcyhjdHgsW1xyXG4gICAgICAgIFt0b3BYLHRvcFldLFxyXG4gICAgICAgIFt0b3BYK2NlbGxTaXplKjQsdG9wWV0sXHJcbiAgICAgICAgW3RvcFgrY2VsbFNpemUqNCxncmlkWV0sXHJcbiAgICAgICAgW2dyaWRYK2dyaWRTaXplLGdyaWRZXSxcclxuICAgICAgICBbZ3JpZFgrZ3JpZFNpemUsZ3JpZFkrZ3JpZFNpemVdLFxyXG4gICAgICAgIFtncmlkWCxncmlkWStncmlkU2l6ZV0sXHJcbiAgICAgICAgW2dyaWRYLGdyaWRZXSxcclxuICAgICAgICBbdG9wWCxncmlkWV0sXHJcbiAgICAgICAgW3RvcFgsdG9wWV1cclxuICAgIF0pO1xyXG5cclxuICAgIC8vIERyYXcgZ3JpZFxyXG4gICAgZm9yKGxldCBpPWNlbGxTaXplO2k8Z3JpZFNpemU7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCBpK2dyaWRYLCBncmlkWSwgaStncmlkWCwgZ3JpZFkrZ3JpZFNpemUsIDUpO1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCBncmlkWCwgZ3JpZFkraSwgZ3JpZFgrZ3JpZFNpemUsIGdyaWRZK2ksIDUpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCBpPWNlbGxTaXplO2k8Y2VsbFNpemUqODtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIHRvcFgsIHRvcFkraSwgdG9wWCtjZWxsU2l6ZSo0LCB0b3BZK2ksIDUpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCBpPWNlbGxTaXplO2k8Y2VsbFNpemUqNDtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIHRvcFgraSwgdG9wWSwgdG9wWCtpLCB0b3BZK2NlbGxTaXplKjYsIDUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExvZ2ljXHJcbiAgICBpZighY3VycmVudEJsb2NrKXtcclxuICAgICAgICBjdXJyZW50QmxvY2sgPSBuZXcgKHJhbmRvbS5jaG9pY2UoYmxvY2tzKSkodG9wWCx0b3BZKTtcclxuICAgICAgICBjdXJyZW50QmxvY2sueCA9IHRvcFggKyBjZWxsU2l6ZSAqICgyLU1hdGguZmxvb3IoY3VycmVudEJsb2NrLndpZHRoLzIpKTtcclxuICAgIH1cclxuXHJcbiAgICB3aGlsZShjb3VudD4wLjUpe1xyXG4gICAgICAgIGNvdW50LT0wLjU7XHJcblxyXG4gICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgIC8vTW92ZSBjdXJyZW50QmxvY2sgZG93blxyXG4gICAgICAgICAgICBjdXJyZW50QmxvY2sueSArPSBjZWxsU2l6ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jay5nZXRCb3R0b20oKT5ncmlkWStncmlkU2l6ZSl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueSA9IGdyaWRZK2dyaWRTaXplLWNlbGxTaXplKihjdXJyZW50QmxvY2suYm9vbE1hcC5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZihjaGVja01vdmUoKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgLT0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvcihsZXQgaT0wO2k8ZmFsbGVuQmxvY2tzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGZhbGxlbkJsb2Nrc1tpXS5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjXCIpO1xyXG4gICAgY3R4ID0gYy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgaW1hZ2VzLmNhc3RsZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2VzLmNhc3RsZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2VzLmNhc3RsZS5zcmMgPSBcIi4vaW1hZ2VzL3BsYW4uanBnXCI7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+e1xyXG4gICAgY29uc3QgdyA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xyXG4gICAgXHJcbiAgICBzd2l0Y2godyl7XHJcbiAgICBjYXNlIDMyOlxyXG4gICAgICAgIC8vU3BhY2VcclxuICAgICAgICBzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzc6XHJcbiAgICAgICAgLy9MZWZ0XHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCAtPSBjZWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmKGNoZWNrTW92ZSgpKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCArPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM5OlxyXG4gICAgICAgIC8vUmlnaHRcclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54ICs9IGNlbGxTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGNoZWNrTW92ZSgpKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCAtPSBjZWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzdG9wQmxvY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgICAgLy9Eb3duXHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGRvd24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsKGUpPT57XHJcbiAgICBjb25zdCB3ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcblxyXG4gICAgaWYodz09PTQwKXtcclxuICAgICAgICBkb3duID0gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGdyYXBoaWNzID0gcmVxdWlyZShcIi4vZ3JhcGhpY3NcIik7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRvbVwiKTtcclxuXHJcblxyXG5jb25zdCBjb2xvdXJzID0gW1xyXG4gICAgXCIjZjAwXCIsXHJcbiAgICBcIiNmZjBcIixcclxuICAgIFwiIzAwZlwiLFxyXG4gICAgXCIjMGYwXCIsXHJcbiAgICBcIiNmMGZcIixcclxuICAgIFwiIzBmYVwiXHJcbl07XHJcblxyXG5jbGFzcyBCbG9jayB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LHksYm9vbE1hcCl7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuYm9vbE1hcCA9IGJvb2xNYXA7XHJcbiAgICAgICAgdGhpcy5jb2wgPSByYW5kb20uY2hvaWNlKGNvbG91cnMpO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gYm9vbE1hcC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy53aWR0aDtpKyspe1xyXG4gICAgICAgICAgICBpZihib29sTWFwW2ldLmxlbmd0aD50aGlzLmhlaWdodCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IGJvb2xNYXBbaV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjdHgpe1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8dGhpcy5ib29sTWFwLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHg9MDt4PHRoaXMuYm9vbE1hcFt5XS5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9vbE1hcFt5XVt4XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MucmVuZGVyQmxvY2soY3R4LHRoaXMueCt4KjUwLHRoaXMueSt5KjUwLHRoaXMuY29sKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRCb3R0b20oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5ib29sTWFwLmxlbmd0aCo1MDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQaWVjZXMoKXtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBwaWVjZXMucHVzaChbdGhpcy54K3gqNTAsdGhpcy55K3kqNTBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBpZWNlcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFwTGlzdFRvQmxvY2tzIChtYXBMaXN0KXtcclxuICAgIGNvbnN0IGJsb2NrcyA9IFtdO1xyXG4gICAgZm9yKGxldCBpPTA7aTxtYXBMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGJsb2Nrcy5wdXNoKGNsYXNzIGV4dGVuZHMgQmxvY2sge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvcih4LHkpe1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoeCx5LG1hcExpc3RbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmxvY2tzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hcExpc3RUb0Jsb2NrcyhbXHJcbiAgICBbXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMCwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxLDFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxLDFdLFxyXG4gICAgICAgIFswLDAsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMCwxXVxyXG4gICAgXVxyXG5dKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvYmxvY2tzLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=