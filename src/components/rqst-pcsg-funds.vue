<template>
  <div class="father">
    <h5>当前位置:收款付款/采购请款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="请款人,用途,采购物品等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="填开发票的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="填开发票的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfRequestFundsForPurchasing">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfRequestPcsgFunds.length>0">清除</button>            
        </div>          
      </div>

    </div>
    <div class="" v-if="listOfRequestPcsgFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
          <!-- <th><input class="checkbox" type="checkbox" @click=""></th> -->
        </thead>
        <tbody>
          <tr v-for="row,index in listOfRequestPcsgFunds" @click="clickedARowInShower(row)">
            <!-- <td v-for="vlu in row" :title="vlu">{{vlu}}</td> -->
            <td :title="row.id">{{row.id}}</td>
            <td :title="row.name">{{row.name}}</td>
            <td :title="row.quantity">{{row.quantity}}</td>
            <td :title="row.unit">{{row.unit}}</td>
            <td :title="row.actual_amount">{{row.actual_amount}}</td>
            <td :title="row.seller">{{row.seller}}</td>
            <td title="请款日期">{{row.date_of_rqst_funds?(new Date(row.date_of_rqst_funds)).format('yyyy-MM-dd'):'未请款'}}</td>
            <td title="请款进度">{{getStatus(row)}}</td>
