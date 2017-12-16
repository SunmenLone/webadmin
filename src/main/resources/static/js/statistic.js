layui.use('element', function () {
    var element = layui.element;

});

layui.use('form', function () {
    var form = layui.form;

});

layui.use('laydate', function(){
  var laydate = layui.laydate;

  //常规用法
  laydate.render({
    elem: '#bdate'
  });

  laydate.render({
      elem: '#edate'
    });

})



