// 1. 发送请求，获取视频列表
function loadData(pagenum, pagesize) {
  httpV2
    .get(`/videos?pagenum=${pagenum}&pagesize=${pagesize}`)
    .then(res => {
      const { success, data: { count, rows } } = res.data
      if (success) {
        // 渲染模板
        const html = template('tpl', {
          videos: rows
        })
        $('.videos').html(html)

        // 设置分页条
        $('.pager').pager({
          // 页码 从0开始
          pageIndex: pagenum - 1,
          // 每页显示多少条
          pageSize: pagesize,
          // 总共的数据条数
          itemCount: count,
          // 除去第一页和最后一页的最大按钮数量
          maxButtonCount: 7,
          // 当页码发生改变的时候执行
          onPageChanged: function(page) {
            loadData(page + 1, pagesize)
          }
        })
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

loadData(1, 9)


// 2. 上传视频

let player = null
// 2.1 点击上传按钮，显示弹出层
$('#video-upload').change(function () {
  const file = this.files[0]
  if (!file) {
    return Toastify({
      text: '请选择要上传的视频',
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast()
  }

  // 判断上传文件的大小，如果文件大于30m不允许上传
  // size的单位是字节
  // console.log(file.size)
  // 1024Byte = 1KB
  // 1024KB = 1M
  const size = file.size / 1000 / 1000
  if (size > 30) {
    return Toastify({
      text: '文件大小超过30M，不允许上传',
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast()
  }

  // 判断文件的类型todo

  $('.modal-wrapper').show()

  // 初始化播放时
  if (player === null) {
    player = videojs('my-pre-player', {})
  }
  // 2.2 设置video，设置视频预览
  // 把视频文件，生成一个内容中的临时链接
  let preUrl = URL.createObjectURL(file)
  player.src({
    type: "video/mp4",
    src: preUrl
  })

  // 上传视频
  upload(file)
})

let toastify = null
// 2.3 上传视频
function upload(file) {
  const formData = new FormData()
  formData.append('upload_preset', 'youtubeclone')
  formData.append('file', file)

  const postUrl = 'https://api.cloudinary.com/v1_1/nllcoder/video/upload?upload_preset=youtube'

  http
    .post(postUrl, formData, {
      onUploadProgress: function (e) {
        // 处理原生进度事件
        const jd = e.loaded / e.total * 100 + '%'
        // console.log(jd)
        if (toastify === null) {
          toastify = Toastify({
            text: 'Uploading',
            duration: -1,
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          })
          toastify.showToast()
        }
      }
    })
    .then(res => {
      // 上传结束之后，关闭弹出提示
      toastify.hideToast()
      toastify = null
      console.log(res.data.url)

      // 上传视频的地址
      // res.data.url
      window.videoUrl = res.data.url
    })
}

$('.modal-header-left svg').click(function () {
  $('.modal-wrapper').hide()
  $('.video-preview').show()
  $('.video-form').hide()
})

// 2.4 点击next切换
$('.next-button').click(function () {
  // 更改按钮上的文字
  // this.textContent = 'Upload'

  if (this.textContent === 'Next') {
    $(this).text('Upload')
    $('.video-preview').hide()
    $('.video-form').show()
  } else {
    // 判断视频的地址是否存在
    if (!window.videoUrl) {
      return Toastify({
        text: '请先把视频上传完',
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      }).showToast()
    }

    let thumbnail = window.videoUrl.replace('mp4', 'jpg')

    // 2.5 点击upload 把数据保存到自己服务器
    http
      .post('/videos', {
        title: $('#title').val(),
        description: $('#description').val(),
        // 视频的路径
        url: window.videoUrl,
        // 缩略图的路径
        thumbnail: thumbnail
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(res => {
        if (res.data.success) {
          window.videoUrl = ''
          // 重新设置按钮上的文字
          $(this).text('Next')
          // 关闭弹出框
          $('.modal-wrapper').hide()
          $('.video-preview').show()
          $('.video-form').hide()
          loadData(1, 9)

          Toastify({
            text: '视频保存成功',
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
        } else {
          Toastify({
            text: '视频保存失败',
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
        }
      })
      .catch(err => {
        Toastify({
          text: '视频保存失败',
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
        // if (err.response.status === 401) {
        //   // 跳转到登陆页面
        // }
      })

  }
})
