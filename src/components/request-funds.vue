<template>
  <div class="father">
    <h5>当前位置:请款报销/费用报销、借款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg-8 form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="请款人,用途等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="请款的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfRequestFunds">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfRequestFunds.length>0">清除</button> 
        </div>
        <div class="col-lg-4 form-inline">           
          <button id="byhand-fee" @click="newCreateRequestFunds(1)" class="btn btn-primary" type="button">新报销单</button>
          <button id="byhand-borrow" @click="newCreateRequestFunds(2)" class="btn btn-primary" type="button">新借款单</button>
        </div>          
      </div>

    </div>
    <div class="showerOfRequestFunds" v-if="listOfRequestFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfList" >{{title}}</th>
          <!-- <th><input class="checkbox" type="checkbox" @click=""></th>:width="widthOfTH[index]" -->
        </thead>
        <tbody>
          <tr v-for="row,index in listOfRequestFunds" @click="clickedARowInShower(row)">
            <!-- <td v-for="vlu in row" :title="vlu">{{vlu}}</td> -->
            <td :title="row.id">{{row.id}}</td>
            <td :title="row.id_project">{{row.id_project}}</td>
            <td :title="row.amount">{{row.amount}}</td>
            <td :title="row.id_way_pay">{{row.id_way_pay}}</td>
            <td :title="row.account">{{row.account}}</td>
            <td :title="row.use_for">{{row.use_for}}</td>
            <td :title="row.remark">{{row.remark}}</td>
            <td title="申请日期">{{(new Date(row.time_applied)).format('yyyy-MM-dd')}}</td>
            <td title="请款进度">{{getStatus(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlRequestFunds" role="dialog" aria-labelledby="mdlRequestFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span v-if="idOfRequestFunds===''?false:true">
              <h5>请款单---申请ID:{{idOfRequestFunds}}
              </h5>
            </span>
            <span v-else>
              <h5>请款单---{{natureText}}</h5>
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
                  <select id="slctProject" type="text" name="Project" class="form-control" placeholder="所属项目" v-model="requestFunds.project" title="所属项目" :disabled="requestFunds.result_approved==1">
                    <option v-for="item in projects">{{item.prjct}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputUsage">用途</label>
                  <input id="inputUsage" type="text" class="form-control" v-model="requestFunds.use_for" title="款项用途,不超过64个字" placeholder="款项用途,不超过64个字" :disabled="requestFunds.result_approved==1">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" name="cashiedAmount" v-model="requestFunds.amount" placeholder="请款金额" title="请款金额" :disabled="requestFunds.result_approved==1">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="requestFunds.way" placeholder="收款方式" title="收款方式" :disabled="requestFunds.result_approved==1">
                    <option v-for="item in wayOfPayment">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputAccount">账号</label>
                  <input id="slctCashierAccount" type="text" name="cashierAccount" class="form-control" placeholder="接收款项的账号" v-model="requestFunds.account" title="账号名和账号" :disabled="requestFunds.result_approved==1">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" name="otherInCashier" v-model="requestFunds.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字" :disabled="requestFunds.result_approved==1">
                </div>
              </div>
              <div class="row" v-if="requestFunds.result_approved==0 || requestFunds.result_approved2==0">
                <div class="col-lg form-inline reason-reject">
                  <label>初审意见:</label>
                  <span>{{requestFunds.reason_reject}}</span>
                </div>
                <div class="col-lg form-inline reason-reject">
                  <label>复审意见:</label>
                  <span>{{requestFunds.reason_reject2}}</span>
                </div>
              </div>              
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" id="btnSaveTheRequestedData" @click="saveTheRequestedData" class="btn btn-primary" v-if="requestFunds.result_approved!==1 || requestFunds.result_approved2!==1">提交</button>
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
        titlesOfList:['申请ID','项目ID','金额','支付方式','账号名和账号','用途','备注','请款日期','请款进度'],
        widthOfTH:['5%','11%','8%','6%','8%','10%','7%','12%','6%','7%','5%','11%','4%'],
        listOfRequestFunds:[],
        idOfRequestFunds:'',
        currentUserId:this.$store.state.user.id_user,
        requestFunds:{
          id:'',
          account:'',
          way:'电汇',
          id_way_pay:1,
          amount:0,
          remark:'',
          project:'',
          id_project:'',
          use_for:'',
          reason_reject:'',
          reason_reject2:'',
          result_approved:'',
          result_approved2:'',
          nature:1
        },
        wayOfPayment:[],
        projects:[],
        natureText:'借备用金'

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
        this.queryContent.conditions="NotApprovedOrNotPassedApproving";
        this.queryContent.id_applyer=currentUserId;
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
// console.log(dataRow);
        this.idOfRequestFunds=dataRow.id;
        this.requestFunds.id=dataRow.id;
        this.requestFunds.account=dataRow.account;
        this.requestFunds.id_way_pay=dataRow.id_way_pay;
        this.requestFunds.amount=dataRow.amount;
        this.requestFunds.remark=dataRow.remark;
        this.requestFunds.id_project=dataRow.id_project;
        this.requestFunds.use_for=dataRow.use_for;
        this.requestFunds.reason_reject=dataRow.reason_reject;
        this.requestFunds.result_approved=dataRow.result_approved;
        this.requestFunds.reason_reject2=dataRow.reason_reject2;
        this.requestFunds.result_approved2=dataRow.result_approved2;
       
        for(var i=0;i<this.wayOfPayment.length;i++) {
          if(this.requestFunds.id_way_pay=this.wayOfPayment[i].id) {
            this.requestFunds.way=this.wayOfPayment[i]['name'];
          }
        }
        for(var i=0;i<this.projects.length;i++) {
          if(this.requestFunds.id_project==this.projects[i].id) {
            this.requestFunds.project=this.projects[i].prjct;
          }
        }        
        $('#mdlRequestFunds').modal('toggle');
      },
      saveTheRequestedData() {
        for(var i=0;i<this.wayOfPayment.length;i++) {
          if(this.requestFunds.way===this.wayOfPayment[i]['name']) {
            this.requestFunds.id_way_pay=this.wayOfPayment[i]['id'];
          }
        }
        if(this.requestFunds.project=='') {
          this.$toast({
            text: '请选择项目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }        
        // var queryContent={
        //   id:this.idOfRequestFunds,
        //   id_way_pay:this.requestFunds.id_way_pay,
        //   remark:this.requestFunds.remark,
        //   amount:this.requestFunds.amount,
        //   id_applyer:this.currentUserId,
        //   conditions:'',
        //   id_project:this.requestFunds.id_project
        // };

        var queryContent=this.requestFunds;
        queryContent.id_applyer=this.currentUserId;
        queryContent.conditions='';
        if(this.idOfRequestFunds!=='') {
          var _this = this;
          if(this.requestFunds.amount<0) {
            this.$toast({
              text: '请款金额不对!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          queryContent.conditions='ModifyRequestFunds';
        } else {
          this.listOfRequestFunds=[];
          if(this.requestFunds.use_for.length<4) {
            this.$toast({
              text: '请输入用途!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          if(this.requestFunds.amount<=0) {
            this.$toast({
              text: '请款金额不对!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          if(this.requestFunds.remark.length<4) {
            this.$toast({
              text: '请填写备注信息,不少于4个字',
              type: 'info',
              duration: 2000
            });
            return;
          }
          queryContent.conditions='NewCreateRequestFunds';
        }
// console.log(queryContent);
// return;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateRequestFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data===true) {
              $('#mdlRequestFunds').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfRequestFunds.length;i++) {
                if(_this.listOfRequestFunds[i]['id']==_this.idOfRequestFunds) {
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
              $('#mdlRequestFunds').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlRequestFunds').modal('toggle');
          });        
      },
      clearList () {
        this.listOfRequestFunds=[];
      },
      newCreateRequestFunds(nature) {
        this.requestFunds.nature=nature;
        switch (nature) {
          case 1:
            this.natureText='报销单';
            break;
          case 2:
            this.natureText='借款单';
            break;
        }
        this.clearList();
        this.idOfRequestFunds='';
        this.requestFunds.account='';
        this.requestFunds.way='';
        this.requestFunds.id_way_pay=1;
        this.requestFunds.amount=0;
        this.requestFunds.remark='';
        this.requestFunds.id_project='';
        this.requestFunds.project='';
        this.requestFunds.use_for='';
        this.requestFunds.reason_reject='';
        this.requestFunds.result_approved='newCreate';
        this.requestFunds.reason_reject2='';
        this.requestFunds.result_approved2='newCreate';
        $('#mdlRequestFunds').modal('toggle');
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
    computed: {
      // row.result_approved
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
#byhand-borrow {
  position: absolute;
  right: 0;
}
#byhand-fee {
  position: absolute;
  right: 100px;  
}
.reason-reject {
  color: red;
  font-size: 1.2rem;
} 
</style>

