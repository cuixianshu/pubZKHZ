  <div class="modal fade" id="mdlNewType" role="dialog" aria-labelledby="newCreateType" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          新建类型
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfProductType">名称:</label>
                <input id="inputNameOfProductType" type="text" name="name" class="form-control" v-model="productType.name" placeholder="类型名称" title="高度概括性的产品名称">
              </div>
              <div class="col-lg form-inline">
                <label for="inputMemOfProductType">备注:</label>
                <input id="inputMemOfProductType" type="text" name="mem" class="form-control" v-model="productType.mem" placeholder="备注事项" title="其它需要说明的备注事项">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button">保存</button> 
        </div>  
      </div>
    </div>
  </div>