function rmvLoadingBox(vm,showToast,txt,tp,dr) {
  /*
  *vm:object,vue实例
  *showToast:boolean,是否显示toast
  *txt:string,toast显示的文本字符串
  *tp:string,toast的type
  *dr:int,toast的duration
  * 
   */
  vm.$nextTick(function(){
    for(let i=0;i<$('.modal-backdrop').length;i++) {
      $('.modal-backdrop').remove();
    }
    if(showToast) {
      vm.$nextTick(function(){
        vm.$toast({text:txt,type:tp,duration:dr});
      })
    }
  });
  // return tar;
}
export default rmvLoadingBox;
