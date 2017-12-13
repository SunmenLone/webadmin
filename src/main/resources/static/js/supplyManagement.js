layui.use('element', function () {
    var element = layui.element;


});

var form;
layui.use('form', function () {
    form = layui.form;

});

var layer;
layui.use('layer', function(){
   layer = layui.layer;
});

var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'supply_table',
        elem: '#supply_table',
        url: '../supplier/item/find?sup_id=' + getUrlParam('supplier_id'),
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'item_order', title: '商品编号', width: 160},
            {field: 'item_type', title: '商品类型', width: 160},
            {field: 'item_name', title: '商品名称', width: 160},
            {field: 'item_supid', title: '商品供应编号', width: 200},
            {toolbar: '#opt1', title: '详细信息', align: 'center', width: 120},
            {field: 'item_addtime', title: '添加时间', width: 180},
            {field: 'present_state', title: '状态', width: 120},
            {field: 'item_price', title: '当前单价', width: 100},
            {toolbar: '#opt2', title: '本年价格波动', align: 'center', width: 120},
        ]]
    });

    table.on('tool(supply)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') {

        } else if (layEvent === 'edit') {

        } else if (layEvent === 'line') {

        }

    });

});

var search = function() {

    var item_name =  $('input[name="item_name"]').val();
    var item_order =  $('input[name="item_order"]').val();
    var item_type =  $('#item_type option:selected').val();

    var option = {
        where:{}
    }

    if (item_name != '') {
        option.where['item_name'] = item_name;
    }

    if (item_order != '') {
        option.where['item_order'] = item_order;
    }

    if (item_type != '') {
        option.where['item_type'] = item_type;
    }

    table.reload('supply_table', option);

}



var line = echarts.init(document.getElementById('line'));
var optionLine = {
    title : {
        text: '商品价格波动折线图',
        x: 'center',
        align: 'bottom'
    },
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        name: '月',
        boundaryGap: true,
        data: [1, 2, 3, 4, 5, 6]
        },
    yAxis: {
        type: 'value',
        name: '价格（元）'
    },
    series: [
        {
            name:'单价',
            type:'line',
            data: [0.47, 0.68, 1.3, 1.12, 0.44, 0.68]
        }
    ]
};
line.setOption(optionLine);

$(function(){
    $('#reset').attr('href', 'supplyManagement.html?supplier_id=' + getUrlParam('supplier_id'));
});