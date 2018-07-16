const app = getApp();
import pick from '../../template/pickerBox/picker-box.js';
// import cat from '../../template/locationBox/location-box.js';
const proObj = {
  data: {
    boxChecked: 0,
    wordShow:false,
    maintenanceData: app.data.maintenanceData,//接收前几个页面传过来的维修信息
    mainten: {
      detail: [
        {
          name: "上门维修",
          id: "S",
          word: "急速响应，准时上门",
          num: 60,
          text: "获取验证码",
        },
        {
          name: "预约到店",
          id: "D",
          word: "通道免排队",
          num: 60,
          text: "获取验证码",
        },
        {
          name: "邮寄维修",
          id: "J",
          word: "全程包邮",
          num: 60,
          text: "获取验证码",
        },
      ],
      choice: 0
    },
    customer: {
      S: {
        name: null,
        tel: null,
        code: null,//验证码
        address: null,
        time: null,
        other: null,//备注
        cat: null//地址信息
      },
      D: {
        name: null,
        tel: null,
        code: null,//验证码
      },
      J: {
        name: null,
        tel: null,
        code: null,//验证码

        address: null,
        imei: null,
        other: null,//备注
        cat: null,//发件地址地址信息
      },
      cat: [],//存储不同的cat
    },
    submitCan: true
  },
  boxCheckChange(e){
    this.data.boxChecked = e.detail.value.length;
  },
  wordChangeShow(){
    if(this.data.wordShow){
      this.setData({
        wordShow: false
      });
    } else {
      this.setData({
        wordShow: true
      });
    }
  },
  locaShow(e) {
    this.setData({
      numberCat: e.currentTarget.dataset.numbercat
    });
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
    if (e.detail.catShow !== undefined || e.detail.catShow === null){
      if (e.detail.catShow) {
        console.log(0);
        this.setData({
          locaShowCat:true
        });
      } else {
        console.log(1);
        this.setData({
          locaShowCat: false
        });
      }
      return false;
    }

    this.setData({//保存location-box获得的数据,分批次保存
      ["customer.cat[" + e.detail.numberCat +"]"]: e.detail.cat
    });
  },
  validSubmit() {
    console.log(this.data.maintenanceData.fixType);
    let whichChoice = this.data.mainten.detail[this.data.mainten.choice].id;
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let that = this;
    if(!this.data.customer[whichChoice].name){
      wx.showToast({
        icon: 'none',
        title: '请填写联系人',
        duration: 1600,
      });
      return false;
    }
    if(!myreg.test(this.data.customer[whichChoice].tel)){
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }
    if(!this.data.customer[whichChoice].code){
      wx.showToast({
        icon: 'none',
        title: '请填写验证码',
        duration: 1600,
      });
      return false;
    }

    if (whichChoice === "S") {
      if(!(this.data.customer.cat[0]&&this.data.customer.cat[0].item.id[0])){
        wx.showToast({
          icon: 'none',
          title: '请选择区域',
          duration: 1600,
        });
        return false;
      }
      // if(!(this.data.currentPicker&&this.data.currentPicker[0].id)){
      //   wx.showToast({
      //     icon: 'none',
      //     title: '请选择上门时间',
      //     duration: 1600,
      //   });
      //   return false;
      // }
      if(!this.data.customer[whichChoice].address){
        wx.showToast({
          icon: 'none',
          title: '请填写详细地址',
          duration: 1600,
        });
        return false;
      }
    }

    if (whichChoice === "J") {
      if(!(this.data.customer.cat[1]&&this.data.customer.cat[1].item.id[0])){
        wx.showToast({
          icon: 'none',
          title: '请选择区域',
          duration: 1600,
        });
        return false;
      }
      if(!this.data.customer[whichChoice].address){
        wx.showToast({
          icon: 'none',
          title: '请填写详细地址',
          duration: 1600,
        });
        return false;
      }
    }

    if (!this.data.boxChecked) {
      wx.showToast({
        icon: 'none',
        title: '请阅读并同意《修狗用户协议》',
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
        mobileTel: this.data.customer[whichChoice].tel,
        code: this.data.customer[whichChoice].code,
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.data.code-0 !== 1){
          wx.showToast({
            icon: 'none',
            title: '验证码错误',
            duration: 1600,
          });
          return false;
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
    let whichChoice = this.data.mainten.detail[this.data.mainten.choice].id;
    let that = this;
    let obj = {
      serverId: app.data.maintenanceData.server.id,
      manuId: app.data.maintenanceData.selectModel.id,
      spuId: app.data.maintenanceData.phoneModel.id,
      skuId: app.data.maintenanceData.phoneColor,
      priceIds: app.data.maintenanceData.phoneFault.priceId.join(','),

      orderType: whichChoice,

      name: this.data.customer[whichChoice].name,
      mobileTel: this.data.customer[whichChoice].tel,
      code: this.data.customer[whichChoice].code,

      fixType: this.data.maintenanceData.fixType
    };
    if (whichChoice === "S") {
      obj.pId = this.data.customer.cat[0].item.id[0];
      obj.cId = this.data.customer.cat[0].item.id[1];
      obj.aId = this.data.customer.cat[0].item.id[2];

      obj.address = this.data.customer[whichChoice].address;
      //obj.time = this.data.currentPicker[0].id;上门时间 
      obj.remark = this.data.customer[whichChoice].other;
    } else if (whichChoice === "J") {
      obj.pId = this.data.customer.cat[1].item.id[0];
      obj.cId = this.data.customer.cat[1].item.id[1];
      obj.aId = this.data.customer.cat[1].item.id[2];

      obj.imei = this.data.customer[whichChoice].imei;
      obj.address = this.data.customer[whichChoice].address;
      obj.remark = this.data.customer[whichChoice].other;
    }
    if (!this.data.submitCan){
      return false;//此时不能提交
    }
    this.setData({//禁止提交
      submitCan: false
    });
    wx.request({//提交订单
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
        url: app.data.url + 'Order/',
        method: 'POST',
        data: Object.assign(obj,app.data.userInfo),
        dataType: 'json',
        success: function (res) {
          if(res.data.status-0 === 200){
            console.log(that.data);
            app.data.main = {
              name: that.data.mainten.detail[that.data.mainten.choice].name,
              sn: res.data.data.sn,
              total: that.data.maintenanceData.phoneFault.totals,
              totalF: that.data.maintenanceData.phoneFault.totalsF,//价格整数
              totalL: that.data.maintenanceData.phoneFault.totalsL,//价格小数
              whichChoice: whichChoice
            };
            app.data.back = true;
            wx.navigateBack({
              delta: 5
            });
            app.fn();
          }else{
            that.setData({//允许提交
              submitCan: true
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
  getCodeWait(e){
    let that = this;
    setTimeout((e)=>{
      that.getCode();
    },200)
  },
  getCode(e) {//请求验证码
    let whichChoice = this.data.mainten.detail[this.data.mainten.choice].id;
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if(!myreg.test(this.data.customer[whichChoice].tel)){
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }

    if(this.data.mainten.detail[this.data.mainten.choice].text!=='获取验证码'){
        return false;
      }
      
      let indeForChoice = this.data.mainten.choice;

    let co = setInterval(()=>{
      if(this.data.mainten.detail[indeForChoice].num > 1 ){
          this.setData({
            ["mainten.detail["+indeForChoice+"].num"]: this.data.mainten.detail[indeForChoice].num - 1
          });
          this.setData({
            ["mainten.detail["+indeForChoice+"].text"]: "请"+this.data.mainten.detail[indeForChoice].num+"秒后重新获取"
          });
      }else{
        this.setData({
          ["mainten.detail["+indeForChoice+"].num"]: 60
        });
        this.setData({
          ["mainten.detail["+indeForChoice+"].text"]: "获取验证码"
        });
        clearInterval(co);
      }
    }, 1000);

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: app.data.url + 'Sms/',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.customer[whichChoice].tel
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.status == '10010'){
          wx.showToast({
            icon: 'none',
            content: res.data.message,
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
    this.setData({
      maintenanceData: app.data.maintenanceData
    });
    console.log(app.data.maintenanceData);
    console.log(this.data.maintenanceData);
    this.init(6, this);//pick初始化
    // this.catInit();//cat初始化

    this.setData({//更换门店返回时，刷新门店信息
      'maintenanceData.server': app.data.maintenanceData.server
    });
    
    if(!app.data.maintenanceData.server){//当没有数据的时候自己获取数据，选择维修中心没有数据的时候会没有数据
      this.getServer();
    }
  },
  showFault() {//暂时多条维修信息
    if (this.data.phoneFault) {
      this.setData({
        phoneFault: false
      });
    } else {
      this.setData({
        phoneFault: true
      });
    }
  },
  goStoreSearch() {
    wx.navigateTo({
      url: '../store-search/search'
    });
  },
  changeMainten(e) {
    console.log(this.data)
    let toNum = (app.data.maintenanceData.phoneFault.total - 0) + (app.data.maintenanceData.phoneFault.servicePrice - 0);
    this.setData({
      'mainten.choice': e.currentTarget.dataset.index
    });
    if (e.currentTarget.dataset.index!=0){
      this.setData({
        "maintenanceData.phoneFault.totals": toNum,
        "maintenanceData.phoneFault.totalsF": parseInt(toNum / 100),//总价价格整数
        "maintenanceData.phoneFault.totalsL": (toNum / 100 + '').split('.')[1] || '00',//总价价格小数
      });
    } else {
      toNum += (app.data.maintenanceData.phoneFault.doorPrice-0);
      this.setData({
        "maintenanceData.phoneFault.totals": toNum,
        "maintenanceData.phoneFault.totalsF": parseInt(toNum / 100),//总价价格整数
        "maintenanceData.phoneFault.totalsL": (toNum / 100 + '').split('.')[1] || '00',//总价价格小数
      });
    }
  },
  bindData(e) {
    let name = e.currentTarget.dataset.set;
    this.setData({
      [name]: e.detail.value
    });
  },
  getServer(){
      let that = this;

    wx.getLocation({//经纬度信息
        success: (res) =>{
          that.getLoca(res);
        },
        fail:() =>{
            that.getLoca({accuracy: 15, latitude: 39.983839, longitude: 116.31433});
            console.log({ title: '定位失败' });
        },
    });
  },
  getLoca(location){
      let that = this;
      let obj = {
              longitude: location.longitude,
              dimension: location.latitude,
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
                      'maintenanceData.server': res.data.data,
                      'maintenanceData.server.id': res.data.data.serverId
                    });
                    app.data.maintenanceData.server = res.data.data;
                    app.data.maintenanceData.server.id = res.data.data.serverId;
                    app.data.location = res.data.data;
              }
          },
          fail: function(res) {

          },
          complete: function(res) {
              wx.hideLoading();
              //wx.alert({title: 'complete'});
          }
      });
  },
};

Page(Object.assign(proObj, pick));// , cat