// import { getBasicProfile } from "@/utils/api";
import {post} from '../../../utils/http'
const login = {
    namespaced: true,
    state: {
        login: {},
        loading: false
    },
    mutations: {
        CHANGE_LOGIN: (state, res) => {
            state.login = res;
        },
        CLEAR_LOGIN: state => {
            state.login = {};
        },
        CHANGE_LOADING: (state, loading) => {
            state.loading = loading;
        }
    },
    actions: {
        login({ commit }, { params }) {
            commit("CHANGE_LOADING", true);
            if (params.type == "account") {
                post("user/login",params).
                then(res=>{
                    if(res){
                        commit("CHANGE_LOGIN", {
                            type: "account",
                            status: "ok"
                        });
                        console.log(res)
                        params.callback();
                    }else {
                        commit("CHANGE_LOGIN", {
                            type: "account",
                            status: "error"
                        });
                    }

                });
            }
                // else {
                //     commit("CHANGE_LOGIN", {
                //         type: "mobile",
                //         status: "error"
                //     });
                // }
            commit("CHANGE_LOADING", false);
        },
        clearLogin({ commit }) {
            commit("CHANGE_LOGIN");
        }
    }
};

export default login;
