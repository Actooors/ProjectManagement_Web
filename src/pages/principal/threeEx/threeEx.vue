<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button @click="Refresh" ghost icon="md-refresh" size="large" type="success">
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border class="table" size="large" :loading="loading" stripe></Table>
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
    <Modal
      :mask-closable="false"
      @on-cancel="cancel"
      maxHeight="800"
      ref="model"
      title="进行会评"
      v-model="modal3"
      width="700">
      <Form :label-width="180" style="margin-right: 25px">
        <div class="from_middle" style="font-size: 14px;">
          <p data-v-2526d47e="" style="font-weight: bold; color: rgb(70, 76, 91);">评审内容填写</p>
          <Input :autosize="{minRows: 4,maxRows: 10}" placeholder="请填写会评（申请者可以重新修改）" type="textarea"
                 v-model="passReason"></Input>
          <br>
          <br>
          <p>申请经费：{{this.projectMoney}}元，经费额度：{{this.projectMaxMoney}}元</p>
          <br>
          <div style="display: inline-flex;line-height: 32px">
            <p>选择调整申请的经费：</p>
            <InputNumber v-model="modifiedMoney" :max="projectMaxMoney" :min="0"></InputNumber>&nbsp;元
          </div>
          <br>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="passConfirm" style="margin-top: 20px;margin-left: 20px;width:100px"
                type="primary">
          完成
        </Button>
      </div>
    </Modal>
    <Modal
      :mask-closable="false"
      @on-cancel="cancel"
      maxHeight="800"
      ref="model"
      title="驳回理由"
      v-model="modal4"
      width="700">
      <Form :label-width="180" style="margin-right: 25px">
        <div class="from_middle">
          <p data-v-2526d47e="" style="font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);">
            驳回理由填写（申请者可以重新修改）</p>
          <Input :autosize="{minRows: 4,maxRows: 10}" placeholder="请填写驳回理由" type="textarea"
                 v-model="rejectReason"></Input>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="rejectConfirm" style="margin-top: 20px;margin-left: 20px;width:100px" type="primary">
          完成
        </Button>
      </div>
    </Modal>
    <Modal
      maxHeight="1700"
      ref="modal"
      title="查看专家评审结果"
      v-model="modal5"
      width="800">
      <Table :columns="columns3" :data="data4" :loading="spinShow" border></Table>
      <div slot="footer">
        <Button @click="modal5=false" type="primary">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>


