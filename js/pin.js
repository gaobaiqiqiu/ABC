//点击返回首页
$('.back').click(function () {
    window.location.href = 'index.html';
})
for (var item in fileListPin) {
    var pinList = fileListPin[item];
    // console.log(pinList)
    for (var i = 0; i < pinList.length; i++) {
        var imgAll = $($('#template').html().replace('$urlPin$', 'http://www.dadpat.com/app/ABC/pin/' + item + '/' + pinList[i]))[0]
        $('.swiper-container .swiper-wrapper').append(imgAll)
    }
}

var imgDongTai = '';
var pg = '';
//拼图
var puzzleImg = '';
var mySwiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true,
    },
    on: {
        slideChangeTransitionStart: function () {
            pg.hasStart = 0;
            imgDongTai = $('.swiper-slide-active img').attr("src")  //动态获取图片的src，给缩略图赋值
            audioDongTai = imgDongTai.substring(0, imgDongTai.length - 4);  //动态获取图片的src，拿相对于的音频文件
            // $(function(){
            //     pg = new puzzleGame({'img': $('.swiper-slide-active img').attr("src")});      
            // });
            puzzleImg = $('.swiper-slide-active img');
            

            $(function(){
                $('#imgArea div').remove();
                pinTu(puzzleImg);     
            });
            // 右上角缩图
            $('.smallImg img').attr('src', imgDongTai)

        },
        slideChangeTransitionEnd: function () {

        }
    }
})


//=============================================================================================================================

