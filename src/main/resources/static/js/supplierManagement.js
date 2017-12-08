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
        id: 'supplier_table',
        elem: '#supplier_table',
        url: '',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'supplierid', title: '供应商ID', event: 'detail', style: 'color: #01AAED;', width: 160},
            {field: 'supplierame', title: '供应商名称', width: 180},
            {field: 'createtime', title: '创建时间', width: 180},
            {field: 'supplytype', title: '可供应商品类型', width: 140},
            {field: 'supplyname', title: '可供应产品名称', width: 140},
            {field: 'avgscore', title: '综合评分', width: 100},
            {toolbar: '#opt', title: '操作', align: 'center', width: 200},
        ]]
    });

    table.on('tool(supplier)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'edit') {

        } else if (layEvent === 'detail') {

        }

    });

});
