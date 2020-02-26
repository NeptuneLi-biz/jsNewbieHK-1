var xhr = new XMLHttpRequest();
var a = '';
var regionList = [];
var getData = '';

xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.setRequestHeader('content-Type', 'application/JSON');
xhr.send();

xhr.onload = function () {
    getData = JSON.parse(xhr.responseText);
    a = getData.result.records[0];
    console.log(a);

    // 找出所有行政區放入Select
    putRegion();

    var dataHtml = '<ul>';
    for (var i = 0; i < getData.result.records.length; i++) {
        dataHtml += ''
            + '<li>'
            + '<div class="picture" style="background-image: url(\'' + getData.result.records[i].Picture1 + '\');">'
            + '<h3 class="hotSpot">' + getData.result.records[i].Name + '</h3>'
            + '<h4 class="location">' + getData.result.records[i].Zone + '</h4>'
            + '</div> '
            + '<div class="info"> '
            + '    <div class="businessHour">' + getData.result.records[i].Opentime + '</div> '
            + '    <div class="adress">' + getData.result.records[i].Add + '</div> '
            + '    <div class="phone">' + getData.result.records[i].Tel + '</div> ';
        if (getData.result.records[i].Ticketinfo !== '') {
            dataHtml += ''
                + '<div class="admissionFree">' + getData.result.records[i].Ticketinfo + '</div> ';
        }
        dataHtml += ''
            + '</div> '
            + '</li> ';
    }
    var list = document.querySelector('.regionList');
    list.innerHTML = dataHtml;
}


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