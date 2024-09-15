import './utils/extendApi'
import {setStorage,getStorage,removeStorage,clearStorage} from './utils/storage'
App({
  async onShow(){
    setStorage('name','兰青')
  }
})
