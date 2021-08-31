$(function(){

    var $audio = $("audio")          //获取audio元素
    var player = new Player($audio)          //传入audio对象生成实例
    var lyric;
 

    var $progressInside = $(".bar_inside")      //获取底部进度条
    var $progressOutside = $(".bar_outside")
    var $progressBall = $(".bar_ball")
    var progress = Progress($progressInside,$progressOutside,$progressBall)

    var $voice_progress_inside = $(".voice_bar_inside")        //获取音量进度条
    var $voice_progress_outside = $(".voice_bar_outside")
    var $voice_progress_ball = $(".voice_bar_ball")
    var voice_progress = voiceProgress($voice_progress_inside,$voice_progress_outside,$voice_progress_ball)
    
    



    progress.progressClick(function(params){         //使用回调函数返回的value，传给player.musicSkip方法.实现点击跳转歌曲时长的功能
        player.musicSkip(params[0],params[1])
    })
    var isMove = ""
    progress.progressMove(function(params){
        isMove = player.musicSkip(params[0],params[1])
    })

    voice_progress.progressClick(function(value){
        player.musicVoiceControl(value)
    })
    voice_progress.progressMove(function(value){
        player.musicVoiceControl(value)
    })


    
    function getMusicList(){            //获取播放歌单json的数据
        $.ajax({
            url:"../resource/musicList.json",
            dataType:"json",
            success:function(data){
                player.musicList = data
                var $musicList=$(".content_list ul");
                $.each(data,function(index,ele){
                    var $item=createMusicItem(index,ele);
                    
                    $musicList.append($item)
                })
                initMusicInfo(data[0])
                initLyricInfo(data[0])
            },
            error:function(e){
                console.log(e);
            }
        })
    }
    getMusicList();


    function initMusicInfo(music){
        var $musicImage = $(".sing_cover img")      //获取歌单信息元素
        var $musicName = $(".sing_name")
        var $musicSinger = $(".sing_singer")
        var $musicAlbum = $(".sing_album")
        var $musicProgressName = $(".middle_menu_top .music_name")
        var $musicProgressTime = $(".middle_menu_top .music_time")
        var $bg = $(".mask_bg")

        $musicImage.attr("src",music.cover)       //自定义设置歌单元素
        $musicName.text(music.name)
        $musicSinger.text(music.singer)
        $musicAlbum.text(music.album)
        $musicProgressName.text(music.name+"/"+music.singer)
        $musicProgressTime.text(music.time)
        $bg.css("background","url('"+music.cover+"')")
    }

    function initLyricInfo(music){
        lyric = new Lyric(music.link_lrc)
        $(".sing_lyric").html("")
        lyric.loadLyric(function(){
            $.each(lyric.lyrics,function(index,ele){
                var $item = "<li>"+ele+"</li>"
                $(".sing_lyric").append($item)
            })
        })
        
    }

    $(".content_list").delegate(".list_music","mouseenter",function(){      //鼠标移入移出歌曲时显示关闭菜单
        $(this).find(".list_menu").stop().fadeIn(500)
        $(this).find(".time>span").stop().fadeOut(0)
        $(this).find(".time>a").stop().fadeIn(0)
    });
    $(".content_list").delegate(".list_music","mouseleave",function(){
        $(this).find(".list_menu").stop().fadeOut(500)
        $(this).find(".time>span").stop().fadeIn(0)
        $(this).find(".time>a").stop().fadeOut(0)
    });

    

    
        function checkBox(){
            var p=0;
    
            $(".content_list").delegate(".list_music .check","click",function(){
                console.log(this);         //复选框
                $(this).toggleClass("checked")
                ;
            })
            
            $(".content_list").delegate(".list_title .check","click",function(){
                if(p==0){
                    $(".check").addClass("checked");
                    p=1;
                }
                else if(p==1){
                    $(".check").removeClass("checked");
                    p=0;
                }
            })
        }
        checkBox();


    $(".content_list").delegate(".list_menu_play","click",function(){


        var $item = $(this).parents(".list_music")   //获取每个li元素的共同父节点
        console.log($item.get(0).index);
        console.log($item.get(0).music);
        


        $(this).toggleClass("list_menu_play2")   //给按钮添加切换效果
        $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2")
        
        if ($(this).hasClass("list_menu_play2") == true){
            
            $(".footer>.footer_in>.left_menu>.playToggle").addClass("playToggle2")
            $(this).parents(".list_music").find("div").css("opacity",1)
            $(this).parents(".list_music").siblings().find("div").css("opacity",0.5)
            $(this).parents(".list_music").find(".number").addClass("number2")
            $(this).parents(".list_music").siblings().find(".number").removeClass("number2")
        }
        else {
            $(".footer>.footer_in>.left_menu>.playToggle").removeClass("playToggle2")
            $(this).parents(".list_music").find("div").css("opacity",0.5)
            $(this).parents(".list_music").find(".number").removeClass("number2")
        }

        
            initMusicInfo($item.get(0).music)  //切换显示歌曲信息
            initLyricInfo($item.get(0).music)  //切换歌词信息
            player.playMusic($item.get(0).index,$item.get(0).music)        //播放音乐
        
        

    })
    
    $(".content_list").delegate(".delete_music","click",function(){
        var $item = $(this).parents(".list_music")

        if ($item.get(0).index==player.currentIndex){
            $(".left_menu").find("a").eq(2).click()
            console.log($item.get(0).index);
            console.log(player.currentIndex);
            player.currentIndex-=1
        }


        $item.remove()
        player.removeMusic($item.get(0).index,$item.get(0).music)
        $(".list_music").each(function(index,ele){
            ele.index = index            //把更新后的序列赋值给现有的li
            $(ele).find(".number").text(index+1)
        })

        
    })

    $(".footer>.footer_in>.left_menu>.playToggle").click(function(){ 
        $(this).toggleClass("playToggle2")                          //设置底部播放按钮切换和播放效果
        if(player.currentIndex == -1){
            $(".list_music").eq(0).find(".list_menu_play").click()
            
        }else {
            $(".list_music").eq(player.currentIndex).find(".list_menu_play").click()
        }
        
    })

    $(".left_menu").find("a").eq(0).click(function(){              //设置播放上一曲效果
        console.log(player.currentIndex);
        if(player.currentIndex > 0){
            
            $(".list_music").eq(player.currentIndex-1).find(".list_menu_play").click()
        }
        else {
            $(".list_music").eq($(".list_music").length-1).find(".list_menu_play").click()
        }
    })

    $(".left_menu").find("a").eq(2).click(function(){              //设置播放下一曲效果
        if(player.currentIndex<$(".list_music").length-1){
            console.log($(".list_music").length-1);
            
            $(".list_music").eq(player.currentIndex+1).find(".list_menu_play").click()
        }
        else {
            $(".list_music").eq(0).find(".list_menu_play").click()
        }
    })

    $(".footer>.footer_in>.right_menu>.playMode").click(function(){    //底部播放模式切换
        $(this).toggleClass("playMode1")
        
    })

    $(".footer>.footer_in>.right_menu>.love_off").click(function(){      //底部喜欢按钮切换
        $(this).toggleClass("love_on")
    })

    $(".footer>.footer_in>.right_menu>.switch_off").click(function(){     //底部开关切换
        $(this).toggleClass("switch_on")
    })

    $(".footer>.footer_in>.voiceChange>a>img").click(function(){
        $(this).toggleClass("img1")
        if ($(this).attr("class").indexOf("img1")!=-1) {
            player.musicVoiceControl(0)
        }else {
            player.musicVoiceControl(1)
        }
    })

    player.$audio.on("timeupdate",function(){            //获取歌曲总时长和当前时长，并返回给页面
        
        var AllTime = player.getAllTime()
        var CurrentTime = player.getCurrentTime()
        lyricTime = CurrentTime
        AllTime = formatTime(AllTime)
        CurrentTime = formatTime(CurrentTime)
        $(".music_time").text(CurrentTime+"/"+AllTime);
        barBallScroll(parseInt(player.getAllTime()),parseInt(player.getCurrentTime()))

        var index = lyric.currentIndex(lyricTime)
        console.log(index);
        var $item = $(".sing_lyric li").eq(index)
        $item.parents(".sing_lyric").children().removeClass("on")
        $item.addClass("on")

        if(index<0) return 0;
        $(".sing_lyric").css({
            marginTop: (-index+1)*40
        })
    })

    
    function formatTime(time){               //时间格式转换
        mins = parseInt(time/60)
        seconds = parseInt(time%60)
        if(mins<10){
            mins = "0"+mins
        }
        if(seconds<10){
            seconds = "0"+seconds
        }
        return mins+":"+seconds
    }

    function barBallScroll (alltime,time){
        if (isMove=='True') {
            isMove='False'
            return 0;
        }
        else{
            var value = parseInt(time/alltime*100)+"%"
        
            
            $(".bar_ball").css("left",value)
            $(".bar_outside").css("width",value)
        }
        
        
        
    }
    

    function createMusicItem(index,music){                //动态生成单曲
        var $item=$("<li class=\"list_music\">\n"+
        "<div class=\"check\"><span></span></div>\n"+
        "<div class=\"number\">"+(index+1)+"</div>\n"+
        "<div class=\"name\">"+music.name+"\n"+
            "<div class=\"list_menu\">\n"+
                "<a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n"+
                "<a href=\"javascript:;\" title=\"添加\"></a>\n"+
                "<a href=\"javascript:;\" title=\"下载\"></a>\n"+
                "<a href=\"javascript:;\" title=\"分享\"></a>\n"+
            "</div>\n"+
        "</div>\n"+
        "<div class=\"singer\">"+music.singer+"</div>\n"+
        "<div class=\"time\">\n"+
            "<span>"+music.time+"</span>\n"+
            "<a href=\"javascript:;\" title=\"删除\" class=\"delete_music\"></a>\n"+
        "</div>\n"+
        "</li>")

        $item.get(0).index = index        //get(0)可以把jq对象转为原生js，这段意思获取li节点在父元素的序列和歌单json对应数据
        $item.get(0).music = music
        return $item;
    }

    $(".content_list ").mCustomScrollbar();
})
