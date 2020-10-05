import Vue from 'vue/dist/vue.common.js';
import Vuex from 'vuex';
import qs from 'qs';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    isLogined:false,
    user:{},
    projects:[],
    employees:[],
    myEmplys:[],
    waysOfPayment:[],
    ourAccounts:[],
    ourCompanies:[],
    clntParentOgnztns:[],
    ourDepartments:[],
    products:[],
    typesOfInvoices:[],
    typesOfProducts:[],
    materials:[],
    equipments:[],
    myEqpmts:[],
    naturesFunds:[],
    accountingSubjects:[],
    detailedAccountings:[],
    agendas:[],
  },
  mutations:{
    changeLogin(state,stt) {
      // state.isLogined=stt;
    },
    userLogined(state,details) {
      state.user=details;
      state.isLogined=true;
      // console.log(state.isLogined);
    },
    userLoginOut(state) {
      state.isLogined=false;
      state.user={};
    },
    setUserAuthorations(state,auth) {
      state.user.authorations=auth;  
    },
    //initialize
    initializeProducts(state,data) {
      state.products=data;
    },
    initializeNaturesFunds(state,data) {
      state.naturesFunds=data;
    },
    initializeProjects(state,data) {
      state.projects=data;
    },
    initializeEmployees(state,data) {
      state.employees=data;
    },
    initializeMyEmplys(state,data) {
      state.myEmplys=data;
    },
    initializeWaysOfPayments(state,data) {
      state.waysOfPayment=data;
    },
    initializeAccounts(state,data) {
      state.ourAccounts=data;
    },
    initializeCompanies(state,data) {
      state.ourCompanies=data;
    },
    initializeCPOs(state,data) {
      state.clntParentOgnztns=data;
    },
    initializeDepartments(state,data) {
      state.ourDepartments=data;
    },
    initializeTOIs(state,data) {
      state.typesOfInvoices=data;
    },
    initializeTOPs(state,data) {
      state.typesOfProducts=data;
    },
    initializeMaterials(state,data) {
      state.materials=data;
    },
    initializeEquipments(state,data) {
      state.equipments=data;
    },
    initializeMyEqpmts(state,data) {
      state.myEqpmts=data;
    },
    initializeAccountingSubjects(state,data) {
      state.accountingSubjects=data;
    },
    initializeDetailedAccountings(state,data) {
      state.detailedAccountings=data;
    },
    initializeAgendas(state,data) {
      state.agendas=data;
    },
  },
  getters:{

  },
  actions:{
    tryToLongin(store,o) {
      var that=o.vue;
      axios({
        method: 'post',
        url: 'login.php',
        data: qs.stringify(o.logining_user)
      }).then(function (response) {
        // console.log(response.data);
        if(response.data.length>0 && response.data[0]['id_user']) {
          store.commit('userLogined',response.data[0]);
          store.dispatch('getProducts',that);
          store.dispatch('getProjects',that);
          store.dispatch('getEmployees',that);
          store.dispatch('getMyEmplys',that);
          store.dispatch('getWOPs',that);//waysOfPayment
          store.dispatch('getOurAccounts',that);
          store.dispatch('getOurCompanies',that);
          store.dispatch('getCPOs',that);//clntParentOgnztns
          store.dispatch('getOurDepartments',that);
          store.dispatch('getTypesOfInvoices',that);
          store.dispatch('getTypesOfProducts',that);
          store.dispatch('getMaterials',that);
          store.dispatch('getEquipments',that);
          store.dispatch('getMyEqpmts',that);
          store.dispatch('getNaturesFunds',that);
          store.dispatch('getAccountingSubject',that);
          store.dispatch('getDetailedAccountings',that);
          store.dispatch('getAgendas',that);
          that.$router.push('/home');
        } else {
          console.log(response.data);
          that.$toast({
            text: '电话号/密码错误或没有权限!',
            type: 'info',
            duration: 2000
          });              
        }
      }).catch(function (error) {
          console.log(error);
          that.$toast({
            text: '与服务器通信失败!',
            type: 'info',
            duration: 2000
          });           
      });
    },
    updateUserAuthorations (store,auth) {

    },
    getProducts(store,vue) {
      var that=vue;
      var queryContent={};
      queryContent.conditions="allProducts";
      that.$axios({
        method: 'post',
        url: 'getProducts.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeProducts',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getProjects (store,vue) {
      var that=vue;
      var queryContent={};
      queryContent.conditions="ownUnfinishedProjects";
      that.$axios({
        method: 'post',
        url: 'getProjects.php',
        data:qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeProjects',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getEmployees(store,vue) {
      var that=vue;
      var queryContent={};
      queryContent.conditions="All";
      that.$axios({
        method: 'post',
        url: 'getEmployees.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeEmployees',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getMyEmplys(store,vue) {
      var that=vue;
      var queryContent={};
      queryContent.conditions="ownEmployees";
      that.$axios({
        method: 'post',
        url: 'getEmployees.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeMyEmplys',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getWOPs(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getWaysOfPayments.php'
      }).then(function (response) {
        store.commit('initializeWaysOfPayments',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getOurAccounts(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getOurAccounts.php'
      }).then(function (response) {
        store.commit('initializeAccounts',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getOurCompanies(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getOurCompanys.php'
      }).then(function (response) {
        store.commit('initializeCompanies',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getCPOs(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:'All'};
      that.$axios({
        method: 'post',
        url: 'getClntPrntOgnztns.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeCPOs',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getOurDepartments(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getDepartments.php'
      }).then(function (response) {
        store.commit('initializeDepartments',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getTypesOfInvoices(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getTypesOfInvoices.php'
      }).then(function (response) {
        store.commit('initializeTOIs',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getTypesOfProducts(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getTypesOfProducts.php'
      }).then(function (response) {
        store.commit('initializeTOPs',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getMaterials(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:''};
      that.$axios({
        method: 'post',
        url: 'getMaterials.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeMaterials',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
    },
    getEquipments(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:'All'};
      that.$axios({
        method: 'post',
        url: 'getEquipments.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeEquipments',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });      
    },
    getMyEqpmts(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:'own'};
      that.$axios({
        method: 'post',
        url: 'getEquipments.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeMyEqpmts',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });      
    },
    getNaturesFunds(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:''};
      that.$axios({
        method: 'post',
        url: 'getNaturesFunds.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        store.commit('initializeNaturesFunds',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });      
    },
    getAccountingSubject(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:''};
      that.$axios({
        method: 'post',
        url: 'getAccountingSubjects.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        // console.log(response.data);
        store.commit('initializeAccountingSubjects',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });      
    },
    getDetailedAccountings(store,vue) {
      var that=vue;
      var queryContent={keyWord:'',conditions:''};
      that.$axios({
        method: 'post',
        url: 'getDetailedAccountings.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        // console.log(response.data);
        store.commit('initializeDetailedAccountings',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });      
    },
    getAgendas(store,vue) {
      var that=vue;
      that.$axios({
        method: 'post',
        url: 'getAgendas.php',
      }).then(function (response) {
        // console.log(response.data);
        store.commit('initializeAgendas',response.data);
      }).catch(function (error) {
        console.log(response.data);
        that.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });      
    },
  },
  mapGetters:{

  },
  module:{

  }
});

export default store;
