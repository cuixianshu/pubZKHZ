<template>
  <div class="father">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" v-if="curUser.position!='adjunct'">
        <a class="nav-link" data-toggle="tab" href="#checkInfo">快速查验</a>
      </li>
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#newCreateOrModify">修改/新建</a>
      </li> 
<!--       <li class="nav-item" v-if="curUser.position!='adjunct'">
        <a class="nav-link" data-toggle="tab" href="#sendInvitation">发送邀请</a>
      </li> --> 
      <li class="nav-item" v-if="curUser.position!='adjunct'">
        <a class="nav-link" data-toggle="tab" href="#searchExport">检索导出</a>
      </li> 
    </ul>
    <div class="tab-content">
      <div id="checkInfo" class="container-fluid tab-pane pre-scrollable">
        <div v-if="showCISearchBox">
          <div class="row form-inline">
            <select class="form-control mgrt10" v-model="queryContent.id_track">
              <option value=0>不限专场</option>
              <option v-for="(item,index) in tracks" :value="item.id">{{item.subject}}</option>
            </select>
            <input type="text" class="form-control mgrt10" placeholder="关键词" v-model="queryContent.keyWord">
            <button  class="btn btn-primary" @click="getAttendeesForCI">搜索代表</button>
            
          </div>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        </div>
        <div v-if="showCIATDsList">
          <div v-if="attendeesInCI.length>0">
            <div class="row">
              <div class="col-lg">
                <button class="btn btn-link" @click="backToCiSearchBox">返回</button>
              </div>
              <div class="col-lg">
              </div>
              <div class="col-lg">
                <button class="btn btn-link" @click="gotoPreviousPage" v-if="showPreviousPage">上一页</button>
                到<input type="text" style="width:35px;" v-model="currentPageNumber" @change="pageNumberInputed" >/{{countOfTotalPages}}页
                <button class="btn btn-link" @click="gotoNextPage" v-if="showNextPage">下一页</button>
              </div>
            </div>
            <div class="samecard" v-for="(row,index) in attendeesInCI">
              <div class="row">
                <div class="col-lg-4 form-inline">
                  <label>姓名</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.name" style="width:85%;">
                </div>
                <div class="col-lg-3 form-inline">
                  <label>国家</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.country" style="width:85%;">
                </div>
                <div class="col-lg form-inline">
                  <label>专场</label>
                  <select class="form-control bgchvy-txtwt" v-model="row.id_last_track">
                    <option value=0>选择专场</option>
                    <option v-for="item in tracks" :value="item.id">{{item.subject}}</option>
                  </select>
                </div>
                <div class="col-lg-2 form-inline">
                  <label>黑名单</label>
                  <select class="form-control bgchvy-txtwt" v-model="row.is_blacklisted" style="">
                    <option value="0">否</option>
                    <option value="1">是</option>
                  </select>
                </div>
                <div class="col-lg-1 form-inline">
                  <span class="bgchvy-txtwt">{{row.id}}</span>
                </div>
              </div>
          <div class="form-inline mgtp20mgbtm20">
            <label for="keynote">主题演讲</label>
            <input id="keynote" type="checkbox" class="form-control mgrt20" v-model="row.level" value="keynote">
            <label for="SAB">SAB</label>
            <input id="SAB" type="checkbox" class="form-control mgrt20" v-model="row.level" value="SAB">
            <label for="chair">主席</label>
            <input id="chair" type="checkbox" class="form-control mgrt20" v-model="row.level" value="chair">
            <label for="speaker">演讲人</label>
            <input id="speaker" type="checkbox" class="form-control mgrt20" v-model="row.level" value="speaker">
            <label for="media">媒体</label>
            <input id="media" type="checkbox" class="form-control mgrt20" v-model="row.level" value="media">
            <label for="partner">合作方</label>
            <input id="partner" type="checkbox" class="form-control mgrt20" v-model="row.level" value="partner">
            <label for="audience">观众</label>
            <input id="audience" type="checkbox" class="form-control mgrt20" v-model="row.level" value="audience">
          </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>邮箱</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.email1" style="width:90%;" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>机构</label>
                  <input class="form-control bgchvy-txtwt slmbdr" type="text" v-model="row.workplace" style="width:90%;">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>备注</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.remark" style="width:90%;" title="备注">
                </div>
              </div>
              <div class="row">
                <div class="col-lg">
                  <button class="btn btn-primary  btn-sm" @click="saveCurrentATD(row)">保存修改</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="attendeesInCI.length<1">
            没有数据
          </div>
          <div class="row">
            <div class="col-lg">
              <button class="btn btn-link" @click="backToCiSearchBox">返回</button>
            </div>
            <div class="col-lg">
            </div>
            <div class="col-lg">
              <button class="btn btn-link" @click="gotoPreviousPage" v-if="showPreviousPage">上一页</button>
              到<input type="text" style="width:35px;" v-model="currentPageNumber" @change="pageNumberInputed">/{{countOfTotalPages}}页
              <button class="btn btn-link" @click="gotoNextPage" v-if="showNextPage">下一页</button>
            </div>
          </div>

        </div>
      </div>
      <div id="newCreateOrModify" class="container-fluid tab-pane pre-scrollable active">
        <div v-if="showNMSearchBox">
          <div class="row form-inline">
            <input type="text" class="form-control mgrt10" placeholder="关键词" v-model="NMQC.keyWord">
            <button  class="btn btn-primary mgrt10" @click="getAtdsForModifying">搜索代表</button>
            <button  class="btn btn-primary mgrt10" @click="newCrtATD">新建代表</button>
          </div>
        </div>
        <div v-if="atdsInNM.length && showAtdListForNM">
          <div class="row">
            <div class="col-lg">
              <button class="btn btn-link" @click="clrNMAndBkToSchbox">返回</button>
            </div>
            <div class="col-lg">
              <button class="btn btn-secondary" @click="clrNMAndBkToSchbox">清空结果</button>
            </div>
          </div>
          <ul>
            <li class="samecard" v-for="(row,index) in atdsInNM" @click="clkAnAtd(row)">
              <div class="row">
                <div class="col-lg-4 form-inline">
                  <label>姓名</label>
                  <input class="form-control" type="text" v-model="row.name" style="width:85%;" readonly>
                </div>
                <div class="col-lg-3 form-inline">
                  <label>国家</label>
                  <input class="form-control" type="text" v-model="row.country" style="width:85%;" readonly>
                </div>
               <div class="col-lg form-inline">
                  <label>专场</label>
                  <select class="form-control" v-model="row.id_last_track" disabled>
                    <option value=0>选择专场</option>
                    <option v-for="item in tracks" :value="item.id">{{item.subject}}</option>
                  </select>
                </div>
                <div class="col-lg-2 form-inline">
                  <label>黑名单</label>
                  <select class="form-control" v-model="row.is_blacklisted" disabled>
                    <option value="0">否</option>
                    <option value="1">是</option>
                  </select>
                </div>
                 <div class="col-lg-1 form-inline">
                  <span class="bgchvy-txtwt">{{row.id}}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>邮箱</label>
                  <input class="form-control" type="text" v-model="row.email1" style="width:90%;" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>机构</label>
                  <input class="form-control slmbdr" type="text" v-model="row.workplace" style="width:90%;" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>备注</label>
                  <input class="form-control" type="text" v-model="row.remark" style="width:90%;" title="备注" readonly>
                </div>
              </div>
            </li>
          </ul>
          <div class="row">
            <div class="col-lg">
              <button class="btn btn-link" @click="clrNMAndBkToSchbox">返回</button>
            </div>
            <div class="col-lg">
            </div>
          </div>
        </div>
        <div v-if="!atdsInNM.length && showAtdListForNM">
          <h5>没有数据</h5>
        </div>
        <div v-if="showAtdEditer">
          <div class="row">
            <div class="col-lg">
              <button class="btn btn-link" @click="bkToAtdLst">返回</button>
            </div>
            <div class="col-lg">
              <button class="btn btn-primary" @click="saveCurATD">保存数据</button>
            </div>
          </div>
          <div class="container-fluid">
            <div class="form-inline mgtp5">
              上次修改:<span>{{curATD.time_modifyed=='0001-01-01 00:00:00'?'':curATD.time_modifyed}}</span>
            </div>
            <div class="form-inline mgtp5">
              邮箱:<input type="text" class="form-control mgrt10" v-model="curATD.email1" readonly style="width:85%;">
              <button class="btn btn-link" @click="showAddEmBox=!showAddEmBox;">+</button>
            </div>
            <div class="form-inline mgtp5" v-if="showAddEmBox">
              &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" class="form-control mgrt10" v-model="addedEM" style="width:50%;">
              <button class="btn btn-primary btn-sm mgrt10" @click="addEM">确定</button>
              <button class="btn btn-secondary btn-sm" @click="showAddEmBox=false;">放弃</button>
            </div>
            <div class="form-inline mgtp5">
              专场:<select class="form-control mgrt10" v-model="curATD.id_last_track" style="width:85%;">
                <option value="0">不限</option>
                <option v-for="item in tracks" :value="item.id">{{item.subject}}</option>
              </select>
            </div>
            <div class="form-inline mgtp20mgbtm20">
              <label for="keynote">主题演讲</label>
              <input id="keynote" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="keynote">
              <label for="SAB">SAB</label>
              <input id="SAB" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="SAB">
              <label for="chair">主席</label>
              <input id="chair" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="chair">
              <label for="speaker">演讲人</label>
              <input id="speaker" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="speaker">
              <label for="media">媒体</label>
              <input id="media" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="media">
              <label for="partner">合作方</label>
              <input id="partner" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="partner">
              <label for="audience">观众</label>
              <input id="audience" type="checkbox" class="form-control mgrt20" v-model="curATD.level" value="audience">
            </div>
            <div class="form-inline mgtp5">
              姓名:<input type="text" class="form-control mgrt10" v-model="curATD.name">
              性别:<select class="form-control mgrt10" v-model="curATD.gender">
                <option value="0">女</option>
                <option value="1">男</option>
              </select>
              餐食:<select class="form-control mgrt10" v-model="curATD.dietary">
                <option value="0">不限</option>
                <option value="1">清真</option>
                <option value="1">素食</option>
              </select>
              黑名单:<select class="form-control mgrt10" v-model="curATD.is_blacklisted">
                <option value="0">否</option>
                <option value="1">是</option>
              </select>
            </div>
            <div class="form-inline mgtp5">
              职称:<input type="text" class="form-control mgrt10" v-model="curATD.professional_title" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              职务:<input type="text" class="form-control mgrt10" v-model="curATD.position" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              头衔:<input type="text" class="form-control mgrt10" v-model="curATD.title1" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              国家:<input type="text" class="form-control mgrt10" v-model="curATD.country" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              机构:<input type="text" class="form-control mgrt10" v-model="curATD.workplace" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              获奖:<input type="text" class="form-control mgrt10" v-model="curATD.awards" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              方向:<input type="text" class="form-control mgrt10" v-model="curATD.ICO" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              成就:<input type="text" class="form-control mgrt10" v-model="curATD.attainment" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              题目:<input type="text" class="form-control mgrt10" v-model="curATD.atcl_title" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              主页:<input type="text" class="form-control mgrt10" v-model="curATD.personal_page" style="width:85%;">
            </div>
            <div class="form-inline mgtp5">
              备注:<input type="text" class="form-control mgrt10" v-model="curATD.remark" style="width:85%;">
            </div>
          </div>
        </div>
      </div>
      <div id="sendInvitation" class="container-fluid tab-pane">
        <div class="container-fluid form-inline searchbox">
          <label>拟参加</label>
          <select class="form-control" v-model="queryContent.id_track">
            <option value=0>请选择专场</option>
            <option v-for="item in tracks" :value="item.id">{{item.subject}}</option>
          </select>;&nbsp
          <label>已邀请</label>
          <select class="form-control" v-model="queryContent.invitedTimes">
            <option value=0>0</option>
            <option value=1>1</option>
            <option value=2>2</option>
            <option value=3>3</option>
            <option value=4>4</option>
            <option value=5>5</option>
            <option value=6>6</option>
            <option value=7>7</option>
            <option value=8>8</option>
            <option value=9>9</option>
          </select>次;&nbsp
          <label>上次于</label>
          <input type="date" class="form-control" v-model="queryContent.sDate">至
          <input type="date" class="form-control" v-model="queryContent.eDate">间;&nbsp
          </select>
          <label>需导出</label>
          <select class="form-control" v-model="queryContent.wantQty">
            <option value=1>1k</option>
            <option value=2>2k</option>
          </select>条。
          <button  class="btn btn-primary" @click="getEmailsList">获取嘉宾信息</button>
        </div>
        <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        <div class="container-fluid" v-if="emailList.length<1">
          <h5>{{textOfOperatedResult}}</h5>
        </div> 
        <div>
          <button class="btn btn-secondary" v-if="emailList.length>0" @click="clrAtdArr">清除</button>
          <button class="btn btn-primary" @click="saveAsCsvToSendEmails" v-if="emailList.length>0">存为CSV以发送邀请</button>

        </div>
        <div class="divfortable container-fluid" v-if="emailList.length>0">
          <table class="table table-hover">
            <thead>
              <th>姓名</th><th>邮箱</th><th>论文题目</th><th>专场主题</th><th style="width:6%;">专场号</th>
            </thead>
            <tbody>
              <tr v-for="row in emailList">
                <td class="txtleft">{{row.name}}</td>
                <td class="txtleft">{{row.email1}}</td>
                <td class="txtleft">{{row.atcl_title}}</td>
                <td>{{getTrackName(row.id_last_track)}}</td>
                <td>{{row.id_last_track}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="searchExport" class="container-fluid tab-pane">
        <div class="container-fluid mgtp5" v-if="showSESchBox">
          <div class="form-inline mgtp20mgbtm20" title="被搜索代表的层级">
            <label for="keynote">主题演讲</label>
            <input id="keynote" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="keynote">
            <label for="SAB">SAB</label>
            <input id="SAB" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="SAB">
            <label for="chair">主席</label>
            <input id="chair" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="chair">
            <label for="speaker">演讲人</label>
            <input id="speaker" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="speaker">
            <label for="media">媒体</label>
            <input id="media" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="media">
            <label for="partner">合作方</label>
            <input id="partner" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="partner">
            <label for="audience">观众</label>
            <input id="audience" type="checkbox" class="form-control mgrt20" v-model="SEQC.level" value="audience">
          </div>
          <div class="form-inline mgtp5">
            <label>项目</label>
            <select class="form-control" v-model="SEQC.id_project">
              <option value=0>请选择项目</option>
              <option v-for="item in int_projects" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="form-inline mgtp5">
            <label>专场</label>
            <select class="form-control" v-model="SEQC.id_track">
              <option value=0>不限专场</option>
              <option v-for="item in tracksInSE" :value="item.id">{{item.subject}}</option>
            </select>
          </div>
          <div class="form-inline mgtp5">
            <label>性别</label>
            <select class="form-control mgrt10" v-model="SEQC.gender">
              <option value="2">不限</option>
              <option value="1">男</option>
              <option value="0">女</option>
            </select>
            <label>餐食</label>
            <select class="form-control mgrt10" v-model="SEQC.dietary">
              <option value="0">任意</option>
              <option value="1">清真</option>
              <option value="2">素食</option>
            </select>
          </div>
          <div class="form-inline mgtp5">
            <label>国家</label>
            <input type="text" class="form-control mgrt10" v-model="SEQC.countries" placeholder="国家间以逗号间隔" title="多个国家名以英文逗号间隔,不区分大小写" style="min-width:30%;">
            <label>排除的国家</label>
            <input type="text" class="form-control mgrt10" v-model="SEQC.excluded_countries" placeholder="排除国家,以逗号间隔" title="多个国家名以英文逗号间隔,不区分大小写" style="min-width:30%;"><!-- <button class="btn btn-link" @click="addACountry">+</button> -->

          </div>
<!--           <div class="form-inline mgtp5" v-if="showExcldCntrs">
            <input type="text" class="form-control mgrt10"  v-model="SEQC.excluded_country" placeholder="国家名"><button class="btn btn-primary btn-sm mgrt10">确定</button>
            <button class="btn btn-secondary btn-sm mgrt10">取消</button>
          </div> -->
          <div class="form-inline mgtp5">
            <label>黑白</label>
            <select class="form-control mgrt10" v-model="SEQC.is_blacklisted">
              <option value="2">不限</option>
              <option value="1">黑名单</option>
              <option value="0">白名单</option>
            </select>
            <label>拒绝</label>
            <select class="form-control mgrt10" v-model="SEQC.is_refused">
              <option value="2">不限</option>
              <option value="1">已拒绝</option>
              <option value="0">未拒绝</option>
            </select>
            <label>退出</label>
            <select class="form-control mgrt10" v-model="SEQC.is_quit" title="反馈是否已退出">
              <option value="2">不限</option>
              <option value="1">已退出</option>
              <option value="0">未退出</option>
            </select>
          </div>
          <div class="form-inline mgtp5">
            <label>建于</label>
            <input type="date" class="form-control mgrt20" v-model="SEQC.sCrtdDate"><span class="mgrt20">至</span>
            <input type="date" class="form-control" v-model="SEQC.eCrtdDate">
          </div>
          <div class="form-inline mgtp5">
            <label>改于</label>
            <input type="date" class="form-control mgrt20" v-model="SEQC.sEdtdDate"><span class="mgrt20">至</span>
            <input type="date" class="form-control" v-model="SEQC.eEdtdDate">
          </div>
          <div class="form-inline mgtp5">
            <label>邀于</label>
            <input type="date" class="form-control mgrt20" v-model="SEQC.sInvitedDate" title="上次邀请日期"><span class="mgrt20">至</span>
            <input type="date" class="form-control" v-model="SEQC.eInvitedDate" title="上次邀请日期">
          </div>
          <div class="form-inline mgtp5">
            <label>已邀</label>
            <select class="form-control" v-model="SEQC.invitedTimes">
              <option value=0>0</option>
              <option value=1>1</option>
              <option value=2>2</option>
              <option value=3>3</option>
              <option value=4>4</option>
              <option value=5>5</option>
              <option value=6>6</option>
              <option value=7>7</option>
              <option value=8>8</option>
              <option value=9>9</option>
              <option value=10>不限次数</option>
            </select>次;
          </div>
          <div class="form-inline mgtp5">
            <label>需要</label>
            <select class="form-control" v-model="SEQC.wantQty">
              <option value=1>1k</option>
              <option value=2>2k</option>
              <option value=3>3k</option>
              <option value=4>4k</option>
              <option value=5>5k</option>
            </select>条。
          </div>
          <div class="form-inline mgtp5">
            <label>创建</label>
            <select class="form-control mgrt20" v-model="SEQC.id_creater" title="创建人">
              <option value=0>不限创建者</option>
              <option v-for="item in myEmplys" :value="item.id">{{item.name}}</option>
            </select>
            <label>修改</label>
            <select class="form-control" v-model="SEQC.id_editor" title="修改人">
              <option value=0>不限修改者</option>
              <option v-for="item in myEmplys" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="form-inline mgtp5">
            <label>搜索</label>
            <input type="text" class="form-control wth50p" v-model="SEQC.keyWord" placeholder="姓名/邮箱/职称/职务/头衔/机构/获奖/方向/成就/备注等">
          </div>
          <div class="form-inline mgtp5">
            <label>目的</label>
            <select class="form-control mgrt20 mgtp5" v-model="SEQC.purpose">
              <option value=2>请选择查询目的</option>
              <option value=0>不用于邀请</option>
              <option value=1>用于发送邀请</option>
            </select>
            <button  class="btn btn-primary" @click="searchAtdsInSE">搜索</button>
          </div>
        </div>
        <hr style="height:1px;border:none;border-top:2px solid #007bff;" v-if="showSESchBox" />
        <div class="container-fluid" v-if="showAtdsInSE">
          <div class="row" v-if="atdsInSE.length>0">
            <div class="col">
              <button class="btn btn-link" @click="bkToSESchBox">返回</button>
            </div>
            <div class="col">
              <button class="btn btn-primary" @click="svAtdsInSE">导出CSV</button>
            </div>
          </div>
          <div class="mgtp5" v-if="atdsInSE.length>0">
            <h5>共找到{{atdsInSE.length}}条数据</h5>
          </div>
        </div>
      </div>
    </div>
    <div id="loading" class="loadingbox" v-show="showLoading">
      <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
    </div>
  </div>
</template>
<script>
  import qs from 'qs';
  import saveAsCSV from '@/cuiLibs/saveAsCSV.js'
  export default {
    data () {
      return {
        //common
        showLoading:false,
        imgUrl:require('@/assets/images/loading.gif'),
        currentUserId:this.$store.state.user.id_user,
        curUser:{},
        myEmplys:this.$store.state.myEmplys,
        projects:this.$store.state.projects,
        queryContent:{
          keyWord:'',
          conditions:'',
          dateRange:[],
          id_attendee:0,
          id_project:0,
          id_track:0,//checkInfo,sendInvitation
          invitedTimes:0,//sendInvitation
          sDate:'',//sendInvitation
          eDate:'',//sendInvitation
          wantQty:1,//sendInvitation
        },
        nameOfLvl:['keynote','SAB','chair','speaker','media','partner','audience'],
        //checkInfo
        tracks:[],//和sendInvitation共用
        showCISearchBox:true,
        showCIATDsList:false,
        attendeesInCI:[],
        showPreviousPage:true,
        showNextPage:true,
        countOfRows:0,
        endId:0,
        startId:0,
        idsOfAll:[],
        currentPageNumber:1,
        countOfTotalPages:1,
        countInOnePage:20,
        
        //sendInvitation
        //tracks:[],//和checkInfo共用
        emailList:[],
        textOfOperatedResult:"",
        attendees:[],
        allMobileNumbers:[],
        allEmails:[],

        //newCreateOrModify
        showNMSearchBox:true,
        NMQC:{
          keyWord:'',
        },
        atdsInNM:[],
        showAtdListForNM:false,
        showAtdEditer:false,
        isNewCreateAtd:false,
        showAddEmBox:false,
        curATD:{},
        addedEM:'',
        orgATD:'',

        //searchExport
        showSESchBox:true,
        showAtdsInSE:false,
        showExcldCntrs:false,
        tracksInSE:[],
        int_projects:[],
        SEQC:{
          id_project:0,
          id_track:0,
          level:[],
          sCrtdDate:'',
          eCrtdDate:'',
          sEdtdDate:'',
          eEdtdDate:'',
          sInvitedDate:'',
          eInvitedDate:'',
          countries:'',
          id_creater:0,
          id_editor:0,
          keyWord:'',
          gender:2,
          dietary:0,
          is_blacklisted:2,
          is_refused:2,
          is_quit:2,
          excluded_countries:'',
          invitedTimes:10,
          wantQty:1,
          purpose:2,
        },
        strSEQC:'',
        atdsInSE:[],

      }
    },
    components: {
     // button,
    },
    methods:{
      getTracks() {
        this.queryContent.conditions="byKeyWordForCheckATDsInfo";
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
            console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.tracks=response.data;
            }
          } else {
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      getAttendeesForCI() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.attendeesInCI=[];
        this.countOfTotalPages=0;
        this.showCIATDsList=true;
        this.showCISearchBox=false;
        this.queryContent.conditions="byKeyWordAndTrack's ID ForCheckATDsInfo";
        this.queryContent.startId=0;
        this.queryContent.endId=0;
        this.queryContent.countInOnePage=this.countInOnePage;
        console.log(this.queryContent);
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.rows.length>0) {
              _this.attendeesInCI=response.data.rows;
              _this.countOfRows=response.data.ids.length;
              _this.idsOfAll=response.data.ids;
              _this.attendeesInCI.forEach( function(ele, index) {
                //开始和结束Id
                _this.endId=Number(ele.id)>Number(_this.endId)?Number(ele.id):Number(_this.endId);
                _this.startId=Number(ele.id)<Number(_this.startId)?Number(ele.id):Number(_this.startId);
                //获取层级
                let numArrLvl=ele.level.split('');
                let strLvlInAtd=[];
                for(let i=0;i<numArrLvl.length;i++) {
                  if(numArrLvl[i]==1) {
                    strLvlInAtd.push(_this.nameOfLvl[i]);
                  }
                }
                ele.level=strLvlInAtd;
              },_this);
              //不显示上一页
              _this.showPreviousPage=false;
              _this.currentPageNumber=1;
              _this.showNextPage=_this.countOfRows>_this.countInOnePage && _this.attendeesInCI.length>0?true:false;
              if(_this.countOfRows%_this.countInOnePage==0) {
                _this.countOfTotalPages=_this.countOfRows/_this.countInOnePage;
              } else {
                _this.countOfTotalPages=Math.ceil(_this.countOfRows/_this.countInOnePage);
              }
            }
          } else {
            console.log(response.data);
          }
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      backToCiSearchBox() {
        this.showCIATDsList=false;
        this.showCISearchBox=true;
        this.startId=0;
        this.endId=0;
      },
      gotoPreviousPage() {
        this.currentPageNumber--;
        let firstPosition=this.idsOfAll.findIndex((ele)=>ele==this.startId);
        
        if((firstPosition-20)<=0) {
          this.startId=this.idsOfAll[0];
          this.endId=this.idsOfAll[19];
        } else {
          this.startId=this.idsOfAll[firstPosition-20];
          this.endId=this.idsOfAll[firstPosition-1];
        }
        
        this.getATDsByStartAndEndID(this.startId,this.endId);
      },
      gotoNextPage(){
        this.currentPageNumber++;
        let lastPosition=this.idsOfAll.findIndex((ele)=>ele==this.endId);
        this.startId=this.idsOfAll[lastPosition+1];
        this.endId=this.idsOfAll[lastPosition+20];
        if((lastPosition+20)>=(this.idsOfAll.length-1)) {
          this.endId=this.idsOfAll[this.idsOfAll.length-1];
        } else {
          this.endId=this.idsOfAll[lastPosition+20];
        }
        this.getATDsByStartAndEndID(this.startId,this.endId);
      },
      pageNumberInputed() {
        //将用户输入中的非数字部分过滤掉
        this.currentPageNumber=this.currentPageNumber.replace(/[^\d]/g,'');
        this.currentPageNumber=(this.currentPageNumber=='' || this.currentPageNumber<=0)?1:Number(this.currentPageNumber);
        this.currentPageNumber=this.currentPageNumber>=this.countOfTotalPages?Number(this.countOfTotalPages):Number(this.currentPageNumber);
        //获取该页码的起始和结束位置
        this.startId=this.idsOfAll[(this.currentPageNumber-1)*20];
        if(((this.currentPageNumber-1)*20+19)>this.countOfRows) {
          this.endId=this.idsOfAll[this.countOfRows-1];
        } else {
          this.endId=this.idsOfAll[(this.currentPageNumber-1)*20+19];
        }
        // console.log(this.endId);
        this.getATDsByStartAndEndID(this.startId,this.endId);
      },
      getATDsByStartAndEndID(s,e) {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.attendeesInCI=[];
        var _this=this;
        this.queryContent.conditions="byKeyWordAndTrack's ID ForCheckATDsInfo";
        this.queryContent.startId=s;
        this.queryContent.endId=e;
        this.queryContent.countInOnePage=this.countInOnePage;
        console.log(this.queryContent);
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(typeof(response.data)==='object') {
            if(response.data.rows.length>0) {
              _this.attendeesInCI=response.data.rows;
              //开始和结束Id
              _this.attendeesInCI.forEach( function(ele, index) {
                _this.endId=Number(ele.id)>Number(_this.endId)?Number(ele.id):Number(_this.endId);
                _this.startId=Number(ele.id)<Number(_this.startId)?Number(ele.id):Number(_this.startId);
              },_this);
            }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      saveCurrentATD(r) {
        this.queryContent.id_curUser=this.currentUserId;
        this.queryContent.conditions="UpdateWithCheckedATDsInfoToForCheckingAtdsInfo";
        this.queryContent.curATD=JSON.parse(JSON.stringify(r));
        let numArrLvl= new Array(this.nameOfLvl.length).fill(0)
        for(let i=0;i<this.nameOfLvl.length;i++) {
          if(this.queryContent.curATD.level.indexOf(this.nameOfLvl[i])>-1) {
            numArrLvl[i]=1;
          }
        }
        this.queryContent.curATD.level=numArrLvl.join('');
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration:1000});
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:3000});
        });        
      },
