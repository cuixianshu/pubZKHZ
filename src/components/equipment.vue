<template>
<div class="father">
  <h5>当前位置:基础数据/设备管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="form-group form-inline searchBar">
      <div class="col-lg">
        <span for="schKeyWds">关键词:</span>
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、品牌、型号等">
        <button @click="getListOfEquipments" class="btn btn-primary" type="button">
          搜索数据
        </button>
        <button @click="clearlistOfEquipments"class="btn btn-secondary" type="button" v-if="equipments.length>0">清空</button>
      </div>
      <div class="col-lg createnewequipment">
        <button @click="newCreateEquipment" class="btn btn-primary" type="button">
          新建设备
        </button>
      </div>
    </div>
    <div class="listShower" v-if="equipments.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList">{{title}}</th>
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
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          设备编辑器--设备ID:{{equipment.id}}
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfEquipment">昵称:</label>
                <input id="inputNameOfEquipment" type="text" name="name" class="form-control" v-model="equipment.name" placeholder="设备昵称" title="设备昵称">
              </div>
              <div class="col-lg form-inline">
                <label for="inputAlias">名称:</label>
                <input id="inputAlias" type="text" name="alias" class="form-control" v-model="equipment.alias" placeholder="设备名称" title="设备名称">
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" name="brand" class="form-control" v-model="equipment.brand" placeholder="品牌名称" title="品牌名称">
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" name="model" class="form-control" v-model="equipment.model" placeholder="设备型号" title="设备型号">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputSerialNum">串码:</label>
                <input id="inputSerialNum" type="text" name="serial_num" class="form-control" v-model="equipment.serial_num" placeholder="设备识别串码" title="设备识别串码">
              </div> 
              <div class="col-lg form-inline">
                <label for="inputAvailable">状态:</label>
                <input id="inputAvailable" type="number" name="available" class="form-control" v-model="equipment.available" placeholder="可用状态" title="0:不可用;1:可用">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfRspnsrblPrsn">责任:</label>
                <select id="inputNameOfRspnsrblPrsn" type="text" name="name_responsible_person" class="form-control" v-model="equipment.id_responsible_person" placeholder="设备责任人" title="设备责任人">
                  <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" name="remark" class="form-control" v-model="equipment.remark" placeholder="备注信息" title="备注信息">
              </div>              
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputIsOwn">自有:</label>
                <input id="inputIsOwn" type="text" name="is_own" class="form-control" v-model="equipment.is_own" placeholder="1:自有设备;0:非自有设备" title="1:自有设备;0:非自有设备">
              </div> 
              <div class="col-lg form-inline">
              </div>                                        
            </div>            
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="saveInputedData">保存</button> 
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
        employees:[]
      }
    },
    methods:{
      getListOfEquipments() {
        var _this = this;
        this.equipments=[];
        this.titleOfList=[];
        this.$axios.get('getEquipments.php')
          .then(function (response) {
            if(response.data.length>0) {
              _this.equipments = response.data;
              var ttl='';
              for(ttl in response.data[0]) {
                _this.titleOfList.push(ttl);
              }              
            } else {
              this.$toast({
                text: '没有符合条件的记录',
                type: 'info',
                duration: 2000
              });              
            }
          })
          .catch(function (error) {
            console.log(error);
          });
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
          if(prop!=='is_own' && prop!=='id' && prop!=='id_responsible_person' && prop!=='available' && prop!=='remark') {
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
  }  
</script>

<style scoped>
.father {
  width: 100%;
}
#showerOfEquipments input,#showerOfEquipments select {
  width: 70%;
}
.createnewequipment {
  text-align: right;
}
.row {
  margin-top: 10px;
}  
</style>