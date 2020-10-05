<template>
<div class="father"><!-- pills -->
  <ul class="nav nav-tabs" role="tablist">
  	<li class="nav-item">
  	  <a class="nav-link active" data-toggle="tab" role="tab" href="#vecl">用车销售报表</a>
  	</li>
  	<li class="nav-item">
  	  <a class="nav-link" data-toggle="tab" role="tab" href="#tkts">机票销售报表</a>
  	</li>
  	<li class="nav-item">
  	  <a class="nav-link" data-toggle="tab" role="tab" href="#othersale">其它销售报表</a>
  	</li>
  </ul>
  <div class="tab-content">
    <div id="vecl" class="container-fluid tab-pane active"><!--   -->
      <div class="row">
        <div class="form-inline" v-if="fleetSaleData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="veclQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="业务发生的时间,默认上个月" :shortcuts="shortcuts" placeholder="发生业务的时间范围">
          </datepicker>
          <select class="form-control" v-model="veclQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="veclQC.id_car" title="选择所用车辆" :disabled="canSelectCar">
            <option value="0">所有车辆</option>
            <option v-for="item in cars" :value="item.id">{{item.alias}}</option>
          </select>
          <select class="form-control" v-model="veclQC.id_driver" title="选择出车司机" :disabled="canNotSelectDriver">
            <option value="0">所有司机</option>
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="veclQC.clntDptmt_short_name" title="客户所在单位">
            <option value="0">所有单位</option>
            <option v-for="item in clientDepartments">{{item.short_name}}</option>
          </select>
          <select class="form-control" v-model="veclQC.id_client" title="选择订车人">
            <option value="0">所有客户</option>
            <option v-for="item in clients" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="veclQC.isFilledInvoice"  title="是否已开票">
            <option value="0">未开票</option>
            <option value="1">已开票</option>
            <option value="2">开票状态</option>
          </select>
          <select class="form-control" v-model="veclQC.isReceivedFee" title="是否已回款">
            <option value="0">未回款</option>
            <option value="1">已回款</option>
            <option value="2">回款状态</option>
          </select>                    
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getFleetSaleData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="fleetSaleData.length>0">
        <span class="tip">
          共{{fleetSaleData.length}}次。
          车费总额:{{totalVeclAmount}}元。
          停车总额：{{totalVeclPark_fee}}元。
          垫付总额：{{totalVeclSurcharge}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="vecl_json_data" :fields="vecl_json_fields" :name="vecl_filename" worksheet="用车报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="fleetSaleData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="fleetSaleData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in veclTitles" :width="veclWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in fleetSaleData">
              <td :title='row.id_contacter'>{{row.id_contacter}}</td>
              <td :title='row.cstmr_ognz'>{{row.cstmr_ognz}}</td>
              <td :title='row.id_prjct_belongto'>{{row.id_prjct_belongto}}</td>
              <td :title='row.id_product'>{{row.id_product}}</td>
              <td :title='row.id_operater'>{{row.id_operater}}</td>
              <td :title='row.id_equipment'>{{row.id_equipment}}</td>
              <td :title='row.start_time'>{{row.start_time}}</td>
              <td :title='row.start_point'>{{row.start_point}}</td>
              <td :title='row.end_point'>{{row.end_point}}</td>
              <td :title='row.actual_price'>{{row.actual_price}}</td>
              <td :title='row.park_fee'>{{row.park_fee}}</td>
              <td :title='row.surcharge'>{{row.surcharge}}</td>
              <td :title='row.use_surcharge'>{{row.use_surcharge}}</td>
              <td :title='row.mem'>{{row.mem}}</td>
              <td title='收款ID'>{{row.id_cashier}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="tkts" class="container-fluid tab-pane fade">
      <div class="row">
        <div class="form-inline" v-if="tktSaleData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="tktQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="出票时间,默认上个月" :shortcuts="shortcuts" placeholder="出票的时间范围">
          </datepicker>
          <input class="form-control" type="text" v-model="tktQC.psgrName" title="乘客姓名,不填写表示任意乘客" placeholder="乘客姓名" style="width:110px; background: #CEFFCE;">
          <select class="form-control" v-model="tktQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="tktQC.clntDptmt_short_name" title="客户所在单位">
            <option value="0">所有单位</option>
            <option v-for="item in clientDepartments">{{item.short_name}}</option>
          </select>
          <select class="form-control" v-model="tktQC.isRefounded" title="选择退票状态">
            <option value="0">未退票</option>
            <option value="1">已退票</option>
            <option value="2">退票状态</option>
          </select> 
          <select class="form-control" v-model="tktQC.isOutbounded"  title="是否已出库">
            <option value="0">未出库</option>
            <option value="1">已出库</option>
            <option value="2">出库状态</option>
          </select>
          <select class="form-control" v-model="tktQC.isReceivedFee" title="是否已回款">
            <option value="0">未回款</option>
            <option value="1">已回款</option>
            <option value="2">回款状态</option>
          </select>                    
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getTktSaleData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="tktSaleData.length>0">
        <span class="tip">
          共{{tktSaleData.length}}次。
          票价总额:{{totalTktPriceAmount.toFixed(2)}}元。
          保险总额：{{totalTktInsurance.toFixed(2)}}元。
          佣金总额：{{totalTktCommission.toFixed(2)}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="tkt_json_data" :fields="tkt_json_fields" :name="tkt_filename" worksheet="机票报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="tktSaleData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="tktSaleData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in tktTitles" :width="tktWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in tktSaleData"><!--  @click="clickedARow(row)" -->
              <td :title='row.date_issued'>{{row.date_issued}}</td>
              <td :title='row.name_psgr'>{{row.name_psgr}}</td>
              <td :title='row.dptmt_client'>{{row.dptmt_client}}</td>
              <td :title='row.date_departure'>{{row.date_departure}}</td>
              <td :title='row.trip'>{{row.trip}}</td>
              <td :title='row.price'>{{row.price}}</td>
              <td :title='row.tax'>{{row.tax}}</td>
              <td :title='row.insurance'>{{row.insurance}}</td>
              <td :title='row.commission'>{{row.commission}}</td>
              <td title='出库日期'>{{getOutboundedDate(row)}}</td>
              <td :title='row.amount_clctd'>{{row.amount_clctd}}</td>
              <td :title='row.amount_clctd_refound'>{{row.amount_clctd_refound}}</td>
              <td :title='row.amount_clctd_changing_fee'>{{row.amount_clctd_changing_fee}}</td>
              <td :title='row.num_collection'>{{getNum_clct(row)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="othersale" class="container-fluid tab-pane fade">
      <div class="row">
        <div class="form-inline" v-if="otherSaleData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="otherQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="业务发生的时间,默认上个月" :shortcuts="shortcuts" placeholder="发生业务的时间范围">
          </datepicker>
          <select class="form-control" v-model="otherQC.id_project" title="选择所属项目">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="otherQC.id_operater" title="选择执行人">
            <option value="0">所有员工</option>
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="otherQC.clntDptmt_short_name" title="客户所在单位">
            <option value="0">所有单位</option>
            <option v-for="item in clientDepartments">{{item.short_name}}</option>
          </select>
          <select class="form-control" v-model="otherQC.id_client" title="业务对接人">
            <option value="0">所有客户</option>
            <option v-for="item in clients" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="otherQC.isFilledInvoice"  title="是否已开票">
            <option value="0">未开票</option>
            <option value="1">已开票</option>
            <option value="2">开票状态</option>
          </select>
          <select class="form-control" v-model="otherQC.isReceivedFee" title="是否已回款">
            <option value="0">未回款</option>
            <option value="1">已回款</option>
            <option value="2">回款状态</option>
          </select>                    
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getOtherSaleData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="otherSaleData.length>0">
        <span class="tip">
          共{{otherSaleData.length}}次。
          销售总额:{{totalOtherAmount.toFixed(2)}}元。
          垫付总额：{{totalOtherSurcharge.toFixed(2)}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="other_json_data" :fields="other_json_fields" :name="other_filename" worksheet="其它销售报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="otherSaleData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="otherSaleData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in otherTitles" :width="otherWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in otherSaleData">
              <td :title='row.cstmr_ognz'>{{row.cstmr_ognz}}</td>
              <td :title='row.id_contacter'>{{row.id_contacter}}</td>
              <td :title='row.id_prjct_belongto'>{{row.id_prjct_belongto}}</td>
              <td :title='row.id_product'>{{row.id_product}}</td>
              <td title='数量'>{{row.quantity}}</td>
              <td :title='row.actual_price'>{{row.actual_price}}</td>
              <td :title='row.surcharge'>{{row.surcharge}}</td>
              <td :title='row.use_surcharge'>{{row.use_surcharge}}</td>
              <td :title='row.start_time'>{{row.start_time}}</td>
              <td :title='row.start_point'>{{row.start_point}}</td>
              <td :title='row.id_operater'>{{row.id_operater}}</td>
              <td :title='row.mem'>{{row.mem}}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
        veclQC:{
          keyWord:'',
          conditions:'',
          dateRange:[],
          id_project:0,
          id_car:0,
          id_driver:0,
          clntDptmt_short_name:0,
          id_client:0,
          isFilledInvoice:2,
          isReceivedFee:2,
        },
        shortcuts:false,
        projects:this.$store.state.projects,
        cars:this.$store.state.equipments,
        products:this.$store.state.products,
        employees:this.$store.state.employees,
        clientDepartments:[],
        clients:[],
        filtedClients:[],
        canNotSelectDriver:true,
        canSelectCar:true,
        fleetSaleData:[],
        totalVeclAmount:0,
        totalVeclPark_fee:0,
        totalVeclSurcharge:0,
        vecl_json_data:[],
        vecl_json_fields:{},
        vecl_filename:'用车报表',
        veclTitles:['用车人','单位','所属项目','产品','司机','车辆','开始时间','起点','终点','车费','停车费','垫付','垫付用途','备注信息','收款ID'],
        veclWidths:['5%','8%','8%','10%','5%','6%','6%','6%','6%','8%','7%','7%','6%','6%','6%'],
        vecl_volName:{
          '订单ID':'id',
          '客户单位':'cstmr_ognz',
          '客户':'id_contacter',
          '项目':'id_prjct_belongto',
          // '合同号':'id_contract',
          '产品':'id_product',
          // '计价':'id_rule_price',
          // '数量':'quantity',
          '车费':'actual_price',
          '停车费':'park_fee',
          '垫付':'surcharge',
          '垫付用途':'use_surcharge',
          '开始时间':'start_time',
          '结束时间':'end_time',
          '通知司机':'msg_for_driver',
          '起点':'start_point',
          '终点':'end_point',
          '里程':'mileage',
          '司机':'id_operater',
          '车辆':'id_equipment',
          // '结算单位':'id_payer',
          '备注':'mem',
          // '录入时间':'time_create',
          // '录入人':'id_creater',
          '核单时间':'time_verify',
          '核单人':'id_verifyer',
          '申请发票ID':'id_request_invoice',
          '开票ID':'id_fill_invoice',
          '收款ID':'id_cashier',
        },
        tktQC:{
          keyWord:'',
          conditions:'',
          dateRange:[],
          id_project:0,
          clntDptmt_short_name:0,
          psgrName:'',
          isOutbounded:2,
          isReceivedFee:2,
          isRefounded:2,
        },        
        tktSaleData:[],
        totalTktPriceAmount:0,
        totalTktInsurance:0,
        totalTktCommission:0,
        tkt_json_data:[],
        tkt_json_fields:{},
        tkt_filename:'机票报表',
        tktTitles:['入库日期','乘机人','单位','航班日期','航程','票价','税','保险','佣金','出库日期','已收票款','已收退票费','已收改签费','收款ID'],
        tktWidths:['8%','7%','7%','8%','7%','7%','7%','7%','7%','8%','7%','7%','7%','6%'],
        tkt_volName:{
          '入库日期':'date_issued',
          '票号':'number_ticket',
          '航班号':'number_flight',
          '乘机人':'name_psgr',
          '单位':'dptmt_client',
          '航班日期':'date_departure',
          '航程':'trip',
          '票价':'price',
          '税':'tax',
          '保险':'insurance',
          '佣金':'commission',
          '出库日期':'date_outbound',
          '已收票款':'amount_clctd',
          '收款日期':'date_clctd',
          '已收退票费':'amount_clctd_refound',
          '收退票费日期':'date_clct_refound_fee',
          '已收改签费':'amount_clctd_changing_fee',
          '收改签费日期':'date_clct_change_fee',
          '收款ID':'num_collection',
        },

        otherSaleData:[],
        totalOtherAmount:0,
        totalOtherSurcharge:0,
        otherQC:{
          keyWord:'',
          conditions:'',
          dateRange:[],
          id_project:0,
          id_operater:0,
          clntDptmt_short_name:0,
          id_client:0,
          isFilledInvoice:2,
          isReceivedFee:2,
        },
        other_json_data:[],
        other_json_fields:{},
        other_filename:'机票报表',
        otherTitles:['客户单位','客户','项目','产品','数量','售价','垫付','垫付用途','项目时间','项目地点','负责人','备注'],
        otherWidths:['9%','9%','9%','9%','7%','7%','7%','9%','9%','9%','9%','7%'],
        other_volName:{
          '订单ID':'id',
          '客户单位':'cstmr_ognz',
          '客户':'id_contacter',
          '项目':'id_prjct_belongto',
          // '合同号':'id_contract',
          '产品':'id_product',
          // '计价':'id_rule_price',
          '数量':'quantity',
          '销售价':'actual_price',
          '垫付':'surcharge',
          '垫付用途':'use_surcharge',
          '项目时间':'start_time',
          '项目地点':'start_point',
          '负责人':'id_operater',
          // '结算单位':'id_payer',
          '备注':'mem',
          // '录入时间':'time_create',
          // '录入人':'id_creater',
          // '核单时间':'time_verify',
          // '核单人':'id_verifyer',
          // '申请发票ID':'id_request_invoice',
          // '开票ID':'id_fill_invoice',
          // '收款ID':'id_cashier',
        },        
      }
    },
    components: {
     datepicker,
     jsonexcel,
    },
    methods:{
      getFleetSaleData () {
        this.fleetSaleData=[];
        this.totalVeclAmount=0;
        this.totalVeclPark_fee=0;
        this.totalVeclSurcharge=0;        
        if(this.veclQC.dateRange.length<2 || this.veclQC.dateRange[0].length<10 || this.veclQC.dateRange[1].length<10) {
          var lastMonth=this.getPreMonth();
          this.veclQC.dateRange[0]=lastMonth.firstDay;
          this.veclQC.dateRange[1]=lastMonth.endDay;
        }
        this.veclQC.dateRange[0]+=(this.veclQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.veclQC.dateRange[1]+=(this.veclQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        var _this=this;
        this.veclQC.conditions='FLEETSALE';
        this.$axios({
              method: 'post',
              url: 'getOrders.php',
              data: qs.stringify(_this.veclQC)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '没有符合条件的待核单记录',
                type: 'info',
                duration: 2000
              });
              return;
            }
            _this.fleetSaleData=response.data;
            _this.fleetSaleData.forEach(function(item,index,array){
              var ar=_this.clients.find((ele) => ele['id'] == item.id_contacter);
              item.id_contacter=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.projects.find((ele) => ele['id'] == item.id_prjct_belongto);
              item.id_prjct_belongto=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.products.find((ele) => ele['id'] == item.id_product);
              item.id_product=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.employees.find((ele) => ele['id'] == item.id_operater);
              item.id_operater=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.cars.find((ele) => ele['id'] == item.id_equipment);
              item.id_equipment=typeof(ar)=='undefined'?'':ar['alias'];
            });
            _this.vecl_json_data=[];
            _this.vecl_json_fields={};
            _this.vecl_json_data=_this.fleetSaleData;
            _this.vecl_filename='用车报表';
            for(var prop in _this.vecl_volName) {
              _this.vecl_json_fields[prop]=_this.vecl_volName[prop];
            }
            _this.vecl_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
            for(var i=0;i<_this.fleetSaleData.length;i++) {
              _this.totalVeclAmount+= Number(_this.fleetSaleData[i].actual_price);
              _this.totalVeclPark_fee+=Number(_this.fleetSaleData[i].park_fee);
              _this.totalVeclSurcharge+=Number(_this.fleetSaleData[i].surcharge);
            }
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
      getTktSaleData() {
        this.tktSaleData=[];
        this.totalTktPriceAmount=0;
        this.totalTktInsurance=0;
        this.totalTktCommission=0;        
        if(this.tktQC.dateRange.length<2 || this.tktQC.dateRange[0].length<10 || this.tktQC.dateRange[1].length<10) {
          var lastMonth=this.getPreMonth();
          this.tktQC.dateRange[0]=lastMonth.firstDay;
          this.tktQC.dateRange[1]=lastMonth.endDay;
        }
        var _this=this;
        this.tktQC.conditions='ForSaleReport';
        this.$axios({
              method: 'post',
              url: 'getTickets.php',
              data: qs.stringify(_this.tktQC)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '没有符合条件的待核单记录',
                type: 'info',
                duration: 2000
              });
              return;
            }
            _this.tktSaleData=response.data;
            _this.tktSaleData.forEach( function(ele, index,arr) {
              ele['num_collection']=ele['num_collection']=='19990101000'?'':ele['num_collection'];
            });
            _this.tkt_json_data=[];
            _this.tkt_json_fields={};
            _this.tkt_json_data=_this.tktSaleData;
            _this.tkt_filename='机票报表';
            for(var prop in _this.tkt_volName) {
              _this.tkt_json_fields[prop]=_this.tkt_volName[prop];
            }
            _this.tkt_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
            for(var i=0;i<_this.tktSaleData.length;i++) {
              _this.totalTktPriceAmount+= Number(_this.tktSaleData[i]['price']);
              _this.totalTktInsurance+=Number(_this.tktSaleData[i]['insurance']);
              _this.totalTktCommission+=Number(_this.tktSaleData[i]['commission']);
            }
          }).catch(function (error) {
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
                duration: 4000
            });
          }); 
      } ,
      getOtherSaleData () {
        this.otherSaleData=[];
        this.totalOtherAmount=0;
        this.totalOtherSurcharge=0;        
        if(this.otherQC.dateRange.length<2 || this.otherQC.dateRange[0].length<10 || this.otherQC.dateRange[1].length<10) {
          var lastMonth=this.getPreMonth();
          this.otherQC.dateRange[0]=lastMonth.firstDay;
          this.otherQC.dateRange[1]=lastMonth.endDay;
        }
        this.otherQC.dateRange[0]+=(this.otherQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.otherQC.dateRange[1]+=(this.otherQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        var _this=this;
        this.otherQC.conditions='OtherSaleForReport';
        this.$axios({
              method: 'post',
              url: 'getOrders.php',
              data: qs.stringify(_this.otherQC)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '没有符合条件的待核单记录',
                type: 'info',
                duration: 2000
              });
              return;
            }
            _this.otherSaleData=response.data;
            _this.otherSaleData.forEach(function(item,index,array){
              var ar=_this.clients.find((ele) => ele['id'] == item.id_contacter);
              item.id_contacter=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.projects.find((ele) => ele['id'] == item.id_prjct_belongto);
              item.id_prjct_belongto=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.products.find((ele) => ele['id'] == item.id_product);
              item.id_product=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.employees.find((ele) => ele['id'] == item.id_operater);
              item.id_operater=typeof(ar)=='undefined'?'':ar['name'];
              // var ar=_this.cars.find((ele) => ele['id'] == item.id_equipment);
              // item.id_equipment=typeof(ar)=='undefined'?'未知车辆':ar['alias'];
            });
            _this.other_json_data=[];
            _this.other_json_fields={};
            _this.other_json_data=_this.otherSaleData;
            _this.other_filename='其它销售报表';
            for(var prop in _this.other_volName) {
              _this.other_json_fields[prop]=_this.other_volName[prop];
            }
            _this.other_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
            for(var i=0;i<_this.otherSaleData.length;i++) {
              _this.totalOtherAmount+= Number(_this.otherSaleData[i]['actual_price']);
              _this.totalOtherSurcharge+=Number(_this.otherSaleData[i]['surcharge']);
            }
          }).catch(function (error) {
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
                duration: 4000
            });
          });         
      }   
    },
    watch:{
      'veclQC.id_car':{
        handler: function() {
          if(this.veclQC.id_car==0){
            this.canNotSelectDriver=false;
          } else {
            this.canNotSelectDriver=true;
            this.veclQC.id_driver=0;
          }
        },
        immediate: true
      },
      'veclQC.id_driver':{
        handler: function() {
          this.canSelectCar=this.veclQC.id_driver==0?false:true;
          this.veclQC.id_car=0;
        },
        immediate: true
      },      
      'veclQC.isReceivedFee':{
        handler: function() {
          var t=this.veclQC.isFilledInvoice;
          this.veclQC.isFilledInvoice=this.veclQC.isReceivedFee!=0?2:t;
        },
        immediate: true
      },      
    },
    computed: {
      getOutboundedDate() {
        return function (dataRow) {
          return dataRow.date_outbound?dataRow.date_outbound:'未出库';
        }
      },
      getNum_clct(){
        return function (dataRow) {
          return dataRow.num_collection=='19990101000'?'':dataRow.num_collection;
        }        
      }
    },
    beforeCreate () {
      var _this = this;
      var queryContent={};

      this.clients=[];
      this.$axios({
            method: 'post',
            url: 'getContacters.php'
        }).then(function (response) {
          _this.clients=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
             duration: 4000
          });
        });                    
      this.clientDepartments=[];
      this.$axios({
            method: 'post',
            url: 'getClntDptmt.php'
        }).then(function (response) {
          _this.clientDepartments=response.data;
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
.tab-content {
  margin: 5px auto;
}
.tab-content input,.tab-content .datepicker,.tab-content select,.tab-content button {
  margin-right: 5px;
}
.row {
  margin-bottom: 2px;
}
.tip {
  font-size: 18px;
  color: #007bff;
}
</style>
