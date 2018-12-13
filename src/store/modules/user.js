let userInfo = {};
if(localStorage.getItem('userInfo')){
  userInfo = JSON.parse(localStorage.getItem('userInfo'))
}
const user = {
    state: {
      token:userInfo.id,
      accessSign:userInfo.accessSign,
      name:userInfo.name,
      email:userInfo.email,
      deptName:userInfo.deptName,
      deptId:userInfo.deptId,
      orgName:userInfo.orgName,
      sign:userInfo.sign,
    },
    getters:{
      getPos(state){

      }
    },
    mutations: {
        logOut (state, vm) {
            state.accessSign = null;
            state.token = null;
            state.name = null;
            state.email = null;
            state.deptName = null;
            state.deptId = null;
            state.sign = null;
            state.orgName = null;
        },
        setName(state,value){
          state.name = value;
        },
        setAccessSign(state,value){
            state.accessSign = value;
        }
    }
};

export default user;
