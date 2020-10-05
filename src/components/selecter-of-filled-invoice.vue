<template>
<div class="father">
  <h5>当前位置:发票业务/清单明细</h5>
  <div id="requestInvoice" class="container-fluid">
    <div class="row form-inline">
      <label for="queryConditions">关键词:</label>
      <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="用车人,单位,项目等搜索关键词">
      <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="填开发票时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="填开发票的时间范围"></datepicker>
      <button class="btn btn-primary btnSearch" @click="getListOfInvoiceDetailsFromDBS">🔍获取数据</button>
	  </div>  	
  </div>
  <div class="divfortable" v-if="listOfInvoiceDetailsFromDBS.length>0">
    <table class="table table-hover">
      <thead>
        <th v-for="(title,index) in recordersTitle" :width="widthOfTH[index]">{{title}}</th>
      </thead>
      <tbody @click="clickedARecorderToShowDetails">
        <tr v-for="row in listOfInvoiceDetailsFromDBS">
          <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
	
</div>
</template>

<script>
import datepicker from 'vue2-datepicker';
import qs from 'qs';
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
      return{
      	shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          typeOfDetails:'filled'
        },
        listOfInvoiceDetailsFromDBS:[],
        widthOfTH:[],
        recordersTitle:[],
        widthOfTH:['5%','11%','8%','6%','8%','10%','7%','12%','6%','7%','5%','11%','4%']
      }//
    },
    components: {
      datepicker
    },    
    methods:{
      getListOfInvoiceDetailsFromDBS() {
     	
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }      	
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'getListOfFilledInvoiceWithoutCanceled.php',
            data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(_this.listOfInvoiceDetailsFromDBS.length>0) {
            _this.listOfInvoiceDetailsFromDBS=[];
            _this.recordersTitle=[];
          }         	
// console.log(_this.queryContent.typeOfDetails);
          if(response.data.length<1) {
              _this.$toast({
                 text: '找不到符合条件的开票记录',
                 type: 'info',
                  duration: 2000
              });
              return;
          } 
          for(var ttl in response.data[0]) {
            _this.recordersTitle.push(ttl);
          }
          _this.listOfInvoiceDetailsFromDBS = response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      },
      clickedARecorderToShowDetails(e) {
      	var listInTheID=[];
        var el=e.toElement.parentElement;
        var queryCondition={
        	id_fill_invoice:el.children[0].innerHTML
        }
        //根据获取到的开票ID到Orders中查询,获取详细数据到listInTheID
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'getDetailsAtIdOfFillInvoice.php',
            data:qs.stringify(queryCondition)
        }).then(function (response) {
          listInTheID = response.data;
          _this.$router.push({name:'invoices_details',params:{data: listInTheID}});
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger!',
            duration: 4000
          });
        });        
      }
    }
  }	
</script>

<style scoped>
.table table-hover {
  font-size: 12px;
}
.datepicker {
  margin-left: 10px;
}
</style>

