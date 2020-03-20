<template>
<div class="container-fluid">
    <div id="title" class="titleOfRqstPn">
      <span class="titleOfRqstPn">请款报销预支</span>
    </div>
    <div id="tabMenu">
		<ul class="nav nav-pills" role="tablist">
			<li class="nav-item">
				<a class="nav-link active" data-toggle="pill" href="#reimbursement-purchasing">费用报销/采购请款</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" data-toggle="pill" href="#advance-borrow">预支/借款</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" data-toggle="pill" href="#myRequestPaying">我的请款</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" data-toggle="pill" href="#examine_request" @click="getRqstPnForExamData">请款审批</a>
			</li>
		</ul>
    </div>
  <div id="tabContent" class="tab-content container-fluid">
    <div id="reimbursement-purchasing" class="container-fluid tab-pane active">
	  <div class="row">
	    <div class="col-lg form-inline">
	      <label for="requestAmount" data-toggle="modal" data-target="#msgToast">金额:</label>
	      <input id="requestAmount" v-model="inputAmount" type="number" name="requestAmount" class="form-control" placeholder="请款金额">
	    </div>
	    <div class="col-lg form-inline">
	      <label for="useage">用途(🔍):</label>
	      <!-- <div class="form-inline"> -->
	      <input id="useage" type="search" name="useage" class="form-control"  data-toggle="modal" data-target="#selectUseage" placeholder="款项用于" readonly v-model="businessID">
	      <!-- <button @click="changeUseage" class="btn btn-primary" type="button" data-toggle="modal" data-target="#selectUseage" id="btnSelectUsage">🔍</button> -->
	      <!-- </div> -->
	    </div>
	    <div class="col-lg form-inline">
	      <label for="typeOfPayment">方式:</label>
	      <select  v-model="selectedPayMent" class="form-control" id="typeOfPayment" name="typeOfPayment" type="text">
		    <option v-for="payMent in payMents">{{payMent.pmID}}</option>
		  </select>
	    </div>
	  </div>
	  <div class="row">
	    <div class="col-lg form-inline">
	      <label for="payMem">说明:</label>
	      <input  v-model="payMem" class="form-control" id="payMem" name="payMem" type="text">
	    </div>
	    <div class="col-lg form-inline">

	    </div>
	    <div class="col-lg form-inline">

	    </div>	    	    
	  </div>
      <div id="voucher" class="row">
	    <div class="col-lg">
	      	<up-load-img v-if='reloadImgBox'></up-load-img>
	      	<!-- havePictrues是子组件中注册的事件  @havePictrues="hasPictures"-->
	    </div>
      </div>
	  <div id="buttons" class="row">
	  	<div class="col-lg">
          <button id="btnSave" class="btn btn-primary" type="button" @click="examineInputDatas(inputAmount)">保存</button>
          <!-- submit -->
	  	</div>
	  </div>  
    </div>
    <div id="advance-borrow" class="container-fluid tab-pane fade"><br>
      <!-- <h3>预支借款</h3> -->
        <form>
		  <div class="row">
		    <div class="col-lg form-inline">
		      <label for="requestAdvanceAmount">金额:</label>
		      <input id="requestAdvanceAmount" v-model="inputAdvanceAmount" type="number" name="requestAdvanceAmount" class="form-control" placeholder="预借金额">
		    </div>
		    <div class="col-lg form-inline">
		      <label for="typeOfPayment">方式:</label>
		      <select  v-model="selectedPayMent" class="form-control" id="typeOfPayment" name="typeOfPayment" type="text">
			    <option v-for="payMent in payMents">{{payMent.pmID}}</option>
			  </select>
		    </div>
		    <div class="col-lg form-inline">
		      <label for="memOFBrw">说明:</label>
		      <input  v-model="memOFBrw" class="form-control" id="memOFBrw" name="memOFBrw" type="text">
		    </div>		    
		  </div>
		  <div id="btnAdvance" class="row">
		  	<div class="col-lg">
              <button id="btnSaveAdvance" class="btn btn-primary" type="button" @click="examineInputDatas(inputAdvanceAmount)">保存</button>
              <!-- submit -->
		  	</div>
		  </div>  
		</form>
    </div>
    <div id="myRequestPaying" class="container-fluid tab-pane fade">
      <!-- <h3>My request paying</h3> -->
		<div id="schMyRqstPnBox" class="form-group form-inline">
		  <label for="schMyRqstPnKeyWds">关键词:</label>
		  <input type="text" class="form-control" v-model="keyWords" id="schMyRqstPnKeyWds" placeholder="关键词">
		  <label id="schMyRqstPnDtPkr">时间范围:<date-picker v-model="timeRange" range valueType="format" width="210" confirm-text="选择"></date-picker></label>
		  <button id="schMyRqstPnBtn" @click="searchInDBS" class="btn btn-primary" type="button">搜索</button>
		</div>
    </div>
    <div id="examine_request" class="container-fluid tab-pane fade">
