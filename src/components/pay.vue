<template>
  <div class="father">
    <ul class="nav nav-pills" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="pill" href="#query-emp-debt">员工欠款查询</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="pill" href="#pay-pane">支付款项</a>
      </li>
    </ul>
<!--     <h5>当前位置:收款付款/支付款项</h5> -->
    <div class="tab-content">
      <div id="pay-pane" class="container-fluid tab-pane">
        <div class="row">
          <div class="col-lg form-inline searchcontent">
            <label for="queryConditions">关键词:</label> 
            <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="发票号、用车人、客户部门、客户单位,请款人 收款账号 用途等关键词">
            <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="请款的时间范围"></datepicker> 
            <button class="btn btn-primary" @click="getListOfRqstedFunds">🔍获取请款数据</button>
            <button class="btn btn-secondary" @click="clearList" v-if="listOfRqstedFunds.length>0">清除</button>            
          </div>          
        </div>
        <div class="showerOfRqstedFunds" v-if="listOfRqstedFunds.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
            </thead>
            <tbody>
              <tr v-for="row,index in listOfRqstedFunds" @click="clickedARowInShower(row)">
                <td :title="row.project">{{row.project}}</td>
                <td :title="getNature(row)">{{getNature(row)}}</td>
                <td :title="row.name_applyer">{{row.name_applyer}}</td>
                <td :title="row.amount">{{row.amount}}</td>
                <td :title="row.way_pay">{{row.way_pay}}</td>
                <td :title="row.account">{{row.account}}</td>
                <td :title="row.use_for">{{row.use_for}}</td>
                <td :title="row.id_relative">{{row.id_relative}}</td>
                <td :title="row.remark">{{row.remark}}</td>
                <!-- <td :title="row.id">{{row.id}}</td> -->
                <td :title="row.time_applied">{{row.time_applied}}</td>
                <td :title="row.name_approver2">{{row.name_approver2}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="query-emp-debt" class="container-fluid tab-pane active">
        <div class="row">
          <div class="col-lg form-inline searchcontent">
            <datepicker class="datepicker"id="dateRange" v-model="debtQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间范围,默认上个月" :shortcuts="shortcuts" placeholder="请款的时间范围"></datepicker> 
            <label for="slctEmp">员工:</label> 
            <select id="slctEmp" class="form-control" v-model="debtQC.id_debter" title="请选择员工进行查询">
              <option value="0">所有员工</option> 
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
            <button class="btn btn-primary" @click="getEMPDebts">🔍获取数据</button>
            <button class="btn btn-secondary" @click="empDebters=[];" v-if="empDebters.length>0">清除</button>            
          </div>          
        </div>
        <div class="showerOfRqstedFunds" v-if="empDebters.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="(title,index) in titlesOfDebts" :width="widthOfDebts[index]">{{title}}</th>
            </thead>
            <tbody>
              <tr v-for="row,index in empDebters">
                <td title="借款人">{{getEMPName(row)}}</td>
                <td title="借款日期">{{row.time_applied}}</td>
                <td title="借款用途">{{row.use_for}}</td>
                <td title="借款金额">{{row.amount}}</td>
                <td title="已还金额">{{row.amount_returned}}</td>
                <td title="收款账号">{{row.account}}</td>
                <td title="收款方式">{{getWP(row)}}</td>
                <td title="借款备注信息">{{row.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal fade" id="mdlPay" role="dialog" aria-labelledby="mdlPay" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>支付款项---请款人:{{requestFunds.name_applyer}}--请款金额:{{requestFunds.amount}}
              </h5>
            </span>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>  
            </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row request-funds">
                <div class="col-lg  form-inline">
                  <label>性质</label>
                  <input type="text" class="form-control" :value="getNature(requestFunds)" :title="getNature(requestFunds)" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>用途</label>
                  <input type="text" class="form-control" :value="requestFunds.use_for" :title="requestFunds.use_for" readonly>
                </div>
              </div>
              <div class="row request-funds">
                <div class="col-lg  form-inline">
                  <label>账号</label>
                  <input type="text" class="form-control" :value="requestFunds.account" :title="requestFunds.account" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>备注</label>
                  <input type="text" class="form-control" :value="requestFunds.remark" :title="requestFunds.remark" readonly>
                </div>
              </div>
              <hr class="split-line">              
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctAS">一级</label>
                  <select id="slctAS" type="text" class="form-control" name="ture" v-model="payment.id_accounting_sub" title="一级科目" @change="acc_subChanged()">
                    <option  value=0>一级科目</option>
                    <option v-for="item in accountingSubjects" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctNature">二级</label>
                  <select id="slctNature" type="text" class="form-control" name="ture" v-model="payment.id_detailed_acc" title="二级科目">
                    <option  value=0>二级科目</option>
                    <option v-for="item in DAsAtTheAccSub" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctpaymentAccount">账户</label>
                  <select id="slctpaymentAccount" type="text" name="paymentAccount" class="form-control" placeholder="付款账户" v-model="payment.id_account" title="付款账户">
                    <option value=0>付款账户</option>
                    <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfpayment">方式</label>
                  <select id="slctWayOfpayment" type="text" class="form-control" name="wayOfpayment" v-model="payment.id_way_pay" placeholder="付款方式" title="付款方式">
                    <option value=0>付款方式</option>
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" name="cashiedAmount" v-model="payment.amount" placeholder="实付金额" title="实付金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputSerial">流水</label>
                  <input id="inputSerial" type="text" class="form-control" name="serialnumber" v-model="payment.serial_paid" placeholder="银行流水号" title="银行流水号">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputSerialOfBills">票据</label>
                  <input id="inputSerialOfBills" type="text" class="form-control" name="numbers_bills" v-model="payment.numbers_bills" title="相关票据号码,不超过256个字" placeholder="相关票据号码">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" name="remark" v-model="payment.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" @click="savePayment" class="btn btn-primary">确定</button>
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
        employees:this.$store.state.employees,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:''
        },
        titlesOfList:['项目','性质','请款人','金额','付款方式','收款账号','用途','关联','备注','请款时间','审批人'],
        widthOfTH:['8%','8%','6%','6%','6%','8%','16%','8%','16%','12%','6%'],
        listOfRqstedFunds:[],
        currentUserId:this.$store.state.user.id_user,
        requestFunds:{
          account:'',
          amount:'',
          id:'',
          id_applyer:'',
          id_approver:'',
          id_approver2:'',
          id_project:'',
          id_relative:'',
          id_way_pay:'',
          is_paid:'',
          name_applyer:'',
          name_approver:'',
          name_approver2:'',
          project:'',
          reason_reject:'',
          reason_reject2:'',
          remark:'',
          result_approved:'',
          result_approved2:'',
          time_applied:'',
          time_approved:'',
          time_approved2:'',
          use_for:'',
          way_pay:''
        },
        payment:{
          account:'中科平安',
          way_pay:'',
          id_way_pay:0,
          amount:0,
          serial_paid:'',
          numbers_bills:'',
          remark:'',
          id_account:0,
          id_cashier:'',
          id_nature:0,
          id_accounting_sub:0,
          id_detailed_acc:0,

        },
        ourAccounts:this.$store.state.ourAccounts,
        wayOfPayment:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        debtQC:{
          dateRange:[],
          id_debter:0,
        },
        empDebters:[],
        titlesOfDebts:['借款人','借款日期','借款用途','借款金额','已还金额','收款账号','收款方式','借款备注信息'],
        widthOfDebts:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],
        detailedAccountings:this.$store.state.detailedAccountings,
        accountingSubjects:this.$store.state.accountingSubjects,
        DAsAtTheAccSub:[],
        natures:this.$store.state.naturesFunds,
        // [
        //   {id:0,name:'款项性质'},
        //   {id:1,name:'费用报销'},
        //   {id:2,name:'借款'},
        //   {id:3,name:'采购验收后付款'},
        //   {id:4,name:'退机票款'},
        //   {id:5,name:'预付采购款'},
        //   {id:6,name:'采购进度款'},
        // ],
      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfRqstedFunds() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfRqstedFunds=[];
        this.queryContent.conditions="PassedAllApprovingAndNotPaid";
        this.$axios({
          method: 'post',
          url: 'getRequestFunds.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
// console.log(response.data);
// return;
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfRqstedFunds=response.data;
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
        console.log(dataRow);
        // this.DAsAtTheAccSub=this.detailedAccountings;
        this.requestFunds=dataRow;
        this.payment.account=dataRow.account;
        // this.payment.way_pay=dataRow.way_pay;
        this.payment.id_way_pay=dataRow.id_way_pay;
        this.payment.id_account=0;
        this.payment.amount=dataRow.amount;
        this.payment.id_accounting_sub=0;
        this.payment.id_detailed_acc=0;
        $('#mdlPay').modal('toggle');
      },
      savePayment() {
        if(!this.payment.id_detailed_acc) {
          this.$toast({
            text: '请选择科目明细!',
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
        if(!this.payment.id_way_pay) {
          this.$toast({
            text: '请选择支付方式!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.payment.amount<=0 || parseFloat(this.payment.amount)>parseFloat(this.requestFunds.amount)) {
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
        var queryContent={
          id_rqstFunds:this.requestFunds.id,
          id_account:this.payment.id_account,
          id_way_pay:this.payment.id_way_pay,
          remark:this.payment.remark,
          amount:this.payment.amount,
          conditions:'PAID',
          id_cashier:this.currentUserId,
          serial_paid:this.payment.serial_paid,
          numbers_bills:this.payment.numbers_bills ,
          id_accounting_sub:this.payment.id_accounting_sub,
          id_detailed_acc:this.payment.id_detailed_acc,
        };
// console.log(this.payment);
// return;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updatePayment.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
// return;
            if(response.data===true) {
              $('#mdlPay').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfRqstedFunds.length;i++) {
                if(_this.listOfRqstedFunds[i]['id']==_this.requestFunds.id) {
                  _this.listOfRqstedFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlPay').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlPay').modal('toggle');
          });        
      },
      clearList () {
        this.listOfRqstedFunds=[];
      },
      getEMPDebts () {

        this.empDebters=[];
        if(this.debtQC.dateRange.length<2 || this.debtQC.dateRange[0].length<10 || this.debtQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.debtQC.dateRange[0]=lastMonth.firstDay;
        this.debtQC.dateRange[1]=lastMonth.endDay;
        }
        this.debtQC.dateRange[0]+=(this.debtQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.debtQC.dateRange[1]+=(this.debtQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        var _this=this;
        this.debtQC.conditions='personalDebts';
        this.debtQC.keyWord='';
        this.$axios({
            method: 'post',
            url: 'getRequestFunds.php',
            data: qs.stringify(_this.debtQC)
          }).then(function (response) {
console.log(response.data);
// return;
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.empDebters=response.data;
          }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          }); 
      },
      getPreMonth() {
        var n = new Date();
        var year = n.getFullYear();
        var month = n.getMonth();
        if(month==0){
          month=12;
          year=year-1;
        }
        n = new Date(year,month, 0);
        var dayCount = n.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        var firstDay = year + "-" + month + "-" + "01";//上个月的第一天
        var endDay = year + "-" + month + "-" + dayCount;//这个月的第一天
        return {'firstDay':firstDay,'endDay':endDay};
      },
      acc_subChanged() {
        this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.payment.id_accounting_sub)
        this.payment.id_detailed_acc=0;
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
      // }
    },
    computed: {
      getEMPName() {
        return function (r) {
          var ar=this.employees.find((ele) => ele['id'] == r.id_applyer);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },
      getWP() {
        return function (r) {
          var ar=this.wayOfPayment.find((ele) => ele['id'] == r.id_way_pay);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },
      getNature() {
        return function (r) {
          var ar=this.natures.find((ele) => ele['id'] == r.nature);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },    
    },
    beforeCreate:function() {
    },
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
.request-funds {
  color:red;
}
.split-line {
  background-color: red;
  color: red;
  border: 1px solid red;
} 
</style>

