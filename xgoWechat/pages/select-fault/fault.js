const app = getApp();

import fault from '../../template/faultBox/fault-box.js';
const proObj = {
    data: {
      fixWell: false,
      doorPrice: null
    },
    onReady(){
        var that = this;
        wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: app.data.url + 'Mobile/Price/',
            method: 'POST',
            data: Object.assign({
                skuId: app.data.maintenanceData.phoneColor,
                serverId: app.data.maintenanceData.server.id,
                manuId: app.data.maintenanceData.selectModel.id,
                fixType: app.data.maintenanceData.auth==="0"?"1":app.data.maintenanceData.fixType
            },app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                that.setData({
                  phone: res.data.data.broken
                });
                that.data.doorPrice = res.data.data.doorPrice;
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {

            }
        });
    },

    phone(e){
      if (!this.data.fixWell){
            return false;
        }

        let arr = [];
        let priArr = [];
        let servicePrice = 0;
        this.data.phone.forEach(function(v){
            if(v.choice){
                v.detail.forEach(function(it,i,a){
                    if(it.choice){
                        arr.push(it.priceId);
                        priArr.push({
                            detailName: it.detailName,
                            repairName: it.repairName,
                            noformatPrice: it.noformatPrice,
                            totalF: parseInt(it.noformatPrice/100),//价格整数
                            totalL: (it.noformatPrice / 100 + '').split('.')[1] || '00',//价格小数
                        });
                        servicePrice = (it.servicePrice - 0) > servicePrice ? (it.servicePrice - 0) : servicePrice;
                    }
                })
            }
        });
        let totalNum = (this.data.fault.dollar.total-0) + (this.data.doorPrice-0) + (servicePrice-0);
        app.data.maintenanceData.phoneFault = {
            phone: priArr,//下单页面展示使用
            priceId: arr,//下单页priceids参数
            total: this.data.fault.dollar.total,//总价当前维修项目
            totals: totalNum,//总价，包含上门、服务、维修
            totalsF: parseInt(totalNum / 100),//总价价格整数
            totalsL: (totalNum / 100 + '').split('.')[1] || '00',//总价价格小数
            doorPrice: this.data.doorPrice,//上门费
            doorPriceF: parseInt(this.data.doorPrice / 100),//上门费价格整数
            doorPriceL: (this.data.doorPrice / 100 + '').split('.')[1] || '00',//上门费价格小数
            servicePrice: servicePrice,//服务费
            servicePriceF: parseInt(servicePrice / 100),//服务费价格整数
            servicePriceL: (servicePrice / 100 + '').split('.')[1] || '00',//服务费价格小数
        };
        console.log(app.data.maintenanceData.phoneFault);
        wx.navigateTo({
            url: '../maintenance/maintenance'
        });
    }
};
Page(Object.assign(proObj, fault));