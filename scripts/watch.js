// 判断当前是否登陆，如果没有登陆跳转到登陆页面
const token = localStorage.getItem('token')
if (!token) {
  Toastify({
    text: '请先登陆',
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    destination: '/login.html',
    callback () {
      // 当显示的层消失的时候执行
      location.href = '/login.html'
    }
  }).showToast()
}

let queryObj = query(location.search)
console.log(queryObj.id)