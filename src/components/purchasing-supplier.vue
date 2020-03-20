<template>
  <div class="container-fluid">
    <div class="titleOfPS">
      <span class="titleOfPS">采购请购供应商</span>
    </div>  	
    <div id="tbmnPS">
	  <ul class="nav nav-pills" role="tablist">
		<li class="nav-item">
		  <a class="nav-link active" data-toggle="pill" href="#tbpnRqstPchs">采购申请</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" data-toggle="pill" href="#tbctntExaminePcsRqst" @click="getListOfPcsRqstToExmFromDBS">审核请购</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" data-toggle="pill" href="#enquiryComparePrice">询价比价</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" data-toggle="pill" href="#examineECP">审核比价</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" data-toggle="pill" href="#manageSuppliers">供应商管理</a>
		</li>      </ul>
    </div>
    <div id="tbctntPS" class="tab-content container-fluid">
      <div id="tbpnRqstPchs" class="container tab-pane active">
        <div class="row">
          <div class="col-lg form-inline">
            <label for="slctPrjct">项目:</label>
            <select id="slctPrjct" type="text" name="prjct" class="form-control" placeholder="所属项目" v-model="material.prjct" required title="物料所用于的项目">
              <option v-for="item in projects">
                {{item.prjct}}
              </option>
            </select>
          </div>          
          <div class="col-lg form-inline">
            <label for="nameOfMaterial">物品:</label>
            <input id="nameOfMaterial" type="text" name="nameOfMaterial" class="form-control" placeholder="物品名称" v-model="material.name" required title="需采购的物品名称">
          </div>            
          <div class="col-lg form-inline">
            <label for="inputCount">数量:</label>
            <input id="inputCount" type="number" name="count" class="form-control" placeholder="请购数量" v-model="material.count" required title="需要购买的数量">
          </div>
          <div class="col-lg form-inline">
            <label for="divUnitOfMaterial">单位:</label>
            <input id="divUnitOfMaterial" type="text" name="unit" class="form-control" placeholder="计量单位" v-model="material.unit" required title="物品的计量单位">
          </div>
      </div>
      <div class="row">            
        <div class="col-lg form-inline">
            <label for="inputModelOfMaterial">型号:</label>
            <input id="inputModelOfMaterial" type="text" name="models" class="form-control" placeholder="型号规格" v-model="material.models" required title="需采购物品的型号规格">
        </div>
        <div class="col-lg form-inline">
          <label for="inputFeaturesOfMaterial">特点:</label>
          <input id="inputFeaturesOfMaterial" type="text" name="features" class="form-control" placeholder="物品特点" v-model="material.features" required title="需采购物料的特别之处">
        </div>
      </div>
      <div class="row">           
        <div class="col-lg form-inline">
          <label for="dateOfDlvry">日期:</label>
          <input id="dateOfDlvry" type="date" name="dateOfDlvry" class="form-control" placeholder="需要日期" v-model="material.dateOfDlvry" required title="最迟的交货日期">
        </div>            
        <div class="col-lg form-inline">
          <label for="memOfMaterial">备注:</label>
          <input id="memOfMaterial" type="text" name="mem" class="form-control" placeholder="备注事项" v-model="material.mem" required title="其它需说明的事项">
        </div>            
      </div>
      <div id="btnGroups" class="row">
        <div class="col">
          <button class="btn btn-secondary clearBtn">清空</button>
          <button class="btn btn-primary saveBtn" type="button">保存</button> 
        </div>
      </div>
      </div>
      <div id="tbctntExaminePcsRqst" class="container tab-pane fade">
        <div class="beingExaminePcsRqstList" v-if="ListOfPcsRqstWillExm.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="title in headerOfList">{{title}}</th>
            </thead>
            <tbody @click="selectAPcsRqstToExm">
              <tr v-for="row in ListOfPcsRqstWillExm">
                <td v-for="vlu in row">{{vlu}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="noDate" v-if="ListOfPcsRqstWillExm.length<1" @click="getListOfPcsRqstToExmFromDBS">
          没有要审核的数据
        </div>
      </div>
      <div id="enquiryComparePrice" class="container tab-pane fade">
        询价比价
      </div>
      <div id="examineECP" class="container tab-pane fade">
        询价比价
      </div>
      <div id="manageSuppliers" class="container tab-pane fade">
        <div class="form-group form-inline">
          <label for="schSplr">供应商查询:</label>
          <input id="schSplr" type="text" class="form-control" v-model="schKeyWordsOfSplr" placeholder="供应商关键词" title="请输入要查询的供应商关键词">
          <button id="btnSchSplr" class="btn btn-primary btnSchType" type="button">搜索</button>
          <button id="btnNewSplr" class="btn btn-primary btnSchType" type="button">新建</button>
        </div>
        <div class="splrFromDBSForModifying" v-if="splrFromDBSForModifying.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="title in splrTitle">{{title}}</th>
              <th>操作</th>
            </thead>
            <tbody>
              <tr v-for="row in splrFromDBSForModifying">
                <td v-for="vlu in row">{{vlu}}</td>
                <td><button @click="deleter" class="dltBtnInTbl">删</button><button @click="modifier" class="mdfBtnInTbl">改</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>            
    </div>  	
  </div>
</template>

<script>
  export default {
    data() {
      return {
        material:{
          name:'',
          models:'',
          features:'',
          count:0,
          unit:'',
          usage:'',
          prjct:'',
          dateOfDlvry:'',
          mem:''
        },
        splrFromDBSForModifying:[],
        splrTitle:[],
        schKeyWordsOfSplr:'',
        projects:['12Oct沈阳青促会','4Sep射频会'],
        ListOfPcsRqstWillExm:[],
        headerOfList:['ID','日期','物品名','数量','用途','申请人'],
        selectedPcsRqst:[]
      }
    },
    methods: {
      deleter() {

      },
      modifier() {

      },
      getListOfPcsRqstToExmFromDBS() {
        if(this.ListOfPcsRqstWillExm.length>0) {
          this.ListOfPcsRqstWillExm=[];
        }
        var _this = this;
        this.$axios.get('/devSvr/getCntctrOgnztn.php')
          .then(function (response) {
            _this.ListOfPcsRqstWillExm = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      selectAPcsRqstToExm:function (e) {
        this.selectedPcsRqst= e.toElement.parentElement.children;
        // $('#reciepter').modal('toggle');                
      }

    },
    beforeCreate:function() {
      this.projects=[];
      var _this = this;
      this.$axios({
            method: 'post',
            url: '/devSvr/getProject.php'
        })
        .then(function (response) {
          _this.projects=response.data;
          _this.projects[0]={prjct:'daily日常的'};//使第一个选项符合要求
        })
        .catch(function (error) {
          console.log(error);
        });      
    }

  }	
</script>

<style scoped>
  .titleOfPS {
    text-align: center;
    font-size: 1.3em;
    font-weight: bold;
    color:#007bff;
  }
  .tab-content {
    margin-top: 20px;
    border: 1px solid #007bff;
    padding: 10px;
  }	
  .row {
    margin:10px 0;
  }
  .row input, .row select {
    width:70%;
  }
  #btnGroups {
    text-align: right;
    margin-top: 10px;
  }

  .clearBtn,.btnNewCreat  {
    margin-right: 20px;
  }
  #manageSuppliers input {
    width: 200px;
  }
  #manageSuppliers input,#manageSuppliers button {
    margin-right: 10px;
  }


</style>

