<template>
  <div class="father">
    <h5>当前位置:收款付款/收款复核</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="发票号、用车人、客户部门、客户单位等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="收款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="收款的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getListOfCashier">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfCashies.length>0">清除</button>            
        </div>          
      </div>
    </div>
    <div class="divfortable" v-if="listOfCashies.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="(row,index) in listOfCashies" @click="clickedARowInShower(row)">
            <td title="收款编号">{{row.id}}</td>
            <td title="业务摘要">{{row.abstract}}</td>
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>收款复核--收款ID:{{ckdCashier.id}}</h5>
            </span>
              <button class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div id="detailsForCheckingReceipts" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>类型</label>
                  <select type="text" class="form-control" v-model="ckdCashier.business_type" title="关联业务类型" disabled>
                    <option value=1>销售回款(非机票)</option>
                    <option value=2>上缴款项(非还款)</option>
                    <option value=3>机票款(含退票费)</option>
                    <option value=4>还款(员工欠款)</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label>摘要</label>
                  <input type="text" class="form-control" :value="ckdCashier.abstract" title="ckdCashier.abstract" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>一级</label>
                  <select type="text" class="form-control" v-model="ckdCashier.id_accounting_sub" title="一级会计科目" @change="accSubChanged()">
                    <option  value=0>一级科目</option>
                    <option v-for="item in accountingSubjects" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label>二级</label>
                  <select type="text" class="form-control" v-model="ckdCashier.id_detailed_accounting" title="二级会计科目">
                    <option  value=0>二级科目</option>
                    <option v-for="item in DAsAtTheAccSub" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>账号</label>
                  <select type="text" class="form-control" placeholder="收款账号" v-model="ckdCashier.id_account" title="收款账号">
                    <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label>方式</label>
                  <select type="text" class="form-control" v-model="ckdCashier.id_way_pay" placeholder="收款方式" title="收款方式">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>金额</label>
                  <input type="number" class="form-control" name="cashiedAmount" v-model="ckdCashier.amount" placeholder="实际收款金额" title="实际收款金额">
                </div>
                <div class="col-lg  form-inline">
                  <label>流水</label>
                  <input type="text" class="form-control" name="otherInCashier" v-model="ckdCashier.num_serial" title="金融机构流水号" placeholder="金融机构流水号">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>备注</label>
                  <input type="text" class="form-control" name="otherInCashier" v-model="ckdCashier.other" title="收款时的备注信息" placeholder="备注信息,不超过64个字">
                </div>
                <div class="col-lg  form-inline">
                </div>
              </div>

              <hr style="margin:10px 0px;height:2px;border:2px;background-color:#007bff;"/>
              <div class="row" >
                <div class="col-lg  form-inline">
                  <label>复核说明:</label>
                  <input type="text" class="form-control" name="otherInCashier" v-model="ckdCashier.describe_confirm" title="复核说明" placeholder="复核说明,不超过64字">
                </div>
              </div>              
            </div>
          </div>
          <div class="modal-footer">  
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button id="btnSaveTheApprovedData" @click="saveTheApprovedData" class="btn btn-primary">确认复核</button>
          </div>           
        </div>
      </div>
    </div>    
    <div id="loading" class="loadingbox" v-show="showLoading">
      <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
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
        imgUrl:require('@/assets/images/loading.gif'),
        showLoading:false,
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:''
        },
        titlesOfList:['收款ID','业务摘要','收款金额','收款方式','收款账户','备注信息','收款日期','收款人'],
        widthOfTH:['8%','16%','10%','15%','15%','14%','14%','8%'],
        listOfCashies:[],
        currentUserId:this.$store.state.user.id_user,
        ckdCashier:{
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
      getListOfCashier() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
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
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(response.data);
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
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });
      },
      clickedARowInShower(dataRow) {
        this.ckdCashier=dataRow;
        this.ckdCashier.id_confirmer=this.currentUserId;
        // this.ckdCashier.id_accounting_sub=0;
        if(this.ckdCashier.id_detailed_accounting) {
          var o=this.detailedAccountings.find((ele) => ele['id'] == this.ckdCashier.id_detailed_accounting);
          this.ckdCashier.id_accounting_sub=typeof(o)=='undefined'?0:o['id_parent'];
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_parent==this.ckdCashier.id_accounting_sub);
        } else {
          this.ckdCashier.id_accounting_sub=0;
          this.ckdCashier.id_detailed_accounting=0;
          this.DAsAtTheAccSub=[];
        }
        // console.log(this.detailedAccountings);
        $('#checkReceipts').modal('toggle');
      },
      saveTheApprovedData() {
        if(this.ckdCashier.id_detailed_accounting==0) {
          this.$toast({
            text:'请选择二级科目!',type:'info',duration:2000});
          return false;
        }
        if(this.ckdCashier.id_account==0) {
          this.$toast({
            text:'请选择收款账号!',type:'info',duration:2000});
          return false;
        }
        if(this.ckdCashier.id_way_pay==0) {
          this.$toast({
            text:'请选择收款方式!',type:'info',duration:2000});
          return false;
        }
        if(this.ckdCashier.amount<=0) {
          this.$toast({
            text:'请正确填写金额!',type:'info',duration:2000});
          return false;
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var _this = this;
        var queryContent=this.ckdCashier;
        queryContent.conditions='WithCheckedData';
        this.$axios({
          method: 'post',
          url: 'updateCashier.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(response.data);
          if(response.data===true) {
            $('#checkReceipts').modal('toggle'); 
            _this.$toast({
              text: "操作成功",
              type: 'success',
              duration: 1000
            });
          //更新数据
            var ci=_this.listOfCashies.findIndex((ele) => ele['id'] == _this.ckdCashier.id);
            _this.listOfCashies.splice(ci,1);
          } else {
            console.log(response.data);
            _this.$toast({
              text: '操作失败,请稍后再试!',
              type: 'danger',
              duration: 4000
            });
            $('#checkReceipts').modal('toggle');             
          }
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
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
      },
      accSubChanged() {
        if(this.ckdCashier.id_accounting_sub) {
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_parent==this.ckdCashier.id_accounting_sub);
        } else {
          this.DAsAtTheAccSub=[];
        }
        this.ckdCashier.id_detailed_accounting=0;
        // console.log(this.DAsAtTheAccSub);
      },

    },
    computed:{
    },
    watch:{
    },
    beforeCreate:function() {
    }    
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

