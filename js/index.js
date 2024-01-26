//(测试)抽奖人员名单
var allPerson = [{ "工号": "001", "姓名": "林一", "部门": "洗菜部" }, { "工号": "002", "姓名": "卫二", "部门": "洗菜部" },
{ "工号": "003", "姓名": "周三", "部门": "切菜部" }, { "工号": "004", "姓名": "吴四", "部门": "切菜部" },
{ "工号": "005", "姓名": "赖五", "部门": "切菜部" }, { "工号": "006", "姓名": "韩六", "部门": "端盘部" },
{ "工号": "007", "姓名": "董七", "部门": "端盘部" }, { "工号": "008", "姓名": "陈八", "部门": "端盘部" }];
var all_person_num = 0; //总员工人数

//(待删除)领导人员名单
var leaderArr = ["张三"];
//(待删除)未中奖人员名单
var remainPerson = JSON.parse(JSON.stringify(allPerson));

//(待删除)中奖人员名单
var luckyMan = [];

var times = 1;//(待删除)抽奖次数,如果不是第一次，不加粗显示领导姓名

var timer;//定时器
var cfg_page_visible = false;//配置页面是否显示

var cur_gift_idx = 0;//当前在抽第几个奖
var third_gift_num = 0;//三等奖数量
var second_gift_num = 0;//二等奖数量
var first_gift_num = 0;//一等奖数量


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
        if ((allPerson.length === 0)||(cur_gift_idx+1>(third_gift_num+second_gift_num+first_gift_num))){
            showDialog("抽奖次数已用尽！请重置或修改配置！");
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
            $("#btnStart").text("开始");//设置按钮文本为开始
            clearInterval(timer);//停止输入框动画展示
            $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉

            //抽选人员
            var selectedPerson = getRandomPerson();
            cur_gift_idx += 1;
            var num = getPersonNum(selectedPerson);
            var name = getPersonName(selectedPerson);
            var group = getPersonGroup(selectedPerson);
            var suffix = "(" + group +num+ ")&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
            console.log("num:", num, "name:", name, "group:", group);

            //添加到入选名单
            var element=document.getElementById("gift3");
            var newEle=document.createElement("b");
            newEle.innerHTML=name;//添加名字
            element.appendChild(newEle);

            var newEle=document.createElement("b");
            newEle.innerHTML=suffix;//添加后缀
            element.appendChild(newEle);
        }
    });

    $("#btnReset").on("click", function () {
        showConfirm("确认重置吗？所有已中奖的人会重新回到抽奖池！", function () {
            //重置未中奖人员名单
            remainPerson = allPerson.toString().split(";");
            //中奖人数框置空
            $("#txtNum").val("").attr("placeholder", "请输入中奖人数");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut();//.prev().fadeIn()
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
            times++;
            console.log(times);
        });
    });

    $("#btnCfg").on("click", function () {
        if(cfg_page_visible==false){
            console.log("visible false")
            $("#cfgPage").fadeIn();
            cfg_page_visible = true;
            $("#btnCfg").text("应用");
        }
        else{
            console.log("visible true")
            showConfirm("确认应用配置参数吗？会导致重置！", function () {
                $("#cfgPage").fadeOut();
                cfg_page_visible = false;
                $("#btnCfg").text("配置");
                //重置未中奖人员名单
                remainPerson = allPerson.toString().split(";");
                
                //获取员工总人数
                all_person_num = 8;//TODO:
                
                //获取奖品数量
                third_gift_num = $("#numInput3").val();
                second_gift_num = $("#numInput2").val();
                first_gift_num = $("#numInput1").val();
                console.log("gift_num:",third_gift_num, second_gift_num, first_gift_num);
            });

        }
    });
});


//获取excel数据
function handleFile(event) {
    console.log("handleFile")
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            // 选择第一个工作表
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // 将工作表的数据转换成JSON对象
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });

            // 打印JSON对象
            console.log(jsonData);

            // 或者你可以将数据显示在页面上
            displayData(jsonData);
        };

        reader.readAsBinaryString(file);
    }
}

//（测试）显示excel数据
function displayData(data) {
    console.log("displayData")
    const outputDiv = document.getElementById('output');

    // 将数据格式化并显示在页面上
    outputDiv.innerHTML = JSON.stringify(data, null, 2);
}

//抽选一人
function getRandomPerson() {

    const randomIndex = Math.floor(Math.random() * allPerson.length);
    const selectedPerson = allPerson[randomIndex];

    // 从数组中移除已抽取的人员
    allPerson.splice(randomIndex, 1);
    console.log("getRandomPerson:", allPerson);

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

//抽奖主程序（待删除）
function startLuckDraw() {
    //随机中奖人
    var randomPerson = getRandomArrayElements(remainPerson, luckyDrawNum);
    var tempHtml = "";
    $.each(randomPerson, function (i, person) {
        var sizeStyle = "";
        if (person.length > 3) {
            sizeStyle = " style=font-size:" + 3 / person.length + "em";
        }
        if (leaderArr.indexOf(person) > -1 && times == 1) {
            tempHtml += "<span><span " + sizeStyle + "><b>" + person + "</b></span></span>";
        }
        else {
            tempHtml += "<span><span " + sizeStyle + ">" + person + "</span></span>";
        }
    });
    $("#result>div").html(tempHtml);
    //剩余人数剔除已中奖名单
    remainPerson = remainPerson.delete(randomPerson);
    //中奖人员
    luckyMan = luckyMan.concat(randomPerson);
    //设置抽奖人数框数字为空
    $("#txtNum").val("");
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
