layui.use('element', function () {
    var element = layui.element;

});

layui.use('form', function () {
    var form = layui.form;

    form.on('select(department)', function(data){
        if (data.value == '') {
            $('input[name="row"]').each(function(){
                $(this).prop('checked', true);
            });
        } else {
            $('input[name="row"]').each(function(){
                $(this).prop('checked', false);
            });
            $('input[value="' + data.value + '"]').prop('checked', true);
        }
       form.render('checkbox');
    });

    form.on('checkbox(dept)', function(data){
       $('#department option').each(function(){
          $(this).removeAttr('selected');
       });

       $('#department option[value=""]').attr('selected', true);
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

var table;
layui.use('table', function(){
   table = layui.table;

   table.render({
       id: 'statistic_table',
       elem: '#statistic_table',
       even: true,
       cols: [[{field: 'row_name', title: '申请部门', width: 180},
           {field: 'column_fund_onway', title: '在途物资金额', width: 160},
           {field: 'column_fund_accept', title: '领取物资金额', width: 160}
       ]]
   });
});

$(function(){

    $.ajax({
        url: '../item/order/find',
        data:{},
        async: false,
        success: function(res) {
            if(res.code == 0) {
                $('#item_order').empty();
                $('#item_order').append('<option value="">请选择</option>');
                $.each(res.data, function(i){
                    $('#item_order').append('<option value="'+ res.data[i].item_order +'">' + res.data[i].item_name + '</option>');
                });
            } else {
                console.log(res.errormessage);
            }
        }
    })

});

var generateTable = function(){

    $('#table_section').attr('hidden', true);

    var onway = $('input[name="col"][value="onway"]').is(":checked");
    var accept = $('input[name="col"][value="accept"]').is(":checked");

    if ( !onway && !accept ) {
        layer.open({
            title: '提示',
            content: '必须定义列'
        });
        return;
    }

    var param = {};

    param['statistic_fund_onway'] = onway ? 1 : 0;

    param['statistic_fund_accept'] = accept ? 1 : 0;

    var d = [];
    $('input[name="row"]:checked').each(function(){
        d.push($(this).val());
    });

    if ( $('#department option:selected').val() != '' ) {
        param['department_name'] = $('#department option:selected').val();
    } else if (d.length == 13 || d.length == 0) {
        param['department'] = '使用部门';
    } else{
        var department = '';
        for (var i = 0; i < d.length; i++) {
            department += d[i];
            if (i != d.length - 1) {
                department += ',';
            }
        }
        param['department'] = department;
    }

    var bdate = $('#bdate').val();
    var edate = $('#edate').val();

    if ( bdate != '' && edate != '' ){
        param['statistic_time'] = bdate + ',' + edate;
    }

    var item_order = $('#item_order option:selected').val();

    if ( item_order != '' ) {
        param['item_order'] = item_order;
    }

    $.ajax({
        url: '../statistic/get',
        data: param,
        success: function(res) {
            if (res.code == 0) {

                if (item_order != '') {
                    $('#item_name').html($('#item_order option:selected').html());
                    $('#name_section').css('display', 'inline-block');
                } else {
                    $('#item_name').html('全部商品');
                    $('#name_section').css('display', 'inline-block');
                }

                if (bdate != '' && edate != '') {
                    $('#duration').html(bdate + ' - ' + edate);
                    $('#date_section').css('display', 'inline-block');
                } else {
                    $('#duration').html('所有时间');
                    $('#date_section').css('display', 'inline-block');
                }

                var option = {};
                if ( onway && !accept ) {
                    option['cols'] = [[{field: 'row_name', title: '申请部门', width: 180},
                        {field: 'column_fund_onway', title: '在途物资金额', width: 160}
                    ]];
                } else if ( !onway && accept) {
                    option['cols'] = [[{field: 'row_name', title: '申请部门', width: 180},
                        {field: 'column_fund_accept', title: '领取物资金额', width: 160}
                    ]]
                }
                option['data'] = res.data;
                table.reload('statistic_table', option);

                $('#table_section').removeAttr('hidden');

             } else {
                layer.open({
                   title: '提示',
                   content: '操作失败'
                });
            }

        }


    });


};



