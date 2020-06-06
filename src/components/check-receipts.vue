<template>
  <div class="father">
    <h5>当前位置:收款付款/收款复核</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="发票号、用车人、客户部门、客户单位等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="收款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="收款的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfCashier">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfCashies.length>0">清除</button>            
        </div>          
      </div>
    </div>
    <div class="" v-if="listOfCashies.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="(row,index) in listOfCashies" @click="clickedARowInShower(row)">
            <td title="收款编号">{{row.id}}</td>
            <td title="所属项目">{{row.project}}</td>
            <td title="收款金额">{{row.amount}}</td>
            <td title="收款方式">{{row.way_pay}}</td>
            <td title="收款账户">{{row.account}}</td>
            <td title="备注信息">{{row.other}}</td>
            <td title="收款日期">{{(new Date(row.time_collect)).format("yyyy-MM-dd")}}</td>
            <td title="收款人">{{row.cashier}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="checkReceipts" role="dialog" aria-labelledby="checkReceipts" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>收款复核--收款ID:{{approvedResult.id}}</h5>
            </span>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div id="detailsForCheckingReceipts" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctCashierProject">项目</label>
                  <select id="slctCashierProject" type="text" name="cashierProject" class="form-control" placeholder="所属项目" v-model="approvedResult.id_project" title="所属项目">
                    <option v-for="item in projects" :value="item.id">{{item.prjct}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputDateOfCashier">时间</label>
                  <input id="inputDateOfCashier" type="text" class="form-control" :value="(new Date()).format('yyyy-MM-dd hh:mm:ss')" readonly>
                </div>
              </div>              
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctCashierAccount">账号</label>
                  <select id="slctCashierAccount" type="text" name="cashierAccount" class="form-control" placeholder="收款账号" v-model="approvedResult.id_account" title="收款账号">
                    <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="approvedResult.id_way_pay" placeholder="收款方式" title="收款方式">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" name="cashiedAmount" v-model="approvedResult.amount" placeholder="实际收款金额" title="实际收款金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputOther">备注</label>
                  <input id="inputOther" type="text" class="form-control" name="otherInCashier" v-model="approvedResult.other" title="收款时的备注信息" placeholder="备注信息,不超过64个字">
                </div>
              </div>
              <hr style="margin:10px 0px;height:2px;border:2px;background-color:#007bff;"/>
              <div class="row" >
                <div class="col-lg  form-inline">
                  <label for="inputOther">复核说明:</label>
                  <input id="inputOther" type="text" class="form-control" name="otherInCashier" v-model="approvedResult.describe_confirm" title="复核说明" placeholder="复核说明,不超过64字">
                </div>
              </div>              
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" id="btnSaveTheApprovedData" @click="saveTheApprovedData" class="btn btn-primary">确认复核</button>
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
        titlesOfList:['收款ID','项目','收款金额','收款方式','收款账户','备注信息','收款日期','收款人'],
        widthOfTH:['8%','12%','12%','12%','12%','12%','12%','12%'],
        listOfCashies:[],
        currentUserId:this.$store.state.user.id_user,
        approvedResult:{
        },
        ourAccounts:[],
        wayOfPayment:[],
        projects:[]
      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfCashier() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfCashies=[];
        this.queryContent.conditions="CollectionsWithoutChecking";
        this.$axios({
          method: 'post',
          url: 'getCashiers.php',
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
              _this.listOfCashies=response.data;
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
        this.approvedResult=dataRow;
        this.approvedResult.id_confirmer=this.currentUserId
        $('#checkReceipts').modal('toggle');
      },
      saveTheApprovedData() {
        if(this.approvedResult.result==0) {
          if(this.approvedResult.describe_confirm.length<4) {
            this.$toast({
              text: '改正错误后请填写过程,不少于4个字!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
        }
        var _this = this;
        var queryContent=this.approvedResult;
        queryContent.conditions='WithCheckedData';
        this.$axios({
          method: 'post',
          url: 'updateCashier.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data===true) {
              $('#checkReceipts').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfCashies.length;i++) {
                if(_this.listOfCashies[i]['id']==_this.approvedResult.id) {
                  _this.listOfCashies.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#checkReceipts').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#checkReceipts').modal('toggle');
          });        
      },
      clearList () {
        this.listOfCashies=[];
      }
    },
    computed:{
    },
    watch:{
    },
    beforeCreate:function() {
      var _this=this;
      this.ourAccounts=[];
      this.$axios({
        method: 'post',
        url: 'getListOfOurAccount.php',
      }).then(function (response) {
        _this.ourAccounts=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
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
.radio-group {
  height: 1.2em;
  vertical-align:middle;
  margin-top:-2px;
  margin-bottom:1px;
  color:#007bff;
}
.radio-inline {
  /*display: inline-block;*/
  width: 40%;
  text-align: center;
}

</style>

