// export default {
//     catInit:init,
//     contentClick:contentClick,
//     menuClick:menuClick,



//     locationChange: locationChange,
//     locationOpen: locationOpen,
//     locationClose: locationClose,
// };


Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    boxLocaShow: {
      type: String,
      value: true,
      observer: function (newVal, oldVal) {
        if (this.data.cat.show) {
          this.setData({
            'cat.show': false
          });
        } else {
          if (this.data.initDataCat[this.data.numberCat]){//打开location-box的时候，更新数据initDataCat
            this.setData({
              cat: this.data.initDataCat[this.data.numberCat]
            });
          } else {//没有获取到缓存数据，使用初始化数据
            this.init();
          }
          this.setData({
            'cat.show': true
          });
        }
        this.sendCatShow();
      }
    },
    initDataCat: {
      type: Array
    },
    numberCat: {
      type: Number,
      value: null
    },
    typeId: {
      type: String,
      value: null
    }
  },
  data: {
    // 这里是一些组件内部数据
    cat:{
      show: true
    }
  },
  methods: {
    // 这里是一个自定义方法
    sendCat(cat) {//可以把组件内的信息传递出去
      var myEventDetail = {
        cat: JSON.parse(JSON.stringify(cat)),
        numberCat: this.data.numberCat
      } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail)
    },
    sendCatShow() {//可以把组件内的信息传递出去
      this.triggerEvent('myevent', {
        catShow: this.data.cat.show
      })
    },
    init: init,
    menuClick: menuClick,
    contentClick: contentClick,
    closeAndOpen(){
      if(this.data.cat.show){
        this.setData({
          'cat.show': false
        });
      } else {
        this.setData({
          'cat.show': true
        });
        if (this.data.initDataCat[this.data.numberCat]) {//打开location-box的时候，更新数据initDataCat
          this.setData({
            cat: this.data.initDataCat[this.data.numberCat]
          });
        } else {//没有获取到缓存数据，使用初始化数据
          this.init();
        }
      }
      this.sendCatShow();
    }
  },
  ready(){
    this.init();
  }
})

const app = getApp();
let callFn;//传入回调函数
let loadIndex;//记录本次打开选择的数据
let serderObj = {//记录本次打开选择的数据
                serverId: 1,
                orderType: null
            };

function init(){
    app.data.userInfo = {
        password: app.data.userInfo.password,
        userId: app.data.userInfo.userId,
    }
    if(app.data.maintenanceData.server){
        serderObj.serverId  = app.data.maintenanceData.server.id;
    }
    serderObj.orderType = this.data.typeId;
    //callFn = fn;//区域选择完毕之后调用，不进行数据初始化
    const that = this;
    wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: app.data.url + 'Area/',
        method: 'POST',
        data:  Object.assign(serderObj,app.data.userInfo),
        dataType: 'json',
        success: function (res) {
            if(res.data.status==200){
                that.setData({
                    "cat.contentChoice":[null,null,null],//内容选择下标
                    "cat.menuChoice":0,//当前选中的菜单下标
                    "cat.menu":["请选择","请选择","请选择"],//默认菜单项
                    "cat.content":[res.data.data,null,null],//内容存储容器，第一个数据在软件生命周期中最稳定
                    //"cat.show":false
                });
                that.setData({
                    "customer.initCat.contentChoice":[null,null,null],//内容选择下标
                    "customer.initCat.menuChoice":0,//当前选中的菜单下标
                    "customer.initCat.menu":["请选择","请选择","请选择"],//默认菜单项
                    "customer.initCat.content":[res.data.data,null,null],//内容存储容器，第一个数据在软件生命周期中最稳定
                });//初始化保存
            }
        },
        fail: function(res) {
            console.error("fails");
        }
    });
}

