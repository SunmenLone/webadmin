layui.use('element', function () {
    var element = layui.element;


});

var form;
layui.use('form', function () {
    form = layui.form;

});

var layer;
layui.use('layer', function() {
    layer = layui.layer;
});

var data;
var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'item_table',
        elem: '#item_table',
        url: '../item/find',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'item_order', title: '商品ID', width: 160},
            {field: 'item_type', title: '商品类型', width: 160},
            {field: 'item_name', title: '商品名称', width: 160},
            {field: 'item_last_edit', title: '最后修改时间', width: 200},
            {field: 'item_status', title: '状态', width: 120},
            {toolbar: '#opt', title: '操作', align: 'center', width: 100},
        ]]
    });

    table.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'edit') {
            data = obj.data;
            openEditModal(1);
        }

    });

});

$.ajax({
    url: '../item/type/find',
    data: {},
    async: false,
    success: function(res) {
        $('#item_type').empty();
        $("#item_type").append('<option value="">请选择商品类型</option>');
        $.each(res.data, function(i){
            $("#item_type").append('<option value="' + res.data[i] + '">' + res.data[i] + '</option>');
        });
    }
})

var search = function() {

    var item_name = $('input[name="item_name"]').val();
    var item_order = $('input[name="item_order"]').val();
    var item_type = $('#item_type option:selected').val();

    var option = {
        where:{}
    }

    if (item_name != '') {
        option.where["item_name"] = item_name;
    }

    if (item_order != '') {
        option.where["item_order"] = item_order;
    }

    if (item_type != '') {
        option.where["item_type"] = item_type;
    }

    table.reload('item_table', option);


}

var openEditModal = function(type) {

    if (type == 0) {

        $('#modal_title').html('新增商品');

        $('input[name="modal_name"]').val('');
        $('#modal_status option').each(function(){
            $(this).removeAttr('selected');
        });
        $('#modal_status option[value="0"]').attr('selected', true);

        form.render('select');

        $('input[name="modal_type"]').val('');

        $('#edit_confirm').attr('href', 'javascript:addOrUpdateItem(0);')

        $('#editmodal').removeAttr('hidden');


    } else {

        $('#modal_title').html('修改商品');

        $('input[name="modal_name"]').val(data.item_name);
        $('#modal_status option').each(function(){
            $(this).removeAttr('selected');
        });
        $('#modal_status option[text="' + data.item_status + '"]').attr('selected', true);
        form.render('select');

        $('input[name="modal_type"]').val(data.item_type);

        $('#edit_confirm').attr('href', 'javascript:addOrUpdateItem(1);')

        $('#editmodal').removeAttr('hidden');

    }

}

var addOrUpdateItem = function(type) {

    if(type == 0) {

        layer.open({
            title: '提示',
            content: '确认添加商品？',
            btn: ['确认', '取消'],
            yes: function(){

                $.ajax({
                    url: '../item/add',
                    data: {
                        item_name: $('input[name="modal_name"]').val(),
                        item_status: $('#modal_status option:selected').val(),
                        item_type: $('input[name="modal_type"]').val()
                    },
                    success: function(res){
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('item_table', {});
                            layer.open({
                                title: '提示'
                                ,content: '添加商品成功'
                            });
                        } else {
                              layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
                        }
                    }
                });
            },
            btn2: function(){
                layer.closeAll();
            }
        });

    } else {

        layer.open({
            title: '提示',
            content: '确认修改商品？',
            btn: ['确认', '取消'],
            yes: function(){

                $.ajax({
                    url: '../item/edit',
                    data: {
                        item_order: data.item_order,
                        item_name: $('input[name="modal_name"]').val(),
                        item_status: $('#modal_status option:selected').val(),
                        item_type: $('input[name="modal_type"]').val()
                    },
                    success: function(res){
                        if (res.code == 0) {
                            $('#editmodal').attr('hidden', true);
                            table.reload('item_table', {});
                            layer.open({
                                title: '提示'
                                ,content: '修改商品成功'
                            });
                        } else {
                              layer.open({                                    title:'提示',                                    content:'操作失败',                                })(res.errormessage);
                        }
                    }
                });
            },
            btn2: function(){
                layer.closeAll();
            }
        });

    }

}

layui.use('upload', function() {
    var upload = layui.upload;

    upload.render({
        elem: '#upload'
        ,url: '../item/excel/import'
        ,accept: 'file'
        ,ext: 'xls|xlsx'
        ,done: function(res){
            if (res.code == 0) {
                table.reload('item_table', {})
                layer.open({
                    title: '提示',
                    content: '导入商品成功',

                });
            } else {
                layer.open({
                    title: '提示',
                    content: '部分商品导入失败，请稍后重试'
                });
            }
        }
    });
});

