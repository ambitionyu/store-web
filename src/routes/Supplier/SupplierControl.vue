<template>
    <PageHeaderLayout>
        <a-card :bordered="false">
            <a-row :gutter="8">
                <a-col :span="14">
                    <a-table
                        rowKey="supplierId"
                        :pagination="pagination"
                        :dataSource="tableConfig.dataSource"
                        @change="(pagination)=>{this.addPagination.current = pagination.current}"
                        :columns="tableConfig.columns">
                        <template slot="operation" slot-scope="text, record,index">
                            <a href="javascript:;" @click="handleClick(record)">查看操作</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>
    </PageHeaderLayout>
</template>

<script>
    import {get,post,put,del} from '../../utils/http';
    import StandardTable from "@/components/StandardTable";
    import PageHeaderLayout from "../../layouts/PageHeaderLayout";
    export default {
        name: "SupplierControl",
        components:{
            PageHeaderLayout,
            StandardTable
        },
        mounted(){
            this.getSupplier()
        },
        methods:{
            handleClick(record){
                console.log(record);
            },
            getSupplier(){
                post("/supplier/getSupplier")
                    .then(res=>{
                        this.tableConfig.dataSource = res
                    })
                    .catch(e=>{console.log(e)})
            }
        },
        data(){
            return{
                tableConfig:{
                  dataSource:[],
                  columns:[
                      {
                          title: '公司名称',
                          dataIndex: 'supplierName',
                      },
                      {
                          title: '用户名',
                          dataIndex: 'userId',
                      },
                      {
                          title: '联系电话',
                          dataIndex: 'phone',
                      },
                      {
                          title: '评分',
                          dataIndex: 'supplierRate',
                      },
                      {
                          title: '供应商品类别',
                          dataIndex: 'className',
                      },
                      {
                          title: '查看&操作',
                          dataIndex: 'operation',
                          scopedSlots: { customRender: 'operation' },
                      },
                  ]
                },
                pagination:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
            }
        }
    }
</script>

<style>

</style>
