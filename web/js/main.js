
(function () {
    var isReady = false,
        contentLoadedHandler;

    function ready() {
        if (!isReady) {
            // triggerEvent(document, "ready");
            domReady();
            isReady = true;
        }
    }
    if (document.readyState === "complete") {
        ready();
    }
    if (document.addEventListener) {
        contentLoadedHandler = function () {
            document.removeEventListener("DOMContentLoaded", contentLoadedHandler, false);
            ready();
        }
        document.addEventListener("DOMContentLoaded", contentLoadedHandler, false);
    } else if (document.attachEvent) {
        contentLoadedHandler = function () {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", contentLoadedHandler);
                ready();
            }
        };
        document.attachEvent("onreadystatechange", contentLoadedHandler);
        var toplevel = false;
        try {
            toplevel = window.frameELement == null;
        } catch (e) {

        }
        if (document.documentElement.doScroll && toplevel) {
            doScrollCheck();
        }
    };

    function doScrollCheck() {
        if (isReady) return;
        try {
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
        }
        ready();
    }
})();

var domReady = function () {
    var sliderItems = query(".slider-item");
    var buttonSon = query(".button-son");
    var list = buttonSon[0].getElementsByTagName("li");
    var nextIndex = 1;
    var curIndex = 0;
    var timer = null;

    var slide = {
        goTo: function (index) {
            // console.log(timer);
            //先暂停
            // clearInterval(timer);
            this.pause();
            nextIndex = index;
            klass.removeClass(sliderItems[curIndex], "active");
            klass.addClass(sliderItems[nextIndex], "active");
            list[curIndex].className = "";
            list[nextIndex].className = "active";
            curIndex = index;
            nextIndex++;
            if (nextIndex > 2) {
                nextIndex = 0;
            }

            this.play();
        },
        next: function () {
            klass.removeClass(sliderItems[curIndex], "active");
            klass.addClass(sliderItems[nextIndex], "active");
            list[curIndex].className = "";
            list[nextIndex].className = "active";
            curIndex = nextIndex;
            nextIndex++;
            if (nextIndex > 2) {
                nextIndex = 0;;
            }
        },
        play: function () {
            timer = setInterval(function () {
                slide.next();
            }, 4000);
        },
        pause: function () {
            clearInterval(timer);
        }
    }
    
    slide.play();
    
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', function () {
            // alert(i);
            slide.goTo(i);
        }, false);
    }
    
    window.onscroll=function(){
        var height=document.body.scrollTop;
        var screenH=window.innerHeight;
        var header=query("header");
        if(height>=screenH){
            header[0].style.opacity=0;
        }else{
            header[0].style.opacity=1;
        }
    }
    
}

var klass = {
    hasClass: function (ele, cls) {
        return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(ele.className);
    },
    removeClass: function (ele, cls) {
        if (this.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    },
    addClass: function (ele, cls) {
        if (!this.hasClass(ele, cls)) {
            ele.className += " " + cls;
        }
    }
}

var query = function (selector) {
    var reg = /^(#)?(\.)?(\w+[-]?\w+)$/img;
    var regRes = reg.exec(selector);
    var res = null;
    if (regRes[1]) {
        if (regRes[3]) {
            if (typeof document.querySelector === "function") {
                res = document.querySelector(regRes[0]);
            } else {
                res = document.getElementById(regRes[3]);
            }
        }
    } else if (regRes[2]) {
        if (regRes[3]) {
            res = [];
            if (typeof document.getElementsByClassName === "function") {
                var doms = document.getElementsByClassName(regRes[3]);
                if (doms) {
                    res = Array.prototype.slice.call(doms);
                }
            } else {
                var allDoms = document.getElementsByTagName("*");
                for (var i = 0; i < allDoms.length; i++) {
                    var cName = allDoms[i].className;
                    var reg = new RegExp("\\s*" + regRes[3] + "\\s*", "g");
                    if (reg.test(cName)) {
                        res.push(allDoms[i]);
                    }
                }
            }
        }
    } else if (regRes[3]) {
        var doms = document.getElementsByTagName(regRes[3].toLowerCase());
        if (doms) {
            res = Array.prototype.slice.call(doms);
        }
    }
    return res;
}