<template>
    <PageHeaderLayout>
        <a-card :bordered="false">
            <a-row :gutter="8">
                <a-col :span="20">
                    <a-table
                        @change="pageChange"
                        :columns="tableConfig.columns"
                        :dataSource="tableConfig.dataSource"
                        rowKey="goodsId"
                        :pagination="pagination">
                        <template slot="weight" slot-scope="text, record,index">
                            <div href="javascript:;">{{text+tableConfig.dataSource[index].unitId}}</div>
                        </template>
                        <template slot="itemQgp" slot-scope="text, record,index">
                            <div href="javascript:;">{{text}}天</div>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>
    </PageHeaderLayout>
</template>

<script>
    import StandardTable from "@/components/StandardTable";
    import PageHeaderLayout from "../../layouts/PageHeaderLayout";
    import {post} from "../../utils/http";
    export default {
        name: "Store",
        components:{
            PageHeaderLayout,
            StandardTable
        },
        mounted(){
            post('/goods/getGoods')
                .then(res=>{
                    this.savedData = res
                    this.tableConfig.dataSource = res
                })
        },
        methods:{
            pageChange(pagination, filters, sorter, { currentDataSource }){
                this.pagination.current = pagination.current
            }
        },
        data(){
            return{
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
                            title: '物料名称',
                            dataIndex: 'itemName',
                        },
                        {
                            title: '数量',
                            dataIndex: 'weight',
                            scopedSlots: { customRender: 'weight' },
                        },
                        {
                            title: '供应商名称',
                            dataIndex: 'supplierName',
                        },
                        {
                            title: '单位',
                            dataIndex: 'unitId',
                        },
                        {
                            title: '入库时间',
                            dataIndex: 'inTime',
                        },
                        {
                            title: '保质期',
                            dataIndex: 'itemQgp',
                            scopedSlots: { customRender: 'itemQgp' },
                        },
                    ],
                }
            }
        }
    }
</script>

<style scoped>

</style>
