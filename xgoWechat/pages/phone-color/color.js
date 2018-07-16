const app = getApp();

Page({
  data: {},
  onReady(){
        var that = this;
        wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: app.data.url + 'Mobile/Sku/',
            method: 'POST',
            data: Object.assign({
                spuId: app.data.maintenanceData.phoneModel.id,
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
            }
        });
    },

    phone(e){
        if(e.currentTarget.dataset.id===null){
            return false;
        }
        app.data.maintenanceData.phoneColor = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../select-fault/fault'
        });
    }
});