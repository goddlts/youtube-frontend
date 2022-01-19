// 1. 发送请求，获取视频列表
function loadData() {
  http
    .get('/videos')
    .then(res => {
      const { success, data } = res.data
      if (success) {
        // 渲染模板
        const html = template('tpl', {
          videos: data
        })
        $('.videos').html(html)
      } else {
        // 提示
        Toastify({
          text: '获取视频列表失败',
          duration: 3000,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
      }
    })
}

loadData()