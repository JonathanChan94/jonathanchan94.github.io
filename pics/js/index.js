		var myImage = (function() {
			var imgNode = document.getElementsByTagName("img");
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
				console.log("加载成功！");
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

		proxyImage.setSrc("./images/1.jpg","./images/2.jpg","./images/3.jpg","./images/4.jpg","./images/5.jpg","./images/6.jpg","./images/7.jpg","./images/8.jpg","./images/9.jpg","./images/10.jpg");


		window.onload = function() {
			waterfall("box", "main");
			var count = 0;
			var createImage=function(){
				var oParent=document.getElementById("main");
				var oBox=document.createElement("div");
				oBox.className="box";
				oParent.appendChild(oBox);
				var oPic=document.createElement("div");
				oPic.className="pic";
				oBox.appendChild(oPic);
				var oImg=document.createElement("img");
				oPic.appendChild(oImg);
				var img=new Image;
				img.onload=function(){
					console.log(oImg.src);
					oImg.src=img.src;
					console.log(oImg.src);
				}
				return function(src){
					oImg.src="./images/0.jpg";
					img.src=src;
				}
			};
			window.onscroll = function() {
				if (checkSlide() && count < 5) {
					createImage()("./images/11.jpg");
					createImage()("./images/12.jpg");
					createImage()("./images/13.jpg");
					createImage()("./images/14.jpg");
					createImage()("./images/15.jpg");
					count++;
					waterfall("box", "main");
					clickShow();
				}
				waterfall("box","main");
			}
			window.onresize = function() {
				waterfall("box", "main");
			}

			clickShow();

		}

		function waterfall(clsName, parent) {
			// countall++;
			// console.log(countall);
			var oElement = findElement(clsName, parent);
			var windowH = document.documentElement.clientWidth;
			var oEleW = oElement[0].offsetWidth;
			var cols = Math.floor(windowH / oEleW);

			var oParent = document.getElementById(parent);
			oParent.style.width = oEleW * cols + 'px';
			var arrH = [];
			for (var i = 0; i < oElement.length; i++) {
				oElement[i].style.display="block";
				if (i < cols) {
					oElement[i].style = ""; //清空第一排图片的样式
					arrH.push(oElement[i].offsetHeight);
				} else {
					var minH = Math.min.apply(null, arrH);
					var index = getIndex(minH, arrH);
					oElement[i].style.position = "absolute";
					oElement[i].style.left = oElement[index].offsetLeft + 'px';
					oElement[i].style.top = oElement[index].offsetTop + minH + 'px';
					arrH[index] = oElement[i].offsetHeight + oElement[i].offsetTop;
					// console.log(oElement[i].offsetHeight);
				}
			}
			var maxH = Math.max.apply(null, arrH);
			document.getElementById("main").style.height = maxH + 10 + "px"; //设置main的高度便于确定foot的位置
			document.getElementById("foot").style.display = "block";
		}

		function findElement(clsName, parent) {
			var oParent = document.getElementById(parent) || document;
			var oElement = oParent.getElementsByTagName("*");

			var element = [];
			for (var i = 0; i < oElement.length; i++) {
				if (oElement[i].className == clsName) {
					element.push(oElement[i]);
				}
			}
			return element;
		}

		function getIndex(value, arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == value) {
					return i;
				}
			}
		}

		function checkSlide() {
			var oElement = findElement("box", "main");
			var top = document.getElementById('top');
			var scrolltop = document.body.scrollTop || document.documentElement.scrollTop;
			var height = document.documentElement.clientHeight;
			var slideH = scrolltop + height;
			var checkH = Math.floor(top.offsetHeight + oElement[oElement.length - 1].offsetTop + oElement[oElement.length - 1].offsetHeight / 2);
			if (slideH > checkH) {
				return true;
			} else {
				return false;
			}
		}

		function clickShow() {
			var oImgEle = document.getElementsByTagName("img");
			for (var i = 0; i < oImgEle.length; i++) {
				var src = null;
				oImgEle[i].onclick = (function(i) {
					return function() {
						src = oImgEle[i].src;
						var mask = document.createElement("div");
						mask.id = "mask";
						document.body.appendChild(mask);
						mask.style.width = document.documentElement.scrollWidth + 'px';
						mask.style.height = document.documentElement.scrollHeight + 'px';
						var showpic = document.createElement("div");
						showpic.id = "showpic";
						var oImg = document.createElement("img");
						oImg.src = "./images/" + src.substring(src.lastIndexOf("/") + 1);
						showpic.appendChild(oImg);
						var a = document.createElement("a");
						a.href = "javascript:;";
						a.id = "close";
						a.innerHTML = "&#10006;";
						showpic.appendChild(a);
						document.body.appendChild(showpic);
						var imgH = oImg.offsetHeight;
						console.log(imgH);
						var clientH = document.documentElement.clientHeight;
						if (imgH > clientH) {
							oImg.style.height = clientH - 100 + 'px';
							oImg.style.width = "auto";
							showpic.style.width = oImg.offsetWidth + 'px';
							showpic.style.top = "50px";
							showpic.style.marginLeft = -(oImg.offsetWidth / 2) + 'px';
						} else {
							showpic.style.top = (clientH - imgH) / 2 + 'px';
						}

						a.onclick = function() {
							document.body.removeChild(mask);
							document.body.removeChild(showpic);
						}
					}
				})(i);
			}
		}