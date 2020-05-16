<template>
    <PageHeaderLayout title="菜品管理">
        <a-card :bordered="false">
            <a-row type="flex" justify="space-around">
                <a-col :span="4">
                    <EditTable
                        @update="afterUpdate"
                        :classDetail="classDetail"
                        @handleClick="handleClick"
                        rowKey="classId"
                        @handleCellChange="handleCellChange"
                        @onDelete="onParentClassDelete"
                        :tableType="1"
                        title="第一大类"
                    :tableConfig="parentClassConfig"/>
                </a-col>
                <a-col  :span="4" >
                    <EditTable
                        @update="afterUpdate"
                        rowKey="classId"
                        :classDetail="classDetail"
                        @handleClick="handleClick"
                        @handleCellChange="handleCellChange"
                        @onDelete="onChildClassDelete"
                        :tableType="2" title="第二大类"
                               :tableConfig="childClassConfig"
                    />
                </a-col>
                <a-col :span="10">
                    <EditTable
                        @update="afterUpdate"
                        rowKey="itemId"
                        :classDetail="classDetail"
                        @handleClick="handleClick"
                        @handleCellChange="handleCellChange"
                        @onDelete="onItemDelete"
                        :tableType="3" title="详细"
                        :tableConfig="itemConfig"/>
                </a-col>
            </a-row>
        </a-card>
        <Modal v-model="show"  title="删除操作" @ok="handleOk">
            <p>删除成功了{{result}}条</p>
        </Modal>
    </PageHeaderLayout>
</template>

