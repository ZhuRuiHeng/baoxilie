// pages/question/question.js
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
    quesitionIndex: -1,
    question:[
       {
         title:"包你拼-怎么玩？",
         child:"你可以设置一个带奖励的拼字或拼图，发给好友，好友在指定时间内拼成才能领取奖励",
         active:false
       },{
         title: "我创建了但没有发出去？",
         child: "请在主页【我的记录】中找到相应的记录，点击进入详情后点击【去转发】可把拼字或拼图转发出去，也可以生成图片保存到相册发朋友圈",
         active:false
       }
       , {
         title: "好友可以转发我的拼字或拼图么？",
         child: "可以的，你分享给好友或者转发到微信群，其他好友均可再次转发",
         active: false
       }
       , {
         title: "发包你拼会收取服务费吗？",
         child: "会收取2%的服务费",
         active: false
       }
       , {
         title: "未领取的金额会怎么样处理？",
         child: "未领取的金额将于24小时后退回至包你拼小程序余额；同时，未领取金额的服务费也将退回50%。举个例子，比如你的拼字红包是100块钱，支付了102元，这里2元是服务费，我们会退回101元，另外1块钱交给微信作为手续费。",
         active: false
       }
       , {
         title: "如何提现到微信钱包？",
         child: "请在主页的【余额提现】中或详情页的【去提现】均可跳转至余额提现页面进行提现，提现金额每次至少1元，每天至多提现3次",
         active: false
       }
       , {
         title: "提现会收取服务费吗？",
         child: "提现不收取服务费；申请提现后会在1-5个工作日内转账到你的微信钱包",
         active: false
       }
       , {
         title: "如何联系客服？",
         child: "你点击本页面下方的联系在线客服，即可联系；",
         active: false
       }
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
  checked(e) {
    let that = this;
    console.log(e)
    let quesitionIndex = e.currentTarget.dataset.index;
    that.setData({
      quesitionIndex
    })
  }

})