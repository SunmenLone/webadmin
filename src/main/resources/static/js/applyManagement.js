layui.use('element', function () {
    var element = layui.element;


});

var form;
layui.use('form', function () {
    form = layui.form;

    form.on('select(type)', function(data){

        if (data.value != '') {
            $.ajax({
                url: '../item/name/find',
                data: {
                    item_type: data.value
                },
                async: false,
                success: function(res) {
                    if (res.code == 0) {
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
        } else {
            $('#modal_item_name').empty();
            $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
        }
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

var item_data;
var apply_order;
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

            layer.open({
                title: '提示',
                content: '确认提交申请，提交后将不能修改？',
                btn: ['确认', '取消'],
                yes: function(index){

                    $.ajax({
                        url: '../purchase/apply/commit',
                        data: {
                            apply_order: data.apply_order
                        },
                        success: function(res) {
                            if (res.code == 0) {
                                layer.open({
                                    title:'提示',
                                    content: '提交成功'
                                })
                                table.reload('apply_table');
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


        } else if (layEvent === 'retrieve') {

            layer.open({
                title: '提示',
                content: '确认领取？',
                btn: ['确认', '取消'],
                yes: function(index){
                    $.ajax({
                        url: '../purchase/apply/accept',
                        data: {
                            apply_order: data.apply_order
                        },
                        success: function(res) {
                            if (res.code == 0) {
                                layer.open({
                                    title:'提示',
                                    content: '确认领取成功'
                                })
                                table.reload('apply_table');
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

        } else if (layEvent === 'detail') {
            if (data.apply_state == '未提交') {
                apply_order = data.apply_order;
                openEditModal(1, data.apply_order);
            }else{
                apply_order = data.apply_order;
                openEditModal(2, data.apply_order);
            }
        }

    });

    item_table = layui.table;

    item_table.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        item_data = obj.data; //获得当前行数据
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
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id == item_data.id) {
                            delItems.push(items[i]);
                            items.splice(i, 1);
                            break;
                        }
                    }
                    obj.del();
                    item_table.reload('item_table', {
                        data: items
                    });
                    layer.close(index);
                },
                btn2: function(index){
                    layer.close(index);
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

var openEditModal = function(type, apply_order) {

    if (type == 0) {

        $('#modal_title').html('新增申请');

        $('#btn_save').attr('href', 'javascript:save(0);');
        $('#btn_confirm').attr('href', 'javascript:commit(0);');

        $('#editmodal').removeAttr('hidden');

    } else if(type==1){

        $('#modal_title').html('编辑申请');

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
                      layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
                }

            }

        });
        $('#btn_save').attr('href', 'javascript:save(1);');
        $('#btn_confirm').attr('href', 'javascript:commit(1);');
        $('#editmodal').removeAttr('hidden');
    }else{
        $('#modal_title1').html('查看申请');
        $.ajax({
            url: '../purchase/apply/items/get',
            data: {
                apply_order: apply_order
            },
            success: function(res) {

                if (res.code == 0) {
                    items = res.data;
                    item_table.reload('item_table1', {
                        data: items
                    });
                } else {
                    layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
                }

            }

        });
        $('#editmodal1').removeAttr('hidden');
    }


}

var openEditItemModal = function(type) {

    if (type == 0) {

        $('#edit-modal_title').html('添加商品');

        $('#modal_item_type option').each(function(){
            $(this).removeAttr('selected');
        });
        $('#modal_item_type option[value=""]').attr('selected', true);

        form.render('select');

        $('#modal_quantity').val('');
        $('#modal_reason').val('');

        $('#edititem_confirm').attr('href', 'javascript:finishEditItem(0);');

    } else {

        $.ajax({
            url: '../item/name/find',
            data: {
                item_type: item_data.item_type
            },
            async: false,
            success: function(res) {
                if (item_data.item_type != '') {
                    $('#modal_item_name').empty();
                    $("#modal_item_name").append('<option value="">请选择商品名称</option>');
                    $.each(res.data, function (i) {
                        $("#modal_item_name").append('<option value="' + res.data[i].item_order + '" title="' + res.data[i].item_name + '">' + res.data[i].item_name + '</option>');
                    });
                    $('#modal_item_name option[title="' + item_data.item_name + '"]').attr('selected', true);
                } else {
                    $('#modal_item_name').empty();
                    $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
                }
            }
        });

        $('#modal_item_type option').each(function(){
            $(this).removeAttr('selected');
        });
        $('#modal_item_type option[title="' + item_data.item_type + '"]').attr('selected', true);

        form.render('select');

        $('#modal_item_type').attr('disabled', true);
        $('#modal_item_name').attr('disabled', true);

        form.render('select');


        $('#modal_quantity').val(item_data.item_count);
        $('#modal_reason').val(item_data.apply_reason);

        $('#edititem_confirm').attr('href', 'javascript:finishEditItem(1);');

    }

    $('#edititemmodal').removeAttr('hidden');

}

var items = [];
var finishEditItem = function(type) {

    if (type == 0) {

        var d = {};
        var id = 0;
        $.each(items, function(i){
            if(items[i].id > id) {
                id = items[i].id;
            }
        })
        d['id'] =  id + 1;
        d['item_type'] = $('#modal_item_type option:selected').val();
        d['item_order'] = $('#modal_item_name option:selected').val();
        d['item_name'] = $('#modal_item_name option:selected').html();
        d['item_count'] = $('#modal_quantity').val();
        d['apply_reason'] = $('#modal_reason').val();

        items.push(d);
        addItems.push(d);

    } else if (type == 1){

        $.each(items, function(i){
            if (items[i].id == item_data.id) {
                items[i].item_order = $('#modal_item_name option:selected').val();
                items[i].item_type = $('#modal_item_type option:selected').val();
                items[i].item_name = $('#modal_item_name option:selected').html();
                items[i].item_count = $('#modal_quantity').val();
                items[i].apply_reason = $('#modal_reason').val();
                editItems.push(items[i]);
            }
        });

    }

    item_table.reload('item_table', {
        data: items
    });

    closeEditItemModal();

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
                $("#modal_item_type").append('<option value="' + res.data[i] + '" title="' + res.data[i] + '">' + res.data[i] + '</option>');
            });
            $('#modal_item_name').empty();
            $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
        }
    })

});

var closeEditModal = function(){

    $('#editmodal').attr('hidden', true);
    $('#editmodal1').attr('hidden', true);
    items.splice(0, items.length);
    delItems.splice(0, delItems.length);
    editItems.splice(0, editItems.length);
    addItems.splice(0, addItems.length);
    item_table.reload('item_table', {
        data: items
    });
    item_table.reload('item_table1', {
        data: items
    });
}

var closeEditItemModal = function(){

    $('#edititemmodal').attr('hidden', true);

    $('#modal_item_type').removeAttr('disabled');
    $('#modal_item_name').removeAttr('disabled');

    $('#modal_item_name').empty();
    $("#modal_item_name").append('<option value="">请先选择商品类型</option>');
    form.render('select');

}

var save = function(type) {

    layer.open({
        title: '提示',
        content: '暂时保存将不会提交申请，确认保存？',
        btn: ['确认', '取消'],
        yes: function(index){

            if (type == 0) {

                addApply();

            } else {

                if (addItems.length > 0) {
                    insertItems();
                }

                if (editItems.length > 0) {
                    updateItems();
                }

                if (delItems.length > 0) {
                    deleteItems();
                }
            }

            closeEditModal();

            layer.open({
                title:'提示',
                content: '保存成功'
            })

        },
        btn2: function(index){
            layer.close(index);
        }
    });

}


var delItems = [];
var deleteItems = function(){
    $.ajax({
        type: 'post',
        dataType: 'json',
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-TYPE", "application/json");
        },
        url: '../purchase/apply/item/delete',
        data: JSON.stringify(delItems),
        success: function(res) {
            if (res.code == 0) {
                delItems.splice(0, delItems.length);
            } else {
                  layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
            }
        }
    })

}

var editItems = [];
var updateItems = function() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-TYPE", "application/json");
        },
        url: '../purchase/apply/item/edit',
        data: JSON.stringify(editItems),
        success: function(res) {
            if (res.code == 0) {
                editItems.splice(0, editItems.length);
            } else {
                  layer.open({                                    title:'提示',                                    content:'操作失败',                                })
            }
        }
    })
}

var addItems = [];
var insertItems = function() {

    $.each(addItems, function(i){
       addItems[i].apply_order = apply_order;
    });

    $.ajax({
        type: 'post',
        dataType: 'json',
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-TYPE", "application/json");
        },
        url: '../purchase/apply/item/add',
        data: JSON.stringify(addItems),
        success: function(res) {
            if (res.code == 0) {
            addItems.splice(0, addItems.length);
            } else {
                  layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
            }
        }
    });

}

var addApply = function() {

    var param = {
        apply_user_account: GetCookie('username'),
        apply_item: items
    };

    $.ajax({
        type: 'post',
        dataType: 'json',
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-TYPE", "application/json");
        },
        url: '../purchase/apply/add',
        data: JSON.stringify(param),
        success: function(res) {
            if (res.code == 0) {
                table.reload('apply_table');
                apply_order = res.apply_order;
            } else {
                  layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
            }
        }
    });

}

var commit = function(type) {

    layer.open({
        title: '提示',
        content: '确认提交申请，提交后将不能修改？',
        btn: ['确认', '取消'],
        yes: function(index){

            if (type == 0) {

                addApply();

            } else {

                if (addItems.length > 0) {
                    insertItems();
                }

                if (editItems.length > 0) {
                    updateItems();
                }

                if (delItems.length > 0) {
                    deleteItems();
                }

            }

            $.ajax({
                url: '../purchase/apply/commit',
                data: {
                    apply_order: apply_order
                },
                success: function(res) {
                    if (res.code == 0) {
                        closeEditModal();
                        layer.open({
                            title:'提示',
                            content: '提交成功'
                        });
                        table.reload('apply_table');
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


