<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <h3 class="title">管理后台</h3>
            <el-form-item prop="username">
                <span class="svg-container">
                    <i class="el-icon-message"></i>
                </span>
                <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username"/>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                  <i class="el-icon-menu"></i>
                </span>
                <el-input v-model="loginForm.password" name="password" type="password" auto-complete="on" placeholder="password"/>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                    登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'login',
        data(){
            const validateUserName = (rule,value, callback) => {
                if (!value) {
                    callback(new Error('请输入用户名'));
                } else {
                    callback()
                }
            }
            const validatePassWord = (rule,value, callback) => {
                if (!value.length) {
                    callback(new Error('请输入密码'));
                } else {
                    console.log("ttt")
                    callback()
                }
            }
            return {
                loginForm:{
                    username:'',
                    password:''
                },
                loginRules:{
                    username:[{ require:true,trigger: 'blur', validator: validateUserName  }],
                    password:[{ require:true,trigger: 'blur', validator: validatePassWord  }]
                },
                loading:false
            }
        },
//        watch:{
//            $route: {
//                handler: function(route) {
//                    this.redirect = route.query && route.query.redirect
//                },
//                immediate: true
//            }
//        },
        methods:{
            handleLogin(){
                console.log(this.$refs)
                this.$refs.loginForm.validate(valid=>{
                    if(valid){
                        this.loading = true
                        this.$store.dispatch('Login',this.loginForm).then(()=>{
                            this.loading = false
                            this.$router.push({path:this.redirect || '/'})
                        }).catch(() => {
                            this.loading = false
                        })
                    }else{
                        console.log('error')
                        return false
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b;
    $light_gray: #eee;

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: #fff !important;
                }
            }
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }

</style>

<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .login-container {
        background: #2d3a4b;
        height: 100%;
        width: 100%;
        position: fixed;
        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 520px;
            max-width: 100%;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }
        .title {
            font-size: 26px;
            font-weight: 400;
            color: #fff;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: #889aa4;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;
            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }
        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }
    }
</style>
