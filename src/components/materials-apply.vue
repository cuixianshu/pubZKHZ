<template>
<div class="father">
  <h5>当前位置:物料管理/申请领用</h5><!-- form-group  -->
  <div class="container-fluid">
    <div class="form-inline searchbox">
      <span for="schKeyWds">关键词:</span>
      <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词">
      <button @click="getListOfMaterials" class="btn btn-primary " type="button">
          搜索物料
      </button>
      <button @click="clearlistOfMaterials"class="btn btn-secondary" type="button" v-if="materials.length>0">清空物料明细</button>
      <button @click="getListOfAppliedMaterials" class="btn btn-primary mahistory" type="button">查看申领记录</button>
    </div>
  </div>
  <div v-if="materials.length>0">
    <table class="table table-hover">
      <thead>
        <th v-for="title,index in titleOfMaterials" :width="width[index]">{{title}}</th>
      </thead>
      <tbody>
        <tr v-for="row in materials" @click="clkdToRqst(row)">
          <td :title="row.name">{{row.name}}</td>
          <td :title="row.brand">{{row.brand}}</td>
          <td :title="row.model">{{row.model}}</td>
          <td :title="row.unit">{{row.unit}}</td>
          <td title="包装单位">{{row.min_unit_packing}}</td>
          <td :title="row.availableQtyForApplying">{{row.availableQtyForApplying}}</td>
          <td title="保存位置">{{row.store_place}}</td>
          <td :title="row.remark">{{row.remark}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="listOfAppliedMts.length>0">
    <table class="table table-hover">
      <thead>
        <th v-for="title,index in titleOfAML" :width="widthOfAML[index]">{{title}}
        </th>
      </thead>
      <tbody>
        <tr v-for="row in listOfAppliedMts">
          <td title="所属项目">{{getProjectName(row)}}</td>
          <td :title="row.m_name">{{row.m_name}}</td>
          <td :title="row.m_brand">{{row.m_brand}}</td>
          <td :title="row.m_model">{{row.m_model}}</td>
          <td title="单位">{{row.m_unit}}</td>
          <td title="包装单位">{{row.m_min_unit_packing}}</td>
          <td title="申请数量">{{row.qty}}</td>
          <td title="申请日期">{{row.time_applied}}</td>
          <td title="进度">{{getProgress(row)}}</td>
        </tr>
      </tbody>
    </table>
  </div> 
  <div class="modal fade" id="editerOfMaterial" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <span>物料申领单</span><span id="tip" v-if="rqsting_Material.is_need_return==1">注意:{{rqsting_Material.name}},用后须归还!</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfMAT">名称:</label>
                <input id="inputNameOfMAT" type="text" name="name" class="form-control" v-model="rqsting_Material.name" placeholder="物料名称" title="物料名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputUnit">单位:</label>
                <input id="inputUnit" type="text" name="unit" class="form-control" v-model="rqsting_Material.unit" placeholder="物料计量单位" title="物料计量单位" readonly>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" name="brand" class="form-control" v-model="rqsting_Material.brand" placeholder="厂家品牌" title="厂家品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" name="model" class="form-control" v-model="rqsting_Material.model" placeholder="规格型号" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMin_unit_packing">包装:</label>
                <input id="inputMin_unit_packing" type="text" name="min_unit_packing" class="form-control" v-model="rqsting_Material.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等" title="包装单位" readonly>
              </div> 
              <div class="col-lg form-inline">
                <label for="inputStorePlace">库位:</label>
                <input id="inputStorePlace" type="text" name="store_place" class="form-control" v-model="rqsting_Material.store_place" placeholder="如:A库/B区/C架/6层/1位" title="库名区位架号层号位号" readonly>
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputProject">项目:</label>
                <select id="inputProject" type="text" name="id_project" class="form-control" v-model="rqsting_Material.id_project" placeholder="所属项目" title="所属项目">
                  <option :value="item.id" v-for="item in projects">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="inputUseFor">用途:</label>
                <input id="inputUseFor" type="text" name="use_for" class="form-control" v-model="rqsting_Material.use_for" placeholder="物料用途" title="请输入物料用途,不少于2个字">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputQty">数量:</label>
                <input id="inputQty" type="number" name="qty" class="form-control" v-model="rqsting_Material.qty" placeholder="申请领用数量" title="申请领用数量">
              </div>
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" name="remark" class="form-control" v-model="rqsting_Material.remark" placeholder="申领备注信息" title="申领备注信息">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" type="button" @click="showRemindReturning">提交申请</button> 
        </div>  
      </div>
    </div>
  </div>
  <div class="modal fade" id="remindreturning" role="dialog" aria-labelledby="remindreturning" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>归还提醒</h5>
        </div>
        <div class="modal-body">
          <h5 class="warningForReturn">物品:{{rqsting_Material.name}}</h5><h5 class="warningForReturn">用后须归还!确定要领用吗?</h5>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" type="button" @click="commitApply">确定</button> 
        </div>  
      </div>
    </div>
  </div>   
</div>
</template>


<script>
import qs from 'qs';
  export default {
    data () {
      return {
        currentUserId:this.$store.state.user.id_user,
        queryContent:{
          keyWord:'',
          conditions:''
        },
        materials:[],
        titleOfMaterials:['名称','品牌','型号','单位','包装单位','可申请数','保存位置','物料备注'],
        width:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],

        titleOfAML:['所属项目','名称','品牌','型号','单位','包装单位','申请数量','申请时间','进度'],
        widthOfAML:['9%','12%','12%','12%','9%','12%','8%','14%','12%'],
        listOfAppliedMts:[],
        rqsting_Material:{
          id:'',
          name:'',
          unit:'',
          brand:'',
          model:'',
          min_unit_packing:'',
          store_place:'',
          remark:'',
          id_op:'',
          id_project:1,
          use_for:'',
          qty:0,
        },
        projects:this.$store.state.projects,
      }
    },
    methods:{
      getListOfMaterials() {
        var _this = this;
        this.materials=[];
        this.listOfAppliedMts=[];
        this.queryContent.conditions='availableQtyForApplying';
        this.$axios({
          method: 'post',
          url: 'getMaterials.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.materials=response.data;
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
      clearlistOfMaterials() {
        this.materials=[];
        // this.titleOfMaterials=[];
      },
      clkdToRqst(dataRow) {
        this.rqsting_Material=dataRow;
        this.rqsting_Material.remark='';
        this.materials=[];
        $('#editerOfMaterial').modal('toggle');//打开
      },
      showRemindReturning() {
        if(Number(this.rqsting_Material.qty)<=0 || Number(this.rqsting_Material.qty)>Number(this.rqsting_Material.availableQtyForApplying)) {
          this.$toast({
            text: '数量必须大于0,并且不超过库存数!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        if(this.rqsting_Material.id_project.length<1) {
          this.$toast({
            text: '请选择项目!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        if(this.rqsting_Material.use_for.length<2) {
          this.$toast({
            text: '用途不能少于2个字!',
            type: 'info',
            duration: 1500
          });
          return;
        }        
        $('#editerOfMaterial').modal('toggle');//关闭
        if(this.rqsting_Material.is_need_return==1) {
          $('#remindreturning').modal('toggle');//打开
        } else {
          this.commitApply();
        }
      },
      commitApply() {
        this.queryContent=this.rqsting_Material;
        this.queryContent.conditions='insertMaterialApplying';
        this.queryContent.id_op=this.currentUserId;
        var _this=this;
        var url='insertMaterialsApplying.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
// return;
            if(_this.rqsting_Material.is_need_return==1) {
              $('#remindreturning').modal('toggle');
            }
            _this.materials=[];
            _this.rqsting_Material={};
            _this.queryContent={
              keyWord:'',
              conditions:''
            };
            if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
          } else {
            if(_this.rqsting_Material.is_need_return==1) {
              $('#remindreturning').modal('toggle');
            }
            console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 2000
            });
          } 
        }).catch(function (error) {
          if(_this.rqsting_Material.is_need_return==1) {
            $('#remindreturning').modal('toggle');
          }
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
        });
      },
      getListOfAppliedMaterials() {
        this.materials=[];
        this.listOfAppliedMts=[];
        this.queryContent={
          keyWord:'',
          conditions:'AllOfCurrentUser'
        };
        this.queryContent.id_applyer=this.currentUserId;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAppliedMaterials.php',
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
              _this.listOfAppliedMts=response.data;
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
    },
    computed: {
      getProgress () {
        return function(dataRow) {
          var r=dataRow.rslt_aprvd;
          var m=dataRow.id_mio;
          if (!r && typeof(r)!="undefined" && r!=0){//未审核
            return '申请未审核';
          } else if(r==0) {//审核未过
            return '未通过审核';
          } else if(!m && typeof(m)!="undefined" && m!=0) {//审核通过,未发放
            return '已审核,待发放';
          } else {
            return '已发放';
          }
        }
      },
      getProjectName () {
        return function(dataRow) {
          for(var i=0;i<this.projects.length;i++) {
            if(dataRow.id_project==this.projects[i].id) {
              return this.projects[i].name;
              break;
            }
          }
        }
      }
    },
    beforeCreate:function() {
    }        
  }  
</script>

<style scoped>
.father {
  width: 100%;
}
h5 {
  color: #007bff;
}
#editerOfMaterial input,#editerOfMaterial select {
  width: 70%;
}
.row {
  margin-top: 10px;
}
.searchbox button {
  margin-left: 10px;
}
#tip {
  color:red;
}
.warningForReturn {
  color:#dc3545;
}
.mahistory {
  position: absolute;
  right: 10px;
}
</style>
