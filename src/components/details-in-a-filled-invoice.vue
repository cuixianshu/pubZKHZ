<template>
  <div class="father">

    <div class="list-of-details" v-if="listOfData.length>0" ref="print">
      <h4>发票明细单</h4>
      <span>(开票ID:{{idOfFilling}}&nbsp;&nbsp;开票日期: {{dateOfFilled}}&nbsp;&nbsp;发票号:{{numberOfInvoice}})</span>
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfData" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody><!--  @click="clickedARecorderToModify" -->
          <tr v-for="row in listOfData">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
          <tr class="total">
          	<td></td><td></td><td></td><td></td><td></td><td></td><td>合计</td><td>{{totalAmount}}</td><td>{{totalParkFee}}</td>
          </tr>
        </tbody>
      </table>
    </div>
	<download-excel class="btn btn-primary" :data="json_data" :fields="json_fields" :name="filename" worksheet="发票明细">存为Excel</download-excel>    
    <button class="btn btn-primary print" @click="doPrint()">打印</button>    
  </div>
</template>

<script>
import Print from '@/plugs/print';
import JsonExcel from 'vue-json-excel';
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
};
Vue.use(Print);
  export default {
  	data () {
  	  return {
  	  	listOfData:[],
  	  	titleOfData:[],
  	  	numberOfInvoice:'',
  	  	idOfFilling:'',
  	  	totalAmount:0,
  	  	totalParkFee:0,
  	  	widthOfTH:['6%','16%','14%','14%','15%','15%','6%','8%','6%'],
        json_data:[],
        json_fields:{},
        filename:'DetailsInInvoice',
        dateOfFilled:''
  	  }
  	},
    components: {
     'downloadExcel':JsonExcel
    },  	
  	methods: {
      getParams() {
        // 取到路由带过来的参数params
        if(Object.keys(this.$route.params).length==0){
          this.$router.push('/selecterOfFilledInvoice');        
          return false;          
        }
        this.listOfData = this.$route.params.data;
        this.numberOfInvoice=this.listOfData[0]['发票号'];
        this.idOfFilling=this.listOfData[0]['开票ID'];
        this.dateOfFilled=this.listOfData[0]['开票日期'];
        for(var i=0;i<this.listOfData.length;i++) {
           delete this.listOfData[i]['发票号'];
           delete this.listOfData[i]['开票ID'];
           delete this.listOfData[i]['开票日期'];
           this.totalAmount+=parseFloat(this.listOfData[i]['金额']);
           this.totalParkFee+=parseFloat(this.listOfData[i]['停车费']);
        }
        for(var ttl in this.listOfData[0]) {
          this.titleOfData.push(ttl);
        }
        this.json_data=this.listOfData;
        for(var i=0;i<this.titleOfData.length;i++ ){
          this.json_fields[this.titleOfData[i]]=this.titleOfData[i];  
        }
        this.filename+=((new Date()).format("yyyyMMddhhmmss")).toString(); 
     
      
      },
      doPrint() {
        this.$print(this.$refs.print);
      }      
    },
    created() {
       this.getParams();
    },
    mounted() {
    },
    beforeMount: function () {
    },
    updated: function () {
    },
    beforeDestroy: function () {
    }    
  }	
</script>

<style scoped>
.father,.list-of-details {
  width: 100%;
  text-align: center;
}
@page {
  size: landscape; 
}
table {
  overflow: auto;
  font-size: 16px;
}
/*.table table-hover {
  font-size: 12px;
}*/
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
.total {
  font-size: 18px;
  font-weight:bolder;
}
.print{
  width: 100px;
}

</style>