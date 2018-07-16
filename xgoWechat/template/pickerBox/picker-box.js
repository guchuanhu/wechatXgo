export default {
    init:init,
    pickChange:pickChange,
    pickOpen:pickOpen,
    pickClose:pickClose,
};
let currentIndex = 0;
let openNum = 0;

function init(limit,that,time){
    limit = limit||7;
    time = time||['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
    let day = private_d(new Date().getTime(),limit);
    that.setData({
        pick:{
            day: day, 
            time:time,
            show:false
        }
    });

}

function pickChange(e){
    openNum++;
    var str = this.data.pick.day[e.detail.value[0]].name+this.data.pick.time[e.detail.value[1]];
    var str0 = this.data.pick.day[e.detail.value[0]].id+" "+this.data.pick.time[e.detail.value[1]];
    this.setData({
        ["currentPicker["+currentIndex+"].name"]:str,
        ["currentPicker["+currentIndex+"].id"]:str0,
    });
}

function pickClose(){
    if(openNum === 0){
        var str = this.data.pick.day[0].name+this.data.pick.time[0];
        var str0 = this.data.pick.day[0].id+" "+this.data.pick.time[0];
        this.setData({
            ["currentPicker["+currentIndex+"].name"]:str,
            ["currentPicker["+currentIndex+"].id"]:str0,
        });
    }
    this.setData({
        "pick.show":false
    });
}

function pickOpen(e){
    openNum = 0;
    currentIndex = e.currentTarget.dataset.index;
    this.setData({
        "pick.show":true
    });
}

function private_d(time,limit){
    var data,yr,arr=[],tm;
    for(var i=0;i<limit;i++){
        tm = time+i*24*60*60*1000;
        //data = new Date(parseInt(tm)).toLocaleString().replace(/:\d{1,2}$/,' ');
        data = formatDateTime(tm);
        yr = data.split(" ")[0].split("-");
        arr.push({
            name: yr[1]+"月"+yr[2]+"日",
            id: data.split(" ")[0]
        });
    }


    return arr;
}

function formatDateTime(timeStamp) {   
    var date = new Date();  
    date.setTime(timeStamp);  
    var y = date.getFullYear();      
    var m = date.getMonth() + 1;      
    m = m < 10 ? ('0' + m) : m;      
    var d = date.getDate();      
    d = d < 10 ? ('0' + d) : d;      
    var h = date.getHours();    
    h = h < 10 ? ('0' + h) : h;    
    var minute = date.getMinutes();    
    var second = date.getSeconds();    
    minute = minute < 10 ? ('0' + minute) : minute;      
    second = second < 10 ? ('0' + second) : second;     
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;      
}; 