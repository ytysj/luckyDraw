//(测试)抽奖人员名单
var allPerson = [];
var all_person_num = 0; //总员工人数
var loaded_person_file = null;  //加载的员工名单文件


var timer;//定时器
var cfg_page_visible = false;//配置页面是否显示

var cur_gift_idx = 0;//当前在抽第几个奖
var fourth_gift_num = 0;//四等奖数量
var third_gift_num = 0;//三等奖数量
var second_gift_num = 0;//二等奖数量
var first_gift_num = 0;//一等奖数量
var fourth_once_num = 1;//四等奖每轮抽取的次数
var third_once_num = 1;//三等奖每轮抽取的次数
var second_once_num = 1;//二等奖每轮抽取的次数
var first_once_num = 1;//一等奖每轮抽取的次数


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fileInput').addEventListener('change', handleFile);
});

$(function () {
    iconAnimation();
    //开始抽奖

    $("#btnStart").on("click", function () {
        if(all_person_num===0){
            showDialog("请先在配置页添加人员名单！");
            return null;
        }
        if ((allPerson.length === 0)||(cur_gift_idx+1>(fourth_gift_num+third_gift_num+second_gift_num+first_gift_num))){
            showDialog("抽奖次数已用尽！请重新修改配置！");
            return null;
        }

        //判断是开始还是结束
        if ($("#btnStart").text() === "开始") {
            //显示动画框
            $("#rollingName").show();
            move();
            $("#btnStart").text("停止");
            $("#bgLuckyDrawEnd").removeClass("bg");
        }
        else {
            //确定奖品类型            
            var display_id = "gift4";
            var cur_get_num = 1; //当前抽选次数
            var hint_msg = "";
            
            console.log("正在抽取cur_gift_idx：", cur_gift_idx, fourth_gift_num+third_gift_num+second_gift_num, 
                        third_gift_num+second_gift_num+first_gift_num);
            if(cur_gift_idx<fourth_gift_num){
                cur_get_num = fourth_once_num;
                display_id = "gift4";
                hint_msg = "已抽选四等奖("+(cur_gift_idx+cur_get_num)+"/"+fourth_gift_num+")";

                document.getElementById("giftTitle4").className="giftTitle"; //把奖品标题的class，从hide设置为giftTitle
            }
            else if(cur_gift_idx<fourth_gift_num+third_gift_num){
                cur_get_num = third_once_num;
                display_id = "gift3";
                hint_msg = "已抽选三等奖("+(cur_gift_idx+cur_get_num-fourth_gift_num)+"/"+third_gift_num+")";

                document.getElementById("giftTitle3").className="giftTitle"; //把奖品标题的class，从hide设置为giftTitle
                document.getElementById("giftTitle4").className="hide";//隐藏四等奖
                hide_all_element("gift4");
            }
            else if(cur_gift_idx<fourth_gift_num+third_gift_num+second_gift_num){
                cur_get_num = second_once_num;
                display_id = "gift2";
                hint_msg = "已抽选二等奖("+(cur_gift_idx+cur_get_num-fourth_gift_num-third_gift_num)+"/"+second_gift_num+")";

                document.getElementById("giftTitle2").className="giftTitle"; //把奖品标题的class，从hide设置为giftTitle
                document.getElementById("giftTitle4").className="hide";//隐藏四等奖和三等奖
                hide_all_element("gift4");
                document.getElementById("giftTitle3").className="hide"; //隐藏四等奖和三等奖
                hide_all_element("gift3");
            }
            else if(cur_gift_idx<fourth_gift_num+third_gift_num+second_gift_num+first_gift_num){
                cur_get_num = first_once_num;
                display_id = "gift1";
                hint_msg = "已抽选一等奖("+(cur_gift_idx+cur_get_num-fourth_gift_num-third_gift_num-second_gift_num)+"/"+first_gift_num+")";

                document.getElementById("giftTitle1").className="giftTitle"; //把奖品标题的class，从hide设置为giftTitle
                document.getElementById("giftTitle4").className="hide";//隐藏四等奖和三等奖
                hide_all_element("gift4");
                document.getElementById("giftTitle3").className="hide"; //隐藏四等奖和三等奖
                hide_all_element("gift3");
            }
            else{
                console.log("WARNING!cur_gift_idx out of range",cur_get_num, cur_gift_idx, fourth_gift_num, third_gift_num, second_gift_num, first_gift_num);
                return null;
            }
            console.log("当前抽选次数:", cur_get_num);
            $("#HintMessage").val(hint_msg);

            //设置样式
            $("#btnStart").text("开始");//设置按钮文本为开始
            clearInterval(timer);//停止输入框动画展示
            $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉

            //抽选人员
            for(var i=0;i<cur_get_num;i++){
                var selectedPerson = getRandomPerson();
                var num = getPersonNum(selectedPerson);
                var name = getPersonName(selectedPerson);
                var group = getPersonGroup(selectedPerson);
                var suffix = group+num;
                console.log("抽选人员 工号:", num, "姓名:", name, "部门:", group);

                //在跳动页面显示人名
                $("#showName").val(name);

                //添加到入选名单
                var element=document.getElementById(display_id);
                var newBox=document.createElement("span");
                newBox.className = "luckyBox";

                var newEle=document.createElement("div");
                newEle.innerHTML=name;//添加名字
                newEle.className = "luckyName";
                newBox.appendChild(newEle);

                var newEle=document.createElement("div");
                newEle.className = "luckySuffix";
                newEle.innerHTML=suffix;//添加后缀
                newBox.appendChild(newEle);

                element.appendChild(newBox);
            }

            console.log("==============="+hint_msg+"===============");//打印抽选数量和奖品次数
            cur_gift_idx += cur_get_num;
        }
    });

    $("#btnCfg").on("click", function () {
        if(cfg_page_visible==false){
            $("#cfgPage").fadeIn();
            cfg_page_visible = true;
            $("#btnCfg").text("应用");
        }
        else{
            showConfirm("确认应用配置参数吗？会导致重置！", function () {
                //加载人员名单
                if(loaded_person_file==null){
                    showDialog("尚未加载人员名单！");
                    return false;
                }
                allPerson = JSON.parse(JSON.stringify(loaded_person_file));
                loaded_person_file = null;  //清除加载的文件
                
                //初始化参数
                cur_gift_idx = 0;   //当前在抽第几个奖                
                all_person_num = allPerson.length;  //获取员工总人数
                fourth_gift_num = Number($("#numInput4").val()); //获取奖品数量
                third_gift_num = Number($("#numInput3").val());
                second_gift_num = Number($("#numInput2").val());
                first_gift_num = Number($("#numInput1").val());
                fourth_once_num = Number($("#onceNumInput4").val()); //获取奖品单次抽奖数量
                third_once_num = Number($("#onceNumInput3").val());
                second_once_num = Number($("#onceNumInput2").val());
                first_once_num = Number($("#onceNumInput1").val());
                console.log("礼物数量:",fourth_gift_num, third_gift_num, second_gift_num, first_gift_num);
                console.log("单次抽奖数量:",fourth_once_num, third_once_num, second_once_num, first_once_num);

                //重置页面
                $("#rollingName").fadeOut();
                document.getElementById("giftTitle4").className="hide";//把奖品标题的class，设置为hide
                document.getElementById("giftTitle3").className="hide";//把奖品标题的class，设置为hide
                document.getElementById("giftTitle2").className="hide";
                document.getElementById("giftTitle1").className="hide";
                document.getElementById('fileInput').value = '';
                $("#HintMessage").val("");//去除提示

                //删除所有抽奖人名
                elements = document.querySelectorAll(".luckyBox");// 获取所有指定类名为"luckyBox"的元素
                for (var i = 0; i < elements.length; i++) { // 遍历每个元素并移除它们
                    var element = elements[i];
                    element.parentNode.removeChild(element); // 或者直接使用 remove() 方法
                }

                $("#cfgPage").fadeOut();
                cfg_page_visible = false;
                $("#btnCfg").text("配置");
                console.log("===============已应用配置===============");
            });

        }
    });
});