<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: "threeEx",
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
        modal1: false,
        modal2: false,
        modal2_delay: false,
        modal3: false,
        modal4: false,
        modal5: false,
        priority: '',
        passReason: '',
        rejectReason: '',
        infoTitle: null,
        index: 0,
        spinShow: false,
        projectMoney: null,
        projectMaxMoney: null,
        modifiedMoney: null,
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
            tooltip: true
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
            title: '其他专家评审结果',
            key: 'chooseExpert',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'success',
                    },
                    on: {
                      click: () => {
                        this.initComment(params.index)
                        this.modal5 = true
                      }
                    },
                  },
                  '点击查看'
                )])
            }
          },
          {
            title: '操作',
            key: 'content',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                  h('Button', {
                    props: {type: 'info'},
                    style: {marginRight: '10px'},
                    on: {
                      click: () => {
                        this.details(params.index)
                      }
                    }
                  }, '详情'),
                  h('Button', {
                    props: {type: 'success'},
                    style: {marginRight: '10px'},
                    on: {
                      click: () => {
                        this.pass(params.index)
                      }
                    },
                  }, '同意'),
                  h('Button', {
                    props: {type: 'error'},
                    on: {
                      click: () => {
                        this.reject(params.index)
                      }
                    },
                  }, '驳回')
                ]
              );
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
        columns3: [
          {
            title: '专家姓名',
            key: 'expertName',
            align: 'center'
          },
          {
            title: '专家学/工号',
            key: 'expertId',
            align: 'center'
          },
          {
            title: '完成评审',
            key: 'isFinished',
            align: 'center'
          },
          {
            title: '评语',
            key: 'reviewOpinion',
            align: 'center'
          },
          {
            title: '评分',
            key: 'score',
            align: 'center'
          },
          {
            title: '最终意见',
            key: 'finalOpinion',
            align: 'center'
          }
        ],
        data1: [],
        data2: [],
        data3: [],
        data4: [],
      }
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      result(index) {
        this.$Message.info('查看其他专家评审结果')
      },
      pass(index) {
        this.$Modal.confirm({
          title: '请再次确认',
          content: '您确定通过项目 ' + this.data1[index].projectName + ' 吗？',
          okText: '确定',
          cancelText: '再想想',
          onOk: () => {
            this.modal3 = true
            this.index = index
            this.projectMaxMoney = parseInt(this.data1[index].projectMaxMoney)
            this.projectMoney = this.data1[index].projectMoney
            this.modifiedMoney = this.data1[index].projectMoney
          }
        })
      },
      passConfirm() {
        axios({
          url: apiRoot + '/admin/meetingTrial',
          method: 'post',
          data: {
            applicationId: this.data1[this.index].projectId,
            judge: true,
            msg: this.passReason,
            projectMoney: this.modifiedMoney
          }
        }).then((res) => {
          console.log(res.data)
          if (res.data.code === 'SUCCESS') {
            this.data1.splice(this.index, 1)
            this.$Message.success('该项目已通过会评！');
          } else {
            this.$Message.error(res.data.message);
          }
          this.modal3 = false
        })
      },
      reject(index) {
        this.$Modal.confirm({
          title: '请再次确认',
          content: '您确定驳回项目 ' + this.data1[index].projectName + ' 吗？',
          okText: '确定',
          cancelText: '再想想',
          onOk: () => {
            this.modal4 = true
            this.index = index
          }
        })
      },
      rejectConfirm() {
        axios({
          url: apiRoot + '/admin/meetingTrial',
          method: 'post',
          data: {
            applicationId: this.data1[this.index].projectId,
            judge: false,
            msg: '项目处于何时被驳回：会评阶段\n操作人：' + localStorage.getItem('username') + '\n驳回理由：' + this.rejectReason,
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1.splice(this.index, 1)
            this.$Message.success('成功将该项目驳回！');
          } else {
            this.$Message.error(res.data.message);
          }
          this.modal4 = false
        })
      },
      cancel() {
        this.modal1 = false
      },
      async details(index) {
        const a = axios({
          url: apiRoot + '/admin/category/' + this.data1[index].projectCategoryId.toString(),
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.infoTitle = res.data.data.projectName
            this.data2 = res.data.data
            this.projectMoney = res.data.data.projectMoney
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + this.data1[index].projectId.toString(),
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data3 = res.data.data
          }
        })
        await Promise.all([a, b]);
        this.modal2 = true
      },
      download(index) {
        const that = this
        var filename = this.data1[index].projectDownloadAddress.split('---')[1]
        axios({
          url: that.data1[index].projectDownloadAddress,
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
        })
      },
      Refresh() {
        this.initData('刷新成功！');
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
          url: apiRoot + '/admin/reviewPhase/3',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data;
            this.$Message.success(msg)
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
      initComment(index) {
        this.spinShow = true
        axios({
          url: apiRoot + '/admin/project/' + this.data1[index].projectId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            for (let i = 0; i < res.data.data.expertOpinionInfoList.length; i++) {
              if (res.data.data.expertOpinionInfoList[i].isFinished === 1) {
                res.data.data.expertOpinionInfoList[i].isFinished = '是';
              } else {
                res.data.data.expertOpinionInfoList[i].isFinished = '否';
              }
              if (res.data.data.expertOpinionInfoList[i].finalOpinion === 1) {
                res.data.data.expertOpinionInfoList[i].finalOpinion = '优先支持'
              } else if (res.data.data.expertOpinionInfoList[i].finalOpinion === 2) {
                res.data.data.expertOpinionInfoList[i].finalOpinion = '支持'
              } else if (res.data.data.expertOpinionInfoList[i].finalOpinion === 3) {
                res.data.data.expertOpinionInfoList[i].finalOpinion = '反对'
              }
            }
            this.data4 = res.data.data.expertOpinionInfoList;
            this.data4.push({
              expertName: '平均评分',
              expertId: null,
              finalOpinion: null,
              isFinished: null,
              reviewOpinion: null,
              score: res.data.data.average
            })
          } else {
            this.$Message.error(res.data.message)
          }
          this.spinShow = false
        }).catch(() => {
          this.$Message.error("查看其他专家评审结果失败，请检查网络连接！")
          this.spinShow = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "threeEx";
</style>
