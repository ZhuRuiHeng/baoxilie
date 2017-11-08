// pages/shareImg/shareImg.js
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
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let bg_id = wx.getStorageSync('bg_id');
    this.setData({
      bg_id: bg_id,
      red_id: options.red_id
    })
  },
  onShow: function () {
    tips.loading('二维码生成中');
    let that = this;
    let sign = wx.getStorageSync('sign');
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
        console.log('imgUrl', res.data.data);
        let status = res.data.status;
        if (status == 1) {
          that.setData({
            imgUrl: res.data.data
          })
        } else {
          tips.alert(res.data.msg);
        }
      }
    })
  },

  // 预览海报
  prewImg() {
    console.log(this.data.imgUrl);
    wx.previewImage({
      current: '' + this.data.imgUrl + '', // 当前显示图片的http链接
      urls: ['' + this.data.imgUrl + ''] // 需要预览的图片http链接列表
    })
  },
  // 保存图片
  save: function () {
    wx.showLoading({
      title: '图片保存中',
    });
    let that = this;
    wx.downloadFile({
      url: '' + that.data.imgUrl + '', 
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片保存成功，请去相册查看',
              icon: 'success',
              duration: 800
            })
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }

})