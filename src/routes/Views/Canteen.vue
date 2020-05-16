<template>
    <PageHeaderLayout>
        <a-card :bordered="false">
            <a-row :gutter="8">
                <a-col :span="9">
                    <a-button class="editable-add-btn"  @click="openModal1">添加</a-button>
                    <a-table
                        rowKey="wareHouseId"
                        @change="pageChange1"
                        :pagination="pagination"
                        :columns="canteenConfig.columns"
                        :dataSource="canteenConfig.dataSource">
                        <template slot="name" slot-scope="text, record,index">
                                <div @click="getWindow(record)" href="javascript:;" style="white-space: nowrap;">{{text}}</div>
                        </template>
                        <template slot="operation" slot-scope="text, record,index">
                                <a  @click="openDrawer1(record)" href="javascript:;" style="white-space: nowrap;">配置</a>
                        </template>
                        <template slot="del" slot-scope="text, record,index">
                            <a-popconfirm
                                title="确定删除吗?"
                                @confirm="() => onDelete1(record)"
                            >
                                <a href="javascript:;" style="white-space: nowrap;">删除</a>
                            </a-popconfirm>
                        </template>
                    </a-table>
                </a-col>
                <a-col :span="9">
                    <a-button class="editable-add-btn"  @click="openModal2">添加</a-button>
                    <a-table
                        rowKey="windowId"
                        @change="pageChange2"
                        :pagination="windowPagination"
                        :columns="addWindowConfig.columns"
                        :dataSource="addWindowConfig.dataSource"
                    >

                        <template slot="name" slot-scope="text, record,index">
                            <div  href="javascript:;" style="white-space: nowrap;">{{text}}</div>
                        </template>
                        <template slot="operation" slot-scope="text, record,index">
                            <a  @click="openDrawer2(record)" href="javascript:;" style="white-space: nowrap;">配置</a>
                        </template>
                        <template slot="del" slot-scope="text, record,index">
                            <a-popconfirm
                                title="确定删除吗?"
                                @confirm="() => onDelete2(record)"
                            >
                                <a href="javascript:;" style="white-space: nowrap;">删除</a>
                            </a-popconfirm>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>
        <!--modal&drawer-->
        <a-modal
            title="添加食堂/仓库"
            :visible="visible1"
            @ok="okModal1"
            :confirmLoading="confirmLoading1"
            @cancel="cancelModal1"
        >
        <a-input addonBefore="食堂/仓库名" v-model="canteenName"></a-input>
        </a-modal>
        <a-modal
            title="添加窗口"
            :visible="visible2"
            @ok="okModal2"
            @cancel="()=>{this.visible2=false}"
        >
            <a-input :disabled="true" addonBefore="食堂/仓库名" v-model="windowParentInfo.name"></a-input>
            <a-input addonBefore="窗口名" v-model="windowName"></a-input>
        </a-modal>
        <!--对操作进行提示的modal-->
        <a-modal :visible="handleVisible"  @cancel="cancelModal1" @ok="()=>{this.handleVisible=false}"><!--操作提示modal-->
         {{ handleResult}}
        </a-modal>
        <a-drawer
            width="600"
            title="配置人员"
            placement="right"
            :closable="true"
            @close="drawerClose"
            :visible="drawerVisible"
        >
          <div> <!--添加warehouse仓库管理人员-->
            <div  v-if="drawerFlag==1&&drawerShow.user.userName" style="white-space: nowrap;">

                用户名:{{drawerShow.user.userName}}手机号:{{drawerShow.user.phone}}<a @click="updateWareHouseUserId(null)" href="javascript:;">注销</a>
            </div><!--显示当前的仓库信息-->
              <div v-if="drawerFlag==2&&drawerShow.user.userName" style="white-space: nowrap;">
                  用户名:{{drawerShow.user.userName}}手机号:{{drawerShow.user.phone}}<a @click="updateWindowById(null)" href="javascript:;">注销</a>
              </div><!--显示当前的窗口信息-->
          </div>
              <a-table
                  rowKey="userId"
                  :pagination="addPagination"
                  :dataSource="addUserConfig.dataSource"
                  :columns="addUserConfig.columns"
                  @change="(pagination)=>{this.addPagination.current = pagination.current}"
              >
                <template slot="operation" slot-scope="text, record,index">
                    <a @click="handleClick(record)" href="javascript:;" style="white-space: nowrap;">配置</a>
                </template>
              </a-table>
        </a-drawer>
    </PageHeaderLayout>
</template>

