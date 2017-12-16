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
      elem: '#bdate',
      type: 'datetime'
  });

  laydate.render({
      elem: '#edate',
      type: 'datetime'
    });

})

var table;
var info_table;
var item_table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'apply_table',
        elem: '#apply_table',
        url: '../purchase/apply/findall',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'apply_order', title: '采购申请单号', width: 160},
            {field: 'apply_department', title: '申请部门', width: 160},
            {field: 'apply_user', title: '申请人姓名', width: 120},
            {field: 'apply_date', title: '提交时间', width: 180},
            {field: 'apply_check_date', title: '审核时间', width: 180},
            {field: 'apply_check_user', title: '审核人姓名', width: 120},
            {field: 'apply_state', title: '状态', width: 100},
            {toolbar: '#opt', title: '操作', align: 'center', width: 100},
        ]]
    });

    table.on('tool(apply)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'review') {
            openModal(data);
        }

    });

    info_table = layui.table;

    item_table = layui.table;

});

var search = function() {

    var apply_order = $('#apply_order').val();

    var bdate = $('#bdate').val();

    var edate = $('#edate').val();

    var apply_state = $('#apply_state option:selected').val();

    var apply_department = $('#apply_department option:selected').val();

    var apply_user = $('#apply_user').val();

    var option = {
        where: {}
    };

    if (apply_order != '') {
        option.where['apply_order'] = apply_order;
    }

    if (bdate != '' && edate != '') {
        option.where['apply_date'] = bdate + ',' + edate;
    }

    if (apply_state != '') {
        option.where['apply_state'] = apply_state;
    }

    if (apply_department != '') {
        option.where['apply_department'] = apply_department;
    }

    if (apply_user != '') {
        option.where['apply_user'] = apply_user;
    }

    table.reload('apply_table', option);

}

var openModal = function(data) {

    var info = [];
    info.push(data);

    info_table.reload('info_table', {
        data : info
    });

    $.ajax({
        url: '../purchase/apply/items/get',
        async: false,
        data: {
            apply_order: data.apply_order
        },
        success: function(res) {
            if (res.code == 0) {
                var items = res.data;
                item_table.reload('item_table', {
                    data: items
                })
            } else {
                console.log(res.errormessage);
            }
        }
    });

    $('#reviewmodal').removeAttr('hidden');

}

