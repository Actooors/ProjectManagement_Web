<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"></Table>
    <Modal
      v-model="model1"
      title="填写最终审核结果"
      width="650"
      maxHeight="700"
      ref="modal"
      @on-cancel="cancel"
    >
      <div>
        <div class="button">
          选择是否通过最终审核：
          <Button @click.native="showAccept">
            通过审核
          </Button>
          <Button @click.native="showRefuse">
            不通过
          </Button>
        </div>

        <div v-if="accept" class="accept">
          该项目已通过最终审核！
        </div>
        <div v-if="refuse" class="refuse">
          <p data-v-2526d47e="" style="font-size: 15px; font-weight: bold; color: rgb(70, 76, 91);">
            驳回理由如下：
          </p>
          <Input type="textarea" v-model="refuseComment" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="填写驳回理由" style="margin-top:20px"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click.native="finish(projectIndex)"
                style="margin-top: 20px;margin-left: 20px;width:100px">
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
      申报人类型：<p style="display: inline-flex;" v-for="item in data2.applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in data2.expertList">{{item.userName}}&nbsp;</p>
      <br>
      <br>
      <p>是否可提交中期报告：{{(data2.interimReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data2.interimReport.isReportActivated"
        @click="downloadProjectMaterial(data2.interimReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p>中期报告开始时间：{{(data2.interimReport.startTime === null) ? '无' : data2.interimReport.startTime}}</p>
      <br>
      <p>中期报告截止时间：{{(data2.interimReport.deadline === null) ? '无' : data2.interimReport.deadline}}</p>
      <br>
      <p>是否可提交结题报告：{{(data2.concludingReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data2.concludingReport.isReportActivated"
        @click="downloadProjectMaterial(data2.concludingReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p>结题报告开始时间：{{(data2.concludingReport.startTime === null) ? '无' : data2.concludingReport.startTime}}</p>
      <br>
      <p>结题报告截止时间：{{(data2.concludingReport.deadline === null) ? '无' : data2.concludingReport.deadline}}</p>
      <br>
      <p>项目成员(默认第一个为项目负责人)：</p>
      <br>
      <Table :columns="columns2" :data="data3.members" size="small" stripe></Table>
      <br>
      <p>项目申请书：<a @click="downloadProjectMaterial(data3.applicationAddress)">点击下载</a></p>
      <br>
      <p v-if="data3.interimAddress!==null">项目中期报告：<a @click="downloadProjectMaterial(data3.interimAddress)">点击下载</a>
      </p>
      <br v-if="data3.concludingAddress!==null">
      <p v-if="data3.concludingAddress!==null">项目结题报告：<a
        @click="downloadProjectMaterial(data3.concludingAddress)">点击下载</a></p>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: 'reqProject',
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
        model1: false,
        modal2: false,
        modal2_delay: false,
        accept: false,
        refuse: false,
        judge: false,
        projectIndex: 0,
        index: 0,
        infoTitle: null,
        refuseComment: '',
        columns: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
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
            align: 'center'
          },
          {
            title: '项目申请书',
            key: 'ProjectFinalApply',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.download(params.index)
                    }
                  }
                }, '项目申请书')
              ]);
            }
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'info'},
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.details(params.index);
                    }
                  },
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.declare()
                      this.projectIndex = params.index
                    }
                  }
                }, '审核')
              ])
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
        data3: []
      };
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      Refresh() {
        this.initData('刷新成功！');
      },
      initData(str) {
        this.loading = true
        axios({
          url: apiRoot + '/leader/unjudgeApplicatetion',
          mothod: 'get'
        }).then((res) => {
          console.log(res.data)
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data
            this.loading = false
            this.$Message.success(str)
          } else {
            this.$Message.error(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error("初始化失败，请检查网络连接！")
          this.loading = false
        })
      },
      declare() {
        this.$Message.success('填写会评意见!');
        this.model1 = true;
      },
      download(index) {
        this.$Message.info('点击下载终审项目申请书')
        const that = this
        var filename = this.data1[index].uploadAddress.split('---')[1]  //---后为文件名
        axios({
          url: apiRoot + '/file/download?fileAddress=' + this.data1[index].uploadAddress,
          method: 'get',
          headers: {Authorization: localStorage.getItem('token')},
          responseType: 'blob'
        }).then((res) => {
          if (res.status === 200) {
            download(res.data, filename, "text/plain")
            this.$Message.success("下载成功！")
          } else {
            this.$Message.error("下载失败！")
          }
        }).catch(() => {
          this.$Message.error("下载失败，请检查网络连接！")
        })
      },
      finish(index) {
        console.log(index)
        if (this.accept === true && this.refuse === false) {
          this.judge = true;
        } else if (this.accept === false && this.refuse === true) {
          this.judge = false;
        }
        axios({
          url: apiRoot + '/leader/JudgeApplication',
          method: 'post',
          data: {
            projectApplicationId: this.data1[index].projectId,
            judge: this.judge,
            msg: this.refuseComment
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success("审核成功！");
            this.model1 = false;
            this.cancel();
            this.data1.splice(index, 1);
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch(() => {
          this.$Message.error('审核失败，请检查网络连接！');
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
        await Promise.all([a, b]);
        this.modal2 = true
      },
      downloadProjectMaterial(address) {
        console.log(address,'!')
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
      cancel() {
        this.accept = false
        this.refuse = false
      },
      showAccept() {
        this.accept = !this.accept
        this.refuse = false
      },
      showRefuse() {
        this.refuse = !this.refuse
        this.accept = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "reqProject";
</style>

