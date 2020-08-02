<template>
<div class="father">
  <h5>当前位置:基础数据/员工管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="form-group form-inline searchBar">
        <div class="col-lg">
          <button @click="getListOfEmployees" class="btn btn-primary" type="button">获取员工名册</button>
          <button @click="clearlistOfEmployees"class="btn btn-secondary" type="button" v-if="listOfEmployees.length>0">清空</button>
        </div>
        <div class="col-lg createnewemployee">
          <button @click="newCreateEmployee" class="btn btn-primary" type="button">新建员工</button>
        </div>
    </div>
    <div class="listShower" v-if="listOfEmployees.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfList" :width="widthOfTitle[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfEmployees" @click="clickedARecorderToModify(row)">
            <td :title='row.name'>{{row.name}}</td>
            <td :title='row.gender'>{{row.gender}}</td>
            <td :title='row.address'>{{row.address}}</td>
            <td :title='row.tel_private'>{{row.tel_private}}</td>
            <td :title='row.tel_work'>{{row.tel_work}}</td>
            <td :title='row.emergency_contacter'>{{row.emergency_contacter}}</td>
            <td :title='row.tel_emergency'>{{row.tel_emergency}}</td>
            <td :title='row.date_join'>{{row.date_join}}</td>
            <td title='所在部门'>{{row.name_department}}</td>
            <td :title='row.position'>{{row.position}}</td>
            <td :title='row.certificate_and_rank'>{{row.certificate_and_rank}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="showerOfEmployee" role="dialog" aria-labelledby="newCreateEmployee" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          员工编辑器--员工ID:{{employee.id}}
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfEmployee">员工姓名:</label>
                <input id="inputNameOfEmployee" type="text" name="name" class="form-control" v-model="employee.name" placeholder="员工姓名" title="员工姓名">
              </div>
              <div class="col-lg form-inline">
                <label for="inputGender">员工性别:</label>
                <select id="inputGender" type="text" name="gender" class="form-control" v-model="employee.gender" placeholder="性别" title="性别">
                  <option v-for="item in genders">{{item.name}}</option>
                </select>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBornDate">出生日期:</label>
                <input id="inputBornDate" type="date" name="born_date" class="form-control" v-model="employee.born_date" placeholder="出生日期" title="出生日期">
              </div>
              <div class="col-lg form-inline">
                <label for="inputIdcard">身份证号:</label>
                <input id="inputIdcard" type="text" name="idcard" class="form-control" v-model="employee.idcard" placeholder="身份证号" title="身份证号">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputEducation">最高学历:</label>
                <input id="inputEducation" type="text" name="education" class="form-control" v-model="employee.education" placeholder="最高学历" title="最高学历">
              </div> 
              <div class="col-lg form-inline">
                <label for="inputGraduateFrom">毕业院校:</label>
                <input id="inputGraduateFrom" type="text" name="graduate_from" class="form-control" v-model="employee.graduate_from" placeholder="毕业院校" title="毕业院校">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputAddress">家庭住址:</label>
                <input id="inputAddress" type="text" name="address" class="form-control" v-model="employee.address" placeholder="家庭住址" title="家庭住址">
              </div>
              <div class="col-lg form-inline">
                <label for="inputPrvtTel">个人电话:</label>
                <input id="inputPrvtTel" type="text" name="tel_private" class="form-control" v-model="employee.tel_private" placeholder="个人电话" title="个人电话">
              </div>              
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputWorkTel">办公电话:</label>
                <input id="inputWorkTel" type="text" name="tel_work" class="form-control" v-model="employee.tel_work" placeholder="办公电话" title="办公电话">
              </div>
              <div class="col-lg form-inline">
                <label for="inputEmrgcCntactr">紧急联系:</label>
                <input id="inputEmrgcCntactr" type="text" name="emergency_contacter" class="form-control" v-model="employee.emergency_contacter" placeholder="紧急联系人" title="紧急联系人">
              </div>              
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputTelInEmrgc">紧急电话:</label>
                <input id="inputTelInEmrgc" type="text" name="tel_emergency" class="form-control" v-model="employee.tel_emergency" placeholder="紧急联系电话" title="紧急联系电话">
              </div>
              <div class="col-lg form-inline">
                <label for="inputJoinDate">入职日期:</label>
                <input id="inputJoinDate" type="date" name="date_join" class="form-control" v-model="employee.date_join" placeholder="入职日期" title="入职日期" :readonly="!isNewCreated">
              </div>              
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputAddress">所在部门:</label>
                <select id="inputAddress" type="text" name="id_department" class="form-control" v-model="employee.id_department" placeholder="所在部门" title="所在部门">
                  <option v-for="item in departments" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="inputPosition">担任职务:</label>
                <input id="inputPosition" type="text" name="position" class="form-control" v-model="employee.position" placeholder="担任职务" title="担任职务">
              </div>              
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputCrtfctRnk">等级证书:</label>
                <input id="inputCrtfctRnk" type="text" name="certificate_and_rank" class="form-control" v-model="employee.certificate_and_rank" placeholder="等级证书" title="等级证书">
              </div>
              <div class="col-lg form-inline">
                <label for="inputRemark">备注信息:</label>
                <input id="inputRemark" type="text" name="remark" class="form-control" v-model="employee.remark" placeholder="备注信息" title="备注信息">
              </div>
            </div>
            <div class="row" v-show="!isNewCreated">
              <div class="col-lg form-inline">
                <label for="inputLeaveDate">离职日期:</label>
                <input id="inputLeaveDate" type="date" name="date_leave" class="form-control" v-model="employee.date_leave" placeholder="离职日期" title="离职日期">
              </div>              
              <div class="col-lg form-inline" v-show="!isNewCreated">
                <label for="inputWhyLeave">离职原因:</label>
                <input id="inputWhyLeave" type="text" name="why_leave" class="form-control" v-model="employee.why_leave" placeholder="离职原因" title="离职原因">
              </div>
            </div>
            <div class="row" v-show="!isNewCreated">
              <div class="col-lg form-inline">
                <label for="slctCreater">建档员工:</label>
                <select id="slctCreater" type="text" name="id_creater" class="form-control" v-model="employee.id_creater" placeholder="建档员工" title="建档员工" disabled>
                  <option v-for="item in operators" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="inputTimeCreate">建档日期:</label>
                <input id="inputTimeCreate" type="date" name="time_create" class="form-control" v-model="employee.time_create" placeholder="建档日期" title="建档日期" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputFrom">来自哪里:</label>
                <input id="inputFrom" type="text" name="from_ognztn" class="form-control" v-model="employee.from_ognztn" placeholder="来自哪里" title="来自哪里">
              </div>
              <div class="col-lg form-inline">
                <label for="inputIsOwn">是否自有:</label>
                <input id="inputIsOwn" type="text" name="is_own" class="form-control" v-model="employee.is_own" placeholder="是否自有" title="1:自有;0:外协">
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
        listOfEmployees:[],
        titleOfList:['姓名','性别','家庭住址','个人电话','工作电话','紧急联系人','紧急电话','入职日期','所在部门','职务','等级证书'],
        widthOfTitle:['6%','4%','15%','9%','9%','9%','9%','12%','9%','9%','9%'],
        employee:{
          id:'',
          name:'',
          gender:'女',
          born_date:'',
          idcard:'',
          education:'',
          graduate_from:'',
          address:'',
          tel_private:'',
          tel_work:'',
          emergency_contacter:'',
          tel_emergency:'',
          date_join:'',
          id_department:'',
          position:'',
          certificate_and_rank:'',
          date_leave:'',
          why_leave:'',
          id_creater:1,
          time_create:'',
          time_last_modify:'',
          remark:'',
          from_ognztn:'',
          is_own:1
        },
        operators:this.$store.state.employees,
        genders:[{id:0,name:'女'},{id:1,name:'男'}],
        departments:this.$store.state.ourDepartments,
        isNewCreated:false
      }
    },
    methods:{
      getListOfEmployees() {
        this.listOfEmployees=this.$store.state.myEmplys;
        this.isNewCreated=false;
      },
      clearlistOfEmployees() {
        this.listOfEmployees=[];
      },
      newCreateEmployee() {
        this.clearlistOfEmployees();
        this.employee={};
        this.employee.id='';
        this.employee.name='';
        this.employee.gender='女';
        this.employee.born_date='';
        this.employee.idcard='';
        this.employee.education='';
        this.employee.from_ognztn='';
        this.employee.graduate_from='';
        this.employee.address='';
        this.employee.tel_private='';
        this.employee.tel_work='';
        this.employee.emergency_contacter='';
        this.employee.tel_emergency='';
        this.employee.date_join='';
        this.employee.id_department='';
        this.employee.position='';
        this.employee.certificate_and_rank='';
        this.employee.remark='';
        this.isNewCreated=true;
        this.employee.is_own=1;

        $('#showerOfEmployee').modal('toggle');
      },
      clickedARecorderToModify(dataRow) {
        this.employee=dataRow;
        $('#showerOfEmployee').modal('toggle');
      },
      saveInputedData() {
        if(this.employee.name.length<2) {
          this.$toast({
            text: '姓名不能少于2个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.employee.tel_private.length<8) {
          this.$toast({
            text: '个人电话不能少于8位数!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.employee.tel_work.length<8) {
          this.$toast({
            text: '工作电话不能少于8位数!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        // if(this.employee.name.length<2) {
        //   this.$toast({
        //     text: '姓名不能少于2个字!',
        //     type: 'info',
        //     duration: 2000
        //   });
        //   return;              
        // }
        if(this.employee.id_department.length<1) {
          this.$toast({
            text: '请选择部门!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.employee.date_leave) {
          if(this.employee.why_leave.length<4 || !this.employee.why_leave) {
            this.$toast({
              text: '离职原因不能少于4个字',
              type: 'info',
              duration: 2000
            });
            return;
          }
        }
        var _this=this;
        var url='';
        if(this.employee.id!=='') {
          url='updateEmployees.php';
          this.employee.conditions='updateInfos';
          this.employee.id_last_modifyer=this.$store.state.user.id_user;
        } else {
          this.employee.id_creater=this.$store.state.user.id_user;
          url='insertNewToEmployees.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.employee)
        }).then(function (response) {
          if(response.data==true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#showerOfEmployee').modal('toggle');
            _this.listOfEmployees=[];
            _this.$store.dispatch('getMyEmplys',_this);
          } else {
            console.log(response.data);
            $('#showerOfEmployee').modal('toggle');
            _this.$toast({
              text: '通信错误!',
              type: 'danger',
              duration: 4000
            });
          } 
        }).catch(function (error) {
          $('#showerOfEmployee').modal('toggle');
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });
      }
    },
    beforeCreate:function() {
    },
    computed:{

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
#showerOfEmployee input,#showerOfEmployee select {
  width: 80%;
}
.createnewemployee {
  text-align: right;
}
.row {
  margin-top: 10px;
}  
</style>