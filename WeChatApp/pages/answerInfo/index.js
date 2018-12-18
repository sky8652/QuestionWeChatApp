// pages/answerInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    time:'',
    questionMenu:'',
    questionNum:''
  },
  onLoad (e) {
    var id = e.id
    var questionMenu = e.questionMenu
    var time, questionNum
    wx.u.getSetting().then(res=>{
      for(let i in res.result){
        if(res.result[i].key == 'time'){
          time = res.result[i].value
        } else if (res.result[i].key == 'questionNum'){
          questionNum = res.result[i].value
        }
      }
      this.setData({
        id:id,
        time:time,
        questionMenu: questionMenu,
        questionNum:questionNum
      })
    })
  },
  start(){
    wx.redirectTo({
      url: '/pages/answer/index?id=' + this.data.id + '&questionMenu=' + this.data.questionMenu
    })
    
  }
})