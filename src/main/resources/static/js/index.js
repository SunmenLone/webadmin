
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

var html = {
    1: 'userManagement.html',
    2: 'roleManagement.html',
    3: 'itemManagement.html',
    4: 'supplierManagement.html',
    5: 'applyManagement.html',
    6: 'applyReview.html',
    7: 'purchaseManagement.html',
    8: 'statistic.html',
    9: 'riskManagement.html'
}


layui.use('element', function(){
    var element = layui.element;

});

layui.use('form', function(){
   var form = layui.form;
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

                        if (i == 0) {$('#ifm').attr('src', html[permissions[i]]);

                        }

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
                      layer.open({
                          title:'提示',
                          content:'操作失败'
                      });
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
        yes: function(index){
            $.ajax({
                url: '../user/find/byaccount',
                data: {
                    username: username
                },
                complete: function(res){
                    layer.close(index);
                    window.location.href="../login.html";
                }
            });
        },
        btn2: function(index){
            layer.close(index);
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
                      layer.open({
                          title:'提示',
                          content:'查询用户信息失败'
                      });
                }
            }
        });

}

$(function(){
    getUserInfo();
});

var openEditModal = function(){
    $('#editmodal').removeAttr('hidden');
    $('#ddd').removeClass('layui-this');
};

var updatePwd = function() {

    var newpwd = $('input[name="new_pwd"]').val();
    var cfgpwd = $('input[name="cfg_pwd"]').val();

    if ( newpwd != cfgpwd) {
        layer.open({
            title: '提示',
            content: '两次密码不一致'
        })
        return;
    }

    layer.open({
        title: '提示',
        content: '确认修改密码？',
        btn: ['确认', '取消'],
        yes: function(index){

            var username = GetCookie('username');

            var param = {
                username: username,
                password: md5('caigou' + newpwd)
            }

            $.ajax({
                url: '../user/update',
                data: param,
                success: function(res){
                    if (res.code == 0) {
                        layer.close(index);
                        layer.open({
                            title: '提示',
                            content: '修改密码成功'
                        });
                        $('#editmodal').attr('hidden', true);
                    } else {
                        layer.open({
                            title: '提示',
                            content: '修改密码失败'
                        });
                    }
                }
            })

        },
        btn2: function(index){
            layer.close(index);
        }
    });
};