// **************************CI end**************************************************//
// **************************SI start**************************************************//
      getEmailsList() {
        if(this.queryContent.id_track==0) {
          this.$toast({text:'专场无效!',type:'warning',duration:1000});
          return;
        }
        if(this.queryContent.sDate>this.queryContent.eDate) {
          let d=this.queryContent.sDate;
          this.queryContent.sDate=this.queryContent.eDate;
          this.queryContent.eDate=d;
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.queryContent.conditions="byIdTrackInvitedTimesDurationForSendingInvite";
        console.log(this.queryContent);
        this.emailList=[];
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.emailList=response.data;
          _this.textOfOperatedResult=_this.emailList.length?"已找到"+_this.emailList.length+"条数据":"没有找到符合条件的数据";
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      clrAtdArr() {
        this.emailList=[];
        this.textOfOperatedResult="没有找到符合条件的数据";
      },
      saveAsCsvToSendEmails() {
        let csvFileName="ForSendingInvite";//id_track
        csvFileName+=((new Date()).getTime()).toString();
        this.emailList.forEach( function(element) {
          let o=this.tracks.find((ele) => ele['id'] == element['id_last_track']);
          element.subject= typeof o==='undefined'?'':o.subject;          
        },this);
        let obj={
          data:this.emailList,
          fileName:csvFileName,
          columns:{
            txtInheader:['姓名','电子信箱','论文题目','专场主题','专场代号'],//表头文字
            fields:['name','email1','atcl_title','subject','id_last_track'],//对应字段名
          }
        };
        saveAsCSV.setDataConver(obj);
        // update attendees invited_times
        let ids=[];
        this.emailList.forEach( function(element, index) {
          ids.push(element['id']);
        });
        // 更新attendees的invited_times=invited_times+1
        this.queryContent.conditions="invited_times+1 ForSendingInvite";
        this.queryContent.ids=ids;
        // console.log(this.queryContent);
        // return;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.textOfOperatedResult="成功导出"+_this.emailList.length+"条数据!";
            _this.emailList=[];
          } else {
            console.log("update failed!")
          }
        }).catch(function (error) {
          console.log(error);
        });
      },


