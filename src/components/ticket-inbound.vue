<template>
<div class="father">
  <h5>当前位置:订单管理/机票入库</h5>
  <div id="fromExcel" class="container-fluid">
    <div class="get-xlsx">
      <div class="row">
        <div class="col-md form-inline">
          <div><!-- excelFileChanged -->
            <input id="openFileSelector" type="file" @change="excelChanged"  
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
          </div>
        </div>
        <div class="col-md  form-inline" v-if="xlsData.length">
          <button class="btn btn-secondary clearBtn" @click="clearXlsx">清空</button>
        </div> 
        <div class="col-md  form-inline" v-if="xlsData.length">
          <button class="btn btn-primary" @click="saveXlsxDataToDBS">保存</button>
        </div>                       
      </div>
    </div>
    <div><!--  class="tablebox" display:inline-block;-->
      <table class="table table-hover" v-if="xlsData.length">
        <thead>
          <th v-for="title in titls">{{title}}</th>
          <th>客户单位</th>
        </thead>
          <tbody style="overflow-y:auto;">
            <tr v-for="(row,index) in xlsData" :style="isRefounded(row)?style:''" >
              <td :title="row.票号">{{row.票号}}</td>
              <td :title="row.航班号">{{row.航班号}}</td>
              <td :title="row.乘机日期">{{row.乘机日期}}</td>
              <td :title="row.首航段">{{row.首航段}}</td>
              <td :title="row.票价">{{row.票价}}</td>
              <td :title="row.税">{{row.税}}</td>
              <td title="航空保险"><input type="number" v-model="insurances[index]" style="width:50px;"></td>
              <td :title="row.订单应收">{{row.订单应收}}</td>
              <td :title="row.已收金额">{{row.已收金额}}</td>
              <td :title="row.支付方式">{{row.支付方式}}</td>
              <td :title="row.退票手续费">{{row.退票手续费}}</td>
              <td :title="row.实退金额">{{row.实退金额}}</td>
              <td :title="row.乘机人">{{row.乘机人}}</td>
              <td>
                <select v-model="client_dptmts[index]">
                  <option>成果处</option>
                  <option>大工教务处</option>
                  <option>科技处</option>
                  <option>重大办</option>
                  <option>基建处</option>
                </select>
              </td>
            </tr>
          </tbody>
      </table>      
    </div>

  </div>
  <div class="modal fade" id="duplicate_shower" role="dialog" aria-labelledby="warning_for_duplicate" data-backdrop="static" data-keyboard: false>
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
      return{
        // xlsTitle:[],
        xlsData:[],
        tip_for_duplicate:'',
        duplicateRecorders:[],
        titls:['票号','航班号','乘机日期','首航段','票价','税','保险','采购金额','已付采购金额','支付方式','退票手续费','实退金额','乘机人'],
        style:'color:red;',
        client_dptmts:[],
        insurances:[],
      }
    },
    methods:{
      excelChanged (e) {
        if(!$('#openFileSelector').val()) {
          return;
        }
        if(!e.currentTarget.files.length) {//没有文件被选中 
          return;
        }
        if(this.xlsData.length>0){//如果已有数据,需清空
          // this.xlsTitle=[];
          this.xlsData=[];
        }
        var _this=this;
        var files = e.target.files;//是一个数组
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
          try {
            var data = ev.target.result;
            var workbook = XLSX.read(data, {type: 'binary'}); // 以二进制流方式读取得到整份excel表格对象
console.log(workbook);
return;
          } catch (e) {
            console.log(e);
            return;
          }
          var tempArry = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          if(tempArry.length<1) {
            _this.$toast({
              text: "空表!",
              type: 'danger',
              duration: 1000
            });
            $('#openFileSelector').val('');
            return;          
          } else {
            if(tempArry.length>120) {
              _this.$toast({
                text: "表中数据过多,一次不能超120条!",
                type: 'danger',
                duration: 3000
              });
              $('#openFileSelector').val('');
              return;                
            }
            //处理合并行数据
            var steps=tempArry.length;
            for(var i=0;i<steps;i++) {
              for(var prop in tempArry[i]) {
                if(prop==='票号' && tempArry[i][prop].search(/(\r\n|\n|\r)/gm)!==-1) {
                  tempArry[i].票号=tempArry[i].票号.replace(/(\r\n|\n|\r)/gm, ";");
                  var tickets=tempArry[i].票号.split(';');
                  tempArry[i].乘机人=tempArry[i].乘机人.replace(/(\r\n|\n|\r)/gm, ";");
                  var names=tempArry[i].乘机人.split(';');
                  //处理退票费,这里是按退票人数平均计算的.
                  var counterOfRefound=0;
                  var feeOfPerPerson=0;
                  var returnedAmountPrePerson=0;
                  for(var j=0;j<names.length;j++) {
                    if(names[j].indexOf('(退)')!==-1) {
                      counterOfRefound+=1;
                      feeOfPerPerson=parseInt(tempArry[i].退票手续费)/counterOfRefound;
                      returnedAmountPrePerson=parseInt(tempArry[i].实退金额)/counterOfRefound;
                    }
                  }
                  steps+=tickets.length;
                  for(var j=0;j<tickets.length;j++) {
                    var {...tmplt}=tempArry[i];
                    tmplt.票号=tickets[j];
                    tmplt.乘机人=names[j];
                    tmplt.票价=parseInt(tempArry[i].票价)/tickets.length;
                    tmplt.税=parseInt(tempArry[i].税)/tickets.length;
                    tmplt.订单应收=parseInt(tempArry[i].订单应收)/tickets.length;
                    tmplt.已收金额=parseInt(tempArry[i].已收金额)/tickets.length;
                    tmplt.票应收=parseInt(tempArry[i].票应收)/tickets.length;
                    if(names[j].indexOf('(退)')!==-1) {
                      tmplt.退票手续费=feeOfPerPerson;
                      tmplt.实退金额=returnedAmountPrePerson;
                    } else {
                      tmplt.退票手续费=0;
                      tmplt.实退金额=0;
                    }
                    var pstn=parseInt(i)+parseInt(j)+1;
                    tempArry.splice(pstn,0,tmplt);//新增一行数据
                  }
                  tempArry.splice(i,1);
                  i+=tickets.length-1;
                }
              }
            }
            //核心数据列
            var indispensableCellValue=['票号','航班号','乘机日期','首航段','票价','税','保险','订单应收','已收金额','支付方式','退票手续费','实退金额','乘机人'];
            var tempTitles=[];//获取表头,也就是属性名
            for (var index in tempArry) {
              _this.client_dptmts[index]='';
              for (var prop in tempArry[index]) {//tempArry[index]为对象--
                  if(index==0) {//获取表头,只创建一遍
                    tempTitles.push(prop);
                  }
                  // 处理小数格式的时间转为标准格式.setYear(time.getFullYear() - 70)
                  if(prop=='乘机日期' || prop=='出票时间' || prop=='收款时间'){
                    var tmpTime = new Date((tempArry[index][prop] - 1) * 24 * 3600000 + 1);
                    tmpTime.setYear(tmpTime.getFullYear() - 70);
                    tmpTime.setDate(tmpTime.getDate());
                    tempArry[index][prop]=tmpTime.format("yyyy-MM-dd");
                  }
                  //空白格用空格代替
                  tempArry[index][prop]=(tempArry[index][prop] || tempArry[index][prop]==0)?tempArry[index][prop]:'';
                  //必有列的单元格不能空
                  if(indispensableCellValue.includes(prop) && tempArry[index][prop]===''){
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

          }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
      },
      excelFileChanged:function(event){
        if(!$('#openFileSelector').val()) {
          return;
        }
        if(!event.currentTarget.files.length) {//没有文件被选中 
          return;
        }
        if(this.xlsData.length>0){//如果已有数据,需清空
          // this.xlsTitle=[];
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
              type: 'binary'//'base64''string'"binary"
            });
            var sheet2JSONOpts = {
              /** Default value for null/undefined values */
              defval: ''//给defval赋值为空的字符串
            }
            if(XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]],sheet2JSONOpts).length<1) {
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

              //处理合并行数据
              var steps=tempArry.length;
              for(var i=0;i<steps;i++) {
                for(var prop in tempArry[i]) {
                  if(prop==='票号' && tempArry[i][prop].search(/(\r\n|\n|\r)/gm)!==-1) {
                    tempArry[i].票号=tempArry[i].票号.replace(/(\r\n|\n|\r)/gm, ";");
                    var tickets=tempArry[i].票号.split(';');
                    tempArry[i].乘机人=tempArry[i].乘机人.replace(/(\r\n|\n|\r)/gm, ";");
                    var names=tempArry[i].乘机人.split(';');

                    //处理退票费,这里是按退票人数平均计算的.
                    var counterOfRefound=0;
                    var feeOfPerPerson=0;
                    var returnedAmountPrePerson=0;
                    for(var j=0;j<names.length;j++) {
                      if(names[j].indexOf('(退)')!==-1) {
                        counterOfRefound+=1;
                        feeOfPerPerson=parseInt(tempArry[i].退票手续费)/counterOfRefound;
                        returnedAmountPrePerson=parseInt(tempArry[i].实退金额)/counterOfRefound;
                      }
                    }

                    steps+=tickets.length;
                    for(var j=0;j<tickets.length;j++) {
                      var {...tmplt}=tempArry[i];
// console.log(tmplt);
                      tmplt.票号=tickets[j];
                      tmplt.乘机人=names[j];
                      tmplt.票价=parseInt(tempArry[i].票价)/tickets.length;
                      tmplt.税=parseInt(tempArry[i].税)/tickets.length;
                      tmplt.订单应收=parseInt(tempArry[i].订单应收)/tickets.length;
                      tmplt.已收金额=parseInt(tempArry[i].已收金额)/tickets.length;
                      tmplt.票应收=parseInt(tempArry[i].票应收)/tickets.length;
                      if(names[j].indexOf('(退)')!==-1) {
                        tmplt.退票手续费=feeOfPerPerson;
                        tmplt.实退金额=returnedAmountPrePerson;
                      } else {
                        tmplt.退票手续费=0;
                        tmplt.实退金额=0;
                      }
                      var pstn=parseInt(i)+parseInt(j)+1;
                      tempArry.splice(pstn,0,tmplt);//新增一行数据
                    }


                    tempArry.splice(i,1);
                    i+=tickets.length-1;
                  }
                }

              }

// return;

              //核心数据列
              var indispensableCellValue=['票号','航班号','乘机日期','首航段','票价','税','保险','订单应收','已收金额','支付方式','退票手续费','实退金额','乘机人'];
              var tempTitles=[];//获取表头,也就是属性名
              for (var index in tempArry) {
                _this.client_dptmts[index]='';
                for (var prop in tempArry[index]) {//tempArry[index]为对象--
                    if(index==0) {//获取表头,只创建一遍
                      tempTitles.push(prop);
                    }
                    // 处理小数格式的时间转为标准格式.setYear(time.getFullYear() - 70)
                    if(prop=='乘机日期' || prop=='出票时间' || prop=='收款时间'){
                      var tmpTime = new Date((tempArry[index][prop] - 1) * 24 * 3600000 + 1);
                      tmpTime.setYear(tmpTime.getFullYear() - 70);
                      tmpTime.setDate(tmpTime.getDate());
                      tempArry[index][prop]=tmpTime.format("yyyy-MM-dd");
                    }

                    //空白格用空格代替
                    tempArry[index][prop]=(tempArry[index][prop] || tempArry[index][prop]==0)?tempArry[index][prop]:'';
                    //必有列的单元格不能空
                    if(indispensableCellValue.includes(prop) && tempArry[index][prop]===''){
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
              // _this.xlsTitle=tempTitles;
            }
          }
          reader.readAsArrayBuffer(f);
        }
        reader.readAsBinaryString(f);
      },
      clearXlsx :function() {
        this.xlsData=[];
        this.client_dptmts=[];
        // this.xlsTitle=[];
        $('#openFileSelector').val('');
      },
      promiseMethod :function (){

        var _this=this;
        var prmsData= new Promise((resolve, reject) => {//return
          this.$axios({
              method: 'post',
              url: 'insertTktFromExcel.php',
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
console.log(rspnData);
// return;
        $('#openFileSelector').val(''); 
        $('#loadingModal').remove();
        $('.modal-backdrop').remove();
        $("body").attr("class","");
        if(rspnData.error === '' && rspnData.countOfInserted>0){
          if(rspnData.duplicate_recorders.length>1){//有重复数据
            this.tip_for_duplicate="成功保存:"+rspnData.countOfInserted+"条。丢弃重复数据:"+rspnData.duplicate_recorders.length+"条，以下为重复数据：";
            this.duplicateRecorders=rspnData.duplicate_recorders;
            $("#duplicate_shower").modal('show');            
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
          this.tip_for_duplicate="全部数据重复:";
          this.duplicateRecorders=rspnData.duplicate_recorders;
          $("#duplicate_shower").modal('show');
          // console.log(rspnData);
        }
        this.xlsData=[];
        // this.xlsTitle=[];
      },
      saveXlsxDataToDBS:function () {
        for(var i=0;i<this.client_dptmts.length;i++) {
          if(this.client_dptmts[i]==='') {
            this.$toast({
              text: "请点选客户单位!",
              type: 'danger',
              duration: 1500
            });
            return;
          }
          if(!this.insurances[i]) {//同时判断null 和undefinedtypeof(this.insurances[i]) == undefined && 
            this.$toast({
              text: "请填写保险!",
              type: 'danger',
              duration: 1500
            });
            return;
          }
        }
        for(var i=0;i<this.xlsData.length;i++) {
          this.xlsData[i].client_dptmt=this.client_dptmts[i];
          this.xlsData[i].保险=this.insurances[i];
        }
// console.log(this.xlsData);
// return;
       
        var rspnData=this.axiosAsync();
      },
      clearTitle(val) {
        // this.xlsTitle=val;
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
        $("#duplicate_shower").modal('hide');
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
    //初始化必须列   this.titls
    // var _this=this; 
    // this.titls=[];
    // this.$axios({
    //       method: 'post',
    //       url: 'getDictionaryOfFeildNames.php'
    //   }).then(function (response) {
    //     for(var index in response.data) {
    //       _this.titls.push(response.data[index].name_in_excel);
    //     }
    //   }).catch(function (error) {
    //     _this.$toast({
    //        text: '异步通信错误!'+error,
    //        type: 'danger',
    //         duration: 4000
    //     });
    //   });       
    },
    computed: {
      isRefounded() {
        return function(dataRow) {
          if((dataRow.乘机人).indexOf('(退)')!==-1) {
            return true;
          } else {
            return false;
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
/*#fromExcel, .tab-pane {
  overflow: auto;
}*/
.clearBtn {
  margin-right: 20px;
}
.saveBtn, .clearBtn {
  width: 100px;
}
table {
  overflow: auto;
  /*font-size: 12px;*/
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
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    /*max-width: 50px;*/
}
#board {
  text-align: left;
}
h5 {
  color: #007bff;
}
.tablebox {
  overflow:scroll;
  overflow-x:hidden;
}

</style>
