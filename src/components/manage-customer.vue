<template>
  <div class="container-fluid">
    <div class="titleOfMngCstmr">
      <span class="titleOfMngCstmr">客户信息管理</span>
    </div>
    <div id="tbmnMngCstmr">
  	  <ul class="nav nav-pills" role="tablist">
    		<li class="nav-item">
    		  <a class="nav-link active" data-toggle="pill" href="#newCstmr">新建客户</a>
    		</li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#mdfyCstmr">查询维护</a>
    		</li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#othersCstmr">其它操作</a>
    		</li>
      </ul>
    </div>
    <div id="tbctntMngCstmr" class="tab-content container-fluid">
      <div id="newCstmr" class="container tab-pane active">
    	 新建客户
      </div>
      <div id="mdfyCstmr" class="container tab-pane fade">
    	 查询维护
      </div>
      <div id="othersCstmr" class="container tab-pane fade">
       其它操作
      </div>
    </div>  	
  </div>
</template>



<script>
	


</script>


<style scoped>
  .titleOfMngCstmr {
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