<script>
    import PageHeaderLayout from "@/layouts/PageHeaderLayout";
    import StandardTable from "@/components/StandardTable";
    import EditTable from "@/components/Table"
    import {Modal}from 'ant-design-vue'
    export default {
        name: "foodClass",
        components:{
            PageHeaderLayout,
            StandardTable,
            EditTable,
            Modal,
        },
        created(){

        },
        mounted(){
            this.$store.dispatch('foodClass/getParentClass')
                .then(res=>{
                    this.parentClassConfig.dataSource = res.foodClasses
                    this.$store.dispatch('foodClass/getChildClass',{classId:res.foodClasses[0].classId})
                        .then((res)=>{
                            this.childClassConfig.dataSource = res.foodClasses
                            this.$store.dispatch('foodClass/getItem',{classId:res.foodClasses[0].classId})
                                .then((res)=>{
                                    this.itemConfig.dataSource = res;
                                })
                        })
                })
        },
        updated(){
            this.$store.dispatch('foodClass/getParentClass')
                .then(res=>{
                    this.parentClassConfig.dataSource = res.foodClasses
                })
        },
        methods:{
            afterUpdate(val){
                if(val===1){
                    this.$store.dispatch('foodClass/getParentClass')
                        .then(res=>{
                            this.parentClassConfig.dataSource = res.foodClasses
                            this.$store.dispatch('foodClass/getChildClass',{classId:res.foodClasses[0].classId})
                                .then((res)=>{
                                    this.childClassConfig.dataSource = res.foodClasses
                                    this.$store.dispatch('foodClass/getItem',{classId:res.foodClasses[0].classId})
                                        .then((res)=>{
                                            this.itemConfig.dataSource = res;
                                        })
                                })
                        })
                }else if(val===2){
                    this.$store.dispatch('foodClass/getChildClass',{classId:this.classDetail.parentClassId})
                        .then((res)=>{
                            this.childClassConfig.dataSource = res.foodClasses
                            this.$store.dispatch('foodClass/getItem',{classId:res.foodClasses[0].classId})
                                .then((res)=>{
                                    this.itemConfig.dataSource = res;
                                })
                        })
                }else{
                    this.$store.dispatch('foodClass/getItem',{classId:this.classDetail.childClassId})
                        .then((res)=>{
                            this.itemConfig.dataSource = res;
                        })
                }
            },
            handleOk(){
              this.show = false
            },
            handleClick(value,tableType){
                if(tableType===1){
                    this.classDetail.parentClassId = value.classId
                    this.classDetail.parentName = value.className
                    this.$store.dispatch('foodClass/getChildClass',{classId:this.classDetail.parentClassId})
                        .then((res)=>{
                            this.childClassConfig.dataSource = res.foodClasses

                        })
                }else if(tableType===2){
                    this.classDetail.childClassId = value.classId
                    this.classDetail.childName = value.className
                    this.$store.dispatch('foodClass/getItem',{classId:this.classDetail.childClassId})
                        .then((res)=>{
                            this.itemConfig.dataSource = res;
                        })
                }
            },
            handleCellChange(record,text,value,tableType){
                if(tableType===3){
                    this.$store.dispatch('foodClass/updateItem',record)
                        .then((res)=>{
                            console.log(res)
                        })
                    const dataSource = [...this.itemConfig.dataSource];
                    const target = dataSource.find(item => item.key === record.key);
                    let key;
                    for(let v in target){
                        if(target[v]===text)
                            key = v;
                    }
                    target[key] = value
                    this.itemConfig.dataSource= dataSource
                }else if(tableType===2){
                    const dataSource = [...this.childClassConfig.dataSource];
                    const target = dataSource.find(item => item.key === record.key);
                    let key;
                    for(let v in target){
                        if(target[v]===text)
                            key = v;
                    }
                    target[key] = value
                    this.childClassConfig.dataSource=dataSource
                }else{
                    const dataSource = [...this.parentClassConfig.dataSource];
                    const target = dataSource.find(item => item.key === record.key);
                    let key;
                    for(let v in target){
                        if(target[v]===text)
                            key = v;
                    }
                    target[key] = value
                    this.parentClassConfig.dataSource=dataSource
                    console.log(this.parentClassConfig.dataSource)
                }

            },
            onParentClassDelete(key){
                console.log(key)
                const dataSource = [...this.parentClassConfig.dataSource];
                let temp = dataSource.filter(item => item.classId === key.classId);
                this.$store.dispatch('foodClass/delFoodClass',temp[0])
                    .then((res)=>{
                        this.result=res;
                        this.show=true;
                        this.$store.dispatch('foodClass/getParentClass')
                            .then(res=>{
                                this.parentClassConfig.dataSource = res.foodClasses
                                this.$store.dispatch('foodClass/getChildClass',{classId:res.foodClasses[0].classId})
                                    .then((res)=>{
                                        this.childClassConfig.dataSource = res.foodClasses
                                        this.$store.dispatch('foodClass/getItem',{classId:res.foodClasses[0].classId})
                                            .then((res)=>{
                                                this.itemConfig.dataSource = res;
                                            })
                                    })
                            })
                    })
                this.parentClassConfig.dataSource = dataSource.filter(item => item.classId !== key.classId);
            },
            onChildClassDelete(key){
                console.log(key)
                const dataSource = [...this.childClassConfig.dataSource];
                let temp = dataSource.filter(item => item.classId === key.classId);
                this.$store.dispatch('foodClass/delFoodClass',temp[0])
                    .then((res)=>{
                        this.result=res;
                        this.show=true;
                        this.$store.dispatch('foodClass/getChildClass',{classId:this.classDetail.parentClassId})
                            .then((res)=>{
                                this.childClassConfig.dataSource = res.foodClasses
                                this.$store.dispatch('foodClass/getItem',{classId:res.foodClasses[0].classId})
                                    .then((res)=>{
                                        this.itemConfig.dataSource = res;
                                    })
                            })
                    })
                this.childClassConfig.dataSource = dataSource.filter(item => item.key !== key);
            },
            onItemDelete(key){//删除item
                const dataSource = [...this.itemConfig.dataSource];
                let temp = dataSource.filter(item => item.itemId === key.itemId);
                this.result=0;
                this.$store.dispatch('foodClass/delItem',temp[0])
                    .then((res)=>{
                        this.result=res;
                        this.show=true;
                        this.$store.dispatch('foodClass/getItem',{classId:this.classDetail.childClassId})
                            .then((res)=>{
                                this.itemConfig.dataSource = res;
                            })
                    })
                this.itemConfig.dataSource = dataSource.filter(item => item.key !== key);
            },
        },
        data(){
            return{
                show:false,
                result:0,
                classDetail:{ //id
                    parentClassId:'',
                    parentName:'',
                    childClassId:'',
                    childName:'',
                    itemName:'',
                    itemQgp:null,
                    unitId:'',
                },
                parentClassConfig:{
                    dataSource: [],
                    columns: [
                        {
                            title: '分类',
                            dataIndex: 'className',
                            scopedSlots: { customRender: 'name' },
                        },
                        {
                            title: '删除',
                            dataIndex: 'operation',
                            scopedSlots: { customRender: 'operation' },
                        },
                    ],
                },
                childClassConfig:{
                    dataSource: [],
                    columns: [
                        {
                            title: '分类',
                            dataIndex: 'className',
                            scopedSlots: { customRender: 'name' },
                        },
                        {
                            title: '删除',
                            dataIndex: 'operation',
                            scopedSlots: { customRender: 'operation' },
                        },
                    ],
                },
                itemConfig:{
                    dataSource: [
                        // {
                        //     key: '5',
                        //     itemName: '牛肉',
                        //     lastPrice:12,
                        //     itemQgp:7,
                        //     unitId:'斤',
                        // },
                    ],

                    columns: [
                        {
                            title: '类名',
                            dataIndex: 'itemName',
                            scopedSlots: { customRender: 'itemName' },
                        },
                        {
                            title:'最近价格',
                            dataIndex: 'lastPrice',
                            scopedSlots: { customRender: 'lastPrice' },
                        },
                        {
                            title: '保质期',
                            dataIndex: 'itemQgp',
                            scopedSlots: { customRender: 'itemQgp' },
                        },
                        {
                            title:'单位',
                            dataIndex:'unitId',
                            scopedSlots: { customRender: 'unitId' },
                        },
                        {
                            title: '删除',
                            dataIndex: 'operation',
                            scopedSlots: { customRender: 'operation' },
                        },
                    ],
                },
            }
        }
    }
</script>

<style lang="less">
@import "FoodClass";
</style>
