import {bmob} from '@/api/bmobConfig.js'
import {Message} from 'element-ui'

import {getToken, setToken, removeToken} from '@/utils/auth'


const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        //登录
        Login({commit}, userInfo){
            return new Promise((resolve, reject) => {
                bmob().User.login(userInfo.username, userInfo.password).then(res => {
                    console.log(res)
                    const data = {token: 'admin'}
                    setToken(data.token)
                    commit('SET_TOKEN',data.token)
                    resolve()
                }).catch(err=>{
                    console.log(err)
                    Message.error("用户名或者密码错误")
                    reject(err);
                })
            })
        },
        GetInfo({ commit,state }){
            return new Promise((resolve,reject)=>{
                var data = {
                    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                    name: 'admin',
                    roles: ['admin']
                }
                if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    commit('SET_ROLES', data.roles)
                } else {
                    reject('getInfo: roles must be a non-null array !')
                }
                commit('SET_NAME',data.name)
                commit('SET_AVATAR',data.avatar)
                resolve(data)
            })
        },
        LogOut({ commit,state }){
            return new Promise((resolve,reject)=>{
                commit('SET_TOKEN','')
                commit('SET_RULES','')
                removeToken()
                resolve()
            })

        }
    }
}

export default user