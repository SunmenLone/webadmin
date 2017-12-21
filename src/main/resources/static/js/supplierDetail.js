var form;
layui.use('form', function(){
    form = layui.form;
});

var layer;
layui.use('layer', function(){
    layer = layui.layer;
});

$(function(){
    $.ajax({
        url: '../supplier/info/find',
        data: {
            supplier_id: getUrlParam('supplier_id')
        },
        async: false,
        success: function(res){
            if (res.code == 0) {
                var supplier = res.data;
                $('#supplier_id').html(supplier.supplier_id);
                $('#supplier_name').html(supplier.supplier_name);
                $('#institution_name').html(supplier.institution_name);
                $('#supplier_type').html(supplier.supplier_type);
                $('#social_trust_code').html(supplier.social_trust_code);
                $('#regist_address').html(supplier.regist_address);
                $('#regist_person').html(supplier.regist_person);
                $('#corporate_card').html(supplier.corporate_card);
                $('#tax_number').html(supplier.tax_number);
                $('#deposit_bank').html(supplier.deposit_bank);
                $('#cooperration_amount').html(supplier.cooperration_amount);
                $('#gurantee_rate').html(supplier.gurantee_rate);
                $('#business_owner').html(supplier.business_owner);
                $('#business_telphone').html(supplier.business_telphone);
                $('#institution_owner').html(supplier.institution_owner);
                $('#business_idcard').html(supplier.business_idcard);
                $('#institution_telphone').html(supplier.institution_telphone);
                $('#business_mail').html(supplier.business_mail);
                $('#business_address').html(supplier.business_address);
            } else {
                layer.open({
                    title:'提示',
                    content:'操作失败'
                });
            }
        }
    })
});

var nameChange = false, insChange = false, supTypeChange = false, socialTrustCodeChange = false, registAddressChange = false,
    registPersonChange = false, corporateCardChange = false, taxNumberChnage = false, bankChange = false, amountChange = false,
    rateChange = false, bsOwnerChange = false, bsPhoneChange = false, insOwnerChange = false, bsIDCaredChange = false,
    insPhoneChange = false, bsMailChange = false, bsAddressChange = false;

var openEditModal = function(){

    $('#edit_supplier_name').val($('#supplier_name').html());
    $('#edit_supplier_name').change(function(){
        nameChange = true;
    });

    $('#edit_institution_name').val($('#institution_name').html());
    $('#edit_institution_name').change(function(){
        insChange = true;
    });

    $('#edit_supplier_type').val($('#supplier_type').html());
    $('#edit_supplier_type').change(function(){
        supTypeChange = true;
    });

    $('#edit_social_trust_code').val($('#social_trust_code').html());
    $('#edit_social_trust_code').change(function(){
        socialTrustCodeChange = true;
    })

    $('#edit_regist_address').val($('#regist_address').html());
    $('#edit_regist_address').change(function(){
        registAddressChange = true;
    });

    $('#edit_regist_person').val($('#regist_person').html());
    $('#edit_regist_person').change(function(){
        registPersonChange = true;
    });

    $('#edit_corporate_card').val( $('#corporate_card').html());
    $('#edit_corporate_card').change(function(){
        corporateCardChange = true;
    });

    $('#edit_tax_number').val($('#tax_number').html());
    $('#edit_tax_number').change(function(){
        taxNumberChnage = true;
    });

    $('#edit_deposit_bank').val($('#deposit_bank').html());
    $('#edit_deposit_bank').change(function(){
        bankChange = true;
    });

    $('#edit_cooperration_amount').val($('#cooperration_amount').html());
    $('#edit_cooperration_amount').change(function(){
        amountChange = true;
    });

    $('#edit_gurantee_rate').val($('#gurantee_rate').html());
    $('#edit_gurantee_rate').change(function(){
        rateChange = true;
    });

    $('#edit_business_owner').val($('#business_owner').html());
    $('#edit_business_owner').change(function(){
        bsOwnerChange = true;
    });

    $('#edit_business_telphone').val($('#business_telphone').html());
    $('#edit_business_telphone').change(function(){
        bsPhoneChange = true;
    });

    $('#edit_institution_owner').val($('#institution_owner').html());
    $('#edit_institution_owner').change(function(){
        insOwnerChange = true;
    });

    $('#edit_business_idcard').val($('#business_idcard').html());
    $('#edit_business_idcard').change(function(){
        bsIDCaredChange = true;
    });

    $('#edit_institution_telphone').val($('#institution_telphone').html());
    $('#edit_institution_telphone').change(function(){
        insPhoneChange = true;
    });

    $('#edit_business_mail').val($('#business_mail').html());
    $('#edit_business_mail').change(function(){
        bsMailChange = true;
    });

    $('#edit_business_address').val($('#business_address').html());
    $('#edit_business_address').change(function(){
        bsAddressChange = true;
    });

    $('#editmodal').removeAttr('hidden');
}

