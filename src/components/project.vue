<template>
<div class="father">
  <h5>当前位置:基础数据/项目管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="form-group form-inline searchBar">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、规格型号等">
          <button @click="getAllProjects" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="allProjects=[];"class="btn btn-secondary" type="button" v-if="allProjects.length>0">清空</button>
        </div>
        <div class="col-lg createnewproject">
          <button @click="newCreateProject" class="btn btn-primary" type="button">新建项目</button>
        </div>
    </div>
    <div class="listShower" v-if="allProjects.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in projectTitle" :width="titleWidth[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in allProjects" @click="clickedARecorderToModify(row)">
            <td :title='row.name'>{{row.name}}</td>
            <td :title='row.name_part_a'>{{row.name_part_a}}</td>
            <td :title='row.contacter_and_tel'>{{row.contacter_and_tel}}</td>
            <td :title='row.content'>{{row.content}}</td>
            <td :title='row.time_start'>{{row.time_start}}</td>
            <td :title='row.time_end'>{{row.time_end}}</td>
            <td :title='row.address_of_project'>{{row.address_of_project}}</td>
            <td :title='row.scale'>{{row.scale}}</td>
            <td title='0:进行中,1:已结束'>{{row.is_finished}}</td>
            <td :title='row.manager'>{{row.manager}}</td>
            <td :title='row.num_contract'>{{row.num_contract}}</td>
            <td title='1:公司自有项目,0:非公司项目'>{{row.is_own}}</td>
            <td :title='row.other'>{{row.other}}</td>
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
                <label for="cntctr">联系:</label>
                <input id="cntctr" type="text" name="contacter_and_tel" class="form-control" v-model="project.contacter_and_tel" placeholder="甲方联系人及电话" title="甲方联系人及电话">
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="slctPartner">甲方:</label>
                <select id="slctPartner" type="text" name="name_part_a" class="form-control" v-model="project.name_part_a" placeholder="甲方名称" title="甲方名称">
                  <option v-for="item in clntPrntOgnztns">{{item.short_name}}</option>
                  <option value=0>选择甲方</option>
                </select>                
              </div>
              <div class="col-lg form-inline">
                <label for="content">内容:</label>
                <input id="content" type="text" name="content" class="form-control" v-model="project.content" placeholder="项目内容" title="项目主要内容的概括">
              </div>                             
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="timestart">开始:</label>
                <input id="timestart" type="date" name="time_start" class="form-control" v-model="project.time_start" placeholder="项目预计开始日期" title="项目预计开始日期">
              </div> 
              <div class="col-lg form-inline">
                <label for="timeend">结束:</label>
                <input id="timeend" type="date" name="time_end" class="form-control" v-model="project.time_end" placeholder="项目预计结束日期" title="项目预计结束日期">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="address">地点:</label>
                <input id="address" type="text" name="address_of_project" class="form-control" v-model="project.address_of_project" placeholder="项目举办地点" title="项目举办地点">
              </div> 
              <div class="col-lg form-inline">
                <label for="slctManagerOfProject">负责:</label>
                <select id="slctManagerOfProject" type="text" name="id_manager" class="form-control" v-model="project.id_manager" placeholder="我司项目负责人" title="我司项目负责人">
                  <option  value=0>我司项目负责人</option>
                  <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="slctContract">合同:</label>
                <select id="slctContract" type="text" name="id_contract" class="form-control" v-model="project.id_contract" placeholder="项目合同号" title="项目合同号">
                  <option v-for="item in contracts" :value="item.id">{{item.number}}</option>
                  <option value=0>没有合同号</option>
                </select>  
              </div>                                        
              <div class="col-lg form-inline">
                <label for="inputScale">规模:</label>
                <input id="inputScale" type="text" name="scale" class="form-control" v-model="project.scale" placeholder="项目规模" title="项目规模">
              </div> 
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="isfinished">完成:</label>
                <select id="isfinished" type="text" name="is_finished" class="form-control" v-model="project.is_finished" title="此项目是否已经完成">
                  <option value=0>未完成</option>
                  <option value=1>已完成</option>
                  <option value=2>是否已完成</option>
                </select>
              </div> 
              <div class="col-lg form-inline">
                <label for="isown">自有:</label>
                <select id="isown" type="text" name="is_own" class="form-control" v-model="project.is_own" title="是否是公司主(承、举)办的项目">
                  <option v-for="item in owners" :value="item.id">{{item.owner}}</option>
                </select>  
              </div>                                        
            </div>                        
            <div class="row">
              <div class="col-lg form-inline">
                <label for="other">备注:</label>
                <input id="other" type="text" name="other" class="form-control" v-model="project.other" placeholder="备注信息" title="项目其它需记录的事项">
              </div>
              <div class="col-lg form-inline">
              </div>
            </div>                        
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="saveProject">保存</button>
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
        allProjects:[],
        projectTitle:['项目名称','甲方','联系人及电话','主要内容','开始日期','结束日期','项目举办地点','项目规模','完成状态','负责人','合同号','自有','备注'],
        titleWidth:['7%','8%','9%','9%','9%','9%','9%','7%','7%','7%','7%','6%','6%'],
        project:{
          address_of_project:'',
          name:'',
          contacter_and_tel:'',
          name_part_a:0,
          content:'',
          time_start:'',
          time_end:'',
          is_finished:2,
          id_manager:0,
          id_contract:0,
          scale:'',
          other:'',
          is_own:2
        },
        employees:this.$store.state.employees,
        contracts:[],
        owners:[{id:0,owner:'外部项目'},{id:1,owner:'我司项目'},{id:2,owner:'是否是我司项目'}],
        clntPrntOgnztns:this.$store.state.clntParentOgnztns,
      }
    },
    methods:{
      getAllProjects() {
        this.allProjects=this.$store.state.projects;
      },
      newCreateProject() {
        this.allProjects=[];
        this.project.id='';
        this.project.address_of_project='';
        this.project.name='';
        this.project.contacter_and_tel='';
        this.project.name_part_a=0;
        this.project.content='';
        this.project.time_start='';
        this.project.time_end='';
        this.project.is_finished=2;
        this.project.id_manager=0;
        this.project.id_contract=0;
        this.project.scale='';
        this.project.other='';
        this.project.is_own=2;
        $('#showerOfProject').modal('toggle');
      },
      clickedARecorderToModify(r) {
        this.project=r;
        $('#showerOfProject').modal('toggle');
      },
      saveProject() {
        if(this.project.name.length<4) {
          this.$toast({
            text: '名称不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.contacter_and_tel.length<9) {
          this.$toast({
            text: '联系不能少于9个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.name_part_a==0) {
          this.$toast({
            text: '请选择甲方!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.name_part_a.length<2) {
          this.$toast({
            text: '请选择甲方名称',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.content.length<4) {
          this.$toast({
            text: '主要内容不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(!this.project.time_end || !this.project.time_start || this.project.time_start>this.project.time_end) {
          this.$toast({
            text: '日期设置错误',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.address_of_project.length<4) {
          this.$toast({
            text: '项目举办地点不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.id_manager==0) {
          this.$toast({
            text: '请选择此项目负责人',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(Number(this.project.scale)<1) {
          this.$toast({
            text: '规模不能小于1!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.is_finished==2) {
          this.$toast({
            text: '请选择是否已完成',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.project.is_own==2) {
          this.$toast({
            text: '请选择是否我司项目!',
            type: 'info',
            duration: 2000
          });
          return;              
        }

        var _this=this;
        var url='';
        if(this.project.id!=='') {
          url='updateTblProject.php';
          this.project.conditons="updateProject";
        } else {
          url='insertNewToProject.php';
          this.project.conditons="insertNewProject";
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.project)
        }).then(function (response) {
          if(response.data===true) {
            _this.$toast({
              text: '成功保存数据!',
              type: 'success',
              duration: 800
            });
            $('#showerOfProject').modal('toggle');
            _this.newCreateProject();
            _this.$store.dispatch('getProjects',_this);
          } else {
            console.log(response.data);
            $('#showerOfProject').modal('toggle');
            _this.$toast({
              text: '通信错误!'+response.data,
              type: 'danger',
              duration: 4000
            });
          } 
        }).catch(function (error) {
          console.log(error);
          $('#showerOfProject').modal('toggle');
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });
      }
    },
    beforeCreate:function() {
      this.contracts=[];
      var _this=this;
      this.$axios({
        method: 'post',
        url: 'getContracts.php'
      }).then(function (response) {
        _this.contracts=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '通信错误!'+response.data,
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