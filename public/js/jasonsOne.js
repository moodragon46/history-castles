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
