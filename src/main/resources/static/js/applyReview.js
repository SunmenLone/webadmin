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
        id: 'apply_table',
        elem: '#apply_table',
        url: '',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'applyid', title: '采购申请单号', width: 160},
            {field: 'department', title: '申请部门', width: 160},
            {field: 'applier', title: '申请人姓名', width: 120},
            {field: 'applytime', title: '提交时间', width: 180},
            {field: 'reviewtime', title: '审核时间', width: 180},
            {field: 'reviewer', title: '审核人姓名', width: 120},
            {field: 'status', title: '状态', width: 100},
            {toolbar: '#opt', title: '操作', align: 'center', width: 100},
        ]]
    });

    table.on('tool(apply)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'review') {

        }

    });

});

