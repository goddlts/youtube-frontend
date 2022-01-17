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

// 表单验证
$('#formLogin').validate({
  onBlur: true,
  onKeyup: true,
  sendForm: false,  // 禁用表单的action
  description: {
    email: {
      required: '邮箱不能为空!',
      pattern: '请输入正确的邮箱地址格式!'
    },
    pass: {
      required: '密码不能为空!',
      pattern: '密码只能为数字和字母且不能少于6位!'
    }
  },
  valid () {
    console.log($(this).serialize())
  },
  invalid () {
    console.log('表单验证失败')
  }
})