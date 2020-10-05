<template>
<div class="father">
  <h5>当前位置:物料管理/发放物料</h5>
  <div class="container-fluid">
    <div class="form-inline searchbox">
<!--       <div class="col-lg">
        <span for="schKeyWds">关键词:</span>
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词">
        <button @click="getListOfMaterials" class="btn btn-primary ">
          搜索物料
        </button>
        <button @click="clearlistOfMaterials"class="btn btn-secondary" v-if="materials.length>0">清空物料明细</button>
      </div> -->
      <!-- <div class="col-lg appliedBtn"> -->
        <button @click="getListOfAppliedMaterials" class="btn btn-primary ">
          获取领用清单
        </button>
        <button @click="listOfAppliedMts=[]"class="btn btn-secondary" v-if="listOfAppliedMts.length>0">清空领用清单</button>
      <!-- </div> -->
    </div>
    <div v-if="listOfAppliedMts.length>0" class="divfortable">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfAppliedMaterialsList" :width="widthA[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfAppliedMts" @click="clickedARecorderToModify(row)">
            <td :title="row.mtname">{{row.mtname}}</td>
            <td :title="row.brand">{{row.brand}}</td>
            <td :title="row.model">{{row.model}}</td>
            <td title="单位">{{row.unit}}</td>
            <td title="包装单位">{{row.min_unit_packing}}</td>
            <td title="申请数量">{{row.qty}}</td>
            <td title="申请日期">{{row.time_applied}}</td>
            <td title="申请人">{{getApplyer(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div> 
  </div>
  <div class="modal fade" id="editerOfMaterial" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span>物料发放单</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfMAT">名称:</label>
                <input id="inputNameOfMAT" type="text" class="form-control" v-model="rqstdMaterial.mtname" placeholder="物料名称" title="物料名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputUnit">单位:</label>
                <input id="inputUnit" type="text" class="form-control" v-model="rqstdMaterial.unit" placeholder="物料计量单位" title="物料计量单位" readonly>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" class="form-control" v-model="rqstdMaterial.brand" placeholder="厂家品牌" title="厂家品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" class="form-control" v-model="rqstdMaterial.model" placeholder="规格型号" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMin_unit_packing">包装:</label>
                <input id="inputMin_unit_packing" type="text" class="form-control" v-model="rqstdMaterial.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等" title="包装单位" readonly>
              </div> 
              <div class="col-lg form-inline">
                <label for="inputStorePlace">库位:</label>
                <input id="inputStorePlace" type="text" class="form-control" v-model="rqstdMaterial.store_place" placeholder="如:A库/B区/C架/6层/1位" title="库名区位架号层号位号" readonly>
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputQty">申请:</label>
                <input id="inputQty" type="number" class="form-control" v-model="rqstdMaterial.qty" placeholder="申请领用数量" title="申请领用数量" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputRemark">发放:</label>
                <input id="inputRemark" type="number" class="form-control" v-model="distributer.qty" placeholder="实发数量" title="实际发放数量">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveDistributedData">确认发放</button> 
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
        titleOfAppliedMaterialsList:['名称','品牌','型号','单位','包装单位','申请数量','申请时间','申请人'],
        widthA:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],
        // qty:0,
        listOfAppliedMts:[],
        rqstdMaterial:{
          id:'',
          name:'',
          unit:'',
          brand:'',
          model:'',
          min_unit_packing:'',
          store_place:'',
          remark:'',
          id_op:'',
          qty:0
        },
        employees:this.$store.state.employees,
        distributer:{
          qty:0,
          id_material:'',
          id_op:'',
          id_applyForm:''
        }
      }
    },
    methods:{
      clickedARecorderToModify(dataRow) {
// console.log(dataRow);
        this.rqstdMaterial=dataRow;
        this.distributer.id_material=dataRow.id_material;
        this.distributer.id_op=this.currentUserId;
        this.distributer.id_applyForm=dataRow.id;
        $('#editerOfMaterial').modal('toggle');
      },
      saveDistributedData() {
// console.log(this.distributer);
// return;
        if(Number(this.distributer.qty)<=0 || Number(this.distributer.qty)>Number(this.rqstdMaterial.qty)) {
          this.$toast({
            text: '数量必须大于0,并且不超过申请数量!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        this.queryContent=this.distributer;
        this.queryContent.conditions='WithDistributedData';
        //需要更新tbl_materials_in_outbound,tbl_apply_materials,tbl_materials三个表
// console.log(this.listOfAppliedMts);
// return;
        var _this=this;
        var url='insertMaterialsInOutbound.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
           if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            _this.listOfAppliedMts.forEach(function(item, index, arr) {
              if(item.id == _this.distributer.id_applyForm) {
                arr.splice(index, 1);
              }
            });
            _this.rqstdMaterial={};
            _this.queryContent={
              keyWord:'',
              conditions:''
            };
            _this.distributer={
              qty:0,
              id_material:'',
              id_op:'',
              id_applyForm:''
            };
            $('#editerOfMaterial').modal('toggle');
          } else {
            console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 2000
            });
            $('#editerOfMaterial').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
          $('#editerOfMaterial').modal('toggle');
        });
      },
      getListOfAppliedMaterials() {
        this.listOfAppliedMts=[];
        this.queryContent={
          keyWord:'',
          conditions:'PassedApproving'
        };
        this.queryContent.id_applyer=this.currentUserId;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAppliedMaterials.php',
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
      }
    },
    computed: {
      getApplyer () {
        return function(dataRow) {
          for(var i=0;i<this.employees.length;i++) {
            if(dataRow.id_applyer==this.employees[i]['id']) {
              return this.employees[i]['name'];
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
#editerOfMaterial input,#editerOfMaterial select {
  width: 70%;
}
.row {
  margin-top: 10px;
}
.searchbox button {
  margin-left: 10px;
}
</style>