function hide_all_element(element_name){
    // 获取需要隐藏的父元素
    var parentElement = document.getElementById(element_name); // element_name为相应的父元素ID
    
    // 遍历并隐藏子元素
    for (let i = 0; i < parentElement.children.length; i++) {
        var childElement = parentElement.children[i];
        childElement.style.display = "none";
    }
    parentElement.style.display = "none";
}

//获取excel数据
function handleFile(event) {
    console.log("选择文件")
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });

            // 选择第一个工作表
            var sheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[sheetName];

            // 将工作表的数据转换成JSON对象
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
            loaded_person_file = JSON.parse(JSON.stringify(jsonData));
            console.log("已加载名单数据:", loaded_person_file);
            file="";

            // 打印JSON对象
            //console.log(jsonData);
        };

        reader.readAsBinaryString(file);
    }
}

//抽选一人
function getRandomPerson() {
    //****************************************此处为随机数产生逻辑 *//
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    var randomIndex = array[0]%(allPerson.length);
    var selectedPerson = allPerson[randomIndex];

    // 从数组中移除已抽取的人员
    allPerson.splice(randomIndex, 1);
    console.log("随机数randomIndex:", randomIndex);
    console.log("抽选到的人员信息:", selectedPerson);

    return selectedPerson;
}

//获取工号
function getPersonNum(person){
    return person["工号"]
}

//获取姓名
function getPersonName(person){
    return person["姓名"]
}

//获取部门
function getPersonGroup(person){
    return person["部门"]
}

//参考这篇文章：http://www.html-js.com/article/JS-rookie-rookie-learned-to-fly-in-a-moving-frame-beating-figures
//跳动的名字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, allPerson.length-1);
        var name = getPersonName(allPerson[i]);
        $showName.val(name);//输入框赋值
    }, interTime);
}

//顶上的小图标+按钮，随机动画
function iconAnimation() {
    var interTime1 = 200;//设置间隔时间
    var $icon1 = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon1.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon1[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime1);

    var interTime2 = 800;//设置间隔时间
    var $icon2 = $("#btnRoll");
    var arrAnimatoin = ["shake", "swing", "wobble"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon2.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon2[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime2);

}
