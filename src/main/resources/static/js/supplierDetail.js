
$(function(){

    $.ajax({
        url: '../supplier/find',
        data: {
            supplier_id: getUrlParam('supplier_id')
        },
        success: function(res){
            if (res.code == 0) {

            } else {
                console.log(res.errormessage);
            }
        }

    })

});