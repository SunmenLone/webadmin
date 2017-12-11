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

var data;
var table;
layui.use('table', function(){
    table = layui.table;
    //执行渲染
    table.render({
        id: 'role_table',
        elem: '#role_table',
        url:  '../role/findall',
        page: true,
        even: true,
        cols: [[ { field: 'id', title: '序号', width: 80 },
            { field: 'role_id', title: '角色ID', width: 160 },
            { field: 'role_name', title: '角色名称', width: 120 },
            { field: 'permissions', title: '权限', width: 160 },
            { field: 'freeze', title: '状态', width: 80 },
            { field: 'create_time', title: '创建时间', width: 180 },
            { field: 'edit_user', title: '修改人', width: 120 },
            { field: 'edit_time', title: '修改时间', width: 180 },
            { toolbar: '#opt', title: '操作', align:'center', width: 120 },
        ]]
    });

    table.on('tool(role)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'edit'){
            data = obj.data;
            openEditModal(1);
        } else if (layEvent === 'delete') {
            layer.open({
                title: '提示',
                content: '确认删除角色 ' + data.role_name + ' ？',
                btn: ['确认', '取消'], //可以无限个按钮
                yes: function(){
                    $.ajax({
                        url: '../role/delete',
                        data: {
                            role_id: data.role_id
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

var search = function() {

    var rolename = $('input[name="role"]').val();

    var option = {
        where: {}
    };

    if (rolename != '') {
        option.where['role_name'] = rolename;
    }

    table.reload('role_table', option);

}

var openEditModal = function(type){

    if (type == 0) {

        $('#modal_title').html('新增角色');

        $('input[name="modal_name"]').val();
        $('#modal_status option[value="0"]').attr('selected', true);
        $('input[name="menu"]:checked').each(function(){
            $(this).removeAttr('checked');
        });
        form.render('select');

        $('#edit_confirm').attr('href', 'javascript:addOrEditRole(0);');

    } else {

        $('#modal_title').html('修改角色');

        $('input[name="modal_name"]').val(data.role_name);
        $('#modal_status option[text="' + data.freeze + '"]').attr('selected', true);
        var menu = data.permissions.split(',');
        $('input[name="menu"]').each(function(){
            $(this).removeAttr('checked');
        });
        $('input[name="menu"]').each(function(){
            for (var i = 0; i < menu.length; i++) {
                var t = $(this).next().text();
                t = t.substring(0, t.length-1);
                if (t == menu[i]) {
                    $(this).attr('checked', true);
                }
            }
        });
        form.render('select');
        form.render('checkbox');

        $('#edit_confirm').attr('href', 'javascript:addOrEditRole(1);');

    }

    $('#editmodal').removeAttr('hidden');

}

var addOrEditRole = function(type) {

    if (type == 0) {

        layer.open({
            title: '提示',
            content: '确认添加角色？',
            btn: ['确认', '取消'],
            yes: function(){

                var permissions ="";
                $('input[name="menu"]:checked').each(function(){
                    permissions += $(this).val()+",";
                });
                permissions = permissions.substring(0, permissions.length - 1);

                $.ajax({
                    url: '../role/add',
                    data: {
                        role_name: $('input[name="modal_name"]').val(),
                        permissions: permissions,
                        freeze: $('#modal_status option:selected').val(),
                        edit_user: GetCookie('username')
                    },
                    success: function(res){
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('role_table', {});
                            layer.open({
                                title: '提示'
                                ,content: '添加角色成功'
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
            content: '确认修改角色？',
            btn: ['确认', '取消'],
            yes: function(){

                var permissions ="";
                $('input[name="menu"]:checked').each(function(){
                    permissions += $(this).val()+",";
                });
                permissions = permissions.substring(0, permissions.length - 1);

                $.ajax({
                    url: '../role/add',
                    data: {
                        role_id: data.role_id,
                        role_name: $('input[name="modal_name"]').val(),
                        permissions: permissions,
                        freeze: $('#modal_status option:selected').val(),
                        edit_user: GetCookie('username')
                    },
                    success: function(res){
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('role_table', {});
                            layer.open({
                                title: '提示'
                                ,content: '修改角色成功'
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
