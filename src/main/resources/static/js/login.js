layui.use('form', function(){
    var form = layui.form;

});

var submitLogin = function() {

    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();

    var param = {
        username: username,
        password: md5(username + md5('caigou' + password))
    }

    $.ajax({
        url: '/user/submitLogin',
        data: param,
        success: function(res){
            if (res.code == 0) {
                
                if( password == '123456' ) {
                    showPwdModal();
                } else {
                    window.location.href="./html/index.html";
                }
            } else {
                showModal(res.msg);
            }
        }
    })
}

var showModal = function(msg) {
    $('#infomodal').removeAttr('hidden');
    $('#info').html(msg);
}

var showPwdModal =function() {
    $('#setpwdmodal').removeAttr('hidden');
    $('input[name="login_username"]').attr('value', $('input[name="username"]').val());
    $('input[name="origin_password"]').attr('value', $('input[name="password"]').val());
}

var setPwd = function() {

    var newpwd = $('input[name="newpwd"]').val();
    var cfgpwd = $('input[name="cfgpwd"]').val();

    if ( newpwd != cfgpwd) {
        showModal('两次密码不一致');
        return;
    }

    if (newpwd == '123456') {
        showModal('请设置与初始密码不一样的密码');
        return;
    }

    var username = $('input[name="username"]').val();

    var param = {
        username: username,
        password: md5('caigou' + newpwd)
    }

    $.ajax({
        url: '/user/update',
        data: param,
        success: function(res){
            if (res.code == 0) {
                $('#setpwdmodal').attr('hidden', true);
                window.location.href="./html/index.html";
            } else {
                showModal(res.msg);
            }
        }
    })
}