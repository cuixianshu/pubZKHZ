<template>
<div class="father">
  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#mNeedToReturn">待还物料</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#fNeedToReturn">待还借款</a>
    </li>
  </ul>
  <div class="tab-content">
    <div id="mNeedToReturn" class="container-fluid tab-pane active">
      <div class="row form-inline" v-if="mNTRList.length<1">
        <datepicker class="datepicker" id="dateRange" v-model="mNTRQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="申领物料的时间,默认上个月" :shortcuts="shortcuts" placeholder="申领物料的时间范围">
        </datepicker>
        <button id="btnSearch" class="btn btn-primary" type="button" @click="getmNTR">搜索数据</button>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="mNTRList.length>0">
        <span class="tip">
          共{{mNTRList.length}}次。
        </span>
        <button class="btn btn-secondary" type="button" @click="mNTRList=[]">清空</button>
      </div>
      <div class="divfortable" v-if="mNTRList.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in mNTRTitles" :width="mNTRWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in mNTRList">
              <td :title="row.id_applyer">{{getApplyer(row)}}</td>
              <td :title="row.m_name">{{row.m_name}}</td>
              <td :title="row.m_brand">{{row.m_brand}}</td>
              <td :title="row.m_model">{{row.m_model}}</td>
              <td :title="row.m_unit">{{row.m_unit}}</td>
              <td title="包装容量">{{row.m_min_unit_packing}}</td>
              <td :title="row.qty_distributed">{{row.qty_distributed}}</td>
              <td :title="row.qty_returned">{{row.qty_returned}}</td>
              <td title="领用用途">{{row.use_for}}</td>
              <td :title="row.remark">{{row.remark}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="fNeedToReturn" class="container-fluid tab-pane">
      <div class="row form-inline" v-if="fListNTR.length<1">
        <datepicker class="datepicker" id="dateRange" v-model="fNTRQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间,默认上个月" :shortcuts="shortcuts" placeholder="请款的时间范围">
        </datepicker>
        <button id="btnSearch" class="btn btn-primary" type="button" @click="getFundsNTR">搜索数据</button>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="fListNTR.length>0">
        <span class="tip">
          未还借款总额:{{fListTotalAmount}}元。
        </span>
        <button class="btn btn-secondary" type="button" @click="fListNTR=[]">清空</button>
      </div>
      <div class="divfortable" v-if="fListNTR.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in fListTitles" :width="fListWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row,index in fListNTR">
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
      payments:this.$store.state.waysOfPayment,
      currentUserId:this.$store.state.user.id_user,

      mNTRQC:{
        dateRange:[],
      },
      mNTRList:[],
      mNTRTitles:['申领人','物料名称','品牌','规格型号','计量单位','包装容量','已发放数','已归还数','领用用途','领用备注'],
      mNTRWidths:['10%','12.5%','10%','12%','8%','12.5%','8%','10%','7%','10%'],
      fNTRQC:{
        dateRange:[],
      },
      fListNTR:[],
      fListTitles:['借款人','借款日期','借款用途','借款金额','已还金额','收款账号','收款方式','借款备注信息'],
      fListWidths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],
      fListTotalAmount:0,
    }
  },
  components: {
    datepicker,
  },
  methods: {
    getmNTR () {
      this.mNTRList=[];
      if(this.mNTRQC.dateRange.length<2 || this.mNTRQC.dateRange[0].length<10 || this.mNTRQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.mNTRQC.dateRange[0]=lastMonth.firstDay;
        this.mNTRQC.dateRange[1]=lastMonth.endDay;
      }
      this.mNTRQC.dateRange[0]+=(this.mNTRQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.mNTRQC.dateRange[1]+=(this.mNTRQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.mNTRQC.conditions='MtrlsForNeedToReturnAtSomeone';
      this.mNTRQC.curUserId=this.currentUserId;
      this.$axios({
            method: 'post',
            url: 'getUnreturndMaterials.php',
            data: qs.stringify(_this.mNTRQC)
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
          _this.mNTRList=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        }); 
    },
    getFundsNTR () {
      this.fListNTR=[];
      this.fListTotalAmount=0;
      if(this.fNTRQC.dateRange.length<2 || this.fNTRQC.dateRange[0].length<10 || this.fNTRQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.fNTRQC.dateRange[0]=lastMonth.firstDay;
        this.fNTRQC.dateRange[1]=lastMonth.endDay;
      }
      this.fNTRQC.dateRange[0]+=(this.fNTRQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.fNTRQC.dateRange[1]+=(this.fNTRQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.fNTRQC.conditions='FundsForNeedToReturnAtSomeone';
      this.fNTRQC.curUserId=this.currentUserId;
      this.fNTRQC.keyWord='';
      this.$axios({
            method: 'post',
            url: 'getRequestFunds.php',
            data: qs.stringify(_this.fNTRQC)
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
          _this.fListNTR=response.data;
          _this.fListNTR.forEach(function(item,index,array){
            _this.fListTotalAmount+=(Number(item['p_amount'])- Number(item['amount_returned']));
          });
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
      getApplyer() {
        return function (row) {
          var empl=this.employees.find((ele) => ele['id'] == row.id_applyer);
          return typeof(empl)=='undefined'?'':empl['name'];
        }
      },
      getEMPName() {
        return function (r) {
          var ar=this.employees.find((ele) => ele['id'] == r.id_applyer);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },
      getWP() {
        return function (r) {
          var ar=this.payments.find((ele) => ele['id'] == r.id_way_pay);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },
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
