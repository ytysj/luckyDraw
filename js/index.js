//抽奖人员名单
var allPerson = [{ "工号": "001", "姓名": "林一", "部门": "洗菜部" }, { "工号": "002", "姓名": "卫二", "部门": "洗菜部" },
{ "工号": "003", "姓名": "周三", "部门": "切菜部" }, { "工号": "004", "姓名": "吴四", "部门": "切菜部" },
{ "工号": "005", "姓名": "赖五", "部门": "切菜部" }, { "工号": "006", "姓名": "韩六", "部门": "端盘部" },
{ "工号": "007", "姓名": "董七", "部门": "端盘部" }, { "工号": "008", "姓名": "陈八", "部门": "端盘部" }];

//领导人员名单
var leaderArr = ["张三"];
//未中奖人员名单
var remainPerson = allPerson.toString().split(";");
//中奖人员名单
var luckyMan = [];
var timer;//定时器
var times = 1;//抽奖次数,如果不是第一次，不加粗显示领导姓名

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fileInput').addEventListener('change', handleFile);
});

$(function () {
    iconAnimation();
    //开始抽奖
    $("#btnStart").on("click", function () {
        //判断是开始还是结束
        if ($("#btnStart").text() === "开始") {
            if (!$("#txtNum").val()) {
                showDialog("请输入中奖人数");
                return false;
            }
            if ($("#txtNum").val() > 490) {
                showDialog("一次最多只能输入490人");
                return false;
            }
            if ($("#txtNum").val() > remainPerson.length) {
                showDialog("当前抽奖人数大于奖池总人数<br>当前抽奖人数：<b>" + $("#txtNum").val() + "</b>人,奖池人数：<b>" + remainPerson.length + "</b>人");
                return false;
            }
            $("#result").fadeOut();
            //显示动画框，隐藏中奖框
            $("#luckyDrawing").show().next().addClass("hide");
            move();
            $("#btnStart").text("停止");
            $("#bgLuckyDrawEnd").removeClass("bg");
        }
        else {
            $("#btnStart").text("开始");//设置按钮文本为开始
            var luckyDrawNum = $("#txtNum").val();
            getRandomPerson();
            //startLuckDraw();//抽奖开始

            $("#luckyDrawing").fadeOut();
            clearInterval(timer);//停止输入框动画展示
            $("#luckyDrawing").val(luckyMan[luckyMan.length - 1]);//输入框显示最后一个中奖名字
            $("#result").fadeIn().find("div").removeClass().addClass("p" + luckyDrawNum);//隐藏输入框，显示中奖框
            $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉
            $("#txtNum").attr("placeholder", "输入中奖人数(" + remainPerson.length + ")");
        }
    });

    $("#btnReset").on("click", function () {
        //确认重置对话框
        var confirmReset = false;
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
    if (allPerson.length === 0) {
        console.log("所有人员已被抽取完毕。");
        return null;
    }

    const randomIndex = Math.floor(Math.random() * allPerson.length);
    const selectedPerson = allPerson[randomIndex];

    // 从数组中移除已抽取的人员
    allPerson.splice(randomIndex, 1);
    console.log("getRandomPerson:", allPerson);
    console.log("selectedPerson:", randomIndex, selectedPerson);
    var num = getPersonNum(selectedPerson);
    var name = getPersonName(selectedPerson);
    var group = getPersonGroup(selectedPerson);
    console.log("num:", num, "name:", name, "group:", group);

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


//抽奖主程序
function startLuckDraw() {
    //抽奖人数
    var luckyDrawNum = $("#txtNum").val();
    if (luckyDrawNum > remainPerson.length) {
        alert("抽奖人数大于奖池人数！请修改人数。或者点重置开始将新一轮抽奖！");
        return false;
    }
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
//跳动的数字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, remainPerson.length);
        $showName.val(remainPerson[i]);//输入框赋值
    }, interTime);
}

//顶上的小图标，随机动画
function iconAnimation() {
    var interTime = 200;//设置间隔时间
    var $icon = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime);

}
