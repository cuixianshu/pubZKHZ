<template>
  <div>
    <h5>当前位置:基础数据/员工权限</h5>
    <div class="container-fluid">
      <div id="searchConditions"  class="form-group form-inline">
        <label for="employees">员工:</label>
        <select id="employees" v-model="employee.id" class="form-control" title="员工" placeholder="请选择员工" @change="changeTheUser">
          <option v-for="item in employees" :value="item.id" class="form-control">{{item.name}}</option>
        </select>
        <button class="btn btn-primary" @click="saveUserAuth">保存</button>
      </div>
      <div class="form-group form-inline" v-if="employee.id">
        <ul class="list-group"><!--  list-group-flush-->
          <li v-for="(value,key) in userAuthorizations" class="list-group-item" v-if="key!='id_user'">{{auth_dict[key]}}<input type="checkbox" :value="value" v-model="userAuthorizations[key]" ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';  
  export default {
    data () {
      return {
        employees:[],
        employee:{
          name:'',
          id:''
        },
        isNew:false,
        authorizations:[],
        userAuthorizations:{},
        originalUserAuthorizations:{},
        auth_dict:{
          // home:'首页',
          bscinfo: '基础数据',
          bscinfo_authorization: '员工权限',
          bscinfo_clnt_dptmt: '客户单位',
          bscinfo_contract: '合同管理',
          bscinfo_employee: '员工信息',
          bscinfo_equipment: '设备管理',
          bscinfo_product: '产品管理',
          bscinfo_project: '项目管理',
          bscinfo_rule_price: '计价规则',
          finance: '财务业务',
          finance_accept_other_funds: '其它收款',
          finance_cashier: '销售回款',
          finance_check_receipts: '收款复核',
          finance_pay: '支付款项',
          finance_review_payment: '付款复核',
          finance_tkt_cashier: '机票收款',
          id_user: '用户ID',
          invoices: '发票业务',
          invoices_apply: '申请开票',
          invoices_details: '发票明细',
          invoices_modify_fill: '开票变更',
          invoices_refill_cancel: '作废重开',
          materials: '物料管理',
          materials_Inventory: '库存盘点',
          materials_apply: '申请领用',
          materials_acceptance: '验收入库',
          materials_approve_applying:'审核领用',
          materials_distribute: '发放物料',
          materials_search: '查找新建',
          orders: '订单管理',
          orders_check_orders: '核单',
          orders_import_from_excel: 'Excel导入',
          orders_input_byhand: '手工输入',
          orders_tkt_change_refound: '机票退改',
          orders_tkt_inbound: '机票入库',
          orders_tkt_outbound: '机票出库',
          personal: '个人中心',
          personal_apply: '我的申请',
          personal_audits: '我的审批',
          personal_logout: '退出登录',
          personal_modify_info: '更改密码',
          personal_turn_in: '缴款还款',
          purchasing: '采购业务',
          purchasing_apply: '申请采购',
          purchasing_approve_applying: '审核请购',
          purchasing_approve_enquiry: '审核比价',
          purchasing_enquiry_compare: '询价比价',
          purchasing_launch: '采购执行',
          reports: '业务报表',
          reports_finance: '财务报表',
          reports_other: '其它报表',
          reports_purchasing: '采购报表',
          reports_sale: '销售报表',
          rqstfunds: '请款报销',
          rqstfunds_borrow_reimburse: '报销借款',
          rqstfunds_final_audits: '请款复审',
          rqstfunds_primary_audits: '请款初审',
          rqstfunds_purchasing_funds: '采购请款',
          rqstfunds_rfdtkt_paying: '机票退款'
        }
      }
    },
    methods:{
      changeTheUser () {
        //获取用户原始权限
        for(var i=0;i<this.allAuthorizations.length;i++) {
          if(this.allAuthorizations[i]['id_user']==this.employee.id) {//已经有该用户的权限
            this.isNew=false;
            this.originalUserAuthorizations=JSON.parse(JSON.stringify(this.allAuthorizations[i]));
            break;
          } else {//没有该用户的权限
            if(i==this.allAuthorizations.length-1) {
              this.originalUserAuthorizations.id_user=Number(this.employee.id);
              this.isNew=true;
              for(var prop in this.auth_dict) {
                if(prop!=='id_user') {
                  this.originalUserAuthorizations[prop]=0;
                }
              }
            }
          }
        }

        this.userAuthorizations=JSON.parse(JSON.stringify(this.originalUserAuthorizations));
        // console.log(this.originalUserAuthorizations);
      },
      saveUserAuth() {
        for(var prop in this.userAuthorizations) {
          this.userAuthorizations[prop]=Number(this.userAuthorizations[prop]);
        }
        if(JSON.stringify(this.originalUserAuthorizations)===JSON.stringify(this.userAuthorizations)) {
          this.$toast({
            text: '没有任何改变!',
            type: 'success',
            duration: 1000
          });
        } else {
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
                data: qs.stringify(_this.userAuthorizations)
            }).then(function (response) {
// console.log(response.data);
              if(response.data===true) {
                _this.$toast({
                  text: "操作成功",
                  type: 'success',
                  duration: 1000
                });
              //更新数据
              _this.employee.id='';
              _this.employee.name='';
              _this.userAuthorizations={};
              _this.originalUserAuthorizations={};              
              } else {
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
        // this.$store.dispatch('updateUserAuthorations',this.userAuthorizations);
      }
    },
    beforeCreate () {
      var _this=this;

      this.employees=[];
      this.$axios({
            method: 'post',
            url: 'getEmployees.php'
        }).then(function (response) {
          _this.employees=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      this.allAuthorizations=[];
      this.$axios({
            method: 'post',
            url: 'getAuthorizations.php'
        }).then(function (response) {
          _this.allAuthorizations=response.data;
          for(var i=0;i<_this.allAuthorizations.length;i++) {
            for(var prop in _this.allAuthorizations[i]) {
              _this.allAuthorizations[i][prop]=Number(_this.allAuthorizations[i][prop]);
            }
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
li {
  /*list-style: none;*/
  /*display:inline;*/
}  
h5 {
  color: #007bff;
}
.btn-primary {
  margin-left:10px;
}
</style>