// **************************SI end**************************************************//
// **************************NM start************************************************//
      getAtdsForModifying() {
        if(this.NMQC.keyWord.replace(/(^\s*)|(\s*$)/g, "").length<4) {
          this.$toast({text:'查询关键词不能少于4个字符!',type:'info',duration:2000});
          return;
        }
        this.showAtdEditer=false;
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.atdsInNM=[];
        this.NMQC.conditions="byKeyWordForModifying";
        console.log(this.NMQC);
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(_this.NMQC)
        }).then(function (response) {
          console.log(response.data);
              _this.showAtdListForNM=true;
              _this.showNMSearchBox=false;
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              if(response.data.length<50) {
                _this.atdsInNM=response.data;
              } else {
                _this.$toast({text:'结果过多,只显示前50条!',type:'info',duration: 2000});
                _this.atdsInNM=response.data.slice(0, 50);
              }
            } else {
              _this.showNMSearchBox=true;
            }
          } else {
            console.log(response.data);
          }
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      newCrtATD() {
        this.showAtdListForNM=false;
        this.showAddEmBox=false;
        this.showAtdEditer=true;
        this.isNewCreateAtd=true;
        this.curATD={
          name:'',gender:1,professional_title:'',workplace:'',position:'',awards:'',level:[],ICO:'',attainment:'',title1:'',email1:'',countries:'',dietary:0,remark:'',is_blacklisted:0,personal_page:'',atcl_title:'',id_last_track:0,
        }        

      },
      clrNMAndBkToSchbox() {
        this.atdsInNM=[];
        this.showNMSearchBox=true;
        this.showAtdListForNM=false;
      },
      clkAnAtd(a) {
        this.showAddEmBox=false;
        let numArrLvl=a.level.split('');
        let level=new Array(numArrLvl.length).fill(0);
        for(let i=0;i<numArrLvl.length;i++) {
          if(numArrLvl[i]==1) {
            level.push(this.nameOfLvl[i]);
          }
        }
        a.level=level;
        //获取atcl_title
        if(a.article_md5.length) {
          this.showLoading=true;
          $("body").css("overflow","hidden");
          let QC= {
            conditions:"byMD5Code",
            md5:a.article_md5,
          };
          let _this=this;
          this.$axios({
            method: 'post',
            url: 'getArticle.php',
            data:qs.stringify(QC)
          }).then(function (response) {
            console.log(response.data);
            _this.showLoading=false;
            $("body").css("overflow","");
            if(typeof(response.data)==='object') {
              if(response.data.length>0) {
                a.atcl_title=response.data[0]['title'];
              } else {
                a.atcl_title="";
              }
              _this.orgATD=JSON.stringify(a);
              _this.curATD=a;
              _this.showAtdListForNM=false;
              _this.showAtdEditer=true;
              _this.isNewCreateAtd=false;
            } else {
              _this.$toast({text:'操作失败!请稍后再试',type:'danger',duration: 2000});
              console.log(response.data);
              return;
            }
          }).catch(function (error) {
            _this.showLoading=false;
            $("body").css("overflow","");
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
          });          
        } else {
          a.atcl_title="";
          this.orgATD=JSON.stringify(a);
          this.curATD=a;
          this.showAtdListForNM=false;
          this.showAtdEditer=true;
          this.isNewCreateAtd=false;
        }
      },
      bkToAtdLst() {
        this.showAtdListForNM=!this.isNewCreateAtd;
        this.showAtdEditer=false;
      },
      saveCurATD() {
        if(this.curATD.email1.length<8) {
          this.$toast({text:'邮箱太短了!',type:'info',duration: 1000});
          return;
        }
        this.curATD.name=this.curATD.name.replace(/(^\s*)|(\s*$)/g, "");
        if(this.curATD.name.length<3) {
          this.$toast({text:'姓名太短了!',type:'info',duration: 1000});
          return;
        }
        if(this.curATD.id_last_track==0) {
          this.$toast({text:'请选择专场!',type:'info',duration: 1000});
          return;
        }
        if(JSON.stringify(this.curATD)===this.orgATD) {
          this.$toast({text:'没有检测到变化!',type:'info',duration: 1000});
          return;
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        let numArrLvl= new Array(this.nameOfLvl.length).fill(0)
        for(let i=0;i<this.nameOfLvl.length;i++) {
          if(this.curATD.level.indexOf(this.nameOfLvl[i])>-1) {
            numArrLvl[i]=1;
          }
        }
        this.curATD.level=numArrLvl.join('');
        let url="";
        let queryContent={
          conditions:"",
          atd:this.curATD,
          curId:this.currentUserId,
        }
        if(this.isNewCreateAtd) {
          queryContent.conditions="newATD";
          url="insertNewToAttendees.php"
        } else {
          queryContent.conditions="withNMDetailsInfo";
          url="updateAttendees.php"
        }
        let _this=this;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.showAtdEditer=false;
          _this.showAtdListForNM=!_this.isNewCreateAtd;

          if(response.data===true) {
            _this.$toast({text:'操作成功!',type:'success',duration: 800});
          } else {
            _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration: 1500});
          }
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
        });        
      },
      addEM() {
        this.addedEM=this.addedEM.replace(/(^\s*)|(\s*$)/g, "");
        let reg=/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
        if(!reg.test(this.addedEM) || this.addedEM.length<8) {
          this.$toast({text:'电子信箱输入错误!',type:'info',duration: 1000});
          return;
        }
        //检查是不是包含在数据库中
        this.showLoading=true;
        $("body").css("overflow","hidden");
        let QC={
          conditions:"doesTheEmailInDB?",
          em:this.addedEM,
        };
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(QC)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.$toast({text:'此邮箱已在系统中!',type:'warning',duration: 2000});
            } else {
              _this.curATD.email1=(_this.curATD.email1===""?"":_this.curATD.email1+",")+_this.addedEM;
              _this.showAddEmBox=false;
            }
          } else {
            _this.$toast({text:'通信错误,请稍后再试!',type:'danger',duration: 2000});
          }
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text:'操作失败!',type:'danger',duration: 2000});
        });        
      },
