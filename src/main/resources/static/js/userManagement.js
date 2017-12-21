layui.use('element', function () {
    var element = layui.element;


});

var form;
layui.use('form', function () {
    form = layui.form;

    form.on('select(role)', function(data){
        roleChange = true;
    });

    form.on('select(dept)', function(data){
        deptChange = true;
    });


});

var layer;
layui.use('layer', function () { //独立版的layer无需执行这一句
    layer = layui.layer; //独立版的layer无需执行这一句
});

var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'user_table',
        elem: '#user_table',
        url: '../user/find/bycondition',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'user_realname', title: '姓名', width: 120},
            {field: 'username', title: '用户ID', width: 160},
            {field: 'telphone', title: '手机号码', width: 160},
            {field: 'role_name', title: '角色', width: 120},
            {field: 'department', title: '所属部门', width: 120},
            {field: 'last_update', title: '最后修改时间', width: 200},
            {toolbar: '#opt', title: '操作', align: 'center', width: 120},
        ]]
    });

    table.on('tool(user)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'edit') {
            openEditModal(1, data);
        } else if (layEvent === 'delete') {
            layer.open({
                title: '提示',
                content: '确认删除用户 ' + data.username + ' ？',
                btn: ['确认', '取消'], //可以无限个按钮
                yes: function (index) {
                    $.ajax({
                        url: '../user/delete',
                        data: {
                            username: data.username
                        },
                        success: function (res) {
                            layer.close(index);
                            if (res.code == 0) {
                                obj.del();
                            } else {
                                layer.open({
                                    title:'提示',
                                    content:'操作失败'
                                });
                            }
                        }
                    });
                },
                btn2: function (index) {
                    layer.close(index);
                }
            });
        }

    });

});

var nameChange = false, roleChange = false, deptChange = false, phoneChnage = false, passwordChange = false;
var openEditModal = function (type, data) {

    if (type == 0) {

        $('#modal_title').html('新增用户');

        $('input[name="modal_id"]').val('');
        $('input[name="modal_id"]').removeAttr('disabled');
        $('input[name="modal_id"]').removeClass('setpwd-input');

        $('input[name="modal_name"]').val('');

        $('#modal_role option[value=""]').prop('selected', true);
        $('#modal_department option[value=""]').prop('selected', true);
        form.render('select');

        $('input[name="modal_phone"]').val('');

        $('input[name="modal_password"]').val('');

        $('#edit_confirm').attr('href', 'javascript:addOrUpdateUser(0)');
    } else {
        $('#modal_title').html('修改用户');

        $('input[name="modal_id"]').val(data.username);
        $('input[name="modal_id"]').attr('disabled', true);
        $('input[name="modal_id"]').addClass('setpwd-input');

        $('input[name="modal_name"]').val(data.user_realname);

        $('#modal_role option[value="' + data.role_id + '"]').prop('selected', true);
        $('#modal_department option[value="' + data.department + '"]').prop('selected', true);
        form.render('select');

        $('input[name="modal_phone"]').val(data.telphone);

        $('input[name="modal_password"]').val(data.password);

        $('#edit_confirm').attr('href', 'javascript:addOrUpdateUser(1)');

        $('input[name="modal_name"]').change(function(){
            nameChange = true;
        });

        $('input[name="modal_phone"]').change(function () {
            phoneChnage = true;
        });

        $('input[name="modal_password"]').change(function () {
            passwordChange = true;
        });
    }
    $('#editmodal').removeAttr('hidden');

}

var addOrUpdateUser = function (type) {

    if (type == 0) {

        layer.open({
            title: '提示',
            content: '确认添加用户？',
            btn: ['确认', '取消'], //可以无限个按钮
            yes: function (index) {
                $.ajax({
                    url: '../user/add',
                    data: {
                        username: $('input[name="modal_id"]').val(),
                        user_realname: $('input[name="modal_name"]').val(),
                        role_id: $('#modal_role option:selected').val(),
                        role_name: $('#modal_role option:selected').html(),
                        department: $('#modal_department option:selected').html(),
                        telphone: $('input[name="modal_phone"]').val(),
                        password: $('input[name="modal_password"]').val() != '' ? md5('caigou' + $('input[name="modal_password"]').val()) : md5('caigou123456')
                    },
                    success: function (res) {
                        layer.close(index);
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('user_table', {});
                            layer.open({
                                title: '提示'
                                , content: '添加用户成功'
                            });
                        } else {
                            layer.open({
                                title:'提示',
                                content:'操作失败'
                            });
                        }
                    },
                    complete: function(){
                        nameChange = false;
                        roleChange = false;
                        deptChange = false;
                        phoneChnage = false;
                        passwordChange = false;
                    }
                });
            },
            btn2: function (index) {
                layer.close(index);
            }
        });


    } else {

        var param = {
            username: $('input[name="modal_id"]').val()
        }

        if (nameChange) {
            param['user_realname'] = $('input[name="modal_name"]').val();
        }

        if (roleChange) {
            param['role_id'] = $('#modal_role option:selected').val();
            param['role_name'] = $('#modal_role option:selected').html();
        }

        if (deptChange) {
            param['department'] = $('#modal_department option:selected').html();
        }

        if (phoneChnage) {
            param['telphone'] = $('input[name="modal_phone"]').val();
        }

        if (passwordChange) {
            param['password'] = $('input[name="modal_password"]').val() != '' ? md5('caigou' + $('input[name="modal_password"]').val()) : md5('caigou123456')
        }

        if (!nameChange && !roleChange && !deptChange && !phoneChnage && !passwordChange) {
            $('#editmodal').attr('hidden', true);
            return;
        }

        layer.open({
            title: '提示',
            content: '确认修改？',
            btn: ['确认', '取消'], //可以无限个按钮
            yes: function (index) {

                $.ajax({
                    url: '../user/update',
                    data: param,
                    success: function (res) {
                        layer.close(index);
                        if (res.code == 0) {
                            layer.close(index);
                            $('#editmodal').attr('hidden', true);
                            passwordChange = false;
                            table.reload('user_table', {});
                            layer.open({
                                title: '提示',
                                content: '修改用户成功'
                            });
                        } else {
                            layer.open({
                                title:'提示',
                                content:'操作失败',
                            });
                        }
                    },
                    complete: function(){
                        nameChange = false;
                        roleChange = false;
                        deptChange = false;
                        phoneChnage = false;
                        passwordChange = false;
                    }
                });
            },
            btn2: function (index) {
                layer.close(index);
            }
        });

    }

}

var getRole = function () {

    $.ajax({
        url: '../role/findall',
        async: false,
        success: function (res) {
            if (res.code == 0) {
                var select1 = document.getElementById('rolename');
                var select2 = document.getElementById('modal_role');
                select1.options.add(new Option("请选择", ""));
                select2.options.add(new Option("请选择", ""));
                $.each(res.data, function (i) {
                    select1.options.add(new Option(res.data[i].role_name, res.data[i].role_id));
                    select2.options.add(new Option(res.data[i].role_name, res.data[i].role_id));
                });
            } else {
                layer.open({
                    title:'提示',
                    content:'查询角色失败'
                });
            }
        }
    })

}

var search = function () {

    var realname = $('input[name="username"]').val();
    var username = $('input[name="userid"]').val();
    var roleid = $('#rolename option:selected').val();

    var option = {
        where: {}
    };

    if (realname != '') {
        option.where['user_realname'] = realname;
    }
    if (username != '') {
        option.where['username'] = username;
    }

    if (roleid != '') {
        option.where['role_id'] = roleid;
    }

    table.reload('user_table', option);

}

$(function () {
    getRole();
})

