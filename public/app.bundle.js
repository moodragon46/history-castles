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

var down = false;

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

        //Move currentBlock down
        currentBlock.y += cellSize;
        
        if(currentBlock.getBottom()>gridY+gridSize){
            currentBlock.y = gridY+gridSize-cellSize*(currentBlock.boolMap.length);
            fallenBlocks.push(currentBlock);
            currentBlock = undefined;
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
            }
        }
        break;
    case 39:
        //Right
        if(started){
            if(currentBlock){
                currentBlock.x += cellSize;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmRmZTllNmRkOTFlNjllODViYWEiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7O0FDUEE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLE1BQU07O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsYUFBYTtBQUNwQztBQUNBO0FBQ0EsdUJBQXVCLGFBQWE7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFOzs7Ozs7QUM3S0Q7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixhQUFhO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDLHdCQUF3Qix5QkFBeUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9wdWJsaWMvYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJkZmU5ZTZkZDkxZTY5ZTg1YmFhIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByZWN0OmZ1bmN0aW9uKGN0eCx4LHksdyxoLGNvbCl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbHx8XCIjMDAwXCI7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgseSx3LGgpO1xyXG4gICAgfSxcclxuICAgIHJlY3RPdXRsaW5lOmZ1bmN0aW9uKGN0eCx4LHksdyxoLHNpemUsY29sKXtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlY3QoeCx5LHcsaCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIGxpbmU6ZnVuY3Rpb24oY3R4LHgxLHkxLHgyLHkyLHNpemUsY29sKXtcclxuICAgICAgICBjdHgubGluZUNhcD1cInJvdW5kXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeDEseTEpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeDIseTIpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICBsaW5lczpmdW5jdGlvbihjdHgsbGluZXMsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5saW5lQ2FwPVwicm91bmRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGluZXNbMF1bMF0sbGluZXNbMF1bMV0pO1xyXG4gICAgICAgIGZvcihsZXQgaT0xO2k8bGluZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8obGluZXNbaV1bMF0sbGluZXNbaV1bMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgdGV4dDpmdW5jdGlvbihjdHgsdGV4dCx4LHksc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5mb250ID0gYCR7c2l6ZXx8MTAwfXB4IENvbnNvbGFzYDtcclxuICAgICAgICBjdHguZmlsbFRleHQodGV4dCwgeCwgeSk7XHJcbiAgICB9LFxyXG4gICAgaW1hZ2U6ZnVuY3Rpb24oY3R4LGltZyx4LHkpe1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLHgseSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQmxvY2s6ZnVuY3Rpb24oY3R4LHgseSxjb2wsc2l6ZSl7XHJcbiAgICAgICAgY29uc3QgcmVhbFMgPSBzaXplIHx8IDUwO1xyXG4gICAgICAgIHRoaXMucmVjdChjdHgseCx5LHJlYWxTLHJlYWxTLGNvbCk7XHJcbiAgICAgICAgdGhpcy5yZWN0T3V0bGluZShjdHgseCx5LHJlYWxTLHJlYWxTKTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2dyYXBoaWNzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmFuZGludDpmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gbWluK01hdGguZmxvb3IoKG1heC1taW4pKk1hdGgucmFuZG9tKCkpO1xyXG4gICAgfSxcclxuICAgIGNob2ljZTpmdW5jdGlvbihzYW1wbGVzKXtcclxuICAgICAgICByZXR1cm4gc2FtcGxlc1t0aGlzLnJhbmRpbnQoMCxzYW1wbGVzLmxlbmd0aCldO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvcmFuZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGdyYXBoaWNzID0gcmVxdWlyZShcIi4vZ3JhcGhpY3NcIik7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRvbVwiKTtcclxuY29uc3QgYmxvY2tzID0gcmVxdWlyZShcIi4vYmxvY2tzXCIpO1xyXG5cclxuY29uc3QgZ3JpZFg9NjYwO2NvbnN0IGdyaWRZPTQ1MDtjb25zdCBncmlkU2l6ZT02MDA7XHJcbmNvbnN0IGNlbGxTaXplID0gNTA7XHJcbmNvbnN0IHRvcFg9Z3JpZFgrY2VsbFNpemUqNDtcclxuY29uc3QgdG9wWT1ncmlkWS1jZWxsU2l6ZSo2O1xyXG5cclxudmFyIGMsIGN0eDtcclxuY29uc3QgaW1hZ2VzID0ge2Nhc3RsZTp1bmRlZmluZWR9O1xyXG5cclxudmFyIGNvdW50ID0gMDtcclxudmFyIHN0YXJ0ZWQgPSBmYWxzZTtcclxuXHJcbmxldCBzY29yZSA9IDA7XHJcblxyXG52YXIgY3VycmVudEJsb2NrO1xyXG52YXIgZmFsbGVuQmxvY2tzID0gW107XHJcblxyXG52YXIgZG93biA9IGZhbHNlO1xyXG5cclxudmFyIHByZXZEdCA9IERhdGUubm93KCk7XHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZURUKCl7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgZGVsdGEgPSAobm93IC0gcHJldkR0KS8xMDAwO1xyXG4gICAgcHJldkR0ID0gbm93O1xyXG4gICAgcmV0dXJuIGRlbHRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZW51ICgpIHtcclxuICAgIGNvbnN0IGR0ID0gY2FsY3VsYXRlRFQoKTtcclxuICAgIGNvdW50ICs9IGR0O1xyXG4gICAgd2hpbGUoY291bnQ+Mil7XHJcbiAgICAgICAgY291bnQgLT0gMjtcclxuICAgIH1cclxuXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCwwLDAsYy53aWR0aCxjLmhlaWdodCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJKYXBhbmVzZSBDYXN0bGVzIFRldHJpc1wiLDMwMCw1MDAsMTAwKTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIkJ5IERhbmllbCwgQWRyaWVsIGFuZCBKYXNvblwiLCA1NTAsIDcwMCwgNTApO1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyBGMTEgdG8gZ28gZnVsbHNjcmVlblwiLCA1NzAsIDgwMCwgNTApO1xyXG4gICAgXHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBjb3VudD4xPzItY291bnQ6Y291bnQ7XHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIlByZXNzIHRoZSBzcGFjZSBiYXIgdG8gc3RhcnRcIiw1NTAsOTAwLDUwKTtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcblxyXG4gICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWVudSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWUoKXtcclxuICAgIGNvbnN0IGR0ID0gY2FsY3VsYXRlRFQoKTtcclxuICAgIGNvdW50ICs9IGR0Kig0KmRvd24rMSk7Ly8gQWNjZWxlcmF0ZXMgd2hlbiBkb3duIGtleSBpcyBoZWxkXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCwwLDAsYy53aWR0aCxjLmhlaWdodCk7XHJcblxyXG4gICAgLy8gRHJhdyBmcmFtZVxyXG4gICAgZ3JhcGhpY3MuaW1hZ2UoY3R4LGltYWdlcy5jYXN0bGUsKGMud2lkdGgtaW1hZ2VzLmNhc3RsZS53aWR0aCkvMiwtODApO1xyXG5cclxuICAgIC8vIFNjb3JlXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgU2NvcmU6ICR7c2NvcmV9YCwyMCw1MCw1MCk7XHJcblxyXG4gICAgLy8gRnJhbWVcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LGdyaWRYLGdyaWRZLGdyaWRTaXplLGdyaWRTaXplKTtcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LHRvcFgsdG9wWSxjZWxsU2l6ZSo0LGNlbGxTaXplKjYpO1xyXG4gICAgZ3JhcGhpY3MubGluZXMoY3R4LFtcclxuICAgICAgICBbdG9wWCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LHRvcFldLFxyXG4gICAgICAgIFt0b3BYK2NlbGxTaXplKjQsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWV0sXHJcbiAgICAgICAgW2dyaWRYK2dyaWRTaXplLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFkrZ3JpZFNpemVdLFxyXG4gICAgICAgIFtncmlkWCxncmlkWV0sXHJcbiAgICAgICAgW3RvcFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLHRvcFldXHJcbiAgICBdKTtcclxuXHJcbiAgICAvLyBEcmF3IGdyaWRcclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGdyaWRTaXplO2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgaStncmlkWCwgZ3JpZFksIGkrZ3JpZFgsIGdyaWRZK2dyaWRTaXplLCA1KTtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgZ3JpZFgsIGdyaWRZK2ksIGdyaWRYK2dyaWRTaXplLCBncmlkWStpLCA1KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGNlbGxTaXplKjg7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCB0b3BYLCB0b3BZK2ksIHRvcFgrY2VsbFNpemUqNCwgdG9wWStpLCA1KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT1jZWxsU2l6ZTtpPGNlbGxTaXplKjQ7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCB0b3BYK2ksIHRvcFksIHRvcFgraSwgdG9wWStjZWxsU2l6ZSo2LCA1KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMb2dpY1xyXG4gICAgaWYoIWN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrID0gbmV3IChyYW5kb20uY2hvaWNlKGJsb2NrcykpKHRvcFgsdG9wWSk7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnggPSB0b3BYICsgY2VsbFNpemUgKiAoMi1NYXRoLmZsb29yKGN1cnJlbnRCbG9jay53aWR0aC8yKSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUoY291bnQ+MC41KXtcclxuICAgICAgICBjb3VudC09MC41O1xyXG5cclxuICAgICAgICAvL01vdmUgY3VycmVudEJsb2NrIGRvd25cclxuICAgICAgICBjdXJyZW50QmxvY2sueSArPSBjZWxsU2l6ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZihjdXJyZW50QmxvY2suZ2V0Qm90dG9tKCk+Z3JpZFkrZ3JpZFNpemUpe1xyXG4gICAgICAgICAgICBjdXJyZW50QmxvY2sueSA9IGdyaWRZK2dyaWRTaXplLWNlbGxTaXplKihjdXJyZW50QmxvY2suYm9vbE1hcC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmYWxsZW5CbG9ja3MucHVzaChjdXJyZW50QmxvY2spO1xyXG4gICAgICAgICAgICBjdXJyZW50QmxvY2sgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvcihsZXQgaT0wO2k8ZmFsbGVuQmxvY2tzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGZhbGxlbkJsb2Nrc1tpXS5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjXCIpO1xyXG4gICAgY3R4ID0gYy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgaW1hZ2VzLmNhc3RsZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2VzLmNhc3RsZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2VzLmNhc3RsZS5zcmMgPSBcIi4vaW1hZ2VzL3BsYW4uanBnXCI7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+e1xyXG4gICAgY29uc3QgdyA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xyXG4gICAgXHJcbiAgICBzd2l0Y2godyl7XHJcbiAgICBjYXNlIDMyOlxyXG4gICAgICAgIC8vU3BhY2VcclxuICAgICAgICBzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzc6XHJcbiAgICAgICAgLy9MZWZ0XHJcbiAgICAgICAgaWYoc3RhcnRlZCl7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCAtPSBjZWxsU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgICAgLy9SaWdodFxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDQwOlxyXG4gICAgICAgIC8vRG93blxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBkb3duID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+e1xyXG4gICAgY29uc3QgdyA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xyXG5cclxuICAgIGlmKHc9PT00MCl7XHJcbiAgICAgICAgZG93biA9IGZhbHNlO1xyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBncmFwaGljcyA9IHJlcXVpcmUoXCIuL2dyYXBoaWNzXCIpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKFwiLi9yYW5kb21cIik7XHJcblxyXG5cclxuY29uc3QgY29sb3VycyA9IFtcclxuICAgIFwiI2YwMFwiLFxyXG4gICAgXCIjZmYwXCIsXHJcbiAgICBcIiMwMGZcIixcclxuICAgIFwiIzBmMFwiLFxyXG4gICAgXCIjZjBmXCIsXHJcbiAgICBcIiMwZmFcIlxyXG5dO1xyXG5cclxuY2xhc3MgQmxvY2sge1xyXG4gICAgY29uc3RydWN0b3IoeCx5LGJvb2xNYXApe1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmJvb2xNYXAgPSBib29sTWFwO1xyXG4gICAgICAgIHRoaXMuY29sID0gcmFuZG9tLmNob2ljZShjb2xvdXJzKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGJvb2xNYXAubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMud2lkdGg7aSsrKXtcclxuICAgICAgICAgICAgaWYoYm9vbE1hcFtpXS5sZW5ndGg+dGhpcy5oZWlnaHQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBib29sTWFwW2ldLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoY3R4KXtcclxuICAgICAgICBmb3IobGV0IHk9MDt5PHRoaXMuYm9vbE1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7eDx0aGlzLmJvb2xNYXBbeV0ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvb2xNYXBbeV1beF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnJlbmRlckJsb2NrKGN0eCx0aGlzLngreCo1MCx0aGlzLnkreSo1MCx0aGlzLmNvbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Qm90dG9tKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuYm9vbE1hcC5sZW5ndGgqNTA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcExpc3RUb0Jsb2NrcyAobWFwTGlzdCl7XHJcbiAgICBjb25zdCBibG9ja3MgPSBbXTtcclxuICAgIGZvcihsZXQgaT0wO2k8bWFwTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICBibG9ja3MucHVzaChjbGFzcyBleHRlbmRzIEJsb2NrIHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoeCx5KXtcclxuICAgICAgICAgICAgICAgIHN1cGVyKHgseSxtYXBMaXN0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJsb2NrcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXBMaXN0VG9CbG9ja3MoW1xyXG4gICAgW1xyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMSwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzAsMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzAsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMSwxXSxcclxuICAgICAgICBbMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMSwxXSxcclxuICAgICAgICBbMCwwLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzAsMV0sXHJcbiAgICAgICAgWzAsMV1cclxuICAgIF1cclxuXSk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2Jsb2Nrcy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9