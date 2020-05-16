<template>
    <div>
        <a-modal
            :title="title"
            :visible="visible"
            @ok="okModal"
            :confirmLoading="confirmLoading"
            @cancel="cancelModal"
        >
            <div v-if="tableType>=1">
                <a-input :disabled="parentClassDisabled" addonBefore="第一大类:" v-model="classDetail.parentName"/>
            </div>
            <div v-if="tableType>=2" class="modalInput">
                <a-input :disabled="childClassDisabled" addonBefore="第二大类:" v-model="classDetail.childName"/>
            </div>
            <div v-if="tableType===3" class="modalInput">
                <div>
                    <a-input addonBefore="详细菜品:" v-model="classDetail.itemName"/>
                </div>
                <div class="modalInput">
                    <a-input addonBefore="保质期:" v-model="classDetail.itemQgp"/>
                </div>
                <div class="modalInput">
                    <a-input addonBefore="单位:" v-model="classDetail.unitId"/>
                </div>
            </div>
        </a-modal>
        <a-button class="editable-add-btn" @click="openModal">添加此类</a-button>

        <a-table :rowKey="rowKey" @change="pageChange" bordered :dataSource="tableConfig.dataSource" :columns="tableConfig.columns" :pagination="pagination">
            <template slot="name" slot-scope="text, record,index">
                <editable-cell @handleClick="handleClick(record)" :text="text" @change="onCellChange(record, text, $event)" />
            </template>
            <template slot="itemName" slot-scope="text, record,index">
                <editable-cell @handleClick="handleClick(record)"  :text="text" @change="onCellChange(record, text, $event)" />
            </template>
            <template slot="lastPrice" slot-scope="text, record,index">
                <editable-cell @handleClick="handleClick(record)"  :text="text" @change="onCellChange(record, text, $event)" />
            </template>
            <template slot="itemQgp" slot-scope="text, record,index">
                <editable-cell @handleClick="handleClick(record)"  :text="text" @change="onCellChange(record, text, $event)" />
            </template>
            <template slot="unitId" slot-scope="text, record,index">
                <editable-cell @handleClick="handleClick(record)"  :text="text" @change="onCellChange(record, text, $event)" />
            </template>
            <template slot="operation" slot-scope="text, record,index">
                <a-popconfirm
                    v-if="tableConfig.dataSource.length"
                    title="确定删除吗?"
                    @confirm="() => onDelete(record)"
                >
                    <a href="javascript:;" style="white-space: nowrap;">删除</a>
                </a-popconfirm>
            </template>
        </a-table>
    </div>
</template>

<script>
import EditableCell from './EditableCell'
    export default {
        name: "EditTable",
        components:{
            EditableCell
        },
        props:{
            classDetail:{
              type:Object
            },
            rowKey:{
                type:String
            },
            tableConfig:{
                type:Object
            },
            add:{
                type:Function,
                default:()=>{}
            },
            tableType:{
                type:Number,
            },
            title:{
                type:String,
            }
        },
        methods:{
            openModal(){
                if(this.tableType===1){
                    this.classDetail.parentName=''
                    this.parentClassDisabled = false;
                    this.visible = true;
                }else if(this.tableType===2){
                    this.parentClassDisabled = true;
                    this.childClassDisabled = false;
                    this.classDetail.childName=''
                    this.visible = true;
                }else{
                    this.parentClassDisabled = true;
                    this.childClassDisabled = true;
                    this.classDetail.itemName=''
                    this.classDetail.itemQgp=null
                    this.classDetail.unitId=''
                    this.visible = true;
                }
            },
            okModal(){
                this.confirmLoading = true;
                if(this.tableType===1){
                    this.$store.dispatch('foodClass/addParentClass',this.classDetail.parentName)
                        .then(()=>{
                            this.confirmLoading = false;
                            this.visible = false;
                            this.parentClass = ''
                            this.$emit("update",1)
                        })
                }else if(this.tableType===2){
                    this.$store.dispatch('foodClass/addChildClass',{
                        parentName:this.classDetail.parentName,
                        className:this.classDetail.childName
                    })
                        .then(()=>{
                            this.confirmLoading = false;
                            this.visible = false;
                            // this.parentClass = ''
                            this.$emit("update",2)
                        })
                }else if(this.tableType===3){
                    this.$store.dispatch('foodClass/addItem',{
                        parentName:this.classDetail.parentName,
                        childName:this.classDetail.childName,
                        itemName:this.classDetail.itemName,
                        itemQgp:this.classDetail.itemQgp,
                        unitId:this.classDetail.unitId
                    })
                        .then(()=>{
                            this.confirmLoading = false;
                            this.visible = false;
                            // this.parentClass = ''
                            this.$emit("update",3)
                        })
                }
            },
            cancelModal(){
                this.visible = false;
            },
            handleClick(value){
                this.$emit("handleClick",value,this.tableType)
            },
            pageChange(pagination, filters, sorter, { currentDataSource }){
                console.log(pagination)
                this.pagination.current = pagination.current
            },
            onCellChange(record, text, value) {
                this.$emit('handleCellChange',record,text,value,this.tableType)
            },
            onDelete(key){
               this.$emit('onDelete',key)
            }
        },
        data() {
            return {
                childClassDisabled:true,
                parentClassDisabled:false,
                // parentClass: this.classDetail.parentName,
                // childClass:this.classDetail.childName,
                visible: false,
                confirmLoading: false,
                pagination:{
                    hideOnSinglePage:true,//只有一页隐藏分页
                    current:1,
                    defaultCurrent:1,
                    defaultPageSize:4,
                    simple:true,
                    size:'small'
                },
            };
        },
    }
</script>

<style>
    .editable-add-btn {
        margin-bottom: 8px;
    }
    .modalInput{
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
