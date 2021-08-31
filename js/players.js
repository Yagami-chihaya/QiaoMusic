
function Player($audio){
    return new Player.prototype.init($audio)
}
Player.prototype = {
    constructor:Player,
    musicList :[],
    init:function($audio){
        this.$audio = $audio
        this.audio = $audio.get(0)
        this.audio.volume = 2/3
    },
    currentIndex : -1,
    playMusic:function(index,music){         //播放歌曲
        if(this.currentIndex==index){
            if(this.audio.paused){
                this.audio.play();

            }else {
                this.audio.pause();
            }
        }else {
            this.$audio.attr("src",music.link_url);
            this.audio.play();
            console.log(this);
            this.currentIndex = index;
        }
    },
    removeMusic:function(index,music){        //删除歌曲
        
        
        this.musicList.splice(index,1)
    },
    getAllTime:function(){
        return this.audio.duration;
    },
    getCurrentTime:function(){
        return this.audio.currentTime;
    },
    musicSkip:function(value,isMove){         //跳转时长功能
        console.log(isMove);
        if (isMove===true){         //如果小球正在移动，则返回给index.js的变量isMove.同时阻断歌曲当前播放时长的改变，防止移动小球造成音乐断断续续地播放
            return "True";
        }
        else {
            this.audio.currentTime = this.audio.duration*value
            
        }
        
    },
    musicVoiceControl:function(value){
        this.audio.volume = value
    }
}
Player.prototype.init.prototype = Player.prototype
window.Player = Player