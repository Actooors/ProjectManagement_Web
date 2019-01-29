<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button @click="Refresh" ghost icon="md-refresh" size="large" type="success">
        刷新
      </Button>
    </ButtonGroup>
    <Table :columns="columns1" :data="data1" border :loading="loading" class="table" size="large" stripe></Table>
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
    <Modal v-if="modal3_delay" v-model="modal3" title="请再次确认" @on-ok="pass(index)" ok-text="确定" cancel-text="再想想"
           width="800px">
      <p style="font-size: 15px">您确定通过该项目吗？ 若确定，请在确定前选择该项目的负责专家。</p>
      <br>
      <Form :label-width="73">
        <FormItem label="负责专家">
          <Select v-model="experts" multiple>
            <Option v-for="(item,index) in expertList" :key="index" :value="item.userId">
              {{ item.userName }}—{{ item.department }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>


<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: "oneEx",
    watch: {
      modal2(val) {
        if (val) {
          this.modal2_delay = true
        }
      },
      modal3(val) {
        if (val) {
          this.modal3_delay = true
        }
      },
    },
    data() {
      return {
        loading: false,
        modal1: false,
        modal2: false,
        modal2_delay: false,
        modal3: false,
        modal3_delay: false,
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
            align: 'center'
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
            title: '操作',
            key: 'content',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'info'},
                  on: {
                    click: () => {
                      this.details(params.index);
                    }
                  },
                }, '详情'),
                h('Button', {
                  props: {type: 'success'},
                  style: {marginLeft: '10px'},
                  on: {
                    click: () => {
                      this.modal3 = true
                      this.index = params.index
                      // this.pass(params.index)
                    }
                  },
                }, '通过'),
                h('Button', {
                  props: {type: 'error'},
                  style: {marginLeft: '10px'},
                  on: {
                    click: () => {
                      this.reject(params.index)
                    }
                  },
                }, '驳回')]);
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
        expertList: [],
        experts: [],
        data1: [],
        data2: [],
        data3: []
      }
    },
    mounted() {
      this.initExperts()
      this.initData('初始化成功！')
    },
    methods: {
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
        await Promise.all([a, b]);
        this.modal2 = true
      },
      pass(index) {
        axios({
          url: apiRoot + '/admin/firstTrial',
          method: 'post',
          data: {
            applicationId: this.data1[index].projectId,
            judge: true,
            expertList: this.experts
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.experts = []
            this.data1.splice(index, 1)
            this.$Message.success('该项目已通过初审！');
          } else {
            this.$Message.error(res.data.message);
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
      cancel() {
        this.modal1 = false
      },
      initExperts() {
        axios({
          url: apiRoot + '/admin/expertList',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.expertList = res.data.data
          } else {
            this.$Message.error("获取审核专家列表有误！")
          }
        })
      },
      download(index) {
        const that = this
        var filename = this.data1[index].projectDownloadAddress.split('---')[1]
        axios({
          url: apiRoot + '/file/download?fileAddress=' + that.data1[index].projectDownloadAddress,
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
      confirm() {
        axios({
          url: apiRoot + '/admin/firstTrial',
          method: 'post',
          data: {
            applicationId: this.data1[this.index].projectId,
            judge: false,
            msg: '项目处于何时被驳回：初审阶段\n操作人：' + localStorage.getItem('username') + '\n驳回理由：' + this.reason,
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
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/reviewPhase/1',
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
        }).catch((err) => {
          console.error(err)
          this.$Message.error('初始化失败,请检查网络！')
          this.loading = false;
        })
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "oneEx";
</style>
