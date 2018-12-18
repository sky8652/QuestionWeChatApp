import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

const whiteList = ['/login'] //不重定向url

router.beforeEach((to,from,next)=>{
    console.log("19")
    NProgress.start()
    if(getToken()){
        console.log("getToken")
        console.log(getToken())
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        }else{
            if(store.getters.roles.length === 0){
                store.dispatch('GetInfo').then(res=>{
                    next()
                })
            }else {
                next()
            }
        }
    }else{
        if(whiteList.indexOf(to.path) !== -1){
            next()
        }else{
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }

})

router.afterEach(()=>{
    NProgress.done()
})