<template>
<div class="father">
  <h5>当前位置:基础数据/员工管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="form-group form-inline searchBar">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="姓名等等">
          <button @click="getListOfEmployees" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfEmployees"class="btn btn-secondary" type="button" v-if="listOfEmployees.length>0">清空</button>
        </div>
        <div class="col-lg createnewemployee">
          <button @click="newCreateEmployee" class="btn btn-primary" type="button">新建员工</button>
        </div>
    </div>
    <div class="listShower" v-if="listOfEmployees.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfEmployees" @click="clickedARecorderToModify(row)">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
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
                <select id="inputAddress" type="text" name="name_department" class="form-control" v-model="employee.name_department" placeholder="所在部门" title="所在部门">
                  <option v-for="item in departments">{{item.name}}</option>
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
                <label for="inputCreater">建档员工:</label>
                <input id="inputCreater" type="text" name="name_operator" class="form-control" v-model="employee.name_operator" placeholder="建档员工" title="建档员工" readonly>
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
        titleOfList:[],
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
          name_department:'',
          position:'',
          certificate_and_rank:'',
          date_leave:'',
          why_leave:'',
          id_operator:1,
          name_operator:'',
          time_create:'',
          time_last_modify:'',
          remark:'',
          from_ognztn:'',
          is_own:1
        },
        operators:[],
        genders:[{id:0,name:'女'},{id:1,name:'男'}],
        departments:[],
        isNewCreated:false
      }
    },
    methods:{
      getListOfEmployees() {
        var _this = this;
        this.listOfEmployees=[];
        this.titleOfList=[];
        this.$axios({
          method: 'post',
          url: 'getEmployees.php',
        }).then(function (response) {
          if(response.data.length>0) {
            _this.listOfEmployees = response.data;
            var ttl='';
            for(ttl in response.data[0]) {
              _this.titleOfList.push(ttl);
            }              
          } else {
            this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });              
          }
        }).catch(function (error) {
          console.log(error);
        });
        this.isNewCreated=false;
      },
      clearlistOfEmployees() {
        this.listOfEmployees=[];
        this.titleOfList=[];
      },
      newCreateEmployee() {
        this.clearlistOfEmployees();
        this.employee.id='';
        this.employee.name='';
        this.employee.gender='女';
        this.employee.born_date='';
        this.employee.idcard='';
        this.employee.education='';
        this.employee.graduate_from='';
        this.employee.address='';
        this.employee.tel_private='';
        this.employee.tel_work='';
        this.employee.emergency_contacter='';
        this.employee.tel_emergency='';
        this.employee.date_join='';
        this.employee.id_department='';
        this.employee.name_department='';
        this.employee.position='';
        this.employee.certificate_and_rank='';
        this.employee.date_leave='';
        this.employee.why_leave='';
        this.employee.id_operator='';
        this.employee.name_operator='';
        this.employee.time_create='';
        this.employee.time_last_modify='';
        this.employee.remark='';
        this.isNewCreated=true;
        $('#showerOfEmployee').modal('toggle');
      },
      clickedARecorderToModify(dataRow) {
        // console.log(dataRow);
        // return;
        this.employee=dataRow;
        // this.employee.id=dataRow.id;
        // this.employee.name=dataRow.name;
        // this.employee.gender=dataRow.gender;
        // this.employee.born_date=dataRow.born_date;
        // this.employee.idcard=dataRow.idcard;
        // this.employee.education=dataRow.education;
        // this.employee.graduate_from=dataRow.graduate_from;
        // this.employee.address=dataRow.address;
        // this.employee.tel_private=dataRow.tel_private;
        // this.employee.tel_work=dataRow.tel_work;
        // this.employee.emergency_contacter=dataRow.emergency_contacter;
        // this.employee.tel_emergency=dataRow.tel_emergency;
        // this.employee.date_join=dataRow.date_join;
        // this.employee.id_department=dataRow.id_department;
        // this.employee.name_department=dataRow.name_department;
        // this.employee.position=dataRow.position;
        // this.employee.certificate_and_rank=dataRow.certificate_and_rank;
        // this.employee.date_leave=dataRow.date_leave;
        // this.employee.why_leave=dataRow.why_leave;
        // this.employee.id_operator=dataRow.id_operator;
        // this.employee.name_operator=dataRow.name_operator;
        // this.employee.time_create=dataRow.time_create;
        // this.employee.time_last_modify=dataRow.time_last_modify;
        // this.employee.remark=dataRow.remark;
        // this.employee.is_own=dataRow.is_own;
        $('#showerOfEmployee').modal('toggle');
      },
      saveInputedData() {
        for(var prop in this.employee) {
          if(prop!=='id' && prop!=='gender' && prop!=='id_department' && prop!=='id_operator' && prop!=='name_operator' && prop!=='remark' && prop!=='time_create' && prop!=='date_leave' && prop!=='why_leave' && prop!=='time_last_modify' && prop!=='is_own' && prop!=='from_ognztn' && prop!=='id_creater' && prop!=='id_last_modifyer') {
            if(this.employee[prop] && this.employee[prop].length<2) {
            this.$toast({
              text: prop+'的输入不符合要求',
              type: 'info',
              duration: 2000
            });
            return;              
            }
          }
        }
        if(this.employee.date_leave) {
          if(this.employee.why_leave.length<4 || !this.employee.why_leave) {
            this.$toast({
              text: '离职原因不符合要求',
              type: 'info',
              duration: 2000
            });
            return;
          }
        }
        //获取部门ID
        for(var i=0;i<this.departments.length;i++) {
          if(this.employee.name_department===this.departments[i].name) {
            this.employee.id_department=this.departments[i].id;
          }
        }
        //获取建档人ID和修改人ID
        for(var i=0;i<this.operators.length;i++) {
          if(this.employee.name_operator===this.operators[i].name) {
            this.employee.id_operator=this.operators[i].id;
          }
        }
        this.employee.id_operator=this.$store.state.user.id_user;
// console.log(this.employee);
// return;
        var _this=this;
        var url='';
        if(this.employee.id!=='') {
          url='updateEmployees.php';
          this.employee.conditions='updateInfos';
        } else {
          url='insertNewToEmployees.php';
          
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.employee)
        }).then(function (response) {
// console.log(response.data);
// return;
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#showerOfEmployee').modal('toggle');
            _this.listOfEmployees=[];
            _this.titleOfList=[];              
            _this.employee.id='';
            _this.employee.name='';
            _this.employee.gender='女';
            _this.employee.born_date='';
            _this.employee.idcard='';
            _this.employee.education='';
            _this.employee.graduate_from='';
            _this.employee.address='';
            _this.employee.tel_private='';
            _this.employee.tel_work='';
            _this.employee.emergency_contacter='';
            _this.employee.tel_emergency='';
            _this.employee.date_join='';
            _this.employee.id_department='';
            _this.employee.name_department='';
            _this.employee.position='';
            _this.employee.certificate_and_rank='';
            _this.employee.date_leave='';
            _this.employee.why_leave='';
            _this.employee.id_operator='';
            _this.employee.name_operator='';
            _this.employee.time_create='';
            _this.employee.time_last_modify='';
            _this.employee.remark='';
          } else {
            console.log(response.data);
            _this.$toast({
              text: '通信错误!'+response.data,
              type: 'danger',
              duration: 4000
            });
            $('#showerOfEmployee').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
          $('#showerOfEmployee').modal('toggle');
        });
      }
    },
    beforeCreate:function() {
      //初始化部门option
      this.departments=[];
      var _this = this;
      this.$axios({
        method: 'post',
        url: 'getDepartments.php'
      }).then(function (response) {
        _this.departments=response.data;
      }).catch(function (error) {
        console.log(error);
      });
      //初始化操作人option
      this.operators=[];
      this.$axios({
        method: 'post',
        url: 'getEmployees.php'
      }).then(function (response) {
        _this.operators=response.data;
      }).catch(function (error) {
        console.log(error);
      });        
    }     
  }  
</script>

<style scoped>
.father {
  width: 100%;
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