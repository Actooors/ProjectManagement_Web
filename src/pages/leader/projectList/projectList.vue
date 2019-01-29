<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Tabs class="tabs">
      <TabPane label="已驳回" name="5" icon="md-close-circle">
      <Table sriple border :columns="columns5" :data="data_failProject"
             table="table" :loading="loading" size="large"></Table>
    </TabPane>
      <TabPane label="已立项" name="1" icon="md-book">
        <Table sriple border :columns="columns1" :data="data_buildProject"
               table="table" :loading="loading" size="large"></Table>
      </TabPane>
      <TabPane label="待提交中期报告" name="2" icon="md-calendar">
        <Table sriple border :columns="columns2" :data="data_middleProject"
               table="table" :loading="loading" size="large"></Table>
      </TabPane>
      <TabPane label="待提交结题报告" name="3" icon="md-document">
        <Table sriple border :columns="columns3" :data="data_finalProject"
               table="table" :loading="loading" size="large"></Table>
      </TabPane>
      <TabPane label="已结项" name="4" icon="md-checkbox">
        <Table sriple border :columns="columns4" :data="data_finishProject"
               table="table" :loading="loading" size="large"></Table>
        <Modal
          v-model="model_exam"
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
      </TabPane>
    </Tabs>
    <Modal v-if="modal_delay" v-model="modal_detail" :title="infoTitle" width="900px">
      <p>项目描述：{{data4.projectDescription}}</p>
      <br>
      <p>业务员手机：{{data4.principalPhone}}</p>
      <br>
      <p>项目大类：{{data4.projectType}}</p>
      <br>
      <p>经费额度：{{data4.maxMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in data4.applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in data5.expertList">{{item.userName}}&nbsp;</p>
      <br>
      <p>经费额度：{{data4.maxMoney}}元</p>
      <br>
      <br>
      <p>是否可提交中期报告：{{(data4.interimReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data4.interimReport.isReportActivated"
        @click="downloadProjectMaterial(data4.interimReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p v-if="data4.interimReport.isReportActivated">中期报告开始时间：{{data4.interimReport.startTime}}</p>
      <br v-if="data4.interimReport.isReportActivated">
      <p v-if="data4.interimReport.isReportActivated">中期报告截止时间：{{data4.interimReport.deadline}}</p>
      <br v-if="data4.interimReport.isReportActivated">
      <p>是否可提交结题报告：{{(data4.concludingReport.isReportActivated === true) ? '是 ' : '否'}}<a
        v-if="data4.concludingReport.isReportActivated"
        @click="downloadProjectMaterial(data4.concludingReport.reportTemplateAddress)">点击下载模板</a></p>
      <br>
      <p v-if="data4.concludingReport.isReportActivated">结题报告开始时间：{{data4.concludingReport.startTime}}</p>
      <br v-if="data4.concludingReport.isReportActivated">
      <p v-if="data4.concludingReport.isReportActivated">结题报告截止时间：{{data4.concludingReport.deadline}}</p>
      <br v-if="data4.concludingReport.isReportActivated">
      <p>项目成员(默认第一个为项目负责人)：</p>
      <br>
      <Table :columns="columns_members" :data="data5.members" size="small" stripe></Table>
      <br>
      <p>项目申请书：<a @click="downloadProjectMaterial(data5.applicationAddress)">点击下载</a></p>
      <br>
      <p v-if="data5.interimAddress===null">项目中期报告：未提交</p>
      <p v-if="data5.interimAddress!==null">项目中期报告：<a @click="downloadProjectMaterial(data5.interimAddress)">点击下载</a>
      </p>
      <br>
      <p v-if="data5.concludingAddress===null">项目结题报告：未提交</p>
      <p v-if="data5.concludingAddress!==null">项目结题报告：<a
        @click="downloadProjectMaterial(data5.concludingAddress)">点击下载</a></p>
    </Modal>
    <Modal
      maxHeight="1700"
      ref="modal"
      title="查看专家评审结果"
      v-model="modal3"
      width="800">
      <Table :columns="columns3" :data="data_expert" :loading="spinShow" border></Table>
      <div slot="footer">
        <Button @click="modal3=false" type="primary">
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
    name: 'projectList',
    watch: {
      modal_detail (val) {
        if (val) {
          this.modal_delay = true
        }
      }
    },
    data() {
      return {
        loading: false,
        modal_detail: false,
        modal_failPro: false,
        modal_delay: false,
        model_exam: false,
        modal3: false,
        spinShow: false,
        index: 0,
        flag: 1,
        url_a: 0,
        url_b: 0,
        url_tail: 0,
        projectIndex: 0,
        accept: false,
        refuse: false,
        judge: false,
        refuseComment: '',
        maxMoney: 1000,
        infoTitle: null,
        formItem: {
          textarea: '在此填写会评意见',
        },
        columns1: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'projectCategory',
            align: 'center'
          },
          {
            title: '立项日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目负责业务员',
            key: 'adminName',
            align: 'center'
          },
          {
            title: '其他专家评审结果',
            key: 'chooseExpert',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'info',
                    },
                    on: {
                      click: () => {
                        this.initComment(1,params.index)
                        this.modal3 = true
                      }
                    },
                  },
                  '点击查看'
                )])
            }
          },
          {
            title: '项目详情',
            key: 'ProjectDetail',
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
                      this.details(1,params.index)
                    }
                  }
                }, '查看项目详情')
              ]);
            }
          }
        ],
        columns2: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'projectCategory',
            align: 'center'
          },
          {
            title: '提交截止日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目负责业务员',
            key: 'adminName',
            align: 'center'
          },
          {
            title: '其他专家评审结果',
            key: 'chooseExpert',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'info',
                    },
                    on: {
                      click: () => {
                        this.initComment(2,params.index)
                        this.modal3 = true
                      }
                    },
                  },
                  '点击查看'
                )])
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'operation',
            flag: 2,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'info'},
                  on: {
                    click: () => {
                      this.details(2,params.index);
                    }
                  },
                }, '详情')
              ]);
            }
          }
        ],
        columns3: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'projectCategory',
            align: 'center'
          },
          {
            title: '提交截止日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目负责业务员',
            key: 'adminName',
            align: 'center'
          },
          {
            title: '其他专家评审结果',
            key: 'chooseExpert',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'info',
                    },
                    on: {
                      click: () => {
                        this.initComment(3,params.index)
                        this.modal3 = true
                      }
                    },
                  },
                  '点击查看'
                )])
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'operation',
            flag: 3,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'info'},
                  on: {
                    click: () => {
                      this.details(3,params.index);
                    }
                  },
                }, '详情')
              ]);
            }
          }
        ],
        columns4: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'projectCategory',
            align: 'center'
          },
          {
            title: '结项日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目负责业务员',
            key: 'adminName',
            align: 'center'
          },
          {
            title: '其他专家评审结果',
            key: 'chooseExpert',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'info',
                    },
                    on: {
                      click: () => {
                        this.initComment(4,params.index)
                        this.modal3 = true
                      }
                    },
                  },
                  '点击查看'
                )])
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'operation',
            flag: 4,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'info'},
                  on: {
                    click: () => {
                      this.details(4,params.index);
                    }
                  },
                }, '详情')
              ]);
            }
          },
          {
            title: '审核',
            key: 'inputComment',
            align: 'center',
            render: (h,params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.examine(params.index)
                    }
                  }
                })
              ])
            }
          },
        ],
        columns5: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '项目类别',
            key: 'projectCategory',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
            align: 'center',
            tooltip: true
          },
          {
            title: '驳回详情',
            key: 'failMessage',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'info'},
                  on: {
                    click: () => {
                      this.details(5,params.index);
                    }
                  },
                }, '详情'),
              ]);
            }
          }
        ],
        columns_members: [
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
        data_buildProject: [],
        data_middleProject: [],
        data_finalProject: [],
        data_finishProject: [],
        data_failProject: [],
        data_expert: []
      };
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
          url: apiRoot + '/leader/MyProject',
          method: 'get'
        }).then((res) => {
          console.log(res.data)
          if (res.data.code === 'SUCCESS') {
            this.data_buildProject = res.data.data.buildProject;
            this.data_middleProject = res.data.data.middleProject;
            this.data_finalProject = res.data.data.finalProject;
            this.data_finishProject = res.data.data.finishProject;
            this.data_failProject = res.data.data.failProject
            this.loading = false
            this.$Message.success(msg)
          } else {
            this.$Message.error(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error("初始化失败，请检查网络连接！")
          this.loading = false
        })
      },
      async details(flag,index) {
        if (flag === 1) {
          this.url_a = this.data_buildProject[index].projectCategoryId
          this.url_b = this.data_buildProject[index].projectApplicationId
        }
        else if (flag === 2) {
          this.url_a = this.data_middleProject[index].projectCategoryId
          this.url_b = this.data_middleProject[index].projectApplicationId
        }
        else if (flag === 3) {
          this.url_a = this.data_finalProject[index].projectCategoryId
          this.url_b = this.data_finalProject[index].projectApplicationId
        }
        else if (flag === 4) {
          this.url_a = this.data_finishProject[index].projectCategoryId
          this.url_b = this.data_finishProject[index].projectApplicationId
        }
        else if (flag === 5) {
          this.url_a = this.data_failProject[index].projectCategoryId
          this.url_b = this.data_failProject[index].projectApplicationId
        }
        const a = axios({
          url: apiRoot + '/admin/category/' + this.url_a,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data4 = res.data.data
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + this.url_b,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data5 = res.data.data
          }
        })
        await Promise.all([a, b]);
        this.modal_detail = true
      },
      examine(index) {
        model_exam = true
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
      finish(index) {
        if (this.accept === true && this.refuse === false) {
          this.judge = true;
        } else if (this.accept === false && this.refuse === true) {
          this.judge = false;
        }
        axios({
          url: apiRoot + '/leader/JudgeReport',
          method: 'post',
          data: {
            projectApplicationId: this.data_finishProject[index].projectApplicationId,
            judge: this.judge,
            msg: this.refuseComment
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success("项目终审完成！");
            this.model_exam = false;
            this.cancel();
            this.data_finishProject.splice(index, 1);
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch(() => {
          this.$Message.error('审核失败，请检查网络连接！');
        })
        this.model_exam = false
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
      },
      initComment(flag,index) {
        this.spinShow = true;
        if (flag === 1) {
          this.url_tail = this.data_buildProject[index].projectApplicationId
        }
        else if (flag === 2) {
          this.url_tail = this.data_middleProject[index].projectApplicationId
        }
        else if (flag === 3) {
          this.url_tail = this.data_finalProject[index].projectApplicationId
        }
        else if (flag === 4) {
          this.url_tail = this.data_finishProject[index].projectApplicationId
        }
        axios({
          url: apiRoot + '/admin/project/' + this.url_tail,
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
            this.data_expert = res.data.data.expertOpinionInfoList;
            this.data_expert.push({
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
  @import "projectList";
</style>
