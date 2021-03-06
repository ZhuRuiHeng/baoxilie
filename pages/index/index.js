//index.js
//获取应用实例
const app = getApp()
const common = require('../../common.js');
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js' 
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    style:'text', //红包类型
    array: ['30秒', '5秒', '10秒', '15秒', '20秒', '30秒', '40秒', '50秒', '60秒'],
    textList: ['大吉大利，今晚吃鸡', '升职加薪总经理，走上人生巅峰~', '科学研究明表汉怎字序排不也影响阅读', '生日快乐~'],
    speak: ['我爱你', '我喜欢你', '我是逗比', '我是猪'],
    faceList:['听说好看的人手气都不差','比一比谁的颜值最高','有颜值才能领取的福利','我想看看你们的颜值有多高'],
    commons:['不公开','公开'],
    service:0,//服务费
    allmoney:'',//余额
    animation:false,
    navto: 1,  //是否跳转启动页 1跳转 0 不跳转
    broadcasting: '肌肤有困难？就找禾葡兰！千名专业美肤导师为你提供一对一服务，随时免费咨询，微信搜索小程序：禾葡兰护肤中心',
    typeP: [
      {
        title:'拼字红包',
        typei:"text",
        red:'生成拼字红包',
        active:true
      },
       {
        title: '拼图红包',
        typei: "img",
        red: '生成拼图红包',
        active: false
      }, 
      {
        title: '口令红包',
        typei: "voice",
        red: '生成口令红包',
        active: false
      }
      , {
        title: '颜值红包',
        typei: "face",
        red: '生成颜值红包',
        active: false
      }
    ],
    footList:[
      {
        img:'../images/1.png',
        title:'我的记录',
        url:'../keep/keep'
      },
      {
        img: '../images/2.png',
        title: '余额提现',
        url: '../money/money'
      },
      
      {
        img: '../images/commonred.png',
        title: '公共红包',
        url: '../commonred/commonred'
      },{
        img: '../images/3.png',
        title: '更多好玩',
        url: '../more/more'
      },
    ],
    index: 0,
    wenzi:0,
    shuo:0,
    word: "",
    money1: "",
    money2: "",
    num:'',
    options :false,
    speakAll:false,
    text:true, //文字
    img:false, //图片
    voice:false, //语音
    face:false,
    play:true, //红包玩法拼
    count_down:30,
    indexCount:0,
    commonInx:0
  },
  
  onLoad: function (options) {
    wx.setStorageSync("navto", 1);
    let userInfo = wx.getStorageSync("userInfo");
    let that = this;
    if (options.tempFilePaths){
        that.setData({
          tempFilePaths: options.tempFilePaths,
        })
    }
    let style = wx.getStorageSync('style');
    if (style){
      that.setData({
          style: style
      })
    }
    //参
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('scene', scene);
      var strs = new Array(); //定义一数组 
      strs = scene.split("_"); //字符分割 
      console.log(strs);
      console.log("red_id:", strs[1]);
      that.setData({
        userInfo: userInfo,
        red_id: strs[1],
        sharefriends: 1
      })
      
    }
    
  },
  onShow:function(){
    if (wx.getStorageSync("navto")) {
      setTimeout(function () {
        wx.navigateTo({
          url: '../star/star'
        })
      }, 20)
    }
    
    //滚动文字
    wx.request({
      url: "https://unify.playonweixin.com/site/get-advertisements",
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var advers = res.data.adver.advers;
          var head_adver = res.data.adver.head_adver;
          var broadcasting = res.data.adver.broadcasting;
          wx.setStorageSync("advers", advers);
          wx.setStorageSync("broadcasting", broadcasting);
          that.setData({
            broadcasting
          })
        }
      }
    })
    // 用户信息
    let that = this;
    if (that.data.red_id) {
      wx.navigateTo({
        url: '../inform/inform?red_id=' + that.data.red_id
      })
    }
    app.getAuth(function(){
      let userInfo = wx.getStorageSync('userInfo');
      let sign = wx.getStorageSync('sign');
      console.log(userInfo);
      that.setData({
        userInfo: userInfo
      })
      // 提现
      wx.request({
        url: apiurl + "red/get-balance?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("余额:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              allMoney: res.data.data
            })

          } else {
            tips.alert(res.data.msg);
          }
        }
      })
      //24h
      let timestamp = wx.getStorageSync('timestamp');//时间戳
      console.log("timestamp:", timestamp);
      if (!timestamp) {
        let sign = wx.getStorageSync('sign');
        common.timestamp(function () { })
      } else { //有timestamp
        let nowtimestamp = Date.parse(new Date());
        var d = (nowtimestamp - timestamp) / 1000;
        console.log(d);
        if (d >= 86400) {
          common.timestamp(function () { })
        }
      }
    });
    
  },
  // 红包玩法 true拼 false普
  play(){
    this.setData({
      play: !this.data.play
    })
  },

  // 红包类型
  change(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let style = e.currentTarget.dataset.typei;
    let typeP = that.data.typeP;
    that.setData({
      animation: true
    })
    console.log(that.data.animation);
    
    if (style == 'img'){
      wx.setStorageSync('style', 'img');
      that.setData({
        text: false, //文字
        img: true, //图片
        voice: false, //语音
        face: false,
        style:'img'
      })
    } else if (style == 'voice'){
      wx.setStorageSync('style', 'voice');
      that.setData({
        text: false, //文字
        img: false, //图片
        voice: true, //语音
        face: false,
        style: 'voice'
      })
    } else if (style == 'face') {
      wx.setStorageSync('style', 'face');
      that.setData({
        text: false, //文字
        img: false, //图片
        voice: false, //语音
        face: true,
        style: 'face'
      })
    } else if (style == 'text'){
      wx.setStorageSync('style', 'text');
      that.setData({
        text: true, //文字
        img: false, //图片
        voice: false, //语音
        face: false,
        style: 'text'
      })
    }
    setTimeout(function(){
      that.setData({
        animation: false
      })
      console.log(that.data.animation);
    },2000)

    for (let i = 0; i < typeP.length;i++){
        typeP[i].active = false;
    }
    typeP[index].active = true;
    console.log(typeP)
    that.setData({
      typeP
    })
  },
  // 生成红包
  formSubmit: function (e) {
    let that = this;
    let inform = {};
    let sign = wx.getStorageSync('sign');
    let style = that.data.style;//红包类型
    let form_id = e.detail.formId;//红包类型
    console.log("style:",style);
    if (!that.data.num) {
      tips.alert("您没有填写数量");
      return false;
    }
    console.log("count_down:",that.data.count_down);
    if (!that.data.count_down) {
      tips.alert("您没有选择挑战时间");
      return false;
    }
    if (!form_id) {
      tips.alert("formId错误");
      return false;
    }
    
    // 请求拼字红包 wenzi | content
    if (style == 'text'){
        let play = that.data.play;
        if (!that.data.word && !that.data.wenzi) {
          tips.alert("您没有设置文字");
          return false;
        }
        if(play==true){
          if (!that.data.money1) {
            tips.alert("您没有填写金额");
            return false;
          }
          if (that.data.money1 < that.data.num) {
            tips.alert("每人获得打赏不得低于1元");
            return false;
          }
          console.log("play拼:", play);
          console.log(parseFloat(that.data.money1) + parseFloat(that.data.service));
          inform = {
            money: that.data.money1,
            count: that.data.num,
            content: that.data.word,
            form_id: form_id + Math.random() * 10 + 1,
            type: 'random',
            count_down: that.data.count_down,
            is_public: that.data.commonInx
          }
        }else{
          if (!that.data.money2) {
            tips.alert("您没有填写金额");
            return false;
          }
          if (that.data.money2 < 1) {
            tips.alert("每人获得打赏不得低于1元");
            return false;
          }
          console.log("play普:", play);
          console.log(parseFloat(that.data.money1) + parseFloat(that.data.service));
          inform = {
            money: that.data.money2 * that.data.num,
            count: that.data.num,
            content: that.data.word,
            form_id: form_id + Math.random() * 10 + 1,
            type: 'average',
            count_down: that.data.count_down,
            is_public: that.data.commonInx
          }
        }
        wx.request({
            url: apiurl + "red/create-text-red?sign=" + sign + '&operator_id=' + app.data.kid ,
            data: inform,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
              console.log("拼字红包:", res);
              if (res.data.status == '1') {
                if (res.data.data.finished == false) {//余额不足 
                    let params = res.data.data.params;
                    // 调用支付
                    wx.requestPayment({
                      timeStamp: res.data.data.params.timeStamp,
                      nonceStr: res.data.data.params.nonceStr,
                      package: res.data.data.params.package,
                      signType: res.data.data.params.signType,
                      paySign: res.data.data.params.paySign,
                      'success': function (res) {
                          // 获取red_id
                        wx.request({
                          url: apiurl + "red/go-new-red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
                          header: {
                            'content-type': 'application/json'
                          },
                          method: "GET",
                          success: function (res) {
                            console.log("红包详情:", res);
                            console.log(res.data.data);
                            that.setData({
                              red_id: res.data.data,
                              monry1:'',
                              money2:'',
                              num:''
                            })
                          }
                        })
                          setTimeout(function () {
                            // 微信支付成功跳转
                            wx.navigateTo({
                              url: '../inform/inform?red_id=' + that.data.red_id
                            })
                          }, 300)
                      },
                      fail: function (res) {
                        console.log(res);
                        tips.error(res.data.msg);
                      }
                    })
                }else{ 
                  tips.loading("创建成功");
                  that.setData({
                    monry1: '',
                    money2: '',
                    num: '',
                    marqueePace: 1,//滚动速度
                    marqueeDistance: 0,//初始滚动距离
                    marqueeDistance2: 0,
                    marquee2copy_status: false,
                    marquee2_margin: 60,
                    size: 14,
                    orientation: 'left',//滚动方向
                    interval: 40, // 时间间隔
                  })
                  // 余额支付成功跳转
                  wx.navigateTo({
                    url: '../inform/inform?red_id=' + res.data.data.finished
                  })
                }
                
              } else {
                tips.alert(res.data.msg)
              }
            }
        })
    } else if(style == 'img'){  //拼图红包
      let play = that.data.play;
      console.log('img:', that.data.tempFilePaths);
      if (!that.data.tempFilePaths) {
        tips.alert("您没有设置图片");
        return false;
      }
      // 玩法
      if (play == true) {
        if (!that.data.money1) {
          tips.alert("您没有填写金额");
          return false;
        }
        if (that.data.money1 < that.data.num){
          tips.alert("每人获得打赏不得低于1元");
          return false;
        }
        console.log("play拼:", play);
        inform = {
          money: that.data.money1,
          count: that.data.num,
          content: that.data.tempFilePaths,
          form_id: form_id + Math.random() * 10 + 1,
          type: 'random',
          count_down: that.data.count_down,
          is_public: that.data.commonInx
        }
      } else {
        console.log("play普:", play);
        if (!that.data.money2) {
          tips.alert("您没有填写金额");
          return false;
        }
        if (that.data.money2<1){
          tips.alert("每人获得打赏不得低于1元");
          return false;
        }
        inform = {
          money: that.data.money2 * that.data.num,
          count: that.data.num,
          content: that.data.tempFilePaths,
          form_id: form_id + Math.random() * 10 + 1,
          type: 'average',
          count_down: that.data.count_down,
          is_public: that.data.commonInx
        }
      }
      // 图片
      wx.request({
        url: apiurl + "red/create-img-red?sign=" + sign + '&operator_id=' + app.data.kid,
        data: inform,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          console.log("拼图红包:", res);
          if (res.data.status == '1') {
            if (res.data.data.finished == false) {//余额不足 
              let params = res.data.data.params;
              // 调用支付
              wx.requestPayment({
                timeStamp: res.data.data.params.timeStamp,
                nonceStr: res.data.data.params.nonceStr,
                package: res.data.data.params.package,
                signType: res.data.data.params.signType,
                paySign: res.data.data.params.paySign,
                'success': function (res) {
                  // 获取red_id
                  wx.request({
                    url: apiurl + "red/go-new-red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
                    header: {
                      'content-type': 'application/json'
                    },
                    method: "GET",
                    success: function (res) {
                      console.log("红包详情:", res);
                      console.log(res.data.data);
                      that.setData({
                        red_id: res.data.data,
                        monry1: '',
                        money2: '',
                        num: '',
                        marqueePace: 1,//滚动速度
                        marqueeDistance: 0,//初始滚动距离
                        marqueeDistance2: 0,
                        marquee2copy_status: false,
                        marquee2_margin: 60,
                        size: 14,
                        orientation: 'left',//滚动方向
                        interval: 40, // 时间间隔
                      })
                    }
                  })
                  setTimeout(function () {
                    // 微信支付成功跳转
                    wx.navigateTo({
                      url: '../inform/inform?red_id=' + that.data.red_id
                    })
                  }, 300)
                },
                fail: function (res) {
                  console.log(res);
                  tips.error(res.data.msg);
                }
              })
            } else {
              tips.loading("创建成功");
              that.setData({
                monry1: '',
                money2: '',
                num: '',
                marqueePace: 1,//滚动速度
                marqueeDistance: 0,//初始滚动距离
                marqueeDistance2: 0,
                marquee2copy_status: false,
                marquee2_margin: 60,
                size: 14,
                orientation: 'left',//滚动方向
                interval: 40, // 时间间隔
              })
                // 余额支付成功跳转
                wx.navigateTo({
                  url: '../inform/inform?red_id=' + res.data.data.finished
                })
            }

          } else {
            tips.alert(res.data.msg)
          }
        }
      })
    }else if (style == 'voice') { //语音红包
      let play = that.data.play;
      if (!that.data.shuo && !that.data.speakmove) {
        tips.alert("您没有设置口令");
        return false;
      }
      // 玩法
      if (play == true) {
        if (!that.data.money1) {
          tips.alert("您没有填写金额");
          return false;
        }
        console.log("play拼:", play);
        inform = {
          money: that.data.money1,
          count: that.data.num,
          content: that.data.speakmove,
          form_id: form_id + Math.random() * 10 + 1,
          type: 'random',
          count_down: that.data.count_down,
          is_public: that.data.commonInx
        }
      } else {
        console.log("play普:", play);
        if (!that.data.money2) {
          tips.alert("您没有填写金额");
          return false;
        }
        inform = {
          money: that.data.money2 * that.data.num,
          count: that.data.num,
          content: that.data.speakmove,
          form_id: form_id + Math.random() * 10 + 1,
          type: 'average',
          count_down: that.data.count_down,
          is_public: that.data.commonInx
        }
      }
      //  语音
      wx.request({
        url: apiurl + "red/create-voice-red?sign=" + sign + '&operator_id=' + app.data.kid,
        data: inform,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          console.log("语音红包:", res);
          if (res.data.status == '1') {
            if (res.data.data.finished == false) {//余额不足 
              let params = res.data.data.params;
              // 调用支付
              wx.requestPayment({
                timeStamp: res.data.data.params.timeStamp,
                nonceStr: res.data.data.params.nonceStr,
                package: res.data.data.params.package,
                signType: res.data.data.params.signType,
                paySign: res.data.data.params.paySign,
                'success': function (res) {
                  // 获取red_id
                  wx.request({
                    url: apiurl + "red/go-new-red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
                    header: {
                      'content-type': 'application/json'
                    },
                    method: "GET",
                    success: function (res) {
                      console.log("红包详情:", res);
                      console.log(res.data.data);
                      that.setData({
                        red_id: res.data.data,
                        monry1: '',
                        money2: '',
                        num: '',
                        marqueePace: 1,//滚动速度
                        marqueeDistance: 0,//初始滚动距离
                        marqueeDistance2: 0,
                        marquee2copy_status: false,
                        marquee2_margin: 60,
                        size: 14,
                        orientation: 'left',//滚动方向
                        interval: 40, // 时间间隔
                      })
                    }
                  })
                  setTimeout(function () {
                    // 微信支付成功跳转
                    wx.navigateTo({
                      url: '../inform/inform?red_id=' + that.data.red_id
                    })
                  }, 300)
                },
                fail: function (res) {
                  console.log(res);
                  tips.error(res.data.msg);
                }
              })
            } else {
              tips.loading("创建成功");
              that.setData({
                monry1: '',
                money2: '',
                num: ''
              }),
                // 余额支付成功跳转
                wx.navigateTo({
                  url: '../inform/inform?red_id=' + res.data.data.finished
                })
            }

          } else {
            tips.alert(res.data.msg)
          }
        }
      })
      
    } else if (style == 'face'){
      let play = that.data.play;
      console.log(that.data.word, that.data.wenzi);
      if (!that.data.face && !that.data.yanzhi) {
        tips.alert("您没有设置文字");
        return false;
      }
      // 玩法
      if (play == true) {
        if (!that.data.money1) {
          tips.alert("您没有填写金额");
          return false;
        }
        if (that.data.money1 < that.data.num) {
          tips.alert("每人获得打赏不得低于1元");
          return false;
        }
        console.log("play拼:", play, that.data.face);
        inform = {
          money: that.data.money1,
          count: that.data.num,
          content: that.data.faces,
          form_id: form_id + Math.random() * 10 + 1,
          type: 'random',
          count_down: that.data.count_down,
          is_public: that.data.commonInx
        }
      } else {
        console.log("play普:", play, that.data.faces);
        if (!that.data.money2) {
          tips.alert("您没有填写金额");
          return false;
        }
        if (that.data.money2 < 1) {
          tips.alert("每人获得打赏不得低于1元");
          return false;
        }
        inform = {
          money: that.data.money2 * that.data.num,
          count: that.data.num,
          content: that.data.faces,
          form_id: form_id + Math.random() * 10 + 1,
          type: 'average',
          count_down: that.data.count_down,
          is_public: that.data.commonInx
        }
      }
      //颜值
      wx.request({
        url: apiurl + "red/create-facepk-red?sign=" + sign + '&operator_id=' + app.data.kid,
        data: inform,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          console.log("颜值红包:", res);
          if (res.data.status == '1') {
            if (res.data.data.finished == false) {//余额不足 
              let params = res.data.data.params;
              // 调用支付
              wx.requestPayment({
                timeStamp: res.data.data.params.timeStamp,
                nonceStr: res.data.data.params.nonceStr,
                package: res.data.data.params.package,
                signType: res.data.data.params.signType,
                paySign: res.data.data.params.paySign,
                'success': function (res) {
                  // 获取red_id
                  wx.request({
                    url: apiurl + "red/go-new-red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
                    header: {
                      'content-type': 'application/json'
                    },
                    method: "GET",
                    success: function (res) {
                      console.log("红包详情:", res);
                      console.log(res.data.data);
                      that.setData({
                        red_id: res.data.data,
                        monry1: '',
                        money2: '',
                        num: ''
                      })
                    }
                  })
                  setTimeout(function () {
                    // 微信支付成功跳转
                    wx.navigateTo({
                      url: '../inform/inform?red_id=' + that.data.red_id
                    })
                  }, 300)
                },
                fail: function (res) {
                  console.log(res);
                  tips.error(res.data.msg);
                }
              })
            } else {
              tips.loading("创建成功");
              that.setData({
                monry1: '',
                money2: '',
                num: ''
              }),
                // 余额支付成功跳转
                wx.navigateTo({
                  url: '../inform/inform?red_id=' + res.data.data.finished
                })
            }

          } else {
            tips.alert(res.data.msg)
          }
        }
      })
    }
    that.setData({
        word: "",
        money1: "",
        money2: "",
        num: '',
        marqueePace: 1,//滚动速度
        marqueeDistance: 0,//初始滚动距离
        marqueeDistance2: 0,
        marquee2copy_status: false,
        marquee2_margin: 60,
        size: 14,
        orientation: 'left',//滚动方向
        interval: 40 // 时间间隔
    })
  },
  //事件处理函数text
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(this.data.textList[e.detail.value]);
    this.setData({
      wenzi: e.detail.value,
      word: this.data.textList[e.detail.value],
      options: true
    })
  },
  // 文字
  word(e) {
    this.setData({
      word: e.detail.value
    })
    console.log("word:", e.detail.value);
  },
  //事件处理函数array
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexCount: e.detail.value
    })
  },
  //事件处理函数speak语音口令
  bindPickerChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      shuo: e.detail.value,
      speakmove: this.data.speak[e.detail.value],
      speakAll: true
    })
  },
  // 事件处理函数face颜值口令
  bindPickerChange4: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(this.data.faceList[e.detail.value]);
    this.setData({
      yanzhi: e.detail.value,
      faces: this.data.faceList[e.detail.value],
      options: true
    })
  },
  //事件处理函数common是否公开
  bindPickerChange5: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      commonInx: e.detail.value
    })
  },
  // face
  face(e) {
    this.setData({
      faces: e.detail.value
    })
    console.log("faces:", e.detail.value);
  },
  
  // 语音口令
  speakmove(e) {
    this.setData({
      speakmove: e.detail.value
    })
  },
  //事件处理函数niceimg
  seeImg: function () {
    this.setData({
      marqueePace: 1,//滚动速度
      marqueeDistance: 0,//初始滚动距离
      marqueeDistance2: 0,
      marquee2copy_status: false,
      marquee2_margin: 60,
      size: 14,
      orientation: 'left',//滚动方向
      interval: 40 // 时间间隔
    })
    wx.navigateTo({
      url: '../niceimg/niceimg'
    })
  },
  // 总金额  拼
  money1(e) {
    this.setData({
      money1: e.detail.value,
      service: (e.detail.value * 0.02).toFixed(2)
    })
  },
  // 单个金额 普
  money2(e) {
    this.setData({
      money2: e.detail.value,
      service: ((e.detail.value * this.data.num) * 0.02).toFixed(2)
    })
  },
  // 数量
  num(e) {
    let that = this;
    if (this.data.play == true){  //拼
      this.setData({
        num: e.detail.value
      })
    } else {  //普
      this.setData({
        num: e.detail.value,
        service: ((this.data.money2 * e.detail.value) * 0.02).toFixed(2)
      })
    }
     
  },
  
  phone:function(){
    var that = this;
    wx.chooseImage({ 
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({ //上传图片
          url: apiurl + "red/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid,
          data:{
            file: tempFilePaths
          },
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log(res);
            let data = JSON.parse(res.data);
            if (data.status == 1){
              tempFilePaths = data.data;
              that.setData({
                tempFilePaths: data.data
              })
            }else{
               tips.alert(res.data.msg)
            }
           
          }
        })
      }
    })
  }

})
