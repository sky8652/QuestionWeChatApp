<template>
    <div id="setting">
        <div class="header-search">
            <el-form ref="ruleForm" :model="form" :rules="rules">
                <el-form-item label="答题时间(单位:分钟)" prop="time">
                    <el-input v-model="form.time" size="small" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="题目数量(最大值100)" prop="questionNum">
                    <el-input v-model="form.questionNum" size="small" style="width:200px"></el-input>
                </el-form-item>
                <el-button size="small" @click="handleSubmit('ruleForm')">保存设置</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            var validateNull = (rule,value,callback)=>{
                if(!value){
                    callback(new Error('该值不可为空'))
                }else{
                    callback()
                }
            }
            var validateCheck = (rule,value,callback)=>{
                if(!value){
                    callback(new Error('该值不可为空'))
                }else if(value > 100){
                    callback(new Error('最大值为100'))
                }else{
                    callback()
                }
            }
            return{
                form:{
                    time:'',
                    questionNum:''
                },
                rules:{
                    time:{validator:validateNull,trigger:'change'},
                    questionNum:{validator:validateCheck,trigger:'change'}
                }
            }
        },
        mounted(){
            this._getSetting();
        },
        methods:{
            _getSetting(){
                var setting = this.$Bmob.Query('setting')
                setting.order('-createdAt')
                setting.find().then(res=>{
                    console.log(res)
                    for(let r of res){
                        if(r.key === 'time'){
                            this.form.time = r.value
                        }
                        if(r.key === 'questionNum'){
                            this.form.questionNum = r.value
                        }
                    }
                    this.form.data = res
                })
            },
            handleSubmit(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){

                        for(let d of this.form.data){
                            var setting = this.$Bmob.Query('setting')
                            if(d.key === 'time'){
                                setting.set('id',d.objectId)
                                setting.set('value',this.form.time)
                                setting.save().then(res=>{

                                })
                            }
                            if(d.key === 'questionNum'){
                                setting.set('id',d.objectId)
                                setting.set('value',this.form.questionNum)
                                setting.save().then(res1=>{
                                    this.$message.success('保存成功')
                                })
                            }

                        }
                    }else{
                        return false
                    }

                })
            }
        }
    }
</script>