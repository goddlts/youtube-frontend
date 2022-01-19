// 注册dayjs的插件
dayjs.extend(window.dayjs_plugin_relativeTime)

// 设置模板引擎的过滤器
template.defaults.imports.relativeTime = function (value) {
  return dayjs().to(dayjs(value))
}

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

loadData(1, 3)