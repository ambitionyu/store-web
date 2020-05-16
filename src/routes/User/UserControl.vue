<template>
    <PageHeaderLayout title="用户管理">
        <a-card :bordered="false">
            <div class="tableList">
                <div class="tableListForm">
                    <a-form @submit="handleSearch" layout="inline" :form="form">
                        <a-row :gutter="{ md: 8, lg: 24, xl: 48 }">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="账号">
                                    <a-input placeholder="请输入用户名" v-decorator="['userName',  {rules: [{ required: true, message: '请输入用户名' }]}]"/>
                                </a-form-item>
                            </a-col>

                            <a-col :md="8" :sm="24">
                                <span class="submitButtons">
                                    <a-button type="primary" htmlType="submit">
                                        查询
                                    </a-button>
                                    <a-button style="margin-left: 8px;" @click="handleFormReset">
                                        重置
                                    </a-button>
                                </span>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
                <div class="tableListOperator">
                    <a-button icon="plus" type="primary" @click="handleDrawer">
                        新建
                    </a-button>
                    <span v-if="selectedRows.length > 0">
                        <a-dropdown>
                            <template slot="overlay">
                                <a-menu @click="handleMenuClick" :selectedKeys="[]">
                                    <a-menu-item key="remove">删除</a-menu-item>
                                    <a-menu-item key="approval">批量禁用</a-menu-item>
                                </a-menu>
                            </template>
                            <a-button>
                                更多操作 <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </span>
                </div>
                <StandardTable
                    rowKey="userId"
                    :selectedRows="selectedRows"
                    :loading="loading"
                    :list="data.list"
                    :pagination="data.pagination"
                    :columns="columns"
                    :onSelectRow="handleSelectRows"
                    :onChange="handleStandardTableChange"
                />

            </div>
        </a-card>
        <Drawer :closable="true"
            title="编辑用户"
            width="700"
            @close="closeDrawer"
            :visible="drawerVisible"
            :destroyOnClose="true">
            <a-form :form="infoForm" @submit="handleSubmit" layout="vertical" hideRequiredMark>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="用户名" >
                            <a-input
                                v-decorator="['infoUserName', {
                                 rules: [{ required: true, message: '请输入用户名' }]
                                }]"
                                placeholder="请输入用户名"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="密码" >
                            <a-input
                                v-decorator="['infoPassword']"
                                placeholder="请输入密码"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="手机" >
                            <a-input
                                v-decorator="['infoPhone', {
                                 rules: [{ required: true, message: '请输入手机号' }]
                                }]"
                                placeholder="请输入手机号"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="姓名" >
                            <a-input
                                v-decorator="['infoName', {
                                 rules: [{ required: true, message: '请输入姓名' }]
                                }]"
                                placeholder="请输入姓名"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="18">
                        <a-form-item label="角色">
                            <a-radio-group
                                v-decorator="['role',{rules:[{required:true,message:'必须选择一个角色'}]}]"
                            >
                                <a-radio-button value="1">
                                    管理员
                                </a-radio-button>
                                <a-radio-button value="2">
                                    窗口负责人员
                                </a-radio-button>
                                <a-radio-button value="3">
                                    供应商
                                </a-radio-button>
                                <a-radio-button value="4">
                                    验收人员
                                </a-radio-button>
                                <a-radio-button value="5">
                                    普通操作人员
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="禁用">
                            <a-radio-group
                                v-decorator="['isForbidden',{rules:[{required:true,message:'必须选择权限'}]}]"
                            >
                                <a-radio-button value="2">
                                    禁用
                                </a-radio-button>
                                <a-radio-button value="1">
                                    启用
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-button type="primary" htmlType="submit">
                        确定
                    </a-button>
                </a-row>
            </a-form>
            <a-divider>角色配置</a-divider>
        </Drawer>
    </PageHeaderLayout>
</template>

