<template>
  <div class="container-fluid">
    <div class="titleOfMM">
      <span class="titleOfMM">物品物料管理</span>
    </div>    
    <div id="tbmnMM">
  	  <ul class="nav nav-pills" role="tablist">
    		<li class="nav-item">
    		  <a class="nav-link active" data-toggle="pill" href="#rqstMaterial">申请领用</a>
    		</li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#exmRM">领用审核</a>
    		</li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="pill" href="#othersMM">验收入库</a>
        </li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#distributeAndEx">出库发放</a>
    		</li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#checkStore">物料盘点</a>
    		</li>

      </ul>
    </div>
    <div id="tbctntMM" class="tab-content container-fluid">
      <div id="rqstMaterial" class="container tab-pane active">
    	申请领用物料
      </div>
      <div id="exmRM" class="container tab-pane fade">
    	审核申请
      </div>
      <div id="distributeAndEx" class="container tab-pane fade">
      出库发放
      </div>
      <div id="checkStore" class="container tab-pane fade">
      物料盘点
      </div>
      <div id="othersMM" class="container tab-pane fade">
      验收入库
      </div>
    </div>  	
  </div>
</template>

<script>
  export default {

  }	
</script>

<style scoped>
  .titleOfMM {
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


</style>

