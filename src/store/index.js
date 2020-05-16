import Vue from "vue";
import Vuex from "vuex";
import analysis from "./models/dashboard/analysis";
import monitor from "./models/dashboard/monitor";
import workplace from "./models/dashboard/workplace";
import tableList from "./models/list/tableList";
import fakeList from "./models/list/fakeList";
import basicProfile from "./models/profile/basicProfile";
import advancedProfile from "./models/profile/advancedProfile";
import login from "./models/user/login";
import header from "./models/header";
import error from "./models/error";
import foodClass from "./models/foodClass/foodClass";
// import getters from './getters'
import userControl from './models/user/userControl'
import canteenAndWareHouse from './models/service/canteenAndWareHouse'
import require from './models/service/require'
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        header,
        analysis,
        monitor,
        workplace,
        tableList,
        fakeList,
        basicProfile,
        advancedProfile,
        login,
        error,
        userControl,
        foodClass,
        canteenAndWareHouse,
        require,
    }
    //   getters
});

export default store;