<script>
    import PageHeaderLayout from "@/layouts/PageHeaderLayout";
    import StandardTable from "@/components/StandardTable";
    import {  message ,Badge,Drawer} from "ant-design-vue";
    export default {
        name: "UserControl",
        components: {
            PageHeaderLayout,
            StandardTable,
            Drawer
        },
        beforeCreate(){
            this.form = this.$form.createForm(this)//搜索表单
            this.infoForm = this.$form.createForm(this)//添加用户的表单
        },
        created() {
            this.$store.dispatch("userControl/getList", { params: {page:1} });
        },
        destroyed() {
            this.$store.dispatch("userControl/clearList");
        },
        computed: {
            data() {
                return this.$store.state.userControl.list;
            },
            loading() {
                return this.$store.state.userControl.loading;
            }
        },
        data() {
           // const statusMap = [ "success", "error"];
            const status = ["启用", "禁用"];
            return {
                pagination:1,
                userId:null,
                flag:null,//表示drawer 打开时，0为添加操作，1为更新操作
                drawerVisible:this.$store.state.userControl.drawerVisible,
                selectedRows: [],
                formValues: {},
                columns: [
                    {
                        title: "用户名",
                        dataIndex: "userName",
                        key:"userName"
                    },

                    {
                        title: "手机号",
                        dataIndex: "phone",
                        key:"phone"
                    },
                    {
                        title: "角色",
                        dataIndex: "role",
                        key:"role",
                        //align: "right",
                        //customRender: val => `${val} 万`,
                        // mark to display a total number
                       // needTotal: true,
                       // scopedSlots: { customRender: 'role' },
                        customRender: val=>{
                            if(val===1){
                            return <div >管理员</div>;
                            }else if(val===2){
                                return <div >窗口负责人员</div>;
                            }else if(val===3){
                                return <div >供应商</div>;
                            }else if(val===4){
                                return <div >验收人员</div>;
                            }else{
                                return <div >订单操作人员</div>;
                            }
                        }
                    },
                    {
                        title: "状态",
                        dataIndex: "forbidden",
                        key:"forbidden",
                        filters: [
                            {
                                text: status[0],
                                value: 1
                            },
                            {
                                text: status[1],
                                value: 2
                            },

                        ],
                        onFilter: (value, record) => record.status.toString() === value,
                        // scopedSlots: { customRender: 'status' },
                        customRender: val => {
                            if(val===1){
                                return <Badge status="success"  text="启用"/>
                            }else if(val===2){
                                return  <Badge status="error"  text="禁用"/>;
                            }
                        }
                    },
                    {
                        title: "姓名",
                        dataIndex: "name",
                        key:"name"

        },
            {
                title: "操作",
                dataIndex: "userId",
                key:"userId",
                customRender: val => {
                    return <a onClick={()=>this.updateUser(val)}>配置{val}</a>;
                },
                //scopedSlots: { customRender: 'updateUser' }
            }
        ]
        };
        },
        methods: {
            closeDrawer(){
                this.drawerVisible = false;
            },
            handleSubmit(){//提交 有更新或添加操作
                if(this.flag===0){
                    this.infoForm.validateFields((err,fieldsValue)=>{
                        if(err)return;
                        this.$store.dispatch("userControl/addUser", { params: fieldsValue }).then(
                            ()=>this.closeDrawer()
                        );
                    })
                }else{
                    this.infoForm.validateFields((err,fieldsValue)=>{
                        if(err)return;
                        this.$store.dispatch("userControl/updateUser", { params: fieldsValue,userId:this.userId })
                            .then(()=>this.closeDrawer())
                            .then(()=>{this.$store.dispatch("userControl/getList", { params: {page:this.pagination} });});
                    })
                }

            },
            handleDrawer(){
                this.flag = 0;
                this.drawerVisible = true
            },
            updateUser(userId){ //修改用户
                this.userId = userId;
                this.flag = 1;
                let changeUserData = this.data.list.filter((val)=>{
                    if(val.userId ===userId)
                        return val;
                });//获取需要修改的用户数据
                this.drawerVisible = true;
                this.$nextTick(
                    ()=>{
                        this.infoForm.setFieldsValue({infoUserName:changeUserData[0].userName})
                        this.infoForm.setFieldsValue({infoPhone:changeUserData[0].phone})
                        this.infoForm.setFieldsValue({infoName:changeUserData[0].name})

                        this.infoForm.setFieldsValue({role:changeUserData[0].role.toString()})
                        this.infoForm.setFieldsValue({isForbidden:changeUserData[0].forbidden.toString()})
                    }
                )

            },
            handleSearch(e) {//搜索
                e.preventDefault();
                this.form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    const values = {
                        ...fieldsValue,
                    };
                    this.formValues = values;
                    this.$store.dispatch("userControl/searchByUserName", { params: values });
                });
            },
            handleFormReset() { //重置
                this.form.resetFields();
                this.formValues = {};
                this.$store.dispatch("userControl/getList", { params: {page:1} });
            },
            handleSelectRows(rows) {
                this.selectedRows = rows;
            },
            //监听页码，过滤器
            handleStandardTableChange(pagination, filtersArg, sorter) {
                this.pagination = pagination.current
                const filters = Object.keys(filtersArg).reduce((obj, key) => {
                    const newObj = { ...obj };
                    newObj[key] = this.getValue(filtersArg[key]);
                    return newObj;
                }, {});

                const params = {
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    ...this.formValues,
                    ...filters
                };

                if (sorter.field) {
                    params.sorter = `${sorter.field}_${sorter.order}`;
                }
                this.$store.dispatch("userControl/getList", { params });
            },
            getValue(obj) {
                return Object.keys(obj)
                    .map(key => obj[key])
                    .join(",");
            },
            handleMenuClick(e) {
                if (!this.selectedRows) return;

                switch (e.key) {
                    case "remove":
                        this.$store.dispatch("userControl/deleteList", {
                            params: {
                                no: this.selectedRows.map(row => row.no).join(",")
                            },
                            callback: () => {
                                this.selectedRows = [];
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>

<style lang="less">
@import "UserControl.less";
</style>
