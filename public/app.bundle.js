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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTE4YjQ0ZTJkM2VhNjU2YTQzNGYiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Es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bW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhMThiNDRlMmQzZWE2NTZhNDM0ZiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVjdDpmdW5jdGlvbihjdHgseCx5LHcsaCxjb2wpe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2x8fFwiIzAwMFwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LHksdyxoKTtcclxuICAgIH0sXHJcbiAgICByZWN0T3V0bGluZTpmdW5jdGlvbihjdHgseCx5LHcsaCxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHgseSx3LGgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICBsaW5lOmZ1bmN0aW9uKGN0eCx4MSx5MSx4Mix5MixzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHgxLHkxKTtcclxuICAgICAgICBjdHgubGluZVRvKHgyLHkyKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgbGluZXM6ZnVuY3Rpb24oY3R4LGxpbmVzLHNpemUsY29sKXtcclxuICAgICAgICBjdHgubGluZUNhcD1cInJvdW5kXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gc2l6ZXx8MTA7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxpbmVzWzBdWzBdLGxpbmVzWzBdWzFdKTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPGxpbmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGxpbmVzW2ldWzBdLGxpbmVzW2ldWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIHRleHQ6ZnVuY3Rpb24oY3R4LHRleHQseCx5LHNpemUsY29sKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sfHxcIiNmZmZcIjtcclxuICAgICAgICBjdHguZm9udCA9IGAke3NpemV8fDEwMH1weCBDb25zb2xhc2A7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xyXG4gICAgfSxcclxuICAgIGltYWdlOmZ1bmN0aW9uKGN0eCxpbWcseCx5KXtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZyx4LHkpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlckJsb2NrOmZ1bmN0aW9uKGN0eCx4LHksY29sLHNpemUpe1xyXG4gICAgICAgIGNvbnN0IHJlYWxTID0gc2l6ZSB8fCA1MDtcclxuICAgICAgICB0aGlzLnJlY3QoY3R4LHgseSxyZWFsUyxyZWFsUyxjb2wpO1xyXG4gICAgICAgIHRoaXMucmVjdE91dGxpbmUoY3R4LHgseSxyZWFsUyxyZWFsUyk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ncmFwaGljcy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJhbmRpbnQ6ZnVuY3Rpb24obWluLG1heCl7XHJcbiAgICAgICAgcmV0dXJuIG1pbitNYXRoLmZsb29yKChtYXgtbWluKSpNYXRoLnJhbmRvbSgpKTtcclxuICAgIH0sXHJcbiAgICBjaG9pY2U6ZnVuY3Rpb24oc2FtcGxlcyl7XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZXNbdGhpcy5yYW5kaW50KDAsc2FtcGxlcy5sZW5ndGgpXTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL3JhbmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBncmFwaGljcyA9IHJlcXVpcmUoXCIuL2dyYXBoaWNzXCIpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKFwiLi9yYW5kb21cIik7XHJcbmNvbnN0IGJsb2NrcyA9IHJlcXVpcmUoXCIuL2Jsb2Nrc1wiKTtcclxuXHJcbmNvbnN0IGdyaWRYPTY2MDtjb25zdCBncmlkWT00NTA7Y29uc3QgZ3JpZFNpemU9NjAwO1xyXG5jb25zdCBjZWxsU2l6ZSA9IDUwO1xyXG5jb25zdCB0b3BYPWdyaWRYK2NlbGxTaXplKjQ7XHJcbmNvbnN0IHRvcFk9Z3JpZFktY2VsbFNpemUqNjtcclxuXHJcbnZhciBjLCBjdHg7XHJcbmNvbnN0IGltYWdlcyA9IHtjYXN0bGU6dW5kZWZpbmVkfTtcclxuXHJcbnZhciBjb3VudCA9IDA7XHJcbnZhciBzdGFydGVkID0gZmFsc2U7XHJcblxyXG5sZXQgc2NvcmUgPSAwO1xyXG5cclxudmFyIGN1cnJlbnRCbG9jaztcclxudmFyIGZhbGxlbkJsb2NrcyA9IFtdO1xyXG52YXIgZmFsbGVuUGllY2VzID0gW107XHJcblxyXG52YXIgZG93biA9IGZhbHNlO1xyXG5cclxudmFyIHByZXZEdCA9IERhdGUubm93KCk7XHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZURUKCl7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgZGVsdGEgPSAobm93IC0gcHJldkR0KS8xMDAwO1xyXG4gICAgcHJldkR0ID0gbm93O1xyXG4gICAgcmV0dXJuIGRlbHRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9wQmxvY2soKXtcclxuICAgIGZhbGxlblBpZWNlcyA9IGZhbGxlblBpZWNlcy5jb25jYXQoY3VycmVudEJsb2NrLmdldFBpZWNlcygpKTtcclxuICAgIFxyXG4gICAgZmFsbGVuQmxvY2tzLnB1c2goY3VycmVudEJsb2NrKTtcclxuICAgIGN1cnJlbnRCbG9jayA9IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb3ZlKCl7XHJcbiAgICBjb25zdCBwaWVjZXMgPSBjdXJyZW50QmxvY2suZ2V0UGllY2VzKCk7XHJcbiAgICBmb3IobGV0IGk9MDtpPHBpZWNlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBmb3IobGV0IGo9MDtqPGZhbGxlblBpZWNlcy5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdID09PSBmYWxsZW5QaWVjZXNbal1bMF0gJiYgcGllY2VzW2ldWzFdID09PSBmYWxsZW5QaWVjZXNbal1bMV0pe1xyXG4gICAgICAgICAgICAgICAgLy8gaGl0IGFub3RoZXIgYmxvY2suXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGllY2VzW2ldWzFdIDwgZ3JpZFkpe1xyXG4gICAgICAgICAgICAvLyBJbiB0b3Agc2VjdGlvblxyXG4gICAgICAgICAgICBpZihwaWVjZXNbaV1bMF0gPCB0b3BYIHx8IHBpZWNlc1tpXVswXSA+IHRvcFggKyBjZWxsU2l6ZSAqIDMpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdIDwgZ3JpZFggfHwgcGllY2VzW2ldWzBdID49IGdyaWRYK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzFdID49IGdyaWRZK2dyaWRTaXplKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVudSAoKSB7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdDtcclxuICAgIHdoaWxlKGNvdW50PjIpe1xyXG4gICAgICAgIGNvdW50IC09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiSmFwYW5lc2UgQ2FzdGxlcyBUZXRyaXNcIiwzMDAsNTAwLDEwMCk7XHJcblxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJCeSBEYW5pZWwsIEFkcmllbCBhbmQgSmFzb25cIiwgNTUwLCA3MDAsIDUwKTtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgRjExIHRvIGdvIGZ1bGxzY3JlZW5cIiwgNTcwLCA4MDAsIDUwKTtcclxuICAgIFxyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gY291bnQ+MT8yLWNvdW50OmNvdW50O1xyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsXCJQcmVzcyB0aGUgc3BhY2UgYmFyIHRvIHN0YXJ0XCIsNTUwLDkwMCw1MCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG5cclxuICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1lbnUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lKCl7XHJcbiAgICBjb25zdCBkdCA9IGNhbGN1bGF0ZURUKCk7XHJcbiAgICBjb3VudCArPSBkdCooNCpkb3duKzEpOy8vIEFjY2VsZXJhdGVzIHdoZW4gZG93biBrZXkgaXMgaGVsZFxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIC8vIERyYXcgZnJhbWVcclxuICAgIGdyYXBoaWNzLmltYWdlKGN0eCxpbWFnZXMuY2FzdGxlLChjLndpZHRoLWltYWdlcy5jYXN0bGUud2lkdGgpLzIsLTgwKTtcclxuXHJcbiAgICAvLyBTY29yZVxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsYFNjb3JlOiAke3Njb3JlfWAsMjAsNTAsNTApO1xyXG5cclxuICAgIC8vIEZyYW1lXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCxncmlkWCxncmlkWSxncmlkU2l6ZSxncmlkU2l6ZSk7XHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCx0b3BYLHRvcFksY2VsbFNpemUqNCxjZWxsU2l6ZSo2KTtcclxuICAgIGdyYXBoaWNzLmxpbmVzKGN0eCxbXHJcbiAgICAgICAgW3RvcFgsdG9wWV0sXHJcbiAgICAgICAgW3RvcFgrY2VsbFNpemUqNCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LGdyaWRZXSxcclxuICAgICAgICBbZ3JpZFgrZ3JpZFNpemUsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWStncmlkU2l6ZV0sXHJcbiAgICAgICAgW2dyaWRYLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLGdyaWRZXSxcclxuICAgICAgICBbdG9wWCx0b3BZXVxyXG4gICAgXSk7XHJcblxyXG4gICAgLy8gRHJhdyBncmlkXHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxncmlkU2l6ZTtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGkrZ3JpZFgsIGdyaWRZLCBpK2dyaWRYLCBncmlkWStncmlkU2l6ZSwgNSk7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGdyaWRYLCBncmlkWStpLCBncmlkWCtncmlkU2l6ZSwgZ3JpZFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo4O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCwgdG9wWStpLCB0b3BYK2NlbGxTaXplKjQsIHRvcFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo0O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCtpLCB0b3BZLCB0b3BYK2ksIHRvcFkrY2VsbFNpemUqNiwgNSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9naWNcclxuICAgIGlmKCFjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IG5ldyAocmFuZG9tLmNob2ljZShibG9ja3MpKSh0b3BYLHRvcFkpO1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay54ID0gdG9wWCArIGNlbGxTaXplICogKDItTWF0aC5mbG9vcihjdXJyZW50QmxvY2sud2lkdGgvMikpO1xyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlKGNvdW50PjAuNSl7XHJcbiAgICAgICAgY291bnQtPTAuNTtcclxuXHJcbiAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgLy9Nb3ZlIGN1cnJlbnRCbG9jayBkb3duXHJcbiAgICAgICAgICAgIGN1cnJlbnRCbG9jay55ICs9IGNlbGxTaXplO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2hlY2tNb3ZlKCkpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgLT0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKGxldCBpPTA7aTxmYWxsZW5CbG9ja3MubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgZmFsbGVuQmxvY2tzW2ldLnJlbmRlcihjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgY3VycmVudEJsb2NrLnJlbmRlcihjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lKTtcclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNcIik7XHJcbiAgICBjdHggPSBjLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBpbWFnZXMuY2FzdGxlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZXMuY2FzdGxlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWVudSk7XHJcbiAgICB9XHJcbiAgICBpbWFnZXMuY2FzdGxlLnNyYyA9IFwiLi9pbWFnZXMvcGxhbi5qcGdcIjtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57XHJcbiAgICBjb25zdCB3ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcbiAgICBcclxuICAgIHN3aXRjaCh3KXtcclxuICAgIGNhc2UgMzI6XHJcbiAgICAgICAgLy9TcGFjZVxyXG4gICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzNzpcclxuICAgICAgICAvL0xlZnRcclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCArPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0ID4gMC43KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZGlkbid0IGp1c3QgaGl0IHRoZSBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgICAgLy9SaWdodFxyXG4gICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jay54IC09IGNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdD4wLjcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJdCBkaWRuJ3QganVzdCBoaXQgdGhlIHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSA0MDpcclxuICAgICAgICAvL0Rvd25cclxuICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgZG93biA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PntcclxuICAgIGNvbnN0IHcgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuXHJcbiAgICBpZih3PT09NDApe1xyXG4gICAgICAgIGRvd24gPSBmYWxzZTtcclxuICAgIH1cclxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZ3JhcGhpY3MgPSByZXF1aXJlKFwiLi9ncmFwaGljc1wiKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZShcIi4vcmFuZG9tXCIpO1xyXG5cclxuXHJcbmNvbnN0IGNvbG91cnMgPSBbXHJcbiAgICBcIiNmMDBcIixcclxuICAgIFwiI2ZmMFwiLFxyXG4gICAgXCIjMDBmXCIsXHJcbiAgICBcIiMwZjBcIixcclxuICAgIFwiI2YwZlwiLFxyXG4gICAgXCIjMGZhXCJcclxuXTtcclxuXHJcbmNsYXNzIEJsb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKHgseSxib29sTWFwKXtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5ib29sTWFwID0gYm9vbE1hcDtcclxuICAgICAgICB0aGlzLmNvbCA9IHJhbmRvbS5jaG9pY2UoY29sb3Vycyk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBib29sTWFwLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLndpZHRoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKGJvb2xNYXBbaV0ubGVuZ3RoPnRoaXMuaGVpZ2h0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gYm9vbE1hcFtpXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGN0eCl7XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5yZW5kZXJCbG9jayhjdHgsdGhpcy54K3gqNTAsdGhpcy55K3kqNTAsdGhpcy5jb2wpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEJvdHRvbSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmJvb2xNYXAubGVuZ3RoKjUwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBpZWNlcygpe1xyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PHRoaXMuYm9vbE1hcC5sZW5ndGg7eSsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7eDx0aGlzLmJvb2xNYXBbeV0ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvb2xNYXBbeV1beF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlcy5wdXNoKFt0aGlzLngreCo1MCx0aGlzLnkreSo1MF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGllY2VzO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBMaXN0VG9CbG9ja3MgKG1hcExpc3Qpe1xyXG4gICAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgICBmb3IobGV0IGk9MDtpPG1hcExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgYmxvY2tzLnB1c2goY2xhc3MgZXh0ZW5kcyBCbG9jayB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHgseSl7XHJcbiAgICAgICAgICAgICAgICBzdXBlcih4LHksbWFwTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBibG9ja3M7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFwTGlzdFRvQmxvY2tzKFtcclxuICAgIFtcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFswLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDEsMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDEsMV0sXHJcbiAgICAgICAgWzAsMCwxXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFswLDFdLFxyXG4gICAgICAgIFswLDFdXHJcbiAgICBdXHJcbl0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ibG9ja3MuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==