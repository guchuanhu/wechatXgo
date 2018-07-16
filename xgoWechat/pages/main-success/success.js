const app = getApp();
Page({
  data: {
    webview: false
  },
  onShow(){
    this.setData({
      main: app.data.main
    });
    // if(!app.data.main.total){
    //   wx.showToast({
    //     type: 'none',
    //     content: '客服会在10分钟之内联系您',
    //     duration: 3000,
    //   });
    // }
  },
  clickboard(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data);
          }
        })
      }
    })
  },
  gowebview(){
    this.setData({
      webview: true
    })
  },
  goMainDetail(){
    wx.navigateTo({
        url: '../main-detail/detail?success=0'
    });
  }
});