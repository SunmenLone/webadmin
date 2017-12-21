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

var data;
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
        data = obj.data; //获得当前行数据
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


    $('input:radio[name="max"][value="' + data.price_set_high + '"]').prop('checked', true);

    $('input:radio[name="min"][value="' + data.price_set_low + '"]').prop('checked', true);

    $('input:radio[name="sq"][value="' + data.deviation_check + '"]').prop('checked', true);

    if ( data.deviation_check == 1 ) {

        $('#sqv1').removeAttr('disabled');
        $('#sqv2').removeAttr('disabled');

    } else {

        $('#sqv1').attr('disabled', true);
        $('#sqv2').attr('disabled', true);

    }

    if ( data.deviation_price_warn != -10000) {
        $('#sqv1').val(data.deviation_price_warn);
    }

    if ( data.deviation_price_hide != -10000 ) {
        $('#sqv2').val(data.deviation_price_hide);
    }

    if ( data.secure_price_range != null && data.secure_price_range != '') {

        $('input:radio[name="p"][value="1"]').prop('checked', true);
        $('#lowprice').val(data.secure_price_range.split(',')[0]);
        $('#highprice').val(data.secure_price_range.split(',')[1]);

        $('#lowprice').removeAttr('disabled');
        $('#highprice').removeAttr('disabled');

    } else {
        $('input:radio[name="p"][value="0"]').prop('checked', true);

        $('#lowprice').attr('disabled', true);
        $('#highprice').attr('disabled', true);

    }

    form.render('radio');

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

};

var updateRisk = function(status) {

    var price_set_high = $('input:radio[name="max"]:checked').val();

    var price_set_low = $('input:radio[name="min"]:checked').val();

    var deviation_check = $('input:radio[name="sq"]:checked').val();

    var secure_check = $('input:radio[name="p"]:checked').val();

    if ( price_set_high == undefined ) {
        layer.open({
            title: '提示',
            content: '请选择是否开启最高价提示'
        });
        return;
    }

    if ( price_set_low == undefined ) {
        layer.open({
            title: '提示',
            content: '请选择是否开启最低价提示'
        });
        return;
    }

    var param = {
        price_set_high: price_set_high,
        price_set_low: price_set_low
    };

    if ( deviation_check == undefined ) {
        layer.open({
            title: '提示',
            content: '请选择是否开启标准差检验'
        });
        return;
    }

    if ( deviation_check == 1 ) {

        var sqv1 = $('#sqv1').val();
        var sqv2 = $('#sqv2').val();

        if (sqv1 == '') {
            layer.open({
                title: '提示',
                content: '请填写预警标准差'
            });
            return;
        }

        if (sqv2 == '') {
            layer.open({
                title: '提示',
                content: '请填写隐藏标准差'
            });
            return;
        }

        param['deviation_check'] = 1;
        param['deviation_price_warn'] = sqv1;
        param['deviation_price_hide'] = sqv2;

    } else {

        param['deviation_check'] = 0;

    }

    if ( secure_check == undefined ) {
        layer.open({
            title: '提示',
            content: '请选择是否设置安全单价范围'
        });
        return;
    }

    if ( secure_check == 1 ) {

        var high_price = $('#highprice').val();
        var low_price = $('#lowprice').val();

        if ( high_price == '' ) {
            layer.open({
                title: '提示',
                content: '请填写高价'
            });
            return;
        }

        if ( low_price == '' ) {
            layer.open({
                title: '提示',
                content: '请填写低价'
            });
            return;
        }

        param['secure_price_range'] = low_price + ',' + high_price;

    } else {

        param['secure_price_range'] = '';

    }

    param['status'] = status;
    param['item_order'] = data.item_order;

    var content1 = status == 0 ? '暂存将不会启用风险模型，确认暂存？' : '提交将直接启用风险模型，确认提交？';

    var content2 = status == 0 ? '保存成功' : '提交成功';

    layer.open({
        title: '提示',
        content: content1,
        btn: ['确认', '取消'],
        yes: function(index){
            $.ajax({
                url: '../risk/edit',
                data: param,
                async: false,
                success: function(res) {
                    if (res.code == 0) {
                        layer.open({
                            title: '提示',
                            content: content2
                        });
                        table.reload('risk_table', {});
                        closeEditModal();
                    } else {
                        layer.open({
                            title:'提示',
                            content:'操作失败'
                        });
                    }
                }
            });
            layer.close(index);
        },
        btn2: function(index){
            layer.close(index);
        }
    });

};

$(function(){
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
});
