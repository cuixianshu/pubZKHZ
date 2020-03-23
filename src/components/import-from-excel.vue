<template>
<div class="father">
  <h5>当前位置:订单管理/Excel导入</h5>
  <div id="fromExcel" class="container-fluid">
    <div class="get-xlsx">
      <div class="row">
        <div class="col-md form-inline">
          <div>
            <input id="openFileSelector" type="file" @change="excelFileChanged"  
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
          </div>
        </div>
        <div class="col-md  form-inline" v-if="xlsTitle.length">
          <button class="btn btn-secondary clearBtn" @click="clearXlsx">清空</button>
        </div> 
        <div class="col-md  form-inline" v-if="xlsTitle.length">
          <button class="btn btn-primary" @click="saveXlsxDataToDBS">保存</button>
        </div>                       
      </div>
    </div>
    <table class="table table-hover" v-if="xlsTitle.length">
      <thead>
        <th v-for="title in xlsTitle">{{title}}</th>
      </thead>
        <tbody>
          <tr v-for="row in xlsData">
            <td v-for="vlu in row">{{vlu}}</td>
          </tr>
        </tbody>
    </table>
  </div>
  <div class="modal fade" id="duplicate_recorders_shower" role="dialog" aria-labelledby="warning_for_duplicate" data-backdrop="static" data-keyboard: false>
	  <div class="modal-dialog modal-lg" role="document">
	    <div class="modal-content">  
	      <div class="modal-header">
	        <span><label style="color: #007bff">{{tip_for_duplicate}}</label></span>  
	          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	            <span aria-hidden="true">×</span>  
	          </button>
	      </div>
	      <div id="board" class="modal-body">
	        <table style="width:100%;">
	          <tbody>
	            <tr v-for="tblRow in duplicateRecorders">
	              {{tblRow}}
	            </tr>
	          </tbody>
	        </table>
	      </div>                
	      <div class="modal-footer">  
	        <button type="button" id="btnCopyToClipboard" @click="copyToclipboard" class="btn btn-primary" data-clipboard-target="#board">复制到粘贴板</button>  
	        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>  
	      </div>  
	    </div>  
	  </div>  
	</div>      
  </div>
</template>