// **************************NM END**************************************************//
// **************************SE START************************************************
      searchAtdsInSE() {
        this.strSEQC=JSON.stringify(this.SEQC);
        if(this.SEQC.id_project==0) {
          this.$toast({text:'请选择项目!',type:'info',duration: 1000});
          return;
        }
        if(this.SEQC.purpose==2) {
          this.$toast({text:'请选择查询目的!',type:'info',duration: 1000});
          return;
        }
        //处理国家列表
        this.SEQC.countries=this.SEQC.countries.replace(/(^\s*)|(\s*$)/g, "");
        this.SEQC.countries=this.SEQC.countries.split(',');
        //处理排除国家列表
        this.SEQC.excluded_countries=this.SEQC.excluded_countries.replace(/(^\s*)|(\s*$)/g, "");
        this.SEQC.excluded_countries=this.SEQC.excluded_countries.split(',');
        // console.log(this.SEQC.excluded_countries);
        // return;
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.atdsInSE=[];
        console.log(this.SEQC);
        this.SEQC.conditions="complexSrchForExportCSV"
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(_this.SEQC)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.length<1) {
              _this.$toast({text:'没有找到符合条件的数据!',type:'info',duration: 2000});
            } else {
              _this.atdsInSE=response.data;
              _this.showSESchBox=false; 
              _this.showAtdsInSE=true;
            }
          } else {
            _this.$toast({text:'查询失败,请稍后再试!',type:'danger',duration: 2000});
          }
          _this.SEQC=JSON.parse(_this.strSEQC);
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.SEQC=JSON.parse(_this.strSEQC);
          console.log(error);
          _this.$toast({text:'操作失败!',type:'danger',duration: 2000});
        });        
      },
      bkToSESchBox() {
        this.showAtdsInSE=false;
        this.showSESchBox=true;
        this.SEQC=JSON.parse(this.strSEQC);

      },
      svAtdsInSE() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.showAtdsInSE=false;
        this.showSESchBox=true;
        let csvFileName=((new Date()).getTime()).toString();
        csvFileName+='searched_list';
        let md5s=[];
        let ids=[];
        let nameOfDietary=['any','moslem','vegetarian'];
        this.atdsInSE.forEach( function(e) {
          if(md5s.findIndex((ele)=>ele==e['article_md5'])<0) {
            md5s.push(e['article_md5']);
            ids.push(e['id']);
          } 
          e['gender']=e['gender']==1?'male':'female';
          let arrLvl=e['level'].split("");
          let strLvl="";
          for(let i=0;i<arrLvl.length;i++) {
            if(arrLvl[i]==1) {
              strLvl+=strLvl==""?this.nameOfLvl[i]:(","+this.nameOfLvl[i]);
            }
          }
          e['level']=strLvl;
          e['dietary']=nameOfDietary[Number(e['dietary'])];
          let o=this.myEmplys.find((ele) => ele['id'] == e['id_modifyer']);
          e['id_modifyer']= typeof o==='undefined'?'':o.name;
          o=this.tracks.find((ele) => ele['id'] == e['id_last_track']);
          e['id_last_track']= typeof o==='undefined'?'':(o.subject);
          e['is_blacklisted']=e['is_blacklisted']==1?'Yes':'No';
          e['is_refused']=e['is_refused']==1?'Yes':'No';
        },this);
        if(this.SEQC.purpose==1) {
          let _this=this;
          let queryContent={
            ids:ids,
            conditions:'invitetimesPlusOnewithoutId_track',
          }
          this.$axios({
            method: 'post',
            url: 'updateAttendees.php',
            data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            if(response.data===true) {
              _this.$toast({text:'邀请成功!',type:'success',duration:800});
            } else {
              _this.$toast({text: '邀请失败!',type:'danger',duration:2000});
              _this.showLoading=false;
              $("body").css("overflow","");
              return;
            }
          }).catch(function (error) {
            _this.$toast({text: '通信错误!',type:'danger',duration:2000});
            _this.showLoading=false;
            $("body").css("overflow","");
            return;
          });
        }
        //获取article title
        let _this=this;
        let queryContent={
          conditions:'byAtdsAtclMd5ForExport',
          md5s:[],
        };
        queryContent.md5s=md5s;
        let atcl_titleAndidmd5s=[];
        this.$axios({
          method: 'post',
          url: 'getArticle.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(response.data);
          atcl_titleAndidmd5s=typeof(response.data)==='object'?response.data:[];
          _this.atdsInSE.forEach( function(e) {//.includes
            atcl_titleAndidmd5s.find(function(ele){
              if(ele['id_md5']==e['article_md5']) {
                e.article_title=ele['title'];
              }
            });
          },_this)
          let obj={
            data:_this.atdsInSE,
            fileName:csvFileName,
            columns:{
              txtInheader:['id','姓名','性别','职称','机构','职务','获奖','方向','成就','头衔','邮箱','层级','国家','餐食','备注','专场','黑名单','已拒绝','创建于','修改于','编辑者','论文题目'],//表头文字
              fields:['id','name','gender','professional_title','workplace','position','awards','ICO','attainment','title1','email1','level','country','dietary','remark','id_last_track','is_blacklisted','is_refused','time_created','time_modifyed','id_modifyer','article_title'],//对应字段名
            }
          };
          saveAsCSV.setDataConver(obj);
          _this.SEQC=JSON.parse(_this.strSEQC);        
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text: '通信错误!',type: 'danger',duration: 4000});
        });              
      },
