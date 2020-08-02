<template>
<div class="father">
  <h5>当前位置:物料管理/查找新建</h5>
  <div class="container-fluid">
    <div class="form-group form-inline">
      <div class="col-lg">
        <span for="schKeyWds">关键词:</span>
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词">
        <button @click="getListOfMaterials" class="btn btn-primary" type="button">
          搜索物料
        </button>
        <button @click="clearlistOfMaterials"class="btn btn-secondary" type="button" v-if="materials.length>0">清空</button>
      </div>
      <div class="col-lg createnewmaterial">
        <button @click="newCreateMaterial" class="btn btn-primary" type="button">
          新建物料
        </button>
      </div>
    </div>
    <div class="listShower" v-if="materials.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList" :width="width">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in materials" @click="clickedARecorderToModify(row)">
            <!-- <td v-for="vlu in row" :title='vlu'>{{vlu}}</td> -->
            <!-- <td title="物料ID">{{row.id}}</td> -->
            <td :title="row.name">{{row.name}}</td>
            <td :title="row.brand">{{row.brand}}</td>
            <td :title="row.model">{{row.model}}</td>
            <td :title="row.unit">{{row.unit}}</td>
            <td title="包装单位">{{row.min_unit_packing}}</td>
            <td :title="row.qty_stocks">{{row.qty_stocks}}</td>
            <td title="保存位置">{{row.store_place}}</td>
            <td title="是否可以领用">{{getActiveStatus(row.is_active)}}</td>
            <td :title="row.remark">{{row.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="editerOfMaterial" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <span>物料编辑器</span><span v-if="!isNew">ID:{{material.id}}</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfMAT">名称:</label>
                <input id="inputNameOfMAT" type="text" name="name" class="form-control" v-model="material.name" placeholder="物料名称" title="物料名称" :readonly="!isNew">
              </div>
              <div class="col-lg form-inline">
                <label for="inputUnit">单位:</label>
                <input id="inputUnit" type="text" name="unit" class="form-control" v-model="material.unit" placeholder="物料计量单位" title="物料计量单位" :readonly="!isNew">
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" name="brand" class="form-control" v-model="material.brand" placeholder="厂家品牌" title="厂家品牌" :readonly="!isNew">
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" name="model" class="form-control" v-model="material.model" placeholder="规格型号" title="规格型号" :readonly="!isNew">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMin_unit_packing">包装:</label>
                <input id="inputMin_unit_packing" type="text" name="min_unit_packing" class="form-control" v-model="material.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等" title="包装单位" :readonly="!isNew">
              </div> 
              <div class="col-lg form-inline">
                <label for="inputStorePlace">库位:</label>
                <input id="inputStorePlace" type="text" name="store_place" class="form-control" v-model="material.store_place" placeholder="如:A库/B区/C架/6层/1位" title="库名区位架号层号位号">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="actv">可领:</label>
                <select id="actv" class="form-control" v-model="material.is_active" title="是否可以领用">
                  <option v-for="item in activeStatus" :value="item.id">{{item.name}}</option>
                </select>
              </div>              
              <div class="col-lg form-inline">
                <label for="actv">归还:</label>
                <select id="actv" class="form-control" v-model="material.is_need_return" title="使用后是否要归还">
                  <option v-for="item in whetherReturns" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" name="remark" class="form-control" v-model="material.remark" placeholder="备注信息" title="备注信息">
              </div>
              <div class="col-lg form-inline">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" type="button" @click="saveInputedData">保存</button> 
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
        isNew:false,
        materials:[],
        titleOfList:['名称','品牌','型号','单位','包装单位','库存数','保存位置','是否可领用','备注'],
        width:['12%','11%','11%','11%','11%','11%','11%','11%','11%'],
        activeStatus:[{id:0,name:'不能领用'},{id:1,name:'可以领用'}],
        whetherReturns:[{id:0,name:'使用后,不需归还'},{id:1,name:'使用后,必须归还'}],
        material:{
          id:'',
          name:'',
          unit:'',
          brand:'',
          model:'',
          min_unit_packing:'',
          store_place:'',
          remark:'',
          id_op:'',
          is_active:1,
          is_need_return:1,
        }
      }
    },
    methods:{
      getListOfMaterials() {
        this.materials=this.$store.state.materials;
      },
      clearlistOfMaterials() {
        this.materials=[];
        // this.titleOfList=[];
      },
      newCreateMaterial() {
        this.materials=[];
        this.material.id='';
        this.material.name='';
        this.material.unit='';
        this.material.brand='';
        this.material.model='';
        this.material.min_unit_packing='';
        this.material.store_place='';
        this.material.remark='';
        this.isNew=true;
        $('#editerOfMaterial').modal('toggle');
      },
      clickedARecorderToModify(dataRow) {
        this.isNew=false;
        this.material=dataRow;
        $('#editerOfMaterial').modal('toggle');
      },
      saveInputedData() {
// console.log(this.material);
// return;
        var dict={
          name:'名称',
          unit:'单位',
          brand:'品牌',
          model:'型号',
          min_unit_packing:'包装',
          store_place:'库位',
          is_active:'可领用状态',
          is_need_return:'归还',
        };
        for(var prop in this.material) {
          if(prop!=='id' && prop!=='id_op' && prop!=='remark' && prop!=='unit') {
            if(this.material[prop] && this.material[prop].length<1) {
            this.$toast({
              text: dict[prop]+'至少1个字',
              type: 'info',
              duration: 2000
            });
            return;              
            }
          } else {
            if(this.material.unit.length<1) {
              this.$toast({
                text: '单位最少需1个字符',
                type: 'info',
                duration: 2000
              });
            }
          }
        }

        var _this=this;
        var url='';
        if(!this.isNew) {
          url='updateMaterials.php';
          this.material.conditions='ModifyTheMaterial';
        } else {
          url='insertMaterials.php';
        }
        this.material.id_op=this.currentUserId;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.material)
        }).then(function (response) {
// console.log(response.data);
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#editerOfMaterial').modal('toggle');
            _this.materials=[];
            _this.material.id='';
            _this.material.name='';
            _this.material.unit='';
            _this.material.brand='';
            _this.material.model='';
            _this.material.min_unit_packing='';
            _this.material.store_place='';
            _this.material.remark='';
            _this.$store.dispatch('getMaterials',_this);
            _this.materials=_this.$store.state.materials;

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
      }
    },
    beforeCreate:function() {

    },
    computed:{
      getActiveStatus() {
        return function (id) {
          var elmt=this.activeStatus.find((ele) => ele['id'] == id);
          return typeof(elmt)=='undefined'?'':elmt['name'];
        }
      }
    },
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
.createnewmaterial {
  text-align: right;
}
.row {
  margin-top: 10px;
}  
</style>