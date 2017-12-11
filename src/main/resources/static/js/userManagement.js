layui.use('element', function(){
    var element = layui.element;


});

var form;
layui.use('form', function(){
    form = layui.form;

});

var layer;
layui.use('layer', function() { //独立版的layer无需执行这一句
    layer = layui.layer; //独立版的layer无需执行这一句
});

var table;
layui.use('table', function(){
    table = layui.table;
    //执行渲染
    table.render({
        id: 'user_table',
        elem: '#user_table',
        url:  '../user/find/bycondition',
        page: true,
        even: true,
        cols: [[{ field: 'id', title: '序号', width: 80 },
            { field: 'user_realname', title: '姓名', width: 120 },
            { field: 'username', title: '用户ID', width: 160 },
            { field: 'telphone', title: '手机号码', width: 160 },
            { field: 'role_name', title: '角色', width: 120 },
            { field: 'department', title: '所属部门', width: 120 },
            { field: 'last_update', title: '最后修改时间', width: 200 },
            { toolbar: '#opt', title: '操作', align:'center', width: 120 },
        ]]
    });

    table.on('tool(user)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'edit'){
            openEditModal(1, data);
        } else if(layEvent === 'delete') {
            layer.open({
                title: '提示',
                content: '确认删除用户 ' + data.username + ' ？',
                btn: ['确认', '取消'], //可以无限个按钮
                yes: function(){
                    $.ajax({
                        url: '../user/delete',
                        data: {
                            username: data.username
                        },
                        success: function(res){
                            if (res.code == 0) {
                                obj.del();
                                layer.closeAll();
                            } else {
                                console.log(res.errormessage);
                            }
                        }
                    });
                },
                btn2: function(){
                    layer.closeAll();
                }
            });
        }

    });

});

var openEditModal = function(type, data) {

    if (type == 0) {

        $('#modal_title').html('新增用户');

        $('input[name="modal_id"]').val('');
        $('input[name="modal_id"]').removeAttr('disabled');
        $('input[name="modal_id"]').removeClass('setpwd-input');

        $('input[name="modal_name"]').val('');

        $('#modal_role option[value=""]').attr('selected', true);
        $('#modal_department option[value=""]').attr('selected', true);
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

        $('#modal_role option[value="' + data.role_id + '"]').attr('selected', true);
        $('#modal_department option[value="' + data.department + '"]').attr('selected', true);
        form.render('select');

        $('input[name="modal_phone"]').val(data.telphone);

        $('input[name="modal_password"]').val(data.password);

        $('#edit_confirm').attr('href', 'javascript:addOrUpdateUser(1)');
    }
    $('#editmodal').removeAttr('hidden');

}

var addOrUpdateUser = function(type) {

    if (type == 0) {

        layer.open({
            title: '提示',
            content: '确认添加用户？',
            btn: ['确认', '取消'], //可以无限个按钮
            yes: function(){
                $.ajax({
                    url: '../user/add',
                    data: {
                        username: $('input[name="modal_id"]').val(),
                        user_realname: $('input[name="modal_name"]').val(),
                        role_id: $('#modal_role option:selected').val(),
                        role_name: $('#modal_role option:selected').html(),
                        department: $('#modal_department option:selected').html(),
                        telphone: $('input[name="modal_phone"]').val(),
                        password: $('input[name="modal_password"]').val() != '' ? md5('caigou'+$('input[name="modal_password"]').val()) : md5('caigou123456')
                    },
                    success: function(res){
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('user_table', {});
                            layer.open({
                                title: '提示'
                                ,content: '添加用户成功'
                            });
                        } else {
                            console.log(res.errormessage);
                        }
                    }
                });
            },
            btn2: function(){
                layer.closeAll();
            }
        });


    } else {

        layer.open({
            title: '提示',
            content: '确认修改？',
            btn: ['确认', '取消'], //可以无限个按钮
            yes: function(){
                $.ajax({
                    url: '../user/update',
                    data: {
                        username: $('input[name="modal_id"]').val(),
                        user_realname: $('input[name="modal_name"]').val(),
                        role_id: $('#modal_role option:selected').val(),
                        role_name: $('#modal_role option:selected').html(),
                        department: $('#modal_department option:selected').html(),
                        telphone: $('input[name="modal_phone"]').val(),
                        password: $('input[name="modal_password"]').val() != '' ? md5('caigou'+$('input[name="modal_password"]').val()) : md5('caigou123456')
                    },
                    success: function(res){
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('user_table', {});
                            layer.open({
                                title: '提示'
                                ,content: '修改用户成功'
                            });
                        } else {
                            console.log(res.errormessage);
                        }
                    }
                });
            },
            btn2: function(){
                layer.closeAll();
            }
        });


    }

}

var getRole = function() {

    $.ajax({
        url: '../role/findall',
        async: false,
        success: function(res){
            if (res.code == 0) {
                var select1 = document.getElementById('rolename');
                var select2 = document.getElementById('modal_role');
                select1.options.add(new Option("直接选择或搜索选择",""));
                select2.options.add(new Option("直接选择或搜索选择",""));
                $.each(res.data, function(i){
                    select1.options.add(new Option(res.data[i].role_name, res.data[i].role_id));
                    select2.options.add(new Option(res.data[i].role_name, res.data[i].role_id));
                });
            } else {
                console.log(res.errormessage);
            }
        }
    })

}

var search = function() {

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

$(function(){
    getRole();
})

