import {get,post,put,del} from '../../../utils/http';
 const require ={
     namespaced:true,
    state:{

    },
     mutations:{

     },
     actions:{
         adminGetRequire({commit}, params){
             return post("/require/adminGetRequire")
                 .catch(e=>{
                     console.log(e)
                 })
         },
         updateRequire({commit}, params){
             return post("/require/updateRequire",{...params})
                 .catch(e=>{
                     console.log(e)
                 })
         },
     }

}
export default require;
