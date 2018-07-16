const app = getApp();

Page({
  data: {
    show:2,
    popShow:false
  },
  onShow() {
    this.setData({
      show: 2,
      popShow: false
    })
  },
  onReady(){
        var that = this;
        wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: app.data.url + '/?c=AliMini_Mobile&a=Spu',
            method: 'POST',
            data: Object.assign({
                manuId: app.data.maintenanceData.selectModel.id,
                serverId: app.data.maintenanceData.server.id
            },app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                if(res.data.data.length%2===1){
                    res.data.data.push({id:null,name:' '});
                }
                that.setData({
                    phone: res.data.data
                })
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {
                //my.alert({content: 'complete'});
            }
        });
    },

  phone(e) {

    if(e.currentTarget.dataset.id===null){
        return false;
    }
    app.data.maintenanceData.phoneModel.id = e.currentTarget.dataset.id;
    app.data.maintenanceData.phoneModel.name = e.currentTarget.dataset.name;
    if (app.data.maintenanceData.auth==="0"){
      wx.navigateTo({
        url: '../phone-color/color'
      });
      app.data.maintenanceData.fixType = 1;
    }else{
      this.setData({
        popShow: true
      });
    }
  },
  phoneGo() {
    app.data.maintenanceData.fixType = this.data.show;
    wx.navigateTo({
      url: '../phone-color/color'
    });
  },
  phoneClose() {
    this.setData({
      popShow: false
    });
  },

    changeItem(e){
      this.setData({
        show: e.currentTarget.dataset.index-0
      });
    }
});