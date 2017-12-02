// pages/inform/inform.js
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
    type:'',
    askIndex: '',
    askcontents:'',
    finish:false,
    result:false,
    pintu:false,
    decide:false, //拼字是否成功
    depintu:false, //拼图是否成功
    clear:true,
    yuyin:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    star: false //播放
  },
  onReady: function (e) {
    let  yuyin = this.data.yuyin;
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioCtx.setSrc(yuyin)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //回调
    let sign = wx.getStorageSync('sign');
    common.getSign(function () {})
    console.log(options);
    let that = this;
    app.getAuth(function(){
      
    })
    let userInfo = wx.getStorageSync('userInfo');
    let red_id = options.red_id;
    if (red_id) {
        that.setData({
          userInfo: userInfo,
          red_id: options.red_id
        })
    }
    if (options.sharefriends){
      that.setData({
        sharefriends: 1
      })
    }
    // console.log("sharefriends:",that.data.sharefriends);
    // console.log(options.red_id);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      wx.showLoading({
        title: '加载中',
      });
      let that = this;
      app.getAuth(function(){
        let sign = wx.getStorageSync('sign');
        wx.request({
          url: apiurl + "red/red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
          data: {
            red_id: that.data.red_id
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("红包详情:", res);
            var status = res.data.status;
            if (status == 1) {
              that.setData({
                informList: res.data.data,
                member_info: res.data.data.member_info,
                receive_info: res.data.data.receive_info,
                red_info: res.data.data.red_info,
                red_status: res.data.data.red_status,
                types: res.data.data.red_info.red_type,
                count_down: res.data.data.red_info.count_down
              })
            } else {
              tips.alert(res.data.msg);
            }

            console.log("types", that.data.types);
          }
        })
        wx.hideLoading()
      })
      
  },
  //判断是否有types 
  formSubmit: function (e) {
    let form_id = e.detail.formId;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "red/save-form?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        form_id: form_id + Math.random() * 10 + 1,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        //console.log("form_id：:", res);
      }
    })
    if (form_id){
        this.setData({
          sharefriends: false
        })
    }
  },
  //提现
  money(e){
    wx.switchTab({
      url: '../money/money'
    })
  },
  //send
  send(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 分享
  share(e){
    wx.navigateTo({
      url: '../share/share?red_id=' + this.data.red_id
    })
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  //语音voice 
  voice(){
    console.log("voice");
    let that = this;
    let sign = wx.getStorageSync('sign');
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    
    tips.voice('录音中');
    //开始录音。当主动调用wx.stopRecord，
    //或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。
    //当用户离开小程序时，此接口无法调用。
    wx.startRecord({
      success: function (res) {
        wx.showLoading({
          title: '答案识别中',
        });
        //录音
        console.log('录音成功' + JSON.stringify(res));
        //上传语音文件至服务器
        wx.uploadFile({
          url: apiurl + "red/upload-audio?sign=" + sign + ' & operator_id=' + app.data.kid,
          filePath: res.tempFilePath,
          name: 'audio',
          formData: {
            'msg': 'audio'
          }, // HTTP 请求中其他额外的 form data
          success: function (res) {
            // success
            console.log('begin');
            let data = JSON.parse(res.data);
            console.log(data);
            console.log(data.status);
            if (data.status == 1) {
              let _vioce = data.data;
              that.setData({
                _vioce: data.data
              })
            } else {
              tips.alert(res.data.msg)
            }
            //
            console.log("_vioce:",that.data._vioce);
            console.log("_vioce00", that.data._vioce);

            wx.request({
              url: apiurl + "red/receive-red?sign=" + sign + '&operator_id=' + app.data.kid,
              data: {
                red_id: that.data.red_id,
                content: that.data._vioce
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("提交答案:", res);
                let status = res.data.status;
                if (status == 1) {
                  tips.alert('恭喜你');
                  setTimeout(function () {
                    that.setData({
                      result: false,
                      finish: false,
                      clear: true,
                      informList: res.data.data,
                      member_info: res.data.data.member_info,
                      receive_info: res.data.data.receive_info,
                      red_info: res.data.data.red_info,
                      red_status: res.data.data.red_status,
                      red_id: that.data.red_id
                    })
                  }, 300)
                  wx.redirectTo({
                    url: '../inform/inform?red_id=' + that.data.red_id
                  })
                } else {
                  console.log("语音：",res.data.msg);
                  tips.alert(res.data.msg);
                }
              }
            })
          },
          fail: function (err) {
            // fail
            console.log(err);
            tips.alert('录音失败')
          },
          complete: function () {
            // complete
          }
        })
      },
      fail: function (res) {
        //录音失败
        that.setData({
          voiceButtonName: '语音识别'
        })
        console.log('录音失败' + JSON.stringify(res));
      }
      
    })
  },
  live(){
    let that = this;
    let sign = wx.getStorageSync('sign');;
    setTimeout(function () {
        //结束录音  
        wx.stopRecord()
        
      }, 300)
    wx.hideLoading()
  },
  //领取
  receiver(){
    console.log("receiver");
    let that = this;
    let types = that.data.types;
    let sign = wx.getStorageSync('sign');
    //clearInterval(inter);
    if (that.data.decide == true) {
      tips.alert('您已经拼字成功');
      return;
    }
    if (that.data.clear){
      clearInterval(inter);
    }
    let count_down = that.data.red_info.count_down;
    //console.log("count_down", count_down);
    if (count_down>0){
      var inter = setInterval(function () {
        //console.log("count_down1", count_down);
         count_down -= 1;
          that.setData({
            count_down: count_down
          })
          if(that.data.finish){
            clearInterval(inter);
          }
          if (count_down <= 0) {
            clearInterval(inter);
            that.setData({
              finish: true,
              result: false,
              Tword: false,
              clearn:true
            })
          }
      }, 1000)
    }else{
      clearInterval(inter); 
      that.setData({
        finish: true,
        result: false,
        Tword: false
      })
    }
    // 拼字
    if(that.data.types="text"){
      let content =  that.data.red_info.content;
      let _contents = []; //大数组
      let _content = content.split(""); //文字
      var _contenta = [];
      for (var i = 0, len = _content.length; i < len; i++) {
        var j = Math.floor(Math.random() * _content.length);
        _contenta[i] = _content[j];
        _content.splice(j, 1);
      }
      console.log(_contenta,"_contenta");
      for (let i = 0; i < _contenta.length; i++) {
        var both = {};
        both.title = _contenta[i];
        both.active = false;
        _contents[i] = both;
      }
      console.log('_contents', _contents);
      that.setData({
        Tword:true,
        _contents: _contents,
        clear:true
      })
    } else if (that.data.types = "voice") {  //_vioce
     
    }
  },
//拼图img
  img(){
    wx.showLoading({
        title: '加载中',
      });
   
    let that = this;
    let sign = wx.getStorageSync('sign');
    let count_down = that.data.count_down;
    if (that.data.depintu == true) {
      tips.alert('您已经拼图成功');
      return;
    }
    if (count_down > 0) {
      var inter = setInterval(function () {
        count_down -= 1;
        that.setData({
          count_down: count_down
        })
        if (that.data.finish) {
          clearInterval(inter);
        }
        if (that.data.clear) {
          // clearInterval(inter);
        }
        if (count_down <= 0) {
          clearInterval(inter);
          that.setData({
            pintu: false,
            finish:true,
            result:false,
            clear:true
          })
        }
      }, 1000)
    } else {
      clearInterval(inter);
      that.setData({
        pintu: false
      })
    }
    that.setData({
      pintu:true
    })
    console.log("red_info.content", that.data.red_info.content);
    let geImg = that.data.red_info.content;
    that.setData({
      geImg: geImg,
      imgList: [
        { icon: "5", obj: "background:url("+geImg+") -192px -96px no-repeat;", height: "background-size:288px;height:96px;top:96px;" },

        { icon: "0", obj: "background: url(" + geImg +") 1px 1px no-repeat;", height: "background-size:288px;height:96px;top:1px;" },

        { icon: "3", obj: "background: url(" + geImg +") 1px -96px no-repeat;", height: "background-size:288px;height:96px;top:96px;" },

        { icon: "1", obj: "background: url(" + geImg +") -96px 1px no-repeat;", height: "background-size:288px;height:96px;top:1px;" },

        { icon: "2", obj: "background: url(" + geImg +") -192px 1px no-repeat;", height: "background-size:288px;height:96px;top:1px;" },

        { icon: "7", obj: "background: url(" + geImg +") -96px -192px no-repeat;", height: "background-size:288px;height:96px;top:191px;" },

        { icon: "6", obj: "background: url(" + geImg +") 1px -192px no-repeat;", height: "background-size:288px;height:96px;top:191px;" },

        { icon: "8", obj: "background: url(" + geImg +") -192px -192px no-repeat;", height: "background-size:288px;height:96px;top:191px;" },

        { icon: "4", obj: "background: url(" + geImg +") -96px -96px no-repeat;", height: "background-size:288px;height:96px;top:96px;" },
      ]
    })
    let right = [];
    let rightList = that.data.imgList;
    for (let i = 0; i < rightList.length; i++) {
      right.push(rightList[i].obj)
    }
    that.setData({
      right: right,
      rightList: rightList
    })
    console.log("right:", right)
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
        imgLists: shuffle(arr)
      })
    }
    let imgLists = that.data.imgLists;
    for (let i = 0; i < imgLists.length; i++) {
      //imgLists[i].obj = imgList[i].obj;
      imgList[i].obj = imgLists[i].obj
    }
    that.setData({
      imgList: imgList
    })
    wx.hideLoading()
  },

    //回答问题
    ask(e){
      let that = this;
      let index = e.currentTarget.dataset.index;
      let inx = that.data.inx;
      let _contents = that.data._contents;
      _contents[index].active = true;
      that.setData({
        _contents
      })
      // 答案
      let askcontents = that.data.askcontents;
          askcontents += _contents[index].title;
      that.setData({
        askcontents
      })
      console.log("askcontents:", askcontents);
      if (askcontents.length == that.data.red_info.content.length ){
        console.log("请求接口");
        wx.showLoading({
          title: '加载中',
        });
        let that = this;
        let sign = wx.getStorageSync('sign');
        wx.request({
          url: apiurl + "red/receive-red?sign=" + sign + '&operator_id=' + app.data.kid,
          data: {
            red_id: that.data.red_id,
            content: that.data.askcontents
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("提交答案:", res);
            let status = res.data.status;
            if (status==1){
              tips.alert('恭喜你');
              that.setData({
                finish: false,
                result: false,
                Tword:false,
                clear: true,
                depintu:true,
                decide:true,
                informList: res.data.data,
                member_info: res.data.data.member_info,
                receive_info: res.data.data.receive_info,
                red_info: res.data.data.red_info,
                red_status: res.data.data.red_status,
                red_id: that.data.red_id
              })
              
              setTimeout(function () {
                that.setData({
                  result: true,
                  finish: false,
                  decide: true,
                  clear: true
                })
              }, 2000)
              wx.redirectTo({
                url: '../inform/inform?red_id=' + that.data.red_id
              })
            }else{
              tips.alert(res.data.msg);
              that.setData({
                finish: false,
                result: true,
                Tword: false,
                clear: true,
                askcontents:'' //重置
              })
              wx.redirectTo({
                url: '../inform/inform?red_id=' + that.data.red_id
              })
            }
          }
        })
      //  wx.hideLoading()
      }
    },
  //again
  again(){
    let that = this;
    let _contents = that.data._contents;
    let count_down = that.data.red_info.count_down;
    console.log(_contents);
    clearInterval(inter); //先清除
    // Tword
    if (_contents){
        for (let i = 0; i < _contents.length; i++) {
          _contents[i].active = false;
        }
        that.setData({
          finish: false,
          Tword: true,
          askcontents: '',
          _contents
        })
    }else{
      // 随机pintu
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
          imgLists: shuffle(arr)
        })
      }
      let imgLists = that.data.imgLists;
      for (let i = 0; i < imgLists.length; i++) {
        //imgLists[i].obj = imgList[i].obj;
        imgList[i].obj = imgLists[i].obj
      }
      that.setData({
        finish: false,
        pintu:true,
        imgList: imgList
      })
      if (count_down<=0){
        that.setData({
          finish: true,
          result:false,
          pintu: false,
          imgList: imgList,
          clear:true
        })
      }
    }
    //倒计时
    console.log("again:", count_down);
    if (count_down > 0) {
      console.log("decide:", that.data.decide)
      let pintu = that.data.pintu;
      if (that.data.decide== true){  //拼字成功
         clearInterval(inter);
         that.setData({
           finish: false,
           result: true,
           Tword: false
         })
      }else{
        var inter = setInterval(function () {
          count_down -= 1;
          console.log(count_down);
          that.setData({
            count_down: count_down
          })
          if (count_down <= 0) {
            clearInterval(inter);
            console.log("Tword:", count_down);
            that.setData({
              finish: true,
              result: false,
              Tword: false,
              clear: true
            })
          }
          console.log("depintu", that.data.depintu);
          if (that.data.depintu == true) { //拼图成功
            console.log("pintu:", count_down);
            clearInterval(inter);
            that.setData({
              finish: false,
              result: true,
              pintu: false,
              clear: true
            })
          }
        }, 1000)
      }
    } else {
      clearInterval(inter);
      that.setData({
        finish: false,
        result: false,
        Tword: false,
        clear: true
      })
    }
  },
  //close
  close(){
    let that = this;
    let _contents = that.data._contents;
    if (_contents){
      for (let i = 0; i < _contents.length; i++) {
        _contents[i].active = false;
      }
      that.setData({
        finish: false,
        Tword: false,
        askcontents: '',
        clear: true,
        _contents
      })
    }else{
      that.setData({
        finish: false,
        pintu:false,
        clear: true
      })
    }
    
  },
  //关闭音乐
  closeAudio(){
    // wx.stopBackgroundAudio()
  },
  // 预览拼图图片
  prewImg() {
    wx.showLoading({
       title: '加载中',
    });
    wx.previewImage({
      current: '' + this.data.red_info.content + '', // 当前显示图片的http链接
      urls: ['' + this.data.red_info.content + ''] // 需要预览的图片http链接列表
    })
    wx.hideLoading()
  },
  phone: function () {
    var that = this;
    let sign = wx.getStorageSync('sign');
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({ //上传图片
          url: apiurl + "red/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid,
          data: {
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
            if (data.status == 1) {
              tempFilePaths = data.data;
              that.setData({
                tempFilePaths: data.data
              })
              tips.alert('颜值评分中');
              wx.request({
                url: apiurl + "red/receive-red?sign=" + sign + '&operator_id=' + app.data.kid,
                data: {
                  red_id: that.data.red_id,
                  content: that.data.tempFilePaths
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                 // wx.hideLoading()
                  console.log("提交答案:", res);
                  let status = res.data.status;
                  if (status == 1) {
                    tips.success('颜值爆棚');
                   } else {
                    tips.alert(res.data.msg);
                    wx.request({
                      url: apiurl + "red/red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
                      data: {
                        red_id: that.data.red_id
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      method: "GET",
                      success: function (res) {
                        console.log("红包详情:", res);
                        var status = res.data.status;
                        if (status == 1) {
                          that.setData({
                            informList: res.data.data,
                            member_info: res.data.data.member_info,
                            receive_info: res.data.data.receive_info,
                            red_info: res.data.data.red_info,
                            red_status: res.data.data.red_status,
                            types: res.data.data.red_info.red_type,
                            count_down: res.data.data.red_info.count_down
                          })
                        } else {
                          wx.redirectTo({
                            url: '../inform/inform?red_id=' + that.data.red_id
                          })
                        }
                        console.log("types", that.data.types);
                      }
                    })
                  }
                }
              })
            } else {
              that.setData({
                red_status: 'wait'
              })
              tips.alert(res.data.msg);
              console.log("types", that.data.msg + '1111');
              wx.redirectTo({
                url: '../inform/inform?red_id=' + that.data.red_id
              })
            }

          }
        })
      }
    })
  },
  setting(){
    this.setData({
        can_set:true,
        flag:1
    })
  },
  quxiao(){
    this.setData({
      can_set: false,
      flag:0
    })
  },
  can_set(){
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "red/change-image-status?sign=" + sign + '&operator_id=' + app.data.kid,
      data:{
        r_id : that.data.r_id,
        flag: that.data.flag	
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("图片是否发起者可见:", res);
        var status = res.data.status;
        if (status == 1) {
          tips.success("设置成功");
          that.setData({
            can_set: false
          })

        } else {
          tips.alert(res.data.msg);
        }
      }
    })
  },
  // 预览图片
  nicephone(e) {
    let nicephone = e.currentTarget.dataset.nicephone;
    console.log(nicephone);
    wx.previewImage({
      current: 'nicephone', // 当前显示图片的http链接
      urls: [''+nicephone+''] // 需要预览的图片http链接列表
    })
  },
  // 拼图
  moveimg(e) {
    let that = this;
    let sign = wx.getStorageSync('sign');
    console.log(e);
    let imgList = that.data.imgList;
    let pic = that.data.pic;
    let idx = that.data.index;
    let obj = that.data.obj;
    console.log(idx);
    console.log(obj);
    // index obj

    if (obj == undefined) {
      let currentIdx = e.currentTarget.dataset.index; //index
      //let currentPic = e.currentTarget.dataset.pic; 
      let currentObj = e.currentTarget.dataset.obj;  //img
      that.setData({
        //pic: currentPic,
        currentIdx: currentIdx,
        index: currentIdx,
        obj: currentObj
      })
    } else {
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
        obj: undefined
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
      wx.request({
          url: apiurl + "red/receive-red?sign=" + sign + '&operator_id=' + app.data.kid,
          data: {
            red_id: that.data.red_id,
            content: that.data.geImg
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            // wx.hideLoading()
            let status = res.data.status;
            if (status == 1) {
              tips.success('拼图成功');
              wx.request({
                url: apiurl + "red/red-detail?sign=" + sign + '&operator_id=' + app.data.kid,
                data: {
                  red_id: that.data.red_id
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  tips.success('拼图成功');
                  console.log("拼图成功详情:", res);
                  that.setData({
                    result: true,
                    clear: true,
                    finish: false,
                    depintu:true
                  })
                  setTimeout(function () {
                    that.setData({
                      pintu: false,
                      finish: false,
                      depintu : true
                    })
                  }, 3000)
                }
              })
              wx.redirectTo({
                url: '../inform/inform?red_id=' + that.data.red_id
              })
            } else {
              tips.alert(res.data.msg);
              that.setData({
                result:false,
                pintu: false,
                finish: false
              })
            }
          }
      })
    }else {}
  },
  //设置分享
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
  
  audioPlay: function (e) {
    console.log(e,111);
    let that = this;
    let yuyin = that.data.yuyin;
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    console.log(yuyin, "yuyin:");
    console.log("star:", that.data.star);
    that.audioCtx.play();
    that.setData({
      //star: true
    })
  },
  audioPause: function (e) {
    let that = this;
    console.log(e, 222);
    that.audioCtx.pause();
    that.setData({
      star: false
    })
  }
})