<template>
  <div class="father">
    <h5>当前位置:请款报销/请款复审</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="请款人,用途,采购物品等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="请款的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfRequestFunds">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfRequestFunds.length>0">清除</button>            
        </div>          
      </div>

    </div>
    <div class="" v-if="listOfRequestFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row,index in listOfRequestFunds" @click="clickedARowInShower(row)">
            <td :title="row.id">{{row.id}}</td>
            <td :title="row.project">{{row.project}}</td>
            <td :title="row.amount">{{row.amount}}</td>
            <td :title="row.way_pay">{{row.way_pay}}</td>
            <td :title="row.account">{{row.account}}</td>
            <td :title="row.use_for">{{row.use_for}}</td>
            <td :title="row.id_relative">{{row.id_relative}}</td>
            <td :title="row.remark">{{row.remark}}</td>
            <td title="请款人">{{row.name_applyer}}</td>
            <td title="请款日期">{{(new Date(row.time_applied)).format('yyyy-MM-dd')}}</td>
            <td title="初审人">{{row.name_approver}}</td>
            <td title="初审日期">{{(new Date(row.time_approved)).format('yyyy-MM-dd')}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlFinalAuditRqstingFunds" role="dialog" aria-labelledby="mdlFinalAuditRqstingFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>请款复审---请款ID:{{requestFunds.id}}
              </h5>
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
                  <select id="slctProject" type="text" name="Project" class="form-control" placeholder="所属项目" v-model="requestFunds.id_project" title="所属项目" disabled>
                    <option v-for="item in projects" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputUsage">用途</label>
                  <input id="inputUsage" type="text" class="form-control" v-model="requestFunds.use_for" title="款项用途,不超过64个字" placeholder="款项用途,不超过64个字" disabled>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" name="cashiedAmount" v-model="requestFunds.amount" placeholder="请款金额" title="请款金额" disabled>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="requestFunds.id_way_pay" placeholder="收款方式" title="收款方式" disabled>
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputAccount">账号</label>
                  <input id="slctCashierAccount" type="text" name="cashierAccount" class="form-control" placeholder="接收款项的账号" v-model="requestFunds.account" title="账号名和账号" disabled>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" name="otherInCashier" v-model="requestFunds.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字" disabled>
                </div>
              </div>
              <br>
              <div class="row">
                <label class="radio-inline">
                  <span><input type="radio" v-model="auditResult.resultValue" class="radio-group" value=1>同意</span>
                </label>                    
                <label class="radio-inline">
                  <span><input type="radio" v-model="auditResult.resultValue" class="radio-group" value=0 checked>拒绝</span>
                </label>
              </div>
              <div class="row">
                <input class="form-control" id="reason-input" v-model="auditResult.reasonResult" type="text" placeholder="如果不同意,请说明理由">
              </div>              
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" @click="saveAuditedData" class="btn btn-primary">确认复审</button>
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
        titlesOfList:['ID','项目','金额','支付方式','收款账号','用途','关联','备注','请款人','请款日期','初审人','初审日期'],
        widthOfTH:['4%','9%','8%','6%','17%','11%','7%','12%','6%','7%','6%','7%'],
        listOfRequestFunds:[],
        idOfAppliedPcsg:'',
        currentUserId:this.$store.state.user.id_user,
        requestFunds:{
          account: '',
          amount: '',
          id: '',
          id_applyer: '',
          id_approver: '',
          id_approver2: '',
          id_project: '',
          id_relative: '',
          id_way_pay: '',
          is_paid: '',
          name_applyer: '',
          project: '',
          reason_reject: '',
          reason_reject2: '',
          remark: '',
          result_approved: '',
          result_approved2: '',
          time_applied: '',
          time_approved: '',
          time_approved2: '',
          use_for: '',
          way_pay: ''
        },
        auditResult:{
          id_rqst_funds:'',
          resultValue:0,
          reasonResult:''
        },
        wayOfPayment:[],
        projects:[]

      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfRequestFunds() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfRequestFunds=[];
        this.queryContent.conditions="PassedPrimaryAuditingWithoutFinalAuditing";
        this.$axios({
          method: 'post',
          url: 'getRequestFunds.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfRequestFunds=response.data;
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
        this.requestFunds=dataRow;
        // this.requestFunds.account=dataRow.account;
        // this.requestFunds.amount=dataRow.amount;
        // this.requestFunds.id=dataRow.id;
        // this.requestFunds.id_applyer=dataRow.id_applyer;
        // this.requestFunds.id_approver=dataRow.id_approver;
        // this.requestFunds.id_approver2=dataRow.id_approver2;
        // this.requestFunds.id_project=dataRow.id_project;
        // this.requestFunds.id_relative=dataRow.id_relative;
        // this.requestFunds.id_way_pay=dataRow.id_way_pay;
        // this.requestFunds.is_paid=dataRow.is_paid;
        // this.requestFunds.name_applyer=dataRow.name_applyer;
        // this.requestFunds.project=dataRow.project;
        // this.requestFunds.reason_reject=dataRow.reason_reject;
        // this.requestFunds.reason_reject2=dataRow.reason_reject2;
        // this.requestFunds.remark=dataRow.remark;
        // this.requestFunds.result_approved=dataRow.result_approved;
        // this.requestFunds.result_approved2=dataRow.result_approved2;
        // this.requestFunds.time_applied=dataRow.time_applied;
        // this.requestFunds.time_approved=dataRow.time_approved;
        // this.requestFunds.time_approved2=dataRow.time_approved2;
        // this.requestFunds.use_for=dataRow.use_for;
        // this.requestFunds.way_pay=dataRow.way_pay;
        $('#mdlFinalAuditRqstingFunds').modal('toggle');
      },
      clearList () {
        this.listOfRequestFunds=[];
      },
      saveAuditedData () {
        this.auditResult.id_rqst_funds=this.requestFunds.id;
        if(this.auditResult.resultValue==0 && this.auditResult.reasonResult.length<4) {
          this.$toast({
            text: '如果拒绝,必须写明原因,且不少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;          
        }
        var queryContent=this.auditResult;
        queryContent.id_auditer=this.currentUserId;
        queryContent.conditions='WithFinalAuditedData';

        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateRequestFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data===true) {
              $('#mdlFinalAuditRqstingFunds').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfRequestFunds.length;i++) {
                if(_this.listOfRequestFunds[i]['id']==_this.requestFunds.id) {
                  _this.listOfRequestFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlFinalAuditRqstingFunds').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlFinalAuditRqstingFunds').modal('toggle');
          });         
      }
    },
    watch:{
      'requestFunds.project':{
        handler() {
          for(var i=0;i<this.projects.length;i++) {
            if(this.requestFunds.project==this.projects[i].prjct) {
              this.requestFunds.id_project=this.projects[i].id;
            }
          }
        }
      }
    },
    filters:{

    },
    computed:{

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
#reason-input {
  width: 90%;
  margin:0 auto;
}

</style>

