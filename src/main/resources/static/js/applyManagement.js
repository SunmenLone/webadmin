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

var data;
var table;
var item_table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'apply_table',
        elem: '#apply_table',
        url: '../purchase/apply/findbyuser?apply_user_account=' + GetCookie('username'),
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'apply_order', title: '采购申请单号', width: 160, event: 'detail', style: 'color: #01AAED;'},
            {field: 'apply_department', title: '申请部门', width: 160},
            {field: 'apply_user', title: '申请人姓名', width: 120},
            {field: 'apply_date', title: '申请时间', width: 180},
            {field: 'apply_state', title: '状态', width: 100},
            {field: 'deny_reason', title: '审核不通过理由', width: 160},
            {toolbar: '#opt', title: '操作', align: 'center', width: 100}
        ]]
    });

    table.on('tool(apply)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'apply') {

        } else if (layEvent === 'retrieve') {

        } else if (layEvent === 'detail') {
            if (data.apply_state == '未提交') {
                openEditModal(1);
            }
        }

    });

    item_table = layui.table;

    item_table.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'edit') {
            openEditItemModal(1);
        } else if (layEvent === 'delete') {
            layer.open({
                title: '提示',
                content: '确认删除商品？',
                btn: ['确认', '取消'],
                yes: function(index){
                    $.each(items, function(i){
                        if (items[i].id == data.id) {
                            items.splice(i, 1);
                        }
                    });
                    obj.del();
                    item_table.reload('item_table', {
                        data: items
                    });
                    layer.close(index);
                },
                btn2: function(){
                    layer.closeAll();
                }
            });
        }

    });

});

var search = function() {

    var apply_order = $('input[name="apply_order"]').val();
    var bdate = $('#bdate').val();
    var edate = $('#edate').val();
    var apply_state = $('#apply_state option:selected').val();

    var option = {
        where: {}
    }

    if (apply_order != '') {
        option.where['apply_order'] = apply_order;
    }

    if (bdate != '' && edate != '') {
        option.where['apply_date'] = bdate+','+edate;
    }

    if (apply_state != '') {
        option.where['apply_state'] = apply_state;
    }

    table.reload('apply_table', option);

}

var openEditModal = function(type) {

    if (type == 0) {

        $('#modal_title').html('新增申请');

    } else {

        $('#modal_title').html('编辑申请');

    }

    $('#editmodal').removeAttr('hidden');

}

var openEditItemModal = function(type) {

    if (type == 0) {

        $('#edit-modal_title').html('添加商品');

        $('#modal_item_type option').each(function(){
            $(this).removeAttr('selected');
        });
        $('#modal_item_type option[value=""]').attr('selected', true);
        $('#modal_item_name').empty();
        $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
        form.render('select');

        $('#modal_quantity').val('');
        $('#modal_reason').val('');

        $('#edititem_confirm').attr('href', 'javascript:finishEditItem(0);');

    } else {

        $('#modal_item_type option').each(function(){
            $(this).removeAttr('selected');
        });
        $('#modal_item_name option[value="' + data.item_type + '"]').attr('selected', true);

        $.ajax({
            url: '../item/name/find',
            data: {
                item_type: data.item_type
            },
            async: false,
            success: function(res) {
                if (data.value != '') {
                    $('#modal_item_name').empty();
                    $("#modal_item_name").append('<option value="">请选择商品名称</option>');
                    $.each(res.data, function (i) {
                        $("#modal_item_name").append('<option value="' + res.data[i].item_order + '" title="' + res.data[i].item_name + '">' + res.data[i].item_name + '</option>');
                    });
                    $('#modal_item_name option[title="' + data.item_type + '"]').attr('selected', true);
                } else {
                    $('#modal_item_name').empty();
                    $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
                }
            }
        });

        $('#modal_quantity').val(data.item_count);
        $('#modal_reason').val(data.apply_reason);

        $('#edititem_confirm').attr('href', 'javascript:finishEditItem(1);');

    }

    $('#edititemmodal').removeAttr('hidden');

}

var items = [];
var finishEditItem = function(type) {

    if (type == 0) {

        var d = {};
        d['id'] =  items.length + 1;
        d['item_type'] = $('#modal_item_type option:selected').val();
        d['item_order'] = $('#modal_item_name option:selected').val();
        d['item_name'] = $('#modal_item_name option:selected').html();
        d['item_count'] = $('#modal_quantity').val();
        d['apply_reason'] = $('#modal_reason').val();

        items.push(d);

        item_table.reload('item_table', {
            data: items
        });

    } else if (type == 1){

        $.each(items, function(i){
            if (items[i].id == data.id) {
                items[i].item_order = $('#modal_item_name option:selected').val();
                items[i].item_type = $('#modal_item_type option:selected').val();
                items[i].item_name = $('#modal_item_name option:selected').html();
                items[i].item_count = $('#modal_quantity').val();
                items[i].apply_reason = $('#modal_reason').val();
            }
        });

        item_table.reload('item_table', {
            data: items
        });

    }

    $('#edititemmodal').attr('hidden', true);

}

$(function(){

    $.ajax({
        url: '../item/type/find',
        data: {},
        async: false,
        success: function(res) {
            $('#modal_item_type').empty();
            $("#modal_item_type").append('<option value="">请选择商品类型</option>');
            $.each(res.data, function(i){
                $("#modal_item_type").append('<option value="' + res.data[i] + '">' + res.data[i] + '</option>');
            });
            $('#modal_item_name').empty();
            $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
        }
    })

});
