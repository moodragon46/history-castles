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