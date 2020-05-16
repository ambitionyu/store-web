<template>
    <PageHeaderLayout>
        <a-card :bordered="false">
            <a-row :gutter="8">
                <a-col :span="18">
                    <a-table
                        @change="pageChange"
                        rowKey="requireId"
                        :columns="tableConfig.columns"
                        :pagination="pagination"
                        :dataSource="tableConfig.dataSource"
                    >
                        <template slot="operation" slot-scope="text, record,index">
                            <a href="javascript:;" @click="handleClick(record)">查看操作</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>
        <Drawer v-model="drawerShow" width="600"
                title="审核需求"
                placement="right"
                :closable="true"
                @close="()=>{this.drawerShow = false}"
                :visible="drawerShow">
                食堂名:{{drawerData.name +"窗口名:"+drawerData.windowNum  +"用户名:"+drawerData.userName}}
                <a-table
                    rowKey="itemId"
                    :dataSource="drawerData.itemInf"
                    :pagination="pagination2"
                         @change="(pagination)=>{this.addPagination.current = pagination.current}"
                         :columns="columns"
                ></a-table>
            <a-input addonBefore="拒绝原因" v-model="rejectReason"></a-input><br/>
            <a-button @click="unPass(drawerData.requireId)" type="danger">拒绝</a-button>
            <a-button type="primary" @click="pass(drawerData.requireId)">通过</a-button>
        </Drawer>
    </PageHeaderLayout>
</template>

<script>
    import StandardTable from "@/components/StandardTable";
    import PageHeaderLayout from "../../layouts/PageHeaderLayout";
    import {Drawer,message} from 'ant-design-vue'
    export default {
        name: "Require",
        components:{
            PageHeaderLayout,
            StandardTable,
            Drawer,
            message,
        },
        mounted(){
            this.$store.dispatch('require/adminGetRequire')
                .then(res=>{
                    this.tableConfig.dataSource = res
                    this.savedData = res
                })
        },
        methods:{
            pass(requireId){
                this.$store.dispatch('require/updateRequire',{requireId:requireId,status:2})
                    .then(res=>{
                        if(res===1){
                            message.success('修改成功');
                        }else{
                            message.error("修改失败")
                        }
                        this.drawerShow=false
                        this.$store.dispatch('require/adminGetRequire')
                            .then(res=>{
                                this.tableConfig.dataSource = res
                                this.savedData = res
                            })
                    })
            },
            unPass(requireId){
                this.$store.dispatch('require/updateRequire',{requireId:requireId,status:0,rejectReason:this.rejectReason})
                    .then(res=>{
                        if(res===1){
                            message.success('修改成功');
                        }else{
                            message.error("修改失败")
                        }
                        this.drawerShow=false
                        this.rejectReason= ""
                        this.$store.dispatch('require/adminGetRequire')
                            .then(res=>{
                                this.tableConfig.dataSource = res
                                this.savedData = res
                            })
                    })
            },
            handleClick(record){
                this.drawerData = record;
                if((typeof record.itemInf)==='string')
                this.drawerData.itemInf =JSON.parse(record.itemInf);
                this.drawerShow = true;
                console.log(this.drawerData)
            },
            pageChange(pagination, filters, sorter, { currentDataSource })
            {
                if(filters.hasOwnProperty("operation")){
                    if(filters.operation.length>0){
                        if(filters.operation[0]==='pass'){
                            this.tableConfig.dataSource = this.savedData.filter(i=>{return i.status ===2})
                        }else if(filters.operation[0]==='unPass'){
                            this.tableConfig.dataSource = this.savedData.filter(i=>{return i.status ===0})
                        }else if(filters.operation[0]==='wait'){
                            this.tableConfig.dataSource = this.savedData.filter(i=>{return i.status ===1})
                        }
                    }else{
                        this.tableConfig.dataSource = this.savedData
                    }
                }
                this.pagination.current = pagination.current
            }
        },
        data(){
            return{
                rejectReason:"",
                columns:[
                    {
                        title: '食物名称',
                        dataIndex: 'itemName',

                    },
                    {
                        title: '数量',
                        dataIndex: 'count',
                    },
                ],
                pagination2:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
                drawerData:[],
                drawerShow:false,
                savedData:[],
                pagination:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
                tableConfig:{
                    dataSource:[],
                    columns:[
                        {
                            title: '食堂/仓库名',
                            dataIndex: 'name',
                        },
                        {
                            title: '窗口名',
                            dataIndex: 'windowNum',
                        },
                        {
                            title: '用户名',
                            dataIndex: 'userName',
                        },
                        {
                            title: '时间',
                            dataIndex: 'createTime',
                        },
                        {
                            title: '查看&操作',
                            dataIndex: 'operation',
                            scopedSlots: { customRender: 'operation' },
                            filterMultiple: false,
                            filters: [
                                {
                                    text: '通过',
                                    value: 'pass',
                                }, {
                                    text: '未通过',
                                    value: 'unPass',
                                },
                                {
                                    text: '待审核',
                                    value: 'wait',
                                }
                            ],
                        },

                    ]
                }
            }
        }

    }
</script>

<style scoped>

</style>
