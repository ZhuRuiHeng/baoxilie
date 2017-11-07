// pages/packet/packet.js
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
      imgList:[
        {
          img:'bao/k1.png',
          active:'false',
        }, {
          img: 'bao/k2.png',
          active: 'false'
        }, {
          img: 'bao/k3.png',
          active: 'false'
        }, {
          img: 'bao/k4.png',
          active: 'false'
        }, {
          img: 'bao/k5.png',
          active: 'false'
        }, {
          img: 'bao/k6.png',
          active: 'false'
        }, {
          img: 'bao/k7.png',
          active: 'false'
        }, {
          img: 'bao/k8.png',
          active: 'false'
        }, {
          img: 'bao/k9.png',
          active: 'false'
        }, {
          img: 'bao/k10.png',
          active: 'false'
        }, {
          img: 'bao/k11.png',
          active: 'false'
        }, {
          img: 'bao/k12.png',
          active: 'false'
        }
      ]
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      red_id: options.red_id
    })
  },
  onShow: function () {
    
  },
  change(e){
      let that = this;
      let bg_id = e.currentTarget.dataset.bg_id;
      wx.setStorageSync('bg_id', e.currentTarget.dataset.bg_id);
      wx.navigateBack({
        url: '../share/share?red_id=' + that.data.red_id + '&bg_id=' + bg_id
      })
      console.log(bg_id);
  }

})