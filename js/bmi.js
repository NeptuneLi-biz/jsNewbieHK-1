// 指定DOM
var height = document.getElementById('height');
var weight = document.getElementById('weight');
var calBtn = document.getElementById('calBtn');
var refreshBtn = document.getElementById('refreshBtn');
var bmiResult = document.getElementById('bmiResult');
var data = [];
var bmi = '';
var bmiStatus = '';
var textColor = '';
var rgbaColor = [];


// 計算BMI
calBtn.addEventListener('click', function (e) {
    e.preventDefault();

    // 如果沒填寫身高體重就直接返回
    if (weight.value === '' || height === '') {
        alert('身高或體重不能空白');
        return;
    }

    bmi = roundDecimal(weight.value / Math.pow((height.value / 100), 2), 2);

    // 判斷BMI狀態
    bmiStatus = checkBmiStatus(bmi);

    // 顯示本次BMI結果
    calBtn.style.display = "none";
    bmiResult.style.display = "block";
    document.querySelector('#bmiResult .content h4').innerHTML = bmi;
    document.querySelector('#bmiResult .bmiStatus').innerHTML = bmiStatus;

    // 顯示相對應BMI的顏色
    changeColor();

    // 將資料存進資料庫
    updateData();
}, false)

// 重新輸入身高體重
refreshBtn.addEventListener('click', function (e) {
    e.preventDefault();

    height.value = '';
    weight.value = '';
    calBtn.style.display = "";
    bmiResult.style.display = "none";

    // 重新抓取BMI歷史資料
    getBmiData();
    showBmi();

}, false)

// 重新輸入按鈕的hover事件
refreshBtn.addEventListener('mouseover', function (e) {
    e.preventDefault();

    refreshBtn.style.boxShadow = '0 1px 6px 3px rgba(' + rgbaColor[0] + ', ' + rgbaColor[1] + ', ' + rgbaColor[2] + ', 0.64)';
    // refreshBtn.style.boxShadow = '0 1px 6px 3px rgba(0,0,255,0.64)';
}, false)
refreshBtn.addEventListener('mouseout', function (e) {
    e.preventDefault();

    refreshBtn.style.boxShadow = '0 0 rgba(0, 0, 0, 0)';
}, false)

// 載入畫面
$(function () {
    getBmiData();
    showBmi();
})

// 抓取資料
function getBmiData() {
    data = JSON.parse(localStorage.getItem('bmiList')) || [];

}

// 顯示BMI紀錄
function showBmi() {
    //將顯示結果順序反轉(反轉元素的排列秩序)
    var data2 = data.slice().reverse();
    var container = $('#pagination-container');
    var options = {
        // dataSource: data,
        dataSource: data2,
        callback: function (response, pagination) {
            window.console && console.log(response, pagination);

            var dataHtml = '<ul>';

            $.each(response, function (index, item) {
                // 取得顏色
                checkBmiStatus(item.bmi);

                dataHtml += ''
                    + '<li style="border-left: 7px solid ' + textColor + '">'
                    + '<div class="box">'
                    + '    <p class="h4">' + item.status + '</p>'
                    + '</div>'
                    + '<div class="box">'
                    + '    <div class="h5">BMI</div>'
                    + '    <div class="h4">' + item.bmi + '</div>'
                    + ' </div>'
                    + '<div class="box">'
                    + '    <div class="h5">weight</div>'
                    + '    <div class="h4">' + item.weight + '</div>'
                    + ' </div>'
                    + '<div class="box">'
                    + '    <div class="h5">height</div>'
                    + '    <div class="h4">' + item.height + '</div>'
                    + ' </div>'
                    + '<div class="box">'
                    + '    <p class="h5">' + item.date + '</p>'
                    + '</div>'
                    + '</li>';
            });
            dataHtml += '</ul>';

            // 將本次計算得到的顏色恢復
            checkBmiStatus(bmi);

            container.prev().html(dataHtml);
        }
    };

    container.addHook('beforeInit', function () {
        window.console && console.log('beforeInit...');
    });
    container.pagination(options);

    container.addHook('beforePageOnClick', function () {
        window.console && console.log('beforePageOnClick...');
        //return false
    });

    // 改變分頁尺寸與顏色
    var paginationjs = document.querySelector('.paginationjs');
    paginationjs.className += ' paginationjs-theme-yellow paginationjs-big ';
}

// 將資料存進資料庫
function updateData() {
    var dt = new Date();
    var today = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    var str = '';

    str = {
        status: bmiStatus,
        bmi: bmi,
        weight: weight.value,
        height: height.value,
        date: today
    }
    console.log("1"+data);
    data.push(str);
    localStorage.setItem('bmiList', JSON.stringify(data));
}

// 判斷BMI狀態
function checkBmiStatus(bmi) {
    // if (bmi < 15) {
    //     return '非常嚴重過輕';
    // }
    // else if (15 <= bmi && bmi < 16) {
    //     return '嚴重過輕';
    // }
    // else if (16 <= bmi && bmi < 18.5) {
    //     return '過輕';
    // }
    if (bmi < 18.5) {
        textColor = '#31BAF9';
        rgbaColor = ['49', '186', '249'];
        return '過輕';
    }
    else if (18.5 <= bmi && bmi < 25) {
        textColor = '#86D73F';
        rgbaColor = ['134', '215', '63'];
        return '正常';
    }
    else if (25 <= bmi && bmi < 30) {
        textColor = '#FF982D';
        rgbaColor = ['255', '152', '45'];
        return '過重';
    }
    else if (30 <= bmi && bmi < 35) {
        textColor = '#FF6C03';
        rgbaColor = ['255', '108', '33'];
        return '輕度肥胖';
    }
    else if (35 <= bmi && bmi <= 40) {
        textColor = '#FF6C03';
        rgbaColor = ['255', '108', '3'];
        return '中度肥胖';
    }
    else if (40 < bmi) {
        textColor = '#FF1200';
        rgbaColor = ['255', '18', '0'];
        return '重度肥胖';
    }
    else {
        textColor = '#000';
        rgbaColor = ['0', '0', '0'];
        return '判斷錯誤';
    }
}

// 顯示相對應顏色
function changeColor() {
    document.querySelector('#bmiResult').style.color = textColor;
    document.querySelector('#bmiResult').style.border = '6px solid ' + textColor;
    document.querySelector('#bmiResult .loopImg').style.background.color = textColor;
    document.querySelector('#bmiResult .loopImg #refreshBtn').style.backgroundColor = textColor;
}

// 四捨五入
function roundDecimal(val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

