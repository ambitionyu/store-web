<template>
    <PageHeaderLayout>
        <a-card :bordered="false">
            <a-row :gutter="8">
                <a-col :span="20">
                    <a-table
                        :columns="tableConfig.columns"
                        :dataSource="tableConfig.dataSource"
                        rowKey="biddingId"
                        :pagination="pagination"
                        @change="pageChange"
                    >
                        <template slot="detail" slot-scope="text, record,index">
                            <a href="javascript:;" @click="getDetail(text, record,index)">详情</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>
        <a-modal
            title="详情"
            :visible="visible"
            @ok="()=>{this.visible = false}"
            @cancel="()=>{this.visible = false}"
        >
            <div v-for="(v,k) in modalData" :key="k">
                <div>
                    {{v.name+v.price+'元/'+v.unit+'共'+v.count+v.unit}}
                </div>
            </div>
        </a-modal>
    </PageHeaderLayout>
</template>

<script>
    import StandardTable from "@/components/StandardTable";
    import PageHeaderLayout from "../../layouts/PageHeaderLayout";
    import {post} from "../../utils/http";
    export default {
        name: "Order",
        mounted(){
            post('/goods/getOrders')
                .then(res=>{
                    this.savedData = res
                    this.tableConfig.dataSource = res
                })
        },
        data(){
            return {
                visible:false,
                savedData:[],
                modalData:[],
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
                            title: '时间',
                            dataIndex: 'time',
                        },
                        {
                            title: '供应商名',
                            dataIndex: 'supplierName',
                        },
                        {
                            title: '状态',
                            dataIndex: 'status',
                        },
                        {
                            title: '总价',
                            dataIndex: 'price',
                        },
                        {
                            title: '分类',
                            dataIndex: 'className',
                        },
                        {
                            title: '详情',
                            dataIndex: 'detail',
                            scopedSlots: { customRender: 'detail' },
                        },
                    ]
                },
            }
        },
        methods:{
            pageChange(pagination, filters, sorter, { currentDataSource }){
                this.pagination.current = pagination.current
            },
            getDetail(text, record,index){
                this.visible = true
                this.modalData = JSON.parse(text)
            }
        },
        components:{
            PageHeaderLayout,
            StandardTable
        }
    }
</script>

<style scoped>

</style>
