<template>
<div class="father">
  <h5>当前位置:订单管理/Excel导入</h5>
  <div id="fromExcel" class="container-fluid">
    <div class="get-xlsx" v-if="showFilePicker">
      <div class="row">
        <div>
          <input id="openFileSelector" type="file" @change="excelFileChanged"  
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        </div>
      </div>
    </div>
    <div v-if="xlsTitle.length">
      <h5>已从文件中获取{{xlsTitle.length}}条数据</h5>
      <table class="table table-hover pre-scrollable">
        <thead> class="divfortable"
          <th v-for="title in xlsTitle">{{title}}</th>
        </thead>
          <tbody>
            <tr v-for="row in xlsData">
              <td v-for="vlu in row" :title="vlu">{{vlu}}</td>
            </tr>
          </tbody>
      </table>      
    </div>
    <div v-if="xlsTitle.length">
      <button class="btn btn-secondary clearBtn" @click="clearXlsx">清空</button>
      <button class="btn btn-primary" @click="saveXlsxDataToDBS">保存</button>
    </div> 
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
	      <div id="board" class="modal-body divfortable">
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
  <div id="loading" class="loadingbox" v-show="showLoading">
    <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
  </div>
</div>
</template>

<script>
import qs from 'qs';
import XLSX from 'xlsx';
import ClipboardJS from 'clipboard';
// import rmvLoadingBox from '@/cuiLibs/rmvLoadingBox';
  export default {
  	data () {
  	  return{
        currentUserId:this.$store.state.user.id_user,
        showLoading:false,
        imgUrl:require('@/assets/images/loading.gif'),
        showFilePicker:true,
        xlsTitle:[],
        xlsData:[],
        tip_for_duplicate:'',
        duplicateRecorders:[],
        effectiveCols:[],
        indispensableCellValue:['订单类型','用车人手机号码','起点站','终点站','出发日期','出发时间','结束日期','结束时间','里程数','司机手机号码','车牌号码','用车单位/部门']//核心数据列
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
        this.showFilePicker=false;
        if(this.xlsTitle.length>0){//如果已有数据,需清空
          this.xlsTitle=[];
          this.xlsData=[];
        }
        var _this = this;
        var f = event.currentTarget.files[0];// 拿取文件对象
        var reader = new FileReader();// 用FileReader来读取
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var workBook={}; // 读取完成的数据
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
// return;              
              // //核心数据列
              // var indispensableCellValue=['订单类型','用车人手机号码','起点站','终点站','出发日期','出发时间','结束日期','结束时间','里程数','司机手机号码','车牌号码','用车单位/部门'];
              var tempTitles=[];//获取表头,也就是属性名
              for (var index in tempArry) {
                tempArry[index]['创建者']=_this.currentUserId;
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
                    if(_this.indispensableCellValue.includes(prop) && tempArry[index][prop]==''){
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
                _this.showFilePicker=true;              
                return;
              }
              for(var i=0;i<_this.indispensableCellValue.length;i++) {
                    
                if(!tempTitles.includes(_this.indispensableCellValue[i])){//是否缺少必有列
                  _this.$toast({
                    text: "'"+_this.indispensableCellValue[i]+"'－－整列缺失,这是核心数据，不允许缺失！",
                    type: 'danger',
                    duration: 4000
                  }); 
                  $('#openFileSelector').val('');
                  _this.showFilePicker=true
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
        this.showFilePicker=true;
      },
      saveXlsxDataToDBS:function () {
// console.log(this.xlsData);
// return;
        var rspnData=this.axiosAsync();
      },
      async axiosAsync() {
// console.log(this.currentUserId);
// return;     
        var _this=this;
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var rspnData = await this.promiseMethod();
        this.showLoading=false;
        $("body").css("overflow","");
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
          this.tip_for_duplicate="数据重复("+rspnData.duplicate_recorders.length+"条),全部丢弃!";
          this.duplicateRecorders=rspnData.duplicate_recorders;
          $("#duplicate_recorders_shower").modal('show');
        }
        $('#openFileSelector').val('');
        this.showFilePicker=true;
        this.xlsData=[];
        this.xlsTitle=[];
      },
      promiseMethod :function (){

        var _this=this;
        var prmsData= new Promise((resolve, reject) => {//return
          this.$axios({
              method: 'post',
              url: 'Excel2tbl_Orders.php',
              data: qs.stringify(_this.xlsData)
          }).then((res) => {
// console.log(res.data);
// return;
            resolve(res.data);
          }).catch((err) => {
            reject(err);
          })
        });
        return prmsData;
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
              text: "呃...这个,我不会弄,请手动复制.",
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
#fromExcel, .tab-pane {
  overflow: auto;
}
/*#fromExcel {
  position: absolute;
    left: 50%;
  top: 30%;
transform: translate(-50%,-110%);
}*/
.clearBtn {
	margin-right: 20px;
}
.saveBtn, .clearBtn {
	width: 100px;
}
table {
  overflow: auto;
  font-size: 14px;
}
.mx-input-wrapper {
  width: 100%;
}
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
