// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [
      { icon: "5", obj: "background:url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -192px -96px no-repeat;", height: "background-size:288px;height:96px;top:96px;" },

      { icon: "0", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) 1px 1px no-repeat;", height: "background-size:288px;height:96px;top:1px;" },

      { icon: "3", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) 1px -96px no-repeat;", height: "background-size:288px;height:96px;top:96px;" },

      { icon: "1", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -96px 1px no-repeat;", height: "background-size:288px;height:96px;top:1px;" },

      { icon: "2", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -192px 1px no-repeat;", height: "background-size:288px;height:96px;top:1px;" },

      { icon: "7", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -96px -192px no-repeat;", height: "background-size:288px;height:96px;top:191px;" },

      { icon: "6", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) 1px -192px no-repeat;", height: "background-size:288px;height:96px;top:191px;" },

      { icon: "8", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -192px -192px no-repeat;", height: "background-size:288px;height:96px;top:191px;" },

      { icon: "4", obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -96px -96px no-repeat;", height: "background-size:288px;height:96px;top:96px;" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  moveimg(e){
    let that = this;
    console.log(e);
    let imgList = that.data.imgList;
    let pic = that.data.pic;
    let idx = that.data.index;
    let obj = that.data.obj;
    console.log(idx);
    console.log(obj);
    // index obj
    
    if (obj == undefined){
      let currentIdx = e.currentTarget.dataset.index; //index
      //let currentPic = e.currentTarget.dataset.pic; 
      let currentObj = e.currentTarget.dataset.obj;  //img
      that.setData({
        //pic: currentPic,
        currentIdx: currentIdx,
        index: currentIdx,
        obj: currentObj
      })
    }else{
      let currentIdx = e.currentTarget.dataset.index;
      let currentPic = e.currentTarget.dataset.pic;
      let currentObj = e.currentTarget.dataset.obj;
      console.log(currentIdx, obj);
      console.log(idx, currentObj);
      imgList[currentIdx].obj = obj;
      imgList[idx].obj = currentObj;
      //imgList[pic].obj = currentObj;
      that.setData({
        imgList,
        obj:undefined
        //index:null
      })
      console.log(that.data.imgList);
    }
    let nowList = that.data.imgList;
    let ask = [];
    for (let i = 0; i < nowList.length; i++) {
      ask.push(nowList[i].obj)
    }
    console.log(ask.toString() == that.data.right.toString())
    if (ask.toString() == that.data.right.toString()) {
      console.log("成功成功成功成功成功成功成功成功成功成功成功成功");
    }else{
      that.setData({
        
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let right = [];
    let rightList = that.data.imgList;
    for (let i = 0; i <rightList.length;i++){
      right.push(rightList[i].obj)
    } 
    that.setData({
      right:right,
      rightList: rightList
    })
    console.log("right:",right)
    // 随机
    function random(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };
    // 随机数组
    function shuffle(arr) {
      let length = arr.length,
        shuffled = Array(length);
      for (let index = 0,
        rand; index < length; index++) {
        rand = random(0, index);
        if (rand !== index) shuffled[index] = shuffled[rand];
        shuffled[rand] = arr[index];
      }
      return shuffled;
    }
    let arr = that.data.imgList; 
    let imgList = that.data.imgList; 
    for (let i = 0; i < 1; i++) { 
      console.log(shuffle(arr));
      that.setData({
        imgLists:shuffle(arr)
      })
    } 
    let imgLists = that.data.imgLists;
    for (let i = 0; i <imgLists.length;i++){
      //imgLists[i].obj = imgList[i].obj;
      imgList[i].obj = imgLists[i].obj
    }
    that.setData({
      imgList: imgList
    })
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})