<!--            <td>{{row.reason_reject}}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlRqstPcsgFunds" role="dialog" aria-labelledby="mdlRqstPcsgFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span v-if="idOfAppliedPcsg===''?false:true">
              <h5>采购请款---请购ID:{{idOfAppliedPcsg}}
              </h5>
            </span>
            <span v-else>
              <h5>采购请款---新建申请</h5>
            </span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctProject">项目</label>
                  <select id="slctProject" type="text" name="Project" class="form-control" placeholder="所属项目" v-model="requestPcsFunds.project" title="所属项目" :disabled="requestPcsFunds.result_approved==1"><!-- disabled -->
                    <option v-for="item in projects">{{item.prjct}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputUsage">用途</label>
                  <input id="inputUsage" type="text" class="form-control" v-model="requestPcsFunds.use_for" title="款项用途,不超过64个字" placeholder="款项用途,不超过64个字" :disabled="requestPcsFunds.result_approved==1">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" name="cashiedAmount" v-model="requestPcsFunds.amount" placeholder="请款金额" title="请款金额" :disabled="requestPcsFunds.result_approved==1">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="requestPcsFunds.way" placeholder="收款方式" title="收款方式" :disabled="requestPcsFunds.result_approved==1">
                    <option v-for="item in wayOfPayment">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputAccount">账号</label>
                  <input id="slctCashierAccount" type="text" name="cashierAccount" class="form-control" placeholder="接收款项的账号" v-model="requestPcsFunds.account" title="账号名和账号" :disabled="requestPcsFunds.result_approved==1">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" name="otherInCashier" v-model="requestPcsFunds.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字" :disabled="requestPcsFunds.result_approved==1">
                </div>
              </div>
              <div class="row" v-if="requestPcsFunds.result_approved==0 || requestPcsFunds.result_approved2==0">
                <div class="col-lg form-inline reason-reject">
                  <label>初审意见:</label>
                  <span>{{requestPcsFunds.reason_reject}}</span>
                </div>
                <div class="col-lg form-inline reason-reject">
                  <label>复审意见:</label>
                  <span>{{requestPcsFunds.reason_reject2}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button v-if="hasNotPassedApproving" type="button" @click="saveTheRequestedData" class="btn btn-primary">重新申请</button>
            <button v-if="hasRqstFundsID"  type="button" id="btnSaveTheRequestedData" @click="saveTheRequestedData" class="btn btn-primary">新建申请</button>
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
        titlesOfList:['请购ID','物品','数量','单位','采购金额','账号名和账号','请款日期','请款进度'],
        widthOfTH:['5%','11%','8%','6%','8%','10%','7%','12%','6%','7%','5%','11%','4%'],
        listOfRequestPcsgFunds:[],
        idOfAppliedPcsg:'',
        currentUserId:this.$store.state.user.id_user,
        requestPcsFunds:{
          id_relative:'',//注意:这是请购id
          account:'',
          way:'电汇',
          id_way_pay:1,
          amount:0,
          remark:'',
          project:'',
          id_project:'',
          use_for:'',
          id_rqst_funds:'',
          reason_reject:'',
          reason_reject2:'',
          result_approved:'',
          result_approved2:'',
          nature:3
        },
        wayOfPayment:[],
        projects:[]

      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfRequestFundsForPurchasing() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfRequestPcsgFunds=[];
        this.queryContent.conditions="PcsgIsFinishedAndEnqryPsdAprvg";
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfRequestPcsgFunds=response.data;
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
        console.log(this.listOfRequestPcsgFunds);
        console.log(dataRow);
        this.idOfAppliedPcsg=dataRow.id;
        this.requestPcsFunds.id_relative=this.idOfAppliedPcsg;//注意:这是请购id
        this.requestPcsFunds.id_project=dataRow.id_project;
        this.requestPcsFunds.use_for=dataRow.name;
        this.requestPcsFunds.amount=dataRow.actual_amount;
        this.requestPcsFunds.account=dataRow.account?dataRow.account:'';
        this.requestPcsFunds.remark=dataRow.remark;
        this.requestPcsFunds.id_way_pay=dataRow.id_way_pay;
        this.requestPcsFunds.id_rqst_funds=dataRow.id_of_rqst_funds;
        this.requestPcsFunds.reason_reject=dataRow.reason_reject;
        this.requestPcsFunds.reason_reject2=dataRow.reason_reject2;
        this.requestPcsFunds.result_approved=dataRow.result_approved;
        this.requestPcsFunds.result_approved2=dataRow.result_approved2;
        for(var i=0;i<this.wayOfPayment.length;i++) {
          if(this.requestPcsFunds.id_way_pay=this.wayOfPayment[i].id) {
            this.requestPcsFunds.way=this.wayOfPayment[i]['name'];
          }
        }
        for(var i=0;i<this.projects.length;i++) {
          if(this.requestPcsFunds.id_project==this.projects[i].id) {
            this.requestPcsFunds.project=this.projects[i].prjct;
          }
        }        
        $('#mdlRqstPcsgFunds').modal('toggle');
// console.log(this.requestPcsFunds);
      },
      saveTheRequestedData() {
        if(this.requestPcsFunds.project=='') {
          this.$toast({
            text: '请选择项目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }        
        if(this.requestPcsFunds.amount<0) {
          this.$toast({
            text: '请款金额不对!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(this.requestPcsFunds.account.length<4) {
          this.$toast({
            text: '请检查账号!',
            type: 'info',
            duration: 2000
          });
          return false;
        }        

        for(var i=0;i<this.wayOfPayment.length;i++) {
          if(this.requestPcsFunds.way===this.wayOfPayment[i]['name']) {
            this.requestPcsFunds.id_way_pay=this.wayOfPayment[i]['id'];
          }
        }

        var queryContent=this.requestPcsFunds;
        queryContent.id_applyer=this.currentUserId;
        if(this.requestPcsFunds.id_rqst_funds) {
          queryContent.conditions='UpdateRequestPurchasingFunds';
        } else {
          queryContent.conditions='NewRequestPurchasingFunds';
        }
console.log(queryContent);
// return;
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateRequestFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data===true) {
              $('#mdlRqstPcsgFunds').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfRequestPcsgFunds.length;i++) {
                if(_this.listOfRequestPcsgFunds[i]['id']==_this.idOfAppliedPcsg) {
                  _this.listOfRequestPcsgFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlRqstPcsgFunds').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlRqstPcsgFunds').modal('toggle');
          });        
      },
      clearList () {
        this.listOfRequestPcsgFunds=[];
      }
    },
    watch:{
      'requestPcsFunds.project':{
        handler() {
          for(var i=0;i<this.projects.length;i++) {
            if(this.requestPcsFunds.project==this.projects[i].prjct) {
              this.requestPcsFunds.id_project=this.projects[i].id;
            }
          }
        }
      }
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
            return '已复审,待付款';
          }
        }

      },
      hasNotPassedApproving () {//有请款单号,并且status是0或null
        // console.log(this.requestPcsFunds);
        if(this.requestPcsFunds.id_rqst_funds && (this.requestPcsFunds.result_approved==0 || !this.requestPcsFunds.result_approved && typeof(this.requestPcsFunds.result_approved)!="undefined" && this.requestPcsFunds.result_approved!=0)) {
          return true;
        }
      },
      hasRqstFundsID () {
        if(!this.requestPcsFunds.id_rqst_funds) {
          return true;
        }
      }
    },
    beforeCreate:function() {
      var _this=this;
      this.wayOfPayment=[];
      this.$axios({
        method: 'post',
        url: 'getListOfPayWay.php',
      }).then(function (response) {
        _this.wayOfPayment=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });

      this.projects=[];
      this.$axios({
        method: 'post',
        url: 'getProject.php'
      }).then(function (response) {
        _this.projects=response.data;
      }).catch(function (error) {
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger!',
          duration: 4000
        });
      });            
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
.reason-reject {
  color: red;
  font-size: 1.2rem;
}
</style>

