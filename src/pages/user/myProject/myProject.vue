<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Tabs value="1" class="tabs">
      <TabPane label="已立项的项目" name="1" icon="md-book">
        <Table stripe border :loading="loading" :columns="columns1" :data="data1" class="table" height="750"
               size="large"></Table>
      </TabPane>
      <TabPane label="待提交中期报告" name="2" icon="md-calendar">
        <Table stripe border :loading="loading" :columns="columns2" :data="data2" class="table" height="750"
               size="large"></Table>
        <Modal
          v-model="modal1"
          title="上传中期报告"
          @on-ok="uploadReport(index,1)"
        >
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess1"
            :on-error="uploadError1"
            action="http://129.204.71.113:8888/api/file/upload">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽文件以上传</p>
            </div>
          </Upload>
        </Modal>
      </TabPane>
      <TabPane label="待提交结题报告" name="3" icon="md-document">
        <Table stripe border :loading="loading" :columns="columns3" :data="data3" class="table" height="750"
               size="large"></Table>
        <Modal
          v-model="modal2"
          title="上传结题报告"
          @on-ok="uploadReport(index,2)"
        >
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess2"
            :on-error="uploadError2"
            action="http://129.204.71.113:8888/api/file/upload">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽文件以上传</p>
            </div>
          </Upload>
        </Modal>
      </TabPane>
      <TabPane label="已结项的项目" name="4" icon="md-checkbox">
        <Table stripe border :loading="loading" :columns="columns4" :data="data4" class="table" height="750"
               size="large"></Table>
      </TabPane>
    </Tabs>
    <Modal v-if="modal3_delay" v-model="modal3" :title="infoTitle" width="900px">
      <p>项目描述：{{data5.projectDescription}}</p>
      <br>
      <p>业务员手机：{{data5.principalPhone}}</p>
      <br>
      <p>项目大类：{{data5.projectType}}</p>
      <br>
      <p>经费额度：{{data5.maxMoney}}元</p>
      <br>
      <p>申请经费：{{data6.projectMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in data5.applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in data6.expertList">{{item.userName}}&nbsp;</p>
      <br>
      <br>
      <p>是否可提交中期报告：{{(data5.interimReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data5.interimReport.isReportActivated"
        @click="downloadProjectMaterial(data5.interimReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p v-if="data5.interimReport.isReportActivated">中期报告开始时间：{{data5.interimReport.startTime}}</p>
      <br v-if="data5.interimReport.isReportActivated">
      <p v-if="data5.interimReport.isReportActivated">中期报告截止时间：{{data5.interimReport.deadline}}</p>
      <br v-if="data5.interimReport.isReportActivated">
      <p>是否可提交结题报告：{{(data5.concludingReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data5.concludingReport.isReportActivated"
        @click="downloadProjectMaterial(data5.concludingReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p v-if="data5.concludingReport.isReportActivated">结题报告开始时间：{{data5.concludingReport.startTime}}</p>
      <br v-if="data5.concludingReport.isReportActivated">
      <p v-if="data5.concludingReport.isReportActivated">结题报告截止时间：{{data5.concludingReport.deadline}}</p>
      <br v-if="data5.concludingReport.isReportActivated">
      <p>项目成员(默认第一个为项目负责人)：</p>
      <br>
      <Table :columns="columns5" :data="data6.members" size="small" stripe></Table>
      <br>
      <p>项目申请书：<a @click="downloadProjectMaterial(data6.applicationAddress)">点击下载</a></p>
      <br>
      <p v-if="data6.interimAddress===null">项目中期报告：未提交</p>
      <p v-if="data6.interimAddress!==null">项目中期报告：<a @click="downloadProjectMaterial(data6.interimAddress)">点击下载</a>
      </p>
      <br>
      <p v-if="data6.concludingAddress===null">项目结题报告：未提交</p>
      <p v-if="data6.concludingAddress!==null">项目结题报告：<a
        @click="downloadProjectMaterial(data6.concludingAddress)">点击下载</a></p>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: "myProject",
    data() {
      return {
        loading: false,
        modal1: false,
        modal2: false,
        modal3: false,
        modal3_delay: false,
        infoTitle: null,
        index: 0,
        isFinishedMidRe: true,
        isFinishedEndRe: true,
        middleReportAddress: '',
        lastReportAddress: '',
        i: 0,
        uploadHeaders: {
          Authorization: localStorage.getItem('token')
        },
        columns1: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '立项日期',
            key: 'time',
            align: 'center',
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击查看详情')
                      this.details(params.index)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        columns2: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '提交截止日期',
            key: 'time',
            align: 'center',
          },
          {
            title: '提交状态',
            key: 'status',
            align: 'center'
          },
          {
            title: '是否提交中期报告',
            key: 'isFinished',
            align: 'center',
            render: (h, params) => {
              if (this.isFinishedMidRe === true)
              {
                var status = '已提交'
                var display = 'block'
              } else {
                var status = '未提交'
                var display = 'none'
              }
              return h('div', [
                h('span',status),
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px',
                    display: display
                  },
                  on: {
                    click: () => {
                      this.this.download(params.index, 1)
                    }
                  }
                }, '下载中期报告')])
            }
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.download(params.index, 1)
                    }
                  }
                }, '下载模板'),
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.index = params.index;
                    }
                  }
                }, '上传')
              ])
            }
          }
        ],
        columns3: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '提交截止日期',
            key: 'time',
            align: 'center',
          },
          {
            title: '提交状态',
            key: 'status',
            align: 'center'
          },
          {
            title: '是否提交结题报告',
            key: 'isFinished',
            align: 'center',
            render: (h, params) => {
              if (this.isFinishedEndRe === true)
              {
                var status = '已提交'
                var display = 'block'
              } else {
                var status = '未提交'
                var display = 'none'
              }
              return h('div', [
                h('span',status),
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px',
                    display: display
                  },
                  on: {
                    click: () => {
                      this.this.download(params.index, 2)
                    }
                  }
                }, '下载结题报告')])
            }
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.download(params.index, 2)
                    }
                  }
                }, '下载模板'),
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  on: {
                    click: () => {
                      this.modal2 = true
                      this.index = params.index
                    }
                  }
                }, '上传')
              ])
            }
          }
        ],
        columns4: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '结项时间',
            key: 'time',
            align: 'center',
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.details(params.index)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        columns5:[
          {
            title: '姓名',
            key: 'userName',
            align: 'center'
          },
          {
            title: '学号',
            key: 'userId',
            align: 'center'
          },
          {
            title: '学院',
            key: 'department',
            align: 'center'
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'mail',
            align: 'center'
          }
        ],
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        data5: [],
        data6: []
      }
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      Refresh() {
        this.initData('刷新成功！');
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/user/progressProject',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            for (let i = 0; i < res.data.data.middleProject.length; i++) {
              if (res.data.data.middleProject[i].status === 1) {
                res.data.data.middleProject[i].status = '可提交';
              } else if (res.data.data.middleProject[i].status === 2) {
                res.data.data.middleProject[i].status = '已超过提交时间';
              } else {
                res.data.data.middleProject[i].status = '未到提交时间';
              }
            }
            for (let i = 0; i < res.data.data.middleProject.length; i++) {
              if (res.data.data.middleProject[i].isFinished === true) {
                res.data.data.middleProject[i].isFinished = '已提交';
                this.isFinishedMidRe = true
              } else {
                res.data.data.middleProject[i].isFinished = '未提交';
                this.isFinishedMidRe = false
              }
            }
            for (let i = 0; i < res.data.data.finalProject.length; i++) {
              if (res.data.data.finalProject[i].status === 1) {
                res.data.data.finalProject[i].status = '可提交';
              } else if (res.data.data.finalProject[i].status === 2) {
                res.data.data.finalProject[i].status = '已超过提交时间';
              } else {
                res.data.data.finalProject[i].status = '未到提交时间';
              }
            }
            for (let i = 0; i < res.data.data.finalProject.length; i++) {
              if (res.data.data.finalProject[i].isFinished === true) {
                res.data.data.finalProject[i].isFinished = '已提交';
                this.isFinishedEndRe = true
              } else {
                res.data.data.finalProject[i].isFinished = '未提交';
                this.isFinishedEndRe = false
              }
            }
            this.data1 = res.data.data.buildProject;
            this.data2 = res.data.data.middleProject;
            this.data3 = res.data.data.finalProject;
            this.data4 = res.data.data.finishProject
            this.$Message.success(msg)
            this.loading = false;
          } else {
            this.$Message.warning(res.data.message);
            this.loading = false;
          }
        }).catch((err) => {
          console.error(err)
          this.$Message.error("初始化失败,请检查网络！");
          this.loading = false
        })
      },
      uploadSuccess1(response) {
        this.middleReportAddress = response.data
      },
      uploadSuccess2(response) {
        this.middleReportAddress = response.data
      },
      uploadError1() {
        this.$Message.error("上传失败！");
      },
      uploadError2() {
        this.$Message.error("上传失败！");
      },
      uploadReport(index, type) {
        if (type === 1) {
          var appId = this.data2[index].projectApplicationId;
          var address = this.middleReportAddress
          var status
          if (this.data2[index].status === '可提交') {
            status = 1
          } else if (this.data2[index].status === '已超过提交时间') {
            status = 2
          } else {
            status = 3
          }
        } else {
          var appId = this.data3[index].projectApplicationId;
          var address = this.lastReportAddress
          var status
          if (this.data3[index].status === '可提交') {
            status = 1
          } else if (this.data3[index].status === '已超过提交时间') {
            status = 2
          } else {
            status = 3
          }
        }
        axios({
          url: apiRoot + '/user/commitReport',
          method: 'post',
          data: {
            applicationId: appId,
            uploadAddress: address,
            type: type,
            status: status
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success("上传成功！");
            if (type === 1) {
              this.data2.splice(index, 1)
            } else {
              this.data3.splice(index, 1)
            }
          } else {
            this.$Message.warning(res.data.message);
          }
        }).catch(() => {
          this.$Message.error("请检查网络连接！");
        });
      },
      download(index, type) {
        const that = this
        if (type === 1) {
          if (this.data2[index].reportAddress === null) {
            this.$Message.error('该项目已超过中期报告提交时间，无法下载！');
            return
          } else {
            var filename = that.data2[index].reportAddress.split('---')[1];
            var address = that.data2[index].reportAddress;
          }
        } else {
          if (this.data3[index].reportAddress === null) {
            this.$Message.error('该项目已超过结题报告提交时间，无法下载！');
            return
          } else {
            var filename = that.data3[index].reportAddress.split('---')[1];
            var address = that.data3[index].reportAddress;
          }
        }
        axios({
          url: apiRoot + '/file/download?fileAddress=' + address,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            download(res.data, filename, 'text/plain')
            this.$Message.success("下载成功！")
          } else {
            this.$Message.error("下载失败！")
          }
        }).catch((err) => {
          console.error(err)
          this.$Message.error("下载失败，请检查网络连接！")
        });
      },
      async details(index) {
        const a = axios({
          url: apiRoot + '/admin/category/' + this.data1[index].projectCategoryId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.infoTitle = res.data.data.projectName
            this.data5 = res.data.data
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + this.data1[index].projectId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data6 = res.data.data
          }
        })
        await Promise.all([a, b]);
        this.modal3 = true
      },
      downloadProjectMaterial(address) {
        console.log(address, '!')
        const that = this
        var filename = address.split('---')[1]
        axios({
          url: address,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            download(res.data, filename, 'text/plain');
            this.$Message.success('下载成功！');
          } else {
            this.$Message.error('下载失败！');
          }
        }).catch(() => {
          this.$Message.error('下载失败，请检查网络连接！')
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "myProject";
</style>
