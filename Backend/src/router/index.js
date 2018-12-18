import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

import '@/icons' // icon

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            component: () => import('@/views/login/index'),
            hidden: true
        },
        {
            path: '/',
            component: Layout,
            redirect: '/dashboard',
            children: [{
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: {title: '后台首页', icon: 'el-icon-news'}
            }]
        },
        {
            path: '/user',
            component: Layout,
            redirect: '/user/index',
            children: [
                {
                    path: 'index',
                    name: 'user',
                    component: () => import('@/views/user/index'),
                    meta: {title: '用户管理', icon: 'el-icon-rank'}
                }
            ]
        },
        {
            path: '/menu',
            component: Layout,
            redirect: '/menu/index',
            children: [
                {
                    path: 'index',
                    name: 'menu',
                    component: () => import('@/views/menu/index'),
                    meta: {title: '套题管理', icon: 'el-icon-menu'}
                }
            ]
        },
        {
            path: '/question',
            component:Layout,
            redirect:'/question/index',
            children:[
                {
                    path:'index',
                    name:'question',
                    component:()=> import('@/views/question/index'),
                    meta:{title:'题目管理',icon:'el-icon-tickets'}
                }
            ]
        },
        {
            path:'/import',
            component:Layout,
            redirect:'/import/index',
            children:[
                {
                    path:'index',
                    name:'import',
                    component:()=> import('@/views/import/index'),
                    meta:{title:'题目导入',icon:'el-icon-upload'}
                }
            ]
        },
        {
            path:'/setting',
            component:Layout,
            redirect:'/setting/index',
            children:[
                {
                    path:'index',
                    name:'setting',
                    component:()=>import('@/views/setting/index'),
                    meta:{title:'设置',icon:'el-icon-setting'}
                }
            ]
        }
    ]
})
