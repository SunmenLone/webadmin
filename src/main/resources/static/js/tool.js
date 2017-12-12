function SetCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


//取Cookie的值
function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        /*  alert(j); */
        if (document.cookie.substring(i, j) == arg)
            return getCookieVal(j);//取到cookie的值
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
}

//取到cookie的值
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function  DateDiff(sDate1,  sDate2){
    var  aDate,  oDate1,  oDate2,  iDays;
    aDate  =  sDate1.split("-");
    oDate1  =  new Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);    //转换为12-18-2002格式
    aDate  =  sDate2.split("-");
    oDate2  =  new Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
    iDays  =  parseInt(Math.abs(oDate1 - oDate2)  /  1000  /  60  /  60  / 24);    //把相差的毫秒数转换为天数
    return  iDays;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}