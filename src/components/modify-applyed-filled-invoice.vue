<template>
<div class="father"> 
	<h5>当前位置:发票业务/开票、变更申请</h5>
    <div id="mdyApldFild" class="container-fluid">
      <div id="searchConditions"  class="row form-inline">
        <label>关键词:</label>
        <input type="text" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="用车人,单位,项目等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="申请开票时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="申请开票的时间范围"></datepicker>
        <button class="btn btn-primary" @click="getRequestedInvoices">🔍获取数据</button>          
        <button class="btn btn-secondary" @click="clearData" v-if="data.length>0">清空</button>
        <button class="btn btn-primary" v-if="data.length>0" @click="fillAnInvoice">填开发票</button>
      </div>
    </div>
    <div v-if="data.length>0" class=""><!--  pre-scrollable -->
      <div id="toolbar">
        <button class="btn btn-danger" disabled>
          <i class="glyphicon glyphicon-remove"></i> Delete
        </button>
      </div> <!-- 注意事件一定要用小写加中横线格式 -->
      <bootstraptable id="mainTable" :columns="columns" :data="data" :options="options" @on-expand-row="onExpandRow" @on-clickRow="onClickRow"></bootstraptable>
    </div>
<!-- <i class="oi oi-account-login"></i> -->
<!-- <font-awesome-icon :icon="['far', 'square']" />
<font-awesome-icon :icon="['fab', 'accessible-icon']" /> -->
<!-- <font-awesome-icon icon="clipboard-list" size="2x" pull="left"/> -->
    <div class="buttons">
