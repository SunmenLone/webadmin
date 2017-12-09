var itable, stable, sstable;
layui.use('table', function () {
    itable = layui.table;
    //执行渲染
    itable.render({
        id: 'item_table',
        elem: '#item_table',
        height: 480,
        url: '',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'itemid', title: '商品编号', width: 160},
            {field: 'type', title: '商品类型', width: 160},
            {field: 'itemname', title: '商品名称', width: 160},
            {field: 'quantity', title: '商品数量', width: 120},
            {toolbar: 'supplier', title: '供应商', align: 'center', width: 160},
            {field: 'supplyid', title: '商品供应编号', width: 160},
            {field: 'price', title: '预计价格', width: 120},
            {toolbar: '#opt', title: '操作', width: 140},
            {type: 'checkbox', title: '是否固定资产', width: 140}
        ]]
    });

    itable.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'choose') {

        }

    });

    stable = layui.table;
    //执行渲染
    stable.render({
        id: 'suuplier_table',
        elem: '#supplier_table',
        url: '',
        height: 320,
        even: true,
        cols: [[{"LAY_RadioCHECKED": true, title: '选择', width: 80},
            {field: 'supplier', title: '供应商', width: 180},
            {field: 'warm', title: '备注', width: 180}
        ]]
    });

    sstable = layui.table;
    //执行渲染
    sstable.render({
        id: 'suuply_table',
        elem: '#supply_table',
        url: '',
        height: 320,
        even: true,
        cols: [[{"LAY_RadioCHECKED": true, title: '选择', width: 80},
            {field: 'supplyid', title: '商品供应编号', width: 180},
            {field: 'price', title: '备注', width: 180},
            {field: 'risk', title: '备注', width: 180}
        ]]
    });

});
