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
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    console.log(options);
    let bg_id = wx.getStorageSync("bg_id");
    // if (options.bg_id) {  //有无bg_id
    //   this.setData({
    //     bg_id: options.red_id
    //   })
    //   bg_id: options.bg_id
    // }
    that.setData({
      red_id: options.red_id,
      bg_id: bg_id
    })
    wx.hideLoading()
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
    wx.navigateTo({
      url: '../shareImg/shareImg?bg_id=' + this.data.bg_id + '&red_id=' + this.data.red_id
    })
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    });
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
    // 生成带背景的二维码
    wx.request({
      url: apiurl + "red/create-bg-qr?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        red_id: that.data.red_id,
        bg_id: that.data.bg_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("带背景二维码:", res);
        wx.setStorageSync('imgUrl', res.data.data);
      }
    })
    wx.hideLoading()
  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})