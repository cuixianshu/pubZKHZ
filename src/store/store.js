import Vue from 'vue';
import Vuex from 'vuex';
import qs from 'qs';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    isLogined:false,
    user:{}
  },
  mutations:{
    changeLogin(state,stt) {
      // state.isLogined=stt;
    },
    userLogined(state,details) {
      state.user=details;
      state.isLogined=true;
      // console.log(state.user);
    },
    userLoginOut(state) {
      state.isLogined=false;
      state.user={};
    },
    setUserAuthorations(state,auth) {
      state.user.authorations=auth;  
    }
  },
  getters:{

  },
  actions:{
    getLoginedUser(store,o) {
      var that=o.vue;
      axios({
        method: 'post',
        url: 'login.php',
        data: qs.stringify(o.logining_user)
      }).then(function (response) {
        if(response.data.length>0) {
          store.commit('userLogined',response.data[0]);
          that.$router.push('/home');
        } else {
          that.$toast({
            text: '电话号/密码错误或没有权限!',
            type: 'info',
            duration: 2000
          });              
        }
      }).catch(function (error) {
          that.$toast({
            text: '与服务器通信失败!',
            type: 'info',
            duration: 2000
          });           
        console.log(error);
      });
    },
    updateUserAuthorations (store,auth) {

    }
  },
  mapGetters:{

  },
  module:{

  }
});

export default store;
