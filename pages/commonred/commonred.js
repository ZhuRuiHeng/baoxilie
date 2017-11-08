// pages/commonred/commonred.js
const app = getApp()
const common = require('../../common.js');
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1
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
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let sign = wx.getStorageSync('sign');
    // 提现
    wx.request({
      url: apiurl + "red/public-red-list?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("公共红包:", res);
        var status = res.data.status;
        console.log("commonList:", that.data.commonList);
        if (status == 1) {
          that.setData({
            commonList: res.data.data
          })
        } else {
          tips.alert(res.data.msg);
        }
      }
    })
    wx.hideLoading()
  },
  // 详情
  inform(e) {
    let red_id = e.currentTarget.dataset.red_id;
    wx.redirectTo({
      url: '../inform/inform?red_id=' + red_id
    })
  },
  /**
  *   下拉分页
  */
  onReachBottom: function () {
      wx.showLoading({
        title: '加载中',
      });
      let that = this;
      let sign = wx.getStorageSync('sign');
      let value = that.data.value;
      let oldGoodsList = that.data.commonList;
      console.log("oldGoodsList:" + oldGoodsList);
      var oldPage = that.data.page;
      var reqPage = oldPage + 1;
      console.log(that.data.page);
      wx.request({
        url: apiurl + "red/public-red-list?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          page: reqPage,
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("新增红包列表:", res);
          var commonList = res.data.data;
          if (commonList.length == 0) {
            tips.alert('没有更多数据了');
            return;
          }
          var page = oldPage + 1;
          var newContent = oldGoodsList.concat(commonList);
          that.setData({
            commonList: newContent,
            page: reqPage
          })
          wx.hideLoading();
          if (newContent == undefined) {
            tips.alert('没有更多数据')
          }
        }
      })
      wx.hideLoading()
  }
 
})