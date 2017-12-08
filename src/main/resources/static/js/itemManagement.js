layui.use('element', function () {
    var element = layui.element;


});

layui.use('form', function () {
    var form = layui.form;

});

var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'item_table',
        elem: '#item_table',
        url: '',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'itemid', title: '商品ID', width: 160},
            {field: 'type', title: '商品类型', width: 160},
            {field: 'itemname', title: '商品名称', width: 160},
            {field: 'lastupdate', title: '最后修改时间', width: 200},
            {field: 'status', title: '状态', width: 120},
            {toolbar: '#opt', title: '操作', align: 'center', width: 100},
        ]]
    });

    table.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'edit') {

        }

    });

});
