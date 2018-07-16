const app = getApp();

Page({
  data: {
    submitCan: true
  },
  getSubWait(e) {
    let that = this;
    setTimeout((e) => {
      that.validSubmit();
    }, 200)
  },
  validSubmit(e) {
    let that = this;
    let wxreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!this.data.name) {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none',
        duration: 1600,
      });
      return false;
    }
    if(!wxreg.test(this.data.tel)){
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }
    if(app.data.location.latitude===undefined){
      app.data.location.latitude = app.data.location.dimension
    }
    if (!this.data.submitCan) {
      return false;//此时不能提交
    }
    this.setData({//禁止提交
      submitCan: false
    });
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: app.data.url + '/?c=AliMini_Shortcut',
      method: 'POST',
      data: Object.assign({
        longitude: app.data.location.longitude,
        dimension: app.data.location.latitude,
        mobileTel: this.data.tel,
        userName: this.data.name,
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.data.sn){
          app.data.main = {
            sn: res.data.data.sn,
            whichChoice: "Q"
          };

          wx.navigateBack({
            delta: 2
          });
          app.fncall();
          
        } else {
          that.setData({//允许提交
            submitCan: true
          });
           wx.showToast({
            icon: 'none',
            title: '没有查到订单', 
            duration: 1600,
          });
        }
      },
      fail: function (res) {
        that.setData({//允许提交
          submitCan: true
        });
        console.error("fails");
      },
      complete: function (res) {
        console.log("ok");
      }
    });
  },
  bindData(e) {
    let name = e.currentTarget.dataset.set;
    this.setData({
      [name]: e.detail.value
    });
  },
});