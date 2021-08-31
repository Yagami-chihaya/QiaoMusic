function Progress($progressInside,$progressOutside,$progressBall){
    return new Progress.prototype.init($progressInside,$progressOutside,$progressBall)
}
Progress.prototype = {
    constructor:Progress,
    musicList :[],
    init:function($progressInside,$progressOutside,$progressBall){
        this.$progressInside = $progressInside
        this.$progressOutside = $progressOutside
        this.$progressBall = $progressBall
        
    },
    progressClick:function(callBack){
        var that = this
        
        this.$progressInside.click(function(event){          //点击进度条事件
            
            var left = $(this).offset().left 
            var event_left = event.pageX
            console.log(event_left-left);
            that.$progressOutside.css("width",event_left-left)
            that.$progressBall.css("left",event_left-left-7)
            var value = (event_left-left)/$(this).width()
            var ismove = false
            var params = [value,ismove] 
            callBack(params)
                    //将点击时间轴的歌曲播放时长占比传给回调函数。
        })
    },
    progressMove:function(callBack){
        var that = this
        
        this.$progressInside.mousedown(function(){
            var left = $(this).offset().left 
            var width = $(this).width()
            
            $(document).mousemove(function(event){
                var isMove = true
                if (event.pageX>left && event.pageX < left+width){

                    var event_left = event.pageX
                    
                    that.$progressOutside.css("width",event_left-left)
                    that.$progressBall.css("left",event_left-left-7)
                    var value = (event_left-left)/$(this).width()
                    
                    var params = [value,isMove]          //isMove用于判断小球是否正在移动，并把参数传回
                    callBack(params)
                    
                }
            })
        })
        $(document).mouseup(function(){
            $(document).off("mousemove")
            isMove = false
            
        }) 
        
    },
    
        
        
    
}
Progress.prototype.init.prototype = Progress.prototype
window.Progress = Progress