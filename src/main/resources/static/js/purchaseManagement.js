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

});

var layer;
layui.use('layer', function(){
   layer = layui.layer;
});
var item_table;

var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'purchase_table',
        elem: '#purchase_table',
        url: '../purchase/apply/findall?apply_state=审核通过,采购中,采购完毕,已领取',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'apply_order', title: '采购申请单号', width: 160},
            {field: 'apply_department', title: '申请部门', width: 160},
            {field: 'apply_user', title: '申请人姓名', width: 100},
            {field: 'purchase_complete_time', title: '采购完毕时间', width: 180},
            {field: 'purchase_item_accept_time', title: '已领取时间', width: 180},
            {field: 'apply_check_user', title: '审核人姓名', width: 100},
            {field: 'apply_state', title: '状态', width: 100},
            {toolbar: '#opt', title: '操作', align: 'center', width: 220},
        ]]
    });

    table.on('tool(purchase)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') {
            window.location.href='./purchaseDetail.html?apply_order=' + data.apply_order;
        } else if (layEvent === 'finish') {
            completePurchase(data);
        }else if(layEvent === 'detail-view'){
            apply_order=data.apply_order;
            openViewModel(apply_order);
        }

    });
    item_table = layui.table;
});
var openViewModel = function(apply_order) {
        $('#modal_title').html('供应信息查看');
        $.ajax({
            url: '../purchase/apply/items/get',
            data: {
                apply_order: apply_order
            },
            success: function(res) {
                if (res.code == 0) {
                    items = res.data;
                    item_table.reload('item_table', {
                        data: items
                    });
                } else {
                    layer.open({
                        title:'提示',
                        content:'操作失败',
                    });
                }
            }
        });
        $('#view_model').removeAttr('hidden');
}

var closeViewModel = function(){

    $('#view_model').attr('hidden', true);

}

var search = function() {

    var apply_order = $('#apply_order').val();
    var bdate = $('#bdate').val();
    var edate = $('#edate').val();
    var apply_state = $('#apply_state option:selected').val();
    var apply_department = $('#apply_department option:selected').val();
    var apply_user = $('#apply_user').val();

    var option = {
        where: {}
    }

    if (apply_order != '') {
        option.where['apply_order'] = apply_order;
    }

    if (bdate != '' && edate != '') {
        option.where['apply_date'] = bdate + ',' + edate;
    }

    if (apply_state != '') {
        option.where['apply_state'] = apply_state;
        option['url'] = '../purchase/apply/findall';
    } else {
        option['url'] = '../purchase/apply/findall?apply_state=审核通过,采购中,采购完毕,已领取';
    }

    if (apply_department != '') {
        option.where['apply_department'] = apply_department;
    }

    if (apply_user != '') {
        option.where['apply_user'] = apply_user;
    }

    table.reload('purchase_table', option);

}
var completePurchase = function(data) {

    layer.open({
        title: '提示',
        content: '确认采购完毕？',
        btn: ['确认', '取消'],
        yes: function(index){

            $.ajax({
                url: '../purchase/apply/complete',
                data: {
                    apply_order: data.apply_order
                },
                success: function(res) {
                    if (res.code == 0) {
                        table.reload('purchase_table', {});
                    } else {
                          layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
                    }
                    layer.close(index);
                }
            });

        },
        btn2: function(index){
            layer.close(index);
        }
    });



}