<!--       <h3>examine request</h3> -->
		    <div id="exmRqstRspnDt" class="container-fluid">
		      <span class="tipsForExmRqstRspnTbl">以下为待审批清单,请选择要审批的行:</span>
	          <table id="exmRqstRspnTbl" class="table table-hover">
			    <thead>
			      <tr>
			      	<th>申请ID</th>
			        <th>状态</th>
			        <th>申请人</th>
			        <th>摘要</th>
			        <th>金额</th>
			        <th>日期</th>
			      </tr>
			    </thead>
			    <tbody @dblclick="exmRqst" @click="exmRqst">
			      <tr v-for="row in rspRqstPnForExamng">
			      	<td v-for="item in row">{{item}}</td>
			      	
			      </tr>
			    </tbody>
			  </table>
		    </div>
    </div>
  </div>
  <div class="modal fade" id="selectUseage" role="dialog" aria-labelledby="selectUseageLabel" data-backdrop="static" data-keyboard: false>
    <!--  -->
    <div class="modal-dialog modal-lg" role="document">
       <!--  confirm -->
	  <div class="modal-content">  
        <div class="modal-header">
        	<span><label style="color: #007bff">业务ID选择器</label></span>  
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
            </button>  
        </div>

        <div class="modal-body">  
            <div class="container-fluid">
			    <div id="searchBox" class="form-group form-inline">
			      <label for="keyWords">关键词:</label>
			      <input type="text" class="form-control" v-model="keyWords" id="keyWords" placeholder="关键词">
			      <label id="datePicker">时间范围:<date-picker v-model="timeRange" range valueType="format" width="210" confirm-text="选择"></date-picker></label>
				  <button id="searchBtn" @click="searchInDBS" class="btn btn-primary" type="button">搜索</button>
			    </div>
                   <hr sytle="color:black;">
			    <div>
		          <label>请选择:<span id="forSlctdId"></span></label>
		          <table id="respTable" class="table table-hover">
				    <thead>
				      <tr>
				        <th>业务ID</th>
				        <th>业务摘要</th>
				        <th>执行人</th>
				        <th>执行日期</th>
				      </tr>
				    </thead>
				    <tbody @dblclick="rowClicked($event)" @click="rowClicked($event)">
				      <tr>
				        <td>98988766987988</td>
				        <td>Doe</td>
				        <td>Doe</td>
				        <td>john@example.com</td>
				      </tr>
				      <tr>
				        <td>Mary</td>
				        <td>Moe</td>
				        <td>Doe</td>
				        <td>mary@example.com</td>
				      </tr>
				      <tr>
				        <td>July</td>
				        <td>Dooley</td>
				        <td>Doe</td>
				        <td>july@example.com</td>
				      </tr>
				    </tbody>
				  </table>
			    </div>
			</div>  
        </div>  
        <div class="modal-footer">  
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>  
            <!-- <button type="button" class="btn btn-primary" v-show="selectedID!==''" @click="IDSelected">选定</button>   -->
        </div>  
	  </div>  
    </div>  
  </div>
  <div class="modal fade" id="exmnMdl" role="dialog" aria-labelledby="selectUseageLabel" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
            <div class="modal-header">
            	<span><label style="color: #007bff">请款审批</label></span>  
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>  
                </button>  
            </div>

            <div class="modal-body">  
				  <div>
                    <table style="width:100%;">
                    	<thead>
					      	<th>申请ID</th>
					        <th>状态</th>
					        <th>申请人</th>
					        <th>摘要</th>
					        <th>金额</th>
					        <th>日期</th>
                    	</thead>
                    	<tbody>
                    		<tr>
                    			<td v-for="td in slctdSingleData">{{td.innerHTML}}</td>
                    		</tr>
                    	</tbody>
                    </table>
					<div id="exmOpnRdos" class="container">
						<label class="radio-inline">
							<input type="radio" name="exmRslt" class="examOpnRds" value="agree" checked>同意</label>
						<label class="radio-inline">
							<input type="radio" name="exmRslt" class="examOpnRds"  value="refuse">拒绝</label>
						<label class="radio-inline">
							<input type="radio" name="exmRslt" class="examOpnRds"  value="delay">待定</label>
					</div>
                    <p>
                    	<span>理由<input v-model="exmOpinion" type="text" placeholder="如果拒绝,请说明理由"></span>
                    </p>
				  </div>
            </div>  
            <div class="modal-footer">  
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>  
                <button type="button" id="btnExmResult" @click="saveExmResult" class="btn btn-primary">保存</button>
            </div>  
        </div>  
    </div>  
  </div>



