layui.use('element', function () {
    var element = layui.element;


});

var form;
layui.use('form', function () {
    form = layui.form;

    form.on('select(type)', function(data){

        $.ajax({
            url: '../item/name/find',
            data: {
                item_type: data.value
            },
            async: false,
            success: function(res) {
                if (data.value != '') {
                    $('#modal_item_name').empty();
                    $("#modal_item_name").append('<option value="">请选择商品名称</option>');
                    $.each(res.data, function (i) {
                        $("#modal_item_name").append('<option value="' + res.data[i].item_order + '">' + res.data[i].item_name + '</option>');
                    });
                } else {
                    $('#modal_item_name').empty();
                    $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
                }
            }
        });
        form.render('select');
    });

});


var layer;
layui.use('layer', function(){
    layer = layui.layer;
});

var table;
var data;
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
        data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') {
            openEditModal(2);
        } else if (layEvent === 'edit') {
            openEditModal(1);
        } else if (layEvent === 'line') {
            openLine(data.item_supid);
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

var openEditModal = function(type) {

    if (type == 0 ) {

        $('#edit-modal_title').html('新增供应商品');

        $.ajax({
            url: '../item/type/find',
            data: {},
            async: false,
            success: function(res) {
                $('#modal_item_type').removeAttr('disabled');
                $('#modal_item_type').removeClass('setpwd-input');
                $('#modal_item_type').empty();
                $("#modal_item_type").append('<option value="">请选择商品类型</option>');
                $.each(res.data, function(i){
                    $("#modal_item_type").append('<option value="' + res.data[i] + '">' + res.data[i] + '</option>');
                });
                $('#modal_item_name').removeAttr('disabled');
                $('#modal_item_name').removeClass('setpwd-input');
                $('#modal_item_name').empty();
                $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
                form.render('select');
            }
        })

        $('input[name="modal_item_brand"]').val('');
        $('input[name="modal_item_brand"]').removeAttr('disabled');
        $('input[name="modal_item_brand"]').removeClass('setpwd-input');

        $('input[name="modal_item_spec"]').val('');
        $('input[name="modal_item_spec"]').removeAttr('disabled');
        $('input[name="modal_item_spec"]').removeClass('setpwd-input');

        $('input[name="modal_item_address"]').val('');
        $('input[name="modal_item_address"]').removeAttr('disabled');
        $('input[name="modal_item_address"]').removeClass('setpwd-input');

        $('input[name="modal_item_unit"]').val('');
        $('input[name="modal_item_unit"]').removeAttr('disabled');
        $('input[name="modal_item_unit"]').removeClass('setpwd-input');

        $('input:radio[value="1"]').prop("checked", "checked");
        $('input:radio').each(function(){
            $(this).removeAttr('disabled');
        })
        form.render('radio');

        $('input[name="modal_item_price"]').val('');
        $('input[name="modal_item_price"]').removeAttr('disabled');
        $('input[name="modal_item_price"]').removeClass('setpwd-input');

        $('#edit_cancel').removeAttr('hidden');
        $('#edit_confirm').attr('href', 'javascript:addItem();');

    } else if(type == 1){

        $('#edit-modal_title').html('编辑供应商品（只能改状态和价格）');

        $('#modal_item_type').attr('disabled', true);
        $('#modal_item_type').empty();
        $("#modal_item_type").append('<option value="' + data.item_type + '">' + data.item_type + '</option>');

        $('#modal_item_name').attr('disabled', true);
        $('#modal_item_name').empty();
        $("#modal_item_name").append('<option value="' + data.item_name + '">' + data.item_name + '</option>');

        form.render('select');

        $('input[name="modal_item_brand"]').val(data.item_brand);
        $('input[name="modal_item_brand"]').attr('disabled', true);
        $('input[name="modal_item_brand"]').addClass('setpwd-input');


        $('input[name="modal_item_spec"]').val(data.item_spec);
        $('input[name="modal_item_spec"]').attr('disabled', true);
        $('input[name="modal_item_spec"]').addClass('setpwd-input');


        $('input[name="modal_item_address"]').val(data.item_produce_address);
        $('input[name="modal_item_address"]').attr('disabled', true);
        $('input[name="modal_item_address"]').addClass('setpwd-input');

        var s = data.present_state == '供应中' ? 1 : 0;
        $('input:radio[value="' + s + '"]').prop("checked", "checked");
        $('input:radio').each(function(){
            $(this).removeAttr('disabled');
        })
        form.render('radio');

        $('input[name="modal_item_unit"]').val(data.item_count_unit);
        $('input[name="modal_item_unit"]').attr('disabled', true);
        $('input[name="modal_item_unit"]').addClass('setpwd-input');

        $('input[name="modal_item_price"]').val(data.item_price);
        $('input[name="modal_item_price"]').removeAttr('disabled');
        $('input[name="modal_item_price"]').removeClass('setpwd-input');

        $('#edit_cancel').removeAttr('hidden');
        $('#edit_confirm').attr('href', 'javascript:updateItem();');

    } else {

        $('#edit-modal_title').html('查看供应商品');

        $('#modal_item_type').attr('disabled', true);
        $('#modal_item_type').empty();
        $("#modal_item_type").append('<option value="' + data.item_type + '">' + data.item_type + '</option>');

        $('#modal_item_name').attr('disabled', true);
        $('#modal_item_name').empty();
        $("#modal_item_name").append('<option value="' + data.item_name + '">' + data.item_name + '</option>');

        form.render('select');

        $('input[name="modal_item_brand"]').val(data.item_brand);
        $('input[name="modal_item_brand"]').attr('disabled', true);
        $('input[name="modal_item_brand"]').addClass('setpwd-input');


        $('input[name="modal_item_spec"]').val(data.item_spec);
        $('input[name="modal_item_spec"]').attr('disabled', true);
        $('input[name="modal_item_spec"]').addClass('setpwd-input');


        $('input[name="modal_item_address"]').val(data.item_produce_address);
        $('input[name="modal_item_address"]').attr('disabled', true);
        $('input[name="modal_item_address"]').addClass('setpwd-input');

        var s = data.present_state == '供应中' ? 1 : 0;
        $('input:radio[value="' + s + '"]').prop("checked", "checked");
        $('input:radio').attr('disabled', true);
        form.render('radio');

        $('input[name="modal_item_unit"]').val(data.item_count_unit);
        $('input[name="modal_item_unit"]').attr('disabled', true);
        $('input[name="modal_item_unit"]').addClass('setpwd-input');

        $('input[name="modal_item_price"]').val(data.item_price);
        $('input[name="modal_item_price"]').attr('disabled', true);
        $('input[name="modal_item_price"]').addClass('setpwd-input');

        $('#edit_cancel').attr('hidden', true);
        $('#edit_confirm').attr('href', 'javascript:$("#editmodal").attr("hidden", true);');
    }

    $('#editmodal').removeAttr('hidden');

}

var addItem = function() {

    layer.open({
        title: '提示',
        content: '确认添加供应商品？',
        btn: ['确认', '取消'],
        yes: function(index){

            $.ajax({
                url: '../supplier/item/add',
                data: {
                    sup_id: getUrlParam('supplier_id'),
                    item_type: $('#modal_item_type option:selected').val(),
                    item_name: $('#modal_item_name option:selected').html(),
                    item_order: $('#modal_item_name option:selected').val(),
                    item_brand: $('input[name="modal_item_brand"]').val(),
                    item_spec: $('input[name="modal_item_spec"]').val(),
                    item_produce_address: $('input[name="modal_item_address"]').val(),
                    item_count_unit: $('input[name="modal_item_unit"]').val(),
                    present_state: $('input:radio[name="modal_item_status"]:checked').val(),
                    item_price: $('input[name="modal_item_price"]').val()
                },
                success: function(res){
                    layer.close(index);
                    if (res.code == 0) {
                        $('#editmodal').attr('hidden', true);
                        table.reload('supply_table', {});
                        layer.open({
                            title: '提示'
                            ,content: '添加供应商品成功'
                        });
                    } else {
                          layer.open({
                              title:'提示',
                              content:'操作失败'
                          });
                    }
                }
            });
        },
        btn2: function(index){
            layer.close(index);
        }
    });

};

var updateItem = function() {

    layer.open({
        title: '提示',
        content: '确认修改供应商品？',
        btn: ['确认', '取消'],
        yes: function(index){

            $.ajax({
                url: '../supplier/item/update',
                data: {
                    item_supid: data.item_supid,
                    present_state: $('input:radio[name="modal_item_status"]:checked').val(),
                    item_price: $('input[name="modal_item_price"]').val()
                },
                success: function(res){
                    layer.close(index);
                    if (res.code == 0) {
                        $('#editmodal').attr('hidden', true);
                        table.reload('supply_table', {});
                        layer.open({
                            title: '提示',
                            content: '修改供应商品成功'
                        });
                    } else {
                          layer.open({
                              title:'提示',
                              content:'操作失败'
                          });
                    }
                }
            });
        },
        btn2: function(index){
            layer.close(index);
        }
    });

}

var line = echarts.init(document.getElementById('line'));
var optionLine = {
    title : {
        text: '',
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
        boundaryGap: true,
        data: []
    },
    yAxis: {
        type: 'value',
        name: '价格（元）'
    },
    series: [
        {
            name:'单价',
            type:'line',
            data: []
        }
    ]
};

var openLine = function(item_supid) {

    $.ajax({
        url: '../supplier/item/price/find',
        data:{
            sup_item_id: item_supid
        },
        async: false,
        success: function(res){
            if (res.code == 0) {
                var price = [];
                var time = [];
                $.each(res.data, function(i){
                   price.push(res.data[i].price);
                   var t = res.data[i].time;
                   t = t.substring(0, t.length - 11);
                   time.push(t);
                });
                optionLine.title.text = '商品' + data.item_supid + '价格波动折线图';
                optionLine.xAxis.data = time;
                optionLine.series[0].data = price;
                line.setOption(optionLine);
            } else {
                  layer.open({
                      title:'提示',
                      content:'操作失败'
                  });
            }
        }

    });

    $('#linemodal').removeAttr('hidden');

}

$(function(){
    $('#reset').attr('href', 'supplyManagement.html?supplier_id=' + getUrlParam('supplier_id'));
});

layui.use('upload', function() {
    var upload = layui.upload;

    upload.render({
        elem: '#upload'
        ,url: '../supplier/item/excel/import?sup_id=' + getUrlParam('supplier_id')
        ,accept: 'file'
        ,ext: 'xls|xlsx'
        ,done: function(res){
            if (res.code == 0) {
                table.reload('supply_table', {})
                layer.open({
                    title: '提示',
                    content: '导入供应商品成功'
                });
            } else {
                layer.open({
                    title: '提示',
                    content: '导入失败'
                });
            }
        }
    });
});