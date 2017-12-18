var sdata, ssdata;
var item_supid, item_sup_price;
var steadySet = [];
layui.use('form', function(){
   var form = layui.form;

    form.on('checkbox(item)', function(data) {

        var m = true;

        $.each(steadySet, function(i){
           if (steadySet[i].item_order == data.value) {
               steadySet[i].steady_fund = data.elem.checked ? 1 : 0;
               m = false;
           }
        });

        if (m) {

            var s = {
                apply_order: getUrlParam('apply_order'),
                item_order: data.value,
                steady_fund: data.elem.checked ? 1 : 0
            }

            steadySet.push(s);
        }

    });

    form.on('radio(supplier)', function(data){

        sdata= data;

        $.ajax({
            url: '../supplier/item/supid/find',
            data: {
                item_order: idata.item_order,
                sup_name: data.value
            },
            success: function(res) {
                if (res.code == 0) {

                    ssdata = res.data;

                    for (var i = 0; i < ssdata.length; i++) {

                        for (var j = 0; j < hide.length; j++) {
                            if ( hide[j] == ssdata[i].item_supid ) {
                                ssdata.splice(i, 1);
                                break;
                            }
                        }

                        if ( max!=null && ssdata[i].item_supid ==  max) {
                            ssdata[i].risk = '价格最高';
                        }
                        if ( min!=null && ssdata[i].item_supid ==  min) {
                            ssdata[i].risk = '价格最低';
                        }

                        for (var k = 0; k < warn.length; k++) {
                            if ( warn[k] == ssdata[i].item_supid ) {
                                if (ssdata[i].risk == undefined) {
                                    ssdata[i].risk = '该商品偏离平均价格';
                                } else {
                                    ssdata[i].risk += '，该商品偏离平均价格';
                                }
                                break;
                            }
                        }

                        if (ssdata[i].risk == undefined) {
                            ssdata[i].risk = '-';
                        }
                    }

                    sstable.reload('supply_table', {
                       data: ssdata
                    });

                } else {
                    console.log(res.errormessage);
                }
            }
        })

    });

    form.on('radio(supply)', function(data){

        $.each(ssdata, function(i){

            if (data.value == ssdata[i].item_supid) {
                item_supid = ssdata[i].item_supid;
                item_sup_price = ssdata[i].item_price;
            }

        });
    });


});

var layer;
layui.use('layer', function(){
   layer = layui.layer;
});

var idata;
var itable, stable, sstable;
layui.use('table', function () {
    itable = layui.table;
    //执行渲染
    itable.render({
        id: 'item_table',
        elem: '#item_table',
        height: 480,
        url: '../purchase/apply/items/get?apply_order=' + getUrlParam('apply_order'),
        even: true,
        cols: [[{field: 'id', title: '序号', width: 80},
            {field: 'item_order', title: '商品编号', width: 120},
            {field: 'item_type', title: '商品类型', width: 120},
            {field: 'item_name', title: '商品名称', width: 120},
            {field: 'item_count', title: '商品数量', width: 100},
            {field: 'item_sup_name', title: '供应商', width: 160},
            {field: 'item_supid', title: '商品供应编号', width: 160},
            {field: 'item_sup_price', title: '预计价格', width: 100},
            {toolbar: '#opt', title: '操作', width: 120, align: 'center'},
            {toolbar: '#set', title: '是否固定资产', width: 120, align: 'center'}
        ]]
    });

    itable.on('tool(item)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        idata = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'choose') {
            openChooseModal(idata);
        }

    });

    stable = layui.table;
    //执行渲染
    stable.render({
        id: 'supplier_table',
        elem: '#supplier_table',
        height: 320,
        even: true,
        cols: [[{toolbar: '#sup', title: '选择', width: 60},
            {field: 'supplier_name', title: '供应商名称', width: 180},
        ]]
    });

    sstable = layui.table;
    //执行渲染
    sstable.render({
        id: 'supply_table',
        elem: '#supply_table',
        height: 320,
        even: true,
        cols: [[{toolbar: '#item', title: '选择', width: 60},
            {field: 'item_supid', title: '商品供应编号', width: 180},
            {field: 'item_price', title: '单价', width: 180},
            {field: 'risk', title: '风险提示', width: 180, style: 'color: red;'}
        ]]
    });

});

var max = null, min = null, warn = [], hide = [];

var openChooseModal = function(data) {

    $.ajax({
        url: '../supplier/find/byorder',
        data: {
            item_order: data.item_order
        },
        async: false,
        success: function(res) {
            if (res.code == 0) {

                console.log(res);

                max = res.high_supitem_price_order;
                min = res.low_supitem_price_order;
                warn = res.deviation_supitem_warn_order;
                hide = res.deviation_supitem_hide_order;

                var suppliers = [];

                $.each(res.sup_name, function(i){

                    var s = {
                        supplier_name: res.sup_name[i]
                    };
                    suppliers.push(s);

                });

                stable.reload('supplier_table', {
                   data: suppliers
                });


            } else {
                console.log(res.errormessage);
            }
        }

    });

    $('#choosemodal').removeAttr('hidden');

}

var choose = function() {

    if (sdata == undefined || item_supid == undefined || item_sup_price == undefined) {
        layer.open({
            title: '提示',
            content: '请选择供应渠道'
        })
        return;
    }

    $.ajax({
        url: '../purchase/apply/item/choose',
        data: {
            item_order: idata.item_order,
            apply_order: getUrlParam('apply_order'),
            item_sup_name: sdata.value,
            item_supid: item_supid,
            item_sup_price: item_sup_price
        },
        success: function(res) {
            if (res.code == 0) {

                closeChooseModal();

            } else {
                console.log(res.errormessage);
            }
        }
    })


}

var closeChooseModal = function() {

    $('#choosemodal').attr('hidden', true);

    itable.reload('item_table', {});
    stable.reload('supplier_table', {
        data: []
    });
    sstable.reload('supply_table', {
        data: []
    });

}

var commit = function() {

    console.log(steadySet);

    layer.open({
        title: '提示',
        content: '提交采购后将不可变更供应渠道，确认提交？',
        btn: ['确认', '取消'],
        yes: function(index){

            var param = {
                apply_order: getUrlParam('apply_order'),
                apply_item: steadySet
            }

            $.ajax({
                type: 'post',
                dataType: 'json',
                beforeSend: function(xhr){
                    xhr.setRequestHeader('Content-Type', 'application/json')
                },
                url: '../purchase/apply/consummate',
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.code == 0) {
                        layer.open({
                            title: '提示',
                            content: '提交采购后将不可变更供应渠道，确认提交？',
                            btn: ['确认', '取消'],
                            yes: function (index) {
                                layer.close(index);
                                window.location.href = "purchaseManagement.html";
                            },
                            btn2: function (index) {
                                layer.close(index);
                            }
                        });
                    } else {
                        console.log(res.errormessage);
                    }
                }
            })
        },
        btn2: function(index){
            layer.close(index);
        }
    });

}