</div>
</template>

<script>
import datePicker from 'vue2-datepicker'
import upLoadImg from './up-load-img'

  var YYYYMMDD=new Date()
  var YYYY=(new Date()).getFullYear()
  var MM=(new Date()).getMonth()+1
  var DD=(new Date()).getDate()

  MM=MM>10?MM:('0'+MM)
  DD=DD>10?DD:('0'+DD)
  YYYYMMDD=YYYY+'-'+MM+'-'+DD
  

  // function inputFiles(){
  //       return  $('#inputFiles').click();
  // }



  export default {

  	data() {
  		return {
  			  selectedID:'款项用于(请点击)',
		  	  timeRange: [YYYYMMDD,moment().add(7,'days').format('YYYY-MM-DD')],
		  	  businessID:'款项用于(请点击)',
		  	  keyWords:'',
		  	  inputAmount:'',
		  	  inputAdvanceAmount:'',
		  	  payMents:[
		  	    {'pmID':'微信'},
		  	    {'pmID':'支付宝'},
		  	    {'pmID':'银行卡'},
		  	    {'pmID':'现金'}
		  	  ],
		  	  selectedPayMent:'微信',
		  	  rqstPnID:'',
		  	  memOFBrw:'',
		  	  exmOpinion:'',
		  	  // showMB:false,
		  	  imgUpLoaded:this.GLOBAL.imgBase64,
		  	  payMem:'',
		  	  reloadImgBox:true,
              rspRqstPnForExamng:[],//服务器返回的待审核的请款清单
		      rspRqstPn:[],//服务器返回的未请款业务清单
		      slctdSingleData:[]//已选中的待审核的请款单条数据
		      }
  		},
  	components: {
		 datePicker,
		 'up-load-img':upLoadImg
  	},	  


  	methods:{
  		examineInputDatas:function(inptAmnt) {
  			if(typeof(inptAmnt)=='undefined' || inptAmnt<1){
  			  this.$toast({
			    text: '钱太少了,下次再报吧',
			    type: 'info',
			     duration: 1500
	          });
  			return;
  			}
  		//此处添加验证是否上传了图片的提示
  		    if (this.GLOBAL.imgBase64.length<1 || typeof(this.GLOBAL.imgBase64)=='undefined') {
			    // console.log(this.imgUpLoaded.length);
			    this.$toast({
				    text: '请添加凭证',
				    type: 'danger',
				     duration: 1000
		        }); 

		        return; 		    	
  		    }
  		    
		    this.$toast({
			    text: '数据成功保存',
			    type: 'success',
			     duration: 1000
	        });

	    //清空已保存的图片
	    this.GLOBAL.imgBase64=[];
	    // 清空正在显示的图片,实际上重新加载了子组件
	    this.reloadImgBox = false;
		this.$nextTick(() => {
			this.reloadImgBox = true;
			})
        //清空输入框
		this.inputAmount="";
		this.businessID="";
		$("#requestAmount").val("");
		//$("#requestAmount").attr("value","");
  		},
  		// hasPictures:function (pics) {
  		// 	console.log('监听到了子组件注册的事件')
  		// 	console.log(pics);
    //         if(pics.length<1 || typeof(pics)=='undefined') {
    //         	//this.imgUpLoaded = false;
    //         }
    //         else {
    //         	console.log(pics.length);
    //         	this.imgUpLoaded = pics;
    //         }
  		// },
  		changeUseage:function() {
//  			$("#useage").val("98989898")
  		},
  		rowClicked:function(e){
          this.selectedID=e.toElement.parentElement.children[0].innerHTML;
          this.businessID=this.selectedID;
          $('#selectUseage').modal('toggle')
  		},
  		//到数据库检索数据
  		searchInDBS:function() {
  			//alert('到数据库检索数据,加载到table中')
  			  this.$toast({
			    text: '日期范围:' + this.timeRange[0] +'~'+this.timeRange[1],
			    type: 'info',
			     duration: 1500
	          });
  		},
  		IDSelected:function() {
          //this.businessID=this.selectedID;
           //$('#selectUseage').modal('toggle')//toggle 也可用hide代替
           
           //setTimeout(this.closeModalBox,1000);//1s延时自动调用this.closeModal
  		},
  		exmRqst:function(e) {
        //  this.rqstPnID = e.toElement.parentElement.children[0].innerHTML;
          this.slctdSingleData = e.toElement.parentElement.children;
          $('#exmnMdl').modal('toggle');
  		},
  		saveExmResult:function() {
//  			alert($("input[name='exmRslt']:checked").val());
//  			将审核过的请求从数组中删除
			    var _this = this
			    this.rspRqstPnForExamng.forEach(function(item, index, arr) {
				    if(item.id === _this.slctdSingleData[0].innerHTML) {
				        arr.splice(index, 1);
				    }
				});
//			    console.log(this.rspRqstPnForExamng);
			    this.$toast({
				    text: '数据成功保存',
				    type: 'success',
				     duration: 1000
		          });
                $('#exmnMdl').modal('toggle');
  		},
  		showMsgBox:function() {
  			//用于测试toast
  			//this.showMB = !this.showMB
  		},
  		getRqstPnForExamData:function() {
  			var _this = this
			this.$axios.get('getCntctrOgnztn.php')
			  .then(function (response) {
			     _this.rspRqstPnForExamng = response.data;
			  })
			  .catch(function (error) {
			    console.log(error);
			  });
  		}

  	}

  }

	
