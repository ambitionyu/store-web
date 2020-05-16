import { getAdvancedProfile } from "@/utils/api";

const advancedProfile = {
    namespaced: true,
    state: {
        list: {},
        loading: true
    },
    mutations: {
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
        getList({ commit }) {
            commit("CHANGE_LOADING", true);
            getAdvancedProfile().then(res => {
                if (res) {
                    commit("SET_LIST", res);
                    commit("CHANGE_LOADING", false);
                }
            });
        },
        clearList({ commit }) {
            commit("CLEAR_LIST");
        }
    }
};

export default advancedProfile;
