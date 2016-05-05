		window.onload = function() {
			waterfall("box", "main");
			var dataInt = {
				"data": [{
					"src": "11.jpg"
				}, {
					"src": "12.jpg"
				}, {
					"src": "13.jpg"
				}, {
					"src": "14.jpg"
				}, {
					"src": "15.jpg"
				}]
			};
			var count=0;
			window.onscroll = function() {
				if (checkSlide()&&count<5) {
					var oParent = document.getElementById("main");
					for (var i = 0; i < dataInt.data.length; i++) {
						var oBox = document.createElement("div");
						oBox.className = "box";
						oParent.appendChild(oBox);
						var oPic = document.createElement("div");
						oPic.className = "pic";
						oBox.appendChild(oPic);
						var oImg = document.createElement("img");
						oImg.src = "./images/" + dataInt.data[i].src;
						oPic.appendChild(oImg);
					}
					waterfall("box", "main");
					clickShow();
					count++;
				}
			}
			window.onresize = function() {
				waterfall("box", "main");
			}

			clickShow();

		}

		function waterfall(clsName, parent) {
			var oElement = findElement(clsName, parent);
			var windowH = document.documentElement.clientWidth;
			var oEleW = oElement[0].offsetWidth;
			var cols = Math.floor(windowH / oEleW);

			var oParent = document.getElementById(parent);
			oParent.style.width = oEleW * cols + 'px';
			var arrH = [];
			for (var i = 0; i < oElement.length; i++) {
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
				}
			}
			var maxH=Math.max.apply(null,arrH);
			document.getElementById("main").style.height=maxH+10+"px";//设置main的高度便于确定foot的位置
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
						var imgH=oImg.offsetHeight;
						console.log(imgH);
						var clientH=document.documentElement.clientHeight;
						if(imgH>clientH){
							oImg.style.height=clientH-100+'px';
							oImg.style.width="auto";
							showpic.style.width=oImg.offsetWidth+'px';
							showpic.style.top="50px";
							showpic.style.marginLeft=-(oImg.offsetWidth/2)+'px';
						}else{
							showpic.style.top=(clientH-imgH)/2+'px';
						}

						a.onclick = function() {
							document.body.removeChild(mask);
							document.body.removeChild(showpic);
						}
					}
				})(i);
			}
		}