</script>

<style scoped>
.row {
	margin-top: 10px;
}
#tabContent {
	margin-top: 20px;
	border: 1px solid #007bff;
	padding: 10px;
}
/*label {
	font-size: 20px;
	font-weight: bold;
}*/
.col-lg input, .col-lg select {
	width: 70%;
}
.titleOfRqstPn {
	text-align: center;
	font-size: 1.3em;
	font-weight: bold;
	color:#007bff;
}
/*.spReason {
	font-size: 1.3em;
}*/
.examOpnRds {
   width: 1.2em;
   height: 1.2em;
   vertical-align:middle;
   margin-top:-2px;
   margin-bottom:1px;
}
.tipsForExmRqstRspnTbl {
	font-weight:bold;
	font-size: 20px;
	color: #dc3545;
	overflow: hidden;
}
#schMyRqstPnDtPkr,#schMyRqstPnBtn {
	margin-left: 30px;
}

#schMyRqstPnBtn {
    margin-left: 60px;
}
#searchBox {
	color:#007bff;
	padding:5px;
/*	border: 1px solid #007bff;*/
}
#exmRqstRspnDt {
    text-align: left;
    margin-top: 3px;
}
#voucher, #schMyRqstPnRspnDt {
	margin-top:20px;
}	

#btnSave,#btnSaveAdvance {
  margin:10px auto;
}


#buttons .col-lg,#btnAdvance .col-lg {
  text-align:right;
}

#buttons>.col>button,#btnAdvance>.col>button {
  width:70px;
}

#schMyRqstPnBox {
	padding: 10px;
}
/*img {
	cursor: pointer;
	width: 160px;
	height: 150px;
}*/

#selectUseage {
}

#searchBtn {
	margin-left: 10px;
}

#keyWords {
	width: 120px;
	color:#007bff;
	border:1px solid #007bff;
}

/*.modal-body {
	overflow-y: scroll;
}*/
#forSlctdId {
  color: red;
  font-weight: bold;
}

#datePicker {
 margin-left: 5px;
}

#inputFiles {
/*	display: none;
*/}

#exmOpnRdos {
    margin-top: 30px;
	text-align: center;
}
.radio-inline {
	margin-right: 2.5em;
	/*width: 20%;*/
	/*border: 1px solid red;*/
} 
</style>
