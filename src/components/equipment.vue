<template>
<div class="father">
  <h5>当前位置:基础数据/设备管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="row form-inline query">
      <button @click="getListOfEquipments" class="btn btn-primary">获取数据</button>
      <button @click="clearlistOfEquipments"class="btn btn-secondary" v-if="equipments.length>0">清空</button>
      <button @click="newCreateEquipment" class="btn btn-primary newitem">新建设备</button>
    </div>
    <div class="divfortable" v-if="equipments.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfList">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in equipments" @click="clickedARecorderToModify(row)">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="showerOfEquipments" role="dialog" aria-labelledby="newCreateEquipment" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          设备编辑器--设备ID:{{equipment.id}}
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfEquipment">昵称:</label>
                <input id="inputNameOfEquipment" type="text" class="form-control" v-model="equipment.name" placeholder="设备昵称" title="设备昵称">
              </div>
              <div class="col-lg form-inline">
                <label for="inputAlias">名称:</label>
                <input id="inputAlias" type="text" class="form-control" v-model="equipment.alias" placeholder="设备名称" title="设备名称">
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" class="form-control" v-model="equipment.brand" placeholder="品牌名称" title="品牌名称">
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" class="form-control" v-model="equipment.model" placeholder="设备型号" title="设备型号">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputSerialNum">串码:</label>
                <input id="inputSerialNum" type="text" class="form-control" v-model="equipment.serial_num" placeholder="设备识别串码" title="设备识别串码">
              </div> 
              <div class="col-lg form-inline">
                <label for="inputAvailable">状态:</label>
                <input id="inputAvailable" type="number" class="form-control" v-model="equipment.available" placeholder="可用状态" title="0:不可用;1:可用">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfRspnsrblPrsn">责任:</label>
                <select id="inputNameOfRspnsrblPrsn" type="text" class="form-control" v-model="equipment.id_responsible_person" placeholder="设备责任人" title="设备责任人">
                  <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" class="form-control" v-model="equipment.remark" placeholder="备注信息" title="备注信息">
              </div>              
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputIsOwn">自有:</label>
                <input id="inputIsOwn" type="text" class="form-control" v-model="equipment.is_own" placeholder="1:自有设备;0:非自有设备" title="1:自有设备;0:非自有设备">
              </div> 
              <div class="col-lg form-inline">
              </div>                                        
            </div>            
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" @click="saveInputedData">保存</button> 
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
        queryContent:{
          keyWord:''
        },
        equipments:[],
        titleOfList:[],
        equipment:{
          id:'',
          name:'',
          alias:'',
          brand:'',
          model:'',
          serial_num:'',
          available:1,
          id_responsible_person:1,
          name_responsible_person:'',
          remark:'',
          is_own:1
        },
        employees:this.$store.state.employees,
      }
    },
    methods:{
      getListOfEquipments() {
        // console.log(this.employees);
        var _this = this;
        this.equipments=this.$store.state.myEqpmts;
        this.titleOfList=[];
        for(var ttl in this.equipments[0]) {
          this.titleOfList.push(ttl);
        }              
      },
      clearlistOfEquipments() {
        this.equipments=[];
        this.titleOfList=[];
      },
      newCreateEquipment() {
        this.equipment.id='';
        this.equipment.name='';
        this.equipment.alias='';
        this.equipment.brand='';
        this.equipment.model='';
        this.equipment.serial_num='';
        this.equipment.available=1;
        this.equipment.id_responsible_person=1;
        this.equipment.name_responsible_person='';
        this.equipment.remark='';
        $('#showerOfEquipments').modal('toggle');
      },
      clickedARecorderToModify(dataRow) {
        this.equipment.id=dataRow.id;
        this.equipment.name=dataRow.name;
        this.equipment.alias=dataRow.alias;
        this.equipment.brand=dataRow.brand;
        this.equipment.model=dataRow.model;
        this.equipment.serial_num=dataRow.serial_num;
        this.equipment.available=dataRow.available;
        this.equipment.id_responsible_person=dataRow.id_responsible_person;
        this.equipment.name_responsible_person=dataRow.rspnsbl_prsn;
        this.equipment.remark=dataRow.remark;
        this.equipment.is_own=dataRow.is_own;
        $('#showerOfEquipments').modal('toggle');
      },
      saveInputedData() {
        for(var prop in this.equipment) {
          if(prop!=='is_own' && prop!=='id' && prop!=='id_responsible_person' && prop!=='available' && prop!=='remark' && prop!=='name_responsible_person') {
            if(this.equipment[prop].length<2) {
            this.$toast({
              text: prop+'不能少于2个字',
              type: 'info',
              duration: 2000
            });
            return;              
            }
          }
        }
        if(this.equipment.available!=1 && this.equipment.available!=0) {
          this.$toast({
            text: '可用状态只能为0或1',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        var _this=this;
        var url='';
        if(this.equipment.id!=='') {
          url='updateTblEquipments.php';
        } else {
          url='insertNewToEquipments.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.equipment)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#showerOfEquipments').modal('toggle');
            _this.equipments=[];
            _this.titleOfList=[];              
            _this.equipment.id='';
            _this.equipment.name='';
            _this.equipment.alias='';
            _this.equipment.brand='';
            _this.equipment.model='';
            _this.equipment.serial_num='';
            _this.equipment.available=1;
            _this.equipment.id_responsible_person=1;
            _this.equipment.name_responsible_person='';
            _this.equipment.remark='';
            _this.$store.dispatch('getMyEqpmts',_this);
          } else {
            console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 4000
            });
            $('#showerOfEquipments').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
          $('#showerOfEquipments').modal('toggle');
        });
      }
    },
    beforeCreate:function() {
    }     
  }  
</script>

<style scoped>
#showerOfEquipments input,#showerOfEquipments select {
  width: 70%;
}
.row {
  margin-top: 10px;
}
.query input,.query button {
  margin-right: 5px;
}
.newitem {
  position: absolute;
  right: 20px;
}
</style>