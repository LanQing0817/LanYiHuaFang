import {
  userBehavior
} from './behavior'
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import {reqUserInfo,reqUpdateUserInfo} from '../../../../api/user'
import userStore from '../../../../stores/userStore'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    avatarUrl:'/static/images/avatar.png',
    isShowPopup: false, // 控制更新用户昵称的弹框显示与否
    userInfo:{
      nickname:'',
      headimgurl:''
    }
  },
  onLoad(options){
    console.log('onLoad---')
    createStoreBindings(this,{
      store: userStore,
      fields:['userInfo'],
      actions:['setUserInfo']
    })
  },
  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  },
  // 更新用户头像
  chooseAvatar(event) {
    console.log(event)

    // 获取头像的临时路径
    // 临时路径具有失效时间，需要将临时路径上传到公司的服务器，获取永久的路径
    // 在获取永久路径以后，需要使用永久路径更新 headimgurl
    // 用户点击 保存按钮，才算真正的更新了头像和昵称
    const {
      avatarUrl
    } = event.detail

    this.setData({
      'userInfo.headimgurl': avatarUrl
    })
  },
  // 获取用户头像信息
  getAvatar(e) {

    // 获取选中的头像
    const {
      avatarUrl
    } = e.detail

    wx.uploadFile({
      url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
      filePath: avatarUrl,
      name: 'file',
      header: {
        token: wx.getStorageSync('token'),
      },
      success: (res) => {
        // 将获取到的头像赋值给 data 中变量同步给页面结构
        const uploadRes = JSON.parse(res.data)
        this.setData({
          'userInfo.headimgurl': uploadRes.data
        })
      },
      fail(err) {
        wx.showToast({
          title: '头像更新失败，请稍后再试',
          icon: 'none'
        })
      }
    })

  },
  // 更新用户信息
  async updateUserInfo(){
    // 调用API,更新用户信息
    await reqUpdateUserInfo(this.data.userInfo)
    // 将用户信息存储到本地
    wx.setStorageSync('userInfo', this.data.userInfo)
    // 将用户信息存储到store
    console.log('this.setUserInfo')
    this.setUserInfo(this.data.userInfo)
    // 给用户提示头像更新成功
    wx.showToast({
      title: '头像更新成功',
      icon:'none'
    })
  },
  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true
    })
  },

  // 获取最新的用户昵称
  getNewName(e) {
    // 获取用户输入的最新的昵称
    const { nickname } = e.detail.value

    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },
  // 取消更新用户昵称
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  }
})