<script>
import qs from 'qs';
import XLSX from 'xlsx';
import ClipboardJS from 'clipboard';
  export default {
  	data () {
  	  return{
        xlsTitle:[],
        xlsData:[],
        tip_for_duplicate:'',
        duplicateRecorders:[],
        effectiveCols:[]
  	  }
  	},
  	methods:{
      excelFileChanged:function(event){
        if(!$('#openFileSelector').val()) {
          return;
        }
        if(!event.currentTarget.files.length) {//没有文件被选中 
          return;
        }
        if(this.xlsTitle.length>0){//如果已有数据,需清空
          this.xlsTitle=[];
          this.xlsData=[];
        }
        var _this = this;
        var f = event.currentTarget.files[0];// 拿取文件对象
        var reader = new FileReader();// 用FileReader来读取
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var workBook; // 读取完成的数据
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            workBook = XLSX.read(binary, {
              type: "binary"//'base64'
            });
            if(XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]).length<1) {
              _this.$toast({
                text: "空表!",
                type: 'danger',
                duration: 1000
              });
              $('#openFileSelector').val('');
              return;          
            } else {
              // 获取数据
              var tempArry= XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]], {raw: true,defval: ''});
              if(tempArry.length>120) {
                _this.$toast({
                  text: "表中数据过多,一次不能超120条!",
                  type: 'danger',
                  duration: 3000
                });
                $('#openFileSelector').val('');
                return;                
              }
              //核心数据列
              var indispensableCellValue=['订单类型','用车人手机号码','起点站','终点站','出发日期','出发时间','结束日期','结束时间','里程数','司机手机号码','车牌号码','用车单位/部门'];
              var tempTitles=[];//获取表头,也就是属性名
              for (var index in tempArry) {
                for (var prop in tempArry[index]) {//tempArry[index]为对象--
                  if(!(_this.effectiveCols.includes(prop))){
                    delete tempArry[index][prop];//prop是动态变化的对象属性名称,不能用'.'
                  }
                  else {
                    if(index==0) {//获取表头,只创建一遍
                      tempTitles.push(prop);
                    }
                    //处理小数格式的时间转为标准格式
                    if(prop==_this.effectiveCols[0] || prop==_this.effectiveCols[1]){
                      if (parseFloat(tempArry[index][prop])>parseInt(tempArry[index][prop])) {
                        var HH=parseInt(parseFloat(tempArry[index][prop])*24);//小时
                        var MM=Math.round((parseFloat(tempArry[index][prop])*24-HH)*60);//分钟
                        HH=HH<10?'0'+HH:HH;
                        MM=MM<10?'0'+MM:MM;
                        tempArry[index][prop]=HH+':'+MM;
                      }
                    }

                    //空白格用空格代替
                    tempArry[index][prop]=tempArry[index][prop]?tempArry[index][prop]:'';
                    //必有列的单元格不能空
                    if(indispensableCellValue.includes(prop) && tempArry[index][prop]==''){
                      _this.$toast({
                        text: "‘"+prop+"’"+'－－是核心数据，不许有空格，行号：'+(Number(index)+2)+'。',
                        type: 'danger',
                        duration: 4000
                      }); 
                      $('#openFileSelector').val('');
                      return ;
                    }
                  }
                }
              }
              if(tempTitles.length<1){
                _this.$toast({
                  text: "没有表头或表头不对!",
                  type: 'danger',
                  duration: 3000
                });
                $('#openFileSelector').val('');                
                return;
              }
              for(var i=0;i<indispensableCellValue.length;i++) {
                    
                if(!tempTitles.includes(indispensableCellValue[i])){//是否缺少必有列
                  _this.$toast({
                    text: "'"+indispensableCellValue[i]+"'－－整列缺失,这是核心数据，不允许缺失！",
                    type: 'danger',
                    duration: 4000
                  }); 
                  $('#openFileSelector').val('');
                  return ;
                }                
              }
              _this.xlsData=tempArry;
              _this.xlsTitle=tempTitles;
            }
          }
          reader.readAsArrayBuffer(f);
        }
        reader.readAsBinaryString(f);
      },
      clearXlsx :function() {
        this.xlsData=[];
        this.xlsTitle=[];
        $('#openFileSelector').val('');
      },
      promiseMethod :function (){

        var _this=this;
        var prmsData= new Promise((resolve, reject) => {//return
          this.$axios({
              method: 'post',
              url: 'Excel2tbl_Orders.php',
              data: qs.stringify(_this.xlsData)
          }).then((res) => {
            resolve(res.data);
          }).catch((err) => {
            reject(err);
          })
        });
        return prmsData;
      },
      async axiosAsync() {
     
        var _this=this;
        var modalModel="<div id='loadingModal' class='modal fade'></div>";//height:80px;
        var msg="<div id='msg' style='width:50%;text-align:center;padding:10px;background:#17a2b8;color:#FFF;position: absolute;top:20%;left:50%;transform:translate(-50%,-50%);'><h4>正在处理,请稍等...</h4></div>" ; 

        if($("#loadingModal").length<1) {
          $("#fromExcel").after(modalModel);
        }
        if($("#msg").length<1) {
          $("#loadingModal").append(msg);
        }
        $("#loadingModal").modal('show');
        var rspnData = await this.promiseMethod();
// console.log(rspnData);
// return;
        $('#openFileSelector').val(''); 
        $('#loadingModal').remove();
        $('.modal-backdrop').remove();
        $("body").attr("class","");
        if(rspnData.error === '' && rspnData.countOfInserted>0){
          if(rspnData.duplicate_recorders.length>1){//有重复数据
            this.tip_for_duplicate="成功保存:"+rspnData.countOfInserted+"条。丢弃重复数据:"+rspnData.duplicate_recorders.length+"条，以下为重复数据：";
            this.duplicateRecorders=rspnData.duplicate_recorders;
            $("#duplicate_recorders_shower").modal('show');            
          } else {
            this.$toast({
              text: rspnData.countOfInserted+"条记录成功保存!",
              type: 'success',
              duration: 1500
            });
          }
        } else if(rspnData.error !== ''){
            this.$toast({
              text: "操作失败:"+rspnData.error,
              type: 'danger',
              duration: 5000
            });
            console.log(rspnData);
        } else {//全部重复
          this.tip_for_duplicate="数据重复,以下为重复数据清单:";
          this.duplicateRecorders=rspnData.duplicate_recorders;
          $("#duplicate_recorders_shower").modal('show');
          // console.log(rspnData);
        }
        this.xlsData=[];
        this.xlsTitle=[];
      },
      saveXlsxDataToDBS:function () {
       
        var rspnData=this.axiosAsync();
      },
      clearTitle(val) {
        this.xlsTitle=val;
      },
      copyToclipboard:function () {
        var _this=this;
        var clipboard = new ClipboardJS('#btnCopyToClipboard');        //实例化clipboard

        clipboard.on("success", function(e){
            _this.$toast({
              text: "已复制!",
              type: 'success',
              duration: 1000
            });
            e.clearSelection();
            clipboard.destroy(); // 如果不销毁，第一次以后的复制，会有重复的alert弹出
        $("#duplicate_recorders_shower").modal('hide');
        });
        clipboard.on("error", function(e){
            _this.$toast({
              text: "这个,我不会弄,请手动复制.",
              type: 'danger',
              duration: 2000
            });
            clipboard.destroy(); // 如果不销毁，第一次以后的复制，会有重复的alert
        });
      },
    
  	},
    beforeCreate:function() {
	  //初始化必须列   this.effectiveCols
	  var _this=this; 
	  this.effectiveCols=[];
	  this.$axios({
	        method: 'post',
	        url: 'getDictionaryOfFeildNames.php'
	    }).then(function (response) {
	      for(var index in response.data) {
	        _this.effectiveCols.push(response.data[index].name_in_excel);
	      }
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
#fromExcel, .tab-pane {
  overflow: auto;
}
.clearBtn {
	margin-right: 20px;
}
.saveBtn, .clearBtn {
	width: 100px;
}
table {
  overflow: auto;
  font-size: 12px;
}
.mx-input-wrapper {
  width: 100%;
}
.table table-hover {
  font-size: 12px;
}
#openFileSelector {
  /*display: none;*/
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
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
#board {
  text-align: left;
}
h5 {
  color: #007bff;
}

</style>
