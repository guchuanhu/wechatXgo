export default {
    faultChange:faultChange,
    faultOpen:faultOpen,
    faultClose:faultClose,
    faultSubmit:faultSubmit,
};

function faultChange(e){
    let index = e.currentTarget.dataset.index;

    if(this.data.fault.currentFaultChoice[index]===true){
        this.setData({
            ["fault.currentFaultChoice["+index+"]"]: null,
        });
    }else{
        this.setData({
            ["fault.currentFaultChoice["+index+"]"]: true,
        });
    }
    
    
}

function faultSubmit() {//拿到选中故障的下标，保存故障到resultFault
    let choice = this.data.fault.currentFaultChoice;
    let arr = [];
    let flashTopFault = false;//点亮最大故障
    let dollar = 0;//计算本次价格
    let total = 0;
    if(choice.length!==0){//判断哪些存在哪些小故障
        for(let i in choice){
            if(choice[i]){
                this.setData({
                    ["phone["+this.data.fault.currenttopindex+"].detail["+i+"].choice"]: true,
                    ["fault.phone["+this.data.fault.currenttopindex+"].detail["+i+"].choice"]: true,
                });
                dollar+=this.data.phone[this.data.fault.currenttopindex].detail[i].noformatPrice-0;
                flashTopFault = true;
            }else{
                this.setData({
                    ["phone["+this.data.fault.currenttopindex+"].detail["+i+"].choice"]: false,
                    ["fault.phone["+this.data.fault.currenttopindex+"].detail["+i+"].choice"]: false,
                });
            }
        }
    }
    
    if(flashTopFault){//判断最大故障是否点亮
        this.setData({
            ["phone["+this.data.fault.currenttopindex+"].choice"]: true,
        });
    }else{
        this.setData({
            ["phone["+this.data.fault.currenttopindex+"].choice"]: false,
        });
    }

    this.setData({
        ["fault.dollar.detail["+this.data.fault.currenttopindex+"]"]: dollar,//计算本次大故障总价
    });
    if(this.data.fault.dollar && this.data.fault.dollar.detail && this.data.fault.dollar.detail.length>0){
        this.data.fault.dollar.detail.forEach(function(v,i,a) {
            total += v;
        });
    }
    this.setData({
        ["fault.dollar.total"]: total,//计算本次大故障总价
        ["fault.dollar.totalF"]: parseInt(total/100),//计算本次大故障总价
        ["fault.dollar.totalL"]: (total/100+'').split('.')[1]||'00',//计算本次大故障总价
        "fault.show":false,
    });

    this.setData({
      "fixWell": false
    });
    console.log(this);
    this.data.phone.forEach( (v, i, a) =>{
      if(v.choice){
        this.setData({
          "fixWell": true
        });
      }
    });

}

function faultClose(){
    this.setData({
        "fault.show":false
    });
}

function faultOpen(e){
    let index = e.currentTarget.dataset.topindex;
    let arr = [];
    for(let i in this.data.phone[index].detail){
        arr.push(this.data.phone[index].detail[i].choice);
    }


    this.setData({//resultFault需要保存，currentFaultChoice需要根据phone刷新，其他数据每次开启时候更新
        "fault.show": true,
        "fault.currentFault": this.data.phone[index],
        "fault.currenttopindex": index,
        "fault.currentFaultChoice": arr,
        "fault.resultFault": this.data.fault?this.data.fault.resultFault?this.data.fault.resultFault:[]():[],
        "fault.phone": this.data.phone,
    });
}
