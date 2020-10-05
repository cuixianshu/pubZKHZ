<template>
  <div class="father">
    <h5>当前位置:收款付款/付款复核</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <input id="queryConditions" type="text" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="发票号、用车人、客户部门、客户单位,请款人 收款账号 用途等关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="付款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="付款的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfPaidRqstedFunds">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfPaidRqstedFunds.length>0">清除</button>            
        </div>          
      </div>

    </div>
    <div class="divfortable" v-if="listOfPaidRqstedFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row,index in listOfPaidRqstedFunds" @click="clickedARowInShower(row)">
            <td :title="row.id">{{row.id_rqst_funds}}</td>
            <td :title="row.project">{{row.project}}</td>
            <td :title="row.amount_rqsted">{{row.amount_rqsted}}</td>
            <td :title="row.way_pay">{{row.way_pay}}</td>
            <td :title="row.account_rqsted">{{row.account_rqsted}}</td>
            <td :title="row.use_for">{{row.use_for}}</td>
            <td :title="row.id_relative">{{row.id_relative}}</td>
            <td :title="row.remark">{{row.remark}}</td>
            <td :title="row.applyer">{{row.applyer}}</td>
            <td :title="row.cashier">{{row.cashier}}</td>
            <td :title="row.time_paid">{{(new Date(row.time_paid)).format('yyyy-MM-dd')}}</td>
            <!-- <td><input class="checkbox" type="checkbox"  name="selecter" @click=""></td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlReviewPaying" role="dialog" aria-labelledby="mdlReviewPaying" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>付款复核---项目:{{payment.project}}
              </h5>
            </span>
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>  
            </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="iptNature">性质</label>
                  <input id="iptNature" type="text" class="form-control" :value="payment.name_nature" title="请款时填写的款项性质" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label for="iptUseFor">用途</label>
                  <input id="iptUseFor" type="text" class="form-control" :value="payment.use_for"  title="款项用途" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctAS">一级</label>
                  <select id="slctAS" type="text" class="form-control" v-model="payment.id_accounting_sub" title="一级会计科目" @change="acc_subChanged()">
                    <option  value=0>一级科目</option>
                    <option v-for="item in accountingSubjects" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctNature">二级</label>
                  <select id="slctNature" type="text" class="form-control" v-model="payment.id_detailed_accounting" title="二级会计科目">
                    <option  value=0>二级科目</option>
                    <option v-for="item in DAsAtTheAccSub" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctpaymentAccount">付款</label>
                  <select id="slctpaymentAccount" type="text" class="form-control" placeholder="付款账户" v-model="payment.id_account" title="付款账户">
                    <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfpayment">方式</label>
                  <select id="slctWayOfpayment" type="text" class="form-control" v-model="payment.id_way_pay" placeholder="付款方式" title="付款方式">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" v-model="payment.amount" placeholder="实付金额" title="实付金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputSerial">流水</label>
                  <input id="inputSerial" type="text" class="form-control" v-model="payment.serial_paid" placeholder="银行流水号" title="银行流水号">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputSerialOfBills">票据</label>
                  <input id="inputSerialOfBills" type="text" class="form-control" v-model="payment.numbers_bills" title="相关票据号码,不超过256个字" placeholder="相关票据号码">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" v-model="payment.remark" title="付款时的备注内容" placeholder="备注信息,不超过64个字">
                </div>
              </div>
              <hr class="split-line">              
              <div class="row">
                <label class="radio-inline">
                  <span><input type="radio" v-model="payment.result_reviewed" class="radio-group" value=1 checked>正确</span>
                </label>                    
                <label class="radio-inline">
                  <span><input type="radio" v-model="payment.result_reviewed" class="radio-group"  value=0>已勘误</span>
                </label>
              </div>
              <div>
                <input v-model="payment.opinion_reviewed" type="text" placeholder="复核说明,如有错误请改正" class="form-control" style="width: 100%;">
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button @click="saveReviewing" class="btn btn-primary">保存</button>
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
        titlesOfList:['请款ID','项目','请款金额','付款方式','收款账号','用途','关联业务','备注','请款人','出纳员','付款时间'],
        widthOfTH:['7%','11%','8%','8%','14%','12%','8%','10%','6%','7%','9%'],
        listOfPaidRqstedFunds:[],
        currentUserId:this.$store.state.user.id_user,
        payment:{
          result_reviewed:1,
          opinion_reviewed:'',
          id_accounting_sub:0,
          id_detailed_accounting:0,
        },
        ourAccounts:this.$store.state.ourAccounts,
        wayOfPayment:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        accountingSubjects:this.$store.state.accountingSubjects,
        detailedAccountings:this.$store.state.detailedAccountings,
        DAsAtTheAccSub:[],
      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfPaidRqstedFunds() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfPaidRqstedFunds=[];
        this.queryContent.conditions="HasPaidNotReviewed";
        this.$axios({
          method: 'post',
          url: 'getPaymentData.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            console.log(response.data);
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfPaidRqstedFunds=response.data;
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
        this.payment=dataRow;
        if(this.payment.id_detailed_accounting) {
          var o=this.detailedAccountings.find((ele) => ele['id'] == this.payment.id_detailed_accounting);
          this.payment.id_accounting_sub=typeof(o)=='undefined'?0:o['id_patent'];
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.payment.id_accounting_sub);
        } else {
          this.payment.id_accounting_sub=0;
          this.payment.id_detailed_accounting=0;
          this.DAsAtTheAccSub=[];
        }
        this.payment.result_reviewed=1;
        $('#mdlReviewPaying').modal('toggle');
      },
      saveReviewing() {
        if(!this.payment.id_accounting_sub) {
          this.$toast({
            text: '请选择一级会计科目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(!this.payment.id_detailed_accounting) {
          this.$toast({
            text: '请选择二级会计科目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(!this.payment.id_account) {
          this.$toast({
            text: '请选择支付账户!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(!this.payment.way_pay) {
          this.$toast({
            text: '请选择支付方式!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.payment.amount<=0 || parseFloat(this.payment.amount)>parseFloat(this.payment.amount_rqsted)) {
          this.$toast({
            text: '请检查金额!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.payment.serial_paid.length<4) {
          this.$toast({
            text: '银行流水号不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.payment.numbers_bills.length<4) {
          this.$toast({
            text: '票据号码不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.payment.result_reviewed!=1 && this.payment.result_reviewed!=0) {
          this.$toast({
            text: '请做判断!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(!this.payment.opinion_reviewed && this.payment.result_reviewed==0) {
          this.$toast({
            text: '请注明错误!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        var queryContent={
          id_payment:this.payment.id,
          id_account:this.payment.id_account,
          id_way_pay:this.payment.id_way_pay,
          remark:this.payment.remark,
          amount:this.payment.amount,
          conditions:'ReviewPaying',
          id_reviewer:this.currentUserId,
          serial_paid:this.payment.serial_paid,
          numbers_bills:this.payment.numbers_bills,
          result_reviewed:this.payment.result_reviewed,
          opinion_reviewed:this.payment.opinion_reviewed,
          id_detailed_accounting:this.payment.id_detailed_accounting,
        };
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updatePayment.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            if(response.data===true) {
              $('#mdlReviewPaying').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfPaidRqstedFunds.length;i++) {
                if(_this.listOfPaidRqstedFunds[i]['id']==_this.payment.id) {
                  _this.listOfPaidRqstedFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlReviewPaying').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlReviewPaying').modal('toggle');
          });        
      },
      clearList () {
        this.listOfPaidRqstedFunds=[];
      },
      acc_subChanged() {
        if(this.payment.id_accounting_sub) {
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.payment.id_accounting_sub);
        } else {
          this.DAsAtTheAccSub=[];
        }
        // this.payment.id_detailed_accounting=0;
        this.payment.id_detailed_accounting=0;
        console.log(this.DAsAtTheAccSub);
      },
    },
    watch:{
      // 'payment.project':{
      //   handler() {
      //     for(var i=0;i<this.projects.length;i++) {
      //       if(this.payment.project==this.projects[i].prjct) {
      //         this.payment.id_project=this.projects[i].id;
      //       }
      //     }
      //   }
      // },
    },
    beforeCreate:function() {
      // this.accountingSubjects=[];
      // this.detailedAccountings=[];
      // var _this=this;
      // var queryContent={keyWord:'',conditions:''};
      // this.$axios({
      //   method: 'post',
      //   url: 'getDetailedAccountings.php',
      //   data: qs.stringify(queryContent)
      // }).then(function (response) {
      //   _this.detailedAccountings=response.data;
      // }).catch(function (error) {
      //   console.log(response.data);
      //   _this.$toast({
      //     text: '异步通信错误!'+error,
      //     type: 'danger',
      //     duration: 4000
      //   });
      // });
      // this.$axios({
      //   method: 'post',
      //   url: 'getAccountingSubjects.php',
      //   data: qs.stringify(queryContent)
      // }).then(function (response) {
      //   _this.accountingSubjects=response.data;
      // }).catch(function (error) {
      //   console.log(response.data);
      //   _this.$toast({
      //     text: '异步通信错误!'+error,
      //     type: 'danger',
      //     duration: 4000
      //   });
      // }); 
    },
  } 
</script>

<style scoped>
#searchConditions >*{
  margin:5px;
}   
h5 {
  color: #007bff;
}
datepicker {
  margin-left: 10px;  
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
.request-funds {
  color:red;
}
.split-line {
  background-color: red;
  color: red;
  border: 1px solid red;
}
.radio-group {
/*  display:inline-block; 
  width:40px;*/
  height: 1.2em;
  vertical-align:middle;
  margin-top:-2px;
  margin-bottom:1px;
}
.radio-inline {
  width: 50%;
}
input[type=radio] {
  width: 1.2em!important;
} 
</style>

