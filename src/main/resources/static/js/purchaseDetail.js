var itable, stable, sstable;
layui.use('table', function () {
    itable = layui.table;
    //执行渲染
    itable.render({
        id: 'item_table',
        elem: '#item_table',
        height: 480,
        url: '../purchase/apply/items/get?apply_order=' + getUrlParam('apply_order'),
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'item_order', title: '商品编号', width: 120},
            {field: 'item_type', title: '商品类型', width: 120},
            {field: 'item_name', title: '商品名称', width: 120},
            {field: 'item_count', title: '商品数量', width: 100},
            {field: 'item_sup_name', title: '供应商', width: 160},
            {field: 'item_supid', title: '商品供应编号', width: 160},
            {field: 'item_sup_price', title: '预计价格', width: 100},
            {toolbar: '#opt', title: '操作', width: 120, align: 'center'},
            {toolbar: '#set', title: '是否固定资产', width: 120, align: 'center'}
        ]]
    });

    itable.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'choose') {
            openChooseModal(data);
        }

    });

    stable = layui.table;
    //执行渲染
    stable.render({
        id: 'supplier_table',
        elem: '#supplier_table',
        url: '',
        height: 320,
        even: true,
        cols: [[{"LAY_RadioCHECKED": true, title: '选择', width: 80},
            {field: 'supplier_name', title: '供应商', width: 180},
            {field: 'warm', title: '备注', width: 180}
        ]]
    });

    sstable = layui.table;
    //执行渲染
    sstable.render({
        id: 'supply_table',
        elem: '#supply_table',
        url: '',
        height: 320,
        even: true,
        cols: [[{"LAY_RadioCHECKED": true, title: '选择', width: 80},
            {field: 'supplyid', title: '商品供应编号', width: 180},
            {field: 'price', title: '单价', width: 180},
            {field: 'risk', title: '风险提示', width: 180}
        ]]
    });

});

var openChooseModal = function(data) {

    stable.reload('supplier_table', {
        url: '../supplier/name/find/byorder?item_order=' + getUrlParam('item_order')
    })

    $('#choosemodal').removeAttr('hidden');

}

var save = function() {

    $('input:checkbox[name="set"]:checked').each(function(){
        console.log($(this).val());
    })

}
