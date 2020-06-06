<template>
<div class="father">
  <h5>当前位置:基础数据/项目管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="form-group form-inline searchBar">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、规格型号等">
          <button @click="getListOfProject" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfProject"class="btn btn-secondary" type="button" v-if="listOfProject.length>0">清空</button>
        </div>
        <div class="col-lg createnewproject">
          <button @click="newCreateProject" class="btn btn-primary" type="button">新建项目</button>
        </div>
    </div>
    <div class="listShower" v-if="listOfProject.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in projectTitle">{{title}}</th>
        </thead>
        <tbody @click="clickedARecorderToModify">
          <tr v-for="row in listOfProject">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="showerOfProject" role="dialog" aria-labelledby="newCreateProject" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          项目编辑器--项目ID:{{project.id}}
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfProject">名称:</label>
                <input id="inputNameOfProject" type="text" name="name" class="form-control" v-model="project.name" placeholder="项目名称" title="项目名称">
              </div>
              <div class="col-lg form-inline">
                <label for="inputContacterOfProject">联系:</label>
                <input id="inputContacterOfProject" type="text" name="contacter" class="form-control" v-model="project.contacter" placeholder="甲方联系人" title="甲方联系人">
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="slctPartner">甲方:</label>
                <select id="slctPartner" type="text" name="partner" class="form-control" v-model="project.partner" placeholder="甲方名称" title="甲方名称">
                  <option v-for="item in clntPrntOgnztns">{{item.short_name}}</option>
                </select>                
              </div>
              <div class="col-lg form-inline">
                <label for="inputBasicContentsOfProject">内容:</label>
                <input id="inputBasicContentsOfProject" type="text" name="contents" class="form-control" v-model="project.contents" placeholder="项目内容" title="项目主要内容的概括">
              </div>                             
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputStartDateOfProject">开始:</label>
                <input id="inputStartDateOfProject" type="date" name="startDate" class="form-control" v-model="project.startDate" placeholder="项目预计开始日期" title="项目预计开始日期">
              </div> 
              <div class="col-lg form-inline">
                <label for="inputEndDateOfProject">结束:</label>
                <input id="inputEndDateOfProject" type="date" name="endDate" class="form-control" v-model="project.endDate" placeholder="项目预计结束日期" title="项目预计结束日期">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputAddressOfProject">地点:</label>
                <input id="inputAddressOfProject" type="text" name="address" class="form-control" v-model="project.address" placeholder="项目举办地点" title="项目举办地点">
              </div> 
              <div class="col-lg form-inline">
                <label for="slctManagerOfProject">负责:</label>
                <select id="slctManagerOfProject" type="text" name="manager" class="form-control" v-model="project.manager" placeholder="我方项目负责人" title="我方项目负责人">
                  <option v-for="item in employees">{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="slctContract">合同:</label>
                <select id="slctContract" type="text" name="numOfContract" class="form-control" v-model="project.numOfContract" placeholder="项目合同号" title="项目合同号">
                  <option v-for="item in contracts">{{item.number}}</option>
                </select>  
              </div>                                        
              <div class="col-lg form-inline">
                <label for="inputScale">规模:</label>
                <input id="inputScale" type="text" name="scale" class="form-control" v-model="project.scale" placeholder="项目规模" title="项目规模">
              </div> 
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputIsFinished">结束:</label>
                <input id="inputIsFinished" type="text" name="is_finished" class="form-control" v-model="project.is_finished" placeholder="完成状态" title="0:未完成;1已完成">                
              </div> 
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" name="remark" class="form-control" v-model="project.remark" placeholder="备注信息" title="项目其它需记录的事项">
              </div>
            </div>                        
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="saveInputedData">保存</button> 
        </div>  
      </div>
    </div>
  </div>   
</div>
</template>


<script>
import qs from 'qs';
  export default {
    data () {
      return {
        queryContent:{
          keyWord:''
        },
        listOfProject:[],
        projectTitle:[],
        project:{
          name:'',
          contacter:'',
          partner:'',
          contents:'',
          startDate:'',
          endDate:'',
          is_finished:0,
          address:'',
          id_manager:1,
          manager:'',
          numOfContract:'',
          id_contract:'',
          scale:'',
          remark:'',
          name_and_startdate:''
        },
        employees:[],
        contracts:[],
        clntPrntOgnztns:[]
      }
    },
    methods:{
      getListOfProject() {
        var _this = this;
        this.listOfProject=[];
        this.projectTitle=[];
        this.$axios.get('getProject.php')
          .then(function (response) {
            _this.listOfProject = response.data;
            var ttl='';
            for(ttl in response.data[0]) {
              _this.projectTitle.push(ttl);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      clearlistOfProject() {
        this.listOfProject=[];
        this.projectTitle=[];
      },
      newCreateProject() {
        this.project.id='';
        this.project.name='';
        this.project.contacter='';
        this.project.partner='';
        this.project.contents='';
        this.project.startDate='';
        this.project.endDate='';
        this.project.is_finished=0;
        this.project.address='';
        this.project.id_manager=1;
        this.project.manager='';
        this.project.numOfContract='';
        this.project.scale='';
        this.project.remark='';
        this.project.name_and_startdate='';        
        $('#showerOfProject').modal('toggle');
      },
      clickedARecorderToModify(e) {
        var el=e.toElement.parentElement;
        this.project.id=el.children[0].innerHTML;
        this.project.name=el.children[1].innerHTML;
        this.project.contacter=el.children[2].innerHTML;
        this.project.partner=el.children[3].innerHTML;
        this.project.contents=el.children[4].innerHTML;
        this.project.startDate=el.children[5].innerHTML;
        this.project.endDate=el.children[6].innerHTML;
        this.project.is_finished=el.children[7].innerHTML;
        this.project.address=el.children[8].innerHTML;
        this.project.id_manager=el.children[9].innerHTML;
        this.project.manager=el.children[10].innerHTML;
        this.project.numOfContract=el.children[11].innerHTML;
        this.project.scale=el.children[12].innerHTML;
        this.project.remark=el.children[13].innerHTML;
        this.project.name_and_startdate=el.children[14].innerHTML;
        $('#showerOfProject').modal('toggle');
      },
      saveInputedData() {
        for(var prop in this.project) {
          if(prop!=='id' && prop!=='is_finished' && prop!=='numOfContract' && prop!=='id_manager' && prop!=='remark' && prop!=='name_and_startdate' && prop!=='id_contract') {
            if(this.project[prop].length<2) {
            this.$toast({
              text: prop+'不能少于2个字',
              type: 'info',
              duration: 2000
            });
            return;              
            }
          }
        }
        //获取负责人ID
        for(var i=0;i<this.employees.length;i++) {
          if(this.project.manager===this.employees[i].name) {
            this.project.id_manager=this.employees[i].id;
          }
        }
        //获取合同ID
        if(this.project.numOfContract.length>9) {
          for(var i=0;i<this.contracts.length;i++) {
            if(this.project.numOfContract===this.contracts[i].number) {
              this.project.id_contract=this.contracts[i].id;
            } else {
              if(i==this.contracts.length-1) {
                this.$toast({
                   text: '系统中没有此合同号,请先新建合同',
                   type: 'info',
                   duration: 3000
                });
                return;
              }
            }
          }           
        }
       
        var _this=this;
        var url='';
        if(this.project.id!=='') {
          url='updateTblProject.php';
        } else {
          url='insertNewToProject.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.project)
        }).then(function (response) {
// console.log(response.data);
// return;          
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                 duration: 800
              });
            $('#showerOfProject').modal('toggle');
            _this.listOfProject=[];
            _this.projectTitle=[];              
            _this.project.id='';            
            _this.project.name='';
            _this.project.contacter='';
            _this.project.partner='';
            _this.project.contents='';
            _this.project.startDate='';
            _this.project.endDate='';
            _this.project.is_finished=0;
            _this.project.address='';
            _this.project.id_manager=1;
            _this.project.manager='';
            _this.project.numOfContract='';
            _this.project.id_contract='';
            _this.project.scale='';
            _this.project.remark='';
            _this.project.name_and_startdate='';
          } else {
        console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 4000
            });
            $('#showerOfProject').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
             duration: 4000
          });
          $('#showerOfProject').modal('toggle');
        });
      }
    },
    beforeCreate:function() {
      //初始化员工option
      this.employees=[];
      var _this = this;
      this.$axios({
            method: 'post',
            url: 'getEmployees.php'
        })
        .then(function (response) {
          _this.employees=response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.contracts=[];
      this.$axios({
            method: 'post',
            url: 'getContracts.php'
        })
        .then(function (response) {
          _this.contracts=response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.clntPrntOgnztns=[];
      var queryContent={keyWord:''};
      this.$axios({
            method: 'post',
            url: 'getClntPrntOgnztn.php',
            data:qs.stringify(queryContent)
        })
        .then(function (response) {
          _this.clntPrntOgnztns=response.data;
        })
        .catch(function (error) {
          console.log(error);
        });                 
    }     
  }  
</script>

<style scoped>
.father {
  width: 100%;
}
h5 {
  color: #007bff;
}
#showerOfProject input,#showerOfProject select {
  width: 80%;
}
.createnewproject {
  text-align: right;
}
.row {
  margin-top: 10px;
}  
</style>