<template>
<div class="father">
  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#newArrived">验收新到(非采购)物料</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#purchased">验收采购物料(含工程)</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#giveBack">验收员工归还物料</a>
    </li>
  </ul>
  <div class="tab-content">
    <div id="newArrived" class="container-fluid tab-pane active">
      <div class="form-inline searchbox">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词">
        <button @click="getListOfMaterials" class="btn btn-primary">
          搜索物料
        </button>
        <button @click="materials=[];"class="btn btn-secondary" v-if="materials.length>0">清空结果</button>
      </div>
      <div v-if="materials.length>0" class="divfortable">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in titleOfList" :width="width">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in materials" @click="clickedARecorderToModify(row)">
              <td :title="row.name">{{row.name}}</td>
              <td :title="row.brand">{{row.brand}}</td>
              <td :title="row.model">{{row.model}}</td>
              <td :title="row.unit">{{row.unit}}</td>
              <td title="包装单位">{{row.min_unit_packing}}</td>
              <td :title="row.qty_stocks">{{row.qty_stocks}}</td>
              <td title="保存位置">{{row.store_place}}</td>
              <td :title="row.remark">{{row.remark}}</td>
            </tr>
          </tbody>
        </table>
      </div>      
    </div>
    <div id="purchased" class="container-fluid tab-pane">
      <div class="form-inline searchbox">
        <datepicker class="datepicker" id="dateRange" v-model="pcsQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请购时间,默认上个月" :shortcuts="shortcuts" placeholder="请购的时间范围">
        </datepicker>
        <input type="text" class="form-control" v-model="pcsQC.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,规格型号等关键词">
        <button @click="getListOfPcsings" class="btn btn-primary ">
          搜索采购单
        </button>
        <button @click="purchasings=[];"class="btn btn-secondary" v-if="purchasings.length>0">清空结果</button>
      </div>
      <div v-if="purchasings.length>0" class="divfortable">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in pcsnsTitle" :width="pcsnsWidth">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in purchasings" @click="clickedAPcsnsForAC(row)">
              <td :title="getProject(row)">{{getProject(row)}}</td>
              <td :title="row.name">{{row.name}}</td>
              <td :title="row.brand">{{row.brand}}</td>
              <td :title="row.model">{{row.model}}</td>
              <td :title="row.detail">{{row.detail}}</td>
              <td :title="row.quantity">{{row.quantity}}</td>
              <td :title="row.unit">{{row.unit}}</td>
              <td :title="row.e_seller">{{row.e_seller}}</td>
              <td :title="row.e_amount">{{row.e_amount}}</td>
              <td :title="row.date_applied">{{row.date_applied}}</td>
              <td :title="getPurchaser(row)">{{getPurchaser(row)}}</td>
              <td title="请购时的备注信息">{{row.remark}}</td>
            </tr>
          </tbody>
        </table>
      </div>      
    </div>
    <div id="giveBack" class="container-fluid tab-pane">
      <div class="form-inline searchbox">
        <datepicker class="datepicker" id="dateRange" v-model="unreturnedMQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="领用时间,默认上个月" :shortcuts="shortcuts" placeholder="领用的时间范围">
        </datepicker>
        <input class="form-control" v-model="unreturnedMQC.keyWord" title="物品物料名称,品牌,规格型号,用途等" placeholder="查询关键词" style="width:110px; background: #CEFFCE;">
        <select class="form-control" v-model="unreturnedMQC.id_project" title="选择所属项目">
          <option value="0">所有项目</option>
          <option v-for="item in projects" :value="item.id">{{item.name}}</option>
        </select>
        <select class="form-control" v-model="unreturnedMQC.id_applyer" title="选择领用人">
          <option value="0">所有领用人</option>
          <option v-for="item in employees" :value="item.id">{{item.name}}</option>
        </select>
        <button id="btnSearch" class="btn btn-primary" @click="getUnreturnedMData">搜索数据</button>
        <button class="btn btn-secondary" @click="unreturnedMs=[];" v-if="unreturnedMs.length>0">清空结果</button>        
      </div>
      <div v-if="unreturnedMs.length>0" class="divfortable">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in unreturnedTitle" :width="unreturnedWidth">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in unreturnedMs" @click="slctOnetoReturn(row)">
              <td :title="row.id_applyer">{{getApplyer(row)}}</td>
              <td :title="row.m_name">{{row.m_name}}</td>
              <td :title="row.m_brand">{{row.m_brand}}</td>
              <td :title="row.m_model">{{row.m_model}}</td>
              <td :title="row.m_unit">{{row.m_unit}}</td>
              <td title="包装容量">{{row.m_min_unit_packing}}</td>
              <td :title="row.qty_distributed">{{row.qty_distributed}}</td>
              <td :title="row.qty_returned">{{row.qty_returned}}</td>
              <td title="领用用途">{{row.use_for}}</td>
              <td :title="row.remark">{{row.remark}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>    
  </div>
  <div class="modal fade" id="editerForNewArrived" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span>物料验收单</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfMAT">名称:</label>
                <input id="inputNameOfMAT" type="text" class="form-control" v-model="material.name" placeholder="物料名称" title="物料名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputUnit">单位:</label>
                <input id="inputUnit" type="text" class="form-control" v-model="material.unit" placeholder="物料计量单位" title="物料计量单位" readonly>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" class="form-control" v-model="material.brand" placeholder="厂家品牌" title="厂家品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" class="form-control" v-model="material.model" placeholder="规格型号" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMin_unit_packing">包装:</label>
                <input id="inputMin_unit_packing" type="text" class="form-control" v-model="material.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等" title="包装单位" readonly>
              </div> 
              <div class="col-lg form-inline">
                <label for="inputStorePlace">库位:</label>
                <input id="inputStorePlace" type="text" class="form-control" v-model="material.store_place" placeholder="如:A库/B区/C架/6层/1位" title="库名区位架号层号位号" readonly>
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputQty">数量:</label>
                <input id="inputQty" type="number" class="form-control" v-model="qty" placeholder="收货数量" title="收货数量">
              </div>
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" class="form-control" v-model="material.remark" placeholder="备注信息" title="备注信息">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveNewArrivedData">验收无误</button> 
        </div>  
      </div>
    </div>
  </div>
  <div class="modal fade" id="editerForReturning" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span>返还物料验收单</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="aplr">原领用人:</label>
                <select id="aplr" type="text" class="form-control" v-model="rtMtrl.id_applyer" title="原领用人" disabled>
                  <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="mioTime">需归还数:</label>
                <input id="mioTime" type="text" class="form-control" v-model="rtMtrl.mio_qty" title="还需归还的数量" readonly>
              </div> 
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="NmOfMAT">物料名称:</label>
                <input id="NmOfMAT" type="text" class="form-control" v-model="rtMtrl.m_name" title="物料名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="Unit">计量单位:</label>
                <input id="Unit" type="text" class="form-control" v-model="rtMtrl.m_unit" title="物料计量单位" readonly>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="Brd">物料品牌:</label>
                <input id="Brd" type="text" class="form-control" v-model="rtMtrl.m_brand" title="厂家品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="Mdl">规格型号:</label>
                <input id="Mdl" type="text" class="form-control" v-model="rtMtrl.m_model" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="MUP">包装单位:</label>
                <input id="MUP" type="text" class="form-control" v-model="rtMtrl.m_min_unit_packing" title="包装单位" readonly>
              </div> 
              <div class="col-lg form-inline">
                <label for="StorePlc">存放库位:</label>
                <input id="StorePlc" type="text" class="form-control" v-model="rtMtrl.m_store_place" title="库名区位架号层号位号" readonly>
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="QTY">返还数量:</label>
                <input id="QTY" type="number" class="form-control" v-model="rtn_qty" placeholder="返还数量" title="返还数量">
              </div>
              <div class="col-lg form-inline">
                <label for="RMK">库管备注:</label>
                <input id="RMK" type="text" class="form-control" v-model="mio_remark" placeholder="库管备注" title="库管备注">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveReturnedData">验收无误</button>
        </div>  
      </div>
    </div>
  </div>
  <div class="modal fade" id="purchasing" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span>采购验收单</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="iptName">请购名称:</label>
                <input id="iptName" type="text" class="form-control" :value="thePurchasing.name" title="请购名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="aplr">采购申请:</label>
                <input id="aplr" type="text" class="form-control" :value="getApplyer(thePurchasing)" title="采购申请人" readonly>
<!--                 <select id="aplr" type="text" class="form-control" v-model="thePurchasing.id_applier" title="采购申请人" disabled>
                  <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                </select> -->
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="Brd">采购品牌:</label>
                <input id="Brd" type="text" class="form-control" :value="thePurchasing.brand" title="采购品牌的厂家或品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="Mdl">规格型号:</label>
                <input id="Mdl" type="text" class="form-control" :value="thePurchasing.model" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="MUP">包装单位:</label>
                <input id="MUP" type="text" class="form-control" v-model="thePurchasing.unit" placeholder="例:100g/袋,24袋/箱" title="包装单位,如:100g/袋,24袋/箱">
              </div> 
              <div class="col-lg form-inline">
                <label for="QTY">验收数量:</label>
                <input id="QTY" type="number" class="form-control" v-model="thePurchasing.qtyAC" placeholder="验收数量" title="验收数量">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="iptMem">备注信息:</label>
                <input id="iptMem" type="text" class="form-control" v-model="thePurchasing.remark_ac" placeholder="验收的备注信息" title="验收备注信息">
              </div> 
              <div class="col-lg form-inline">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveACData">确认验收</button>
        </div>  
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import qs from 'qs';
  import datepicker from 'vue2-datepicker';
  export default {
    data () {
      return {
        currentUserId:this.$store.state.user.id_user,
        employees:this.$store.state.employees,
        projects:this.$store.state.projects,
        shortcuts:false,

        queryContent:{
          keyWord:'',
          conditions:'',
          dateRange:[],
        },
        materials:[],
        titleOfList:['名称','品牌','规格型号','计量单位','包装容量','库存数','保存位置','备注'],
        width:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],
        qty:0,
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
        },
        unreturnedMQC:{
          dateRange:[],
          keyWord:'',
          id_project:0,
          id_applyer:0,
        },
        unreturnedMs:[],
        unreturnedTitle:['申领人','物料名称','品牌','规格型号','计量单位','包装容量','已发放数','已归还数','领用用途','领用备注'],
        unreturnedWidth:['10%','12.5%','10%','12%','8%','12.5%','8%','10%','7%','10%'],
        rtMtrl:{
          id:'',
          id_applyer:'',
          m_name:'',
          m_unit:'',
          m_brand:'',
          m_model:'',
          m_min_unit_packing:'',
          m_store_place:'',
          mio_qty:'',
        },
        mio_remark:'',
        id_op:'',
        rtn_qty:0,

        pcsnsTitle:['项目','名称','品牌','规格型号','详情','数量','单位','供应商','购买金额','请购日期','采购员','备注信息'],
        pcsnsWidth:['7%','7%','8%','10%','10%','6%','6%','8%','8%','12%','8%','10%'],
        purchasings:[],
        pcsQC:{
          keyWord:'',
          conditions:'',
          dateRange:[],
        },
        thePurchasing:{},
      }
    },
    components: {
     datepicker,
    },
    methods:{
      getListOfMaterials() {
        this.materials=this.$store.state.materials;
      },
      clickedARecorderToModify(dataRow) {
        this.material=dataRow;
        $('#editerForNewArrived').modal('toggle');
      },
      saveNewArrivedData() {
        if(this.qty<=0) {
          this.$toast({
            text: '数量必须大于0!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        this.queryContent=this.material;
        this.queryContent.qty_inbound=this.qty;
        this.queryContent.conditions='updateQTYWithInboundData';
        this.queryContent.id_op=this.currentUserId;
        var _this=this;
        var url='insertMaterialsInOutbound.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
            _this.materials=[];
            _this.material.id='';
            _this.material.name='';
            _this.material.unit='';
            _this.material.brand='';
            _this.material.model='';
            _this.material.min_unit_packing='';
            _this.material.store_place='';
            _this.material.remark='';
            _this.qty=0;
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
            $('#editerForNewArrived').modal('toggle');
          } else {
            console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 2000
            });
            $('#editerForNewArrived').modal('toggle');
          } 
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
          $('#editerForNewArrived').modal('toggle');
        });
      },
      getPreMonth() {
        var n = new Date();
        var year = n.getFullYear();
        var month = n.getMonth();
        if(month==0){
          month=12;
          year=year-1;
        }
        n = new Date(year,month, 0);
        var dayCount = n.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        var firstDay = year + "-" + month + "-" + "01";//上个月的第一天
        var endDay = year + "-" + month + "-" + dayCount;//这个月的第一天
        return {'firstDay':firstDay,'endDay':endDay};
      },
      getUnreturnedMData () {
        var _this = this;
        this.unreturnedMs=[];
        this.unreturnedMQC.conditions="UNRETURNEDMMS";
        if(this.unreturnedMQC.dateRange.length<2 || this.unreturnedMQC.dateRange[0].length<10 || this.unreturnedMQC.dateRange[1].length<10) {
          var lastMonth=this.getPreMonth();
          this.unreturnedMQC.dateRange[0]=lastMonth.firstDay;
          this.unreturnedMQC.dateRange[1]=lastMonth.endDay;
        }
        this.unreturnedMQC.dateRange[0]+=(this.unreturnedMQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.unreturnedMQC.dateRange[1]+=(this.unreturnedMQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        this.$axios({
          method: 'post',
          url: 'getUnreturndMaterials.php',
          data: qs.stringify(_this.unreturnedMQC)
        }).then(function (response) {
          console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({
              text: '找不到符合条件的记录!',
              type: 'info',
              duration: 1000
            });              
          } else {
            _this.unreturnedMs=response.data;
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
      slctOnetoReturn (r) {
        this.rtMtrl=r;
        this.rtMtrl.mio_qty=Number(this.rtMtrl.qty_distributed)-Number(this.rtMtrl.qty_returned);
        $('#editerForReturning').modal('toggle');
      },
      saveReturnedData () {
        this.rtMtrl.id_op=this.currentUserId;
        this.rtMtrl.mio_remark=this.mio_remark;
        this.rtMtrl.rtn_qty=this.rtn_qty;
        if(this.rtMtrl.rtn_qty=='' || this.rtMtrl.rtn_qty==0) {
          this.$toast({
            text: '数量不符合要求!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        this.rtMtrl.conditions='updateAMIOWithReturnData';
        var _this=this;
        var url='insertMaterialsInOutbound.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.rtMtrl)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({
              text: '成功保存数据!',
              type: 'success',
              duration: 800
            });
            var i=_this.unreturnedMs.findIndex(function(item){return item.id==_this.rtMtrl.id});
            _this.unreturnedMs.splice(i,1);
            _this.mio_remark='';
            _this.id_op='';
            _this.rtn_qty=0;
            $('#editerForReturning').modal('toggle');
          } else {
            $('#editerForReturning').modal('toggle');
            console.log(response.data);
            _this.$toast({
              text: '通信错误!'+response.data,
              type: 'danger',
              duration: 2000
            });
          } 
        }).catch(function (error) {
          $('#editerForReturning').modal('toggle');
          console.log(error);
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
        });
      },
      getListOfPcsings() {
        var _this = this;
        this.purchasings=[];
        this.pcsQC.conditions="UnAcceptanceChecked";
        if(this.pcsQC.dateRange.length<2 || this.pcsQC.dateRange[0].length<10 || this.pcsQC.dateRange[1].length<10) {
          var lastMonth=this.getPreMonth();
          this.pcsQC.dateRange[0]=lastMonth.firstDay;
          this.pcsQC.dateRange[1]=lastMonth.endDay;
        }
        this.pcsQC.dateRange[0]+=(this.pcsQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.pcsQC.dateRange[1]+=(this.pcsQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.pcsQC)
        }).then(function (response) {
          console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({
              text: '找不到符合条件的记录!',
              type: 'info',
              duration: 1000
            });              
          } else {
            _this.purchasings=response.data;
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
      clickedAPcsnsForAC (r) {
        this.thePurchasing=r;
        this.thePurchasing.qtyAC=r.quantity;
        this.thePurchasing.remark_ac='';
        // this.thePurchasing.unit='';
        $('#purchasing').modal('toggle');
        console.log(this.thePurchasing);
      },
      saveACData () {
        if(this.thePurchasing.qtyAC<=0) {
          this.$toast({
            text: '验收数量必须大于0!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        if(this.thePurchasing.unit.length<1) {
          this.$toast({
            text: '包装单位最少1个字!',
            type: 'info',
            duration: 1500
          });
          return;
        }
        this.queryContent=this.thePurchasing;
        this.queryContent.conditions='UpdateWithAcceptanceCheckedData';
        this.queryContent.id_op=this.currentUserId;
// console.log(this.queryContent);
// return;
        var _this=this;
        var url='updateApplyPurchasing.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            $('#purchasing').modal('toggle');
            var index=_this.purchasings.findIndex((item)=>item.id==_this.thePurchasing.id);
            _this.purchasings.splice(index,1);
            _this.thePurchasing={};
            _this.queryContent={
              keyWord:'',
              conditions:'',
              dateRange:[],
            };
            _this.$toast({
              text: '成功保存数据!',
              type: 'success',
              duration: 800
            });
          } else {
            $('#purchasing').modal('toggle');
            console.log(response.data);
            _this.$toast({
              text: '通信错误!'+response.data,
              type: 'danger',
              duration: 2000
            });
          } 
        }).catch(function (error) {
          $('#purchasing').modal('toggle');
          console.log(error);
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
        });
      },
    },
    computed:{
      getApplyer() {
        return function (row) {
          var empl=this.employees.find((ele) => ele['id'] == row.id_applier);
          return typeof(empl)=='undefined'?'':empl['name'];
        }
      },
      getProject() {
        return function (r) {
          var o=this.projects.find((ele) => ele['id'] == r.id_project);
          return typeof(o)=='undefined'?'':o['name'];
        }
      },
      getPurchaser() {
        return function (r) {
          var o=this.employees.find((ele) => ele['id'] == r.e_id_enquiryer);
          return typeof(o)=='undefined'?'':o['name'];
        }
      }
    },
    beforeCreate:function() { 
    }    
  }  
</script>

<style scoped>
.modal input,.modal select {
  width: 75%;
}
.tab-content,.row {
  margin-top: 5px;
}
.searchbox button,.searchbox input,.searchbox select {
  margin-left: 5px;
}
.searchbox {
  margin-bottom: 5px;  
}
.tab-pane {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
