const app = getApp();

const proObj = {
  data: {
    text: "获取验证码",
    num: 60
  },
  validSubmit(){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let that = this;
    if(!this.data.tel){
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }
    if(!this.data.code){
      wx.showToast({
        icon: 'none',
        title: '请填写验证码',
        duration: 1600,
      });
      return false;
    }
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: app.data.url + 'Sms/Check/',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.tel,
        code: this.data.code,
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.data.code-0 !== 1){
          wx.showToast({
            icon: 'none',
            title: '验证码错误',
            duration: 1600,
          });
        }else{
          that.submit();
        }
      },
      fail: function (res) {
        console.error("fails");
      },
      complete: function (res) {
        console.log("ok");
      }
    });
    
  },
  submit() {
    let that = this;
    let obj = {
      name: this.data.name,
      mobileTel: this.data.tel,
      code: this.data.code,
    };
    app.data.getMain = obj;

    wx.navigateTo({
      url: '../main-detail/detail?success=1'
    });

  },
  getCode(e) {//请求验证码
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
    if(!myreg.test(this.data.tel)){
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }

    if(this.data.text!=='获取验证码'){
        return false;
    }

    let co = setInterval(()=>{
      if(this.data.num > 1 ){
          this.setData({
            num: this.data.num - 1
          });
          this.setData({
            text: "请"+this.data.num+"秒后重新获取"
          });
      }else{
        this.setData({
          num: 60
        });
        this.setData({
          text: "获取验证码"
        });
        clearInterval(co);
      }
    }, 1000);

    wx.request({
      url: app.data.url + 'Sms/',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.tel
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.status == '10010'){
          wx.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 1600,
          });
          return false;
        }
      },
      fail: function (res) {
        console.error("fails");
      },
      complete: function (res) {
        console.log("ok");
      }
    });
  },
  onShow() {
    
  },
  goStoreSearch() {
    // if(e.currentTarget.dataset.id===null){
    //     return false;
    // }
    wx.navigateTo({
      url: '../store-search/search'
    });
  },
  bindData(e) {
    let name = e.currentTarget.dataset.set;
    this.setData({
      [name]: e.detail.value
    });
  },
};

Page(proObj);