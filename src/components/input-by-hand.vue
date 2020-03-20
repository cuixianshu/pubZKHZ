<template>
  <div class="father">
	<h5>当前位置:订单管理/手工输入</h5>
	<div id="manualInputPane" class="container-fluid">
	  <div id="firstRow"class="row">
	    <div id="booker" class="col-md-3 form-inline">
	      <label for="slctBooker" class="require">*客户</label>
	      <select id="slctBooker" type="text" name="slctdBooker" class="form-control" placeholder="请选择客户" v-model="newOrder.slctdBooker" title="选择姓名单位电话" required>
	          input
	        <option v-for="booker in customers">{{booker.mix_name}}</option>
	      </select>
	    </div>
	    <div id="project" class="col-md-3 form-inline">
	      <label for="slctProject" class="require">*项目</label>
	      <select id="slctProject" type="text" name="neworderprjct" class="form-control" placeholder="所属项目" v-model="newOrder.prjct" title="选择此单所属项目" required>
	        <option v-for="proj in projects">{{proj.prjct}}</option>
	      </select>
	    </div>
	    <div id="product" class="col-md-3 form-inline">
	      <label for="slctNameOfPrdct" class="require">*产品</label>
	      <select id="slctNameOfPrdct" type="text" name="productName" class="form-control" placeholder="产品名称" v-model="newOrder.productName" title="销售的产品名称" required>
	        <option v-for="item in namesOfPrdctInSelect">{{item.name}}</option>
	      </select>
	    </div>
	    <div id="divNumOfContract" class="col-md-3 form-inline">
	      <label for="inputNumOfContract">合同</label>
	      <input id="inputNumOfContract" type="text" name="numOfContract" class="form-control" placeholder="合同编号" v-model="newOrder.numOfContract" title="合同编号" required>
	    </div>          
	  </div>
	  <div id="secondRow" class="row">
		<div id="divCount" class="col-md-3 form-inline">
		  <label for="inputCount" class="require">*数量</label>
		  <input id="inputCount" type="number" name="quantity" class="form-control" placeholder="销售数量" v-model="newOrder.quantity" title="销售数量,必须大于 0" required>
		</div>
	    <div id="salePrice" class="col-md-3 form-inline">
	      <label for="inputsalePrice" class="require">*售价</label>
	      <input id="inputsalePrice" type="number" name="newordersalePrice" class="form-control" placeholder="销售价格" v-model="newOrder.salePrice" title="销售价格,必须大于 0" required>
	    </div>
	    <div id="startPoint" class="col-md-3 form-inline">
	      <label for="inptStartPoint" class="require">*起点</label>
	      <input id="inptStartPoint" type="text" name="neworderstartPoint" class="form-control" placeholder="举办或出发地点" v-model="newOrder.startPoint" title="举办或出发地点" required>
	    </div>
	    <div id="adtnlFee" class="col-md-3 form-inline">
	      <label for="inputAdtnlFee">附费</label>
	      <input id="inputAdtnlFee" type="number" name="adtnlFee" class="form-control" placeholder="附加费用金额" v-model="newOrder.adtnlFee" title="代垫代付或附加费用">
	    </div>                    
                    
	  </div>
	  <div id="thirdRow" class="row">
        <div id="startDate" class="col-md-3 form-inline">
          <label class="require">*开始</label>
	      <datepicker class="datepicker-in-neworder" id="dtpkrStartDate" v-model="newOrder.startDate" type="datetime"  format="YYYY-MM-DD HH:mm" title="举办或开始的时间" :minute-step="5" placeholder="举办或开始的时间" append-to-body width="160">
	      </datepicker>
	    </div>
	    <div id="endDate" class="col-md-3 form-inline">
	      <label class="require">*结束</label>
	      <datepicker class="datepicker-in-neworder" id="dtpkrEndDate" v-model="newOrder.endDate" type="datetime"  format="YYYY-MM-DD HH:mm" title="结束时间" :minute-step="5" append-to-body width="160"></datepicker>
	    </div>
	    <div id="endPoint" class="col-md-3 form-inline">
	      <label for="inptEndPoint" class="require">*终点</label>
	      <input id="inptEndPoint" type="text" name="neworderendPoint" class="form-control" placeholder="终到或结束地点" v-model="newOrder.endPoint" title="结束地点">
	    </div>
	    <div id="divNameOfPrdct" class="col-md-3 form-inline">
	      <label for="inputUseOfAdtnl">用途</label>
	      <input id="inputUseOfAdtnl" type="text" name="useOfAdtnl" class="form-control" placeholder="附加费的用途" v-model="newOrder.useOfAdtnl" title="代垫代付或附加费用的用途">         
	    </div>
	  </div>
	  <div id="fourthRow" class="row">
		<div id="op" class="col-md-3 form-inline">
		  <label for="slctOp" class="require">*执行</label>
	      <select id="slctOp" type="text" name="slctOp" class="form-control" placeholder="执行人" v-model="newOrder.op.nmMbl" title="请选择执行人">
	        <option v-for="op in ops">{{op.nmMbl}}</option>
	      </select>
		</div>    		  	
		<div id="adtnlEquipment" class="col-md-3 form-inline">
		  <label for="slctEquipment" class="require">*设备</label>
		  <select id="slctEquipment" type="text" name="neworderequipment" class="form-control" placeholder="所用设备" v-model="newOrder.equipment.nmNmbr" title="执行时所用设备器具或装备">
	        <option v-for="equipment in equipments">{{equipment.nmNmbr}}</option>
	      </select>
		</div>    		  	
	    <div id="payer" class="col-md-3 form-inline">
	      <label for="slctPayer" class="require">*结算</label>
	      <select id="slctPayer" type="text" name="slctdPayer" class="form-control" placeholder="请选择结算人信息" v-model="newOrder.slctdPayer" title="请选择结算人" required>
	        <option v-for="payer in customers">{{payer.mix_name}}</option>
	      </select>
	    </div>
		<div id="mem" class="col-md-3 form-inline">
		  <label for="inputMem">备注</label>
		  <input id="inputMem" type="text" name="neworder_mem" class="form-control" placeholder="备注说明" v-model="newOrder.mem" title="其它需要说明的事项">
		</div>    		  	
	  </div>
	  <div id="fivthRow" class="row">
	    <div class="col-lg">
	      <label  class="tips">* 为必填或必选项;附费 和 用途 必须保持一致</label>
	    </div>
	    <div class="col-lg">
	    </div>
		<div class="col-lg">
		  <button class="btn btn-secondary clearBtn" @click="clearNewSaleDataForm">清空</button>
		  <button class="btn btn-primary saveBtn" @click="saveNewOrderToDBS">保存</button>
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
  	data () {  
	  return {
        newOrder: {
          slctdBooker:'',
          productName:'',
          prjct:'',
          numOfContract:'',
          quantity:1,
          salePrice:'',
          adtnlFee:'',
          useOfAdtnl:'',
          startDate:'',
          endDate:'',
          startPoint:'',
          endPoint:'',
          op:{nmMbl:'',id:''},//
          equipment:{nmNmbr:'',id_responsible:''},//
          slctdPayer:'',
          mem:''
        },
        customers:[],
        projects:[],
        equipments:[],
        namesOfPrdctInSelect:[],
        ops:[],
        // elWidth:$("#slctBooker").height()
      }
    },
    components: {
     datepicker
    },    
    methods: {
      clearNewSaleDataForm () {
        $("#manualInputPane input,select").val("");
      },
      saveNewOrderToDBS:function () {
        var en_zhTranslate={
          slctdBooker:'客户',
          productName:'产品',
          prjct:'项目',
          numOfContract:'合同',
          quantity:'数量',
          salePrice:'售价',
          adtnlFee:'附费',
          useOfAdtnl:'用途',
          startDate:'开始',
          endDate:'结束',
          startPoint:'起点',
          endPoint:'终点',
          op:'执行',//
          equipment:'设备',//
          slctdPayer:'结算',
          mem:'备注'          
        }
        //允许为空的属性
        var allowSpaceProps=['numOfContract','adtnlFee','useOfAdtnl','mem'];
        //有未填写项目
        for(var prop in this.newOrder) {
          if((!this.newOrder[prop] || this.newOrder[prop]<=0) && !allowSpaceProps.includes(prop)) {
            this.$toast({
               text: en_zhTranslate[prop]+'是必填项或必选项',
               type: 'danger',
                duration: 1500
            });
            return;
          } else {
            if(!this.newOrder.op.nmMbl) {
              this.$toast({
                 text: '执行 是必选项',
                 type: 'danger',
                  duration: 1500
              });
              return;              
            }
            if(!this.newOrder.equipment.nmNmbr) {
              this.$toast({
                 text: '设备 是必选项',
                 type: 'danger',
                  duration: 1500
              });
              return;              
            }
          }
        }
        if(this.newOrder.adtnlFee>0 && this.newOrder.useOfAdtnl.length<2 ){
          this.$toast({
             text: '附费的用途 不许少于2个字！',
             type: 'danger',
              duration: 1500
          });
          return;
        }
        if(this.newOrder.adtnlFee<=0) {
          this.newOrder.adtnlFee=0;
          this.newOrder.useOfAdtnl='';  
        }
        var _this = this;
        this.$axios({
              method: 'post',
              url: 'insertNewRcdrToTblOrders.php',
              data: qs.stringify(_this.newOrder)
          }).then(function (response) {
            if(response.data===true) {
              _this.$toast({
                 text: '数据已成功保存!',
                 type: 'success',
                 duration: 1000
              });
              //清空数据,为下次输入做准备
              _this.newOrder.slctdBooker='';
              _this.newOrder.productName='';
              _this.newOrder.prjct='';
              _this.newOrder.numOfContract='';
              _this.newOrder.quantity=1;
              _this.newOrder.salePrice='';
              _this.newOrder.adtnlFee='';
              _this.newOrder.useOfAdtnl='';
              _this.newOrder.startPoint='';
              _this.newOrder.endPoint='';
              _this.newOrder.slctdPayer='';
              // _this.newOrder.slctdPayer.op.nmMbl='';
              // _this.newOrder.slctdPayer.op.id='';
              _this.newOrder.equipment.nmNmbr='';
              _this.newOrder.equipment.id_responsible='';
              _this.newOrder.mem='';
              _this.newOrder.startDate='';
              _this.newOrder.endDate='';
              _this.newOrder.numOfContract='';                
            } else {
              console.log(response.data);
              _this.$toast({
                 text: '操作失败:'+response.data,
                 type: 'danger',
                  duration: 8000
              });
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
               text: '异步模块运行错误'+error,
               type: 'danger',
                duration: 8000
            });
          });
      }          	
    },
    beforeCreate:function() {
      //初始化客户option  
      this.customers=[];
      var _this = this;
      this.$axios({
            method: 'post',
            url: 'getCntctrOgnztn.php'
        })
        .then(function (response) {
          _this.customers=response.data;
        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      //初始化项目的option
      this.projects=[];
      this.$axios({
            method: 'post',
            url: 'getProject.php'
        })
        .then(function (response) {
          _this.projects=response.data;
        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      //初始化产品的option   
      this.namesOfPrdctInSelect=[];
      this.$axios({
            method: 'post',
            url: 'getProduct.php'
        })
        .then(function (response) {
          _this.namesOfPrdctInSelect=response.data;

        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });      
      //初始化'执行人'的option   
      this.ops=[];
      this.$axios({
            method: 'post',
            url: 'getEmployees.php'
        })
        .then(function (response) {
          _this.ops=response.data;
        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        }); 
      //初始化'装备'的option equipments   this.effectiveCols 
      this.equipments=[];
      this.$axios({
            method: 'post',
            url: 'getEquipments.php'
        })
        .then(function (response) {
          _this.equipments=response.data;
        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      //初始化必须列   this.effectiveCols 
      this.effectiveCols=[];
      this.$axios({
            method: 'post',
            url: 'getDictionaryOfFeildNames.php'
        })
        .then(function (response) {
          for(var index in response.data) {
            _this.effectiveCols.push(response.data[index].name_in_excel);
          }
        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      //初始化计价器rulesPrice
      this.rulesPrice=[];
      this.$axios({
            method: 'post',
            url: 'getRulesPrice.php'
        })
        .then(function (response) {
          _this.rulesPrice=response.data;
        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });      
    },
    watch: {  
      'newOrder.slctdBooker': {
        handler: function() {
          this.newOrder.slctdPayer=this.newOrder.slctdBooker;
        }
      },
      'newOrder.op.nmMbl': {//'装备'联动于'操作'
        handler: function() {
          // 获取operater的ID
          for(var index in this.ops) {
            if(this.newOrder.op.nmMbl==this.ops[index].nmMbl) {
              this.newOrder.op.id=this.ops[index].id;
            }
          }
          //获取'装备'
          for(var index in this.equipments){
            if(this.equipments[index].id_responsible==this.newOrder.op.id) {
              this.newOrder.equipment.nmNmbr=this.equipments[index].nmNmbr;
              this.newOrder.equipment.id_responsible=this.equipments[index].id_responsible;
            }            
          }
        }
      }
    }        
  }	
</script>

<style scoped>
.father {
  width: 100%;
}
#manualInputPane>div>div {
  padding:0 5px;
}
#manualInputPane>div {
  margin-right:0;
  margin-left:0;
}
#manualInputPane {
  width: 100%;
}
.clearBtn {
	margin-right: 20px;
}

.saveBtn, .clearBtn {
	width: 100px;
}
.row {
  margin-top: 10px;
}
.col-md-3 .form-control {
  width:70%;
}
#fivthRow{
  text-align:right;
}
.mx-input-wrapper {
  width: 100%;
}
.require {
  color: red;
  font-size: 16px;
}
.tips {
  color: red;
  font-size: 16px;
  text-align: left;
}
/*#modal-overlay {
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    width:100%;
    height:100%;
    text-align:center;
    z-index: 1000;
    background-color: #333;
    opacity: 0.5; 
}*/
h5 {
  color: #007bff;
}
</style>
