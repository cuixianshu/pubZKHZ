<template>
  <div class="container-fluid">
    <div class="titleOfReportes">
      <span class="titleOfReportes">业务报表</span>
    </div>
    <div id="tbmnOfReporters">
  	  <ul class="nav nav-pills" role="tablist">
    		<li class="nav-item">
    		  <a class="nav-link active" data-toggle="pill" href="#achievements">业绩</a>
    		</li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#rcvsAndPays">收付款</a>
    		</li>
    		<li class="nav-item">
    		  <a class="nav-link" data-toggle="pill" href="#othersOfRptrs">其它操作</a>
    		</li>
      </ul>
    </div>
    <div id="tbctntRptrs" class="tab-content container-fluid">
      <div id="achievements" class="container tab-pane active">
    	业绩报表
      </div>
      <div id="rcvsAndPays" class="container tab-pane fade">
    	收支报表
      </div>
      <div id="othersOfRptrs" class="container tab-pane fade">
      其它操作
      </div>
    </div>  	
  </div>
</template>

<script>
  export default {

  }	
</script>

<style scoped>
  .titleOfReportes {
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
