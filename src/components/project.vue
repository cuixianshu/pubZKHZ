<template>
<div class="father">
  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#overviewprjct" title="查看展会项目">查看浏览项目</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#CreateOrEditPrjct" title="新建/修改展会项目" @click="showProjectEditer=false;">新建/修改展会项目</a><!--  -->
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#tracksViewer" title="查看/新建/修改专场" @click="showProjectEditer=false;">查看/新建/修改专场</a>
    </li>
<!--     <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#AddOrDeleteAttendees" title="为会议专场添加或删除代表" @click="getATDsWithAllAttendedRcds
">为会议专场添加或删除代表</a>
    </li> -->
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#schedulesInTracks" title="查看/添加/修改专场的日程">查看/新建/修改日程</a>
    </li>
  </ul>
  <div class="tab-content pre-scrollable" style="min-height:720px;">
    <div id="overviewprjct" class="container-fluid tab-pane active">
      <div class="row form-inline">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称等">
        <button @click="getAllProjects" class="btn btn-primary">搜索数据</button>
        <button @click="allProjects=[];" class="btn btn-secondary" v-if="allProjects.length>0">清空</button>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div class="divfortable" v-if="allProjects.length>0 && !showProjectViewer">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in projectTitle" :width="prjctTitleWidth[index]">{{title}}</th>
          </thead>
        <tbody>
          <tr v-for="row in allProjects" @click="clkAPrjctToOverView(row)">
            <td :title='row.name'>{{row.name}}</td>
            <td :title='row.name_part_a'>{{row.name_part_a}}</td>
            <td :title='row.contacter_and_tel'>{{row.contacter_and_tel}}</td>
            <td :title='row.content'>{{row.content}}</td>
            <td :title='row.time_start'>{{row.time_start}}</td>
            <td :title='row.time_end'>{{row.time_end}}</td>
            <td :title='row.address_of_project'>{{row.address_of_project}}</td>
            <td :title='row.scale'>{{row.scale}}</td>
            <td title='0:进行中,1:已结束'>{{row.is_finished}}</td>
            <td :title='row.manager'>{{row.manager}}</td>
            <td :title='row.num_contract'>{{row.num_contract}}</td>
            <td title='1:公司自有项目,0:非公司项目'>{{row.is_own}}</td>
            <td :title='row.other'>{{row.other}}</td>
          </tr>
        </tbody>
        </table>
      </div>
      <div v-if="showProjectViewer">
        <div class="row">
          <div class="col-lg form-inline">
            <label for="iptNmPrjct">名称</label>
            <input readonly id="iptNmPrjct" type="text" class="form-control" v-model="project.name" placeholder="项目名称" title="项目名称">
          </div>
          <div class="col-lg form-inline">
            <label for="cntctr">联系</label>
            <input readonly id="cntctr" type="text" class="form-control" v-model="project.contacter_and_tel" placeholder="甲方联系人及电话" title="甲方联系人及电话">
          </div>
          <div class="col-lg form-inline">
            <label for="slctPartner">甲方</label>
            <select disabled id="slctPartner" type="text" class="form-control" v-model="project.name_part_a" placeholder="甲方名称" title="甲方名称">
              <option v-for="item in clntPrntOgnztns">{{item.short_name}}</option>
              <option value=0>选择甲方</option>
            </select>                
          </div>
          <div class="col-lg form-inline">
            <label for="content">内容</label>
            <input readonly id="content" type="text" class="form-control" v-model="project.content" placeholder="项目内容" title="项目主要内容的概括">
          </div>                             
        </div>
        <div class="row"> 
          <div class="col-lg form-inline">
            <label for="timestart">开始</label>
            <input readonly id="timestart" type="date" class="form-control" v-model="project.time_start" placeholder="项目预计开始日期" title="项目预计开始日期">
              </div> 
          <div class="col-lg form-inline">
            <label for="timeend">结束</label>
            <input readonly id="timeend" type="date" class="form-control" v-model="project.time_end" placeholder="项目预计结束日期" title="项目预计结束日期">
          </div>                                        
          <div class="col-lg form-inline">
            <label for="address">地点</label>
            <input readonly id="address" type="text" class="form-control" v-model="project.address_of_project" placeholder="项目举办地点" title="项目举办地点">
          </div> 
          <div class="col-lg form-inline">
            <label for="slctManagerOfProject">负责</label>
            <select disabled id="slctManagerOfProject" type="text" class="form-control" v-model="project.id_manager" placeholder="我司项目负责人" title="我司项目负责人">
              <option  value=0>我司项目负责人</option>
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="row"> 
          <div class="col-lg form-inline">
            <label for="slctContract">合同</label>
            <select disabled id="slctContract" type="text" class="form-control" v-model="project.id_contract" placeholder="项目合同号" title="项目合同号">
              <option v-for="item in contracts" :value="item.id">{{item.number}}</option>
              <option value=0>没有合同号</option>
            </select>  
          </div>                                        
          <div class="col-lg form-inline">
            <label for="inputScale">规模</label>
            <input readonly id="inputScale" type="text" class="form-control" v-model="project.scale" placeholder="项目规模" title="项目规模">
          </div> 
          <div class="col-lg form-inline">
            <label for="isfinished">完成</label>
            <select disabled id="isfinished" type="text" class="form-control" v-model="project.is_finished" title="此项目是否已经完成">
              <option value=0>未完成</option>
              <option value=1>已完成</option>
              <option value=2>是否已完成</option>
            </select>
          </div> 
          <div class="col-lg form-inline">
            <label for="isown">自有</label>
            <select disabled id="isown" type="text" class="form-control" v-model="project.is_own" title="是否是公司主(承、举)办的项目">
              <option v-for="item in owners" :value="item.id">{{item.owner}}</option>
            </select>  
          </div>                                        
        </div>
        <div class="row">
          <div class="col-lg form-inline">
            <label for="other">备注</label>
            <input readonly id="other" type="text" class="form-control" v-model="project.other" placeholder="备注信息" title="项目其它需记录的事项">
          </div>
          <div class="col-lg"></div>
          <div class="col-lg"></div>
          <div class="col-lg">
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <span style="color:red; font-size: 1.2rem;">会议执行人</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <select disabled class="form-control" style="width:100%;margin:0;" v-model="project.ids_operators[0]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg">
            <select disabled class="form-control" style="width:100%;margin:0;" v-model="project.ids_operators[1]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <select disabled class="form-control" style="width:100%;margin:0;" v-model="project.ids_operators[2]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <select disabled class="form-control" style="width:100%;margin:0;" v-model="project.ids_operators[3]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <select disabled class="form-control" style="width:100%;margin:0;" v-model="project.ids_operators[4]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <a  data-toggle="collapse" data-target="#tracks" style="color:blue; font-size: 1.2rem;cursor:pointer;">展开/收起专场信息</a>
          </div>
        </div>
        <div class="collapse"  id="tracks">
          <table class="table table-hover" v-if="tracksInThisProject.length">
            <thead>
              <th>主题</th>
              <th>地点</th>
              <th>时间</th>
              <th>主席</th>
              <th>副主席</th>
            </thead>
            <tbody>
              <tr v-for="row in tracksInThisProject">
                <td :title='row.name'>{{row.name}}</td>
                <td :title='row.address'>{{row.address}}</td>
                <td :title='row.time_ranges'>{{row.time_ranges}}</td>
                <td :title='row.id_chair'>{{row.id_chair}}</td>
                <td :title='row.id_co_chair'>{{row.id_co_chair}}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!tracksInThisProject.length">
            没有此项目的专场信息
          </div>
        </div>
        <div class="row" style="margin-top: 30px;">
          <div class="col-lg">
            <button class="btn btn-info" @click="showProjectViewer=false;">返回</button>
          </div>  
        </div>
      </div>
    </div>
    <div id="CreateOrEditPrjct" class="container-fluid tab-pane">
      <div class="row form-inline" v-if="!showProjectEditer">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称等">
        <button @click="getAllProjects" class="btn btn-primary">搜索数据</button>
        <button @click="allProjects=[];" class="btn btn-secondary" v-if="allProjects.length>0">清空</button>
        <button class="btn btn-primary new-create" @click="newCreateProject">新建展会项目</button>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div class="divfortable" v-if="allProjects.length>0 && !showProjectEditer">
        <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in projectTitle" :width="prjctTitleWidth[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in allProjects" @click="clkAPrjctToModify(row)">
            <td :title='row.name'>{{row.name}}</td>
            <td :title='row.name_part_a'>{{row.name_part_a}}</td>
            <td :title='row.contacter_and_tel'>{{row.contacter_and_tel}}</td>
            <td :title='row.content'>{{row.content}}</td>
            <td :title='row.time_start'>{{row.time_start}}</td>
            <td :title='row.time_end'>{{row.time_end}}</td>
            <td :title='row.address_of_project'>{{row.address_of_project}}</td>
            <td :title='row.scale'>{{row.scale}}</td>
            <td title='0:进行中,1:已结束'>{{row.is_finished}}</td>
            <td :title='row.manager'>{{row.manager}}</td>
            <td :title='row.num_contract'>{{row.num_contract}}</td>
            <td title='1:公司自有项目,0:非公司项目'>{{row.is_own}}</td>
            <td :title='row.other'>{{row.other}}</td>
          </tr>
        </tbody>
        </table>
      </div>
      <div v-if="showProjectEditer">
        <div class="row">
          <div class="col-lg form-inline">
            <label for="iptNmPrjct">名称</label>
            <input id="iptNmPrjct" type="text" class="form-control" v-model="newOrEditedProject.name" placeholder="项目名称" title="项目名称">
          </div>
          <div class="col-lg form-inline">
            <label for="cntctr">联系</label>
            <input id="cntctr" type="text" class="form-control" v-model="newOrEditedProject.contacter_and_tel" placeholder="甲方联系人及电话" title="甲方联系人及电话">
          </div>
          <div class="col-lg form-inline">
            <label for="slctPartner">甲方</label>
            <select id="slctPartner" type="text" class="form-control" v-model="newOrEditedProject.name_part_a" placeholder="甲方名称" title="甲方名称">
              <option v-for="item in clntPrntOgnztns">{{item.short_name}}</option>
              <option value=0>选择甲方</option>
            </select>                
          </div>
          <div class="col-lg form-inline">
            <label for="content">内容</label>
            <input id="content" type="text" class="form-control" v-model="newOrEditedProject.content" placeholder="项目内容" title="项目主要内容的概括">
          </div>                             
        </div>
        <div class="row"> 
          <div class="col-lg form-inline">
            <label for="timestart">开始</label>
            <input id="timestart" type="date" class="form-control" v-model="newOrEditedProject.time_start" placeholder="项目预计开始日期" title="项目预计开始日期">
              </div> 
          <div class="col-lg form-inline">
            <label for="timeend">结束</label>
            <input id="timeend" type="date" class="form-control" v-model="newOrEditedProject.time_end" placeholder="项目预计结束日期" title="项目预计结束日期">
          </div>                                        
          <div class="col-lg form-inline">
            <label for="address">地点</label>
            <input id="address" type="text" class="form-control" v-model="newOrEditedProject.address_of_project" placeholder="项目举办地点" title="项目举办地点">
          </div> 
          <div class="col-lg form-inline">
            <label for="slctManagerOfProject">负责</label>
            <select id="slctManagerOfProject" type="text" class="form-control" v-model="newOrEditedProject.id_manager" placeholder="我司项目负责人" title="我司项目负责人">
              <option  value=0>我司项目负责人</option>
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="row"> 
          <div class="col-lg form-inline">
            <label for="slctContract">合同</label>
            <select id="slctContract" type="text" class="form-control" v-model="newOrEditedProject.id_contract" placeholder="项目合同号" title="项目合同号">
              <option v-for="item in contracts" :value="item.id">{{item.number}}</option>
              <option value=0>没有合同号</option>
            </select>  
          </div>                                        
          <div class="col-lg form-inline">
            <label for="inputScale">规模</label>
            <input id="inputScale" type="text" class="form-control" v-model="newOrEditedProject.scale" placeholder="项目规模" title="项目规模">
          </div> 
          <div class="col-lg form-inline">
            <label for="isfinished">完成</label>
            <select id="isfinished" type="text" class="form-control" v-model="newOrEditedProject.is_finished" title="此项目是否已经完成">
              <option value=0>未完成</option>
              <option value=1>已完成</option>
              <option value=2>是否已完成</option>
            </select>
          </div> 
          <div class="col-lg form-inline">
            <label for="isown">自有</label>
            <select id="isown" type="text" class="form-control" v-model="newOrEditedProject.is_own" title="是否是公司主(承、举)办的项目">
              <option v-for="item in owners" :value="item.id">{{item.owner}}</option>
            </select>  
          </div>                                        
        </div>
        <div class="row">
          <div class="col-lg form-inline">
            <label for="other">备注</label>
            <input id="other" type="text" class="form-control" v-model="newOrEditedProject.other" placeholder="备注信息" title="项目其它需记录的事项">
          </div>
          <div class="col-lg"></div>
          <div class="col-lg"></div>
          <div class="col-lg"></div>
        </div>
        <div class="row">
          <div class="col-lg">
            <span style="color:red; font-size: 1.2rem;">请在下方选择操作OP</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <select class="form-control" style="width:100%;margin:0;" v-model="newOrEditedProject.ids_operators[0]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg">
            <select class="form-control" style="width:100%;margin:0;" v-model="newOrEditedProject.ids_operators[1]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <select class="form-control" style="width:100%;margin:0;" v-model="newOrEditedProject.ids_operators[2]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <select class="form-control" style="width:100%;margin:0;" v-model="newOrEditedProject.ids_operators[3]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <select class="form-control" style="width:100%;margin:0;" v-model="newOrEditedProject.ids_operators[4]">
              <option value=0>请选择OP</option>
              <option v-for="item in ourStaffs" :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <a  data-toggle="collapse" data-target="#tracksEditer" style="color:blue; font-size: 1.2rem;cursor:pointer;">展开/收起专场信息</a>
          </div>
        </div>
        <div class="collapse"  id="tracksEditer">
          <table class="table table-hover" v-if="tracksInThisProject.length">
            <thead>
              <th>主题</th>
              <th>地点</th>
              <th>时间</th>
              <th>主席</th>
              <th>副主席</th>
              <th>删除</th>
            </thead>
            <tbody>
              <tr v-for="(row,index) in tracksInThisProject">
                <td @click="editATrackInPrjctViewer(row,index)" :title='row.name'>{{row.name}}</td>
                <td @click="editATrackInPrjctViewer(row,index)" :title='row.address'>{{row.address}}</td>
                <td @click="editATrackInPrjctViewer(row,index)" :title='row.time_ranges'>{{row.time_ranges}}</td>
                <td @click="editATrackInPrjctViewer(row,index)" :title='row.id_chair'>{{row.id_chair}}</td>
                <td @click="editATrackInPrjctViewer(row,index)" :title='row.id_co_chair'>{{row.id_co_chair}}</td>
                <td>
                  <button class="btn btn-link" @click="dltATrackFromThisProject(row,index)" title="从列表中删除">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button class="btn btn-link" @click="addATrackIntoThisProject">增加</button>
          </div>
          <div class="modal fade" id="mdlTrackEditer" role="dialog" aria-labelledby="mdlTrackEditer" data-backdrop="static" data-keyboard: false>
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  会议专场编辑器--{{theOriginProject.name}}
                </div>
                <div class="modal-body">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-lg form-inline">
                        <label>主题</label>
                        <input type="text" class="form-control" v-model="track.name" placeholder="专场主题" title="专场主题">
                      </div>
                      <div class="col-lg form-inline">
                        <label>地点</label>
                        <input type="text" class="form-control" v-model="track.address" placeholder="专场举办地点" title="专场举办地点">
                      </div>
                    </div>
                    <div class="row"> 
                      <div class="col-lg form-inline">
                        <label>时间</label>
                        <input type="text" class="form-control" v-model="track.time_ranges" placeholder="8888-08-18 08:08-18:18" title="专场举办时间段">
                      </div>
                      <div class="col-lg form-inline">
                        <label>主席</label>
                         <select type="text" class="form-control" v-model="track.id_chair" title="专场主席">
                          <option  value='0'>请选择</option>
                          <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                        </select>
                      </div>                             
                    </div>
                    <div class="row"> 
                      <div class="col-lg form-inline">
                        <label>副主</label>
                         <select type="text" class="form-control" v-model="track.id_co_chair" title="专场副主席">
                          <option  value='0'>请选择</option>
                          <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                        </select>
                      </div> 
                      <div class="col-lg form-inline">
                        <label>备注</label>
                        <input type="text" class="form-control" v-model="track.remark" placeholder="备注信息" title="备注信息">
                      </div>                                        
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-default" data-dismiss="modal">取消</button>
                  <button class="btn btn-primary" @click="pushTrackIntoTracksOfThisProject">确定</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 30px;">
          <div class="col-lg">
            <button class="btn btn-secondary" @click="initializeProject">复位</button>
            <button class="btn btn-info" @click="backToSlecterOfProjectEditer">返回</button>
          </div>
          <div class="col-lg">
            <button class="btn btn-primary" @click="saveNewOrEditedProject">保存</button>
          </div>
        </div>
      </div>
    </div>
    <div id="tracksViewer" class="container-fluid tab-pane">
      <div class="row form-inline">
        <select class="form-control" v-model="queryContent.id_project">
          <option value=0>请选择</option>
          <option v-for="item in allProjects" :value="item.id">{{item.name}}</option>
        </select>
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称等">
        <button @click="getTracksToViewOrEdit" class="btn btn-primary">搜索数据</button>
        <button @click="tracksInViewer=[];" class="btn btn-secondary" v-if="tracksInViewer.length>0">清空</button>
        <button class="btn btn-primary new-create" @click="newCreateTrack" v-if="!tracksReadOnly">新建会议专场</button>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div class="tablebox" v-if="showTracksTableInTrkViewer">
        <table class="table table-hover table-sm" v-if="tracksInViewer.length>0">
          <thead>
            <th v-for="(item,index) in tracksTitle" :width="tracksTitleWidth[index]">{{item}}</th>
          </thead>
          <tbody><!--  @dblclick="" title='' ['ID','所属项目','主题','地点','时间段','主席','副主席','备注','初录人','修改人','修改日期'] -->
            <tr v-for="row in tracksInViewer" @click="clkATrackInTrkViewerToModify(row)">
              <td>{{row.id_project}}</td>
              <td>{{row.name}}</td>
              <td>{{row.address}}</td>
              <td>{{row.time_ranges}}</td>
              <td>{{row.id_chair}}</td>
              <td>{{row.id_co_chair}}</td>
              <td>{{row.remark}}</td>
              <td>{{row.id_creater}}</td>
              <td>{{row.id_editer}}</td>
              <td>{{row.time_edited}}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="tracksInViewer.length==0">
          没有数据
        </div>
      </div>
      <div class="container-fluid" v-if="showTrackEditerInTrackViewer">
        <div class="row">
          <div class="col-lg form-inline">
            <label>项目</label>
            <select class="form-control" v-model="track.id_project" :disabled="isModifying || tracksReadOnly">
              <option value=0>请选择</option>
              <option v-for="item in allProjects" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
          </div>
          <div class="col-lg form-inline">
          </div>
        </div>
        <div class="row">
          <div class="col-lg form-inline">
            <label>主题</label>
            <input type="text" class="form-control" v-model="track.name" placeholder="专场主题" title="专场主题" :readonly="tracksReadOnly">
          </div>
          <div class="col-lg form-inline">
            <label>时间</label>
            <input type="text" class="form-control" v-model="track.time_ranges" placeholder="8888-08-18 08:08-18:18" title="专场举办时间段" :readonly="tracksReadOnly">
          </div>
          <div class="col-lg form-inline">
            <label>地点</label>
            <input type="text" class="form-control" v-model="track.address" placeholder="专场举办地点" title="专场举办地点" :readonly="tracksReadOnly">
          </div>
        </div>
        <div class="row"> 
          <div class="col-lg form-inline">
            <label>主席</label>
             <select type="text" class="form-control" v-model="track.id_chair" title="专场主席" :disabled="tracksReadOnly">
              <option  value='0'>请选择</option>
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
          </div>                             
          <div class="col-lg form-inline">
            <label>副主</label>
             <select type="text" class="form-control" v-model="track.id_co_chair" title="专场副主席" :disabled="tracksReadOnly">
              <option  value='0'>请选择</option>
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
          </div> 
          <div class="col-lg form-inline">
            <label>备注</label>
            <input type="text" class="form-control" v-model="track.remark" placeholder="备注信息" title="备注信息" :readonly="tracksReadOnly">
          </div>                                        
        </div>
        <div class="row">
          <div class="col-lg">
            <button class="btn btn-info" @click="backToTracksTable">返回</button>
          </div>
          <div class="col-lg">
            <button class="btn btn-primary" @click="saveTheTrack" v-if="!tracksReadOnly">保存</button>
          </div>
        </div>
      </div>
    </div>
    <div id="AddOrDeleteAttendees" class="container-fluid tab-pane">
      <div v-if="!isShowTip" class="row form-inline">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称等">
        <button @click="getTracksForEdtingAtds" class="btn btn-primary">搜索数据</button>
        <button @click="ClearTracksForAddingAtds" class="btn btn-secondary" v-if="isShowPsFAAs">清空</button>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="isShowTip" class="row">
        <div class="form-inline col-lg">
          <span class="theTitle">{{theTrackForEdtingAtds.name}},{{theTrackForEdtingAtds.time_ranges}},{{theTrackForEdtingAtds.address}}</span>
        </div>
      </div>
      <div v-if="isShowTip">
        <div class="row">
          <div class="waitingSlcting col-lg-5">
            <div class="row form-inline">
              <input class="form-control" type="text" placeholder="搜索词" v-model="keyOfSchgInAllATDs" @input="keyWordInAllATDsChanged">
              <span class="atdstatus">待选嘉宾,共{{selectableATDs.length}}人.</span>
            </div>
            <div class="tablebox">
              <table class="table table-hover table-sm">
                <thead>
                  <th>姓名</th>
                  <th>单位</th>
                  <th>职务</th>
                  <th>电话</th>
                </thead>
                <tbody>
                  <tr v-for="row in selectableATDs" @dblclick="dlbClkTheATDInTheBeingToSlctBox(row)" title='双击添加为专场嘉宾'>
                    <td>{{row.name}}</td>
                    <td>{{row.workplace}}</td>
                    <td>{{row.position}}</td>
                    <td>{{row.mp1}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="slctd col-lg-7">
            <div class="row form-inline">
              <input class="form-control" type="text" placeholder="搜索词" v-model="keyOfSchgInSlctdATDs" @input="keyWordInSlctdATDsChanged">
              <span style="color:#007bff;" class="atdstatus">已选嘉宾,共{{slctdATDs.length}}人.</span>
            </div>
            <div class="tablebox">
              <table class="table table-hover table-sm" style="color:#007bff;">
                <thead>
                  <th style="width:15%;">姓名</th>
                  <th style="width:25%;">单位</th>
                  <th style="width:15%;">职务</th>
                  <th style="width:15%;">参会身份</th>
                  <th style="width:30%;">报告题目</th>
                </thead>
                <tbody>
                  <tr v-for="row in slctdATDs">
                    <td @dblclick="dlbClkASlctdAtd(row)" title='双击此处已选嘉宾中删除'>{{row.name}}</td>
                    <td @dblclick="dlbClkASlctdAtd(row)" title='双击此处已选嘉宾中删除'>{{row.workplace}}</td>
                    <td @dblclick="dlbClkASlctdAtd(row)" title='双击此处已选嘉宾中删除'>{{row.position}}</td>
                    <td>
                      <select v-model="row.role">
                        <option value='主办者'>主办者</option>
                        <option value='VIP'>VIP</option>
                        <option value='报告人'>报告人</option>
                        <option value='一般参会代表'>一般参会嘉宾</option>
                        <option value='观众或听众'>观众或听众</option>
                        <option value='承办者'>承办者</option>
                      </select>
                    </td>
                    <td title="不能超过250个字,多的部分会丢失"><input type="text" v-model="row.speech_topics" placeholder="报告题目"></td>
                  </tr>
                </tbody>
              </table>            
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <button class="btn btn-info" @click="goBackToTrackSelecter">
              返回
            </button>
          </div>
          <div class="col-lg">
            <button class="btn btn-primary savebutton" @click="saveSlctdATDsInTheTrack">保存</button>
          </div>
        </div>
      </div>
      <div class="tablebox" v-if="isShowPsFAAs">
        <table class="table table-hover">
          <thead>
            <th>专场主题</th>
            <th>所属项目</th>
            <th>时间范围</th>
            <th>主席</th>
            <th>副主席</th>
          </thead>
          <tbody>
            <tr v-for="row in tracksInThisProject" @click="clkATrackToAddOrReduceATDs(row)" title='双击选择'>
              <td>{{row.name}}</td>
              <td>{{row.id_project}}</td>
              <td>{{row.time_ranges}}</td>
              <td>{{row.id_chair}}</td>
              <td>{{row.id_co_chair}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="schedulesInTracks" class="container-fluid tab-pane">
      <div v-if="showSchedulesSearchBox">
        <div class="row form-inline">
          <select class="form-control" v-model="queryContent.id_track" title="请选择专场">
            <option value=0>不限专场</option>
            <option v-for="item in tracksForSchedules" :value="item.id">{{item.name}}</option>
          </select>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入日程关键词" title="名称/时间段/主持人/演讲人/演讲题目/备注等">
          <button @click="getSchedulesToViewOrEdit" class="btn btn-primary">搜索数据</button>
          <button @click="schedulesForShowingOrEditing=[];" class="btn btn-secondary" v-if="schedulesForShowingOrEditing.length>0">清空</button>
          <button class="btn btn-primary new-create" @click="newCreateSchedule" v-if="!schedulesReadOnly">新建日程</button>
        </div>
        <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      </div>
      <div class="divfortable" v-if="showSchedulesTable">
        <table class="table table-hover" v-if="schedulesForShowingOrEditing.length>0">
          <thead>
            <th v-for="(title,index) in schedulesTitle" :width="schedulesTitleWidth[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in schedulesForShowingOrEditing" @click="clkAScheduleToModify(row)">
              <td :title='row.name'>{{row.name}}</td>
              <td :title='row.id_track'>{{row.id_track}}</td>
              <td :title='row.location'>{{row.location}}</td>
              <td :title='row.time_ranges'>{{row.time_ranges}}</td>
              <td :title='row.id_agenda'>{{row.id_agenda}}</td>
              <td :title='row.hosts_id'>{{row.hosts_id}}</td>
              <td :title='row.speaker_id'>{{row.speaker_id}}</td>
              <td :title='row.speech_topics'>{{row.speech_topics}}</td>
              <td :title='row.remark'>{{row.remark}}</td>
              <td :title='row.id_creater'>{{row.id_creater}}</td>
              <td :title='row.id_modifyer'>{{row.id_modifyer}}</td>
              <td :title='row.time_modifyed'>{{row.time_modifyed}}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!schedulesForShowingOrEditing.length>0">
          没有日程数据
        </div>
      </div>
      <div class="container-fluid" v-if="showSchedulesEditer">
        <div class="row form-inline">
          <span class="theTitle" v-if="isNewCreateSchedule">新建日程</span>
          <span class="theTitle" v-if="!isNewCreateSchedule">编辑日程</span>
        </div>
        <div class="row">
          <div class="col-lg form-inline">
            <label>专场</label>
            <select class="form-control" v-model="currentSchedule.id_track" title="请选择专场" :disabled="!isNewCreateSchedule">
              <option value=0>请选择</option>
              <option v-for="item in tracksForSchedules" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <label>名称</label>
            <input type="text" class="form-control" v-model="currentSchedule.name" placeholder="日程名称">
          </div>
          <div class="col-lg form-inline">
            <label>时段</label>
            <input type="text" class="form-control" v-model="currentSchedule.time_ranges" placeholder="2018-08-18 18:08-22:18">
          </div>
        </div>
        <div class="row">
          <div class="col-lg form-inline">
            <label>地点</label>
            <input type="text" class="form-control" v-model="currentSchedule.location" placeholder="日程所在地点">
          </div>
          <div class="col-lg form-inline">
            <label>环节</label>
            <select type="text" class="form-control" v-model="currentSchedule.id_agenda">
              <option value=0>选择环节</option>
              <option value=1>报到</option>
              <option value=2>签到</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <label>主持</label>
            <select class="form-control" v-model="currentSchedule.hosts_id" title="请选择主持人">
              <option value=0>请选择</option>
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-lg form-inline">
            <label>报告</label>
            <select class="form-control" v-model="currentSchedule.speaker_id" title="请选择报告人">
              <option value=0>请选择</option>
              <option v-for="item in employees" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="col-lg form-inline">
            <label>题目</label>
            <input type="text" class="form-control" v-model="currentSchedule.speech_topics" placeholder="报告题目">
          </div>
          <div class="col-lg form-inline">
            <label>备注</label>
            <input type="text" class="form-control" v-model="currentSchedule.remark" placeholder="备注信息">
          </div>
        </div>
        <div class="row" v-if="!isNewCreateSchedule">
          <div class="col-lg form-inline">
            <label>初录</label>
            <input type="text" class="form-control" v-model="currentSchedule.id_creater" readonly title="初始录入人">
          </div>
          <div class="col-lg form-inline">
            <label>更新</label>
            <input type="text" class="form-control" v-model="currentSchedule.id_modifyer" readonly title="上次更新人">
          </div>
          <div class="col-lg form-inline">
            <label>日期</label>
            <input type="text" class="form-control" v-model="currentSchedule.time_modifyed" readonly title="上次更新日期">
          </div>
        </div>
        <div class="row">
          <div class="col-lg">
            <button class="btn btn-info" @click="backToSchedulesTableViewer">返回</button>
          </div>
          <div class="col-lg"></div>
          <div class="col-lg form-inline">
            <button @click="saveTheNewOrEditedSchedul" class="btn btn-primary savebutton">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import qs from 'qs';
import trtmplt from './tr-in-project-for-schedule.vue';
import cmprObjs from '@/cuiLibs/cmprObjsAreEqual.js';
import deepClone from '@/cuiLibs/objDeepClone.js';
  export default {
    data () {
      return {
        //common
        queryContent:{
          id_project:0,
          id_track:0,
          keyWord:''
        },
        allProjects:JSON.parse(JSON.stringify(this.$store.state.projects)),
        projectTitle:['项目名称','甲方','联系人及电话','主要内容','开始日期','结束日期','项目举办地点','项目规模','完成状态','负责人','合同号','自有','备注'],
        prjctTitleWidth:['7%','8%','9%','9%','9%','9%','9%','7%','7%','7%','7%','6%','6%'],
        employees:this.$store.state.employees,
        clntPrntOgnztns:this.$store.state.clntParentOgnztns,
        ourStaffs:this.$store.state.myEmplys,
        id_curUser:this.$store.state.user.id_user,

        //review projects
        tracksInThisProject:[],
        project:{
          address_of_project:'',
          name:'',
          contacter_and_tel:'',
          name_part_a:0,
          content:'',
          time_start:'',
          time_end:'',
          is_finished:2,
          id_manager:0,
          id_contract:0,
          scale:'',
          other:'',
          is_own:2,
          ids_operators:[],
        },
        showProjectViewer:false,

        //editOrNewProject
        showProjectEditer:false,
        newOrEditedProject:{
          ids_operators:new Array(0,0,0,0,0),
        },
        owners:[{id:0,owner:'外部项目'},{id:1,owner:'我司项目'},{id:2,owner:'是否是我司项目'}],
        track:{id_project:0},//common with tracks
        
        //tracks
        tracksInViewer:[],
        tracksTitle:['所属项目','主题','地点','时间段','主席','副主席','备注','初录人','修改人','修改日期'],
        tracksTitleWidth:['10%','10%','10%','10%','10%','10%','10%','10%','10%','10%','10%'],
        originTrackInViewer:[],
        showTrackEditerInTrackViewer:false,
        showTracksTableInTrkViewer:false,
        isModifying:true,
        tracksReadOnly:false,
        
        //schedules
        schedulesForShowingOrEditing:[],
        currentSchedule:{id_track:0},
        tracksForSchedules:[],
        schedulesReadOnly:false,
        showSchedulesSearchBox:true,
        showSchedulesTable:false,
        showSchedulesEditer:false,
        schedulesTitle:['名称','专场','地点','时间段','日程','主持人','演讲人','演讲题目','备注','初录人','修改人','修改日期'],
        schedulesTitleWidth:['9%','9%','9%','9%','9%','9%','9%','9%','10%','6%','6%','6%'],
        isNewCreateSchedule:false,

        originTracksInPrjct:[],
        isEditTrack:false,
        indexOfRow:0,
        keyOfSchATDsForChair:'',
        ATDsForChair:[],
        theOriginProject:'',
        contracts:[],
        theTrackForEdtingAtds:{},
        isShowPsFAAs:false,
        isShowTip:false,
        selectableATDs:[],
        tmpSlctableATDs:[],
        slctdATDs:[],
        copyOfslctblATDs:[],
        strOfOriginSlctdATDs:[],
        tmpSlctdAtds:[],
        ATDsWithAttendedRcds:[],//有参会记录的嘉宾
        ATDsWhoHaveAttendedThisTrack:[],//已参加此会的嘉宾
        isUnchanged:true,
        keyOfSchgInAllATDs:'',
        keyOfSchgInSlctdATDs:'',
        filteredAATDs:[],//过滤后的全体嘉宾
        filteredSATDs:[],//过滤后的已选嘉宾
        slctdOperator:0,
        atdHasAdditionalInfo:{
          id:'',
          speech_topics:'',
          remark:'',
          speech_abstracts:'',
        },
        authOnlyRead:true,//根据权限设置

        titleForSAs:['序号','开始/结束时间','地点','日程','报告人','报告题目','主持人','备注','删除'],
        widthForSAs:['6%','15%','15%','14%','8%','13%','8%','13%','8%'],
        thePFSA:{},//ProjectForScheduleAgenda
        scheduleAgendas:[
          {
            id:0,
            time_range:'',
            location:'',
            id_agenda:0,
            hosts_id:0,
            speaker_id:0,
            speech_topics:'',
            remark:'',
          },
        ],
        showAgendaViewer:false,//SAs:ScheduleAgendas
        beenRemovedSAs:[],
      }
    },
    methods:{
      getAllProjects() {
        // let allPrjctString=JSON.stringify(this.$store.state.projects);
        // this.allProjects=JSON.parse(allPrjctString);
        this.allProjects=JSON.parse(JSON.stringify(this.$store.state.projects));
        //[...this.$store.state.projects];
      },
      clkAPrjctToOverView (r) {
        this.showProjectViewer=true;
        this.project=r;
        this.initializeIdsInProject(this.project);
        //初始化tracksInThisProject
        this.tracksInThisProject=[];
        let queryContent={
          conditions:"TracksInThisProject",
          id_project:this.project.id,
        };
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.tracksInThisProject=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!'+response.data,
            type: 'danger',
            duration: 4000
          });
        });
      },
      newCreateProject() {
        this.showProjectEditer=true;
        this.initializeProject();
      },
      initializeProject() {
        this.newOrEditedProject.id='';
        this.newOrEditedProject.address_of_project='';
        this.newOrEditedProject.name='';
        this.newOrEditedProject.contacter_and_tel='';
        this.newOrEditedProject.name_part_a=0;
        this.newOrEditedProject.content='';
        this.newOrEditedProject.time_start='';
        this.newOrEditedProject.time_end='';
        this.newOrEditedProject.is_finished=2;
        this.newOrEditedProject.id_manager=0;
        this.newOrEditedProject.id_contract=0;
        this.newOrEditedProject.scale='';
        this.newOrEditedProject.other='';
        this.newOrEditedProject.is_own=2;
        this.newOrEditedProject.ids_operators=new Array(0,0,0,0,0);
        this.newOrEditedProject.tracks=[];

        this.tracksInThisProject=[];
        this.originTracksInPrjct=[];
      },
      backToSlecterOfProjectEditer() {
        this.showProjectEditer=false;
        this.axiosAsync();
      },
      editATrackInPrjctViewer(r,i) {
       this.isEditTrack=true;
       this.indexOfRow=i;
       this.track=r;
       $('#mdlTrackEditer').modal('toggle');//open
          //为搜索主席准备数据
        this.ATDsForChair=JSON.parse(JSON.stringify(this.employees));
      },
      dltATrackFromThisProject (r,i) {
        this.tracksInThisProject.splice(i,1);
      },
      addATrackIntoThisProject() {
        this.isEditTrack=false;
        //初始化track
        this.track.id='';
        this.track.id_project=this.theOriginProject.id;
        this.track.name='';
        this.track.address='';
        this.track.time_ranges='';
        this.track.remark='';
        this.track.id_chair=0;
        this.track.id_co_chair=0;
        $('#mdlTrackEditer').modal('toggle');//open
          //为搜索主席准备数据
        this.ATDsForChair=JSON.parse(JSON.stringify(this.employees));
      },
      pushTrackIntoTracksOfThisProject() {
        if(!this.track.name) {
          this.$toast({text: '请正确填写主题!',type: 'info',duration: 2000});
          return;
        }
        if(!this.track.address) {
          this.$toast({text: '请正确填写地点!',type: 'info',duration: 2000});
          return;
        }
        if(!this.track.time_ranges || this.track.time_ranges.length<21) {
          this.$toast({text: '请正确填写时间!',type: 'info',duration: 2000});
          return;
        }

        //修改和新建分别处理
        let tmpTrack=JSON.parse(JSON.stringify(this.track));
        // console.log(tmpTrack);
        if(this.isEditTrack) {
          this.tracksInThisProject[this.indexOfRow]=tmpTrack;
        } else {
          this.tracksInThisProject.push(tmpTrack);
        }
        $('#mdlTrackEditer').modal('toggle');//colse
        //初始化track
        this.track.id='';
        this.track.id_project=this.theOriginProject.id;
        this.track.name='';
        this.track.address='';
        this.track.time_ranges='';
        this.track.remark='';
        this.track.id_chair=0;
        this.track.id_co_chair=0;
      },
      saveNewOrEditedProject() {
        let otStr=JSON.stringify(this.originTracksInPrjct);
        let ntStr=JSON.stringify(this.tracksInThisProject);
        let opStr=JSON.stringify(this.theOriginProject);
        let npStr=JSON.stringify(this.newOrEditedProject);
        if(opStr==npStr && otStr==ntStr) {
          this.$toast({text:'没有变更!',type: 'info',duration:800});
          return;
        }
        if(this.newOrEditedProject.name.length<4) {
          this.$toast({
            text: '名称不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.newOrEditedProject.contacter_and_tel.length<2) {
          this.$toast({
            text: '联系不能少于2个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.newOrEditedProject.content.length<4) {
          this.$toast({
            text: '主要内容不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(!this.newOrEditedProject.time_end || !this.newOrEditedProject.time_start || this.newOrEditedProject.time_start>this.newOrEditedProject.time_end) {
          this.$toast({
            text: '日期设置错误',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.newOrEditedProject.address_of_project.length<4) {
          this.$toast({
            text: '项目举办地点不能少于4个字!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.newOrEditedProject.id_manager==0) {
          this.$toast({
            text: '请选择此项目负责人',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(Number(this.newOrEditedProject.scale)<1) {
          this.$toast({
            text: '规模不能小于1!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.newOrEditedProject.is_finished==2) {
          this.$toast({
            text: '请选择是否已完成',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        if(this.newOrEditedProject.is_own==2) {
          this.$toast({
            text: '请选择是否我司项目!',
            type: 'info',
            duration: 2000
          });
          return;              
        }
        //去除Operator的重复项
        let o={};
        let tmpIdsOP=[];
        let arr=this.newOrEditedProject.ids_operators;
        tmpIdsOP= arr.filter(function(item, index, arr){
          return o.hasOwnProperty(typeof item+item)?false:(o[typeof item+item]=true);
        });
        for(let i=0;i<5;i++) {
          tmpIdsOP[i]=(tmpIdsOP[i]=='0' || !tmpIdsOP[i])?'0':tmpIdsOP[i];
        }
        this.newOrEditedProject.ids_operators=tmpIdsOP;
        this.newOrEditedProject.tracks=JSON.parse(JSON.stringify(this.tracksInThisProject));
        this.newOrEditedProject.id_operator=this.id_curUser;
        var _this=this;
        var url='';
        if(this.newOrEditedProject.id!=='') {
          url='updateTblProject.php';
          this.newOrEditedProject.conditions="updateProject";
        } else {
          url='insertNewToProject.php';
          this.newOrEditedProject.conditions="insertNewProject";
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.newOrEditedProject)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({text:'成功保存数据!',type: 'success',duration:800});
            _this.initializeProject();
            _this.axiosAsync();
            _this.$store.commit('initializeProjects',_this.allProjects);
            _this.showProjectEditer=false;
          } else {
            _this.$toast({text:'通信错误!',type:'danger',duration:4000});
          } 
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'异步通信错误!',type:'danger',duration:4000});
        });
      },
//*******************************************************************************//
      getTracksToViewOrEdit() {
        this.showTracksTableInTrkViewer=true;
        this.showTrackEditerInTrackViewer=false;
        this.tracksInViewer=[];
        let _this=this;
        this.queryContent.conditions="byKewWordAndProjectId";
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.tracksInViewer=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text: '通信错误!',type: 'danger',duration: 4000});
        });
      },
      clkATrackInTrkViewerToModify(r) {
        this.showTrackEditerInTrackViewer=true;
        this.showTracksTableInTrkViewer=false;
        this.isModifying=true;
        this.originTrackInViewer=JSON.parse(JSON.stringify(r));
        this.track=JSON.parse(JSON.stringify(r));
      },
      backToTracksTable() {
        this.showTrackEditerInTrackViewer=false;
        this.showTracksTableInTrkViewer=true;
      },
      saveTheTrack() {
        if(!this.isModifying) {//新建
          if(this.track.id_project==0) {
            this.$toast({text: '请选择项目!',type: 'warning',duration: 2000});
            return;
          }
        } else {//修改,和原始数据对比是否更改过
          if(JSON.stringify(this.track)==JSON.stringify(this.originTrackInViewer)) {
            this.$toast({text: '没有变化!',type: 'info',duration: 2000});
            return;
          }
        }
        if(!this.track.name) {
          this.$toast({text: '请正确填写主题!',type: 'info',duration: 2000});
          return;
        }
        if(!this.track.address) {
          this.$toast({text: '请正确填写地点!',type: 'info',duration: 2000});
          return;
        }
        if(!this.track.time_ranges || this.track.time_ranges.length<21) {
          this.$toast({text: '请正确填写时间!',type: 'info',duration: 2000});
          return;
        }

        let url="";
        if(!this.isModifying) {//新建
          this.queryContent.conditions="newTrack";
          url="insertNewToTracks.php";
        } else {//更改
          this.queryContent.conditions="oldUpdate";
          url="updateTracks.php";
        }
        this.queryContent.track=this.track;
        let _this=this;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({text:'成功保存数据!',type: 'success',duration:800});
            let i=_this.tracksInViewer.findIndex((ele)=>ele['id']==_this.track.id);
            if(i>-1) {
              _this.tracksInViewer.splice(i,1,_this.track);
            } else {
              _this.tracksInViewer.push(_this.track);
            } 
            _this.track={
              id:'',
              id_project:0,
              name:'',
              address:'',
              time_ranges:'',
              id_chair:0,
              id_co_chair:0,
              remark:'',
              id_creater:_this.id_curUser,
            };            
            _this.backToTracksTable();
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration:4000});
          } 
        }).catch(function (error) {
          console.log(error)
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      newCreateTrack() {
        this.showTrackEditerInTrackViewer=true;
        this.showTracksTableInTrkViewer=false;
        this.isModifying=false;
        this.track={
          id:'',
          id_project:0,
          name:'',
          address:'',
          time_ranges:'',
          id_chair:0,
          id_co_chair:0,
          remark:'',
          id_creater:this.id_curUser,
        };
      },

//***************************************************************************************//
      
      getTracksToViewOrEditSchedules() {
        let _this=this;
        let queryContent={
          conditions:"anyone",
        }
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.tracksForSchedules=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text: '通信错误!',type:'danger',duration: 4000});
        });
      },
      getSchedulesToViewOrEdit() {
        this.showSchedulesEditer=false;
        this.showSchedulesSearchBox=true;
        this.showSchedulesTable=true;
        let _this=this;
        this.queryContent.conditions="getSchedulesByKeyWordAndIdOfTrackToShowOrEdit";
        this.$axios({
          method: 'post',
          url: 'getSchedules.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(typeof(response.data)==='object' && response.data.length>0) {
            // if(response.data.length>0) {
              _this.schedulesForShowingOrEditing=response.data;
            // } else {
            // }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 2000
          });
        });
      },
      newCreateSchedule() {
        this.showSchedulesSearchBox=false;
        this.showSchedulesTable=false;
        this.showSchedulesEditer=true;
        this.isNewCreateSchedule=true;
        this.currentSchedule={
          id:0,name:'',id_track:0,time_ranges:'',location:'',id_agenda:'',
          hosts_id:0,speaker_id:0,speech_topics:'',remark:'',id_creater:this.id_curUser,
          time_created:'',id_modifyer:0,time_modifyed:'',is_deleted:0
        };
      },
      backToSchedulesTableViewer() {
        this.showSchedulesSearchBox=true;
        this.showSchedulesTable=true;
        this.showSchedulesEditer=false;

      },
      clkAScheduleToModify(r) {
        this.showSchedulesSearchBox=false;
        this.showSchedulesTable=false;
        this.showSchedulesEditer=true;
        this.currentSchedule=r;
        this.currentSchedule.id_modifyer=this.id_curUser;
        this.isNewCreateSchedule=false;
      },
      saveTheNewOrEditedSchedul() {
        if(this.currentSchedule.id_track==0) {
          this.$toast({text: '请选择专场!',type:'warning',duration:1200});
          return;
        }
        if(this.currentSchedule.name.length<2) {
          this.$toast({text: '名称不能少于2个字!',type:'warning',duration:1200});
          return;
        }
        if(this.currentSchedule.time_ranges.length<22) {
          this.$toast({text: '请正确填写时段!',type:'warning',duration:1200});
          return;
        }
        if(this.currentSchedule.location.length<2) {
          this.$toast({text: '请正确填写地点!',type:'warning',duration:1200});
          return;
        }
        if(this.currentSchedule.id_agenda==0) {
          this.$toast({text: '请选择环节!',type:'warning',duration:1200});
          return;
        }
        if(this.currentSchedule.speaker_id!=0 && this.currentSchedule.speech_topics.length<8 || this.currentSchedule.speaker_id==0 && this.currentSchedule.speech_topics.length>0) {
          this.$toast({text: '有报告人时,题目不能少于8个字;没有报告人时请不要填写题目!',type:'warning',duration:3000});
          return;
        }
        let url="";
        let queryContent={
          conditions:"",
          schedule:this.currentSchedule,
        };
        if(this.isNewCreateSchedule) {
          queryContent.conditions="newscheduleiscoming";
          url="insertNewToSchedules.php";
        } else {
          queryContent.conditions="updateExistedSchedules";
          url="updateSchedules.php";
        }
        let _this=this;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({text:'成功保存数据!',type: 'success',duration:800});
          }
          //数据验证并保存成功后
          _this.showSchedulesSearchBox=true;
          _this.showSchedulesTable=true;
          _this.showSchedulesEditer=false;
        }).catch(function (error) {
          _this.$toast({text: '通信错误!'+response.data,type:'danger',duration: 4000});
        });
      },
      clkAPrjctToModify(r) {
        this.showProjectEditer=true;
        this.theOriginProject = JSON.parse(JSON.stringify(r));//{...r}深度克隆一个对象
        let strOriginPrjct=JSON.stringify(this.theOriginProject);
        this.newOrEditedProject=JSON.parse(strOriginPrjct);
        this.initializeIdsInProject(this.theOriginProject);
        this.initializeIdsInProject(this.newOrEditedProject);
        //初始化tracksInThisProject
        this.tracksInThisProject=[];
        let queryContent={
          conditions:"TracksInThisProject",
          id_project:this.theOriginProject.id,
        };
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.tracksInThisProject=response.data;
          _this.originTracksInPrjct=JSON.parse(JSON.stringify(_this.tracksInThisProject));
        }).catch(function (error) {
          _this.$toast({text: '通信错误!'+response.data,type:'danger',duration: 4000});
        });
      },
      initializeIdsInProject(p) {
        var exp=p.ids_operators;
        if(!exp && typeof(exp)!="undefined" && exp!=0) {
          let ids=new Array(0,0,0,0,0);
          p.ids_operators=ids;
        // } else if(!Array.isArray(p.ids_operators)) {
        } else if(typeof(p.ids_operators)==="string") {//因为有可能是数组
          var temAry=p.ids_operators.split(',');
          p.ids_operators=[];
          for(var i=0;i<5;i++) {
            p.ids_operators[i]=temAry[i]?temAry[i]:0;
          }
        }
      },
      async axiosAsync() {
        // return await this.promiseMethod();
        this.allProjects = await this.promiseMethod();
      },
      promiseMethod () {
        var _this=this;
        var queryContent={};
        queryContent.conditions="ownUnfinishedProjects";
        var prmsData= new Promise((resolve, reject) => {//return
          this.$axios({
            method: 'post',
            url: 'getProjects.php',
            data: qs.stringify(queryContent)
          }).then((res) => {
            resolve(res.data);
          }).catch((err) => {
            reject(err);
          });
        });
        return prmsData;
      },
      getTracksForEdtingAtds() {
        // this.allProjects=this.$store.state.projects;
        this.axiosAsync();
        this.isShowPsFAAs=true;
        // console.log(this.allProjects);
      },
      ClearTracksForAddingAtds() {
        this.allProjects=[];
        this.theTrackForEdtingAtds={};
        this.isShowPsFAAs=false;
        this.isShowTip=false;
      },
      goBackToTrackSelecter () {
        this.isShowPsFAAs=true;
        this.isShowTip=false;
        //从原始数据恢复this.selectableATDs=[...this.copyOfslctblATDs];
        this.selectableATDs=JSON.parse(JSON.stringify(this.copyOfslctblATDs));
      },
      getATDsWithAllAttendedRcds() {
        var queryContent={};
        var _this=this;
        this.ATDsWithAttendedRcds=[];
        queryContent.conditions="ATTENDEES_WITH_ATTENDING_All_PROJECT_RECORDS";
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          _this.ATDsWithAttendedRcds=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!'+response.data,
            type: 'danger',
            duration: 4000
          });
        });
      },
      clkATrackToAddOrReduceATDs (r) {
        this.theTrackForEdtingAtds=JSON.parse(JSON.stringify(r));//{...r};
        //暂存原始数据[...this.selectableATDs];
        this.copyOfslctblATDs=JSON.parse(JSON.stringify(this.selectableATDs));
        if(this.theTrackForEdtingAtds.id) {
          this.isShowPsFAAs=false;
          this.isShowTip=true;
          //原已参会嘉宾:从参加所有会议的嘉宾中选出本次会议的参会嘉宾 is_deleted=0
          this.ATDsWhoHaveAttendedThisTrack=this.ATDsWithAttendedRcds.filter((item,i,arr) => {
            if(item.id_track==this.theTrackForEdtingAtds.id && item.is_deleted==0) {
              return item;
            }
          });
          //把原已经参加本次会议且未删除的嘉宾从可选嘉宾的列表中删除
          if(this.ATDsWhoHaveAttendedThisTrack.length>0) {
            //[...this.ATDsWhoHaveAttendedThisTrack];
            this.slctdATDs=JSON.parse(JSON.stringify(this.ATDsWhoHaveAttendedThisTrack));
            this.strOfOriginSlctdATDs=JSON.stringify(this.ATDsWhoHaveAttendedThisTrack);
            this.tmpSlctdAtds=JSON.stringify(this.ATDsWhoHaveAttendedThisTrack);
            for(let i=0;i<this.selectableATDs.length;i++) {
              let o=this.slctdATDs.find((ele) => {
                return (this.selectableATDs[i].id == ele['id'] && ele['is_deleted']==0)
              });
              if(typeof(o)!='undefined') {
                this.selectableATDs.splice(i, 1);
                i--;
              }
            }
            //更新可选参会嘉宾的临时存储[...this.selectableATDs];
            this.tmpSlctableATDs=JSON.stringify(this.selectableATDs);
          } else {
            this.slctdATDs=[];
            this.strOfOriginSlctdATDs="";
            this.tmpSlctdAtds=[];
            this.tmpSlctableATDs=JSON.stringify(this.selectableATDs);
          }
        } else {
          this.isShowPsFAAs=true;
          this.isShowTip=false;
        }
      },
      dlbClkTheATDInTheBeingToSlctBox (r) {
        if(!r.role) {
          r.role="一般参会代表";
        }
        var i=this.selectableATDs.findIndex((ele) => ele['id'] == r.id);
        var o=this.selectableATDs.find((ele) => ele['id'] == r.id);
        this.selectableATDs.splice(i,1);
        this.slctdATDs.push(o);

        var i=this.tmpSlctableATDs.findIndex((ele) => ele['id'] == r.id);
        this.tmpSlctableATDs.splice(i,1);

        var str=JSON.stringify(this.slctdATDs);
        this.tmpSlctdAtds=JSON.parse(str);
      },
      dlbClkASlctdAtd(r) {
        var i=this.slctdATDs.findIndex((ele) => ele['id'] == r.id);
        var o=this.slctdATDs.find((ele) => ele['id'] == r.id);
        this.slctdATDs.splice(i,1);
        this.selectableATDs.unshift(o);
        this.tmpSlctableATDs.unshift(o);

        var i=this.tmpSlctdAtds.findIndex((ele) => ele['id'] == r.id);
        this.tmpSlctdAtds.splice(i,1);
      },
      keyWordInAllATDsChanged() {
        this.keyOfSchgInAllATDs=this.keyOfSchgInAllATDs.replace(/^\s+|\s+$/g,"");
        if(!this.keyOfSchgInAllATDs) {
          this.selectableATDs=JSON.stringify(this.tmpSlctableATDs);
          //[...this.tmpSlctableATDs];
        } else {
          this.selectableATDs = this.tmpSlctableATDs.filter((item,i,arr) => {
            return (item.name.indexOf(this.keyOfSchgInAllATDs) != -1 ) || (item.workplace && item.workplace.indexOf(this.keyOfSchgInAllATDs) != -1) || (item.mp1 && item.mp1.indexOf(this.keyOfSchgInAllATDs) != -1);
          });
          if(this.selectableATDs.length<1) {
            console.log('No Data');
          }
        }
      },
      keyWordInSlctdATDsChanged() {
        this.keyOfSchgInSlctdATDs=this.keyOfSchgInSlctdATDs.replace(/^\s+|\s+$/g,"");
        if(!this.keyOfSchgInSlctdATDs) {
          var str=JSON.stringify(this.tmpSlctdAtds);
          this.slctdATDs=JSON.parse(str);
        } else {
          this.slctdATDs = this.tmpSlctdAtds.filter((item,i,arr) => {
            return (item.name.indexOf(this.keyOfSchgInSlctdATDs) != -1 ) || (item.workplace && item.workplace.indexOf(this.keyOfSchgInSlctdATDs) != -1) || (item.mp1 && item.mp1.indexOf(this.keyOfSchgInSlctdATDs) != -1);
          });
          if(this.slctdATDs.length<1) {
            console.log('No Data');
          }
        }
      },
      saveSlctdATDsInTheTrack() {
        if(this.strOfOriginSlctdATDs==JSON.stringify(this.slctdATDs)) {
          this.$toast({text:'没有变更!',type: 'info',duration:800});
          return;
        }
        this.slctdATDs.forEach( function(element, index) {
          if(element.speech_topics && element.speech_topics.length>256) {
            element.speech_topics=element.speech_topics.substr(0 ,255);
          }
        });
        this.queryContent.project=this.theTrackForEdtingAtds;
        this.queryContent.selectedATDsAtTheProject=this.slctdATDs;
        this.queryContent.id_curUser=this.id_curUser;
        this.queryContent.conditions="WithSlctdAttendeesAtTheProject";
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateAttendedRecords.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(response.data===true) {
            _this.$toast({text:"操作成功",type:'success',duration:1000});
            _this.axiosAsync();
            _this.$store.commit('initializeProjects',_this.allProjects);
            _this.goBackToTrackSelecter();
            _this.getATDsWithAllAttendedRcds();//更新嘉宾的参会记录
          } else {
            console.log(response.data);
            _this.$toast({
              text: '操作失败,请稍后再试!',
              type: 'danger',
              duration: 4000
            });
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!'+response.data,
            type: 'danger',
            duration: 4000
          });
        });
      },
      clkAPrjctToEditSchedule(r) {
        this.showAgendaViewer=true;
        this.thePFSA=r;
        var queryContent={
          conditions:"ON-SOMEONE-PROJECT",
          id_project:this.thePFSA.id,
        };
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getSchedules.php',
          data:qs.stringify(queryContent)
        }).then(function (response) {
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.scheduleAgendas=response.data;
            } else {
              // _this.$toast({text:'找不到该展会项目的日程!',type:'info',duration: 1500});
            }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 2000
          });
        });
      },
      switchPrjctForSAs() {
        this.showAgendaViewer=false;
        this.scheduleAgendas=[];
        this.addOneRowAdvnc();
      },
      addOneRowAdvnc() {
        var sa= {
          id:0,
          time_range:'',
          location:'',
          id_agenda:0,
          hosts_id:0,
          speaker_id:0,
          speech_topics:'',
          remark:'',
        };
        this.scheduleAgendas.push(sa);
      },
      deleteTheRowAdvnc(idx) {
        if(this.scheduleAgendas.length===1) {
          this.$toast({text:'至少需要一条日程!',type:'info',duration:1000});
          return;
        }
        if(this.scheduleAgendas[idx]['id']) {//将要移除的是原有的日程
          this.beenRemovedSAs.push(this.scheduleAgendas[idx]);
        }
        this.scheduleAgendas.splice(idx,1);
      },
      saveSAs() {
        var originIdsOfSchedulesAtTheProject=[];
        //验证数据合法性
        for(var i=0;i<this.scheduleAgendas.length;i++) {
          if(!this.scheduleAgendas[i].time_range) {
            this.$toast({text:'第 '+(Number(i)+1)+' 项的 开始/结束时间!',type:'info',duration:2000});
            return;
          }
          if(!this.scheduleAgendas[i].location) {
            this.$toast({text:'第 '+(Number(i)+1)+' 项的 地点!',type:'info',duration:2000});
            return;
          }
          if(this.scheduleAgendas[i].id_agenda==0) {
            this.$toast({text:'第 '+(Number(i)+1)+' 项的 环节!',type:'info',duration:2000});
            return;
          }
          if(this.scheduleAgendas[i].speaker_id!=0 && !this.scheduleAgendas[i].speech_topics) {
            this.$toast({text:'第 '+(Number(i)+1)+' 项的 报告题目!',type:'info',duration:2000});
            return;
          }
          if(this.scheduleAgendas[i].speaker_id==0) {
            this.scheduleAgendas[i].speech_topics='';
            // this.$toast({text:'第 '+(Number(i)+1)+' 项的 报告人!',type:'info',duration:2000});
            // return;
          }
          if(this.scheduleAgendas[i].id) {
            originIdsOfSchedulesAtTheProject.push(this.scheduleAgendas[i].id);
          }
          this.scheduleAgendas[i].id_project=this.thePFSA.id;
        }
        var queryContent={
          conditions:"DATA FROM PROJECT",
          SAs:this.scheduleAgendas,
          id_curUser:this.id_curUser,
          id_project:this.thePFSA.id,
          OIDS:originIdsOfSchedulesAtTheProject,
          beenRemovedSAs:this.beenRemovedSAs,
        };
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'insertOrUpdateSchedules.php',
          data:qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data==true) {
            _this.$toast({text:'操作成功!',type:'success',duration: 800});
            _this.initializeProject();
            _this.axiosAsync();
            _this.$store.commit('initializeProjects',_this.allProjects);
            _this.getAllProjects();
            _this.switchPrjctForSAs();
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration: 1500});
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 2000
          });
        });
      },
    },
    components: {
      trtmplt
    },
    watch :{
      'strOfOriginSlctdATDs': {
        handler: function() {
          //somecode here
        }
      },
    },
    computed:{
    },
    beforeCreate:function() {
      var queryContent={};
      var _this=this;
      this.contracts=[];
      this.$axios({
        method: 'post',
        url: 'getContracts.php'
      }).then(function (response) {
        _this.contracts=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '通信错误!'+response.data,
          type: 'danger',
          duration: 4000
        });
      });
      this.selectableATDs=[];
      queryContent.conditions="ALLAttendees";
      this.$axios({
        method: 'post',
        url: 'getAttendees.php',
        data: qs.stringify(queryContent)
      }).then(function (response) {
        _this.selectableATDs=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '通信错误!'+response.data,
          type: 'danger',
          duration: 4000
        });
      });
    },
    mounted:function() {
      this.getTracksToViewOrEditSchedules();
    }     
  }  
</script>

<style scoped>
.col-lg input,.col-lg select {
  width: 80%;
  margin-left: 5px;
}
.row {
  margin-top: 5px;
  margin-bottom: 5px;
}
input {
  margin-left: 5px;
}
.new-create {
  position: absolute;
  right: 20px;
}
.theTitle {
  color: red;
  font-size: 1.2rem;
}
.waitingSlcting {
  border: solid 2px gray;
  border-radius:5px
}
.slctd {
  border: solid 2px #007bff;
  border-radius:5px
}
.tablebox {
  width: 100%;
  overflow: scroll;
  max-height: 560px;
}
.savebutton {
  width: 100px;
}
.atdstatus {
  margin-left: 50px;
  font-size: 1.2rem;
}
.table-sm td {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: none;
}
.table-sm td input {
  width:100%;
}
.dlt {
  background: #dc3545;border:1px solid #dc3545;
}
.add {
  background: #007bff;  
  border:1px solid #007bff;
}
</style>
