// utils 通用模块
// 可以把通用的函数放到这个js文件中

// 给jquery注册一个插件，收集表单数据，返回 {"email":"xxxy@xxx.xxx","password":"123456"}

$.fn.serializeObject = function () {
  // [ {name: 'email', value: 'xxx@xxx.xxx'} ]
  const arr = this.serializeArray()

  const obj = {}
  arr.forEach(item => {
    obj[item.name] = item.value
  })
  return obj
}

// $('表单').serializeObject()