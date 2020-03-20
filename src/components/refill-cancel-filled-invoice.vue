<template>
  <div class="father">
    <h5>当前位置:发票业务/作废重开</h5>
    <div id="queryOfFilledInvoice" class="container-fluid">
      <div id="searchConditions"  class="form-group form-inline">
        <label for="queryConditions">关键词:</label>
        <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="用车人,单位,项目等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="填开发票的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="填开发票的时间范围"></datepicker> 
        <button class="btn btn-primary" @click="getRecordersFromFilledInvoice">🔍获取数据</button>
      </div>
    </div>
    <div class="showerOfFilledInvoice" v-if="dataOfFilledInvoiceFromDBS.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titlesOfData" :width="widthOfTH[index]">{{title}}</th>
          <!-- <th><input class="checkbox" type="checkbox" @click=""></th> -->
        </thead>
        <tbody @click="clickedARowInShower">
          <tr v-for="row,index in dataOfFilledInvoiceFromDBS">
            <td v-for="vlu in row" :title="vlu">{{vlu}}</td>
            <!-- <td><input class="checkbox" type="checkbox"  name="selecter" @click=""></td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="invoiceModifyer" role="dialog" aria-labelledby="invoiceModifyer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span><h5>作废发票</h5></span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
          	<h6>开票ID:{{idOfFilledInvoice}},发票号:{{numberOfInvoice}}</h6>
          	<h6>此发票将被作废，但开票申请会被保留。</h6><h6>您确定要作废此发票吗？</h6>
            <div>
              <label for="inputWhyCanceled">作废原因</label>
              <input id="inputWhyCanceled" type="text" name="whyCanceled" v-model="whyCanceled" title="作废原因,不少于4个字" placeholder="请填写作废原因">
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>  
            <button type="button" id="btnSaveTheChangedData" @click="saveTheChangedData" class="btn btn-primary">确定</button>
          </div>           
        </div>
      </div>
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
      return {
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
        },
        titlesOfData:[],
        widthOfTH:['5%','11%','8%','6%','8%','10%','7%','12%','6%','7%','5%','11%','4%'],
        dataOfFilledInvoiceFromDBS:[],
        idOfFilledInvoice:'',
        numberOfInvoice:'',
        currentUser:1,
        whyCanceled:''
      }
    },
    components: {
     datepicker
    },    
    methods: {
      getRecordersFromFilledInvoice() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }      	
        var _this = this;
        this.dataOfFilledInvoiceFromDBS=[];
        this.titlesOfData=[];
        this.$axios({
          method: 'post',
          url: 'getListOfFilledInvoiceWithoutCollectedAndWithoutCanceled.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                 text: '找不到符合条件的记录!',
                 type: 'info',
                  duration: 1000
              });
            } else {
              _this.dataOfFilledInvoiceFromDBS=response.data;
              for(var title in response.data[0]) {
                _this.titlesOfData.push(title);
              }              
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
      clickedARowInShower(e) {
        var el=e.toElement.parentElement;
        this.idOfFilledInvoice=el.children[0].innerHTML;
        this.numberOfInvoice=el.children[1].innerHTML;
        $('#invoiceModifyer').modal('toggle');
      },
      saveTheChangedData() {
console.log(this.dataOfFilledInvoiceFromDBS[0]['ID']);      	
        var _this = this;
      	if(this.whyCanceled.length<4) {
          this.$toast({
             text: '请填写作废原因!',
             type: 'danger',
              duration: 2000
          });
          return false;
      	}
        var queryContent={id:this.idOfFilledInvoice,id_canceled_by:this.currentUser,other:this.whyCanceled};
        this.$axios({
          method: 'post',
          url: 'updateFilledInvoiceWithCanceledData.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
  // console.log(response.data);
            if(response.data===true) {
              $('#invoiceModifyer').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
              for(var i=0;i<_this.dataOfFilledInvoiceFromDBS.length;i++) {
              	if(_this.dataOfFilledInvoiceFromDBS[i]['ID']==_this.idOfFilledInvoice) {
              	  _this.dataOfFilledInvoiceFromDBS.splice(i,1);
              	  i--;	
              	}
              }
            } else {
              _this.$toast({
                 text: '操作失败,请稍后再试!',
                 type: 'danger',
                  duration: 4000
              });
              $('#invoiceModifyer').modal('toggle');           	
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
                duration: 4000
            });
            $('#invoiceModifyer').modal('toggle');
          });        
      }
    },
    beforeCreate:function() {

    }    
  }	
</script>

<style scoped>
.father {
  width: 100%;
}
#searchConditions >*{
  margin:5px 5px;
}		
h5 {
  color: #007bff;
}
datepicker {
  margin-left: 10px;	
}
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
table {
  overflow: auto;
  font-size: 14px;
}
</style>

