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
const quiz = __webpack_require__(6);

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

var finalScreen = false;

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
        //requestAnimationFrame(gameOverLoop);
        quiz.init((additionPoints)=>{
            score+=additionPoints;

            finalScreen = true;

            gameOverLoop();
        });
    }else {
        requestAnimationFrame(game);
    }
}

function gameOverLoop(){
    const dt = calculateDT();

    graphics.rect(ctx,0,0,c.width,c.height);

    graphics.text(ctx,`Game Over. Score: ${score}`,100,500,150);
    graphics.text(ctx,"Press space bar to retry",100,700,100);

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
    
    if(finalScreen){
        if(w===32){
            location.reload();
        }
    }else {
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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

s = {
   c:undefined,
   ctx:undefined
}
var turnDone = false;
var buttons = [];
var questionReady = false;
var questionList = [];
var selectedID = 0;
var currentQuestion = undefined;
var points = 100;

var startDate = 0;
var finalPoints = 0;
var allDone = false;
var finalLoop;
//classes
class Question{
   constructor(qst,opts,answ){
       this.qst = qst;//question-string
       this.opts = shuffle(opts);//list of possible answ
       this.answ = answ;//
       this.correctAnswID = this.opts.indexOf(answ);
   }
}
class Button{
   constructor(txt,x,y,w,h,fgc,bgc,id){
       this.x = x;
       this.y = y;
       this.w = w;
       this.h = h;
       this.fgc = fgc;
       this.bgc = bgc;
       this.txt = txt;
       this.selected = false;
       this.id = id;
   }
   render(){
       DrawRect(this.bgc,this.x,this.y,this.w,this.h);
       Write(this.txt,this.fgc,this.x+50,this.y+50,"40px Consolas");
       if (selectedID === this.id){
           DrawRectOutline("#FFFFFF",this.x,this.y,this.w,this.h);
       }
   }
   checkClick(mouseX,mouseY){
       if (this.x<mouseX && mouseX<this.x+this.w){
           if (this.y<mouseY && mouseY<this.y+this.h){
               return true;
           }
       }
       return false;
   }
}
//functions
function randomNo(min,max){
   return Math.floor(Math.random()*(max-min)+min);
}
function shuffle(myList){
   const oldList = myList;
   const newList = [];
   const length = oldList.length;
   for (let i=0;i<length;i++){
       const itemIndex = randomNo(0,oldList.length-1);
       newList.push(oldList[itemIndex])
       oldList.splice(itemIndex,1);
   }
   //console.log(oldList,newList,myList);
   return newList;
}
function DrawRect(col,x,y,w,h){
   s.ctx.fillStyle = col;
   s.ctx.fillRect(x,y,w,h);
}
function DrawRectOutline(col,x,y,w,h){
   s.ctx.strokeStyle = col;
   s.ctx.lineWidth = "5";
   s.ctx.beginPath();
   s.ctx.rect(x,y,w,h);
   s.ctx.stroke();
}
function resizeCanvas(w,h){
   s.c.width = w;
   s.c.height = h;
}
function Write(txt,col,x,y,font){
   s.ctx.fillStyle = col;
   s.ctx.font = font;
   s.ctx.fillText(txt,x,y);//use consoals
}
//render
function render(){

   DrawRect("#000000",0,0,s.c.width,s.c.height);
   if (!turnDone){
       if(!questionReady){
           //create buttons
           currentQuestion = questionList[randomNo(0,questionList.length)];
           startDate = Date.now();
           //console.log(currentQuestion.opts);
           buttons.push(new Button(currentQuestion.opts[0],100,200,500,200,"#000000","#FF0000",0));
           buttons.push(new Button(currentQuestion.opts[1],700,200,500,200,"#000000","#0000FF",1));
           buttons.push(new Button(currentQuestion.opts[2],100,500,500,200,"#000000","#00FF00",2));
           buttons.push(new Button(currentQuestion.opts[3],700,500,500,200,"#000000","#FFFF00",3));
           questionReady = true;
       }
       for (let i=0;i<buttons.length;i++){
           buttons[i].render();
       }
       Write(currentQuestion.qst,"#FFFFFF",50,50,"75px Consolas");
       loopSeconds = (Date.now() - startDate) / 1000;
       if (Math.round(loopSeconds>=5)){
           turnDone = true;
           points = 0;
       }
       Write("Time left:" + (5-Math.round(loopSeconds)).toString(),"#FFFFFF",50,120,"65px Consolas");
   }
   if(turnDone){
       if (selectedID === currentQuestion.correctAnswID){
           Write("Correct!","#FFFFFF",50,50,"75px Consolas");
           Write("You got "+points.toString()+" extra points","#FFFFFF",50,125,"65px Consolas");

           finalPoints = points;
       }
       else{
           Write("The answer was "+currentQuestion.answ,"#FFFFFF",50,50,"75px Consolas");
           Write("You got no extra points","#FFFFFF",50,125,"65px Consolas");

           finalPoints = 0;
       }
       
       Write("Press Space to Continue","#FFFFFF",50,180,"60px Consolas");
   }
   if(!allDone){
    requestAnimationFrame(render);
   }
}
//onload
function init(finalL){
    finalLoop = finalL;
   s.c = document.getElementById("c");
   s.ctx = s.c.getContext("2d");
   //create questions
   questionList.push(new Question("What were Japanese Castles Built from?",
   ["Wood and Stone","Bricks","Stone","Metal"],"Wood and Stone"));
   questionList.push(new Question("How many storeys tall are Japanese Catles?",
   ["3-5","2-4","2-6","Over 8-10"],"3-5"));
   questionList.push(new Question("Which castle was Iyeasu Tokugawa's base?",
   ["Edo Castle","Himeji Castle","Osaka Castle","Matsumoto castle"],"Edo Castle"));
   questionList.push(new Question("What is the process of designs Japanese Castles called?",
   ["Nawatari","Niwabari","Tenshu","Nawabari"],"Nawabari"));
   questionList.push(new Question("When did Iyeasu Tokugawa invade Osaka Castle?",
   ["1615","1620","1618","1616"],"1615"));

    //events
    window.addEventListener("keydown",function(e){
        w = e.which||e.keyCode;
    
        if (!turnDone){
            switch(w){
                case 32:
                    turnDone = true;
                    finalDate = Date.now();
                    seconds = (finalDate - startDate) / 1000;
                    points = Math.round(points-(seconds*10));
                    break;
                case 37:
                    if (selectedID>0){
                        selectedID--;
                    }
                    break;
                case 39:
                    if (selectedID<3){
                        selectedID++;
                    }
                    break;
            }
        }else if(w===32){
            // Continue to final

            allDone = true;

            requestAnimationFrame(()=>{
                finalLoop(finalPoints);
            });
        }
    });

   requestAnimationFrame(render);
}


module.exports = {init:init};


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmExMmFiMzE1MWZhMGQ3ZjgxNTMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL3JvdGF0ZUxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ibG9ja3MuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL211c2ljLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9qYXNvbnNPbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsZUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLOztBQUVMO0FBQ0E7OztBQUdBLGtCQUFrQiIsImZpbGUiOiIuL3B1YmxpYy9hcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYmExMmFiMzE1MWZhMGQ3ZjgxNTMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJlY3Q6ZnVuY3Rpb24oY3R4LHgseSx3LGgsY29sKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sfHxcIiMwMDBcIjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCx5LHcsaCk7XHJcbiAgICB9LFxyXG4gICAgcmVjdE91dGxpbmU6ZnVuY3Rpb24oY3R4LHgseSx3LGgsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgucmVjdCh4LHksdyxoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG4gICAgbGluZTpmdW5jdGlvbihjdHgseDEseTEseDIseTIsc2l6ZSxjb2wpe1xyXG4gICAgICAgIGN0eC5saW5lQ2FwPVwicm91bmRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2x8fFwiI2ZmZlwiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzaXplfHwxMDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSx5MSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4Mix5Mik7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfSxcclxuICAgIGxpbmVzOmZ1bmN0aW9uKGN0eCxsaW5lcyxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNpemV8fDEwO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsaW5lc1swXVswXSxsaW5lc1swXVsxXSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxsaW5lcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhsaW5lc1tpXVswXSxsaW5lc1tpXVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH0sXHJcbiAgICB0ZXh0OmZ1bmN0aW9uKGN0eCx0ZXh0LHgseSxzaXplLGNvbCl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbHx8XCIjZmZmXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBgJHtzaXplfHwxMDB9cHggQ29uc29sYXNgO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcclxuICAgIH0sXHJcbiAgICBpbWFnZTpmdW5jdGlvbihjdHgsaW1nLHgseSl7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcseCx5KTtcclxuICAgIH0sXHJcbiAgICByZW5kZXJCbG9jazpmdW5jdGlvbihjdHgseCx5LGNvbCxzaXplKXtcclxuICAgICAgICBjb25zdCByZWFsUyA9IHNpemUgfHwgNTA7XHJcbiAgICAgICAgdGhpcy5yZWN0KGN0eCx4LHkscmVhbFMscmVhbFMsY29sKTtcclxuICAgICAgICB0aGlzLnJlY3RPdXRsaW5lKGN0eCx4LHkscmVhbFMscmVhbFMpO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvZ3JhcGhpY3MuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByYW5kaW50OmZ1bmN0aW9uKG1pbixtYXgpe1xyXG4gICAgICAgIHJldHVybiBtaW4rTWF0aC5mbG9vcigobWF4LW1pbikqTWF0aC5yYW5kb20oKSk7XHJcbiAgICB9LFxyXG4gICAgY2hvaWNlOmZ1bmN0aW9uKHNhbXBsZXMpe1xyXG4gICAgICAgIHJldHVybiBzYW1wbGVzW3RoaXMucmFuZGludCgwLHNhbXBsZXMubGVuZ3RoKV07XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9yYW5kb20uanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gc25pcChtYXAsIG1pblgsIG1pblkpIHtcclxuICAgIGlmKG1pblghPT0wKXtcclxuICAgICAgICBjb25zdCBwdXNoID0gLW1pblg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29ycmVjdGVkTWFwID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5IGluIG1hcCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeCBpbiBtYXBbeV0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWNvcnJlY3RlZE1hcFt5XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdGVkTWFwW3ldID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbeV1bcGFyc2VJbnQoeCkrcHVzaF0gPSBtYXBbeV1bcGFyc2VJbnQoeCldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXAgPSBjb3JyZWN0ZWRNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYobWluWSE9PTApe1xyXG4gICAgICAgIGNvbnN0IHB1c2ggPSAtbWluWTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb3JyZWN0ZWRNYXAgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHkgaW4gbWFwKXtcclxuICAgICAgICAgICAgZm9yKGxldCB4IGluIG1hcFt5XSl7XHJcbiAgICAgICAgICAgICAgICBpZighY29ycmVjdGVkTWFwW3BhcnNlSW50KHkpK3B1c2hdKXtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyZWN0ZWRNYXBbcGFyc2VJbnQoeSkrcHVzaF0gPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvcnJlY3RlZE1hcFtwYXJzZUludCh5KStwdXNoXVt4XSA9IG1hcFtwYXJzZUludCh5KV1beF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hcCA9IGNvcnJlY3RlZE1hcDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWFwO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtYXApIHtcclxuICAgIGNvbnN0IG5ld01hcCA9IFtdO1xyXG5cclxuICAgIGxldCB3aWR0aCA9IDA7XHJcbiAgICBmb3IobGV0IGk9MDtpPG1hcC5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZihtYXBbaV0ubGVuZ3RoPndpZHRoKXtcclxuICAgICAgICAgICAgd2lkdGggPSBtYXBbaV0ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjWCA9IE1hdGguY2VpbCh3aWR0aC8yKTtcclxuICAgIGNvbnN0IGNZID0gTWF0aC5jZWlsKG1hcC5sZW5ndGgvMik7XHJcblxyXG4gICAgbGV0IGxvd2VzdFggPSA5OTk5O1xyXG4gICAgbGV0IGxvd2VzdFkgPSA5OTk5O1xyXG5cclxuICAgIGZvcihsZXQgeT0wO3k8bWFwLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgIGZvcihsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgY29uc3QgZGlmZlggPSB4LWNYO1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmWSA9IHktY1k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdYID0gY1gtZGlmZlk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1kgPSBjWStkaWZmWDtcclxuXHJcbiAgICAgICAgICAgIGlmKCFuZXdNYXBbbmV3WV0pe1xyXG4gICAgICAgICAgICAgICAgbmV3TWFwW25ld1ldID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3TWFwW25ld1ldW25ld1hdID0gbWFwW3ldW3hdO1xyXG5cclxuICAgICAgICAgICAgaWYobmV3WDxsb3dlc3RYKXtcclxuICAgICAgICAgICAgICAgIGxvd2VzdFggPSBuZXdYO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG5ld1k8bG93ZXN0WSl7XHJcbiAgICAgICAgICAgICAgICBsb3dlc3RZID0gbmV3WTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmaW5hbCA9IHNuaXAobmV3TWFwLGxvd2VzdFgsbG93ZXN0WSk7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsO1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvcm90YXRlTGlzdC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBncmFwaGljcyA9IHJlcXVpcmUoXCIuL2dyYXBoaWNzXCIpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKFwiLi9yYW5kb21cIik7XHJcbmNvbnN0IHJvdGF0ZUxpc3QgPSByZXF1aXJlKFwiLi9yb3RhdGVMaXN0XCIpO1xyXG5jb25zdCBibG9ja3MgPSByZXF1aXJlKFwiLi9ibG9ja3NcIik7XHJcbmNvbnN0IG11c2ljID0gcmVxdWlyZShcIi4vbXVzaWNcIik7XHJcbmNvbnN0IHF1aXogPSByZXF1aXJlKFwiLi9qYXNvbnNPbmVcIik7XHJcblxyXG5jb25zdCBncmlkWD02NjA7Y29uc3QgZ3JpZFk9NDUwO2NvbnN0IGdyaWRTaXplPTYwMDtcclxuY29uc3QgY2VsbFNpemUgPSA1MDtcclxuY29uc3QgdG9wWD1ncmlkWCtjZWxsU2l6ZSo0O1xyXG5jb25zdCB0b3BZPWdyaWRZLWNlbGxTaXplKjY7XHJcblxyXG52YXIgYywgY3R4O1xyXG5jb25zdCBpbWFnZXMgPSB7Y2FzdGxlOnVuZGVmaW5lZH07XHJcblxyXG52YXIgY291bnQgPSAwO1xyXG52YXIgc3RhcnRlZCA9IGZhbHNlO1xyXG52YXIgZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbmxldCBzY29yZSA9IDA7XHJcblxyXG52YXIgY3VycmVudEJsb2NrO1xyXG52YXIgZmFsbGVuUGllY2VzID0gW107XHJcblxyXG52YXIgc3BlZWRVcCA9IDE7XHJcbnZhciBkb3duID0gZmFsc2U7XHJcblxyXG52YXIgZmluYWxTY3JlZW4gPSBmYWxzZTtcclxuXHJcbnZhciBwcmV2RHQgPSBEYXRlLm5vdygpO1xyXG5mdW5jdGlvbiBjYWxjdWxhdGVEVCgpe1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIGNvbnN0IGRlbHRhID0gKG5vdyAtIHByZXZEdCkvMTAwMDtcclxuICAgIHByZXZEdCA9IG5vdztcclxuICAgIHJldHVybiBkZWx0YTtcclxufVxyXG5cclxuZnVuY3Rpb24gcm93Q2hlY2soKXtcclxuICAgIGNvbnN0IHJvd3MgPSBbXTtcclxuXHJcbiAgICAvL09yZ2FuaXNlcyBpbmRleGVzIGludG8gcm93c1xyXG4gICAgZm9yKGxldCBpPTA7aTxmYWxsZW5QaWVjZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgeSA9IGZhbGxlblBpZWNlc1tpXVsxXTtcclxuXHJcbiAgICAgICAgY29uc3Qgcm93SWQgPSBNYXRoLmZsb29yKCh5LXRvcFkpL2NlbGxTaXplKTtcclxuXHJcbiAgICAgICAgaWYoIXJvd3Nbcm93SWRdKXsvLyBDcmVhdGVzIHJvdyBpZiBub3QgYWxyZWFkeSBtYWRlXHJcbiAgICAgICAgICAgIHJvd3Nbcm93SWRdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3dzW3Jvd0lkXS5wdXNoKGZhbGxlblBpZWNlc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKGxldCBqPTA7ajxyb3dzLmxlbmd0aDtqKyspe1xyXG4gICAgICAgIGlmKHJvd3Nbal0pey8vIElmIGEgcGllY2Ugd2FzIGFjdHVhbGx5IGluIHRoaXMgcm93XHJcbiAgICAgICAgICAgIGNvbnN0IGFtbnRJblJvdyA9IHJvd3Nbal0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgLy8gMTIgaXMgdGhlIGFtb3VudCBmb3IgYSBicmVhay5cclxuICAgICAgICAgICAgaWYoYW1udEluUm93PjExKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvd1JlbW92ZVkgPSBmYWxsZW5QaWVjZXNbZmFsbGVuUGllY2VzLmluZGV4T2Yocm93c1tqXVswXSldWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaz0wO2s8YW1udEluUm93O2srKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFsbGVuUGllY2VzLnNwbGljZShmYWxsZW5QaWVjZXMuaW5kZXhPZihyb3dzW2pdW2tdKSwxKTsvL1JlbW92ZXMgYWxsIHBpZWNlcyBpbiBmaW5pc2hlZCByb3dcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb3ZlcyBhbGwgYWJvdmUgcGllY2VzIGRvd25cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgY291bnRlcj0wO2NvdW50ZXI8ZmFsbGVuUGllY2VzLmxlbmd0aDtjb3VudGVyKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGZhbGxlblBpZWNlc1tjb3VudGVyXVsxXSA8IHJvd1JlbW92ZVkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIHRoaXMgcGllY2UgZG93blxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxsZW5QaWVjZXNbY291bnRlcl1bMV0gKz0gY2VsbFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9wQmxvY2soKXtcclxuICAgIGZhbGxlblBpZWNlcyA9IGZhbGxlblBpZWNlcy5jb25jYXQoY3VycmVudEJsb2NrLmdldFBpZWNlcygpKTtcclxuICAgIFxyXG4gICAgY3VycmVudEJsb2NrID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIHNwZWVkVXAgKz0gMC4xO1xyXG5cclxuICAgIHJvd0NoZWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTW92ZSgpe1xyXG4gICAgY29uc3QgcGllY2VzID0gY3VycmVudEJsb2NrLmdldFBpZWNlcygpO1xyXG4gICAgZm9yKGxldCBpPTA7aTxwaWVjZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgZm9yKGxldCBqPTA7ajxmYWxsZW5QaWVjZXMubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgIGlmKHBpZWNlc1tpXVswXSA9PT0gZmFsbGVuUGllY2VzW2pdWzBdICYmIHBpZWNlc1tpXVsxXSA9PT0gZmFsbGVuUGllY2VzW2pdWzFdKXtcclxuICAgICAgICAgICAgICAgIC8vIGhpdCBhbm90aGVyIGJsb2NrLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBpZWNlc1tpXVsxXSA8IGdyaWRZKXtcclxuICAgICAgICAgICAgLy8gSW4gdG9wIHNlY3Rpb25cclxuICAgICAgICAgICAgaWYocGllY2VzW2ldWzBdIDwgdG9wWCB8fCBwaWVjZXNbaV1bMF0gPiB0b3BYICsgY2VsbFNpemUgKiAzKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHBpZWNlc1tpXVswXSA8IGdyaWRYIHx8IHBpZWNlc1tpXVswXSA+PSBncmlkWCtncmlkU2l6ZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHBpZWNlc1tpXVsxXSA+PSBncmlkWStncmlkU2l6ZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lbnUgKCkge1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG4gICAgY291bnQgKz0gZHQ7XHJcbiAgICB3aGlsZShjb3VudD4yKXtcclxuICAgICAgICBjb3VudCAtPSAyO1xyXG4gICAgfVxyXG5cclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIkphcGFuZXNlIENhc3RsZXMgVGV0cmlzXCIsMzAwLDUwMCwxMDApO1xyXG5cclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiQnkgRGFuaWVsLCBBZHJpZWwgYW5kIEphc29uXCIsIDU1MCwgNzAwLCA1MCk7XHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxcIlByZXNzIEYxMSB0byBnbyBmdWxsc2NyZWVuXCIsIDU3MCwgODAwLCA1MCk7XHJcbiAgICBcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGNvdW50PjE/Mi1jb3VudDpjb3VudDtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3MgdGhlIHNwYWNlIGJhciB0byBzdGFydFwiLDU1MCw5MDAsNTApO1xyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuXHJcbiAgICBpZihzdGFydGVkKXtcclxuICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUpO1xyXG4gICAgfWVsc2Uge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtZW51KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2FtZSgpe1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG4gICAgY291bnQgKz0gZHQqKDQqZG93bisxKSpzcGVlZFVwOy8vIEFjY2VsZXJhdGVzIHdoZW4gZG93biBrZXkgaXMgaGVsZFxyXG4gICAgZ3JhcGhpY3MucmVjdChjdHgsMCwwLGMud2lkdGgsYy5oZWlnaHQpO1xyXG5cclxuICAgIC8vIERyYXcgZnJhbWVcclxuICAgIGdyYXBoaWNzLmltYWdlKGN0eCxpbWFnZXMuY2FzdGxlLChjLndpZHRoLWltYWdlcy5jYXN0bGUud2lkdGgpLzIsLTgwKTtcclxuXHJcbiAgICAvLyBTY29yZVxyXG4gICAgZ3JhcGhpY3MudGV4dChjdHgsYFNjb3JlOiAke3Njb3JlfWAsMjAsNTAsNTApO1xyXG5cclxuICAgIC8vIEZyYW1lXHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCxncmlkWCxncmlkWSxncmlkU2l6ZSxncmlkU2l6ZSk7XHJcbiAgICBncmFwaGljcy5yZWN0KGN0eCx0b3BYLHRvcFksY2VsbFNpemUqNCxjZWxsU2l6ZSo2KTtcclxuICAgIGdyYXBoaWNzLmxpbmVzKGN0eCxbXHJcbiAgICAgICAgW3RvcFgsdG9wWV0sXHJcbiAgICAgICAgW3RvcFgrY2VsbFNpemUqNCx0b3BZXSxcclxuICAgICAgICBbdG9wWCtjZWxsU2l6ZSo0LGdyaWRZXSxcclxuICAgICAgICBbZ3JpZFgrZ3JpZFNpemUsZ3JpZFldLFxyXG4gICAgICAgIFtncmlkWCtncmlkU2l6ZSxncmlkWStncmlkU2l6ZV0sXHJcbiAgICAgICAgW2dyaWRYLGdyaWRZK2dyaWRTaXplXSxcclxuICAgICAgICBbZ3JpZFgsZ3JpZFldLFxyXG4gICAgICAgIFt0b3BYLGdyaWRZXSxcclxuICAgICAgICBbdG9wWCx0b3BZXVxyXG4gICAgXSk7XHJcblxyXG4gICAgLy8gRHJhdyBncmlkXHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxncmlkU2l6ZTtpKz1jZWxsU2l6ZSl7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGkrZ3JpZFgsIGdyaWRZLCBpK2dyaWRYLCBncmlkWStncmlkU2l6ZSwgNSk7XHJcbiAgICAgICAgZ3JhcGhpY3MubGluZShjdHgsIGdyaWRYLCBncmlkWStpLCBncmlkWCtncmlkU2l6ZSwgZ3JpZFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo4O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCwgdG9wWStpLCB0b3BYK2NlbGxTaXplKjQsIHRvcFkraSwgNSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9Y2VsbFNpemU7aTxjZWxsU2l6ZSo0O2krPWNlbGxTaXplKXtcclxuICAgICAgICBncmFwaGljcy5saW5lKGN0eCwgdG9wWCtpLCB0b3BZLCB0b3BYK2ksIHRvcFkrY2VsbFNpemUqNiwgNSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9naWNcclxuICAgIGlmKCFjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IG5ldyAocmFuZG9tLmNob2ljZShibG9ja3MpKSh0b3BYLHRvcFkpO1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay54ID0gdG9wWCArIGNlbGxTaXplICogKDItTWF0aC5mbG9vcihjdXJyZW50QmxvY2sud2lkdGgvMikpO1xyXG5cclxuICAgICAgICBpZihjaGVja01vdmUoKSl7XHJcbiAgICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHNjb3JlICs9IGN1cnJlbnRCbG9jay5nZXRQaWVjZXMoKS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlKGNvdW50PjAuNSl7XHJcbiAgICAgICAgY291bnQtPTAuNTtcclxuXHJcbiAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgLy9Nb3ZlIGN1cnJlbnRCbG9jayBkb3duXHJcbiAgICAgICAgICAgIGN1cnJlbnRCbG9jay55ICs9IGNlbGxTaXplO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2hlY2tNb3ZlKCkpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnkgLT0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKGxldCBpPTA7aTxmYWxsZW5QaWVjZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgZ3JhcGhpY3MucmVuZGVyQmxvY2soY3R4LGZhbGxlblBpZWNlc1tpXVswXSxmYWxsZW5QaWVjZXNbaV1bMV0sZmFsbGVuUGllY2VzW2ldWzJdKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihjdXJyZW50QmxvY2spe1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay5yZW5kZXIoY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihnYW1lT3Zlcil7XHJcbiAgICAgICAgLy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZU92ZXJMb29wKTtcclxuICAgICAgICBxdWl6LmluaXQoKGFkZGl0aW9uUG9pbnRzKT0+e1xyXG4gICAgICAgICAgICBzY29yZSs9YWRkaXRpb25Qb2ludHM7XHJcblxyXG4gICAgICAgICAgICBmaW5hbFNjcmVlbiA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBnYW1lT3Zlckxvb3AoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWVPdmVyTG9vcCgpe1xyXG4gICAgY29uc3QgZHQgPSBjYWxjdWxhdGVEVCgpO1xyXG5cclxuICAgIGdyYXBoaWNzLnJlY3QoY3R4LDAsMCxjLndpZHRoLGMuaGVpZ2h0KTtcclxuXHJcbiAgICBncmFwaGljcy50ZXh0KGN0eCxgR2FtZSBPdmVyLiBTY29yZTogJHtzY29yZX1gLDEwMCw1MDAsMTUwKTtcclxuICAgIGdyYXBoaWNzLnRleHQoY3R4LFwiUHJlc3Mgc3BhY2UgYmFyIHRvIHJldHJ5XCIsMTAwLDcwMCwxMDApO1xyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lT3Zlckxvb3ApO1xyXG59XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gICAgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY1wiKTtcclxuICAgIGN0eCA9IGMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIGltYWdlcy5jYXN0bGUgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlcy5jYXN0bGUub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIC8vIFN0YXJ0cyBtdXNpY1xyXG4gICAgICAgIG11c2ljLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtZW51KTtcclxuICAgIH1cclxuICAgIGltYWdlcy5jYXN0bGUuc3JjID0gXCIuL2ltYWdlcy9wbGFuLmpwZ1wiO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PntcclxuICAgIGNvbnN0IHcgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuICAgIFxyXG4gICAgaWYoZmluYWxTY3JlZW4pe1xyXG4gICAgICAgIGlmKHc9PT0zMil7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNlIHtcclxuICAgICAgICBzd2l0Y2godyl7XHJcbiAgICAgICAgY2FzZSAzMjpcclxuICAgICAgICAgICAgLy9TcGFjZVxyXG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgLy9MZWZ0XHJcbiAgICAgICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCAtPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggKz0gY2VsbFNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQgPiAwLjcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZGlkbid0IGp1c3QgaGl0IHRoZSBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wQmxvY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM5OlxyXG4gICAgICAgICAgICAvL1JpZ2h0XHJcbiAgICAgICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sueCArPSBjZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLnggLT0gY2VsbFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQ+MC43KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0IGRpZG4ndCBqdXN0IGhpdCB0aGUgc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0MDpcclxuICAgICAgICAgICAgLy9Eb3duXHJcbiAgICAgICAgICAgIGlmKHN0YXJ0ZWQpe1xyXG4gICAgICAgICAgICAgICAgZG93biA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzODpcclxuICAgICAgICAgICAgLy9VcFxyXG4gICAgICAgICAgICBpZihzdGFydGVkKXtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gY3VycmVudEJsb2NrLmJvb2xNYXAuY29uY2F0KFtdKTsvLyBEdXBsaWNhdGVzIGJvb2xNYXBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLmJvb2xNYXAgPSByb3RhdGVMaXN0KGN1cnJlbnRCbG9jay5ib29sTWFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrLmJvb2xNYXAgPSBvbGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCA+IDAuNyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBoaXQgc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wQmxvY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+e1xyXG4gICAgY29uc3QgdyA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xyXG5cclxuICAgIGlmKHc9PT00MCl7XHJcbiAgICAgICAgZG93biA9IGZhbHNlO1xyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBncmFwaGljcyA9IHJlcXVpcmUoXCIuL2dyYXBoaWNzXCIpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKFwiLi9yYW5kb21cIik7XHJcbmNvbnN0IHJvdGF0ZUxpc3QgPSByZXF1aXJlKFwiLi9yb3RhdGVMaXN0XCIpO1xyXG5cclxuY29uc3QgY29sb3VycyA9IFtcclxuICAgIFwiI2YwMFwiLFxyXG4gICAgXCIjZmYwXCIsXHJcbiAgICBcIiMwMGZcIixcclxuICAgIFwiIzBmMFwiLFxyXG4gICAgXCIjZjBmXCIsXHJcbiAgICBcIiMwZmFcIlxyXG5dO1xyXG5cclxuY2xhc3MgQmxvY2sge1xyXG4gICAgY29uc3RydWN0b3IoeCx5LGJvb2xNYXApe1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmJvb2xNYXAgPSBib29sTWFwO1xyXG4gICAgICAgIHRoaXMuY29sID0gcmFuZG9tLmNob2ljZShjb2xvdXJzKTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBib29sTWFwLmxlbmd0aDtcclxuICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuaGVpZ2h0O2krKyl7XHJcbiAgICAgICAgICAgIGlmKGJvb2xNYXBbaV0ubGVuZ3RoPnRoaXMud2lkdGgpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IGJvb2xNYXBbaV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjdHgpe1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8dGhpcy5ib29sTWFwLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHg9MDt4PHRoaXMuYm9vbE1hcFt5XS5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9vbE1hcFt5XVt4XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MucmVuZGVyQmxvY2soY3R4LHRoaXMueCt4KjUwLHRoaXMueSt5KjUwLHRoaXMuY29sKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRCb3R0b20oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5ib29sTWFwLmxlbmd0aCo1MDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQaWVjZXMoKXtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTx0aGlzLmJvb2xNYXAubGVuZ3RoO3krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8dGhpcy5ib29sTWFwW3ldLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib29sTWFwW3ldW3hdKXtcclxuICAgICAgICAgICAgICAgICAgICBwaWVjZXMucHVzaChbdGhpcy54K3gqNTAsdGhpcy55K3kqNTAsdGhpcy5jb2xdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBpZWNlcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFwTGlzdFRvQmxvY2tzIChtYXBMaXN0KXtcclxuICAgIGNvbnN0IGJsb2NrcyA9IFtdO1xyXG4gICAgZm9yKGxldCBpPTA7aTxtYXBMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGJsb2Nrcy5wdXNoKGNsYXNzIGV4dGVuZHMgQmxvY2sge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvcih4LHkpe1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoeCx5LG1hcExpc3RbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmxvY2tzO1xyXG59XHJcblxyXG5jb25zdCBibG9ja0xpc3RSYXcgPSBbXHJcbiAgICBbXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzAsMV0sXHJcbiAgICAgICAgWzAsMV0sXHJcbiAgICAgICAgWzEsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMV0sXHJcbiAgICAgICAgWzFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxXSxcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMCwxLDFdXHJcbiAgICBdXHJcbl07XHJcbmNvbnN0IGJsb2NrTGlzdCA9IFtdO1xyXG5mb3IobGV0IGk9MDtpPGJsb2NrTGlzdFJhdy5sZW5ndGg7aSsrKXtcclxuICAgIGJsb2NrTGlzdC5wdXNoKGJsb2NrTGlzdFJhd1tpXSk7XHJcbiAgICBjb25zdCBuZXh0ID0gcm90YXRlTGlzdChibG9ja0xpc3RSYXdbaV0pO1xyXG4gICAgYmxvY2tMaXN0LnB1c2gobmV4dCk7XHJcbiAgICBjb25zdCBhbmROZXh0ID0gcm90YXRlTGlzdChuZXh0KTtcclxuICAgIGJsb2NrTGlzdC5wdXNoKGFuZE5leHQpO1xyXG4gICAgY29uc3QgZmluYWwgPSByb3RhdGVMaXN0KGFuZE5leHQpO1xyXG4gICAgYmxvY2tMaXN0LnB1c2goZmluYWwpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hcExpc3RUb0Jsb2NrcyhibG9ja0xpc3QpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2Jsb2Nrcy5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaW50cm9NdXNpYztcclxudmFyIG1haW5NdXNpYztcclxuXHJcbnZhciBhbHJlYWR5TG9hZGVkSW50cm8gPSBmYWxzZTtcclxudmFyIGFscmVhZHlMb2FkZWRNYWluID0gZmFsc2U7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaW50cm9NdXNpYyA9IG5ldyBBdWRpbygpO1xyXG4gICAgICAgIG1haW5NdXNpYyA9IG5ldyBBdWRpbygpO1xyXG5cclxuICAgICAgICBpbnRyb011c2ljLm9uY2FucGxheXRocm91Z2ggPSAoKT0+e1xyXG4gICAgICAgICAgICBpZighYWxyZWFkeUxvYWRlZEludHJvKXtcclxuICAgICAgICAgICAgICAgIGFscmVhZHlMb2FkZWRJbnRybyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbWFpbk11c2ljLm9uY2FucGxheXRocm91Z2ggPSAoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFhbHJlYWR5TG9hZGVkTWFpbil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFscmVhZHlMb2FkZWRNYWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm93IGV2ZXJ5dGhpbmcncyBsb2FkZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYXkgdGhlIG11c2ljXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludHJvTXVzaWMucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50cm9NdXNpYy5vbmVuZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGxheSB0aGUgbmV4dCBtdXNpY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk11c2ljLmxvb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk11c2ljLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtYWluTXVzaWMuc3JjID0gXCIuL211c2ljL211c2ljX21haW4ud2F2XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludHJvTXVzaWMuc3JjID0gXCIuL211c2ljL211c2ljX2ludHJvLndhdlwiO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbXVzaWMuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwicyA9IHtcclxuICAgYzp1bmRlZmluZWQsXHJcbiAgIGN0eDp1bmRlZmluZWRcclxufVxyXG52YXIgdHVybkRvbmUgPSBmYWxzZTtcclxudmFyIGJ1dHRvbnMgPSBbXTtcclxudmFyIHF1ZXN0aW9uUmVhZHkgPSBmYWxzZTtcclxudmFyIHF1ZXN0aW9uTGlzdCA9IFtdO1xyXG52YXIgc2VsZWN0ZWRJRCA9IDA7XHJcbnZhciBjdXJyZW50UXVlc3Rpb24gPSB1bmRlZmluZWQ7XHJcbnZhciBwb2ludHMgPSAxMDA7XHJcblxyXG52YXIgc3RhcnREYXRlID0gMDtcclxudmFyIGZpbmFsUG9pbnRzID0gMDtcclxudmFyIGFsbERvbmUgPSBmYWxzZTtcclxudmFyIGZpbmFsTG9vcDtcclxuLy9jbGFzc2VzXHJcbmNsYXNzIFF1ZXN0aW9ue1xyXG4gICBjb25zdHJ1Y3Rvcihxc3Qsb3B0cyxhbnN3KXtcclxuICAgICAgIHRoaXMucXN0ID0gcXN0Oy8vcXVlc3Rpb24tc3RyaW5nXHJcbiAgICAgICB0aGlzLm9wdHMgPSBzaHVmZmxlKG9wdHMpOy8vbGlzdCBvZiBwb3NzaWJsZSBhbnN3XHJcbiAgICAgICB0aGlzLmFuc3cgPSBhbnN3Oy8vXHJcbiAgICAgICB0aGlzLmNvcnJlY3RBbnN3SUQgPSB0aGlzLm9wdHMuaW5kZXhPZihhbnN3KTtcclxuICAgfVxyXG59XHJcbmNsYXNzIEJ1dHRvbntcclxuICAgY29uc3RydWN0b3IodHh0LHgseSx3LGgsZmdjLGJnYyxpZCl7XHJcbiAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgdGhpcy55ID0geTtcclxuICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICAgICB0aGlzLmggPSBoO1xyXG4gICAgICAgdGhpcy5mZ2MgPSBmZ2M7XHJcbiAgICAgICB0aGlzLmJnYyA9IGJnYztcclxuICAgICAgIHRoaXMudHh0ID0gdHh0O1xyXG4gICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICB9XHJcbiAgIHJlbmRlcigpe1xyXG4gICAgICAgRHJhd1JlY3QodGhpcy5iZ2MsdGhpcy54LHRoaXMueSx0aGlzLncsdGhpcy5oKTtcclxuICAgICAgIFdyaXRlKHRoaXMudHh0LHRoaXMuZmdjLHRoaXMueCs1MCx0aGlzLnkrNTAsXCI0MHB4IENvbnNvbGFzXCIpO1xyXG4gICAgICAgaWYgKHNlbGVjdGVkSUQgPT09IHRoaXMuaWQpe1xyXG4gICAgICAgICAgIERyYXdSZWN0T3V0bGluZShcIiNGRkZGRkZcIix0aGlzLngsdGhpcy55LHRoaXMudyx0aGlzLmgpO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIGNoZWNrQ2xpY2sobW91c2VYLG1vdXNlWSl7XHJcbiAgICAgICBpZiAodGhpcy54PG1vdXNlWCAmJiBtb3VzZVg8dGhpcy54K3RoaXMudyl7XHJcbiAgICAgICAgICAgaWYgKHRoaXMueTxtb3VzZVkgJiYgbW91c2VZPHRoaXMueSt0aGlzLmgpe1xyXG4gICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgIH1cclxufVxyXG4vL2Z1bmN0aW9uc1xyXG5mdW5jdGlvbiByYW5kb21ObyhtaW4sbWF4KXtcclxuICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoobWF4LW1pbikrbWluKTtcclxufVxyXG5mdW5jdGlvbiBzaHVmZmxlKG15TGlzdCl7XHJcbiAgIGNvbnN0IG9sZExpc3QgPSBteUxpc3Q7XHJcbiAgIGNvbnN0IG5ld0xpc3QgPSBbXTtcclxuICAgY29uc3QgbGVuZ3RoID0gb2xkTGlzdC5sZW5ndGg7XHJcbiAgIGZvciAobGV0IGk9MDtpPGxlbmd0aDtpKyspe1xyXG4gICAgICAgY29uc3QgaXRlbUluZGV4ID0gcmFuZG9tTm8oMCxvbGRMaXN0Lmxlbmd0aC0xKTtcclxuICAgICAgIG5ld0xpc3QucHVzaChvbGRMaXN0W2l0ZW1JbmRleF0pXHJcbiAgICAgICBvbGRMaXN0LnNwbGljZShpdGVtSW5kZXgsMSk7XHJcbiAgIH1cclxuICAgLy9jb25zb2xlLmxvZyhvbGRMaXN0LG5ld0xpc3QsbXlMaXN0KTtcclxuICAgcmV0dXJuIG5ld0xpc3Q7XHJcbn1cclxuZnVuY3Rpb24gRHJhd1JlY3QoY29sLHgseSx3LGgpe1xyXG4gICBzLmN0eC5maWxsU3R5bGUgPSBjb2w7XHJcbiAgIHMuY3R4LmZpbGxSZWN0KHgseSx3LGgpO1xyXG59XHJcbmZ1bmN0aW9uIERyYXdSZWN0T3V0bGluZShjb2wseCx5LHcsaCl7XHJcbiAgIHMuY3R4LnN0cm9rZVN0eWxlID0gY29sO1xyXG4gICBzLmN0eC5saW5lV2lkdGggPSBcIjVcIjtcclxuICAgcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgIHMuY3R4LnJlY3QoeCx5LHcsaCk7XHJcbiAgIHMuY3R4LnN0cm9rZSgpO1xyXG59XHJcbmZ1bmN0aW9uIHJlc2l6ZUNhbnZhcyh3LGgpe1xyXG4gICBzLmMud2lkdGggPSB3O1xyXG4gICBzLmMuaGVpZ2h0ID0gaDtcclxufVxyXG5mdW5jdGlvbiBXcml0ZSh0eHQsY29sLHgseSxmb250KXtcclxuICAgcy5jdHguZmlsbFN0eWxlID0gY29sO1xyXG4gICBzLmN0eC5mb250ID0gZm9udDtcclxuICAgcy5jdHguZmlsbFRleHQodHh0LHgseSk7Ly91c2UgY29uc29hbHNcclxufVxyXG4vL3JlbmRlclxyXG5mdW5jdGlvbiByZW5kZXIoKXtcclxuXHJcbiAgIERyYXdSZWN0KFwiIzAwMDAwMFwiLDAsMCxzLmMud2lkdGgscy5jLmhlaWdodCk7XHJcbiAgIGlmICghdHVybkRvbmUpe1xyXG4gICAgICAgaWYoIXF1ZXN0aW9uUmVhZHkpe1xyXG4gICAgICAgICAgIC8vY3JlYXRlIGJ1dHRvbnNcclxuICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24gPSBxdWVzdGlvbkxpc3RbcmFuZG9tTm8oMCxxdWVzdGlvbkxpc3QubGVuZ3RoKV07XHJcbiAgICAgICAgICAgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGN1cnJlbnRRdWVzdGlvbi5vcHRzKTtcclxuICAgICAgICAgICBidXR0b25zLnB1c2gobmV3IEJ1dHRvbihjdXJyZW50UXVlc3Rpb24ub3B0c1swXSwxMDAsMjAwLDUwMCwyMDAsXCIjMDAwMDAwXCIsXCIjRkYwMDAwXCIsMCkpO1xyXG4gICAgICAgICAgIGJ1dHRvbnMucHVzaChuZXcgQnV0dG9uKGN1cnJlbnRRdWVzdGlvbi5vcHRzWzFdLDcwMCwyMDAsNTAwLDIwMCxcIiMwMDAwMDBcIixcIiMwMDAwRkZcIiwxKSk7XHJcbiAgICAgICAgICAgYnV0dG9ucy5wdXNoKG5ldyBCdXR0b24oY3VycmVudFF1ZXN0aW9uLm9wdHNbMl0sMTAwLDUwMCw1MDAsMjAwLFwiIzAwMDAwMFwiLFwiIzAwRkYwMFwiLDIpKTtcclxuICAgICAgICAgICBidXR0b25zLnB1c2gobmV3IEJ1dHRvbihjdXJyZW50UXVlc3Rpb24ub3B0c1szXSw3MDAsNTAwLDUwMCwyMDAsXCIjMDAwMDAwXCIsXCIjRkZGRjAwXCIsMykpO1xyXG4gICAgICAgICAgIHF1ZXN0aW9uUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgZm9yIChsZXQgaT0wO2k8YnV0dG9ucy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICBidXR0b25zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgV3JpdGUoY3VycmVudFF1ZXN0aW9uLnFzdCxcIiNGRkZGRkZcIiw1MCw1MCxcIjc1cHggQ29uc29sYXNcIik7XHJcbiAgICAgICBsb29wU2Vjb25kcyA9IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKSAvIDEwMDA7XHJcbiAgICAgICBpZiAoTWF0aC5yb3VuZChsb29wU2Vjb25kcz49NSkpe1xyXG4gICAgICAgICAgIHR1cm5Eb25lID0gdHJ1ZTtcclxuICAgICAgICAgICBwb2ludHMgPSAwO1xyXG4gICAgICAgfVxyXG4gICAgICAgV3JpdGUoXCJUaW1lIGxlZnQ6XCIgKyAoNS1NYXRoLnJvdW5kKGxvb3BTZWNvbmRzKSkudG9TdHJpbmcoKSxcIiNGRkZGRkZcIiw1MCwxMjAsXCI2NXB4IENvbnNvbGFzXCIpO1xyXG4gICB9XHJcbiAgIGlmKHR1cm5Eb25lKXtcclxuICAgICAgIGlmIChzZWxlY3RlZElEID09PSBjdXJyZW50UXVlc3Rpb24uY29ycmVjdEFuc3dJRCl7XHJcbiAgICAgICAgICAgV3JpdGUoXCJDb3JyZWN0IVwiLFwiI0ZGRkZGRlwiLDUwLDUwLFwiNzVweCBDb25zb2xhc1wiKTtcclxuICAgICAgICAgICBXcml0ZShcIllvdSBnb3QgXCIrcG9pbnRzLnRvU3RyaW5nKCkrXCIgZXh0cmEgcG9pbnRzXCIsXCIjRkZGRkZGXCIsNTAsMTI1LFwiNjVweCBDb25zb2xhc1wiKTtcclxuXHJcbiAgICAgICAgICAgZmluYWxQb2ludHMgPSBwb2ludHM7XHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNle1xyXG4gICAgICAgICAgIFdyaXRlKFwiVGhlIGFuc3dlciB3YXMgXCIrY3VycmVudFF1ZXN0aW9uLmFuc3csXCIjRkZGRkZGXCIsNTAsNTAsXCI3NXB4IENvbnNvbGFzXCIpO1xyXG4gICAgICAgICAgIFdyaXRlKFwiWW91IGdvdCBubyBleHRyYSBwb2ludHNcIixcIiNGRkZGRkZcIiw1MCwxMjUsXCI2NXB4IENvbnNvbGFzXCIpO1xyXG5cclxuICAgICAgICAgICBmaW5hbFBvaW50cyA9IDA7XHJcbiAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgIFdyaXRlKFwiUHJlc3MgU3BhY2UgdG8gQ29udGludWVcIixcIiNGRkZGRkZcIiw1MCwxODAsXCI2MHB4IENvbnNvbGFzXCIpO1xyXG4gICB9XHJcbiAgIGlmKCFhbGxEb25lKXtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICB9XHJcbn1cclxuLy9vbmxvYWRcclxuZnVuY3Rpb24gaW5pdChmaW5hbEwpe1xyXG4gICAgZmluYWxMb29wID0gZmluYWxMO1xyXG4gICBzLmMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNcIik7XHJcbiAgIHMuY3R4ID0gcy5jLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgLy9jcmVhdGUgcXVlc3Rpb25zXHJcbiAgIHF1ZXN0aW9uTGlzdC5wdXNoKG5ldyBRdWVzdGlvbihcIldoYXQgd2VyZSBKYXBhbmVzZSBDYXN0bGVzIEJ1aWx0IGZyb20/XCIsXHJcbiAgIFtcIldvb2QgYW5kIFN0b25lXCIsXCJCcmlja3NcIixcIlN0b25lXCIsXCJNZXRhbFwiXSxcIldvb2QgYW5kIFN0b25lXCIpKTtcclxuICAgcXVlc3Rpb25MaXN0LnB1c2gobmV3IFF1ZXN0aW9uKFwiSG93IG1hbnkgc3RvcmV5cyB0YWxsIGFyZSBKYXBhbmVzZSBDYXRsZXM/XCIsXHJcbiAgIFtcIjMtNVwiLFwiMi00XCIsXCIyLTZcIixcIk92ZXIgOC0xMFwiXSxcIjMtNVwiKSk7XHJcbiAgIHF1ZXN0aW9uTGlzdC5wdXNoKG5ldyBRdWVzdGlvbihcIldoaWNoIGNhc3RsZSB3YXMgSXllYXN1IFRva3VnYXdhJ3MgYmFzZT9cIixcclxuICAgW1wiRWRvIENhc3RsZVwiLFwiSGltZWppIENhc3RsZVwiLFwiT3Nha2EgQ2FzdGxlXCIsXCJNYXRzdW1vdG8gY2FzdGxlXCJdLFwiRWRvIENhc3RsZVwiKSk7XHJcbiAgIHF1ZXN0aW9uTGlzdC5wdXNoKG5ldyBRdWVzdGlvbihcIldoYXQgaXMgdGhlIHByb2Nlc3Mgb2YgZGVzaWducyBKYXBhbmVzZSBDYXN0bGVzIGNhbGxlZD9cIixcclxuICAgW1wiTmF3YXRhcmlcIixcIk5pd2FiYXJpXCIsXCJUZW5zaHVcIixcIk5hd2FiYXJpXCJdLFwiTmF3YWJhcmlcIikpO1xyXG4gICBxdWVzdGlvbkxpc3QucHVzaChuZXcgUXVlc3Rpb24oXCJXaGVuIGRpZCBJeWVhc3UgVG9rdWdhd2EgaW52YWRlIE9zYWthIENhc3RsZT9cIixcclxuICAgW1wiMTYxNVwiLFwiMTYyMFwiLFwiMTYxOFwiLFwiMTYxNlwiXSxcIjE2MTVcIikpO1xyXG5cclxuICAgIC8vZXZlbnRzXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixmdW5jdGlvbihlKXtcclxuICAgICAgICB3ID0gZS53aGljaHx8ZS5rZXlDb2RlO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKCF0dXJuRG9uZSl7XHJcbiAgICAgICAgICAgIHN3aXRjaCh3KXtcclxuICAgICAgICAgICAgICAgIGNhc2UgMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgdHVybkRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsRGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyA9IChmaW5hbERhdGUgLSBzdGFydERhdGUpIC8gMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSBNYXRoLnJvdW5kKHBvaW50cy0oc2Vjb25kcyoxMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJRD4wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJRC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzk6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSUQ8Myl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSUQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZih3PT09MzIpe1xyXG4gICAgICAgICAgICAvLyBDb250aW51ZSB0byBmaW5hbFxyXG5cclxuICAgICAgICAgICAgYWxsRG9uZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PntcclxuICAgICAgICAgICAgICAgIGZpbmFsTG9vcChmaW5hbFBvaW50cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0OmluaXR9O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9qYXNvbnNPbmUuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==