var listZi = {a:['Aa'],b:['Bb']}
//动态获取图片
for( var item in fileListTing ){  //fileList文件列表
    var imgList = fileListTing[item];  //图片列表
    var listP = pList[item];
    var letterList = {};
    for(var i=0;i<imgList.length;i++){
        var str = imgList[i];
        var className = str.substring(0,str.length-4);  //截取文件名获取类名
        letterList[i] = $($('#template').html().replace('$url$','http://www.dadpat.com/apk/ABC/ting/'+item+'/'+str).replace('$class$',className).replace('$content$',listP[i]));
        $('#swiper-container1 .swiper-wrapper').append(letterList[i])
    }
}
for(var item2 in fileListPin){
    var pinList = fileListPin[item2];
    for(var j=0;j<pinList.length;j++){
        $('#swiper-container2 .swiper-wrapper').append($($('#template2').html().replace('$url2$','http://www.dadpat.com/apk/ABC/pin/big/'+pinList[j])))
    }
}

//点击返回首页
$('.back').click(function(){
    window.location.href = 'index.html';
})

//点击让卡片显示、隐藏
$('.xiaLa img').click(function(oEvent){
    if(document.all){
        oEvent.cancelBubble = true;
    }else{
        oEvent.stopPropagation();
    }
    this.src = 'image/2shangla.png';
    $('.kpList').css('display','block');
    //点击卡片跳转到对应的页面
    $('.kpList .swiper-slide').click(function(oEvent){
        var to = $(this).index();
        swiper1.slideTo(to);
        oEvent = oEvent || window.event;
        if(document.all){
            oEvent.cancelBubble = true;
        }else{
            oEvent.stopPropagation();
        }
    })
});
document.onclick = function(){
    $(".xiaLa img").attr('src','image/2xiala.png'); 
    //隐藏卡片列表
    $('.kpList').css('display','none');
    
};


// 卡片
var swiper2 = new Swiper('#swiper-container2', {
    spaceBetween: 30,  //在slide之间设置距离（单位px）
    slidesPerView: 'auto',  //设置slider容器能够同时显示的slides数量(carousel模式)。
    //touchRatio: 0.2,  //触摸比例。触摸距离与slide滑动距离的比率。
    observer:true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents:true,//修改swiper的父元素时，自动初始化swiper
    on:{
        slideChangeTransitionStart:function(){

        },
        slideChangeTransitionEnd: function () {

        }
    },
    lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 10,  //设置在延迟加载图片时提前多少个slide。
    },
});
//黑板
var swiper1 = new Swiper('#swiper-container1', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
    },
    lazy: {
        loadPrevNext: true,
    },
    on:{
        slideChangeTransitionStart:function(){
            
            // 获取当前图片的transform值
            var transForm = $('#swiper-container1 .swiper-scrollbar-drag')[0].style.transform;
            // 获取当前图片的transform的X值
            var moveTransFormX = parseInt(transForm.slice(12,-13));
            //动态给星星赋值
            $('.moveXX').css('left',moveTransFormX +'px')
            $('.progress p').css('left',moveTransFormX +'px')
            //带格子的进度条的宽度
            var widthAll = $('.slide')[0].width;
            $('#swiper-container1 .swiper-pagination').css('width',(widthAll - moveTransFormX) +'px')
            // 星星上的P标签
            $('.progress p')[0].innerText = $('.swiper-slide-active p')[0].innerText;

            $(".xiaLa img").attr('src','image/2xiala.png'); 
            //隐藏卡片列表
            $('.kpList').css('display','none');

        },
        slideChangeTransitionEnd: function () {

        },
        click: function(){
            console.log(swiper1.activeIndex);
        },
    }

});