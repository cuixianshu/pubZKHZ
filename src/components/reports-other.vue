<template>
<div class="father">
  <ul class="nav nav-pills" role="tablist">
    <li class="nav-item">
      <a class="nav-link" data-toggle="pill" href="#pay">物料出入库报表</a>
    </li>
<!--     <li class="nav-item">
      <a class="nav-link" data-toggle="pill" href="#invoice">发票报表</a>
    </li> -->
  </ul>
  <div class="tab-content">
    <div id="pay" class="container-fluid tab-pane active"><!--   -->
      <div class="row">
        <div class="form-inline" v-if="materialIOData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="MIOQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="出入库时间,默认上个月" :shortcuts="shortcuts" placeholder="出入库的时间范围">
          </datepicker>
          <input class="form-control" v-model="MIOQC.keyWord" title="用途,备注信息等" placeholder="查询关键字" style="width:110px; background: #CEFFCE;">
          <select class="form-control" v-model="MIOQC.material" title="选择物料">
            <option value="0">所有物料</option>
            <option v-for="item in materials" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="MIOQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="MIOQC.id_applyer" title="选择申领人">
            <option value="0">所有申领人</option>
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="MIOQC.opType" title="选择操作类型">
            <option value="5">所有类型</option>
            <option v-for="item in IOTypes" :value="item.id">{{item.name}}</option>
          </select>
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getMaterialIOData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="materialIOData.length>0">
        <span class="tip">
          共{{materialIOData.length}}次。
          总出库数:{{distributeTotalAmount}},总入库数:{{inboundTotalAmount}}。
        </span>
        <jsonexcel class="btn btn-primary" :data="material_json_data" :fields="material_json_fields" :name="material_filename" worksheet="物料出入库报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="materialIOData=[]">清空</button>
      </div>
      <div class="form pre-scrollable" v-if="materialIOData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in materialIOTitles" :width="materialIOWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in materialIOData">
              <td :title='row.time_op'>{{row.time_op}}</td>
              <td :title='row.type_op'>{{row.type_op}}</td>
              <td :title='row.a_id_applyer'>{{row.a_id_applyer}}</td>
              <td :title='row.a_id_project'>{{row.a_id_project}}</td>
              <td :title='row.a_use_for'>{{row.a_use_for}}</td>
              <td :title='row.m_name'>{{row.m_name}}</td>
              <td :title='row.m_brand'>{{row.m_brand}}</td>
              <td :title='row.m_model'>{{row.m_model}}</td>
              <td :title='row.m_unit'>{{row.m_unit}}</td>
              <td :title='row.qty'>{{row.qty}}</td>
              <td :title='row.a_remark'>{{row.a_remark}}</td>
              <td :title='row.id_op'>{{row.id_op}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
<!--     <div id="invoice" class="container-fluid tab-pane">
      <div class="row">
        <div class="form-inline" v-if="invoiceData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="invoiceQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="发票填开的时间范围,默认上个月" :shortcuts="shortcuts" placeholder="填开发票的时间范围">
          </datepicker>
          <input class="form-control" v-model="invoiceQC.keyWord" title="发票号,抬头,商品名,金额,备注等" placeholder="查询关键字" style="width:110px; background: #CEFFCE;">
          <select class="form-control" v-model="invoiceQC.id_project" title="选择所属项目">
            <option :value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="invoiceQC.id_ourCompany" title="出具发票公司名">
            <option :value="0">全部公司</option>
            <option v-for="item in ourCompanys" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="invoiceQC.isCanceled" title="作废状态">
            <option value="0">未作废</option>
            <option value="1">已作废</option>
            <option value="2">作废状态</option>
          </select>
          <select class="form-control" v-model="invoiceQC.isCashed" title="作废状态">
            <option value="0">未收款</option>
            <option value="1">已收款</option>
            <option value="2">收款状态</option>
          </select>
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getInvoiceData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="invoiceData.length>0">
        <span class="tip">
          共{{countOfInvoices}}张。
          开票总额:{{invoiceTotalAmount}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="invoice_json_data" :fields="invoice_json_fields" :name="invoice_filename" worksheet="发票报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="invoiceData=[]">清空</button>
      </div>
      <div class="form pre-scrollable" v-if="invoiceData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in invoiceTitles" :width="invoiceWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in invoiceData">
              <td title='开票ID'>{{row.id}}</td>
              <td :title='row.id_project'>{{row.id_project}}</td>
              <td :title='row.r_id_applyer'>{{row.r_id_applyer}}</td>
              <td :title='row.time_fill'>{{row.time_fill}}</td>
              <td :title='row.r_id_of_our_cmpny'>{{row.r_id_of_our_cmpny}}</td>
              <td :title='row.r_id_type_invoice'>{{row.r_id_type_invoice}}</td>
              <td :title='row.num_of_invoice'>{{row.num_of_invoice}}</td>
              <td :title='row.r_id_clt_prnt_ognztn'>{{row.r_id_clt_prnt_ognztn}}</td>
              <td :title='row.r_googs_name'>{{row.r_googs_name}}</td>
              <td :title='row.amount'>{{row.amount}}</td>
              <td :title='row.id_tbl_cashier'>{{row.id_tbl_cashier}}</td>
              <td :title='row.other'>{{row.other}}</td>
              <td :title='row.r_other'>{{row.r_other}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>  -->
  </div>    
</div>
</template>

<script>
import datepicker from 'vue2-datepicker';
import qs from 'qs';
import jsonexcel from 'vue-json-excel/JsonExcel.vue';
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
      shortcuts:false,
      projects:[],
      employees:[],
      materials:[],

      MIOQC:{
        keyWord:'',
        dateRange:[],
        id_project:0,
        material:0,
        id_applyer:0,
        opType:5,
      },
      materialIOData:[],
      materialIOTitles:['出入库时间','出入库类型','申领人','所属项目','物料用途','物料名称','物料品牌','规格型号','计量单位','数量','申领备注','仓管'],
      materialIOWidths:['10%','9%','6%','9%','9%','9%','9%','9%','7%','7%','9%','7%'],
      IOTypes:[
        {id:0,name:'发放出库'},
        {id:1,name:'验收入库'},
        {id:2,name:'盘点增加'},
        {id:3,name:'盘点减少'},
        {id:4,name:'盘点正确'},
        {id:5,name:'所有类型'},
      ],
      distributeTotalAmount:0,
      inboundTotalAmount:0,
      checkedADD:0,
      checkedDecrease:0,
      material_json_fields:{},
      material_json_data:[],
      material_filename:'物料出入库报表', 
      material_volName:{
        '进出库ID':'id',
        '申领人':'a_id_applyer',
        '所属项目':'a_id_project',
        '申领数量':'a_qty',
        '申领备注':'a_remark',//请款表中
        '申领时间':'a_time_applied',
        '物料用途':'a_use_for',//请款表中
        '物料ID':'id_material',
        '仓管':'id_op',
        '物料品牌':'m_brand',
        '上次盘点日期':'m_date_last_inventory',
        '规格型号':'m_model',//请款表中
        '物料名称':'m_name',
        '物料备注':'m_remark',//请款表中
        '存放仓库':'m_store_place',//请款表中
        '计量单位':'m_unit',
        '数量':'qty',
        '仓管备注':'remark',
        '出入库时间':'time_op',
        '出入库类型':'type_op',//请款表中
      },
    }
  },
  components: {
    datepicker,
    jsonexcel
  },
  methods: {
    getMaterialIOData () {
      this.distributeTotalAmount=0;
      this.inboundTotalAmount=0;
      this.checkedADD=0;
      this.checkedDecrease=0;      
      this.materialIOData=[];
      if(this.MIOQC.dateRange.length<2 || this.MIOQC.dateRange[0].length<10 || this.MIOQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.MIOQC.dateRange[0]=lastMonth.firstDay;
        this.MIOQC.dateRange[1]=lastMonth.endDay;
      }
      this.MIOQC.dateRange[0]+=(this.MIOQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.MIOQC.dateRange[1]+=(this.MIOQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.MIOQC.conditions='ForMIOReport';
      this.$axios({
            method: 'post',
            url: 'getMaterialIO.php',
            data: qs.stringify(_this.MIOQC)
        }).then(function (response) {
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.materialIOData=response.data;
          _this.materialIOData.forEach(function(item,index,array){
            var ar=_this.employees.find((ele) => ele['id'] == item.a_id_applyer);
            item.a_id_applyer=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.projects.find((ele) => ele['id'] == item.a_id_project);
            item.a_id_project=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_op);
            item.id_op=typeof(ar)=='undefined'?'':ar['name'];
            if(item.type_op==0) {
              _this.distributeTotalAmount+= Number(item['qty']);
            }
            if(item.type_op==1) {
              _this.inboundTotalAmount+= Number(item['qty']);
            }
            if(item.type_op==2) {
              _this.checkedADD+= Number(item['qty']);
            }
            if(item.type_op==3) {
              _this.checkedDecrease+= Number(item['qty']);
            }
            var ar=_this.IOTypes.find((ele) => ele['id'] == item.type_op);
            item.type_op=typeof(ar)=='undefined'?'':ar['name'];
          });
          _this.material_json_data=[];
          _this.material_json_fields={};
          _this.material_json_data=_this.materialIOData;
          _this.material_filename='物料出入库报表';
          for(var prop in _this.material_volName) {
            _this.material_json_fields[prop]=_this.material_volName[prop];
          }
          _this.material_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
             duration: 4000
          });
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
  },
  computed: {

  },  
  beforeCreate () {
    var _this = this;
    var queryContent={};

    this.projects=[];
    this.$axios({
      method: 'post',
      url: 'getProject.php'
    }).then(function (response) {
      _this.projects=response.data;
    }).catch(function (error) {
      _this.$toast({
        text: '异步通信错误!'+error,
        type: 'danger',
        duration: 4000
      });
    });
    this.employees=[];
    queryContent.conditions="All";
    this.$axios({
          method: 'post',
          url: 'getEmployees.php',
          data: qs.stringify(queryContent)
      }).then(function (response) {
        _this.employees=response.data;
      }).catch(function (error) {
        _this.$toast({
           text: '异步通信错误!'+error,
           type: 'danger',
            duration: 4000
        });
      });
    this.materials=[];
    queryContent.keyWord='';
    this.$axios({
          method: 'post',
          url: 'getMaterials.php',
          data: qs.stringify(queryContent)
      }).then(function (response) {
        _this.materials=response.data;
      }).catch(function (error) {
        _this.$toast({
           text: '异步通信错误!'+error,
           type: 'danger',
           duration: 4000
        });
      }); 
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
.tab-content {
  margin: 5px auto;
}
.tab-content input,.tab-content .datepicker,.tab-content select,.tab-content button {
  margin-right: 5px;
}
.row {
  margin-bottom: 2px;
}
table {
  overflow: auto;
  font-size: 12px;
}
td {
  overflow:hidden; 
  white-space:nowrap; 
  text-overflow:ellipsis;
  max-width: 50px;
}
.tip {
  font-size: 18px;
  color: #007bff;
}
</style>
