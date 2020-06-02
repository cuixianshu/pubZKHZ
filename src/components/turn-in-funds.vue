<template>
  <div class="father">
    <h5>当前位置:个人中心/缴款还款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="发票号、用车人、客户部门、客户单位等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="填开发票的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="填开发票的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfTurnInFunds">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfTurnInFunds.length>0">清除</button>            
          <button id="byhand" @click="newTurnInFunds" class="btn btn-primary" type="button">新建缴款</button>
        </div>          
      </div>

    </div>
    <div class="showerOfTurnedInFunds" v-if="listOfTurnInFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
          <!-- <th><input class="checkbox" type="checkbox" @click=""></th> -->
        </thead>
        <tbody>
          <tr v-for="row,index in listOfTurnInFunds" @click="clickedARowInShower(row)">
            <td v-for="vlu in row" :title="vlu">{{vlu}}</td>
            <!-- <td><input class="checkbox" type="checkbox"  name="selecter" @click=""></td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlTurnInFunds" role="dialog" aria-labelledby="mdlTurnInFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span v-if="turnInFundsNotice.id===''?false:true">
              <h5>缴款还款---缴款ID:{{turnInFundsNotice.id}},缴款金额:￥{{turnInFundsNotice.amount}}
              </h5>
            </span>
            <span v-else>
              <h5>缴款还款---新建缴款</h5>
            </span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div id="detailsForCashier" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctProject">项目</label>
                  <select id="slctProject" type="text" class="form-control" placeholder="所属项目" v-model="turnInFundsNotice.id_project" title="所属项目">
                    <option v-for="item in projects" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputCause">事由</label>
                  <input id="inputCause" type="text" class="form-control" v-model="turnInFundsNotice.cause" placeholder="缴款事由" title="缴款事由">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputAmount">金额</label>
                  <input id="inputAmount" type="number" class="form-control" v-model="turnInFundsNotice.amount" placeholder="实际缴款金额" title="实际缴款金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="turnInFundsNotice.id_way_pay" placeholder="收款方式" title="收款方式">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" v-model="turnInFundsNotice.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
                <div class="col-lg  form-inline">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" v-if="turnInFundsNotice.id_tbl_cashier?false:true" @click="saveTheTurnedInFundsData" class="btn btn-primary">保存</button>
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
        titlesOfList:[],
        widthOfTH:['5%','11%','8%','6%','8%','10%','7%','12%','6%','7%','5%','11%','4%'],
        listOfTurnInFunds:[],
        currentUserId:this.$store.state.user.id_user,
        turnInFundsNotice:{
          id:'',
          cause:'',
          id_project:3,
          id_way_pay:1,
          amount:0,
          remark:'',
          way:'电汇',
          id_project:'',
          id_tbl_cashier:''
          
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
      getListOfTurnInFunds() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }       
        var _this = this;
        this.listOfTurnInFunds=[];
        this.titlesOfList=[];
        this.queryContent.conditions="All";
        this.$axios({
          method: 'post',
          url: 'getTurnInFunds.php',
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
              _this.listOfTurnInFunds=response.data;
              for(var title in response.data[0]) {
                _this.titlesOfList.push(title);
              }             
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
        this.turnInFundsNotice=dataRow;

       
        $('#mdlTurnInFunds').modal('toggle');
      },
      saveTheTurnedInFundsData() {

        if(this.turnInFundsNotice.project=='') {
          this.$toast({
            text: '请选择项目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.turnInFundsNotice.cause.length<4) {
          this.$toast({
            text: '事由不少于4个字!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }

        var queryContent=this.turnInFundsNotice;
        queryContent.currentUserId=this.currentUserId;

        if(this.turnInFundsNotice.id!=='') {
          var _this = this;
          if(this.turnInFundsNotice.amount<=0) {
            this.$toast({
              text: '请检查金额!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          queryContent.conditions='Update';
        } else {
          this.listOfTurnInFunds=[];
          this.titlesOfList=[];
          if(this.turnInFundsNotice.amount<=0) {
            this.$toast({
              text: '请检查金额!',
              type: 'info',
              duration: 2000
            });
            return false;
          }

          queryContent.conditions='InsertNew';
        }
// console.log(queryContent);
// return;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateTurnInFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
// console.log(response.data);
// return;
            if(response.data===true) {
              $('#mdlTurnInFunds').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfTurnInFunds.length;i++) {
                if(_this.listOfTurnInFunds[i]['id']==_this.turnInFundsNotice.id) {
                  _this.listOfTurnInFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlTurnInFunds').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlTurnInFunds').modal('toggle');
          });        
      },
      clearList () {
        this.listOfTurnInFunds=[];
        this.titlesOfList=[];
      },
      newTurnInFunds() {
        this.turnInFundsNotice.id='';
        $('#mdlTurnInFunds').modal('toggle');
        this.turnInFundsNotice.id_project=1;
        this.turnInFundsNotice.id_way_pay=1;
        this.turnInFundsNotice.amount=0;
        this.turnInFundsNotice.remark='';
        this.turnInFundsNotice.cause='';        
      }
    },
    watch:{
      // 'turnInFundsNotice.project':{
      //   handler() {
      //     for(var i=0;i<this.projects.length;i++) {
      //       if(this.turnInFundsNotice.project==this.projects[i].prjct) {
      //         this.turnInFundsNotice.id_project=this.projects[i].id;
      //       }
      //     }
      //   }
      // }
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
</style>