<script>
    import StandardTable from "@/components/StandardTable";
    import PageHeaderLayout from "../../layouts/PageHeaderLayout";
    export default {
        name: "Canteen",
        components:{
            PageHeaderLayout,
            StandardTable
        },
        mounted(){
            this.$store.dispatch('canteenAndWareHouse/getCanteenAndWareHouse')
                .then(res=>{
                    this.canteenConfig.dataSource = res
                    this.saveData1 = res
                    this.getWindow({wareHouseId:res[0].wareHouseId})
                }
                )
        },
        methods:{
            updateWindowById(value){
                this.$store.dispatch('canteenAndWareHouse/updateWindowById',{
                    userId:value,
                    windowId:this.drawerShow.info.windowId
                }).then(res=> {
                    if(res===1){
                        this.drawerVisible = false;
                        this.handleVisible = true;
                        this.handleResult = "窗口人员配置成功"
                        this.$store.dispatch('canteenAndWareHouse/getWindowByWareHouseId',{
                            wareHouseId:this.drawerShow.info.wareHouseId
                        })
                            .then(res=>{
                                this.addWindowConfig.dataSource = res
                                this.saveData2 = res
                            })
                    }
                })
            },
            okModal2(){
                console.log(this.windowParentInfo.id,
                this.windowName)
                this.$store.dispatch('canteenAndWareHouse/addWindow',{
                    wareHouseId:this.windowParentInfo.id,
                    windowNum:this.windowName,
                }).then(res=>{
                    if(res>0){
                        this.handleResult="窗口添加成功"
                        this.getWindow({wareHouseId:this.windowParentInfo.id})
                    }else{
                        this.handleResult="窗口添加失败"
                    }
                    this.windowName=""
                    this.visible2 = false;
                    this.handleVisible = true
                })
            },
            onDelete1(record){
                this.$store.dispatch('canteenAndWareHouse/delCanteenAndWareHouse', record)
                    .then(res=>{
                        this.handleResult = "删除成功了"+res+"条"
                        this.handleVisible = true
                        this.$store.dispatch('canteenAndWareHouse/getCanteenAndWareHouse')
                            .then(res=>{
                                    this.canteenConfig.dataSource = res
                                    this.saveData1 = res
                                    this.getWindow({wareHouseId:res[0].wareHouseId})
                                }
                            )
                    })
            },
            onDelete2(record){
                console.log(record)
                this.$store.dispatch('canteenAndWareHouse/delWindow', record)
                    .then(res=>{
                        if(res===1){
                            this.handleResult = "删除成功了"+res+"条"
                            this.handleVisible = true
                            this.$store.dispatch('canteenAndWareHouse/getWindowByWareHouseId',{
                                wareHouseId:record.wareHouseId
                            })
                                .then(res=>{
                                    this.addWindowConfig.dataSource = res
                                    this.saveData2 = res
                                })
                        }
                    })
            },
            openDrawer2(record){
                this.drawerShow.user={}
                this.drawerShow.info=record
                this.drawerVisible = true
                this.drawerFlag = 2;
                this.$store.dispatch('canteenAndWareHouse/getUserByRoleIs2')
                    .then(res=>{
                        this.addUserConfig.dataSource = res
                    })
                if(record.userId!==null){
                    this.$store.dispatch('canteenAndWareHouse/findUserById',{userId:record.userId})
                        .then(res=>{
                            this.drawerShow.user = res //获取drawer上的用户信息
                        })
                }
                this.drawerShow.info = record
            },
            pageChange2(pagination, filters, sorter, { currentDataSource }){

                if(filters.hasOwnProperty('operation')){
                    if(filters.operation.length>0){
                        if(filters.operation[0]=='no'){
                            this.addWindowConfig.dataSource = this.saveData2.filter(item=>{return item.userId===null})
                        }else if(filters.operation[0]=='ok'){
                            this.addWindowConfig.dataSource = this.saveData2.filter(item=>{return item.userId!==null})
                        }
                    }else{
                        this.addWindowConfig.dataSource = this.saveData2;
                    }
                }
                this.windowPagination.current = pagination.current
            },
            openModal2(){
                this.visible2 = true
            },
            updateWareHouseUserId(value){
                this.$store.dispatch('canteenAndWareHouse/updateWareHouseUserId',{wareHouseId:this.drawerShow.info.wareHouseId,userId:value })
                    .then(res=>{
                        if(res===1){
                            this.drawerVisible = false;
                            this.handleVisible = true;
                            this.handleResult = "仓库人员配置成功"
                            this.$store.dispatch('canteenAndWareHouse/getCanteenAndWareHouse')
                                .then(res=>{
                                    this.canteenConfig.dataSource = res
                                    this.saveData1 = res
                                })
                        }
                    })
            },
            handleClick(record){
                if(this.drawerFlag===1){
                    this.updateWareHouseUserId(record.userId)
                }else if(this.drawerFlag===2){
                    this.updateWindowById(record.userId)
                }

            },
            pageChange1(pagination, filters, sorter, { currentDataSource }){
                if(!filters.hasOwnProperty("operation")){

                }else{
                    if(filters.operation.length===0){
                        this.canteenConfig.dataSource = this.saveData1
                    }else{
                        if(filters.operation[0]==='no'){
                            this.canteenConfig.dataSource = this.saveData1.filter(item=>{return item.userId===null})
                        }else if(filters.operation[0]==='ok'){
                            this.canteenConfig.dataSource = this.saveData1.filter(item=>{return item.userId!==null})
                        }
                    }
                    this.pagination.current=1
                }
                this.pagination.current = pagination.current
            },
            getWindow(record){
                this.windowParentInfo.name = record.name
                this.windowParentInfo.id = record.wareHouseId
                this.$store.dispatch('canteenAndWareHouse/getWindowByWareHouseId',{
                    wareHouseId:record.wareHouseId
                })
                    .then(res=>{

                        this.addWindowConfig.dataSource = res
                        this.saveData2 = res
                    })
            },
            openDrawer1(record){
                this.drawerFlag =1
                this.drawerShow.user={}
                this.drawerShow.info={}
                this.$store.dispatch('canteenAndWareHouse/getUserRoleIs4')
                    .then(res=>{
                        this.addUserConfig.dataSource = res
                    })
                this.drawerVisible = true
                if(record.userId!==null){
                    this.$store.dispatch('canteenAndWareHouse/findUserById',{userId:record.userId})
                        .then(res=>{
                           this.drawerShow.user = res //获取drawer上的用户信息
                        })
                }
                this.drawerShow.info = record
                console.log(record)
            },

            openModal1(){
                this.visible1= true;
            },
            okModal1(){
                this.$store.dispatch('canteenAndWareHouse/addcanteenAndWareHouse', {name:this.canteenName})
                    .then(res=>{
                        this.handleResult = ""
                        if(res===0){
                            this.handleResult = "操作失败"
                        }else{
                            this.handleResult = "操作成功"
                        }
                        this.handleVisible = true
                        this.$store.dispatch('canteenAndWareHouse/getCanteenAndWareHouse')
                            .then(res=>{
                                    this.canteenConfig.dataSource = res
                                    this.saveData1 = res
                                    this.getWindow({wareHouseId:res[0].wareHouseId})
                                }
                            )
                    })
                this.visible1 = false
                this.canteenName = ''
            },
            cancelModal1(){
                this.visible1 = false
            },
            drawerClose(){
                this.drawerVisible = false
            },
        },
        data(){
            return{
                saveData2:[],
                windowParentInfo:{
                    id:null,
                    name:null,
                },
                windowName:"",
                visible2:false,
                windowPagination:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
                drawerFlag:null,//判断打开drawer的用户是哪个
                handleResult:"",//操作之后的结果显示
                drawerShow:{
                  info:{},
                  user:{},
                },

                addWindowConfig:{ //窗口人员的配置
                    dataSource:[],
                    columns:[
                        {
                            title: '窗口名',
                            dataIndex: 'windowNum',
                            scopedSlots: { customRender: 'windowNum' },
                        },
                        {
                            title: '配置人员',
                            dataIndex: 'operation',
                            scopedSlots: { customRender: 'operation' },
                            filters: [
                                {
                                    text: '已经配置',
                                    value: 'ok',
                                },
                                {
                                    text: '未配置',
                                    value: 'no',
                                },
                            ],
                            filterMultiple: false,
                        },
                        {
                            title: '删除',
                            dataIndex: 'del',
                            scopedSlots: { customRender: 'del' },
                        },
                    ],
                },
                addUserConfig:{
                    dataSource:[],
                  columns:[
                      {
                          title: '用户名',
                          dataIndex: 'userName',
                          scopedSlots: { customRender: 'userName' },
                      },
                      {
                          title: '手机号',
                          dataIndex: 'phone',
                          scopedSlots: { customRender: 'phone' },
                      },
                      {
                          title: '配置',
                          dataIndex: 'operation',
                          scopedSlots: { customRender: 'operation' },
                      }
                  ]
                },
                drawerVisible:false,
                handleVisible:false,
                saveData1:[],
                addPagination:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
                pagination:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
                canteenName:'',
                confirmLoading1:false,
                visible1:false,
                canteenConfig:{
                    dataSource:[],
                    columns:[
                        {
                            title: '食堂/仓库名',
                            dataIndex: 'name',
                            scopedSlots: { customRender: 'name' },
                        },
                        {
                            title: '配置人员',
                            dataIndex: 'operation',
                            scopedSlots: { customRender: 'operation' },
                            filters: [
                                {
                                    text: '已经配置',
                                    value: 'ok',
                                },
                                {
                                    text: '未配置',
                                    value: 'no',
                                },
                        ],
                            filterMultiple: false,
                            // onFilter: (value, record) => {
                            //     console.log(value) //删选
                            // },
                        },
                        {
                            title: '删除',
                            dataIndex: 'del',
                            scopedSlots: { customRender: 'del' },
                        },
                    ]
                }
            }
        }
    }
</script>

<style scoped>

</style>
