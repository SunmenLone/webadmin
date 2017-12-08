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
        id: 'role_table',
        elem: '#role_table',
        url:  '',
        page: true,
        even: true,
        cols: [[ {checkbox: true},
            { field: 'id', title: '序号', width: 80 },
            { field: 'roleid', title: '角色ID', width: 160 },
            { field: 'rolename', title: '角色名称', width: 120 },
            { field: 'phone', title: '权限', width: 160 },
            { field: 'role', title: '状态', width: 80 },
            { field: 'createtime', title: '创建时间', width: 180 },
            { field: 'operator', title: '修改人', width: 120 },
            { field: 'updatetime', title: '修改时间', width: 180 },
            { toolbar: '#opt', title: '操作', align:'center', width: 80 },
        ]]
    });

    table.on('tool(role)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'edit'){

        }

    });

});
