layui.use('element', function(){
    var element = layui.element;


});

layui.use('form', function(){
    var form = layui.form;

});

var table;
layui.use('table', function(){
    table = layui.table;
    //执行渲染
    table.render({
        id: 'user_table',
        elem: '#user_table',
        url:  '',
        page: true,
        even: true,
        cols: [[{ field: 'id', title: '序号', width: 80 },
            { field: 'username', title: '姓名', width: 120 },
            { field: 'userid', title: '用户ID', width: 160 },
            { field: 'phone', title: '手机号码', width: 160 },
            { field: 'role', title: '角色', width: 120 },
            { field: 'department', title: '所属部门', width: 120 },
            { field: 'lastupdate', title: '最后修改时间', width: 200 },
            { toolbar: '#opt', title: '操作', align:'center', width: 100 },
        ]]
    });

    table.on('tool(user)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'edit'){

        } else if(layEvent === 'delete') {

        }

    });

});