var edit = function() {

    if (!nameChange && !insChange && !supTypeChange && !socialTrustCodeChange && !registAddressChange &&
        registPersonChange && !corporateCardChange && !taxNumberChnage && !bankChange && !amountChange &&
        rateChange && !bsOwnerChange && !bsPhoneChange && !insOwnerChange && !bsIDCaredChange &&
        insPhoneChange && !bsMailChange && !bsAddressChange) {
        $('#editmodal').attr('hidden', true);
        return;
    }

    layer.open({
        title: '提示',
        content: '确认修改供应商信息？',
        btn: ['确认', '取消'],
        yes: function(index) {

            var param = {
                supplier_id: $('#supplier_id').html()
            };

            if (nameChange) {
                param['supplier_name'] = $('#edit_supplier_name').val();
            }
            if (insChange) {
                param['institution_name'] = $('#edit_institution_name').val();
            }
            if (supTypeChange) {
                param['supplier_type'] = $('#edit_supplier_type').val();
            }
            if (socialTrustCodeChange) {
                param['social_trust_code'] = $('#edit_social_trust_code').val();
            }
            if (registAddressChange) {
                param['regist_address'] = $('#edit_regist_address').val();
            }
            if (registPersonChange) {
                param['regist_person'] = $('#edit_regist_person').val();
            }
            if (corporateCardChange) {
                param['corporate_card'] = $('#edit_corporate_card').val();
            }
            if (taxNumberChnage) {
                param['tax_number'] = $('#edit_tax_number').val();
            }
            if (bankChange) {
                param['deposit_bank'] = $('#edit_deposit_bank').val();
            }
            if (amountChange) {
                param['cooperration_amount'] = $('#edit_cooperration_amount').val();
            }
            if (rateChange) {
                param['gurantee_rate'] = $('#edit_gurantee_rate').val();
            }
            if (bsOwnerChange) {
                param['gurantee_rate'] = $('#edit_gurantee_rate').val();
            }
            if (bsPhoneChange) {
                param['business_telphone'] = $('#edit_business_telphone').val();
            }
            if (insOwnerChange) {
                param['institution_owner'] = $('#edit_institution_owner').val();
            }
            if (bsIDCaredChange) {
                param['business_idcard'] = $('#edit_business_idcard').val();
            }
            if (insPhoneChange) {
                param['institution_telphone'] = $('#edit_institution_telphone').val();
            }
            if (bsMailChange) {
                param['business_mail'] = $('#edit_business_mail').val();
            }
            if (bsAddressChange) {
                param['business_address'] = $('#edit_business_address').val();
            }

            $.ajax({
                url: '../supplier/info/update',
                data: param,
                success: function (res) {
                    layer.close(index);
                    if (res.code == 0) {
                        $('#editmodal').attr('hidden', true);
                        layer.open({
                            title: '提示'
                            , content: '修改供应商信息成功'
                        });
                        $('#supplier_name').html($('#edit_supplier_name').val());
                        $('#institution_name').html($('#edit_institution_name').val());
                        $('#supplier_type').html($('#edit_supplier_type').val());
                        $('#social_trust_code').html($('#edit_social_trust_code').val());
                        $('#regist_address').html($('#edit_regist_address').val());
                        $('#regist_person').html($('#edit_regist_person').val());
                        $('#corporate_card').html( $('#edit_corporate_card').val());
                        $('#tax_number').html($('#edit_tax_number').val());
                        $('#deposit_bank').html($('#edit_deposit_bank').val());
                        $('#cooperration_amount').html($('#edit_deposit_bank').val());
                        $('#gurantee_rate').html($('#edit_cooperration_amount').val());
                        $('#business_owner').html($('#edit_business_owner').val());
                        $('#business_telphone').html($('#edit_business_telphone').val());
                        $('#institution_owner').html($('#edit_institution_owner').val());
                        $('#business_idcard').html($('#edit_business_idcard').val());
                        $('#institution_telphone').html($('#edit_institution_telphone').val());
                        $('#business_mail').html($('#edit_business_mail').val());
                        $('#business_address').html($('#edit_business_address').val());
                    } else {
                        layer.open({
                            title:'提示',
                            content:'操作失败'
                        });
                    }
                },
                complete: function(){
                    nameChange = false;
                    insChange = false;
                    supTypeChange = false;
                    socialTrustCodeChange = false;
                    registAddressChange = false;
                    registPersonChange = false;
                    corporateCardChange = false;
                    taxNumberChnage = false;
                    bankChange = false;
                    amountChange = false;
                    rateChange = false;
                    bsOwnerChange = false;
                    bsPhoneChange = false;
                    insOwnerChange = false;
                    bsIDCaredChange = false;
                    insPhoneChange = false;
                    bsMailChange = false;
                    bsAddressChange = false;
                }
            })
        },
        btn2: function(index){
            layer.close(index);
        }
    });

}