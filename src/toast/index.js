import Vue from 'vue'
import toastComponent from './toast.vue'

// 组件构造器，构造出一个 vue组件实例
const ToastConstructor = Vue.extend(toastComponent)

function showToast ({ text, type, duration = 1000 }) {
    const toastDom = new ToastConstructor({
      el: document.createElement('toast-box'),
      data () {
       return {
        isShow: true, // 是否显示
        text: text, // 文本内容
        type: type // 类型
       }
    }
   })

  //为挂载的元素添加ID
  toastDom.$el.id = 'toast';
   // 添加节点
  document.body.appendChild(toastDom.$el)
   //显示模态框 
  $(toastDom.$el).modal("toggle");
  $("#toast").removeAttr("style");
/*
   //过渡时间
   setTimeout(() => {
    toastDom.isShow = false;
    $(".modal-backdrop.fade.show").remove();
   }, duration)
*/   
   //保存原bodyr class 和 style
   var originalStyleOfBody=$("body").attr("style");
   var originalClassOfBody=$("body").attr("class");
   // console.log('Original Style:'+originalStyleOfBody);
   // console.log('Original Class:'+originalClassOfBody)
   //自编过渡时间
  setTimeout(function(){
  	$("#toast").remove();
  	// $("body").removeAttr("style");
  	if(originalClassOfBody!=='modal-open') {
      $("body").removeClass('modal-open');
    }
    if(!originalStyleOfBody) {
      $("body").attr("style",originalStyleOfBody);
    }
//删除最后添加的modal-backdrop.fade.show
  	$(".modal-backdrop.fade.show:last").remove();
  	},duration);
  //$(toastDom.$el).modal("toggle");
}
// 全局注册
function registryToast () {
 Vue.prototype.$toast = showToast
}

export default registryToast
