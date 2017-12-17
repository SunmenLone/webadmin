layui.use('element', function(){
    var element = layui.element;

});

var form;
layui.use('form', function(){
    form = layui.form;

    form.on('radio(p)', function(data){
        if (data.value == 1) {

            $('#lowprice').removeAttr('disabled');
            $('#highprice').removeAttr('disabled');

        } else {

            $('#lowprice').val('');
            $('#highprice').val('');

            $('#lowprice').attr('disabled', true);
            $('#highprice').attr('disabled', true);

        }
    });

    form.on('radio(sq)', function(data){
        if (data.value == 1) {

            $('#sqv1').removeAttr('disabled');
            $('#warm_text').removeAttr('disabled');
            $('#sqv2').removeAttr('disabled');


        } else {

            $('#sqv1').val('');
            $('#warm_text').val('');
            $('#sqv2').val('');

            $('#sqv1').attr('disabled', true);
            $('#warm_text').attr('disabled', true);
            $('#sqv2').attr('disabled', true);

        }
    });

});

var table;
var info_table;
layui.use('table', function(){
    table = layui.table;
    //执行渲染
    table.render({
        id: 'risk_table',
        elem: '#risk_table',
        url:  '../risk/find',
        page: true,
        even: true,
        cols: [[{ field: 'id', title: '序号', width: 80 },
            { field: 'item_order', title: '商品ID', width: 140 },
            { field: 'item_type', title: '商品类型', width: 140 },
            { field: 'item_name', title: '商品名称', width: 160 },
            { field: 'last_edit_time', title: '上次修改时间', width: 180 },
            { toolbar: '#status', title: '状态', width: 100 },
            { toolbar: '#opt', title: '设置参数', align:'center', width: 100 },
        ]]
    });

    table.on('tool(risk)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'edit'){
            openEditModal(data);
        }

    });

    info_table = layui.table;

});

var search = function() {

    var item_name = $('#item_name').val();
    var item_order = $('#item_order').val();
    var item_type = $('#item_type option:selected').val();

    var option = {
        where: {}
    };

    if (item_name != '') {
        option.where['item_name'] = item_name;
    }

    if (item_order != '') {
        option.where['item_order'] = item_order;
    }

    if (item_type != '') {
        option.where['item_type'] = item_type;
    }

    table.reload('risk_table', option);

}

var openEditModal = function(data) {

    var infos = [];
    var info = {
        item_order: data.item_order,
        item_name: data.item_name,
        item_type: data.item_type
    }
    infos.push(info);

    info_table.reload('item_table', {
        data: infos
    })





    $('#editmodal').removeAttr('hidden');
}

var closeEditModal = function() {

    $('#editmodal').attr('hidden', true);

    $('#sqv1').val('');
    $('#warm_text').val('');
    $('#sqv2').val('');

    $('#sqv1').attr('disabled', true);
    $('#warm_text').attr('disabled', true);
    $('#sqv2').attr('disabled', true);

    $('#lowprice').val('');
    $('#highprice').val('');

    $('#lowprice').attr('disabled', true);
    $('#highprice').attr('disabled', true);

    $('input:radio[name="max"]').each(function(){
        $(this).prop('checked', false);
    });

    $('input:radio[name="min"]').each(function(){
        $(this).prop('checked', false);
    });

    $('input:radio[name="sq"]').each(function(){
        $(this).prop('checked', false);
    });

    $('input:radio[name="p"]').each(function(){
        $(this).prop('checked', false);
    });

    form.render('radio');

}
