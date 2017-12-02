// pages/share/share.js
const app = getApp();
const common = require('../../common.js');
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_id:1 //背景id默认为1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    let bg_id = wx.getStorageSync("bg_id");
    that.setData({
      red_id: options.red_id,
      bg_id: bg_id
    })
    // 转发
    let scene = decodeURIComponent(options.scene);
    if (options.scene) {
      console.log('scene', scene);
      var strs = new Array(); //定义一数组 
      strs = scene.split("_"); //字符分割 
      //console.log(strs);
      console.log("red_id:", strs[1]);
      that.setData({
        red_id: strs[1]
      })
      wx.navigateTo({
        url: '../inform/inform?red_id=' + that.data.red_id +'&sharefriends=1'
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  // 换壳
  change(e) {
    wx.navigateTo({
      url: '../packet/packet?red_id=' + this.data.red_id
    })
    console.log(e);
  },
  shareImg(e) {
    let bg_id = wx.getStorageSync("bg_id");
    wx.navigateTo({
      url: '../shareImg/shareImg?red_id=' + this.data.red_id
    })
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    tips.loading('二维码生成中');
    let that = this;
    let sign = wx.getStorageSync('sign');
    console.log(that.data.red_id);
    // 转发红包
    wx.request({  
      url: apiurl + "red/go-share-red?sign=" + sign + '&operator_id=' + app.data.kid,
      data:{
        red_id: that.data.red_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("分享红包:", res);
        that.setData({
          shareList : res.data.data
        })
      }
    })
    wx.hideLoading()
  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);
    let that = this;
    return {
      title: '',
      path: '/pages/inform/inform?red_id=' + that.data.red_id + '&sharefriends=1',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  },
})