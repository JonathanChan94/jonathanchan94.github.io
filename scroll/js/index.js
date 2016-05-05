var div = document.getElementsByTagName("div");
var li = document.getElementById("button").getElementsByTagName("li");
var pageH = document.documentElement.clientHeight; //获取页面高度
var ismoving = false; //当多次触发时由此控制
var allheight = document.documentElement.scrollHeight; //获取文档的总高度
var index = 0;

//使得无论从哪个页面刷新都会跳回第一页
// setTimeout(function() {
//     window.scrollTo(0, 0);
//     showButton(index);
//     move(index);
// }, 1000)
var curH=window.pageYOffset;
index=Math.floor(curH/pageH);
move(index);
showButton(index);


var scrollFunc = function(e) {
        e = e || window.event;
        if (ismoving) {
            return;
        } else {
            //判断浏览器IE，谷歌滑轮事件(wheelDelta) FireFox滚轮事件(detail)             
            if (e.wheelDelta > 0 || e.detail < 0) { //当滑轮向上滚动时
                var current = window.pageYOffset;
                if (current == 0) {
                    return;
                } else {
                    // reback(index);
                    var curindex = index;
                    index--;
                    pageScroll(-pageH, -1, current, curindex);
                }
            }
            if (e.wheelDelta < 0 || e.detail > 0) { //当滑轮向下滚动时
                var current = window.pageYOffset;
                if (current == allheight - pageH) {
                    return;
                } else {
                    var curindex = index;
                    index++;
                    pageScroll(pageH, 1, current, curindex);
                }
            }
        }
    }
    //给页面绑定滑轮滚动事件(FireFox)
if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}

//滚动滑轮触发scrollFunc方法
window.onmousewheel = document.onmousewheel = scrollFunc;

var timer = null;

function pageScroll(height, speed, cur, curindex) {
    ismoving = true;
    var all = cur + height;
    var moveheight = 0;
    showButton(index);
    var _page = Math.abs(height);

    timer = setInterval(function() {
        var newCur = window.pageYOffset;
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        top = newCur + speed;
        window.scrollTo(0, top);
        moveheight += Math.abs(speed);
        // console.log(speed);
        if (speed > 0) {
            if (moveheight > (_page / 9) * 5) {
                speed--;
            } else {
                speed++;
            }
        } else {
            if (moveheight > (_page / 9) * 5) {
                speed++;
            } else {
                speed--;
            }
        }

        if (moveheight >= _page) {
            clearInterval(timer);
            window.scrollTo(0, all);
            ismoving = false;
            move(index);
            reback(curindex); //重制之前页面的样式
        }
    }, 10)

}

//还原至原位置
function reback(index) {
    var pEle=div[index].getElementsByTagName("*");
    for(var i=0;i<pEle.length;i++){
        pEle[i].style.opacity=0;
        switch(pEle[i].tagName){
            case "IMG":pEle[i].style.left=pEle[i].offsetLeft-100+'px';break;
            case "H1":pEle[i].style.top=pEle[i].offsetTop-100+'px';break;
            case "H2":pEle[i].style.top=pEle[i].offsetTop+100+'px';
                    pEle[i].style.left=pEle[i].offsetLeft+100+'px';
                    break;
            case "UL":pEle[i].style.top=pEle[i].offsetTop+100+'px';break;
        }
    }
}

//每页的动画效果
function move(index) {
    var oEle=div[index].getElementsByTagName("*");
    for(var i=0;i<oEle.length;i++){
        oEle[i].style.opacity=1;
        switch(oEle[i].tagName){
            case "IMG":oEle[i].style.left=oEle[i].offsetLeft+100+'px';break;
            case "H1":oEle[i].style.top=oEle[i].offsetTop+100+'px';break;
            case "H2":oEle[i].style.top=oEle[i].offsetTop-100+'px';
                    oEle[i].style.left=oEle[i].offsetLeft-100+'px';
                    break;
            case "UL":oEle[i].style.top=oEle[i].offsetTop-100+'px';break;
        }
    }
}

for (var i = 0; i < li.length; i++) {
    li[i].onclick = function() {
        if (ismoving) {
            return;
        }
        if (this.className == 'active') {
            return;
        }
        var curindex = index;
        var myIndex = this.getAttribute("index");
        index = myIndex;
        showButton(index);
        var _index = index - curindex;
        var totalH = _index * pageH;
        var current = window.pageYOffset;
        pageScroll(totalH, _index, current, curindex);
    }
}

function showButton(p) {
    for (var j = 0; j < li.length; j++) {
        if (li[j].className == "active") {
            li[j].className = "";
        }
    }
    setTimeout(function() {
        li[p].className = "active";
    }, 200)
}