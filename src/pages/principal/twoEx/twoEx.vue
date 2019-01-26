<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border class="table" size="large" :loading="loading" stripe></Table>
    <Modal
      @on-cancel="cancel"
      maxHeight="800"
      ref="model"
      title="驳回理由"
      v-model="modal1"
      width="700">
      <Form :label-width="180" style="margin-right: 25px">
        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">
            驳回理由填写（申请者可以重新修改）</p>
          <Input :autosize="{minRows: 4,maxRows: 10}" placeholder="请填写驳回理由" type="textarea"
                 v-model="reason"></Input>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="confirm" style="margin-top: 20px;margin-left: 20px;width:100px"
                type="primary">
          完成
        </Button>
      </div>
    </Modal>
    <Modal v-if="modal2_delay" v-model="modal2" :title="infoTitle" width="900px">
      <p>项目描述：{{data2.projectDescription}}</p>
      <br>
      <p>业务员手机：{{data2.principalPhone}}</p>
      <br>
      <p>项目大类：{{data2.projectType}}</p>
      <br>
      <p>经费额度：{{data2.maxMoney}}元</p>
      <br>
      <p>申请经费：{{data3.projectMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in data2.applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in data3.expertList">{{item.userName}}&nbsp;</p>
      <br>
      <br>
      <p>是否可提交中期报告：{{(data2.interimReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data2.interimReport.isReportActivated"
        @click="downloadProjectMaterial(data2.interimReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p v-if="data2.interimReport.isReportActivated">中期报告开始时间：{{data2.interimReport.startTime}}</p>
      <br v-if="data2.interimReport.isReportActivated">
      <p v-if="data2.interimReport.isReportActivated">中期报告截止时间：{{data2.interimReport.deadline}}</p>
      <br v-if="data2.interimReport.isReportActivated">
      <p>是否可提交结题报告：{{(data2.concludingReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data2.concludingReport.isReportActivated"
        @click="downloadProjectMaterial(data2.concludingReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p v-if="data2.concludingReport.isReportActivated">结题报告开始时间：{{data2.concludingReport.startTime}}</p>
      <br v-if="data2.concludingReport.isReportActivated">
      <p v-if="data2.concludingReport.isReportActivated">结题报告截止时间：{{data2.concludingReport.deadline}}</p>
      <br v-if="data2.concludingReport.isReportActivated">
      <p>项目成员(默认第一个为项目负责人)：</p>
      <br>
      <Table :columns="columns2" :data="data3.members" size="small" stripe></Table>
      <br>
      <p>项目申请书：<a @click="downloadProjectMaterial(data3.applicationAddress)">点击下载</a></p>
      <br>
      <p v-if="data3.interimAddress===null">项目中期报告：未提交</p>
      <p v-if="data3.interimAddress!==null">项目中期报告：<a @click="downloadProjectMaterial(data3.interimAddress)">点击下载</a>
      </p>
      <br>
      <p v-if="data3.concludingAddress===null">项目结题报告：未提交</p>
      <p v-if="data3.concludingAddress!==null">项目结题报告：<a
        @click="downloadProjectMaterial(data3.concludingAddress)">点击下载</a></p>
    </Modal>
  </div>
</template>


<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: "twoEx",
    watch: {
      modal2(val) {
        if (val) {
          this.modal2_delay = true
        }
      }
    },
    data() {
      return {
        loading: false,
        show: false,
        modal1: false,
        modal2: false,
        modal2_delay: false,
        infoTitle: null,
        index: 0,
        reason: '',
        columns1: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          },
          {
            title: '项目类别',
            key: 'projectCategoryName',
            align: 'center',
          },
          {
            title: '申请截止日期',
            key: 'applicationDeadLine',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
            align: 'center',
          },
          {
            title: '下载申请书',
            key: 'downloadReport',
            align: 'center',
            render: (h, params) => {
              return h('div', [h('Button', {
                props: {type: 'info'},
                on: {
                  click: () => {
                    this.download(params.index)
                  }
                },
              }, '项目申请书')]);
            }
          },
          {
            title: '专家审核进度',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              return h('div', [h('Progress', {
                props: {
                  successPercent: this.data1[params.index].expertOpinion.percentage,
                },
              }, this.data1[params.index].expertOpinion.percentage + '%')])
            }
          },
          {
            title: '操作',
            key: 'content',
            align: 'center',
            width: 300,
            render: (h, params) => {
              return h('div', [
                  h('Button', {
                    props: {
                      type: 'info'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.details(params.index);
                      }
                    }
                  }, '详情'),
                  h('Button', {
                    props: {type: 'warning'},
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.pass(params.index)
                      }
                    },
                  }, '进入下一阶段'),
                  h('Button', {
                    props: {type: 'error'},
                    on: {
                      click: () => {
                        this.reject(params.index)
                      }
                    }
                  }, '驳回')
                ]
              )
            }
          }
        ],
        columns2: [
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
        progress: [],
      }
    },
    mounted() {
      this.initData("初始化成功！");
    },
    methods: {
      download(index) {
        const that = this
        var filename = this.data1[index].projectApplicationDownloadAddress.split('---')[1]
        axios({
          url: apiRoot + '/file/download?fileAddress=' + that.data1[index].projectApplicationDownloadAddress,
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
        }).catch(() => {
          this.$Message.error("下载失败，请检查网络连接！")
        })
      },
      Refresh() {
        this.initData('刷新成功!');
      },
      cancel() {
        this.modal1 = false
      },
      pass(index) {
        this.$Modal.confirm({
          title: '请再次确认',
          content: '您确定跳过项目 ' + this.data1[index].projectName + ' 的专家审核阶段吗？',
          okText: '确定',
          cancelText: '再想想',
          onOk: () => {
            axios({
              url: apiRoot + '/admin/expertTrial',
              method: 'post',
              data: {
                applicationId: this.data1[index].projectId,
                judge: true,
              }
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.data1.splice(index, 1)
                this.$Message.success('该项目已通过专家审核阶段！');
              } else {
                this.$Message.error(res.data.message);
              }
            })
          }
        })
      },
      reject(index) {
        this.$Modal.confirm({
          title: '请再次确认',
          content: '您确定驳回项目 ' + this.data1[index].projectName + ' 吗？',
          okText: '确定',
          cancelText: '再想想',
          onOk: () => {
            this.modal1 = true
            this.index = index
          }
        })
      },
      confirm() {
        axios({
          url: apiRoot + '/admin/expertTrial',
          method: 'post',
          data: {
            applicationId: this.data1[this.index].projectId,
            judge: false,
            msg: '项目处于何时被驳回：专家审核阶段\n操作人：' + localStorage.getItem('username') + '\n驳回理由：' + this.reason,
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1.splice(this.index, 1)
            this.$Message.success('成功将该项目驳回！');
          } else {
            this.$Message.error(res.data.message);
          }
          this.modal1 = false
        })
      },
      async details(index) {
        const a = axios({
          url: apiRoot + '/admin/category/' + this.data1[index].projectCategoryId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.infoTitle = res.data.data.projectName
            this.data2 = res.data.data
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + this.data1[index].projectId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data3 = res.data.data
          }
        })
        await Promise.all([a, b])
        this.modal2 = true
      },
      downloadProjectMaterial(address) {
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
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/reviewPhase/2',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data;
            this.$Message.success(msg);
            this.loading = false;
          } else {
            this.$Message.warning(res.data.message)
            this.loading = false;
          }
        }).catch(() => {
          this.$Message.error('初始化失败,请检查网络！')
          this.loading = false;
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "twoEx";
</style>
