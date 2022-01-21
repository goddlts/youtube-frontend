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

// 发送请求获取数据
http
  .get(`/videos/${queryObj.id}`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  .then(res => {
    const { success, data } = res.data
    if (success) {
      // 播放当前视频
      const player = videojs('my-player', {
        autoplay: true,
        // 静音播放
        muted: 'muted',
      }, function () {
        // 视频播放完成之后执行
        this.on('ended', function () {
          videojs.log('播放结束了!')
        })
      })
      player.src({
        type: "video/mp4",
        src:data.url
      })
    }
  })