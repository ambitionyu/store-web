import {get,post,put,del} from '../../../utils/http';
const canteenAndWareHouse = {
    namespaced:true,
    state:{

    },
    mutations:{
        changeModalLoading(state,res){

        },
    },
    actions:{
        getUserRoleIs4({commit}, params){
            return get("/CanteenAndWareHouse/getUserRoleIs4")
                .catch(e=>{
                    console.log(e)
                })

        },
        addcanteenAndWareHouse({commit}, params){
            return post("/CanteenAndWareHouse/addCanteenAndWareHouse",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        getCanteenAndWareHouse({commit}, params){
            return get("/CanteenAndWareHouse/getCanteenAndWareHouse")
                .catch(e=>{
                    console.log(e)
                })
        },
        delCanteenAndWareHouse({commit}, params){
            return post("/CanteenAndWareHouse/delCanteenAndWareHouse",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        findUserById({commit}, params){
            return post("/user/findUserById",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        updateWareHouseUserId({commit}, params){
            return post("/CanteenAndWareHouse/warehouseUserId",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        addWindow({commit}, params){
            return post("/CanteenAndWareHouse/addWindow",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        getWindowByWareHouseId({commit}, params){
            return post("/CanteenAndWareHouse/getWindowByWareHouseId",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        getUserByRoleIs2({commit}, params){
            return get("/CanteenAndWareHouse/getUserByRoleIs2")
                .catch(e=>{
                    console.log(e)
                })
        },
        updateWindowById({commit}, params){
            return post("/CanteenAndWareHouse/updateWindowById",{...params})
                .catch(e=>{
                    console.log(e)
                })
        },
        delWindow({commit}, params){
            return post("/CanteenAndWareHouse/delWindow",{...params})
                .catch(e=>{
                    console.log(e)
                })
        }
    },
}
export default  canteenAndWareHouse;
