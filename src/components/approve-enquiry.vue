<template>
<div class="father">
  <h5>当前位置:采购业务/审核比价</h5>
  <div class="container-fluid">
    <div class="form-group form-inline">
      <div class="row">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="项目名称\物品名称\规格型号\厂家品牌等">
          <button @click="getListOfAppliedPurchasingWithCommitedEnquiry" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfAppliedPurchasingWithCommitedEnquiry"class="btn btn-secondary" type="button" v-if="listOfAppliedPurchasingWithCommitedEnquiry.length>0">清空</button>
        </div>        
      </div>
    </div>
    <div class="listShower" v-if="listOfAppliedPurchasingWithCommitedEnquiry.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfAppliedList">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfAppliedPurchasingWithCommitedEnquiry" @click="clickedARecorderToApprove(row)">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="mdfRecorder" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>审核比价--请购ID:{{detailsInAppliedPurchasing.id}}</h5>
          <h6>物品:{{detailsInAppliedPurchasing.name}}({{detailsInAppliedPurchasing.unit}})</h6>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <table class="table table-hover">
                <thead>
                  <th v-for="title,index in titleOfEnquiriedList">{{title}}</th>
                </thead>
                <tbody>
                  <tr v-for="row in listOfCommitedEnquiryWithoutApproving" :style="row.is_made_deal?'color:red;font-weight:bold;':''" :title="row.is_made_deal?'已选中此行':'未选中'">
                    <!-- <td v-for="vlu in row" :title='vlu'>{{vlu}}</td> -->
                    <td>{{row.seller}}</td>
                    <td>{{row.price_include_tax}}</td>
                    <td>{{row.actual_amount}}</td>
                    <td>{{row.way_payment}}</td>
                    <td>{{(new Date(row.promise_delivery_date)).format("yyyy-MM-dd")}}</td>
                    <td>{{row.reason_of_deal}}</td>
                  </tr>
                </tbody>
              </table>              
            </div>
            <br>
            <div class="row">
              <label class="radio-inline">
                <span><input type="radio" v-model="approvedResult.result" class="radio-group" value=1>同意</span>
              </label>                    
              <label class="radio-inline">
                <span><input type="radio" v-model="approvedResult.result" class="radio-group"  value=0 checked>拒绝</span>
              </label>
            </div>
            <div>
              <input v-if="showReasonBox" v-model="approvedResult.whyDisagree" type="text" placeholder="如果不同意,请说明理由" class="form-control">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="saveApprovedData">保存</button> 
        </div>  
      </div>
    </div>
  </div>
