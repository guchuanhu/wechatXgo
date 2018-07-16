const app = getApp();

Page({
  data: {},
  onReady(){
        var that = this;
        wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: app.data.url + 'Mobile/',
            method: 'POST',
            data: Object.assign({
                serverId: app.data.maintenanceData.server.id
            },app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                if(res.data.status==200){
                    if(res.data.data[res.data.data.length-1].id!=89){
                        res.data.data.push({
                            id: 89,
                            name: '其他',
                            wapPic: "http://icon.zol-img.com.cn/kxiu/mini/else.png"
                        })
                    }
                    if(res.data.data.length%3==2){
                        res.data.data.push({
                            id: false,
                            name: '其他',
                            wapPic: "http://icon.zol-img.com.cn/kxiu/mini/else.png"
                        })
                    }
                    if(res.data.data.length%3==1){
                        res.data.data.push({
                            id: false,
                            name: '其他',
                            wapPic: "http://icon.zol-img.com.cn/kxiu/mini/else.png"
                        },{
                            id: false,
                            name: '其他',
                            wapPic: "http://icon.zol-img.com.cn/kxiu/mini/else.png"
                        })
                    }
                    that.setData({
                        phone: res.data.data
                    });
                }
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {
                wx.hideLoading();
                //wx.alert({content: 'complete'});
            }
        });
  },

  phone(e){
      if(e.currentTarget.dataset.id == false){
          return false;
      }
      if(e.currentTarget.dataset.id == 89){

          setTimeout(function() {
              wx.navigateBack({
              delta: 2
              });
          }, 0);

          setTimeout(function() {
              wx.navigateTo({
                  url: '../quick-single/single'
              });
          }, 600);
          return false;
      }
      app.data.maintenanceData.selectModel.id = e.currentTarget.dataset.id;
      app.data.maintenanceData.selectModel.name = e.currentTarget.dataset.name;
      app.data.maintenanceData.auth = e.currentTarget.dataset.auth;
      wx.navigateTo({
          url: '../phone-model/phone'
      });
  }
});