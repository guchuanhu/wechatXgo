const app = getApp();

let home = Page({
    data: {
        serverLocationFirst: {
            mark: true,
            data: null
        },
        flashHome: false
    },
    onShow() {// 小程序初始化
        if(app.data.searchFlash){
            this.setData({//没能成功定位
                store: app.data.location
            });
            if(app.data.location.length===0){
                this.onLoad();//重新刷新页面
            }
            app.data.searchFlash = false;
        }
        
    },
    onLoad(){
      let that = this;
        wx.getSystemInfo({//获取手机型号
            success: (res) => {
                this.setData({
                    systemInfo: res
                })
            }
        });

        wx.getLocation({//经纬度信息
            success: (res) =>{
                app.data.location = {
                  latitude: res.latitude,
                  longitude: res.longitude
                };
            },
            fail:() =>{
                app.data.location = {
                  latitude: 39.983839, 
                  longitude: 116.31433
                };
            },
            complete() {
              that.getUserData(that);
            }
        });
        
        
    },
    getUserData(that){
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              url: app.data.url + 'WxAuth/',
              data: {
                authcode: res.code
              },
              method: 'POST',
              dataType: 'json',
              success: (res) => {
                if (res.data.status == 200) {
                  app.data.userInfo = {//两种存入方式
                    userId: res.data.data.userId,
                    password: res.data.data.password,
                  };
                  that.getLoca();5
                }
              },
              fail: (res) => {
                // 根据自己的业务场景来进行错误处理
                console.log(res)
              },
            });
          }
        }
      });
    },
    getLoca(){
        let that = this;
        let obj = {
                longitude: app.data.location.longitude,
                dimension: app.data.location.latitude,
            };
        wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: app.data.url + 'Server/GetServer/',
            method: 'POST',
            data: Object.assign(obj,app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                if(res.data.status==200){
                    that.setData({
                        store: res.data.data
                    });


                    app.data.location = {
                      latitude: res.data.data.dimension,
                      longitude: res.data.data.longitude
                    };
                    
                    app.data.maintenanceData.location = {//下单需要的地理位置信息
                        pId: res.data.data.pId,
                        cId: res.data.data.cId,
                        aId: res.data.data.aId,
                        name: res.data.data.name,
                    };

                    app.data.location.name =  res.data.data.name;
                    app.data.location.address =  res.data.data.address;
                    app.data.location.telPhone =  res.data.data.telPhone;

                    app.data.maintenanceData.server = {//下单需要的维修中心信息
                        id: res.data.data.serverId,
                        name: res.data.data.name,
                        repairType: res.data.data.repairType,
                    };
                    if(that.data.serverLocationFirst.mark){//第一次获取位置和维修中心信息
                        that.data.serverLocationFirst.data = res.data.data;
                        that.data.serverLocationFirst.mark = false;
                    }
                }else{
                    that.setData({
                        store: that.data.serverLocationFirst.data
                    });
                    
                    app.data.maintenanceData.location = {//下单需要的地理位置信息
                        pId: that.data.serverLocationFirst.data.pId,
                        cId: that.data.serverLocationFirst.data.cId,
                        aId: that.data.serverLocationFirst.data.aId,
                        name: that.data.serverLocationFirst.data.name,
                    };

                    app.data.location.name =  that.data.serverLocationFirst.data.name;
                    app.data.location.address =  that.data.serverLocationFirst.data.address;
                    app.data.location.telPhone =  that.data.serverLocationFirst.data.telPhone;

                    app.data.maintenanceData.server = {//下单需要的维修中心信息
                        id: that.data.serverLocationFirst.data.serverId,
                        name: that.data.serverLocationFirst.data.name,
                        repairType: that.data.serverLocationFirst.data.repairType,
                    };
                }
            },
            fail: function(res) {
                    that.setData({
                        store: that.data.serverLocationFirst.data
                    });
                    
                    app.data.maintenanceData.location = {//下单需要的地理位置信息
                        pId: that.data.serverLocationFirst.data.pId,
                        cId: that.data.serverLocationFirst.data.cId,
                        aId: that.data.serverLocationFirst.data.aId,
                        name: that.data.serverLocationFirst.data.name,
                    };

                    app.data.location.name =  that.data.serverLocationFirst.data.name;
                    app.data.location.address =  that.data.serverLocationFirst.data.address;
                    app.data.location.telPhone =  that.data.serverLocationFirst.data.telPhone;

                    app.data.maintenanceData.server = {//下单需要的维修中心信息
                        id: that.data.serverLocationFirst.data.serverId,
                        name: that.data.serverLocationFirst.data.name,
                        repairType: that.data.serverLocationFirst.data.repairType,
                    };
            },
            complete: function(res) {
                wx.hideLoading();
                //wx.alert({content: 'complete'});
            }
        });
    },
    selfGone(){
        app.data.userInfo = {
            password: app.data.userInfo.password,
            userId: app.data.userInfo.userId,
        }
        wx.navigateTo({
            url: '../select-model/model'
        })
    },
    selfLocation(){
        wx.navigateTo({
            url: '../store-search/search'
        })
    },
    selfSingle(){
        wx.navigateTo({
            url: '../quick-single/single'
        })
    },
    goGetMain() {
        wx.navigateTo({
            url: '../get-main/main'
        });
    }

});