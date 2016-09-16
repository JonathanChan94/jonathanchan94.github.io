(function() {
	var isReady = false,
		contentLoadedHandler;

	function ready() {
		if (!isReady) {
			domReady();
			isReady = true;
		}
	}

	if (document.readyState === "complete") {
		ready();
	}
	if (document.addEventListener) {
		contentLoadedHandler = function() {
			document.removeEventListener("DOMContentLoaded", contentLoadedHandler, false);
			ready();
		}
		document.addEventListener("DOMContentLoaded", contentLoadedHandler, false);
	} else if (document.attachEvent) {
		contentLoadedHandler = function() {
			if (document.readyState === "complete") {
				document.detachEvent("onreadystatechange", contentLoadedHandler);
				ready();
			}
		}
		document.attachEvent("onreadystatechange", contentLoadedHandler);
		var toplevel = false;
		try {
			toplevel = window.frameElement == null;
		} catch (e) {

		}
		if (document.documentElement.doScroll && toplevel) {
			doScrollCheck();
		}
	}

	function doScrollCheck() {
		if (isReady) return;
		try {
			document.documentElement.doScroll("left");
		} catch (e) {
			setTimeout(doScrollCheck, 16);
			return;
		}
		ready();
	}
})()

var query = function(selector) {
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

var domReady = function() {
	var myImage = (function() {
		var imgNode = query("img");
		return {
			setSrc: function(src) {
				//将传入的参数转为数组，便于处理
				var arg = [].slice.call(arguments);
				for (var i = 0; i < imgNode.length; i++) {
					if (arg.length == 1) { //如果只有一个实参，判断该参数是否为数组
						//如果该参数为数组，则将数组内每一个src赋给对应的img
						if (Object.prototype.toString.call(arg[0]) == "[object Array]") {
							imgNode[i].src = arg[0][i];
						}
						//如果不是数组，则直接将该参数赋给每一个img
						else {
							imgNode[i].src = arg[0];
						}
					} else {
						imgNode[i].src = arg[i];
					}
				}
			}
		}
	})();

	var proxyImage = (function() {
		var img = new Image;
		var source = []; //保存每一个需要加载的图片
		img.onload = function() {
			// console.log("加载成功！");
			myImage.setSrc(source); //将数组传递给myImage
		}
		return {
			setSrc: function(src) {
				myImage.setSrc("./images/0.jpg");
				for (var i = 0; i < arguments.length; i++) {
					img.src = arguments[i];
					source.push(arguments[i]);
				}
			}
		}
	})();

	proxyImage.setSrc("./images/1.jpg", "./images/2.jpg", "./images/3.jpg", "./images/4.jpg", "./images/5.jpg", "./images/6.jpg", "./images/7.jpg", "./images/8.jpg", "./images/9.jpg", "./images/10.jpg");


	var boxs = query(".box");
	check();

	function check() {
		// console.log(boxs[0].offsetHeight);
		if (boxs[0].offsetHeight > 62) {
			waterfall(".box", "#main");
		} else {
			setTimeout(check, 16);
		}
	}

	var createImg = function() {
		var oParent = query("#main");
		var oBox = document.createElement("div");
		oBox.className = "box";
		oParent.appendChild(oBox);
		var oPic = document.createElement("div");
		oPic.className = "pic";
		oBox.appendChild(oPic);
		var oImg = document.createElement("img");
		oPic.appendChild(oImg);
		var img = new Image();
		img.onload = function() {
			oImg.src = img.src;
		}
		return function(src) {
			oImg.src = "./images/0.jpg";
			img.src = src;
		}
	}

	var count = 0;
	window.onscroll = function() {
		if (checkSlide() && count < 5) {
			createImg()("./images/11.jpg");
			createImg()("./images/12.jpg");
			createImg()("./images/13.jpg");
			createImg()("./images/14.jpg");
			createImg()("./images/15.jpg");
			count++;
			clickShow();
			// waterfall(".box","#main");
		}
		waterfall(".box", "#main");
	}

	window.onresize = function() {
		waterfall(".box", "#main");
	}

	clickShow();


	function waterfall(clsName, parent) {
		var oParent = query(parent) || document;
		var oEle = query(clsName);
		var winWidth = document.documentElement.clientWidth;
		var oEleWidth = oEle[0].offsetWidth;
		var cols = Math.floor(winWidth / oEleWidth);

		oParent.style.width = oEleWidth * cols + 20 + "px";

		var arrH = [];
		for (let i = 0; i < oEle.length; i++) {
			if (i < cols) {
				oEle[i].style = "";
				arrH.push(oEle[i].offsetHeight);
			} else {
				var minH = Math.min.apply(null, arrH);
				var index = getIndex(minH, arrH);
				oEle[i].style.position = "absolute";
				oEle[i].style.left = oEle[index].offsetLeft + "px";
				oEle[i].style.top = oEle[index].offsetTop + minH + "px";
				arrH[index] = oEle[i].offsetHeight + oEle[i].offsetTop;
			}
		}
		var maxH = Math.max.apply(null, arrH);
		oParent.style.height = maxH + 10 + "px";
		query("#foot").style.display = "block";
	}

	function getIndex(value, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == value) {
				return i;
			}
		}
	}

	function checkSlide() {
		var oEle = query(".box");
		var head = query("#top");
		var winHeight = document.documentElement.clientHeight;
		var scroll = document.body.scrollTop > 0 ? document.body.scrollTop : document.documentElement.scrollTop;
		var slideH = scroll + winHeight;
		var len = oEle.length;
		var curH = Math.floor(head.offsetHeight + oEle[len - 1].offsetTop + oEle[len - 1].offsetHeight / 2);
		// console.log(curH,slideH);

		if (slideH > curH) {
			return true;
		} else {
			return false;
		}
	}

	function clickShow() {
		var oImgEle = query("img");
		for (let i = 0; i < oImgEle.length; i++) {
			var src = null;
			oImgEle[i].onclick = function() {
				src = oImgEle[i].src;
				var mask = document.createElement("div");
				mask.id = "mask";
				document.body.appendChild(mask);
				mask.style.width = document.documentElement.scrollWidth + "px";
				mask.style.height = document.documentElement.scrollHeight + "px";
				var showPic = document.createElement("div");
				showPic.id = "showpic";
				var oImg = document.createElement("img");
				oImg.src = './images/' + src.substring(src.lastIndexOf("/") + 1);
				showPic.appendChild(oImg);
				var close = document.createElement("a");
				close.id = "close";
				close.href = "javascript:void(0);"
				close.innerHTML = "&#10006;";
				showPic.appendChild(close);
				document.body.appendChild(showPic);

				var imgH = oImg.offsetHeight;
				var winH = document.documentElement.clientHeight;
				if (imgH > winH) {
					oImg.style.height = winH - 100 + "px";
					oImg.style.width = "auto";
					showPic.style.width = oImg.offsetWidth + "px";
					showPic.style.top = 50 + "px";
					showPic.style.marginLeft = -(oImg.offsetWidth / 2) + "px";
				} else {
					showPic.style.top = (winH - imgH) / 2 + "px";
				}

				close.onclick = function() {
					document.body.removeChild(mask);
					document.body.removeChild(showPic);
				}
			}
		}
	}
}