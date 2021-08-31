var username_reg = /^[\u4E00-\u9FA5]{2,8}$/
var password_reg = /^[a-zA-Z]\w{5,17}$/
var phonenumber_reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/

var sign_up = document.getElementById('sign_up')
console.log(sign_up);

var username = document.getElementsByClassName('username')[0].children[0]
var password = document.getElementsByClassName('password')[0].children[0]
var password_confirm = document.getElementsByClassName('password_confirm')[0].children[0]
var phone_number = document.getElementsByClassName('phone_number')[0].children[0]

var isCorrect = document.getElementById('isCorrect')

var sign_up_btn = document.getElementById('sign_up_btn')

console.log(username);
function reg_test(ele,ele_rule){          //检测用户输入
    ele.onblur = function(){
        
        if(ele_rule.test(ele.parentNode.children[0].value)){
            ele.parentNode.children[1].classList.remove('error')
            ele.parentNode.children[1].classList.add('correct')
            ele.parentNode.children[1].innerText = '正确'
        }else {
            ele.parentNode.children[1].classList.remove('correct')
            ele.parentNode.children[1].classList.add('error')
            ele.parentNode.children[1].innerText = '错误'
        }
    }
}
reg_test(username,username_reg)
reg_test(password,password_reg)
reg_test(phone_number,phonenumber_reg)
password_confirm.onblur = function(){
    if(password.value==password_confirm.value&&password_reg.test(password_confirm.value)){
        this.parentNode.children[1].classList.remove('error')
        this.parentNode.children[1].classList.add('correct')
        this.parentNode.children[1].innerText='正确'
    }else{
        this.parentNode.children[1].classList.remove('correct')
        this.parentNode.children[1].classList.add('error')
        this.parentNode.children[1].innerText='错误'
    }
}


function move(ele,speed,distance){               //动画效果
    var initpostion = ele.offsetTop
    var time1 = setInterval(function(){
        console.log("正在移动");
        
        ele.style.marginTop = ele.offsetTop+speed+'px'
        if((ele.offsetTop-initpostion)>=distance){
            clearInterval(time1)
        }
    },1)
    
}
move(sign_up,1,200)

function checkinfo(){
    console.log(username.parentNode.children[1].innerHTML);
    if(username.parentNode.children[1].innerText == '正确'&&password.parentNode.children[1].innerText == '正确'&&password_confirm.parentNode.children[1].innerText == '正确'&&phone_number.parentNode.children[1].innerText == '正确')return 1
    else return 0 
}

sign_up_btn.onclick = function(){
    if(checkinfo()==1){
        alert('注册成功')


        //ajax把数据传给后台
        axios({
            method:'GET',
            url:'http://127.0.0.1:5500/表单注册',
            data:{
                username:username.value,
                passwd:password.value,
                phone:phone_number.value
            }
        }).then(response=>{
            console.log(response);
        })
    }else alert('无效信息！')
}






