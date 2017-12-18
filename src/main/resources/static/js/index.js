
var menu = {
    1: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'userManagement.html\');">用户管理</a>',
    2: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'roleManagement.html\');">角色管理</a>',
    3: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'itemManagement.html\');">商品类型管理</a>',
    4: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'supplierManagement.html\');">供应商管理</a>',
    5: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'applyManagement.html\');">提交申请</a>',
    6: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'applyReview.html\');">申请审核</a>',
    7: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'purchaseManagement.html\');">采购单管理</a>',
    8: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'statistic.html\');">使用部门采购情况</a>',
    9: '<a href="javascript:$(\'#ifm\').attr(\'src\', \'riskManagement.html\');">风险模型设置</a>'
}


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

                    var permissions;
                    if (res.data.permissions === '0') {
                        permissions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    } else {
                        permissions = res.data.permissions.split(',');
                    }

                    $.each(permissions, function(i){

                        if (permissions[i] == 1 || permissions[i] == 2) {
                            $('#m' + 1).css('display', 'inline-block');
                        } else if (permissions[i] == 5 || permissions[i] == 6) {
                            $('#m' + 5).css('display', 'inline-block');
                        } else {
                            $('#m' + permissions[i]).css('display', 'inline-block');
                        }
                        $('#menu' + permissions[i]).append(menu[permissions[i]]);

                    });


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