function contentClick(e){
    if(this.data.cat.contentChoice[this.data.cat.menuChoice]==e.currentTarget.dataset.index){//选中已选中
        if(this.data.cat.menuChoice==2){//选中最后content
            locationClose.call(this);
            return false;
        }
        this.setData({
            "cat.menuChoice": 1+this.data.cat.menuChoice,//当前选中的菜单下标
        });
        return false;
    }
    const that = this;
    const current = {
        menuChoice: this.data.cat.menuChoice,
        contentChoice: e.currentTarget.dataset.index,
        menu: e.currentTarget.dataset.menu,//content名（即将成为本此点击的菜单名）
        pid: e.currentTarget.dataset.pid,
    };
    if(current.menuChoice==2){//选中最后content
        this.setData({
            ["cat.contentChoice["+current.menuChoice+"]"]: current.contentChoice,//内容选择下标
            ["cat.menu["+current.menuChoice+"]"]: current.menu,//默认菜单项
            ["cat.item.id["+current.menuChoice+"]"]: current.pid,//选中城市ID
            ["cat.item.name["+current.menuChoice+"]"]: current.menu,//选中城市ID
        });
        if(callFn){//地区选择完成，调用毁掉函数
            callFn.call(this);
        }

        if(loadIndex){//确认选择之后需要保存当前组件的选择内容
            this.setData({
                ["customer.cat["+loadIndex+"]"]: this.data.cat,
            })
        }

        locationClose.call(this);
        this.sendCat(this.data.cat);//需要保存到页面的数据
        this.sendCatShow();
        return false;
    }else if(current.menuChoice==0){//选中第0个 content
        this.setData({
            "cat.contentChoice[1]":null,//内容选择下标
            "cat.contentChoice[2]":null,//内容选择下标
            "cat.menu[1]":"请选择",//默认菜单项
            "cat.menu[2]":"请选择",//默认菜单项
            "cat.content[1]":null,//内容存储容器
            "cat.content[2]":null,//内容存储容器
        });
    }else if(current.menuChoice==1){//选中第1个 content
        this.setData({
            //"cat.contentChoice[1]":null,//内容选择下标
            "cat.contentChoice[2]":null,//内容选择下标
            //"cat.menu[1]":"请选择",//默认菜单项
            "cat.menu[2]":"请选择",//默认菜单项
            //"cat.content[1]":null,//内容存储容器
            "cat.content[2]":null,//内容存储容器
        });
    }


    const urlItem = ['Area/City/',"Area/Area/"];
    const arrD = [{pId: current.pid},{cId: current.pid}];
    wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: app.data.url + urlItem[current.menuChoice],
        method: 'POST',
        data:  Object.assign(arrD[current.menuChoice],app.data.userInfo,serderObj),
        dataType: 'json',
        success: function(res) {
            if(res.data.status==200){
                that.setData({
                    ["cat.contentChoice["+current.menuChoice+"]"]: current.contentChoice,//内容选择下标
                    "cat.menuChoice": 1+current.menuChoice,//当前选中的菜单下标
                    ["cat.menu["+current.menuChoice+"]"]: current.menu,//默认菜单项
                    ["cat.content["+(current.menuChoice+1)+"]"]: res.data.data,//内容存储容器，第一个数据在软件生命周期中最稳定
                    ["cat.item.id["+current.menuChoice+"]"]: current.pid,//选中城市ID
                    ["cat.item.name["+current.menuChoice+"]"]: current.menu,//选中城市ID
                });
            }
        },
        fail: function(res){
            console.error("fails");
        }
    });
}




function menuClick(e){
    if(e.currentTarget.dataset.index==this.data.cat.menuChoice){
        return false;
    }
    const that = this;
    const current = {
        menuChoice: e.currentTarget.dataset.index,
        //contentChoice: e.currentTarget.dataset.index,
        menu: e.currentTarget.dataset.menu,
        //pid: e.currentTarget.dataset.pid,
    };
    if(this.data.cat.content[e.currentTarget.dataset.index]==null){//点击到没有content的menu是退出执行
        return false;
    }
    this.setData({
        //["cat.contentChoice["+current.menuChoice+"]"]: current.contentChoice,//内容选择下标
        "cat.menuChoice": current.menuChoice,//当前选中的菜单下标
        //["cat.menu["+current.menuChoice+"]"]: current.menu,//默认菜单项
        //["cat.content["+(current.menuChoice+1)+"]"]: res.data.data//内容存储容器，第一个数据在软件生命周期中最稳定
    });

}

function locationChange(e){
    var str = this.data.pick.day[e.detail.value[0]]+this.data.pick.time[e.detail.value[1]];
    this.setData({
        currentPicker:str
    });
    
}

function locationClose(){
    this.setData({
        "cat.show":false
    }); 
}

function locationOpen(e){

    if(callFn){//关闭地图
        this.setData(
            {mapShow:false}
        );
    }

    if(app.data.maintenanceData.server){
        serderObj.serverId  = app.data.maintenanceData.server.id;
    }
    
    serderObj.orderType  = e.currentTarget.dataset.type;
    init.call(this,callFn);//这三条是临时改动，zan

    loadIndex = e.currentTarget.dataset.index;
    
    if(loadIndex){//当前状态有存档,载入存档
        if(this.data.customer.cat[loadIndex]){
            this.setData({
                "cat": this.data.customer.cat[loadIndex]
            });
        }else{
            this.setData({
                "cat": this.data.customer.initCat
            });
        }
        
    }
    
    this.setData({
        "cat.show": true
    });
}