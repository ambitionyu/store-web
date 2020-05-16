import {get,post,put} from '../../../utils/http'
import {notification} from 'ant-design-vue'
import { getTableList, addTableList, deleteTableList } from "@/utils/api";
const userControl = {
    namespaced: true,
    state: {
        list: {},
        loading: true,
        drawerVisible:false,
    },
    mutations: {
        SET_drawerVisible(state, res){
            state.drawerVisible = false
        },
        SET_LIST: (state, res) => {
            state.list = res;
        },
        CLEAR_LIST: state => {
            state.list = {};
        },
        CHANGE_LOADING: (state, loading) => {
            state.loading = loading;
        }
    },
    actions: {
        updateUser({commit}, {params,userId}){
            put('/user/update',{
                userId:userId,
                userName:params.infoUserName,
                password:params.infoPassword,
                phone:params.infoPhone,
                role:params.role,
                name:params.infoName,
                forbidden:params.isForbidden//1禁用
            })
                .then(res=>{
                    if(res===1){
                        notification.open({
                            message: '操作提示',
                            description:
                                '本次操作成功了',
                        });
                    }else{
                        notification.open({
                            message: '操作提示',
                            description:
                                '本次操作失败',
                        });
                    }
                })
                .catch(err=>console.log(err))
        },
        addUser: function ({commit}, {params}){
            post("user/add",{
                userName:params.infoUserName,
                password:params.infoPassword,
                phone:params.infoPhone,
                role:params.role,
                name:params.infoName,
                forbidden:params.isForbidden//1禁用
            })
                .then(
                    res=>{
                        if(res===1){
                            notification.open({
                                message: '操作提示',
                                description:
                                    '本次操作成功了',
                            });
                        }else{
                            notification.open({
                                message: '操作提示',
                                description:
                                    '本次操作失败',
                            });
                        }
                    }
                )
                .catch(err=>console.log(err))
        } ,
        searchByUserName: function ({commit}, {params,}){//用户名搜索
            commit("CHANGE_LOADING", true);
            post("/user/search",params).then(
                res=>{
                    const pagination = {
                        pageSize: res.num,
                        total: res.num,
                        current: res.num
                    }
                    const result = {
                        list: res.list,
                        pagination: pagination
                    }
                    commit("SET_LIST", result);
                    commit("CHANGE_LOADING", false);
                }
            ).catch(err=>{
                console.log(err)
            })
        },
        getList: function ({commit}, {params}) {//分页
            commit("CHANGE_LOADING", true);
            const page = params.page - 1
            get("/user/userList?page=" + page).then(res => {
                // noinspection JSAnnotator

                const pagination = {
                    pageSize: 10,
                    total: res.num,
                    current: page + 1
                }
                const result = {
                    list: res.list,
                    pagination: pagination
                }
                commit("SET_LIST", result);
                commit("CHANGE_LOADING", false);
            }).catch(err => {
                console.log(err)
            })

            // getTableList(params).then(res => {
            //     if (res) {
            //
            //
            //     }
            // });
        },
        addList({ commit }, { params }) {
            commit("CHANGE_LOADING", true);
            addTableList(params).then(res => {
                if (res) {
                    commit("SET_LIST", res);
                    commit("CHANGE_LOADING", false);
                }
            });
        },
        deleteList({ commit }, { params, callback }) {
            commit("CHANGE_LOADING", true);
            deleteTableList(params).then(res => {
                if (res) {
                    commit("SET_LIST", res);
                    commit("CHANGE_LOADING", false);
                    callback();
                }
            });
        },
        clearList({ commit }) {
            commit("CLEAR_LIST");
        }
    }
};
export  default userControl;
