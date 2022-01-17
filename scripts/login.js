$('#panelRegister').hide()

// 点击注册按钮
$('#btnRegister').click(function () {
  $('#panelLogin').hide()
  $('#panelRegister').show()
})

// 点击登陆按钮
$('#btnLogin').click(function () {
  $('#panelLogin').show()
  $('#panelRegister').hide()
})