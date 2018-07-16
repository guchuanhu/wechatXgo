const app = getApp();
//import cat from '../../template/locationBox/location-box.js';
const proObj = {
  data: {
    i: 'search',
    locaShow: false,
    localCat: null
  },
  locaShow() {
    this.setData(//关闭地图
      { mapShow: false }
    );
    if (this.data.locaShow) {
      this.setData({
        locaShow: false
      })
    } else {
      this.setData({
        locaShow: true
      })
    }

  },
  onMyEvent(e) {//location-box 选择完成之后才会触发，拿到location-box完整状态
    if (e.detail.catShow!==undefined){
      return false;
    }
    this.setData({//保存location-box获得的数据
      localCat: e.detail.cat
    });
    this.showMyLocation();
  },
  onShow(){
    //this.catInit(this.showMyLocation);//cat初始化
    this.mapCtx = wx.createMapContext('userMap');
    this.setData({//用来接收store-search
        location: app.data.location
    });
    if(app.data.location.latitude===undefined){//如果没有latitude
        this.setData({
            "location.latitude": app.data.location.dimension,
        });
    }
  },
  showMyLocation(){//作为回调函数被location-box插件调用
    var that = this;

    app.data.maintenanceData.location = {//下单需要的地理位置信息
        pId: that.data.localCat.item.id[0],
        cId: that.data.localCat.item.id[1],
        aId: that.data.localCat.item.id[2],
    };
    that.setData({
        catName: that.data.localCat.item.name
    });
    
    wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: app.data.url + 'Server/GetServer/',
          method: 'POST',
          data: Object.assign({
              pId: that.data.localCat.item.id[0],
              cId: that.data.localCat.item.id[1],
              aId: that.data.localCat.item.id[2],
          },app.data.userInfo),
          dataType: 'json',
          success: function(res) {
            let obj = {};
            if(res.data.data.aId){
                that.setData({
                    location: res.data.data,
                    'location.latitude': res.data.data.dimension,
                    noLocation: false,
                });
                obj = {
                    id: res.data.data.serverId,
                    name: res.data.data.name,
                    address: res.data.data.address,
                    image: res.data.data.image,
                    repairType: res.data.data.repairType,
                };
            }else{//没有找到
                that.setData({
                    noLocation: true,
                    location: null
                });
                obj = null;
            }
            app.data.maintenanceData.server = obj;
            app.data.location = res.data.data;
          },
          fail: function(res) {
              console.log(res);//没有找到
                that.setData({
                    noLocation: true,
                    location: null
                });
          },
          complete: function(res) {
              app.data.searchFlash = true;//返回home页面后刷新
          }
      });
    },
    makePhoneCall() {
      wx.makePhoneCall({ phoneNumber: this.data.location.telPhone });
    },
    mapFn(){//调出地图
        if(this.data.mapShow){
            this.setData(
            {mapShow:false}
            );
        }else{
            this.setData(
                {mapShow:true}
            );
        }
    }
};

Page(Object.assign(proObj));//,cat