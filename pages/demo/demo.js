// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[
      {
        icon: '0',
        obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) 1px -192px no-repeat;background-size: 288px;height: 96px;top: 1px;"
      },
      {
        icon: '1',
        obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) 1px 1px no-repeat;background-size: 288px;height: 96px;top: 1px;"
      },
      {
        icon: '2',
        obj: "    background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) 1px -96px no-repeat;background-size: 288px;height: 96px;top: 1px;"
      },
      {
        icon: '3',
        obj: "background:url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -192px -96px no-repeat;background-size:288px;height:96px;top:96px;"
      },
      {
        icon: '4',
        obj: "    background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -192px 1px no-repeat;background-size: 288px;height: 96px; top: 96px;"
      },
      {
        icon: '5',
        obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -96px 1px no-repeat;background-size: 288px;height: 96px;top: 96px;"       
      },
      {
        icon: '6',
        obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -96px -96px no-repeat;background-size: 288px;height: 96px;top: 191px;"
      },
      {
        icon: '7',
        obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -192px -192px no-repeat; background-size: 288px;height: 96px; top: 191px;"
      },
      
      {
        icon: '8',
        obj: "background: url(https://img.2gengmei.com//tmp_b9ae8f3a142d86e7d0c3136957ae164a.jpg) -96px -192px no-repeat;background-size: 288px;height: 96px;top: 191px"  
      },
      
      
      
      
      
     
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
    var imgList = this.data.imgList;
    var pic = this.data.pic;
    var idx = this.data.index;
    if(pic == undefined){
      var currentIdx = e.currentTarget.dataset.index;
      var currentPic = e.currentTarget.dataset.pic;
      this.setData({
        pic: currentPic,
        index: currentIdx
      })
    }else{
      
      var currentIdx = e.currentTarget.dataset.index;
      var currentPic = e.currentTarget.dataset.pic;
      console.log(currentIdx, idx);
      imgList[currentIdx].icon = pic;
      imgList[idx].icon = currentPic;
      this.setData({
        imgList,
        pic:undefined,
        index:null
      })
    }
    
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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