<!--       <button class="btn btn-secondary" @click="clearData" v-if="data.length>0">清空</button>
      <button class="btn btn-primary" v-if="data.length>0" @click="fillAnInvoice">填开发票</button> -->
    </div>


    <div class="modal fade" id="modalRqstInvoiceModifyer" role="dialog" aria-labelledby="invoiceModifyer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
            <h5>修改《申请发票》信息,申请ID:{{infoInRequestInvoice.id}}</h5>  
              <button class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">  
            <div class="container-fluid">
              <div class="row">
              	<div class="col-lg  form-inline">
                  <label>项目</label>
                  <select type="text" class="form-control" v-model="infoInRequestInvoice.project" title="所属项目" placeholder="所属项目">
                    <option v-for="proj in listOfProject">{{proj}}</option>
                  </select>
                </div>                
                <div class="col-lg  form-inline">
                  <label>类型</label>
                  <select type="text" class="form-control" v-model="infoInRequestInvoice.type" placeholder="需要的发票类型" title="发票类型">
                    <option v-for="item in listOfInvoiceType">{{item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label>抬头</label>
                  <select type="text" class="form-control" v-model="infoInRequestInvoice.cstmrOgnztnName" placeholder="发票中的单位名称" title="单位名称抬头">
                    <option v-for="item in listOfCustomerOgnztn">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>商品</label>
                  <input type="text" class="form-control" v-model="infoInRequestInvoice.nameOfGoods" title="商品或服务名称,不超过16个字" placeholder="发票中的商品或服务名称,不超过16个字">
                </div>
                <div class="col-lg  form-inline">
                  <label>金额</label>
                  <input type="number" class="form-control" v-model="infoInRequestInvoice.amount" title="开票金额" placeholder="开票金额">
                </div>
                <div class="col-lg  form-inline">
                  <label>出票</label>
                  <select type="text" class="form-control" placeholder="出票公司名称" v-model="infoInRequestInvoice.nameOfOurCmpny" title="出具发票的公司名称">
                    <option v-for="item in listOfOurCompanys">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
              	<div class="col-lg  form-inline">
                  <label>订车</label>
                  <input type="text" class="form-control" v-model="infoInRequestInvoice.booker" title="订车人" placeholder="订车人" readonly>
                </div>                
              	<div class="col-lg  form-inline">
                  <label>申请</label>
                  <input type="text" class="form-control" v-model="infoInRequestInvoice.applyer" title="申请人" placeholder="请选择申请人" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>备注</label>
                  <input type="text" class="form-control" v-model="infoInRequestInvoice.memInRqst" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
              </div>
            </div>
            </div>  
            <div class="modal-footer">  
              <button class="btn btn-secondary" data-dismiss="modal">取消</button>  
              <button @click="saveModifyedInfo" class="btn btn-primary">保存数据</button>
            </div>  
        </div>  
      </div>  
    </div>
    <div class="modal fade" id="confirmDeleteARowInSubTable" role="dialog" aria-labelledby="deleteARowInSubTable" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
          	<h5>在发票申请单中删除订单</h5>
          </div>
          <div class="modal-body">
          	<h5>订单(ID:{{tmpBSTable.row.ID}})将从发票申请单中删除,您确定吗?</h5>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>  
            <button @click="deleteARowInSubTable" class="btn btn-primary">确定</button>            
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="confirmDeleteARowInMainTable" role="dialog" aria-labelledby="deleteARowInMainTable" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
          	<h5>删除发票申请单</h5>
          </div>
          <div class="modal-body">
          	<h5>发票申请单(ID:{{tmpBSTable.row.ID}})<br/>将在系统中被删除,您确定吗?</h5>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>  
            <button @click="deleteARowInMainTable" class="btn btn-primary">确定</button>            
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="invoiceFiller" role="dialog" aria-labelledby="invoiceFiller" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
            <span class="form-inline"><h5>发票填开</h5>-----已选中记录的合计金额：￥{{amountOfSelectedRcdrs}}</span>  
              <button class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">  
<!--             <div class="showSelectedList">
              <table class="tblForSelectedList">
                <thead>
                  <th v-for="title,index in headerOfList" :width="widthOfTH[index]">{{title}}</th>
                </thead>
                <tbody>
                  <tr v-for="row in listOfSelectedRecorders">
                    <td v-for="vlu in row">{{vlu}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr> -->
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>出票</label>
                  <input type="text" class="form-control" placeholder="出票公司名称" v-model="detailsOfFilling.nameOfOurCmpny" title="出具发票的公司名称" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>类型</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.type" placeholder="需要的发票类型" title="发票类型" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>抬头</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.cstmrOgnztnName" placeholder="发票中的单位名称" title="单位名称抬头" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label>商品</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.nameOfGoods" title="商品或服务名称,不超过16个字" placeholder="发票中的商品或服务名称,不超过16个字" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>金额</label>
                  <input type="number" class="form-control" v-model="detailsOfFilling.amount" title="开票金额" placeholder="开票金额" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label>备注</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.memInRqst" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字" readonly>
                </div>
              </div>
              <hr class="hr">
              <div class="row">
              	<div class="col-lg  form-inline">
                  <label>号码</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.numberOfInvoice" title="发票号码,不少于8且不超过128个字" placeholder="发票号码,不少于8且不超过128个字">
                </div>
              	<div class="col-lg  form-inline">
                  <label>凭证</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.imageOfInvoice" title="凭证图片,2M" placeholder="凭证图片,2M">
                </div>                
              	<div class="col-lg  form-inline">
                  <label>备注</label>
                  <input type="text" class="form-control" v-model="detailsOfFilling.memForFilling" title="开票备注,不超过64个字" placeholder="开票备注,不超过64个字">
                </div>                
              </div>
            </div>
            </div>  
            <div class="modal-footer">  
              <button class="btn btn-secondary" data-dismiss="modal">取消</button>  
              <button @click="saveFilledInvoiceData" class="btn btn-primary">保存数据</button>
            </div>  
        </div>  
      </div>  
    </div> 
</div>
</template>

<script>
//2019-12-31
import 'bootstrap-table/dist/bootstrap-table.min.css'
import 'bootstrap-table/dist/bootstrap-table.min.js'
import 'bootstrap-table/dist/bootstrap-table-vue.min.js'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js'
import bootstraptable from 'bootstrap-table/dist/bootstrap-table-vue.esm.min.js'
import '@icon/open-iconic/open-iconic.css'
//2019-12-31
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
		  queryContent:{
            keyWord:'',
            dateRange:[],
            typeOfQuery:'requested'
          },
          shortcuts:false,
          // rspData:[],
          headerOfList:[],
          widthOfTH:['3%','6%','7%','9%','7%','8%','13%','7%','6%','6%','12%','8%','8%'],
          infoInRequestInvoice:{
          	id:'',
          	nameOfOurCmpny:'',
          	type:'',
          	cstmrOgnztnName:'',
          	nameOfGoods:'',
          	amount:'',
          	memInRqst:'',
            applyer:'',
            project:'',
            booker:''
          },
          columns:[],
          data: [],
          options: {
            search: false,
            showColumns: true,
            detailView:true,
            sortable: true,
            sortOrder: "asc",
            showRefresh: false,
            clickToSelect: false,
            singleSelect: false,
            showToggle:true,
            toolbar:'#toolbar',
            iconsPrefix: 'oi',
            icons:{//定义工具栏，分页和详细信息视图中使用的图标  ,以下图标字体:font-family: "open-iconic";  
              paginationSwitchDown: 'oi-arrow-thick-right',
              paginationSwitchUp: 'oi-arrow-thick-left',
              refresh: 'oi-reload',
              toggleOff: 'oi-chevron-left',
              toggleOn: 'oi-chevron-bottom',
              columns: 'oi-list',
              detailOpen: 'oi-plus',
              detailClose: 'oi-minus',
              fullscreen: 'oi-fullscreen-enter'
            }
          // iconSize:'undefined'           
          },
          amountOfSelectedRcdrs:1232432,
          detailsOfFilling: {
            nameOfOurCmpny:'',
            idOfOurCmpny:0,
            type:'普票增值税',
            cstmrOgnztnName:'',
            idOfCstmrOgnztn:0,
            nameOfGoods:'',
            amount:0,
            memInRqst:'',
            listOfIDS:[],
            numberOfInvoice:'',
            memForFilling:'',
            imageOfInvoice:'',
            idOfFiller:this.$store.state.user.id_user
          },
          tmpBSTable:{
          	table:{},
          	tableData:{},
          	event:{},
          	value:'',
          	row:{},
          	index:''
          },
          parentRow:{},
          listOfOurCompanys:this.$store.state.ourCompanies,
          listOfInvoiceType:this.$store.state.typesOfInvoices,
          listOfCustomerOgnztn:this.$store.state.clntParentOgnztns,
          listOfCstmrOgnztnFullName:[],
          listOfProject:this.$store.state.projects,
          clonedDetailsOfFilling:''

		}
	},
    components: {
      datepicker,
      bootstraptable
    },	
	methods: {
	  getRequestedInvoices () {
        if(this.detailsOfFilling.nameOfOurCmpny==='' && this.detailsOfFilling.cstmrOgnztnName==='' && this.detailsOfFilling.amount===0){
          this.clonedDetailsOfFilling=JSON.stringify(this.detailsOfFilling);
        }
        this.detailsOfFilling=JSON.parse(this.clonedDetailsOfFilling);	  	
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }
        this.queryContent.conditions="NotFilled";
        var _this = this;
        var rqstPage='';
          rqstPage='getRequestedInvoices.php';
        this.$axios({
          method: 'post',
          url: rqstPage,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
      	if(response.data.length>0){
          _this.data = response.data;
          _this.columns=[];
          for(var title in response.data[0]) {
            _this.columns.push({title:title,field:title});
          }
          _this.columns.unshift({checkbox: true});
        _this.columns.push({
            title:'操作',
　　　　　      field:'opreation',
            aligin:'center',
            formatter:function(value,row,index,field){
              return[
              //  class="btn btn-info"  class="btn btn-danger<span id="btn_edit" title="修改"></span><i class="oi oi-pencil">"<i class="oi oi-pencil"><i class="oi oi-trash">
                '<button id="btn_edit" title="修改" style="border:2px solid #007bff ;color:#FFF;width:25px;background-color:#007bff;margin-right:5px;border-radius:3px;">改</button><button id="btn_delete" title="删除" style="border:2px solid #dc3545 ;color:#FFF;width:25px;background-color:#dc3545;border-radius:3px;">删</button>'
                // '<button id="btn_edit" class="btn btn-info"  title="修改"><i class="oi oi-pencil"></i></button>',
                // '<button id="btn_delete" class="btn btn-danger" title="删除"><i class="oi oi-trash"></i></button>'
              ];
            },
            events:{
              //触发#btn_edit这个按钮的点击事件data-toggle="modal" data-target="#modalRqstInvoiceModifyer"
              'click #btn_edit':function(event,value,row,index){
                 _this.infoInRequestInvoice.id=row.ID;
                 _this.infoInRequestInvoice.nameOfOurCmpny=row.出票公司;
                 _this.infoInRequestInvoice.cstmrOgnztnName=row.发票抬头;
                 _this.infoInRequestInvoice.type=row.类型;
                 _this.infoInRequestInvoice.nameOfGoods=row.商品名称;
                 _this.infoInRequestInvoice.amount=row.金额;
                 _this.infoInRequestInvoice.memInRqst=row.备注;
                 _this.infoInRequestInvoice.applyer=row.申请人;
                 _this.infoInRequestInvoice.project=row.项目;
                 _this.infoInRequestInvoice.booker=row.订车人;
                 $("#modalRqstInvoiceModifyer").modal("toggle");
               },
　　　　　　　      //触发#btn_detele这个按钮的点击事件
               'click #btn_delete':function(event,value,row,index){
                 _this.tmpBSTable.row=row;
                 $('#confirmDeleteARowInMainTable').modal('toggle');
               }
            }

        });


      	} else {
          _this.$toast({
            text: "没有记录符合搜索条件",
            type: 'info',
            duration: 1000
          });        		
      	}
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          console.log(error);
        });
	  },
	  clearData () {
        // this.rspData=[];
        this.data=[];
        this.detailsOfFilling=JSON.parse(this.clonedDetailsOfFilling);
	  },
	  onExpandRow: function (index, row, $detail) {
// console.log('row');
	  	this.expandTable(index, row, $detail);
      },
      expandTable(index, row, $detail) {
        var _this = this;
        var rqstPage='';
        var subTalbeColumns=[];
        var subTableData=[];
        var keyWord={keyWord:row.ID};
        var queryContent={};
        queryContent.keyWord=row.ID;
        queryContent.conditions="ByRqstIDAndNotFilledInvoice";
        rqstPage='getOrders.php';
        this.$axios({
          method: 'post',
          url: rqstPage,
          data: qs.stringify(queryContent)
        }).then(function (response) {
// console.log(response.data);
// return;
      	if(response.data.length>0){
          subTableData = response.data;
          for(var title in response.data[0]) {
          	subTalbeColumns.push({title:title,field:title});
          	// subTalbeColumns.push({'visible': false});
          }
        subTalbeColumns.push({
          title:'操作',
　　　　　    field:'opreation',
          // aligin:'center',
          formatter:function(valueInSub,rowInSub,indexInSub,fieldInSub){
            return[ 
              // '<button id="btn_edit" class="btn btn-info" data-toggle="modal" data-target="#modalRqstInvoiceModifyer" title="修改"><i class="oi oi-pencil"></i></button>',
              '<button id="btn_delete" class="btn btn-danger" title="删除"><i class="oi oi-trash"></i></button>'
            ];
          },
          events:{
            //触发#btn_edit这个按钮的点击事件
            // 'click #btn_edit':function(eventInSub,valueInSub,rowInSub,indexInSub){
              
            // },
　　　　　      //触发#btn_detele这个按钮的点击事件
            'click #btn_delete':function(eventInSub,valueInSub,rowInSub,indexInSub){
              _this.tmpBSTable.table=subTable;
              _this.tmpBSTable.tableData=subTableData;
              _this.tmpBSTable.event=eventInSub;
              _this.tmpBSTable.value=valueInSub;
              _this.tmpBSTable.row=rowInSub;
              _this.tmpBSTable.index=indexInSub;
              _this.parentRow=row;
              $('#confirmDeleteARowInSubTable').modal('toggle');
            }
          }

        });          
          var subTable = $detail.html('<table></table>').find('table');
          subTable.bootstrapTable({
            columns: subTalbeColumns,
            data: subTableData,
            classes:'table-bordered table-sm table-dark',
            theadClasses:'thead-light',
            // showHeader:false
     	    // rowStyle:function(row,index){//    设置行样式的函数支持类或css
     	    //   return{
     	    //     css:{'color':'blue'}
     	    //   }
     	    // }
          })
      	} else {
          _this.$toast({
            text: "没有记录符合搜索条件",
            type: 'info',
            duration: 1000
          });        		
      	}
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          console.log(error);
        });
      },
      onClickRow (row, $element, field) {
// console.log(row);
      },
      fillAnInvoice () {
        this.amountOfSelectedRcdrs=0;
      	var listOfSelectedRecorders=$('#mainTable').bootstrapTable('getSelections');
// console.log(listOfSelectedRecorders);
// return;
        for(var index=0;index<listOfSelectedRecorders.length;index++) {
            var tmpAmount=(listOfSelectedRecorders[index]['金额'])?listOfSelectedRecorders[index]['金额']:0;
            this.amountOfSelectedRcdrs=parseFloat(this.amountOfSelectedRcdrs)+parseFloat(tmpAmount);
        }
        if(listOfSelectedRecorders.length<1) {
          this.$toast({
            text: "请勾选至少一条记录!",
            type: 'info',
            duration: 2000
            });
          return;
        }
        this.detailsOfFilling=JSON.parse(this.clonedDetailsOfFilling);
        if(listOfSelectedRecorders.length>0){
            for(var index=0;index<listOfSelectedRecorders.length;index++) {
              if(listOfSelectedRecorders[0]['发票抬头']!==listOfSelectedRecorders[index]['发票抬头']){
                this.$toast({
                  text: "您所选记录中的发票抬头不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
              if(listOfSelectedRecorders[0]['出票公司']!==listOfSelectedRecorders[index]['出票公司']){
                this.$toast({
                  text: "您所选记录中的出票公司不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
              if(listOfSelectedRecorders[0]['类型']!==listOfSelectedRecorders[index]['类型']){
                this.$toast({
                  text: "您所选记录中的发票类型不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
/*
              if(listOfSelectedRecorders[0]['商品名称']!==listOfSelectedRecorders[index]['商品名称']){
                this.$toast({
                  text: "您所选记录中的商品名称不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
*/              
              if(listOfSelectedRecorders[0]['申请人']!==listOfSelectedRecorders[index]['申请人']){
                this.$toast({
                  text: "您所选记录中的申请人不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
              this.detailsOfFilling.listOfIDS.push(listOfSelectedRecorders[index]['ID']);
	        }        	
        }

        this.detailsOfFilling.cstmrOgnztnName=listOfSelectedRecorders[0]['发票抬头'];
        this.detailsOfFilling.nameOfOurCmpny=listOfSelectedRecorders[0]['出票公司'];
        this.detailsOfFilling.nameOfGoods=listOfSelectedRecorders[0]['商品名称'];
        this.detailsOfFilling.memInRqst=listOfSelectedRecorders[0]['备注'];
        this.detailsOfFilling.amount=this.amountOfSelectedRcdrs;
        $('#invoiceFiller').modal('toggle');	
      	// console.log('打开模态框进行开票操作');
      },
      saveModifyedInfo () {
      	var queryContent={
      	  id:'',
      	  idOfOurCmpny:'',
      	  idOfType:'',
      	  idOfCstmrOgnztn:'',
      	  nameOfGoods:'',
      	  amount:'',
      	  memInRqst:'',
      	  idOfApplyer:'',
      	  project:''
      	};
        queryContent.id=this.infoInRequestInvoice.id;
        for(var i=0;i<this.listOfOurCompanys.length;i++){
          if(this.listOfOurCompanys[i].name===this.infoInRequestInvoice.nameOfOurCmpny){
            queryContent.idOfOurCmpny=this.listOfOurCompanys[i].id;
            break;
          }
        }
        for(var i=0;i<this.listOfInvoiceType.length;i++){
          if(this.listOfInvoiceType[i].name===this.infoInRequestInvoice.type){
            queryContent.idOfType=this.listOfInvoiceType[i].id;
            break;
          }
        }
        for(var i=0;i<this.listOfCustomerOgnztn.length;i++){
          if(this.listOfCustomerOgnztn[i].full_name===this.infoInRequestInvoice.cstmrOgnztnName){
            queryContent.idOfCstmrOgnztn=this.listOfCustomerOgnztn[i].id;
            break;
          }
        }
        
        queryContent.nameOfGoods=this.infoInRequestInvoice.nameOfGoods;
        queryContent.amount=this.infoInRequestInvoice.amount;
        queryContent.memInRqst=this.infoInRequestInvoice.memInRqst;
        queryContent.idOfApplyer=this.infoInRequestInvoice.idOfApplyer;
        queryContent.project=this.infoInRequestInvoice.project;
        var _this=this;
        var rqstPage="updateRqstInvoiceWithModifyedData.php";
        this.$axios({
          method: 'post',
          url: rqstPage,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          if(response.data===true) {
    	    $('#modalRqstInvoiceModifyer').modal('toggle');
            _this.$toast({
               text: '<发票申请>修改成功!',
               type: 'success',
                duration: 1000
            });
         //更新视图
            var indexOfRow=0;
            for(var i=0;i<_this.data.length;i++){
              if(_this.data[i].ID===_this.infoInRequestInvoice.id){
                indexOfRow=i;   
              }
            }
            _this.data[indexOfRow].出票公司=_this.infoInRequestInvoice.nameOfOurCmpny;
            _this.data[indexOfRow].发票抬头=_this.infoInRequestInvoice.cstmrOgnztnName;
            _this.data[indexOfRow].商品名称=_this.infoInRequestInvoice.nameOfGoods;
            _this.data[indexOfRow].备注=_this.infoInRequestInvoice.memInRqst;
            _this.data[indexOfRow].申请人=_this.infoInRequestInvoice.applyer;
            _this.data[indexOfRow].申请时间=(new Date()).format("yyyy-MM-dd hh:mm:ss");
            _this.data[indexOfRow].类型=_this.infoInRequestInvoice.type;
            _this.data[indexOfRow].金额=_this.infoInRequestInvoice.amount;
            _this.data[indexOfRow].项目=_this.infoInRequestInvoice.project;
 	                  	
          } else {
            _this.$toast({
               text: '操作失败,请稍后再试!'+error,
               type: 'danger',
                duration: 4000
            });
            console.log(error);          	
          }

        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          console.log(error);
        });
      },
      deleteARowInMainTable () {

// console.log(this.data);
        $('#mainTable').bootstrapTable("load",this.data);
        //需完善数据库操作
        var _this=this;
        var rqstPage="updateRequestInvoice.php";
        var queryContent={id:this.tmpBSTable.row.ID};
        this.$axios({
          method: 'post',
          url: rqstPage,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          if(response.data===true) {
            for(var i=0;i<_this.data.length;i++) {
              if(_this.data[i].ID===_this.tmpBSTable.row.ID) {
                _this.data.splice(i,1);
                i--;
          	  }
  	        }
    	    $('#confirmDeleteARowInMainTable').modal('toggle');
            _this.$toast({
               text: '操作成功!',
               type: 'success',
                duration: 1000
            });  	                  	
          } else {
            _this.$toast({
               text: '操作失败,请稍后再试!'+error,
               type: 'danger',
                duration: 4000
            });
            console.log(error);          	
          }

        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          console.log(error);
        });
      },
      deleteARowInSubTable () {
      	var rqstPage="updateOrders.php";
      	var _this=this;
      	var queryContent={};
        queryContent.conditions="CancelRequesting";//
        queryContent.id=this.tmpBSTable.row.ID;
// console.log(this.tmpBSTable);
// console.log(this.data);
// return;
      	this.$axios({
          method: 'post',
          url: rqstPage,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          if(response.data===true) {
            for(var i=0;i<_this.tmpBSTable.tableData.length;i++) {
              if(_this.tmpBSTable.tableData[i].ID===_this.tmpBSTable.row.ID) {
                _this.tmpBSTable.tableData.splice(i,1);
                i--;
          	  }
  	        }
  	        if(_this.tmpBSTable.tableData.length<1) {//子表中没有数据
              //更新父表的显示
              for(var i=0;i<_this.data.length;i++) {
                if(_this.data[i].ID===_this.parentRow.ID) {
                  _this.data.splice(i,1);
                  i--;
                }
              }
              //删除这条发票申请记录
              var rqstPage="updateOrders.php";
              var queryContent={id:_this.parentRow.ID,conditions:"DeleteTheRequesting"};

              _this.$axios({
                method: 'post',
                url: rqstPage,
                data: qs.stringify(queryContent)
              }).then(function (response) {
                if(response.data===true) {
                  // _this.$toast({
                  //    text: '操作成功!',
                  //    type: 'success',
                  //     duration: 1000
                  // });                 	
                } else {
                  _this.$toast({
                     text: '操作失败,请稍后再试!'+error,
                     type: 'danger',
                      duration: 4000
                  });
                  console.log(error);
                  return;          	
                }
              }).catch(function (error) {
                _this.$toast({
                   text: '异步通信错误!'+error,
                   type: 'danger',
                    duration: 4000
                });
                console.log(error);
              });              
  	        } else {
              _this.tmpBSTable.table.bootstrapTable("load",_this.tmpBSTable.tableData);
  	        }
            $('#confirmDeleteARowInSubTable').modal('toggle'); 
            _this.$toast({
               text: '操作成功!',
               type: 'success',
                duration: 1000
            });  	                  	
          } else {
            _this.$toast({
               text: '操作失败,请稍后再试!'+error,
               type: 'danger',
                duration: 4000
            });
            console.log(error);          	
          }

        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          console.log(error);
        });      	
      },
      saveFilledInvoiceData () {
        if(!this.detailsOfFilling.numberOfInvoice || this.detailsOfFilling.numberOfInvoice.length<8) {
            this.$toast({
              text: "发票号码不符合要求!不少于8且不超过128个字。",
              type: 'danger',
              duration: 1500
            });
            return;        	
        }
        if(!this.detailsOfFilling.nameOfOurCmpny) {
            this.$toast({
              text: "请选择出票单位!",
              type: 'danger',
              duration: 1500
            });
            return;        	
        } 
        if(!this.detailsOfFilling.nameOfGoods || this.detailsOfFilling.nameOfGoods.length>16 || this.detailsOfFilling.nameOfGoods.length<2) {
            this.$toast({
              text: "商品名称不符合要求!",
              type: 'danger',
              duration: 3000
            });
            return;            
        }
        if(!this.detailsOfFilling.amount || this.detailsOfFilling.amount<=0) {
            this.$toast({
              text: "金额这么少,不开票了吧,不够麻烦的!",
              type: 'danger',
              duration: 3000
            });
            return;       
        }
//获取出票公司ID  idOfOurCmpny
        var idOfOurCmpnyInvoice=0;
        for(var index=0;index<this.listOfOurCompanys.length;index++){
        	if(this.detailsOfFilling.nameOfOurCmpny===this.listOfOurCompanys[index]['name']) {
        	  this.detailsOfFilling.idOfOurCmpny=this.listOfOurCompanys[index]['id'];
        	  break;
        	}
        }
//获取发票抬头Ognztn的ID  idOfCstmrOgnztn
        for(var index=0;index<this.listOfCustomerOgnztn.length;index++){
        	if(this.detailsOfFilling.cstmrOgnztnName===this.listOfCustomerOgnztn[index]['full_name']) {
        	  this.detailsOfFilling.idOfCstmrOgnztn=this.listOfCustomerOgnztn[index]['id'];
        	  break;
        	}
        }
//获取发票类型在数组中的索引值,作为detailsOfFilling.type的值
        for(var index=0;index<this.listOfInvoiceType.length;index++) {
          if(this.detailsOfFilling.type===this.listOfInvoiceType[index]['name']) {
            this.detailsOfFilling.type=this.listOfInvoiceType[index]['id'];
          }
        }
//将数据保存到数据库,用mySQL事务进行
      var _this=this;
      this.$axios({
        method: 'post',
        url: 'saveFillInvoiceData.php',
        data: qs.stringify(_this.detailsOfFilling)
        }).then(function (response) {
            $('#invoiceFiller').modal('toggle');
//console.log(response.data);
          //从未开票的申请列表中清除已经开票的记录
          for(var index=0;index<_this.data.length;index++) {
            if(_this.detailsOfFilling.listOfIDS.includes(_this.data[index]['ID'])) {
              _this.data.splice(index, 1);
                index--;
            }               
          }
          _this.detailsOfFilling=JSON.parse(_this.clonedDetailsOfFilling);
          _this.amountOfSelectedRcdrs=0;
          _this.$toast({
            text: "开票信息已保存",
            type: 'success',
            duration: 1000
          });
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });                
      }      
	},
	watch: {
      'queryContent.typeOfQuery': {
        handler: function() {
          this.data=[];
          this.headerOfList=[];
        }
      }	  
	},
    beforeCreate:function() {
    }	
  }	
</script>

<style scoped>
#modalRqstInvoiceModifyer input,#modalRqstInvoiceModifyer select {
  width: 85%;
}	
#mainTable {
/*  overflow: auto;*/
  font-size: 14px;
}
/*.table table-hover {
  font-size: 12px;
}*/
td {
  overflow:auto; /*hidden scroll*/
  white-space:nowrap; /*nowrap*/
  text-overflow:clip;/*ellipsis*/
  max-width: 60px;
  font-size: 12px;
}
.datepicker {
  margin-left: 10px;
}
.radios,.btnSearch {
  margin-left: 20px;
}
.radio {
  width: 1.1em;
  height: 1.1em;
  vertical-align:middle;
  margin-top:-2px;
  margin-bottom:1px;
}
#toolbar {
 display:none;
}
.subTalbe {
  color:blue;
}
#btn_edit,#btn_delete {
  font-size: 6px;
}
.row {
  margin-top: 10px;
}
#searchConditions >* {
  margin:5px 5px;
}
.pre-scrollable {
  min-height: 500px;
}
</style>

