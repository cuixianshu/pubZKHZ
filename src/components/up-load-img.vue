<template>
    <div class="image-view">
        <div class="addbox">
            <input id= "inputImg" class="inputBox" type="file" @change="getImgBase()" accept="image/*">
            <!--  " -->
            <div class="addbtn" @click="selectImage">添加凭证</div>
        </div>
        <div class="view">
            <div class="item" v-for="(item, index) in images">
                <span class="cancel-btn" @click="delImg(index)">x</span>
                <img :src="item">
            </div>
        </div>
    </div>
</template>

<script>
//    import Vue from 'vue'
    function getInputBoxClick(){
        return  $('#inputImg').click();
    };

    export default {
        data () {
            return {
                images:[]   //存储img base64的值将值传给后端处理
            }
        },
       methods: {
            // sendPicsToParent:function() {
            //   window.Event = new Vue();
            //   this.$emit('havePictrues',this.imgBase64);//;
            // },            
            //获取图片base64实现预览
            getImgBase(){
                //alert('被调用');
                var _this = this;
                var event = event || window.event;
                var file = event.target.files[0];
                var reader = new FileReader();
                var i=0;
                var fileType;
                var allowedImgFileType=['BMP','JPG','JPEG','TIF','SVG','PNG','GIF']
                
                if( file.size > 2097152){
                   this.$toast({
                    text: '必须小于 2MB，请压缩后上传',
                    type: 'wraning',
                     duration: 2000
                  });
                   return;
                 }
                var fileSizeToMB=Math.round(file.size/1024/1024 * 1000) / 1000
               
                fileType = file.name.substr(file.name.lastIndexOf(".")+1).toUpperCase();
               if($.inArray(fileType,allowedImgFileType)<0){ 
                   this.$toast({
                    text: '文件类型不对!支持以下格式：BMP，JPEG，JPG，TIF，SVG，PNG',
                    type: 'wraning',
                     duration: 2000
                  });                    
                    //'\'为转意字符
                    return; 
                }

                //转base64
                reader.readAsDataURL(file);


                reader.onload = function(e) {
                   do {
                       if(_this.images[i]==e.target.result){
//                         alert('第'+ (i+1) +'张重复!')
                           _this.$toast({
                            text: '第'+ (i+1) +'张重复!',
                            type: 'wraning',
                             duration: 2000
                          });
                         return ;
                         }
                        else {
                         i++;
                        } 
                   } while (i<7){
                         // alert('恭喜,没重复')
                         _this.images.push(e.target.result);
                         if (_this.images.length===6)  {
                            $(".addbox").hide();   
                         }
                   }
                }

            //更新图片存储    
            this.GLOBAL.imgBase64=this.images;
            // this.images=[];
            },
            //删除图片
            delImg(index){
                this.images.splice(index,1);
                if ($(".addbox").is(":hidden") && this.images.length < 6) {
                  $(".addbox").show();
                }
            },
          
//            调用input BOX 的点击事件
            selectImage() {
                getInputBoxClick();
            }
        }
    }
</script>
<style scoped>
    *{margin:0 auto;padding:0;font-family:"微软雅黑";}
    .clearboth::after{
        content:"";
        display:block;
        clear:both;
    }
    .image-view{
        /*width:400px;*/
/*        position: relative;*/
        /*height:300px;*/
        margin:5px auto;
    }
    .image-view .addbox{
        float:left;
        position:relative;
        height:30px;
        width:90px;
        margin-bottom:20px;
        text-align:center;
    }
    .image-view .addbox input{
        position:absolute;
        left:0;
        height:30px;
        width:90px;
        opacity:0;
    }
    .image-view .addbox .addbtn{
        float:left;
        padding: 0 5px;
        height:40px;
        /*width:90px;*/
        line-height:40px;
        color:#fff;
        font-size:18px;
        background:#007bff;
        border-radius:5px;
        cursor: pointer;
    }
    .inputBox
    {
        display: none;
    }
    .image-view .item {
        position:relative;
        float:left;
        height:180px;
        width:240px;
        margin:10px 5px 10px 0;
        /*10px 10px 0 0;*/
    }
    .image-view .item .cancel-btn{
        position:absolute;
        right:0;
        top:0;
        display:block;
        width:25px;
        height:25px;
        color:#fff;
        line-height:20px;
        font-size: 20px;
        text-align:center;
        background:red;
        border-radius:50%;
        cursor:pointer;
    }
    .image-view .item img{
        width:240px;
        height:180px;
    }
    .image-view .view{
        position:relative;
        margin-top: 10px;
/*        border: 1px solid #000;*/
        clear:both;
    }
</style>


