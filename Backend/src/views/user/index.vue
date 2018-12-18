<template>
    <div id="user">
        <div class="header-search">
            <el-input v-model="nickName" size="small" style="width: 200px;" placeholder="搜索用户昵称"></el-input>
            <el-button size="small" @click="_getUserInfo(nickName)">搜索</el-button>
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
    </div>
</template>

<script>
    export default{
        data() {
            return {
                loading:false,
                nickName:'',
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
                            prop:'avatarUrl',
                            label:'头像',
                            type:'image'
                        },
                        {
                            prop:'nickName',
                            label:'微信昵称'
                        },
                        {
                            prop:'createdAt',
                            label:'注册日期'
                        }
                    ],
                    control:[
                        {
                            type:'delete',
                            name:'删除'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.loading = true
            this._getUserInfo()
        },
        methods:{
            _getUserInfo(nickName){
                var user = this.$Bmob.Query('_User')
                if(nickName){
                    user.equalTo("nickName", "==", nickName);
                }
                user.count().then(res =>{
                    this.pageSetting.total = res
                    user.limit(this.pageSetting.pageSize)
                    user.skip(this.pageSetting.pageSize * (this.pageSetting.currentPage - 1))
                    user.find().then(res1 =>{
                        console.log(res1)
                        this.tableSetting.tableData = res1
                        this.loading = false
                    })
                })
            },
            handleCurrentChange(val){
                console.log(`当前页: ${val}`)
                this.pageSetting.currentPage = val
                this.loading = true
                this._getUserInfo()
            },
            handleSizeChange(val){
                console.log(`每页 ${val} 条`)
                this.pageSetting.currentPage = val
                this.loading = true
                this._getUserInfo()
            },
            handlecontrol(params){
                console.log(params)
                if(params.item.type === 'delete'){
                    this.delete(params.scope)
                }
            },
            delete(scope){
                this.$confirm('确定删除此用户','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.loading = true
                    var query = this.$Bmob.Query('_User')
                    query.destroy(scope.row.objectId).then(res=>{
                        if(res.msg == 'ok'){
                            this._getUserInfo()
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
            }
        }
    }

</script>
