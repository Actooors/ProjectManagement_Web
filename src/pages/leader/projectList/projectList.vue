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
      <TabPane label="已立项的项目" name="1" icon="md-book">
        <Table sriple border :columns="columns1" :data="data_buildProject"
               table="table" :loading="loading" size="large"></Table>
        <Modal v-if="modal_delay" v-model="modal_detail" title="已立项的项目" width="900px">
          <p>项目描述：{{data1.projectDescription}}</p>
          <br>
          <p>业务员姓名：{{data1.principalName}}</p>
          <br>
          <p>业务员手机：{{data1.principalPhone}}</p>
          <br>
          <p>业务员邮箱：{{data1.principalEmail}}</p>
          <br>
          <p>项目大类：{{data1.projectType}}</p>
          <br>
          <p>经费额度：{{data1.maxMoney}}元</p>
          <br>
          <p>选择调整经费额度:</p>
          <InputNumber v-model="value"></InputNumber>
          <Button type="primary" @click.native="changeMoney">修改</Button>
          <br>
          申报人类型：<p style="display: inline-flex;" v-for="item in data1.applicantType">{{item}}&nbsp;</p>
          <br>
          <br>
          专家名单：<p style="display: inline-flex;" v-for="item in data2.expertList">{{item.userName}}&nbsp;</p>
          <br>
          <p>项目成员(默认第一个为项目负责人)：</p>
          <br>
          <Table :columns="columns_members" :data="data2.members" size="small" stripe></Table>
          <br>
          <p>项目申请书：<a @click="downloadProjectMaterial(data2.applicationAddress)">点击下载</a></p>
          <br>
        </Modal>
      </TabPane>
      <TabPane label="待提交中期报告" name="2" icon="md-calendar">
        <Table sriple border :columns="columns2" :data="data_middleProject"
               table="table" :loading="loading" size="large"></Table>
        <Modal v-if="modal_delay" v-model="modal_detail" title="待提交中期报告" width="900px">
          <p>项目描述：{{data1.projectDescription}}</p>
          <br>
          <p>业务员姓名：{{data1.principalName}}</p>
          <br>
          <p>业务员手机：{{data1.principalPhone}}</p>
          <br>
          <p>业务员邮箱：{{data1.principalEmail}}</p>
          <br>
          <p>项目大类：{{data1.projectType}}</p>
          <br>
          <p>经费额度：{{data1.maxMoney}}元</p>
          <br>
          <p>选择调整经费额度:</p>
          <InputNumber v-model="value"></InputNumber>
          <Button type="primary" @click.native="changeMoney">修改</Button>
          <br>
          申报人类型：<p style="display: inline-flex;" v-for="item in data1.applicantType">{{item}}&nbsp;</p>
          <br>
          <br>
          专家名单：<p style="display: inline-flex;" v-for="item in data2.expertList">{{item.userName}}&nbsp;</p>
          <br>
          <p>项目成员(默认第一个为项目负责人)：</p>
          <br>
          <Table :columns="columns_members" :data="data2.members" size="small" stripe></Table>
          <br>
          <p>项目申请书：<a @click="downloadProjectMaterial(data2.applicationAddress)">点击下载</a></p>
          <br>
        </Modal>
      </TabPane>
      <TabPane label="待提交结题报告" name="3" icon="md-document">
        <Table sriple border :columns="columns3" :data="data_finalProject"
               table="table" :loading="loading" size="large"></Table>
        <Modal v-if="modal_delay" v-model="modal_detail" title="待提交结题报告" width="900px">
          <p>项目描述：{{data1.projectDescription}}</p>
          <br>
          <p>业务员姓名：{{data1.principalName}}</p>
          <br>
          <p>业务员手机：{{data1.principalPhone}}</p>
          <br>
          <p>业务员邮箱：{{data1.principalEmail}}</p>
          <br>
          <p>项目大类：{{data1.projectType}}</p>
          <br>
          <p>经费额度：{{data1.maxMoney}}元</p>
          <br>
          <p>选择调整经费额度:</p>
          <InputNumber v-model="value"></InputNumber>
          <Button type="primary" @click.native="changeMoney">修改</Button>
          <br>
          申报人类型：<p style="display: inline-flex;" v-for="item in data1.applicantType">{{item}}&nbsp;</p>
          <br>
          <br>
          专家名单：<p style="display: inline-flex;" v-for="item in data2.expertList">{{item.userName}}&nbsp;</p>
          <br>
          <p>项目成员(默认第一个为项目负责人)：</p>
          <br>
          <Table :columns="columns_members" :data="data2.members" size="small" stripe></Table>
          <br>
          <p>项目申请书：<a @click="downloadProjectMaterial(data2.applicationAddress)">点击下载</a></p>
          <br>
          <p>项目中期报告：<a @click="downloadProjectMaterial(data2.interimAddress)">点击下载</a></p>
        </Modal>
      </TabPane>
      <TabPane label="已结项的项目" name="4" icon="md-checkbox">
        <Table sriple border :columns="columns4" :data="data_finishProject"
               table="table" :loading="loading" size="large"></Table>
        <Modal v-if="modal_delay" v-model="modal_detail" title="已结项的项目" width="900px">
          <p>项目描述：{{data1.projectDescription}}</p>
          <br>
          <p>业务员手机：{{data1.principalPhone}}</p>
          <br>
          <p>业务员邮箱：{{data1_principalEmail}}</p>
          <br>
          <p>项目大类：{{data1.projectType}}</p>
          <br>
          <p>经费额度：{{data1.maxMoney}}元</p>
          <br>
          申报人类型：<p style="display: inline-flex;" v-for="item in data1.applicantType">{{item}}&nbsp;</p>
          <br>
          <br>
          专家名单：<p style="display: inline-flex;" v-for="item in data2.expertList">{{item.userName}}&nbsp;</p>
          <br>
          <p>项目成员(默认第一个为项目负责人)：</p>
          <br>
          <Table :columns="columns_members" :data="data2.members" size="small" stripe></Table>
          <br>
          <p>项目申请书：<a @click="downloadProjectMaterial(data2.applicationAddress)">点击下载</a></p>
          <br>
          <p>项目中期报告：<a @click="downloadProjectMaterial(data2.interimAddress)">点击下载</a></p>
          <br>
          <p>项目结题报告：<a @click="downloadProjectMaterial(data2.concludingAddress)">点击下载</a></p>
        </Modal>
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
      <TabPane label="已驳回项目" name="5" icon="ios-close-circle">
        <Table sriple border :columns="columns5" :data="data_failProject"
               table="table" :loading="loading" size="large"></Table>
        <Modal
          v-model="modal_failPro"
          title="驳回理由"
          width="750px"
        >
          <p>驳回理由如下:</p>
          <br>
          <p v-model="failReason">{{failReason}}</p>
        </Modal>
      </TabPane>
    </Tabs>
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
      modal2(val) {
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
        failReason: '',
        index: 0,
        projectIndex: 0,
        accept: false,
        refuse: false,
        judge: false,
        refuseComment: '',
        value: 1,
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
            key: 'projectType',
            align: 'center'
          },
          {
            title: '申请截止日期',
            key: 'applicationDeadLine',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'description',
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
            flag: 1,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.details(flag,params.index)
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
                      this.details(flag,params.index);
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
                      this.details(flag,params.index);
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
                      this.details(flag,params.index);
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
            key: 'projectCategoryName',
            align: 'center'
          },
          {
            title: '项目描述',
            key: 'description',
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
          },
          {
            title: '驳回理由',
            key: 'failProject',
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
                      this.failDetails(params.index)
                    }
                  }
                }, '查看驳回理由')
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
          url: apiRoot + '/leader/unjudgeApplicatetion/2',
          mothod: 'get'
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
      failDetails(index) {
        this.$Message.info('点击查看驳回理由!')
        axios({
          url: apiRoot + '/admin/project/' + this.data_failProject[index].projectId,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.failReason = res.data.data.failReason;
          } else {
            this.$Message.error(res.data.message)
          }
          this.modal_failPro = false
        }).catch(() => {
          this.$Message.error("查看驳回理由结果失败，请检查网络连接！")
          this.modal_failPro = false
        })
        this.modal_failPro = true
      },
      async details(flag,index) {
        if (flag === 1) {
          url_a = this.data_buildProject[index].projectCategoryId
          url_b = this.data_buildProject[index].projectId
        }
        else if (flag === 2) {
          url_a = this.data_middleProject[index].projectCategoryId
          url_b = this.data_middleProject[index].projectId
        }
        else if (flag === 3) {
          url_a = this.data_finalProject[index].projectCategoryId
          url_b = this.data_finalProject[index].projectId
        }
        else if (flag === 4) {
          url_a = this.data_finishProject[index].projectCategoryId
          url_b = this.data_finishProject[index].projectId
        }
        else if (flag === 5) {
          url_a = this.data_failProject[index].projectCategoryId
          url_b = this.data_failProject[index].projectId
        }
        const a = axios({
          url: apiRoot + '/admin/category/' + url_a,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data
          }
        })
        const b = axios({
          url: apiRoot + '/user/projectMoreInfo?applicationId=' + url_b,
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data2 = res.data.data
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
            projectApplicationId: this.data_finishProject[index].projectId,
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
      changeMoney() {
        this.data1.maxMoney = value
        console.log('修改项目经费额度成功!')
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
        this.spinShow = true
        if (flag === 1) {
          url_tail = this.data_buildProject[index].projectId
        }
        else if (flag === 2) {
          url_tail = this.data_middleProject[index].projectId
        }
        else if (flag === 3) {
          url_tail = this.data_finalProject[index].projectId
        }
        else if (flag === 4) {
          url_tail = this.data_finishProject[index].projectId
        }
        axios({
          url: apiRoot + '/admin/project/' + url_tail,
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
