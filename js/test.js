var a = [20, 21, 22, 23, 24];
$.each(a, function (index, val) {
    console.log('index=' + index);
    if (index == 2) {
        return false;
    }
    console.log('val=' + val);
}); 