var xhr = new XMLHttpRequest();
var goTop = document.querySelector('.goTop');
var region = document.getElementById('region');
var quickLink = document.getElementById('quickLink');
var regionChoice = '';
var regionList = [];
var getData = '';

xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.setRequestHeader('content-Type', 'application/JSON');
xhr.send();

xhr.onload = function () {
    getData = JSON.parse(xhr.responseText);
    // var a = getData.result.records[0];
    // console.log(a);

    // 找出所有行政區放入Select
    putRegion();

    // 顯示行政區資料
    showData();

}

// 回到畫面最頂端
goTop.addEventListener('click', function (e) {
    e.preventDefault();
    var timer = null;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
            scrollTo(0, oTop - 50);
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}, false)

// 選擇行政區下拉選單
region.addEventListener('change', function (e) {
    e.preventDefault();
    // console.log(e.target.value);
    regionChoice = e.target.value;
    showData();
}, false)


// 熱門行政區連結
quickLink.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.nodeName === 'A') {
        regionChoice = e.target.textContent;
    }
    showData();
}, false)



function putRegion() {
    for (var i = 0; i < getData.result.records.length; i++) {
        regionList.push(getData.result.records[i].Zone);
    }
    var regionDistinct = [...new Set(regionList)];

    var region = document.getElementById('region');

    for (var i = 0; i < regionDistinct.length; i++) {
        var str = document.createElement('option');
        str.textContent = regionDistinct[i];
        str.value = regionDistinct[i];
        region.appendChild(str);
    }

}



// 顯示旅遊景點
function showData() {
    var container = $('#pagination-container');
    var options = {
        dataSource: getData.result.records,
        callback: function (response, pagination) {
            // window.console && console.log(response, pagination);

            var dataHtml = '<ul class="regionList">';

            $.each(response, function (index, item) {
                // 如果是預設剛載入就全找，否則只找選擇的區域
                if (regionChoice === '' || (regionChoice === item.Zone)) {
                    dataHtml += ''
                        + '<li>'
                        + '<div class="picture" style="background-image: url(\'' + item.Picture1 + '\');">'
                        + '<h3 class="hotSpot">' + item.Name + '</h3>'
                        + '<h4 class="location">' + item.Zone + '</h4>'
                        + '</div> '
                        + '<div class="info"> '
                        + '    <div class="businessHour">' + item.Opentime + '</div> '
                        + '    <div class="adress">' + item.Add + '</div> '
                        + '    <div class="phone">' + item.Tel + '</div> ';
                    if (item.Ticketinfo !== '') {
                        dataHtml += ''
                            + '<div class="admissionFree">' + item.Ticketinfo + '</div> ';
                    }
                    dataHtml += ''
                        + '</div> '
                        + '</li> ';
                }
                console.log(item);
            });
            dataHtml += '</ul>';

            container.prev().html(dataHtml);

            if (regionChoice !== '') {
                document.querySelector('.showData h2').innerHTML = regionChoice;
            }
        }
    };

    // container.addHook('beforeInit', function () {
    //     window.console && console.log('beforeInit...');
    // });
    container.pagination(options);

    // container.addHook('beforePageOnClick', function () {
    //     window.console && console.log('beforePageOnClick...');
    //     //return false
    // });
    // 改變分頁尺寸與顏色
    var paginationjs = document.querySelector('.paginationjs');
    paginationjs.className += ' paginationjs-theme-blue paginationjs-big ';
}