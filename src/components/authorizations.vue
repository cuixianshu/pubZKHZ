<template>
  <div class="father">
    <h5>当前位置:基础数据/员工权限</h5>
    <div class="container-fluid">
      <div class="row form-inline">
        <label for="employees">员工:</label>
        <select id="employees" v-model="employee.id" class="form-control" title="员工" placeholder="请选择员工" @change="changeTheUser">
          <option v-for="item in employees" :value="item.id" class="form-control">{{item.name}}</option>
        </select>
        <button class="btn btn-primary" @click="saveUserAuth" v-if="employee.id!=''">保存</button>
      </div>
      <div class="rootmenu_dictionary" v-for="(v,k,i) in menuTree" v-if="employee.id">
        <span class="mainmenutitle">{{rootmenu_dictionary[k]}}</span>
        <div class="card-group">
          <div class="card" v-for="item in menuTree[k]">
            <div class="checkbox">
              <label class="form-check-label">
                <input type="checkbox" v-model="slctdUsersAuth[item['name_router']]">{{item['text_in_menu']}}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//权限的实现
/*
1.在tbl_components中增加相应的模块,注意:superior必须是对应组件的路由中name的前缀,如:cnfrc_communicate;
2.在tbl_userauthorizations中添加:1.以name_router命名的字段;2.以其前缀命名的字段,如:cnfrc;
3.在router中添加组件的路由信息
4.根据权限表,有权限的会被路由守卫放行,同时也会在菜单中显示;
 */
import qs from 'qs';  
  export default {
    data () {
      return {
        employees:this.$store.state.myEmplys,
        allEMPAuth:[],//全体员工的权限
        employee:{
          name:'',
          id:''
        },
        isNew:false,
        menuTree:{},
        slctdUsersAuth:{},
        originalUA:{},//用户原始权限
        auth_dict:{},
        vueCmpnts:[],
        superiorMenu_en:[],
        rootmenu_dictionary:{//根菜单字典
          bscinfo:'基础数据',
          finance:'财务业务',
          invoices:'发票业务',
          materials:'物料管理',
          orders:'订单管理',
          personal:'个人中心',
          purchasing:'采购业务',
          rqstfunds:'请款报销',
          reports:'业务报表',
          cnfrc:'国际项目',
          dmstc:'国内会议',
        }
      }
    },
    methods:{
      changeTheUser () {
        //获取用户原始权限
        for(var i=0;i<this.allEMPAuth.length;i++) {
          if(this.allEMPAuth[i]['id_user']==this.employee.id) {//已经有该用户的权限
            this.isNew=false;
            this.originalUA=JSON.parse(JSON.stringify(this.allEMPAuth[i]));
            break;
          } else {//没有该用户的权限
            if(i==this.allEMPAuth.length-1) {
              this.originalUA.id_user=Number(this.employee.id);
              this.isNew=true;
              for(var prop in this.auth_dict) {
                if(prop!=='id_user') {
                  this.originalUA[prop]=0;
                }
              }
            }
          }
        }

        this.slctdUsersAuth=JSON.parse(JSON.stringify(this.originalUA));
      },
      saveUserAuth() {
        for(var prop in this.slctdUsersAuth) {
          this.slctdUsersAuth[prop]=Number(this.slctdUsersAuth[prop]);
        }
        if(JSON.stringify(this.originalUA)===JSON.stringify(this.slctdUsersAuth)) {
          this.$toast({
            text: '没有检测到变化!',
            type: 'info',
            duration: 1000
          });
          return;
        } else {//设置根菜单权限
          for(var prop in this.menuTree) {
            var hasSubAuth=false;
            for(var k in this.slctdUsersAuth) {
              if((k.indexOf(prop)===0) && this.slctdUsersAuth[k]==1 && k!=prop) {
                hasSubAuth=true;
                break;
              }
            }
            this.slctdUsersAuth[prop]=hasSubAuth?1:0;
          }
// console.log(this.slctdUsersAuth);
// return;
          var _this=this;
          var url='';
          if(this.isNew) {
            url='insertUserAuthorizations.php';
          } else {
            url='updateUserAuthorizations.php';
          }
          this.$axios({
                method: 'post',
                url: url,
                data: qs.stringify(_this.slctdUsersAuth)
            }).then(function (response) {
              if(response.data===true) {
                _this.$toast({
                  text: "操作成功",
                  type: 'success',
                  duration: 1000
                });
              //更新数据
              _this.employee.id='';
              _this.employee.name='';
              _this.slctdUsersAuth={};
              _this.originalUA={};
              _this.getAllEmpAuth();
              } else {
                console.log(response.data);
                _this.$toast({
                  text: '操作失败,请稍后再试!',
                  type: 'danger',
                  duration: 4000
                });
              }
            }).catch(function (error) {
              console.log(error);
              _this.$toast({
                 text: '异步通信错误!'+error,
                 type: 'danger',
                  duration: 4000
              });
            });            
        }
      },
      getAllEmpAuth() {
        var _this=this;
        this.allEMPAuth=[];
        this.$axios({
          method: 'post',
          url: 'getAuthorizations.php'
        }).then(function (response) {
          _this.allEMPAuth=response.data;
          for(var i=0;i<_this.allEMPAuth.length;i++) {
            for(var prop in _this.allEMPAuth[i]) {
              _this.allEMPAuth[i][prop]=Number(_this.allEMPAuth[i][prop]);
            }
          }
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });        
      },
    },
    created () {
      this.getAllEmpAuth();
      var _this=this;
      this.vueCmpnts=[];
      this.$axios({
        method: 'post',
        url: 'getComponents.php'
      }).then(function (response) {
        _this.vueCmpnts=response.data;
        //根菜单
        for(var i=0;i<_this.vueCmpnts.length;i++) {
          if(!_this.superiorMenu_en.includes(_this.vueCmpnts[i]['superior']) && _this.vueCmpnts[i]['superior']!=='none') {
            _this.superiorMenu_en.push(_this.vueCmpnts[i]['superior']);
            _this.menuTree[_this.vueCmpnts[i]['superior']]=[];
          }
        }
        for(var i=0;i<_this.vueCmpnts.length;i++) {
          for(var prop in _this.menuTree) {
            if(_this.vueCmpnts[i]['superior']===prop) {
              var obj={};
              obj['name_router']=_this.vueCmpnts[i]['name_router'];
              obj['text_in_menu']=_this.vueCmpnts[i]['text_in_menu'];
            //根菜单下的二级菜单
              _this.menuTree[prop].push(obj);
            }
          }
          //菜单字典
          _this.auth_dict[_this.vueCmpnts[i]['name_router']]=_this.vueCmpnts[i]['text_in_menu'];
        }
      }).catch(function (error) {
        _this.$toast({
           text: '异步通信错误!'+error,
           type: 'danger',
           duration: 4000
        });
      });              
    }
  } 
</script>

<style scoped>
.mainmenutitle {
  color:#FF8C00;
}
.btn-primary {
  margin-left:10px;
}
.card-group {
  margin-bottom: 10px;
  height:30px;
}
.rootmenu_dictionary {
  text-align: left;
}
</style>