</div>
</template>
<script>
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
  export default ({
    data() {
      return {
        queryContent:{
          keyWord:'',
          conditions:'',
          id_applyedPurchasing:''
        },
        detailsInAppliedPurchasing:{
          id:'',
          project:'',
          id_project:'',
          name:'',
          unit:'',
          quantity:'',
          brand:'',
          model:'',
          detail:'',
          neededDate:'',
          remark:'',
          id_applier:1
        },
        approvedResult:{
          idApplied:'',
          result:1,
          whyDisagree:'',
          idApprover:1,
          id_selected_enquiry:''
        },
        listOfAppliedPurchasingWithCommitedEnquiry:[],
        titleOfAppliedList:[],
        titleOfAppliedListStatic:['请购ID','项目','物品','包装单位','数量','品牌','规格型号','细节','期望日期','备注','申请人','询价'],
        projects:[],
        listOfCommitedEnquiryWithoutApproving:[],
        titleOfEnquiriedList:['商家','价格','金额','付款节点','到货日期','选定理由']
        // showReasonBox:false
      }
    },
    methods:{
      saveApprovedData() {
        if(this.approvedResult.result==0 && this.approvedResult.whyDisagree.length<2) {
          this.$toast({
             text: '如果不同意,请说明理由,且不少于2个字!',
             type: 'info',
             duration: 1500
          });
          return;        
        }
        if(this.approvedResult.result==1) {
          this.approvedResult.whyDisagree='';
        }
        this.approvedResult.idApplied=this.detailsInAppliedPurchasing.id;
        var _this=this;
// console.log(this.approvedResult);
// return;        



        //需要更新tbl_enquiry_price
        //
        //
        //
        var url='insertApproveEnquiryCompare.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.approvedResult)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            _this.clearlistOfAppliedPurchasingWithCommitedEnquiry();
            _this.getListOfAppliedPurchasingWithCommitedEnquiry();
            _this.detailsInAppliedPurchasing.id='';              
            _this.detailsInAppliedPurchasing.project='';
            _this.detailsInAppliedPurchasing.name='';
            _this.detailsInAppliedPurchasing.unit='';
            _this.detailsInAppliedPurchasing.quantity='';
            _this.detailsInAppliedPurchasing.brand='';
            _this.detailsInAppliedPurchasing.model='';
            _this.detailsInAppliedPurchasing.detail='';
            _this.detailsInAppliedPurchasing.neededDate='';
            _this.detailsInAppliedPurchasing.remark='';
          } else {
        console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
                duration: 4000
            });
            $('#mdfRecorder').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          $('#mdfRecorder').modal('toggle');
        });
      },
      clickedARecorderToApprove (dataRow) {
// console.log(dataRow);
// return;
        // var el=e.toElement.parentElement;
        this.detailsInAppliedPurchasing.id=dataRow.id;
        this.detailsInAppliedPurchasing.name=dataRow.name;
        this.detailsInAppliedPurchasing.unit=dataRow.unit;
        this.listOfCommitedEnquiryWithoutApproving=[];

        // this.approvedResult.idApplied=this.detailsInAppliedPurchasing.id;
        // this.titleOfEnquiriedList=[];
        this.queryContent.conditions='commitedEnquiryWithoutApproving';
        this.queryContent.id_applyedPurchasing=this.detailsInAppliedPurchasing.id;
        
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getEnquiries.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(response.data.length>0) {
            _this.listOfCommitedEnquiryWithoutApproving = response.data;
            for(var i =0;i<_this.listOfCommitedEnquiryWithoutApproving.length;i++) {
              if(_this.listOfCommitedEnquiryWithoutApproving[i].is_made_deal) {
                _this.approvedResult.id_selected_enquiry=_this.listOfCommitedEnquiryWithoutApproving[i].id
              }
            }
          } else {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 1000
            });              
          }
        }).catch(function (error) {
          console.log(error);
        });
        $('#mdfRecorder').modal('toggle');
      },
      getListOfAppliedPurchasingWithCommitedEnquiry () {
        this.listOfAppliedPurchasingWithCommitedEnquiry=[];
        this.titleOfAppliedList=[];
        this.queryContent.conditions='EnquiryCommitedNotApprovedAndComparedPrice';
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
// return;
          if(response.data.length>0) {
            _this.listOfAppliedPurchasingWithCommitedEnquiry = response.data;
            var ttl='';
            for(ttl in response.data[0]) {
              _this.titleOfAppliedList.push(ttl);
            }              
          } else {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 1000
            });              
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      clearlistOfAppliedPurchasingWithCommitedEnquiry() {
        this.listOfAppliedPurchasingWithCommitedEnquiry=[];
        this.titleOfAppliedList=[];
      }
    },
    computed:{
      showReasonBox () {
        return this.approvedResult.result==0?true:false;
      }
    },
    beforeCreate() {
      var _this = this;
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
    },
    watch:{

    }
  })
</script>
<style scopede>
  .row {
    margin:5px 0px;
  }
  .btngroup {
    display: inline-block;
    text-align: right;
  }
  .clearBtn ,.saveBtn {
    margin-right: 10px;
    width: 100px;
  }
  .container-fluid {
    width: 100%;
  }
#mdfRecorder input,#mdfRecorder select {
  width: 80%;
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
  /*display: inline-block;*/
  width: 50%;
  text-align: center;
}
input[type=radio] {
  width: 1.2em!important;
}
</style>
