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