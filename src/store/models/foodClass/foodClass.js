import {get,post,put,del} from '../../../utils/http';
const foodClass = {
    namespaced:true,
    state:{
        ModalLoading:false,
        classId:{ //id
            parentClassId:'',
            childClassId:'',
            itemId:'',
        },
    },
    mutations:{
        changeModalLoading(state,res){
            state.ModalLoading = res
        },
        updateClassId(state,res){
            state.classId = res
        }
    },
    actions:{
        addParentClass({commit}, params){
            post("/foodClass/addParent",{className:params})
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        getParentClass({commit}, params){
           return get("/foodClass/getParentClass")
                .catch(err=>{
                    console.log(err)
                })
        },
        addChildClass({commit}, params){
          return post("/foodClass/addChildClass",{...params})
              .catch(err=>{
                  console.log(err)
              })
        },
        getChildClass({commit}, params){
            return get("/foodClass/getChildClass",{...params})
                .catch(err=>{
                    console.log(err)
                })
        },
        addItem({commit}, params){
            return post("/foodClass/addItem",{...params})
                .catch(err=>{
                    console.log(err)
                })
        },
        getItem({commit}, params){
            return get("/foodClass/getItem",{...params})
                .catch(err=>{
                    console.log(err)
                })
        },
        delFoodClass({commit}, params){
            return post("/foodClass/foodClass",{...params})
                .catch(err=>{
                    console.log(err)
                })
        },
        delItem({commit}, params){
            return post("/foodClass/item",{...params})
                .catch(err=>{
                    console.log(err)
                })
        },
        updateItem({commit}, params){
            return post("/foodClass/updateItem",{...params})
                .catch(err=>{
                    console.log(err)
                })
        }
    },
};
export default foodClass;
