<template>
  <div>
    <input class="input-file" type="file" @change="getXlsxData"  
    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <button @click="btnClick">获取Excel数据</button>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
	name: "get-xlsx-data",
  data() {
    return {
//      myTbTitle:this.tbTitle
      outDate:[]
    }
  },
	props: {
		// type: String,
		// default: "选择excel文件",
    tbTitle: {
        type: Array, //指定传入的类型
        //type 也可以是一个自定义构造器函数，使用 instanceof 检测。
        //default: [0,0,0] //这样可以指定默认的值
        default: function () {
          return [];
        }
    }    
	},
	methods: {
		btnClick() {
  		document.querySelector(".input-file").click();
    },
    	getXlsxData(event) {
      console.log('File selected!Now I will open it!')

        if(!event.currentTarget.files.length) { 
          return;
        }
        const that = this;
        // 拿取文件对象
        var f = event.currentTarget.files[0];
        // 用FileReader来读取
        var reader = new FileReader();
        // 重写FileReader上的readAsBinaryString方法
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var wb; // 读取完成的数据
          // var outDate; // 你需要的数据
          var reader = new FileReader();
          reader.onload = function(e) {
        // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
           // 接下来就是xlsx了，具体可看api
            wb = XLSX.read(binary, {
              type: "binary"
            });
           // console.log(wb);
            this.outDate = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            console.log('I have got the data!now,show you!')
//            console.log(this.outDate);
            // 自定义方法向父组件传递数据
            that.$emit("getResult", this.outDate);
          };
          reader.readAsArrayBuffer(f);
        };
        reader.readAsBinaryString(f);
    	}
	},
  // watch:{
  //   tbTitle(val) {
  //     this.myTbTitle=val;
  //   },
  //   myTbTitle(val) {
  //     this.$emit("clear-title",val);
  //   }
  // }
}
</script>

<style scoped>
.input-file {
  display: none;
}

button {
  margin-bottom: 10px;

}
</style>

