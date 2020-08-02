<template>
  <div class="father">
    <h5>当前位置:收款付款/其它收款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="缴款事由、缴款备注、项目名等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="缴款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="缴款的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfTurnedInFunds">🔍获取数据</button>
          <button class="btn btn-secondary" @click="listOfTurnInFunds=[];" v-if="listOfTurnInFunds.length>0">清除</button>            
        </div>          
      </div>
    </div>
    <div class="showerOfFilledInvoice" v-if="listOfTurnInFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="(row,index) in listOfTurnInFunds" @click="clickedARowInShower(row)">
            <td title="缴款ID">{{row.id}}</td>
            <td title="缴款人">{{getTurninName(row)}}</td>
            <!-- <td title="缴款项目">{{getProjectName(row)}}</td> -->
            <td title="缴款事由">{{row.cause}}</td>
            <td title="缴款金额">{{row.amount}}</td>
            <td title="缴款方式">{{getPayWay(row)}}</td>
            <td title="缴款备注">{{row.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlCashier" role="dialog" aria-labelledby="mdlCashier" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>其它收款---缴款ID:{{cashier.id_turn_in_funds}},金额:￥{{cashier.amount}}
              </h5>
            </span>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div id="detailsForCashier" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="payer">缴款</label>
                  <select id="payer" type="text" name="payer" class="form-control" v-model="cashier.id_payer" title="缴款人" disabled>
                    <option v-for="item in employees" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="natrue">性质</label>
                  <select id="natrue" type="text" class="form-control" v-model="cashier.natrue" title="款项性质" disabled>
                    <option v-for="item in natrues" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctAS">一级</label>
                  <select id="slctAS" type="text" class="form-control" name="ture" v-model="cashier.id_accounting_sub" title="一级会计科目" @change="acc_subChanged()">
                    <option  value=0>一级科目</option>
                    <option v-for="item in accountingSubjects" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctNature">二级</label>
                  <select id="slctNature" type="text" class="form-control" name="ture" v-model="cashier.id_detailed_accounting" title="二级会计科目">
                    <option  value=0>二级科目</option>
                    <option v-for="item in DAsAtTheAccSub" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctCashierAccount">账号</label>
                  <select id="slctCashierAccount" type="text" name="cashierAccount" class="form-control" placeholder="收款账号" v-model="cashier.id_account" title="收款账号">
                    <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="cashier.id_way_pay" placeholder="收款方式" title="收款方式">
                    <option v-for="item in waysOfPayment" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" name="cashiedAmount" v-model="cashier.amount" placeholder="实际收款金额" title="实际收款金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" name="remarkInCashier" v-model="cashier.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" @click="saveTheCollectedData" class="btn btn-primary">保存</button>
          </div>           
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import datepicker from 'vue2-datepicker';
import qs from 'qs';
Date.prototype.format = function(fmt) { 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt; 
} 
  export default {
    data() {
      return {
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:''
        },
        titlesOfList:['缴款ID','缴款人','事由','金额','方式','缴款备注'],
        widthOfTH:['16%','16%','20%','16%','16%','16%'],
        listOfTurnInFunds:[],
        currentUserId:this.$store.state.user.id_user,
        cashier:{
          amount:0,
          id_turn_in_funds:'',//缴款ID
          id_payer:'',
          id_way_pay:'',
          remark:'',
          natrue:1, 
          account:'中科平安',
          id_account:1,
          id_cashier:'',
          id_accounting_sub:0,
          id_detailed_accounting:0,
          business_type:2,
        },
        ourAccounts:this.$store.state.ourAccounts,
        waysOfPayment:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        employees:this.$store.state.employees,
        natrues:[
          {id:1,name:'上缴款项(非还款)'},
          {id:2,name:'归还借款'},
        ],
        accountingSubjects:this.$store.state.accountingSubjects,
        detailedAccountings:this.$store.state.detailedAccountings,
        DAsAtTheAccSub:[],

      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfTurnedInFunds() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }       
        this.queryContent.dateRange[0]+=(this.queryContent.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.queryContent.dateRange[1]+=(this.queryContent.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        var _this = this;
        this.listOfTurnInFunds=[];
        // this.titlesOfList=[];
        this.queryContent.conditions="NotCollected";
        this.$axios({
          method: 'post',
          url: 'getTurnInFunds.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfTurnInFunds=response.data;
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
               duration: 4000
            });
          });
      },
      clickedARowInShower(dataRow) {
        this.cashier.amount=dataRow.amount;
        this.cashier.id_turn_in_funds=dataRow.id;
        this.cashier.id_payer=dataRow.id_payer;
        // this.cashier.id_project=dataRow.id_project;
        this.cashier.id_way_pay=dataRow.id_way_pay;
        this.cashier.time_paid=dataRow.time_paid;
        this.cashier.account='中科平安';
        this.cashier.id_account=1;
        this.cashier.id_cashier=this.currentUserId;
        this.cashier.natrue=dataRow.nature;
        if(this.cashier.natrue===1) {//上缴款
          this.cashier.business_type=2;
        } else if(this.cashier.natrue===2) {//还款
          this.cashier.business_type=4;
        }
        this.cashier.signature_code=dataRow.signature_code;
        if(this.cashier.id_detailed_accounting) {
          var o=this.detailedAccountings.find((ele) => ele['id'] == this.cashier.id_detailed_accounting);
          this.cashier.id_accounting_sub=typeof(o)=='undefined'?0:o['id_patent'];
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.cashier.id_accounting_sub);
        } else {
          this.cashier.id_accounting_sub=0;
          this.cashier.id_detailed_accounting=0;
          this.DAsAtTheAccSub=[];
        }
// console.log(this.cashier);
// return;
        $('#mdlCashier').modal('toggle');
      },
      acc_subChanged() {
        if(this.cashier.id_accounting_sub) {
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.cashier.id_accounting_sub);
        } else {
          this.DAsAtTheAccSub=[];
        }
        this.cashier.id_detailed_accounting=0;
        // console.log(this.DAsAtTheAccSub);
      },
      saveTheCollectedData() {
        if(!this.cashier.id_accounting_sub) {
          this.$toast({
            text: '请选择一级会计科目!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(!this.cashier.id_detailed_accounting) {
          this.$toast({
            text: '请选择二级会计科目!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(this.cashier.amount<this.cashier.amount) {
          this.$toast({
            text: '收款金额不对!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        // queryContent.conditions='ByTurnInFunds';
        this.cashier.conditions='ByTurnInFunds';
        // var arr = Object.keys(this.cashier.signature_code);
        if(!this.cashier.signature_code) {
          this.cashier.id_request='';
          this.cashier.id_pay='';
        } else {
          var o={};
          o = JSON.parse(this.cashier.signature_code);
          this.cashier.id_request=o.id_request;
          this.cashier.id_pay=o.id_pay;
        }
// return;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateCashier.php',
          data: qs.stringify(_this.cashier)
          }).then(function (response) {
            if(response.data===true) {
              $('#mdlCashier').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfTurnInFunds.length;i++) {
                if(_this.listOfTurnInFunds[i]['id']==_this.cashier.id_turn_in_funds) {
                  _this.listOfTurnInFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              console.log(response.data);
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlCashier').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlCashier').modal('toggle');
          });        
      },
    },
    watch:{
    },
    computed: {
      getTurninName() {
        return function (r) {
          var stf=this.employees.find((ele) => ele['id'] == r.id_payer);
          return typeof(stf)=='undefined'?'':stf['name'];
        }
      },
      getProjectName() {
        return function (r) {
          var prjct=this.projects.find((ele) => ele['id'] == r.id_project);
          return typeof(prjct)=='undefined'?'':prjct['name'];
        }
      },
      getPayWay() {
        return function (r) {
          var WP=this.waysOfPayment.find((ele) => ele['id'] == r.id_way_pay);
          return typeof(WP)=='undefined'?'':WP['name'];
        }
      },
    },
    beforeCreate:function() {
    }    
  } 
</script>

<style scoped>
.father {
  width: 100%;
}
#searchConditions >*{
  margin:5px;
}   
h5 {
  color: #007bff;
}
datepicker {
  margin-left: 10px;  
}
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
table {
  overflow: auto;
  font-size: 14px;
}
.modal-body input,.modal-body select {
  width: 80%;
}
.row {
  margin-top: 10px;
}
.searchcontent input {
  margin-right: 5px;
}
.searchcontent button {
  margin-left: 5px;
}
#byhand {
  /*margin-left: 100px;*/
  position: absolute;
  /*bottom: 0;*/
  right: 0;
} 
</style>

