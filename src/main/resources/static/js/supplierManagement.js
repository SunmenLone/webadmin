layui.use('element', function () {
    var element = layui.element;


});

var serviceScore = 4;
var qualityScore = 4;
var form;
layui.use('form', function () {
    form = layui.form;

    form.on('select(service)', function(data){
        serviceScore = data.value * 4;
        calculateScore();
    });

    form.on('select(quality)', function(data){
        qualityScore = data.value * 4;
        calculateScore();
    });

});

var layer;
layui.use('layer', function(){
   layer = layui.layer;
});

var bdate = '';
var edate = '';
layui.use('laydate', function(){
    var laydate = layui.laydate;

    //常规用法
    laydate.render({
        elem: '#bdate',
        done: function(value, date, endDate){
            bdate = value;
            calculateScore();
        }
    });

    laydate.render({
        elem: '#edate',
        done: function(value, date, endDate){
            edate = value;
            calculateScore();
        }
    });

})

var data;
var table;
layui.use('table', function () {
    table = layui.table;
    //执行渲染
    table.render({
        id: 'supplier_table',
        elem: '#supplier_table',
        url: '../supplier/find',
        page: true,
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'supplier_id', title: '供应商ID', event: 'detail', style: 'color: #01AAED;', width: 160},
            {field: 'supplier_name', title: '供应商名称', width: 180},
            {field: 'create_time', title: '创建时间', width: 180},
            {field: 'sup_item_type', title: '可供应商品类型', width: 140},
            {field: 'sup_item_name', title: '可供应产品名称', width: 140},
            {field: 'evaluate_score', title: '综合评分', width: 100},
            {toolbar: '#opt', title: '操作', align: 'center', width: 200},
        ]]
    });

    table.on('tool(supplier)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'edit') {

        } else if (layEvent === 'score') {
            data = obj.data;
            openScoreModal();
        } else if (layEvent === 'detail') {
            window.location.href = "./supplierDetail.html";
        }

    });

});

var search = function() {

    var supplier_name = $('input[name="supplier_name"]').val();
    var supplier_id = $('input[name="supplier_id"]').val();
    var sup_item_type = $('#sup_item_type option:selected').val();
    var sup_item_name = $('input[name="sup_item_name"]').val();

    var option = {
        where: {}
    }

    if (supplier_name != '') {
        option.where['supplier_name'] = supplier_name;
    }

    if (supplier_id != '') {
        option.where['supplier_id'] = supplier_id;
    }

    if (sup_item_type != '') {
        option.where['sup_item_type'] = sup_item_type;
    }

    if (sup_item_name != '') {
        option.where['sup_item_name'] = sup_item_name;
    }

    table.reload('supplier_table', option);
}

var openScoreModal = function() {

    $('textarea[name="service_text"]').val('');

    $('#bdate').val('');

    $('#edate').val('');

    $('#service option').each(function(){
        $(this).removeAttr('selected');
    });
    $('#service option[value="1"]').attr('selected', true);

    $('#quality option').each(function(){
        $(this).removeAttr('selected');
    });
    $('#quality option[value="1"]').attr('selected', true);

    form.render('select');

    $('textarea[name="quality_text"]').val('');

    $('textarea[name="extra_text"]').val('');

    $('#scoremodal').removeAttr('hidden');
}

var calculateScore = function() {

    if (bdate != '' && edate != '') {

        var days = DateDiff(bdate, edate);

        if (days < 0) {
            $('#total_score').html('');
        } else {
            var score = serviceScore + qualityScore;
            if (days > 365) {
                score += 20;
            } else if (days <= 365 && days > 182) {
                score += 15;
            } else {
                score += 10;
            }
            $('#total_score').html(score);
        }
    } else {
        $('#total_score').html('');
    }

}

var evaluate = function(){

    layer.open({
        title: '提示',
        content: '确认评分？',
        btn: ['确认', '取消'],
        yes: function(){

            $.ajax({
                url: '../supplier/evaluate',
                data: {
                    sup_service_score: serviceScore,
                    sup_quality_score: qualityScore,
                    sup_score: $('#total_score').html(),
                    sup_service: $('textarea[name="service_text"]').val(),
                    sup_quality: $('textarea[name="quality_text"]').val(),
                    sup_remark: $('textarea[name="extra_text"]').val(),
                    sup_time: bdate + ',' + edate,
                    sup_id: data.supplier_id
                },
                success: function(res){
                    if (res.code == 0) {
                        $('#scoremodal').attr('hidden', true);
                        table.reload('supplier_table', {});
                        layer.open({
                            title: '提示'
                            ,content: '评分成功'
                        });
                    } else {
                        console.log(res.errormessage);
                    }
                }
            });
        },
        btn2: function(){
            layer.closeAll();
        }
    });

}

