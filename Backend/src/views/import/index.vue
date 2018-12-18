<template>
    <div id="import">
        <div class="header-search">
           <input type="file" style="display:none;"  @change="importFile(this)" id="importFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            选择套题&nbsp;
            <el-select v-model="menu" placeholder="请选择" size="small">
                <el-option
                        v-for="item in menus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" />
            </el-select>
            <el-button size="small" @click="selectFile">导入题目</el-button>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    export default{
        data(){
            return{
                menu:'',
                menus:[],
                file:'',
                questions:[],
            }
        },
        mounted() {
            this._getMenus();
            this.file = document.getElementById('importFile')
        },
        methods:{
            _getMenus(){
                var menu = this.$Bmob.Query('questionMenu')
                menu.find().then(res =>{
                    console.log(res)
                    for (var i in res){
                        res[i].value = res[i].objectId
                        res[i].label = res[i].name
                        this.menus.push(res[i])
                    }
                })
            },
            selectFile(){
                console.log(this.menu)
                if(this.menu == ''){
                    this.$message.warning('请选择套题')
                    return
                }
                this.file.click()
            },
            importFile(){
                var fileArr = ['xlsx', 'xls']
                var obj = this.file
                var file = obj.files[0]
                var index = file.name.lastIndexOf('.')
                var ext = file.name.substr(index + 1)
                var exist = fileArr.indexOf(ext)
                var rABS = false; //是否将文件读取为二进制字符串
                var $t = this
                var outData;

                if(exist == -1){
                    this.$message.warning('请选择.xlsx , .xls 类型文件')
                    this.imgLoading = false
                    return
                }
                var reader = new FileReader();
                reader.onload = function(e){
                    var data = e.target.result
                    if(rABS){
                        $t.wb = XLSX.read(btoa(this.fixdata(data)),{//手动转化
                            type: 'base64'
                        })
                    }else{
                        $t.wb = XLSX.read(data, {
                            type: 'binary'
                        });
                    }
                    outData = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
                    console.log(outData.length)
                    $t.dealFile(outData)
                }
                if (rABS) {
                    reader.readAsArrayBuffer(file)
                } else {
                    reader.readAsBinaryString(file)
                }

            },
            dealFile(data){
                console.log(data)
                if(data.length <= 0){
                    this.$message.warning('请导入正确信息')
                    return
                }
                for(let d of data){
                    if(!d['题型']){
                        return this.$message.warning('导入文件，题型导入有误,请重新导入')
                    }

                    if(d['题目名称']){
                        d.title = d['题目名称']
                    }else{
                        return this.$message.warning('导入文件，题目名称导入有误,请重新导入')
                    }

                    if (d['帮助描述']) {
                        d.help = d['帮助描述']
                    }
                    if(d['图片链接']){
                        d.picUrl = d['图片链接']
                    }
                    d.choseList = []
                    for(let key in d){
                        if (key === '题型') {
                            switch (d[key]) {
                                case '单选题':
                                    d.type = '1'
                                    break
                                case '多选题':
                                    d.type = '2'
                                    break
                                default:
                                    this.$message.warning('暂无此题目类型')
                            }
                        }
                        if (key.indexOf('选项') !== -1) {
                            d.choseList.push({
                                item: d[key]
                            })
                        }
                    }

                    if (d['正确答案']) {
                        let index = d['正确答案'].split(',')
                        for (let i of index) {
                            if (d.choseList[i * 1 - 1]) {
                                d.choseList[i * 1 - 1].isChose = true
                            }
                        }
                    } else {
                        return this.$message.warning('导入文件，正确答案内容导入有误,请重新导入')
                    }
                    this.questions.push({
                        title: d.title,
                        help: d.help ? d.help : '',
                        type: d.type,
                        choseList: d.choseList,
                        picUrl: d.picUrl ? d.picUrl : '',
                    })
                }
                this.batchQuestions(this.questions)
            },
            batchQuestions(questions){
                console.log(questions)
                console.log(this.menu)
                this.$loading({
                    text: '数据导入中...'
                })

                const queryArray = new Array();
                for(let q of questions){
                    var queryObj = this.$Bmob.Query('questions');
                    for(let key in q){
                        queryObj.set(key,q[key])
                    }
                    queryObj.set('menu',this.menu)
                    queryArray.push(queryObj);
                }
                this.$Bmob.Query('questions').saveAll(queryArray).then(result => {
                    console.log(result);
                    this.$loading().close()
                    this.$message.success('导入成功')
                }).catch(err => {
                    console.log(err);
                });
            }

        }
    }
</script>