function pinTu(puzzleImg) {
    // var puzzleImg = $('.swiper-slide-active img');
    var imgSrc = puzzleImg[0].currentSrc;
    //图片整体的宽高
    var imgWidth = parseInt(puzzleImg[0].width);
    var imgHeight = parseInt(puzzleImg[0].height);
    //3*3排列
    var num = 3;
    //每一块碎片的宽高
    var cellWidth = parseInt(imgWidth / num);
    var cellHeight = parseInt(imgHeight / num);
    var correctArr = [];  //正确的数组
    var errorArr = [];
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            //将碎片所属div的下标存入数组，用于最终校验是否排序完成
            correctArr.push(i * num + j);
            errorArr.push(i * num + j);
            cell = document.createElement("div");
            cell.className = "imgCell";
            $(cell).css({
                'width': (cellWidth - 2) + 'px',
                'height': (cellHeight - 2) + 'px',
                'left': j * cellWidth + 'px',
                'top': i * cellHeight + 'px',
                "background": "url('" + imgSrc + "')",
                'backgroundPosition': (-j) * cellWidth + 'px ' + (-i) * cellHeight + 'px',
                "backgroundSize": imgWidth + "px " + imgHeight + "px",
            });
            $(cell)[0].setAttribute('data-index', i * num + j)
            $('#imgArea').append(cell);
        }
    }
    errorArr.sort(function () {
        return Math.random() - 0.5;
    });
    var imgAll = document.querySelectorAll('#imgArea .imgCell');
    var imgBox = document.querySelector('#imgArea');
    var self = 0;
    $('#imgArea').click(function () {
        //打乱图片
        if (self == 0) {
            self = 1;
            for (var i = 0; i < errorArr.length; i++) {
                if (errorArr != correctArr) {
                    var _left = imgAll[correctArr[i]].style.left;
                    imgAll[correctArr[i]].style.left = imgAll[errorArr[i]].style.left;
                    imgAll[errorArr[i]].style.left = _left;
                    var _top = imgAll[correctArr[i]].style.top;
                    imgAll[correctArr[i]].style.top = imgAll[errorArr[i]].style.top;
                    imgAll[errorArr[i]].style.top = _top;

                    var _index = imgAll[correctArr[i]].getAttribute("data-index");
                    imgAll[correctArr[i]].setAttribute("data-index", imgAll[errorArr[i]].getAttribute("data-index"));
                    imgAll[errorArr[i]].setAttribute("data-index", _index);
                }
            }
        }
        var info = {
            x: 0, y: 0, top: 0, left: 0
        }
        $('#imgArea .imgCell').on('touchstart', function (e) {
            info.x = e.targetTouches[0].pageX;
            info.y = e.targetTouches[0].pageY;
            info.top = parseInt(this.style.top);
            info.left = parseInt(this.style.left);
            this.oriLeft = info.left;
            this.oriTop = info.top;
        })
        $('#imgArea .imgCell').on('touchmove', function (e) {
            this.style["z-index"] = 1000;
            var newTop = info.top - info.y + e.targetTouches[0].pageY;
            var newLeft = info.left - info.x + e.targetTouches[0].pageX;

            this.style.left = newLeft + "px";
            this.style.top = newTop + "px";
        })
        $('#imgArea .imgCell').on('touchend', function (e) {
            // console.log('left:', this.style.left, '--------top:', this.style.top)
            this.style.transition = " all .5s";
            // this.style["z-index"] = 0;
            //对每 个元素进行检测
            // x > 元素的.offsetLeft && x <元素的.offsetLeft+ 100
            // y > 元素的.offsetTop && x <元素的.offsetTop+ 100
            var x = e.changedTouches[0].pageX - imgBox.offsetLeft,
                y = e.changedTouches[0].pageY - imgBox.offsetTop;
            //console.info(x, y);//.targetTouches[0].pageX,e.targetTouches[0].pageY);
            //通过当前 x,y来找到应该要交换的元素是哪个？
            var obj = findSwtichBox(this, x, y);
            if (obj === this) {
                //从哪里来就回到哪里去。
                obj.style.left = obj.oriLeft + "px";
                obj.style.top = obj.oriTop + "px";
            } else {
                swtichBoxs(this, obj);
                console.log(isOk())
                setTimeout(function () {
                    if (isOk()) {//完成了
                        alert('成功')
                        $('#imgArea .imgCell').off('touchstart').off('touchmove').off('touchend');
                        self = 0;
                    }
                }, 600)
            }
        })

        function isOk() {
            // 思路：对每一个box设置一个“序号”（data-index）属性。每次交换后，都检查一下当前的元素的顺序是否与成功的序号是一致的。
            // 获取所有的元素的序号
            var str = "";
            for (var i = 0; i < imgAll.length; i++) {
                str += imgAll[i].getAttribute("data-index");
            }
            //console.info(str);
            return str == "012345678";

        }
        //交换a，b元素的位置
        function swtichBoxs(oriEle, targetEle) {
            //debugger;
            // var a = 10;
            // var b = 20;   
            var _top = oriEle.oriTop;
            //console.log(_top)          // var t = a;
            oriEle.style.top = targetEle.style.top; // a = b;
            targetEle.style.top = _top + "px";                // b = t;
            //把targetEle的top设置为oriEle的oriTop;
            var _left = oriEle.oriLeft;                // var t = a;
            oriEle.style.left = targetEle.style.left; // a = b;
            targetEle.style.left = _left + "px";                // b = t;
            //console.info(a);
            //console.info(b);
            //
            //交换data-index值
            var _index = oriEle.getAttribute("data-index");
            oriEle.setAttribute("data-index", targetEle.getAttribute("data-index"));
            targetEle.setAttribute("data-index", _index);

        }
        //根据x,y的值，看当前的x，y落在box中的哪一个元素上。
        function findSwtichBox(obj, x, y) {
            //自己不参与检查       
            for (var i = 0; i < imgAll.length; i++) {
                if (obj !== imgAll[i]) {
                    var t1 = x > imgAll[i].offsetLeft && x < (imgAll[i].offsetLeft + 100);
                    var t2 = y > imgAll[i].offsetTop && y < (imgAll[i].offsetTop + 100);
                    if (t1 && t2) {
                        //console.info(boxs[i]); 找到目标
                        return imgAll[i];
                    }
                }

            }
            return obj; //没有找到目标，即返回自己
        }
    });

}
pinTu($('.swiper-slide-active img'))





//=============================================================================================================================
