function voiceProgress($progressInside,$progressOutside,$progressBall){
    return new voiceProgress.prototype.init($progressInside,$progressOutside,$progressBall)
}
voiceProgress.prototype = {
    constructor:voiceProgress,
    musicList :[],
    init:function($progressInside,$progressOutside,$progressBall){
        this.$progressInside = $progressInside
        this.$progressOutside = $progressOutside
        this.$progressBall = $progressBall
        
    },
    progressClick:function(callback){
        var that = this
        
        this.$progressInside.click(function(event){          //点击进度条事件
            
            var left = $(this).offset().left 
            var event_left = event.pageX
            console.log(event_left-left);
            that.$progressOutside.css("width",event_left-left)
            that.$progressBall.css("left",event_left-left-7)
            var value = (event_left-left)/$(this).width()
            console.log(value);
            callback(value)
        })
    },
    progressMove:function(callback){
        var that = this
        
        this.$progressInside.mousedown(function(){
            var left = $(this).offset().left 
            var width = $(this).width()
            
            $(document).mousemove(function(event){
                
                if (event.pageX>left && event.pageX < left+width){

                    var event_left = event.pageX
                    
                    that.$progressOutside.css("width",event_left-left)
                    that.$progressBall.css("left",event_left-left-7)
                    
                    var value = (event_left-left)/$(this).width()
                    callback(value)
                    
                    
                }
            })
        })



        $(document).mouseup(function(){
            $(document).off("mousemove")
        }) 
        
    },
    
        
        
    
}
voiceProgress.prototype.init.prototype = voiceProgress.prototype
window.voiceProgress = voiceProgress