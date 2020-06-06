<template>
<div class="father">
  <h5>当前位置:采购业务/请购物品</h5>
  <div class="container-fluid">
    <div class="form-group form-inline">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称\规格型号\厂家品牌等">
          <button @click="getListOfAppliedPurchasing" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfAppliedPurchasing"class="btn btn-secondary" type="button" v-if="listOfAppliedPurchasings.length>0">清空</button>
        </div>
        <div class="col-lg">
          <button @click="newCreateApplyPurchasing" class="btn btn-primary" type="button">新建采购申请</button>
        </div>
    </div>
    <div class="listShower" v-if="listOfAppliedPurchasings.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList">{{title}}</th>
        </thead>
<!-- ['请购ID','项目','物品','数量','包装单位','品牌','型号','详情','需要日期','申请人','执行进度'] -->
        <tbody>
          <tr v-for="row in listOfAppliedPurchasings" @click="clickedARecorderToModify(row)">
            <td :title='row.id'>{{row.id}}</td>
            <td title='所属项目'>{{getProcjectName(row.id_project)}}</td>
            <td :title='row.name'>{{row.name}}</td>
            <td :title='row.quantity'>{{row.quantity}}</td>
            <td :title='row.unit'>{{row.unit}}</td>
            <td :title='row.brand'>{{row.brand}}</td>
            <td :title='row.model'>{{row.model}}</td>
            <td :title='row.detail'>{{row.detail}}</td>
            <td :title='row.date_needed'>{{row.date_needed}}</td>
            <td title='申请人'>{{getApplyerName(row.id_applier)}}</td>
            <td title='当前进度'>{{getStateOfApplyingPurchasing(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="mdfRecorder" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>采购申请单<span v-show="applyPurchasingList.id==''?false:true">--ID:{{applyPurchasingList.id}}</span></h5>
        </div>
        <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="slctProject" class="require">所属项目</label>
                  <select id="slctProject" type="text" name="project" class="form-control" placeholder="所属项目" v-model="applyPurchasingList.id_project" title="选择所属项目" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                    <option v-for="item in projects" :value="item.id">{{item.prjct}}</option>
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="nameOfMaterial" class="require">物品名称</label>
                  <input id="nameOfMaterial" type="text" name="name" class="form-control" placeholder="物品名称" v-model="applyPurchasingList.name" title="物品名称" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
              </div>
              <div class="row">                
                <div class="col-lg form-inline">
                  <label for="inputUnit">计量单位</label>
                  <input id="inputUnit" type="text" name="unit" class="form-control" placeholder="计量单位" v-model="applyPurchasingList.unit" title="计量单位" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>          
                <div class="col-lg form-inline">
                  <label for="inputQuantity" class="require">请购数量</label>
                  <input id="inputQuantity" type="number" name="quantity" class="form-control" placeholder="请购数量" v-model="applyPurchasingList.quantity" title="请购数量,必须大于 0" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputBrand" class="require">厂商品牌</label>
                  <input id="inputBrand" type="text" name="brand" class="form-control" placeholder="厂商品牌" v-model="applyPurchasingList.brand" title="厂商品牌" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputModel" class="require">规格型号</label>
                  <input id="inputModel" type="text" name="model" class="form-control" placeholder="规格型号" v-model="applyPurchasingList.model" title="规格型号" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
              </div>
              <div class="row">    
                <div class="col-lg form-inline">
                  <label for="inputDetail" class="require">用途说明</label>
                  <input id="inputDetail" type="text" name="detail" class="form-control" placeholder="用途说明" v-model="applyPurchasingList.detail" title="用途说明" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
                <div class="col-lg form-inline">
                  <label for="inptStartPoint" class="require">需要日期</label>
                  <input id="inptStartPoint" type="date" name="date_needed" class="form-control" placeholder="需要日期" v-model="applyPurchasingList.date_needed" title="需要日期" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputMem">备注说明</label>
                  <input id="inputMem" type="text" name="material_mem" class="form-control" placeholder="备注说明" v-model="applyPurchasingList.remark" title="其它需要说明的事项" :readonly="applyingIsPassedApproving(applyPurchasingList.id)">
                </div>
                <div class="col-lg form-inline">
                </div>
              </div>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="saveApplyPurchasing" v-if="!applyingIsPassedApproving(applyPurchasingList.id)">保存</button> 
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
        applyPurchasingList:{
          id:'',
          project:'',
          id_project:'',
          name:'',
          unit:'',
          quantity:'',
          brand:'',
          model:'',
          detail:'',
          date_needed:'',
          remark:'',
          id_applier:this.$store.state.user.id_user,
          conditions:''//用于标识后台如何操作
        },
        listOfAppliedPurchasings:[],
        titleOfList:['请购ID','项目','物品','数量','包装单位','品牌','型号','详情','需要日期','申请人','执行进度'],
        projects:[],
        employees:[]
      }
    },
    methods:{
      saveApplyPurchasing() {
        if(!this.applyPurchasingList.id_project) {
          this.$toast({
            text: '请选择所属项目',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.applyPurchasingList.name.length<2) {
          this.$toast({
            text: '物品名称不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.applyPurchasingList.unit.length<1) {
          this.$toast({
            text: '计量单位不能为空',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.applyPurchasingList.quantity<=0) {
          this.$toast({
            text: '这个数量不用申请',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.applyPurchasingList.brand.length<2) {
          this.$toast({
            text: '厂商品牌不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.applyPurchasingList.model.length<2) {
          this.$toast({
            text: '规格型号不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.applyPurchasingList.detail.length<4) {
          this.$toast({
            text: '用途说明不能少于4个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if((this.applyPurchasingList.date_needed < (new Date().format("yyyy-MM-dd"))) || this.applyPurchasingList.date_needed.length<8) {
          this.$toast({
            text: '需要日期不能早于今天',
            type: 'info',
            duration: 1000
          });
          return;
        }
        var _this=this;
        var url='';
        if(this.applyPurchasingList.id!=='') {
          url='updateApplyPurchasing.php';
          this.applyPurchasingList.conditions='Modified'
        } else {
          this.applyPurchasingList.conditions='InsertNew'
          url='insertNewToApplyPurchasing.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.applyPurchasingList)
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
            _this.applyPurchasingList.id='';              
            _this.applyPurchasingList.project='';
            _this.applyPurchasingList.name='';
            _this.applyPurchasingList.unit='';
            _this.applyPurchasingList.quantity='';
            _this.applyPurchasingList.brand='';
            _this.applyPurchasingList.model='';
            _this.applyPurchasingList.detail='';
            _this.applyPurchasingList.date_needed='';
            _this.applyPurchasingList.remark='';
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
      clickedARecorderToModify (dataRow) {
        this.applyPurchasingList=dataRow;
        $('#mdfRecorder').modal('toggle');
      },
      getListOfAppliedPurchasing () {
        this.listOfAppliedPurchasings=[];
        // this.titleOfList=[];
        var _this = this;
        this.queryContent.conditions='isNotFinishedWithState';

        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
            if(response.data.length>0) {
              _this.listOfAppliedPurchasings = response.data;
            } else {
              _this.$toast({
                text: '没有符合条件的记录',
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
      },
      newCreateApplyPurchasing () {
        this.listOfAppliedPurchasings=[];
        // this.titleOfList=[];              
        this.applyPurchasingList.id='';
        this.applyPurchasingList.project='';
        this.applyPurchasingList.name='';
        this.applyPurchasingList.unit='';
        this.applyPurchasingList.quantity='';
        this.applyPurchasingList.brand='';
        this.applyPurchasingList.model='';
        this.applyPurchasingList.detail='';
        this.applyPurchasingList.date_needed='';
        this.applyPurchasingList.remark='';
        $('#mdfRecorder').modal('toggle');
      }

    },
    computed: {
      getProcjectName () {
        return function(projectID) {
          for(var i=0;i<this.projects.length;i++) {
            if(projectID==this.projects[i].id) {
              return this.projects[i].name;
            }
          }
        }
      },
      getApplyerName () {
        return function(applyedID) {
          for(var i=0;i<this.employees.length;i++) {
            if(applyedID==this.employees[i].id) {
              return this.employees[i].name;
            }
          }
        }
      },
      getStateOfApplyingPurchasing() {
        return function(dataRow) {
          if(dataRow.count_enquiries==0) {//未询价
            if(!dataRow.result_approved && typeof(dataRow.result_approved)!="undefined" && dataRow.result_approved!=0) {//请购未审核
              return '请购单待审核';
            } else if(dataRow.result_approved==0) {//未通过请购审核
              return '请购审核未通过';
            } else {//已通过请购审核
              return '请购审核已通过';
            }
          } else {//已询价
            if(!dataRow.state_of_enquiries && typeof(dataRow.state_of_enquiries)!="undefined" && dataRow.state_of_enquiries!=0) {//未提交审核null
              return '询价比价中..';
            } else if(dataRow.state_of_enquiries==0 || dataRow.state_of_enquiries==1) {//已提交,未审核
              return '正审核比价..';
            } else {
              return '正在采购中..';
            }
          }        
        }
      },

//id对应的请购单的result_approved如果不是null,说明已通过了请购审核,所以要只读
      applyingIsPassedApproving() {
        return function(id) {
          for(var i=0;i<this.listOfAppliedPurchasings.length;i++) {
            if(id==this.listOfAppliedPurchasings[i].id) {
              if(!(!this.listOfAppliedPurchasings[i].result_approved && typeof(this.listOfAppliedPurchasings[i].result_approved)!="undefined" && this.listOfAppliedPurchasings[i].result_approved!=0)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
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
      
      //初始化员工option
      this.employees=[];
      var _this = this;
      this.$axios({
        method: 'post',
        url: 'getEmployees.php'
      }).then(function (response) {
        _this.employees=response.data;
      }).catch(function (error) {
        console.log(error);
      });
    }
  })
</script>
<style scopede>
  .row {
    margin:5px 0px;
  }
  h5 {
    color: #007bff;
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
</style>
