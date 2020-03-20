<template>
	  <div class="app-toast modal fade" v-if="isShow"
	    :class="{'info': type=== 'info','success': type=== 'success','wraning': type=== 'warning','danger': type=== 'danger'}" role="dialog" data-backdrop="static" data-keyboard="false" aria-hidden="true">
	    <span class="text-style">{{text}}</span>
	    <!-- modal fade  data-keyboard: false data-backdrop="static" role="dialog"  aria-labelledby="myModaltoast"-->
	  </div>  	

</template>
<style scoped>
.app-toast {
 position: fixed;
 left: 50%;
 top: 30%;
 width: 800px;
 height: 80px;
 background: #000;
 padding:0;
 /*padding: 10px;*/
 border-radius: 5px;
 transform: translate(-50%, -50%);
 color: #fff;
 text-align: center;
}
.text-style {
	line-height:80px;
	vertical-align: middle;
}
.info {
 background: #00aaee;
}
.success {
 background: #00ee6b;
}
.wraning {
 background: #eea300;
}
.danger {
 background: #ee000c;
}
</style>