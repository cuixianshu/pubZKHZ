<template>
  <div class="father">
    <h5>当前位置:请款报销/采购请款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row form-inline searchcontent">
        <input id="queryConditions" type="text" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="请款人,用途,采购物品等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请购的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="请购的时间范围"></datepicker>
        <button class="btn btn-primary" @click="getListOfAppliedPcsings">🔍获取采购数据</button>
        <button class="btn btn-secondary" @click="clearList" v-if="listOfAP.length>0 || listOfRequestedFunds.length>0">清除</button>
        <button class="btn btn-primary history" @click="getHistory" title="请款的时间范围,默认最近7天">请款历史记录</button>
      </div>
    </div>
    <div class="divfortable" v-if="listOfAP.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfAPs" :width="widthOfAPs[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row,index in listOfAP" @click="clkToRequstFunds(row)">
            <td :title="row.id">{{row.id}}</td>
            <td :title="row.name">{{row.name}}</td>
            <td :title="row.quantity">{{row.quantity}}</td>
            <td :title="row.unit">{{row.unit}}</td>
            <td :title="row.actual_amount">{{row.actual_amount}}</td>
            <td :title="row.seller">{{row.seller}}</td>
            <td title="请购日期">{{(new Date(row.date_applied)).format('yyyy-MM-dd')}}</td>
            <td title="已请款且已审批但还未支付的金额">{{row.amount_rqstd_but_not_paid?row.amount_rqstd_but_not_paid:0}}</td>
            <td title="已支付的金额">{{row.amount_paid?row.amount_paid:0}}</td>
            <td title="可以为此次采购申请付款的金额">{{getAmountAllowToRequest(row)}}</td>
            <td title="验收日期">{{getACDate(row)}}</td>
          </tr><!-- (new Date(row.date_applied)).format('yyyy-MM-dd') -->
        </tbody>
      </table>
    </div>
    <div class="divfortable" v-if="listOfRequestedFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfRFs" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row,index in listOfRequestedFunds">
            <td title="款项性质">{{getNature(row)}}</td>
            <td :title="row.id_project">{{getProject(row)}}</td>
            <td :title="row.amount">{{row.amount}}</td>
            <td title="付款方式">{{getWayOfPayment(row)}}</td>
            <td :title="row.account">{{row.account}}</td>
            <td :title="row.use_for">{{row.use_for}}</td>
            <td :title="row.remark">{{row.remark}}</td>
            <td title="申请日期">{{(new Date(row.time_applied)).format('yyyy-MM-dd')}}</td>
            <td title="请款进度">{{getStatus(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlRqstPcsgFunds" role="dialog" aria-labelledby="mdlRqstPcsgFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
            <span><h5>新建采购请款---采购总金额：{{rqstPcsFds.actual_amount}}</h5></span>  
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>  
            </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctNature">性质</label>
                  <select id="slctNature" type="text" class="form-control" v-model="rqstPcsFds.nature" title="请款性质" :disabled="isACed">
                    <option v-for="item in natures" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" v-model="rqstPcsFds.amount" placeholder="请款金额" title="请款金额">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputAccount">账号</label>
                  <input id="slctCashierAccount" type="text" class="form-control" placeholder="接收款项的账号" v-model="rqstPcsFds.account" title="账号名和账号">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" v-model="rqstPcsFds.id_way_pay" title="付款方式">
                    <option value=0>付款方式</option>
                    <option v-for="item in waysOfPayment" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" v-model="rqstPcsFds.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
                <div class="col-lg  form-inline">
                  <label for="maxAmt">上限</label>
                  <input id="maxAmt" type="text" class="form-control" v-model="rqstPcsFds.maxAmtForRqsting" title="请款金额上限" disabled>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button id="btnSaveTheRequestedData" @click="saveTheRequestedData" class="btn btn-primary">创建申请</button>
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
        titlesOfAPs:['请购ID','物品','数量','计量单位','采购金额','收款账号','请购日期','已请未付额','已支付金额','可请金额','验收日期'],
        widthOfAPs:['6%','8%','6%','7%','7%','10%','12%','10%','10%','12%','12%'],
        listOfAP:[],
        idOfAppliedPcsg:'',
        currentUserId:this.$store.state.user.id_user,
        rqstPcsFds:{},
        waysOfPayment:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        listOfRequestedFunds:[],
        titlesOfRFs:['款项性质','所属项目','请款金额','支付方式','账号名和账号','用途','备注','请款日期','请款进度'],
        widthOfTH:['10%','8%','8%','9%','15%','18%','12%','9%','11%'],
        isACed:false,
        natures:[
          {id:0,name:'请款性质'},
          {id:3,name:'验收后付款'},
          {id:5,name:'预付采购款'},
          {id:6,name:'按进度付款'},
        ],
        ns_unACd:[{id:0,name:'请款性质'},{id:5,name:'预付采购款'},{id:6,name:'按进度付款'},],
        ns_ACd:[{id:0,name:'请款性质'},{id:3,name:'验收后付款'}],
      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfAppliedPcsings() {
        this.listOfRequestedFunds=[];
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfAP=[];
        this.queryContent.conditions="PaidAmount<ActualAmountAndEnqryPsdAprvg";
        this.$axios({
        method: 'post',
        url: 'getAppliedPurchasings.php',
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
            _this.listOfAP=response.data;
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
      clkToRequstFunds(r) {
        this.rqstPcsFds=r;
        // this.rqstPcsFds.nature=0;
        this.rqstPcsFds.amount=0;
        this.rqstPcsFds.id_way_pay=0;
        this.rqstPcsFds.maxAmtForRqsting=0;
        if(this.rqstPcsFds.id_pio) {
          this.natures=this.ns_ACd;
          this.rqstPcsFds.nature=3;
          this.isACed=true;
        } else {
          this.natures=this.ns_unACd;
          this.rqstPcsFds.nature=0;
          this.isACed=false;
        }
        // console.log(this.rqstPcsFds);
        // console.log(this.natures);
        // console.log(this.isACed);
        var amount_paid=r.amount_paid?r.amount_paid:0;
        var amount_rqstd_but_not_paid=r.amount_rqstd_but_not_paid?r.amount_rqstd_but_not_paid:0;
        this.rqstPcsFds.maxAmtForRqsting=r.actual_amount-amount_paid-amount_rqstd_but_not_paid;
        $('#mdlRqstPcsgFunds').modal('toggle');//open
      },
      saveTheRequestedData() {
        if(this.rqstPcsFds.nature==0) {
          this.$toast({
            text: '请选择请款性质',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(this.rqstPcsFds.amount<=0 || this.rqstPcsFds.amount>this.rqstPcsFds.maxAmtForRqsting) {
          this.$toast({
            text: '请款金额不对!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(this.rqstPcsFds.account.length<8) {
          this.$toast({
            text: '账号不能少于8个字!',
            type: 'info',
            duration: 2000
          });
          return false;
        }        
        if(this.rqstPcsFds.id_way_pay==0) {
          this.$toast({
            text: '请选择付款方式!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        
        var queryContent=this.rqstPcsFds;
        queryContent.id_rqstr=this.currentUserId;
        queryContent.conditions='NewRequestPurchasingFunds';
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateRequestFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            if(response.data===true) {
              $('#mdlRqstPcsgFunds').modal('toggle');//close
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
            var index=_this.listOfAP.findIndex((item)=>item.id==_this.rqstPcsFds.id);
            _this.listOfAP.splice(index,1);
            _this.rqstPcsFds={};
            _this.isACed=false;
            _this.natures=[{id:0,name:'请款性质'},{id:3,name:'验收后付款'},{id:5,name:'预付采购款'},{id:6,name:'按进度付款'},];
            } else {
              $('#mdlRqstPcsgFunds').modal('toggle');//close
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
            }
          }).catch(function (error) {
            console.log(error);
            $('#mdlRqstPcsgFunds').modal('toggle');//close
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
          });        
      },
      getHistory () {
        this.listOfAP=[];
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        } 
        var _this = this;
        this.listOfRequestedFunds=[];
        this.queryContent.conditions="HistoryOfRequestedPurchasingFunds";
        this.queryContent.id_requester=this.currentUserId;
        this.$axios({
          method: 'post',
          url: 'getRequestFunds.php',
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
            _this.listOfRequestedFunds=response.data;
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
      clearList () {
        this.listOfAP=[];
        this.listOfRequestedFunds=[];
      }
    },
    watch:{
      // 'isModify':{
      //   handler() {
      //   }
      // }
    },
    filters:{

    },
    computed:{
      getStatus() {
        return function(dataRow){
          if (!dataRow.result_approved && typeof(dataRow.result_approved)!="undefined" && dataRow.result_approved!=0){
            return '已请款,未审核';
          } else if(dataRow.result_approved==0) {
            return '请款未通过初审';
          } else if(!dataRow.result_approved2 && typeof(dataRow.result_approved2)!="undefined" && dataRow.result_approved2!=0) {
            return '已初审,待复审';
          } else if(dataRow.result_approved2==0) {
            return '请款未通过复审';
          } else {
            if(dataRow.is_paid==0) {
              return '已复审,待付款';
            } else {
              return '已支付完毕';
            }
          }
        } 
      },
      getNature () {
        return function(r) {
          switch(r.nature) {
            case 3:
              return '验收后付款';
              break;
            case 5:
              return '预付采购款';
              break;
            case 6:
              return '按进度付款';
              break;
          } 
        }
      },
      getProject () {
        return function(r) {
          var o=this.projects.find((ele) => ele['id'] == r.id_project);
          return typeof(o)=='undefined'?'':o['name'];
        }
      },
      getWayOfPayment () {
        return function(r) {
          var o=this.waysOfPayment.find((ele) => ele['id'] == r.id_way_pay);
          return typeof(o)=='undefined'?'':o['name'];          
        }
      },      
      getAmountAllowToRequest () {
        return function(r){
          var amount_paid=r.amount_paid?r.amount_paid:0;
          var amount_rqstd_but_not_paid=r.amount_rqstd_but_not_paid?r.amount_rqstd_but_not_paid:0;
          return r.actual_amount-amount_paid-amount_rqstd_but_not_paid;
        }
      },
      getACDate () {
        return function(r){
          if(r.pio_time) {
            return (new Date(r.pio_time)).format('yyyy-MM-dd');
          } else {
            return '尚未验收';
          }
        }
      },
    },
    beforeCreate:function() {
    }    
  } 
</script>

<style scoped>
#searchConditions >*{
  margin:5px;
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
.history {
  position: absolute;
  right: 10px;
}
</style>

