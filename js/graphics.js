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