// **************************SE END**************************************************
    },
    computed:{
      getTrackName() {
        return function(i) {

          let o=this.tracks.find((ele) => ele['id'] == i);
          return typeof o==='undefined'?'':o.subject;
        }
      },
    },
    beforeCreate() {
    },
    mounted() {
      this.getTracks();
      this.curUser=this.$store.state.myEmplys.find((ele) => ele['id'] == this.currentUserId);
      console.log(this.curUser);
      this.queryContent.conditions="is_international";
      let _this=this;
      this.$axios({
        method: 'post',
        url: 'getProjects.php',
        data: qs.stringify(_this.queryContent)
      }).then(function (response) {
        console.log(response.data);
        _this.int_projects=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({text: '通信错误!',type: 'danger',duration: 4000});
      });      
    },
    watch:{
      'currentPageNumber':{
        handler: function() {
          if(this.currentPageNumber<=1) {
            this.showPreviousPage=false;
          } else {
            this.showPreviousPage=true;
          }
          if(this.currentPageNumber>=this.countOfTotalPages) {
            this.showNextPage=false;
          } else {
            this.showNextPage=true;
          }
        }
      },
      'SEQC.id_project':{
        handler: function() {
          this.tracksInSE=this.tracks.filter((ele)=>ele.id_project==this.SEQC.id_project);
        },
        immediate: true,
      },
    }
  }  
</script>

<style scoped>
.tab-content,.row,.mgtp5 {
  margin-top: 5px;
}
.searchbox button,.searchbox input,.searchbox select {
  margin-left: 5px;
}
.searchbox {
  margin-bottom: 5px;  
}
.tab-pane {
  margin-top: 5px;
  margin-bottom: 5px;
}
.row .col-lg input, .row .col-lg select {
  width: 80%;
}
.pre-scrollable {
 min-height: 620px;
}
.samecard {
  border-radius:5px;
  background-color: #3C3C3C;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.samecard label {
  color: white;
}
.mgrt10 {
  margin-right:10px;
}
.mgrt20 {
  margin-right:20px;
}
.txtleft {
  text-align: left;
}
.bgchvy-txtwt {
  background: #3C3C3C;
  color: white;  
}
.slmbdr {
  border: 1px solid #ced4da;
}
input[type=checkbox] {
  width: 1.2rem;
  height: 1.2rem;
}
.mgtp20mgbtm20 {
  margin-top: 20px;
  margin-bottom: 20px;  
}
.wth50p {
  width: 50%;
}
</style>
