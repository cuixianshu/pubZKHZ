<template>
<div class="father">
  <h5>当前位置:业务报表/采购报表</h5>
  <div id="rcpt" class="container-fluid">
    <!-- <div class="row"> -->
        <div class="form-inline" v-if="purchasingData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="pcsQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="申请采购时间,默认上个月" :shortcuts="shortcuts" placeholder="申请采购的时间范围">
          </datepicker>
          <input class="form-control" v-model="pcsQC.keyWord" title="物品名称,品牌,型号,详情,备注,供应商等" placeholder="查询关键字" style="width:110px; background: #CEFFCE;">
          <select class="form-control" v-model="pcsQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="pcsQC.id_applier" title="请购人">
            <option value="0">所有请购人</option> 
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="pcsQC.id_purchasher" title="采购人">
            <option value="0">所有采购人</option> 
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="pcsQC.isFinished"  title="是否已完成">
            <option value="0">未完成</option>
            <option value="1">已完成</option>
            <option value="2">所有状态</option>
          </select>
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getPurchaseData">搜索数据</button>
        </div>
    <!-- </div> -->
    <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
    <div v-if="purchasingData.length>0">
        <span class="tip">
          共{{purchasingData.length}}次。
          收款总额:{{pcsTotalAmount}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="pcs_json_data" :fields="pcs_json_fields" :name="pcs_filename" worksheet="采购报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="purchasingData=[]">清空</button>
    </div>
    <div class="form pre-scrollable" v-if="purchasingData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in pcsTitles" :width="pcsWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in purchasingData">
              <td title='请购ID'>{{row.id}}</td>
              <td :title='row.id_applier'>{{row.id_applier}}</td>
              <td :title='row.name'>{{row.name}}</td>
              <td :title='row.brand'>{{row.brand}}</td>
              <td :title='row.model'>{{row.model}}</td>
              <td :title='row.detail'>{{row.detail}}</td>
              <td :title='row.date_applied'>{{row.date_applied}}</td>
              <td :title='row.remark'>{{row.remark}}</td>
              <td :title='row.id_project'>{{row.id_project}}</td>
              <td :title='row.e_seller'>{{row.e_seller}}</td>
              <td :title='row.e_amount'>{{row.e_amount}}</td>
              <td :title='row.e_id_enquiryer'>{{row.e_id_enquiryer}}</td>
              <td :title='row.date_finished'>{{row.date_finished}}</td>
            </tr>
          </tbody>
        </table>
    </div>
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
      projects:this.$store.state.projects,
      employees:this.$store.state.employees,
      pcsQC:{
        keyWord:'',
        dateRange:[],
        id_project:0,
        id_applier:0,
        id_purchasher:0,
        isFinished:2,
      },
      purchasingData:[],
      pcsTitles:['请购ID','请购人','物品名称','品牌','型号','用途','请购时间','请购备注','所属项目','供应商','金额','采购人','完成日期'],
      pcsWidths:['6%','6%','8%','8%','8%','8%','8%','8%','8%','8%','8%','8%','8%'],
      pcsTotalAmount:0,
      pcs_json_fields:{},
      pcs_json_data:[],
      pcs_filename:'采购报表', 
      pcs_volName:{
        '所属项目':'id_project',
        '物品名称':'name',
        '品牌':'brand',
        '型号':'model',
        '用途':'detail',
        '请购时间':'date_applied',
        '请购人':'id_applier',
        '金额':'e_amount',
        '采购人':'e_id_enquiryer',
        '供应商':'e_seller',
        '完成日期':'date_finished',
        '请购备注':'remark',
      },
    }
  },
  components: {
    datepicker,
    jsonexcel
  },
  methods: {
    getPurchaseData () {
      this.purchasingData=[];
      this.pcsTotalAmount=0;
      if(this.pcsQC.dateRange.length<2 || this.pcsQC.dateRange[0].length<10 || this.pcsQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.pcsQC.dateRange[0]=lastMonth.firstDay;
        this.pcsQC.dateRange[1]=lastMonth.endDay;
      }
      this.pcsQC.dateRange[0]+=(this.pcsQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
      this.pcsQC.dateRange[1]+=(this.pcsQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
      var _this=this;
      this.pcsQC.conditions='ForReport';
      this.$axios({
            method: 'post',
            url: 'getPurchasings.php',
            data: qs.stringify(_this.pcsQC)
        }).then(function (response) {
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.purchasingData=response.data;
          _this.purchasingData.forEach(function(item,index,array){
            var ar=_this.projects.find((ele) => ele['id'] == item.id_project);
            item.id_project=typeof(ar)=='undefined'?'未知项目':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_applier);
            item.id_applier=typeof(ar)=='undefined'?'未知请购人':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.e_id_enquiryer);
            item.e_id_enquiryer=typeof(ar)=='undefined'?'未知采购人':ar['name'];
            _this.pcsTotalAmount+= Number(item['e_amount']);

          });
          _this.pcs_json_data=[];
          _this.pcs_json_fields={};
          _this.pcs_json_data=_this.purchasingData;
          _this.pcs_filename='采购报表';
          for(var prop in _this.pcs_volName) {
            _this.pcs_json_fields[prop]=_this.pcs_volName[prop];
          }
          _this.pcs_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
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
    getReviewText() {
      return function (row) {
        return row.time_confirm?row.time_confirm:'未复核';
      }
    }
  },  
  beforeCreate () {
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
.form-inline select,.form-inline input,.form-inline button{
  margin-right: 5px;
  margin-left: 5px;
}
</style>



