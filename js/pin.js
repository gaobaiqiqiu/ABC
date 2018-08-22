//点击返回首页
$('.back').click(function(){
    window.location.href = 'index.html';
})
for(var item in fileListPin){
    var pinList = fileListPin[item];
    // console.log(pinList)
    for(var i=0;i<pinList.length;i++){
        var imgAll =$($('#template').html().replace('$urlPin$','http://www.dadpat.com/apk/ABC/pin/'+item+'/'+pinList[i]))[0]
        $('.swiper-container .swiper-wrapper').append(imgAll)
    }
}

var imgDongTai = '';
var pg = '';
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
    on:{
        slideChangeTransitionStart:function () { 
            pg.hasStart = 0;
            imgDongTai=$('.swiper-slide-active img').attr("src")  //动态获取图片的src，给缩略图赋值
            audioDongTai = imgDongTai.substring(0,imgDongTai.length-4);  //动态获取图片的src，拿相对于的音频文件
            $(function(){
                pg = new puzzleGame({'img': $('.swiper-slide-active img').attr("src")});      
            });
            $('.smallImg img').attr('src',imgDongTai)
            
        },
        slideChangeTransitionEnd: function () {
        }
    }
})


//=============================================================================================================================

 /*重要备注：
        imgOrigArr 和 imgRanfArr这两个数组分别存放正确顺序排列和乱序排列的碎片信息
        数组结构：arr[碎片节点下标] = 碎片显示位置
         */
        /**
         * [puzzleGame 向puzzleGame对象中添加属性]
         * @param  {[json格式]} param [图片 路径+名称]
         * @return       [无]
         */
    var puzzleGame = function(param){
        /************* 参数处理 ******************/
        this.img = param.img || '';//待操作的图片
        /************* 节点 ******************/
        this.btnStart = $('#imgArea');//开始游戏按钮
        this.imgArea = $('#imgArea');//图片显示区域

        this.imgCells = '';//用于记录碎片节点的变量

        /************* 变量 ******************/
        this.imgOrigArr = [];//图片拆分后，存储正确排序的数组
        this.imgRandArr = [];//图片打乱顺序后，存储当前排序的数组

        this.levelArr = [[3,3],[4,4],[6,6]];//存储难度等级的数组
        this.levelNow = 0;//表示当前难度等级的变量，与难度数组结合使用

        //图片整体的宽高
        this.imgWidth = parseInt(this.imgArea.css('width'));
        this.imgHeight = parseInt(this.imgArea.css('height'));
        //拆分为碎片后，每一块碎片的宽高
        this.cellWidth = this.imgWidth/this.levelArr[this.levelNow][1];
        this.cellHeight = this.imgHeight/this.levelArr[this.levelNow][0];

        this.hasStart = 0;//记录有是否开始的变量，默认fasle，未开始
        this.moveTime = 400;//记录animate动画的运动时间，默认400毫秒

        //调用初始化函数，拆分图片,绑定按钮功能
        this.init();
    };
        /**
         * [prototype 在puzzleGame对象中添加方法，用json格式表示]
         * @type {Object}
         */
    puzzleGame.prototype = {
        /**
         * [init 初始化特效设置]
         * @return [无]
         */
        init:function(){
            this.imgSplit();
            this.gameState();
        },
        /**
         * [imgSplit 将图片拆分为碎片]
         * @param  obj    [图片,路径+名称]
         * @param  cellW  [碎片宽度]
         * @param  cellH  [碎片高度]
         * @return        [记录正确排序的数组]
         */
        imgSplit:function(){
            this.imgOrigArr = [];//清空正确排序的数组
            //必须清空图片区域的碎片代码，否则每一次拆分图片是与之前拆分的累积
            //例如第一次拆分3x3,插入了9个div，但没有清空，第二次拆分4x4，此时是在前9个div之后再插入14个div，共9+16个div
            this.imgArea.html("");
            var cell = '';//记录单个图片碎片的变量
            for(var i=0;i<this.levelArr[this.levelNow][0];i++){
                for(var j=0;j<this.levelArr[this.levelNow][1];j++){
                    //将碎片所属div的下标存入数组，用于最终校验是否排序完成
                    this.imgOrigArr.push(i*this.levelArr[this.levelNow][1]+j);
                    cell = document.createElement("div");
                    cell.className = "imgCell";
                    $(cell).css({
                        'width':(this.cellWidth - 2) + 'px',
                        'height':(this.cellHeight - 2) + 'px',
                        'left':j * this.cellWidth + 'px',
                        'top':i * this.cellHeight + 'px',
                        "background":"url('"+this.img+"')",
                        'backgroundPosition':(-j)*this.cellWidth + 'px ' + (-i)*this.cellHeight + 'px',
                        "backgroundSize": this.imgWidth + "px " + this.imgHeight +  "px"
                    });
                    this.imgArea.append(cell);
                }
            }
            this.imgCells = $('#imgArea div.imgCell');//碎片节点
        },
        /**
         * [gameStart 开始/回复 游戏的函数]
         * @return [无]
         */
        gameState:function(){
            var self = this;
            this.btnStart.bind('click',function(){  
                if(self.hasStart == 0){//不在游戏中
                    //开始游戏后部分值、样式设置
                    self.hasStart = 1;
                    //打乱图片
                    self.randomArr();
                    self.cellOrder(self.imgRandArr);
                    //图片事件
                    self.imgCells.on('touchstart',function(e){
                        /*此处是图片移动*/
                        //所选图片碎片的下标以及鼠标相对该碎片的位置
                        var cellIndex_1 = $(this).index();
                        var cell_mouse_x = e['originalEvent']['changedTouches'][0].pageX - self.imgCells.eq(cellIndex_1).offset().left;
                        var cell_mouse_y = e['originalEvent']['changedTouches'][0].pageY - self.imgCells.eq(cellIndex_1).offset().top;

                        $(document).on('touchmove',function(e2){
                            self.imgCells.eq(cellIndex_1).css({
                                'z-index':'40',
                                'left':(e2['originalEvent']['changedTouches'][0].pageX - cell_mouse_x - self.imgArea.offset().left) + 'px',
                                'top':(e2['originalEvent']['changedTouches'][0].pageY - cell_mouse_y - self.imgArea.offset().top) + 'px'
                            });
                        }).on('touchend',function(e3){
                            //被交换的碎片下标
                            var cellIndex_2 = self.cellChangeIndex((e3['originalEvent']['changedTouches'][0].pageX-self.imgArea.offset().left),(e3['originalEvent']['changedTouches'][0].pageY-self.imgArea.offset().top),cellIndex_1);
                            //碎片交换
                            if(cellIndex_1 == cellIndex_2){
                                self.cellReturn(cellIndex_1);
                            }else{
                                self.cellExchange(cellIndex_1,cellIndex_2);
                            }
                            //移除绑定
                            $(document).off('touchmove').off('touchend');
                        });
                    })
                }
            });
        },

        /**
         * [randomArr 生成不重复的随机数组的函数]
         * @return [无]
         */
        randomArr:function(){
            //清空数组
            this.imgRandArr = [];
            var order;//记录随机数，记录图片放置在什么位置
            for(var i=0,len=this.imgOrigArr.length;i<len;i++){
                order = Math.floor(Math.random()*len);
                if(this.imgRandArr.length > 0){
                    while(jQuery.inArray(order,this.imgRandArr) > -1){
                        order = Math.floor(Math.random()*len);
                    }
                }
                this.imgRandArr.push(order);
            }
            return;
        },
        /**
         * [cellOrder 根据数组给图片排序的函数]
         * @param  arr [用于排序的数组，可以是正序或乱序]
         * @return     [无]
         */
        cellOrder:function(arr){
            for(var i=0,len=arr.length;i<len;i++){
                this.imgCells.eq(i).animate({
                    'left': arr[i]%this.levelArr[this.levelNow][1]*this.cellWidth + 'px',
                    'top': Math.floor(arr[i]/this.levelArr[this.levelNow][0])*this.cellHeight + 'px'
                },this.moveTime);
            }
        },

        /**
         * [cellChangeIndex 通过坐标，计算被交换的碎片下标]
         * @param  x    [鼠标x坐标]
         * @param  y    [鼠标y坐标]
         * @param  orig [被拖动的碎片下标，防止不符合碎片交换条件时，原碎片返回]
         * @return      [被交换节点在节点列表中的下标]
         */
        cellChangeIndex:function(x,y,orig){
            //鼠标拖动碎片移至大图片外
            if(x<0 || x>this.imgWidth || y<0 || y>this.imgHeight){
                return orig;
            }
            //鼠标拖动碎片在大图范围内移动
            var row = Math.floor(y/this.cellHeight),col = Math.floor(x/this.cellWidth),location=row*this.levelArr[this.levelNow][1]+col;
            var i=0,len=this.imgRandArr.length;
            while((i<len) && (this.imgRandArr[i] != location)){
                i++;
            }
            return i;
        },
        /**
         * [cellExchange 两块图片碎片进行交换]
         * @param  from [被拖动的碎片]
         * @param  to   [被交换的碎片]
         * @return      [交换结果，成功为true,失败为false]
         */
        cellExchange:function(from,to){
            var self = this;
            //被拖动图片、被交换图片所在行、列
            var rowFrom = Math.floor(this.imgRandArr[from]/this.levelArr[this.levelNow][1]);
            var colFrom = this.imgRandArr[from]%this.levelArr[this.levelNow][1];
            var rowTo = Math.floor(this.imgRandArr[to]/this.levelArr[this.levelNow][1]);
            var colTo = this.imgRandArr[to]%this.levelArr[this.levelNow][1];

            var temp = this.imgRandArr[from];//被拖动图片下标，临时存储

            //被拖动图片变换位置
            this.imgCells.eq(from).animate({
                'top':rowTo*this.cellHeight + 'px',
                'left':colTo*this.cellWidth + 'px'
            },this.moveTime,function(){
                $(this).css('z-index','10');
            });
            //表交换图片变换位置
            this.imgCells.eq(to).css('z-index','30').animate({
                'top':rowFrom*this.cellHeight + 'px',
                'left':colFrom*this.cellWidth + 'px'
            },this.moveTime,function(){
                $(this).css('z-index','10');

                //两块图片交换存储数据
                self.imgRandArr[from] = self.imgRandArr[to];
                self.imgRandArr[to] = temp;

                //判断是否完成全部移动，可以结束游戏
                if(self.checkPass(self.imgOrigArr,self.imgRandArr)){
                    self.success();
                }
            });
        },

        /**
         * [cellReturn 被拖动图片返回原位置的函数]
         * @param  index [被拖动图片的下标]
         * @return       [无]
         */
        cellReturn:function(index){
            var row = Math.floor(this.imgRandArr[index]/this.levelArr[this.levelNow][1]);
            var col = this.imgRandArr[index]%this.levelArr[this.levelNow][1];

            this.imgCells.eq(index).animate({
                'top':row*this.cellHeight + 'px',
                'left':col*this.cellWidth + 'px'
            },this.moveTime,function(){
                $(this).css('z-index','10');
            });
        },
        /**
         * [checkPass 判断游戏是否成功的函数]
         * @param  rightArr  [正确排序的数组]
         * @param  puzzleArr [拼图移动的数组]
         * @return           [是否完成游戏的标记，是返回true，否返回false]
         */
        checkPass:function(rightArr,puzzleArr){
            if(rightArr.toString() == puzzleArr.toString()){
                return true;
            }
            return false;
        },

        /**
         * [success 成功完成游戏后的处理函数]
         * @return [description]
         */
        success:function(){
            //取消样式和事件绑定
            for(var i=0,len=this.imgOrigArr.length;i<len;i++){
                if(this.imgCells.eq(i).has('touchstart')){
                    this.imgCells.eq(i).removeClass('touchstart');
                }
            }
            this.imgCells.off('touchstart').off('touchmove').off('touchend');
            this.hasStart = 0;
            console.log($(this))
            alert('恭喜您，成功完成本次游戏！');
            
        }
    };
    /* 加入图片，运行代码 */
    $(function(){
        pg = new puzzleGame({'img': $('.swiper-slide-active img').attr("src")});     
        var smallHeight = $('#imgArea .imgCell')[0].style.height; 
        var smallWidth = $('#imgArea .imgCell')[0].style.width;   
        $('.smallImg').css({
            'height':smallHeight,
            'width':smallWidth
        })
    });
         
//=============================================================================================================================
