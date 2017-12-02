// pages/niceimg/niceimg.js
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
    niceImg: [
      "bao/a1.png",
      "bao/a2.jpg",
      "bao/a3.png",
      "bao/a4.jpg",
      "bao/a5.jpg",
      "bao/a6.jpg",
      "bao/a7.jpg",
      "bao/a8.jpg"
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  niceImg(e) {
    console.log(e);
    let that  = this;
    let index = e.currentTarget.dataset.index;
    let tempFilePaths = e.currentTarget.dataset.url;
    console.log('tempFilePaths', e.currentTarget.dataset.url);
    wx.switchTab({
      url: '../index/index?red_id=' + that.data.red_id + '&tempFilePaths=' + tempFilePaths
    })
  }

})