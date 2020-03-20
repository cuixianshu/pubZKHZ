<template>
<div class="father">
  <h5>当前位置:采购业务/审核请购</h5>
  <div class="container-fluid">
    <div class="form-group form-inline">
      <div class="row">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="项目名称\物品名称\规格型号\厂家品牌等">
          <button @click="getListOfAppliedPurchasing" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfAppliedPurchasing"class="btn btn-secondary" type="button" v-if="listOfAppliedPurchasings.length>0">清空</button>
        </div>        
      </div>

    </div>
    <div class="listShower" v-if="listOfAppliedPurchasings.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfAppliedPurchasings" @click="clickedARecorderToApprove(row)">
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
          <h5>请购审核--请购ID:{{detailsInApplyPurchasing.id}}</h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="slctProject" class="require">所属项目</label>
                <input id="slctProject" type="text" name="project" class="form-control" placeholder="所属项目" v-model="detailsInApplyPurchasing.project" title="选择所属项目" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="nameOfMaterial" class="require">物品名称</label>
                <input id="nameOfMaterial" type="text" name="name" class="form-control" placeholder="物品名称" v-model="detailsInApplyPurchasing.name" title="物品名称" readonly>
              </div>
            </div>
            <div class="row">                
              <div class="col-lg form-inline">
                <label for="inputUnit">计量单位</label>
                <input id="inputUnit" type="text" name="unit" class="form-control" placeholder="计量单位" v-model="detailsInApplyPurchasing.unit" title="计量单位" readonly>
              </div>          
              <div class="col-lg form-inline">
                <label for="inputQuantity" class="require">请购数量</label>
                <input id="inputQuantity" type="number" name="quantity" class="form-control" placeholder="请购数量" v-model="detailsInApplyPurchasing.quantity" title="请购数量,必须大于 0" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputBrand" class="require">厂商品牌</label>
                <input id="inputBrand" type="text" name="brand" class="form-control" placeholder="厂商品牌" v-model="detailsInApplyPurchasing.brand" title="厂商品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel" class="require">规格型号</label>
                <input id="inputModel" type="text" name="model" class="form-control" placeholder="规格型号" v-model="detailsInApplyPurchasing.model" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">    
              <div class="col-lg form-inline">
                <label for="inputDetail" class="require">详细说明</label>
                <input id="inputDetail" type="text" name="detail" class="form-control" placeholder="详细说明" v-model="detailsInApplyPurchasing.detail" title="详细说明" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inptStartPoint" class="require">需要日期</label>
                <input id="inptStartPoint" type="date" name="neededDate" class="form-control" placeholder="需要日期" v-model="detailsInApplyPurchasing.neededDate" title="需要日期" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMem">备注说明</label>
                <input id="inputMem" type="text" name="material_mem" class="form-control" placeholder="备注说明" v-model="detailsInApplyPurchasing.remark" title="其它需要说明的事项" readonly>
              </div>
              <div class="col-lg form-inline">
              </div>
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
          conditions:''
        },
        detailsInApplyPurchasing:{
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
          id_applyedPurchasing:'',
          result:0,
          whyDisagree:'',
          idApprover:1,
          conditions:''//用于通知后台如何操作

        },
        listOfAppliedPurchasings:[],
        titleOfList:[],
        projects:[]
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
        this.approvedResult.id_applyedPurchasing=this.detailsInApplyPurchasing.id;
        this.approvedResult.conditions='Approved';
// console.log(this.approvedResult);

// return;
        var _this=this;
        var url='updateApplyPurchasing.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.approvedResult)
        }).then(function (response) {
// console.log(response.data);
// return;
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                  duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            _this.clearlistOfAppliedPurchasing();
            _this.getListOfAppliedPurchasing();
            _this.detailsInApplyPurchasing={};
            _this.detailsInApplyPurchasing.id='';              
            _this.detailsInApplyPurchasing.project='';
            _this.detailsInApplyPurchasing.name='';
            _this.detailsInApplyPurchasing.unit='';
            _this.detailsInApplyPurchasing.quantity='';
            _this.detailsInApplyPurchasing.brand='';
            _this.detailsInApplyPurchasing.model='';
            _this.detailsInApplyPurchasing.detail='';
            _this.detailsInApplyPurchasing.neededDate='';
            _this.detailsInApplyPurchasing.remark='';
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

        this.detailsInApplyPurchasing.id=dataRow.id;
        this.detailsInApplyPurchasing.id_project=dataRow.id_project;
        this.detailsInApplyPurchasing.name=dataRow.name;
        this.detailsInApplyPurchasing.unit=dataRow.unit;
        this.detailsInApplyPurchasing.quantity=dataRow.quantity;
        this.detailsInApplyPurchasing.brand=dataRow.brand;
        this.detailsInApplyPurchasing.model=dataRow.model;
        this.detailsInApplyPurchasing.detail=dataRow.detail;
        this.detailsInApplyPurchasing.neededDate=dataRow.date_needed;
        this.detailsInApplyPurchasing.is_finished=dataRow.is_finished;
        this.detailsInApplyPurchasing.remark=dataRow.remark;
        this.detailsInApplyPurchasing.id_applier=dataRow.id_applier;
        this.detailsInApplyPurchasing.date_applied=dataRow.date_applied;
        this.detailsInApplyPurchasing.id_approver=dataRow.id_approver;
        this.detailsInApplyPurchasing.date_approved=dataRow.date_approved;
        this.detailsInApplyPurchasing.result_approved=dataRow.result_approved;
        for(var i=0;i<this.projects.length;i++) {
          if(this.detailsInApplyPurchasing.id_project===this.projects[i].id) {
            this.detailsInApplyPurchasing.project=this.projects[i].prjct;
          }
        }
// console.log(this.detailsInApplyPurchasing);
// return;        
        $('#mdfRecorder').modal('toggle');
      },
      getListOfAppliedPurchasing () {
        this.listOfAppliedPurchasings=[];
        this.titleOfList=[];

        this.queryContent.conditions='not approved';
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
            if(response.data.length>0) {
              _this.listOfAppliedPurchasings = response.data;
              var ttl='';
              for(ttl in response.data[0]) {
                _this.titleOfList.push(ttl);
              }              
            } else {
              _this.$toast({
                text: '没有找到需要审核的请购单',
                type: 'info',
                duration: 1000
              });              
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      clearlistOfAppliedPurchasing() {
        this.listOfAppliedPurchasings=[];
        this.titleOfList=[];
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
/*#whydisagree {
  width: 100%;
  margin:5px;
}*/
</style>
