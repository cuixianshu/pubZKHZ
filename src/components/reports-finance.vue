<template>
<div class="father">
  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#rcpt">收款报表</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#pay">付款报表</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#invoice" title="我公司发票开具情况报表">发票开具报表</a>
    </li>
  </ul>
  <div class="tab-content">
    <div id="rcpt" class="container-fluid tab-pane active">
      <div class="row">
        <div class="form-inline" v-if="rcptnData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="rcptQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="收款时间,默认上个月" :shortcuts="shortcuts" placeholder="收款的时间范围">
          </datepicker>
          <select class="form-control" v-model="rcptQC.id_cashier" title="出纳员">
            <option value="0">所有出纳</option> 
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="rcptQC.id_way" title="收款方式">
            <option value="0">所有方式</option>
            <option v-for="item in payments" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="rcptQC.acnt" title="收款账号">
            <option value="0">所有账号</option>
            <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>
          </select>
          <select class="form-control" v-model="rcptQC.isReviewed"  title="是否已复核">
            <option value="0">未复核</option>
            <option value="1">已复核</option>
            <option value="2">复核状态</option>
          </select>
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getRcptCashData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="rcptnData.length>0">
        <span class="tip">
          共{{rcptnData.length}}次。
          收款总额:{{rcptnTotalAmount.toFixed(2)}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="rcpt_json_data" :fields="rcpt_json_fields" :name="rcpt_filename" worksheet="财务收款报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="rcptnData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="rcptnData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in rcptTitles" :width="rcptWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in rcptnData">
              <td title='收款ID'>{{row.id}}</td>
              <td :title='row.id_account'>{{row.id_account}}</td>
              <td :title='row.id_way_pay'>{{row.id_way_pay}}</td>
              <td :title='row.amount'>{{row.amount}}</td>
              <td :title='row.id_cashier'>{{row.id_cashier}}</td>
              <td :title='row.time_collect'>{{row.time_collect}}</td>
              <td :title='row.id_project'>{{row.id_project}}</td>
              <td :title='row.time_confirm'>{{getReviewText(row)}}</td>
              <td :title='row.other'>{{row.other}}</td>
              <td :title='row.id_detailed_accounting'>{{row.id_detailed_accounting}}</td>
              <td :title='row.business_type'>{{row.business_type}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="pay" class="container-fluid tab-pane">
      <div class="row">
        <div class="form-inline" v-if="payData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="payQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="付款时间,默认上个月" :shortcuts="shortcuts" placeholder="付款的时间范围">
          </datepicker>
          <input class="form-control" v-model="payQC.keyWord" title="用途,发票号,收款账号,银行流水号等" placeholder="查询关键字" style="width:110px; background: #CEFFCE;">
          <select class="form-control" v-model="payQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="payQC.id_nature" title="选择款项性质">
            <option v-for="item in payNatures" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="payQC.id_applyer" title="选择请款人">
            <option value="0">所有请款人</option>
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="payQC.way" title="付款方式">
            <option value="0">所有方式</option>
            <option v-for="item in payments" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="payQC.acnt" title="付款账号">
            <option value="0">所有账号</option>
            <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>
          </select>
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getPayData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="payData.length>0">
        <span class="tip">
          共{{payData.length}}次。
          付款总额:{{payTotalAmount.toFixed(2)}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="pay_json_data" :fields="pay_json_fields" :name="pay_filename" worksheet="付款报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="payData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="payData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in payTitles" :width="payWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in payData">
              <td :title='row.r_nature'>{{row.r_nature}}</td>
              <td :title='row.id_detailed_accounting'>{{row.id_detailed_accounting}}</td>
              <td :title='row.id'>{{row.id}}</td>
              <td :title='row.id_account'>{{row.id_account}}</td>
              <td :title='row.id_way_pay'>{{row.id_way_pay}}</td>
              <td :title='row.amount'>{{row.amount}}</td>
              <td :title='row.r_id_applyer'>{{row.r_id_applyer}}</td>
              <td :title='row.time_paid'>{{row.time_paid}}</td>
              <td :title='row.r_id_project'>{{row.r_id_project}}</td>
              <td :title='row.r_use_for'>{{row.r_use_for}}</td>
              <td :title='row.numbers_bills'>{{row.numbers_bills}}</td>
              <td :title='row.remark'>{{row.remark}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="invoice" class="container-fluid tab-pane">
      <div class="row">
        <div class="form-inline" v-if="invoiceData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="invoiceQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="发票填开的时间范围,默认上个月" :shortcuts="shortcuts" placeholder="填开发票的时间范围">
          </datepicker>
          <input class="form-control" v-model="invoiceQC.keyWord" title="发票号,抬头,商品名,金额,备注等" placeholder="查询关键字" style="width:110px; background: #CEFFCE;">
          <select class="form-control" v-model="invoiceQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="invoiceQC.id_ourCompany" title="出具发票公司名">
            <option value="0">全部公司</option>
            <option v-for="item in ourCompanys" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="invoiceQC.isCanceled" title="作废状态">
            <option value="0">未作废</option>
            <option value="1">已作废</option>
            <option value="2">作废状态</option>
          </select>
          <select class="form-control" v-model="invoiceQC.isCashed" title="作废状态">
            <option value="0">未收款</option>
            <option value="1">已收款</option>
            <option value="2">收款状态</option>
          </select>
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getInvoiceData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="invoiceData.length>0">
        <span class="tip">
          共{{countOfInvoices}}张。
          开票总额:{{invoiceTotalAmount.toFixed(2)}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="invoice_json_data" :fields="invoice_json_fields" :name="invoice_filename" worksheet="发票报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="invoiceData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="invoiceData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in invoiceTitles" :width="invoiceWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in invoiceData">
              <td title='开票ID'>{{row.id}}</td>
              <td :title='row.id_project'>{{row.id_project}}</td>
              <td :title='row.r_id_applyer'>{{row.r_id_applyer}}</td>
              <td :title='row.time_fill'>{{row.time_fill}}</td>
              <td :title='row.r_id_of_our_cmpny'>{{row.r_id_of_our_cmpny}}</td>
              <td :title='row.r_id_type_invoice'>{{row.r_id_type_invoice}}</td>
              <td :title='row.num_of_invoice'>{{row.num_of_invoice}}</td>
              <td :title='row.r_id_clt_prnt_ognztn'>{{row.r_id_clt_prnt_ognztn}}</td>
              <td :title='row.r_googs_name'>{{row.r_googs_name}}</td>
              <td :title='row.amount'>{{row.amount}}</td>
              <td :title='row.id_tbl_cashier'>{{row.id_tbl_cashier}}</td>
              <td :title='row.other'>{{row.other}}</td>
              <td :title='row.r_other'>{{row.r_other}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>    
</div>
</template>

<script>
import datepicker from 'vue2-datepicker';
import qs from 'qs';
import jsonexcel from 'vue-json-excel/JsonExcel.vue';
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
      projects:this.$store.state.projects,
      employees:this.$store.state.employees,
      payments:this.$store.state.waysOfPayment,
      ourAccounts:this.$store.state.ourAccounts,
      ourCompanys:this.$store.state.ourCompanies,
      typeOfInvoices:this.$store.state.typesOfInvoices,
      clntParentOgnztns:this.$store.state.clntParentOgnztns,

      rcptQC:{
        dateRange:[],
        // id_project:0,
        id_cashier:0,
        id_way:0,
        acnt:0,
        isReviewed:2,
      },
      rcptnData:[],
      rcptTitles:['收款ID','收款账号','收款方式','收款金额','收款人','收款时间','所属项目','复核时间','备注','会计科目编码','收款类型'],
      rcptWidths:['7%','9%','7%','7%','8%','9%','9%','13%','9%','13%','9%'],
      rcptnTotalAmount:0,
      rcpt_json_fields:{},
      rcpt_json_data:[],
      rcpt_filename:'收款报表', 
      rcpt_volName:{
        // '项目':'id_project',
        '账户':'id_account',
        '方式':'id_way_pay',
        '金额':'amount',
        '出纳':'id_cashier',
        '收款时间':'time_collect',
        '复核时间':'time_confirm',
        '复核人':'id_confirmer',
        '复核评语':'describe_confirm',
        '备注':'other',
        '收款类型':'business_type',
        '会计科目编码':'id_detailed_accounting',
      },
      business_types:[{id:1,name:'非机票销售'},{id:2,name:'上缴款'},{id:3,name:'机票'},{id:4,name:'还款'}],

      payQC:{
        keyWord:'',
        dateRange:[],
        id_project:0,
        id_nature:0,
        id_applyer:0,
        way:0,
        acnt:0,
      },
      payData:[],
      payTitles:['款项性质','会计科目','付款ID','付款账号','付款方式','付款金额','请款人','付款时间','所属项目','款项用途','发票号码','备注'],
      payWidths:['7%','12%','6%','7%','5%','8%','5%','12%','9%','11%','9%','9%'],
      payNatures:this.$store.state.naturesFunds,
      // [
      //   {id:0,name:'款项性质'},
      //   {id:1,name:'费用报销'},
      //   {id:2,name:'借款备用'},
      //   {id:3,name:'采购付款'},
      //   {id:4,name:'机票退款'},
      // ],
      payTotalAmount:0,
      pay_json_fields:{},
      pay_json_data:[],
      pay_filename:'付款报表', 
      pay_volName:{
        '付款ID':'id',
        '付款账号':'id_account',
        '付款方式':'id_way_pay',
        '付款金额':'amount',
        '请款人':'r_id_applyer',//请款表中
        '付款时间':'time_paid',
        '所属项目':'r_id_project',//请款表中
        '请款ID':'id_rqst_funds',
        '银行流水':'serial_paid',
        '发票号码':'numbers_bills',
        '出纳':'id_cashier',
        '收款账号':'r_account',//请款表中
        '复核人':'id_reviewer',
        '款项用途':'r_use_for',//请款表中
        '款项性质':'r_nature',//请款表中
        '会计科目编码':'id_detailed_accounting',
        '付款备注':'remark',
        '请款备注':'r_remark',//请款表中
      },
      invoiceQC:{
        dateRange:[],
        keyWord:'',
        id_ourCompany:0,
        isCanceled:2,
        id_project:0,
        isCashed:2,
      },
      invoiceData:[],
      invoiceTitles:['开票ID','所属项目','申请人','开票时间','出票公司','发票类型','发票号码','发票抬头','开票商品名','开票金额','付款ID','开票备注','申请发票备注'],
      invoiceWidths:['4%','6%','6%','9%','9%','6%','9%','9%','8%','7%','5%','8%','7%'],
      invoice_json_fields:{},
      invoice_json_data:[],
      invoice_filename:'发票报表',
      invoiceTotalAmount:0,
      invoice_volName:{
        "开票ID":"id",
        "所属项目":"id_project",
        "申请ID":"r_id",
        "申请人":"r_id_applyer",
        "申请开票日期":"r_time_apply",
        "申请开票金额":"r_amount",
        "出票公司":"r_id_of_our_cmpny",
        "发票类型":"r_id_type_invoice",
        "发票号码":"num_of_invoice",
        "开票商品名":"r_googs_name",
        "开票金额":"amount",
        "开票时间":"time_fill",
        "开票人":"id_filler",
        // "发票作废人":"id_canceled_by",
        "作废时间":"time_canceled",
        "发票抬头":"r_id_clt_prnt_ognztn",
        "收款ID":"id_tbl_cashier",
        "开票备注":"other",
        "申请发票备注":"r_other",
      },
      countOfInvoices:0,
      dtldAcntgs:this.$store.state.detailedAccountings,
    }
  },
  components: {
    datepicker,
    jsonexcel
  },
  methods: {
    getRcptCashData () {
      this.rcptnData=[];
      this.rcptnTotalAmount=0;
      if(this.rcptQC.dateRange.length<2 || this.rcptQC.dateRange[0].length<10 || this.rcptQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.rcptQC.dateRange[0]=lastMonth.firstDay;
        this.rcptQC.dateRange[1]=lastMonth.endDay;
      }
      this.rcptQC.dateRange[0]+=(this.rcptQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.rcptQC.dateRange[1]+=(this.rcptQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.rcptQC.conditions='ForReport';
      this.$axios({
            method: 'post',
            url: 'getCashiers.php',
            data: qs.stringify(_this.rcptQC)
        }).then(function (response) {
          console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.rcptnData=response.data;
          _this.rcptnData.forEach(function(item,index,array){
            var ar=_this.employees.find((ele) => ele['id'] == item.id_cashier);
            item.id_cashier=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.payments.find((ele) => ele['id'] == item.id_way_pay);
            item.id_way_pay=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.ourAccounts.find((ele) => ele['id'] == item.id_account);
            item.id_account=typeof(ar)=='undefined'?'':ar['short_name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_confirmer);
            item.id_confirmer=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.dtldAcntgs.find((ele) => ele['id'] == item.id_detailed_accounting);
            item.id_detailed_accounting=typeof(ar)=='undefined'?'':ar['code_num']+ar['name'];
            var ar=_this.business_types.find((ele) => ele['id'] == item.business_type);
            item.business_type=typeof(ar)=='undefined'?'':ar['name'];
            _this.rcptnTotalAmount+= Number(item['amount']);

          });
          _this.rcpt_json_data=[];
          _this.rcpt_json_fields={};
          _this.rcpt_json_data=_this.rcptnData;
          _this.rcpt_filename='收款报表';
          for(var prop in _this.rcpt_volName) {
            _this.rcpt_json_fields[prop]=_this.rcpt_volName[prop];
          }
          _this.rcpt_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        }); 
    },
    getPayData () {
      this.payData=[];
      this.payTotalAmount=0;
      if(this.payQC.dateRange.length<2 || this.payQC.dateRange[0].length<10 || this.payQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.payQC.dateRange[0]=lastMonth.firstDay;
        this.payQC.dateRange[1]=lastMonth.endDay;
      }
      this.payQC.dateRange[0]+=(this.payQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.payQC.dateRange[1]+=(this.payQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.payQC.conditions='ForPayReport';
      this.$axios({
            method: 'post',
            url: 'getPaymentData.php',
            data: qs.stringify(_this.payQC)
        }).then(function (response) {
          console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.payData=response.data;
          _this.payData.forEach(function(item,index,array){
            var ar=_this.ourAccounts.find((ele) => ele['id'] == item.id_account);
            item.id_account=typeof(ar)=='undefined'?'':ar['short_name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_cashier);
            item.id_cashier=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.payments.find((ele) => ele['id'] == item.id_way_pay);
            item.id_way_pay=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.r_id_applyer);
            item.r_id_applyer=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.projects.find((ele) => ele['id'] == item.r_id_project);
            item.r_id_project=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.payNatures.find((ele) => ele['id'] == item.r_nature);
            item.r_nature=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.dtldAcntgs.find((ele) => ele['id'] == item.id_detailed_accounting);
            item.id_detailed_accounting=typeof(ar)=='undefined'?'':ar['code_num']+ar['name'];
            _this.payTotalAmount+= Number(item['amount']);

          });
          _this.pay_json_data=[];
          _this.pay_json_fields={};
          _this.pay_json_data=_this.payData;
          _this.pay_filename='付款报表';
          for(var prop in _this.pay_volName) {
            _this.pay_json_fields[prop]=_this.pay_volName[prop];
          }
          _this.pay_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
             duration: 4000
          });
        });
    },
    getInvoiceData () {
      this.invoiceData=[];
      this.invoiceTotalAmount=0;
      if(this.invoiceQC.dateRange.length<2 || this.invoiceQC.dateRange[0].length<10 || this.invoiceQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.invoiceQC.dateRange[0]=lastMonth.firstDay;
        this.invoiceQC.dateRange[1]=lastMonth.endDay;
      }
      this.invoiceQC.dateRange[0]+=(this.invoiceQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.invoiceQC.dateRange[1]+=(this.invoiceQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.invoiceQC.conditions='ForinvoiceReport';
      this.$axios({
            method: 'post',
            url: 'getInvoices.php',
            data: qs.stringify(_this.invoiceQC)
        }).then(function (response) {
          console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.invoiceData=response.data;
          var listOfIdOfFilledInvoices=[];
          // _this.invoiceData.forEach(function(item,index,array){
          //   var ar=_this.projects.find((ele) => ele['id'] == item.id_project);
          //   item.id_project=typeof(ar)=='undefined'?'':ar['name'];
          //   var ar=_this.employees.find((ele) => ele['id'] == item.r_id_applyer);
          //   item.r_id_applyer=typeof(ar)=='undefined'?'':ar['name'];
          //   var ar=_this.ourCompanys.find((ele) => ele['id'] == item.r_id_of_our_cmpny);
          //   item.r_id_of_our_cmpny=typeof(ar)=='undefined'?'':ar['name'];
          //   var ar=_this.typeOfInvoices.find((ele) => ele['id'] == item.r_id_type_invoice);
          //   item.r_id_type_invoice=typeof(ar)=='undefined'?'':ar['name'];
          //   var ar=_this.employees.find((ele) => ele['id'] == item.id_filler);
          //   item.id_filler=typeof(ar)=='undefined'?'':ar['name'];
          //   var ar=_this.clntParentOgnztns.find((ele) => ele['id'] == item.r_id_clt_prnt_ognztn);
          //   item.r_id_clt_prnt_ognztn=typeof(ar)=='undefined'?'':ar['full_name'];

          //   if(!listOfIdOfFilledInvoices.includes(item['id'])) {
          //     listOfIdOfFilledInvoices.push(item['id']);
          //     _this.invoiceTotalAmount+= Number(item['amount']);
          //   } else {
          //     var el=array.find((ele)=> ele['id']==item['id']);
          //     el['r_amount']=Number(item['r_amount'])+'+'+Number(el['r_amount']);
          //     el['r_id']+=','+item['r_id'];
          //     array.splice(index,1);
          //   }
          // });
          for(var index=0;index<_this.invoiceData.length;index++) {
            var item=_this.invoiceData[index];
            var ar=_this.projects.find((ele) => ele['id'] == item.id_project);
            item.id_project=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.r_id_applyer);
            item.r_id_applyer=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.ourCompanys.find((ele) => ele['id'] == item.r_id_of_our_cmpny);
            item.r_id_of_our_cmpny=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.typeOfInvoices.find((ele) => ele['id'] == item.r_id_type_invoice);
            item.r_id_type_invoice=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_filler);
            item.id_filler=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.clntParentOgnztns.find((ele) => ele['id'] == item.r_id_clt_prnt_ognztn);
            item.r_id_clt_prnt_ognztn=typeof(ar)=='undefined'?'':ar['full_name'];

            item.num_of_invoice="'"+item.num_of_invoice;
            if(!listOfIdOfFilledInvoices.includes(item['id'])) {
              listOfIdOfFilledInvoices.push(item['id']);
              _this.invoiceTotalAmount+= Number(item['amount']);
            } else {
              var el=_this.invoiceData.find((ele)=> ele['id']==item['id']);
              el['r_amount']=Number(item['r_amount'])+'+'+Number(el['r_amount']);
              el['r_id']+=','+item['r_id'];
              _this.invoiceData.splice(index,1);
              index--;
            }
          }
          _this.countOfInvoices=listOfIdOfFilledInvoices.length;
          _this.invoice_json_data=[];
          _this.invoice_json_fields={};
          _this.invoice_json_data=_this.invoiceData;
          _this.invoice_filename='发票报表';
          for(var prop in _this.invoice_volName) {
            _this.invoice_json_fields[prop]=_this.invoice_volName[prop];
          }
          _this.invoice_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
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
  },
  computed: {
    getReviewText() {
      return function (row) {
        return row.time_confirm?row.time_confirm:'未复核';
      }
    }
  },
  beforeCreate () {
  }   
}

</script>

<style scoped>
.tab-content {
  margin: 5px auto;
}
.tab-content input,.tab-content .datepicker,.tab-content select,.tab-content button {
  margin-right: 5px;
}
.row {
  margin-bottom: 2px;
}
.tip {
  font-size: 18px;
  color: #007bff;
}
</style>
