layui.use('element', function () {
    var element = layui.element;


});

layui.use('form', function () {
    var form = layui.form;

});

layui.use('laydate', function(){
  var laydate = layui.laydate;

  //常规用法
  laydate.render({
    elem: '#bdate'
  });

  laydate.render({
      elem: '#edate'
    });

})

var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'supply_table',
        elem: '#supply_table',
        url: '',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'itemid', title: '商品编号', width: 160},
            {field: 'type', title: '商品类型', width: 160},
            {field: 'itemname', title: '商品名称', width: 160},
            {field: 'supplyid', title: '商品供应编号', width: 200},
            {toolbar: '#opt1', title: '详细信息', align: 'center', width: 100},
            {field: 'createtime', title: '添加时间', width: 160},
            {field: 'status', title: '状态', width: 120},
            {field: 'price', title: '当前单价', width: 100},
            {toolbar: '#opt2', title: '本年价格波动', align: 'center', width: 140},
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
