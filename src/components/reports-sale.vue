<template>
<div class="father"><!-- pills -->
  <ul class="nav nav-tabs" role="tablist">
  	<li class="nav-item">
  	  <a class="nav-link active" data-toggle="tab" role="tab" href="#anyPruductTypeSale">销售报表</a>
  	</li>
  </ul>
  <div class="tab-content">
    <div id="anyPruductTypeSale" class="container-fluid tab-pane active"><!--   -->
      <div class="row">
        <div class="form-inline" v-if="anySaleData.length<1">
          <datepicker class="datepicker" id="dateRange" v-model="anyQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="业务发生的时间,默认上个月" :shortcuts="shortcuts" placeholder="发生业务的时间范围">
          </datepicker>
          <select class="form-control" v-model="anyQC.id_project" title="选择所属项目" style="max-width:200px;">
            <option value="0">所有项目</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="anyQC.id_prdctType" title="选择产品类别" style="max-width:200px;">
            <option value="0">所有品类</option>
            <option value="1">会议相关</option>
            <option value="2">车辆相关</option>
            <option value="3">交通票务</option>
            <option value="4">旅游相关</option>
            <option value="5">酒店相关</option>
            <option value="6">礼品相关</option>
          </select>
          <select class="form-control" v-model="anyQC.id_eqpmt" title="选择所用车辆" :disabled="canSelectEqpmt">
            <option value="0">所有设备</option>
            <option v-for="item in eqpmt" :value="item.id">{{item.alias}}</option>
          </select>
          <select class="form-control" v-model="anyQC.id_operator" title="选择出车司机" :disabled="canNotSelectDriver">
            <option value="0">所有执行人</option>
            <option v-for="item in employees" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="anyQC.clntDptmt_short_name" title="客户所在单位">
            <option value="0">所有单位</option>
            <option v-for="item in clientDepartments">{{item.short_name}}</option>
          </select>
          <select class="form-control" v-model="anyQC.id_client" title="选择订车人">
            <option value="0">所有客户</option>
            <option v-for="item in clients" :value="item.id">{{item.name}}</option>
          </select>
          <select class="form-control" v-model="anyQC.isFilledInvoice"  title="是否已开票">
            <option value="0">未开票</option>
            <option value="1">已开票</option>
            <option value="2">开票状态</option>
          </select>
          <select class="form-control" v-model="anyQC.isReceivedFee" title="是否已回款">
            <option value="0">未回款</option>
            <option value="1">已回款</option>
            <option value="2">回款状态</option>
          </select>                    
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getAnySlData">搜索数据</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="anySaleData.length>0">
        <span class="tip">
          共{{anySaleData.length}}笔。
          销售总额:{{totalSlAmount.toFixed(2)}}元。
          停车总额：{{totalSlPark_fee.toFixed(2)}}元。
          垫付总额：{{totalSlSurcharge.toFixed(2)}}元。
          已收总额：{{totalSlSurcharge.toFixed(2)}}元。
        </span>
        <jsonexcel class="btn btn-primary" :data="sale_json_data" :fields="sale_json_fields" :name="sale_filename" worksheet="销售报表">存为Excel</jsonexcel>
        <button class="btn btn-secondary" type="button" @click="anySaleData=[]">清空</button>
      </div>
      <div class="divfortable" v-if="anySaleData.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in saleTitles" :width="saleWidths[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in anySaleData">
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
              <td title='收款ID'>{{row.amount_received}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>  	
  <div id="loading" class="loadingbox" v-show="showLoading">
    <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
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
        imgUrl:require('@/assets/images/loading.gif'),
        showLoading:false,
        anyQC:{
          keyWord:'',
          conditions:'',
          dateRange:[],
          id_project:0,
          id_eqpmt:0,
          id_operator:0,
          clntDptmt_short_name:0,
          id_client:0,
          isFilledInvoice:2,
          isReceivedFee:2,
          id_prdctType:0,
        },
        shortcuts:false,
        projects:this.$store.state.projects,
        eqpmt:this.$store.state.equipments,
        products:this.$store.state.products,
        employees:this.$store.state.employees,
        clientDepartments:[],
        clients:[],
        filtedClients:[],
        canNotSelectDriver:true,
        canSelectEqpmt:true,
        anySaleData:[],
        totalSlAmount:0,
        totalSlPark_fee:0,
        totalSlSurcharge:0,
        totalRcvdAmount:0,
        sale_json_data:[],
        sale_json_fields:{},
        sale_filename:'销售报表',
        saleTitles:['客户','客户单位','所属项目','产品','执行人','设备','开始时间','开始地点','结束地点','售价','停车费','垫付','垫付用途','备注信息','已收金额'],
        saleWidths:['5%','8%','8%','10%','5%','6%','6%','6%','6%','8%','7%','7%','6%','6%','6%'],
        sale_volName:{
          '订单ID':'id',
          '客户单位':'cstmr_ognz',
          '客户':'id_contacter',
          '项目':'id_prjct_belongto',
          // '合同号':'id_contract',
          '产品':'id_product',
          // '计价':'id_rule_price',
          // '数量':'quantity',
          '售价':'actual_price',
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
          '已收金额':'amount_received',
        },
      }
    },
    components: {
     datepicker,
     jsonexcel,
    },
    methods:{
      getAnySlData () {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.anySaleData=[];
        this.totalSlAmount=0;
        this.totalSlPark_fee=0;
        this.totalSlSurcharge=0;        
        if(this.anyQC.dateRange.length<2 || this.anyQC.dateRange[0].length<10 || this.anyQC.dateRange[1].length<10) {
          var lastMonth=this.getPreMonth();
          this.anyQC.dateRange[0]=lastMonth.firstDay;
          this.anyQC.dateRange[1]=lastMonth.endDay;
        }
        this.anyQC.dateRange[0]+=(this.anyQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.anyQC.dateRange[1]+=(this.anyQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        var _this=this;
        this.anyQC.conditions='anyProductSoldData';
        console.log(this.anyQC);
        this.$axios({
              method: 'post',
              url: 'getOrders.php',
              data: qs.stringify(_this.anyQC)
          }).then(function (response) {
            console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
            if(response.data.length<1) {
              _this.$toast({
                text: '没有符合条件的记录',
                type: 'info',
                duration: 2000
              });
              return;
            }
            _this.anySaleData=response.data;
            _this.anySaleData.forEach(function(item,index,array){
              var ar=_this.clients.find((ele) => ele['id'] == item.id_contacter);
              item.id_contacter=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.projects.find((ele) => ele['id'] == item.id_prjct_belongto);
              item.id_prjct_belongto=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.products.find((ele) => ele['id'] == item.id_product);
              item.id_product=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.employees.find((ele) => ele['id'] == item.id_operater);
              item.id_operater=typeof(ar)=='undefined'?'':ar['name'];
              var ar=_this.eqpmt.find((ele) => ele['id'] == item.id_equipment);
              item.id_equipment=typeof(ar)=='undefined'?'':ar['alias'];
            });
            _this.sale_json_data=[];
            _this.sale_json_fields={};
            _this.sale_json_data=_this.anySaleData;
            _this.sale_filename='销售报表';
            for(var prop in _this.sale_volName) {
              _this.sale_json_fields[prop]=_this.sale_volName[prop];
            }
            _this.sale_filename+=((new Date()).format("yyyyMMddhhmmss")).toString();
            for(var i=0;i<_this.anySaleData.length;i++) {
              _this.totalSlAmount+= Number(_this.anySaleData[i].actual_price);
              _this.totalSlPark_fee+=Number(_this.anySaleData[i].park_fee);
              _this.totalSlSurcharge+=Number(_this.anySaleData[i].surcharge);
              _this.totalRcvdAmount+=Number(_this.anySaleData[i].amount_received);
            }
          }).catch(function (error) {
            _this.showLoading=false;
            $("body").css("overflow","");
            _this.$toast({text:'通信错误!',type:'danger',duration:2000});
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
    watch:{
      'anyQC.id_eqpmt':{
        handler: function() {
          if(this.anyQC.id_eqpmt==0){
            this.canNotSelectDriver=false;
          } else {
            this.canNotSelectDriver=true;
            this.anyQC.id_operator=0;
          }
        },
        immediate: true
      },
      'anyQC.id_operator':{
        handler: function() {
          this.canSelectEqpmt=this.anyQC.id_operator==0?false:true;
          this.anyQC.id_eqpmt=0;
        },
        immediate: true
      },      
      'anyQC.isReceivedFee':{
        handler: function() {
          var t=this.anyQC.isFilledInvoice;
          this.anyQC.isFilledInvoice=this.anyQC.isReceivedFee!=0?2:t;
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
             text: '通信错误!'+error,
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
             text: '通信错误!'+error,
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
