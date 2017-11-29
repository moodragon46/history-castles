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
    for(let i=cellSize;i<cellSize*8;i+=cellSize){
        graphics.line(ctx, topX, topY+i, topX+cellSize*4, topY+i, 5);
    }
    for(let i=cellSize;i<cellSize*4;i+=cellSize){
        graphics.line(ctx, topX+i, topY, topX+i, topY+cellSize*6, 5);
    }

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const graphics = __webpack_require__(0);
const random = __webpack_require__(1);


const colours = [
    "#f00",
    "#ff0",
    "#00f",
    "#0f0"
];

class Block {
    constructor(x,y,boolMap){
        this.x = x;
        this.y = y;
        this.boolMap = boolMap;
        this.col = random.choice(colours);
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
    ]
]);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzJiNDRlOTM0ZGIxZjJjN2Y1MjIiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7O0FDUEE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyxNQUFNOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGFBQWE7QUFDcEM7QUFDQTtBQUNBLHVCQUF1QixhQUFhO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRTs7Ozs7O0FDMUlEO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUMsd0JBQXdCLHlCQUF5QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIuL3B1YmxpYy9hcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzJiNDRlOTM0ZGIxZjJjN2Y1MjIiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJlY3Q6ZnVuY3Rpb24oY3R4LHgseSx3LGgsY29sKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sfHxcIiMwMDBcIjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCx5LHcsaCk7XHJcbiAgICB9LFxyXG4gICAgcmVjdE91dGxpbmU6ZnVuY3Rpb24oY3R4LHgseSx3LGgsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgucmVjdCh4LHksdyxoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgbGluZTpmdW5jdGlvbihjdHgseDEseTEseDIseTIsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5saW5lQ2FwPVwicm91bmRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSx5MSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4Mix5Mik7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIGxpbmVzOmZ1bmN0aW9uKGN0eCxsaW5lcyxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsaW5lc1swXVswXSxsaW5lc1swXVsxXSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxsaW5lcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhsaW5lc1tpXVswXSxsaW5lc1tpXVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICB0ZXh0OmZ1bmN0aW9uKGN0eCx0ZXh0LHgseSxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBgJHtzaXplfHwxMDB9cHggQ29uc29sYXNgO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcclxuICAgIH0sXHJcbiAgICBpbWFnZTpmdW5jdGlvbihjdHgsaW1nLHgseSl7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcseCx5KTtcclxuICAgIH0sXHJcbiAgICByZW5kZXJCbG9jazpmdW5jdGlvbihjdHgseCx5LGNvbCxzaXplKXtcclxuICAgICAgICBjb25zdCByZWFsUyA9IHNpemUgfHwgNTA7XHJcbiAgICAgICAgdGhpcy5yZWN0KGN0eCx4LHkscmVhbFMscmVhbFMsY29sKTtcclxuICAgICAgICB0aGlzLnJlY3RPdXRsaW5lKGN0eCx4LHkscmVhbFMscmVhbFMpO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvZ3JhcGhpY3MuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByYW5kaW50OmZ1bmN0aW9uKG1pbixtYXgpe1xyXG4gICAgICAgIHJldHVybiBtaW4rTWF0aC5mbG9vcigobWF4LW1pbikqTWF0aC5yYW5kb20oKSk7XHJcbiAgICB9LFxyXG4gICAgY2hvaWNlOmZ1bmN0aW9uKHNhbXBsZXMpe1xyXG4gICAgICAgIHJldHVybiBzYW1wbGVzW3RoaXMucmFuZGludCgwLHNhbXBsZXMubGVuZ3RoKV07XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9yYW5kb20uanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5jb25zdCBibG9ja3MgPSByZXF1aXJlKFwiLi9ibG9ja3NcIik7XHJcblxyXG5jb25zdCBncmlkWD02NjA7Y29uc3QgZ3JpZFk9NDUwO2NvbnN0IGdyaWRTaXplPTYwMDtcclxuY29uc3QgY2VsbFNpemUgPSA1MDtcclxuY29uc3QgdG9wWD1ncmlkWCtjZWxsU2l6ZSo0O1xyXG5jb25zdCB0b3BZPWdyaWRZLWNlbGxTaXplKjY7XHJcblxyXG52YXIgYywgY3R4O1xyXG5jb25zdCBpbWFnZXMgPSB7Y2FzdGxlOnVuZGVmaW5lZH07XHJcblxyXG52YXIgY291bnQgPSAwO1xyXG52YXIgc3RhcnRlZCA9IGZhbHNlO1xyXG5cclxubGV0IHNjb3JlID0gMDtcclxuXHJcbnZhciBjdXJyZW50QmxvY2s7XHJcbnZhciBmYWxsZW5CbG9ja3MgPSBbXTtcclxuXHJcbnZhciBwcmV2RHQgPSBEYXRlLm5vdygpO1xyXG5mdW5jdGlvbiBjYWxjdWxhdGVEVCgpe1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIGNvbnN0IGRlbHRhID0gKG5vdyAtIHByZXZEdCkvMTAwMDtcclxuICAgIHByZXZEdCA9IG5vdztcclxuICAgIHJldHVybiBkZWx0YTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVudSAoKSB7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdDtcclxuICAgIHdoaWxlKGNvdW50PjIpe1xyXG4gICAgICAgIGNvdW50IC09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiSmFwYW5lc2UgQ2FzdGxlcyBUZXRyaXNcIiwzMDAsNTAwLDEwMCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJCeSBEYW5pZWwsIEFkcmllbCBhbmQgSmFzb25cIiwgNTUwLCA3MDAsIDUwKTtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgRjExIHRvIGdvIGZ1bGxzY3JlZW5cIiwgNTcwLCA4MDAsIDUwKTtcclxuICAgIFxyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gY291bnQ+MT8yLWNvdW50OmNvdW50O1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyB0aGUgc3BhY2UgYmFyIHRvIHN0YXJ0XCIsNTUwLDkwMCw1MCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lKCl7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdDtcclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBEcmF3IGZyYW1lXHJcbiAgICBncmFwaGljcy5pbWFnZShjdHgsaW1hZ2VzLmNhc3RsZSwoYy53aWR0aC1pbWFnZXMuY2FzdGxlLndpZHRoKS8yLC04MCk7XHJcblxyXG4gICAgLy8gU2NvcmVcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LGBTY29yZTogJHtzY29yZX1gLDIwLDUwLDUwKTtcclxuXHJcbiAgICAvLyBGcmFtZVxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsZ3JpZFgsZ3JpZFksZ3JpZFNpemUsZ3JpZFNpemUpO1xyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsdG9wWCx0b3BZLGNlbGxTaXplKjQsY2VsbFNpemUqNik7XHJcbiAgICBncmFwaGljcy5saW5lcyhjdHgsW1xyXG4gICAgICAgIFt0b3BYLHRvcFldLFxyXG4gICAgICAgIFt0b3BYK2NlbGxTaXplKjQsdG9wWV0sXHJcbiAgICAgICAgW3RvcFgrY2VsbFNpemUqNCxncmlkWV0sXHJcbiAgICAgICAgW2dyaWRYK2dyaWRTaXplLGdyaWRZXSxcclxuICAgICAgICBbZ3JpZFgrZ3JpZFNpemUsZ3JpZFkrZ3JpZFNpemVdLFxyXG4gICAgICAgIFtncmlkWCxncmlkWStncmlkU2l6ZV0sXHJcbiAgICAgICAgW2dyaWRYLGdyaWRZXSxcclxuICAgICAgICBbdG9wWCxncmlkWV0sXHJcbiAgICAgICAgW3RvcFgsdG9wWV1cclxuICAgIF0pO1xyXG5cclxuICAgIC8vIERyYXcgZ3JpZFxyXG4gICAgZm9yKGxldCBpPWNlbGxTaXplO2k8Z3JpZFNpemU7aSs9Y2VsbFNpemUpe1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCBpK2dyaWRYLCBncmlkWSwgaStncmlkWCwgZ3JpZFkrZ3JpZFNpemUsIDUpO1xyXG4gICAgICAgIGdyYXBoaWNzLmxpbmUoY3R4LCBncmlkWCwgZ3JpZFkraSwgZ3JpZFgrZ3JpZFNpemUsIGdyaWRZK2ksIDUpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCBpPWNlbGxTaXplO2k8Y2VsbFNpemUqODtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIHRvcFgsIHRvcFkraSwgdG9wWCtjZWxsU2l6ZSo0LCB0b3BZK2ksIDUpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCBpPWNlbGxTaXplO2k8Y2VsbFNpemUqNDtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIHRvcFgraSwgdG9wWSwgdG9wWCtpLCB0b3BZK2NlbGxTaXplKjYsIDUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExvZ2ljXHJcbiAgICBpZighY3VycmVudEJsb2NrKXtcclxuICAgICAgICBjdXJyZW50QmxvY2sgPSBuZXcgKHJhbmRvbS5jaG9pY2UoYmxvY2tzKSkodG9wWCx0b3BZKTtcclxuICAgIH1cclxuXHJcbiAgICB3aGlsZShjb3VudD4wLjUpe1xyXG4gICAgICAgIGNvdW50LT0wLjU7XHJcblxyXG4gICAgICAgIC8vTW92ZSBjdXJyZW50QmxvY2sgZG93blxyXG4gICAgICAgIGN1cnJlbnRCbG9jay55ICs9IGNlbGxTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcihsZXQgaT0wO2k8ZmFsbGVuQmxvY2tzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGZhbGxlbkJsb2Nrc1tpXS5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50QmxvY2sucmVuZGVyKGN0eCk7XHJcblxyXG4gICAgaWYoY3VycmVudEJsb2NrLmdldEJvdHRvbSgpPj1ncmlkWStncmlkU2l6ZSl7XHJcbiAgICAgICAgZmFsbGVuQmxvY2tzLnB1c2goY3VycmVudEJsb2NrKTtcclxuICAgICAgICBjdXJyZW50QmxvY2sgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUpO1xyXG59XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gICAgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY1wiKTtcclxuICAgIGN0eCA9IGMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIGltYWdlcy5jYXN0bGUgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlcy5jYXN0bGUub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtZW51KTtcclxuICAgIH1cclxuICAgIGltYWdlcy5jYXN0bGUuc3JjID0gXCIuL2ltYWdlcy9wbGFuLmpwZ1wiO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PntcclxuICAgIGNvbnN0IHcgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuICAgIFxyXG4gICAgc3dpdGNoKHcpe1xyXG4gICAgY2FzZSAzMjpcclxuICAgICAgICAvL1NwYWNlXHJcbiAgICAgICAgc3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGdyYXBoaWNzID0gcmVxdWlyZShcIi4vZ3JhcGhpY3NcIik7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRvbVwiKTtcclxuXHJcblxyXG5jb25zdCBjb2xvdXJzID0gW1xyXG4gICAgXCIjZjAwXCIsXHJcbiAgICBcIiNmZjBcIixcclxuICAgIFwiIzAwZlwiLFxyXG4gICAgXCIjMGYwXCJcclxuXTtcclxuXHJcbmNsYXNzIEJsb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKHgseSxib29sTWFwKXtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5ib29sTWFwID0gYm9vbE1hcDtcclxuICAgICAgICB0aGlzLmNvbCA9IHJhbmRvbS5jaG9pY2UoY29sb3Vycyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGN0eCl7XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5yZW5kZXJCbG9jayhjdHgsdGhpcy54K3gqNTAsdGhpcy55K3kqNTAsdGhpcy5jb2wpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEJvdHRvbSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmJvb2xNYXAubGVuZ3RoKjUwO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBMaXN0VG9CbG9ja3MgKG1hcExpc3Qpe1xyXG4gICAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgICBmb3IobGV0IGk9MDtpPG1hcExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgYmxvY2tzLnB1c2goY2xhc3MgZXh0ZW5kcyBCbG9jayB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHgseSl7XHJcbiAgICAgICAgICAgICAgICBzdXBlcih4LHksbWFwTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBibG9ja3M7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFwTGlzdFRvQmxvY2tzKFtcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFswLDFdXHJcbiAgICBdXHJcbl0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ibG9ja3MuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==