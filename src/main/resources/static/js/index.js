layui.use('element', function(){
    var element = layui.element;

});

var layer;
layui.use('layer', function() { //独立版的layer无需执行这一句
    layer = layui.layer; //独立版的layer无需执行这一句
});

var getUserInfo = function() {

    var username = GetCookie('username');

    if (username != null) {
        $.ajax({
            url: '../user/find/byaccount',
            data: {
                username: username
            },
            success: function(res){
                if (res.code == 0) {
                    var user = res.data;
                    $('#realname').html(user.user_realname);
                } else {
                    console.log(res.errormessage);
                }
            }
        })
    }
}

var signout = function() {

    var username = GetCookie('username');

    if (username == null) return;

    layer.open({
        title: '提示',
        content: '确认退出登录？',
        btn: ['确认', '取消'], //可以无限个按钮
        yes: function(){
            $.ajax({
                url: '../user/find/byaccount',
                data: {
                    username: username
                },
                complete: function(res){
                    window.location.href="../login.html";
                }
            });
        },
        btn2: function(){
            layer.closeAll();
        }
    });


        $.ajax({
            url: '../user/find/byaccount',
            data: {
                username: username
            },
            success: function(res){
                if (res.code == 0) {
                    var user = res.date;
                    $('#realname').html(user.user_realname);
                } else {
                    console.log(res.msg);
                }
            }
        });

}

$(function(){
    getUserInfo();
})
