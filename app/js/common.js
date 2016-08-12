$(function(){
    var loadstr={};
    loadstr.fullload='<div class="yloading-full"><div class="yloading-circle"><s class="s1"></s><s class="s2"></s><s class="s3"></s></div></div>';
    loadstr.boxload='<div class="yloading-circle"><s class="s1"></s><s class="s2"></s><s class="s3"></s></div>';

    try{
        eval("pageConfig");
        if(pageConfig.reserveshow){
            pageConfig.reserveStr='<div class="mobbyhelp"><div class="mobbyhelp-btns"><a href="javascript:;" class="btn helpbtn" data-method="showReserve">预约试听/评估</a></div></div>';
            $("body").append(pageConfig.reserveStr);
        }
    }catch(e){}

    $("body").on("click",".btn",function(){
        var btnmess={};
        btnmess.method=$(this).data("method");
        btnmess.winw=$(window).width();
        if(btnmess.winw<768){
            btnmess.winw="80%";
        }else{
            btnmess.winw="700px";
        }
        btnmess.shiftnum=parseInt(Math.random()*6);
        //我要报名
        if(btnmess.method=="showSignUp"){
            layer.closeAll();
            layer.open({
                type: 2,
                skin: 'layui-mobby',
                title:"活动报名",
                area: [btnmess.winw, 'auto'],
                shift:btnmess.shiftnum,//随机动画
                //content:["http://google.hk",'no'],
                content:"alertsign.html",
                success: function(){

                }
            });
        }
        //预约
        if(btnmess.method=="showReserve"){
            layer.closeAll();
            layer.open({
                type: 2,
                skin: 'layui-mobby',
                title:"预约试听/评估",
                area: [btnmess.winw, 'auto'],
                shift:btnmess.shiftnum,//随机动画
                //content:["http://google.hk",'no'],
                content:"alertreserve.html",
                success: function(){

                }
            });
        }

    })
});