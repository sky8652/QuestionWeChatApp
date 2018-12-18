<template>
    <div id="menu">
        <div class="header-search">
            <el-input v-model="name" size="small" style="width: 200px;" placeholder="搜索套题名称"></el-input>
            <el-button size="small" @click="_getMenuInfo(name)">搜索</el-button>
            <el-button size="small" @click="dialogVisible = true">新增套题</el-button>
        </div>
        <tablelist :loading="loading" :table-setting="tableSetting" @control="handlecontrol"></tablelist>

        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageSetting.currentPage"
                    :page-size="pageSetting.pageSize"
                    layout="total,prev, pager, next, jumper"
                    :total="pageSetting.total">
            </el-pagination>
        </div>
        <!--新增对话框-->
        <el-dialog title="新增套题" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" size="small" style="width:200px"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-left: 80px;margin-top: 30px;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!--修改对话框-->
        <el-dialog title="修改套题" :visible.sync="dislogEditVisible" width="30%">
            <div>
                <el-form :model="editForm" :rules="editrules" ref="editForm" label-width="80px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="editForm.name" size="small" style="width:200px"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-left: 80px;margin-top: 30px;">
                <el-button @click="dislogEditVisible = false">取 消</el-button>
                <el-button type="primary"  @click="submitEditForm('editForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
    export default {
        components: {ElDialog},
        data(){
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入套题名称'));
                } else {
                    callback();
                }
            };
            return{
                loading:false,
                name:'',
                dialogVisible:false,
                dislogEditVisible:false,
                pageSetting:{
                    currentPage:1,
                    total:0,
                    pageSize:10
                },
                tableSetting:{
                    tableData:[],
                    column:[
                        {
                            prop:'objectId',
                            label:'objectId'
                        },
                        {
                            prop:'name',
                            label:'套题名称'
                        },
                        {
                            prop:'createdAt',
                            label:'添加日期'
                        }
                    ],
                    control:[
                        {
                            type:'edit',
                            name:'修改'
                        },
                        {
                            type:'delete',
                            name:'删除'
                        }
                    ]
                },
                form:{
                    name:''
                },
                editForm:{
                    name:''
                },
                rules:{
                    name:{validator:validateName ,trigger:'change' }
                },
                editrules:{
                    name: { validator: validateName, trigger: 'change' }
                },
            }
        },
        mounted(){
            this._getMenuInfo()
        },
        methods:{
            _getMenuInfo(name){
                this.loading = true
                var query = this.$Bmob.Query('questionMenu')
                if(name){
                    query.equalTo('name','==',name)
                }
                query.count().then(res=>{
                    console.log(res)
                    this.pageSetting.total = res
                    query.limit(this.pageSetting.pageSize)
                    query.skip(this.pageSetting.pageSize * (this.pageSetting.currentPage - 1))
                    query.order('-createdAt')
                    query.find().then(res1=>{
                        this.tableSetting.tableData = res1
                        this.loading = false
                    })
                })
            },
            handleSizeChange(val){
                this.loading = true
                this.pageSetting.currentPage = val
                this._getMenuInfo()
            },
            handleCurrentChange(val){
                this.loading = true
                this.pageSetting.currentPage = val
                this._getMenuInfo()
            },
            handlecontrol(params){
                console.log(params)
                if(params.item.type === 'delete'){
                    this.delete(params.scope)
                }else if(params.item.type === 'edit'){
                    this.handlesort(params.scope)
                }
            },
            delete(scope){
                this.$confirm('确定删除？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.loading = true
                    var query = this.$Bmob.Query('questionMenu')
                    query.destroy(scope.row.objectId).then(res=>{
                        if(res.msg == 'ok'){
                            this._getMenuInfo()
                            this.$message.success('操作成功')
                        }
                    })
                }).catch(()=>{
                    this.loading = false
                    this.$message({
                        type:'info',
                        message: '已取消删除'
                    })
                })
            },
            submitForm (formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.loading = true
                        var query = this.$Bmob.Query('questionMenu')
                        var query1 = this.$Bmob.Query('statistics')
                        query.set('name',this.form['name'])
                        query.save().then(res=>{
                            query1.set('menu',res.objectId)
                            query1.set('peopleNum',0)
                            query1.set('allScore',0)
                            query1.save()
                            this.loading = false
                            this._getMenuInfo()
                            this.form['name'] = ''
                            this.$message.success('添加成功')
                            this.dialogVisible = false

                        }).catch(err=>{
                            this.$message.error('添加失败')
                            this.dialogVisible = false
                            this.loading = false
                        })
                    }else{
                        return false
                    }
                })
            },
            handlesort(scope){
                console.log(scope)
                this.dislogEditVisible = true
                this.editForm.name = scope.row.name
                this.editForm.objectId = scope.row.objectId
            },
            submitEditForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        console.log("ttt")
                        this.loading = true
                        var query = this.$Bmob.Query('questionMenu')
                        query.set('id', this.editForm.objectId)
                        query.set('name',this.editForm.name)
                        query.save().then(res=>{
                            this.$message.success('修改成功')
                            this.dislogEditVisible = false
                            this._getMenuInfo()
                        }).catch(err=>{
                            this.$message.error('修改失败')
                            this.dislogEditVisible = false
                        })
                    }else{
                        console.log("trrrtt")
                        return false
                    }
                })
            }


        }
    }
</script>