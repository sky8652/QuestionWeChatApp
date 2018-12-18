<template>
    <div id="Tablelist">
        <el-table v-loading="loading" :data="tableSetting.tableData" style="width: 100%">
            <el-table-column v-for="item in tableSetting.column"  :prop="item.prop" :label="item.label" :key="item.prop">
                <template slot-scope="scope" >
                    <div v-if="item.type === 'image'">
                        <img :src="scope.row[item.prop]" alt="" style="height: 50px;width:50px;border-radius:5px;">
                    </div>

                    <div v-else>
                        {{ scope.row[item.prop] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="tableSetting.control"
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <div v-for="citem in tableSetting.control" :key="citem.type">
                            <el-button v-if="citem.key" type="text" size="small" @click="handlecontrol(scope, citem)">{{ Boolean(scope.row[citem.key] * 1) ? citem.falsename : citem.name }}</el-button>
                            <el-button v-else type="text" size="small" @click="handlecontrol(scope, citem)">{{ citem.name }}</el-button>
                        </div>
                    </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props:{
            tableSetting:{
                type:Object,
                default:()=>{
                    return {}
                }
            },
            loading:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            handlecontrol(scope, citem) {
                var params = {
                    scope: scope,
                    item: citem
                }
                this.$emit('control', params)
            }
        }
    }
</script>