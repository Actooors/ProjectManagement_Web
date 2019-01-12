<template>
  <div class="wrapper">
    <ButtonGroup class="operation">
      <Button type="success" icon="md-refresh" @click="Refresh" size="large" ghost>
        刷新
      </Button>
    </ButtonGroup>
    <Table stripe border :columns="columns" :loading="loading" :data="data1" class="table" size="large"
           height="750"></Table>
    <Modal v-model="modal1" :title="infoTitle" :props="index" width="600px">
      <p>项目描述：{{this.data1[index].projectDescription}}</p>
      <br>
      <p>业务员手机：{{this.data1[index].principalPhone}}</p>
      <br>
      <p>项目大类：{{this.data1[index].projectType}}</p>
      <br>
      <p>经费额度：{{this.data1[index].maxMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in this.data1[index].applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in this.data1[index].expertList">{{item.userName}}&nbsp;</p>
      <br>
      <br>
      <p>是否提交中期报告：{{(this.data1[index].interimReport.isReportActivated===true)?'是':'否'}}</p>
      <br>
      <p>中期报告开始时间：{{this.data1[index].interimReport.startTime}}</p>
      <br>
      <p>中期报告截止时间：{{this.data1[index].interimReport.deadline}}</p>
      <br>
      <p>是否提交结题报告：{{(this.data1[index].concludingReport.isReportActivated===true)?'是':'否'}}</p>
      <br>
      <p>结题报告开始时间：{{this.data1[index].concludingReport.startTime}}</p>
      <br>
      <p>结题报告截止时间：{{this.data1[index].concludingReport.deadline}}</p>
      <br>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "categoryList",
    data() {
      return {
        loading: false,
        modal1: false,
        infoTitle: null,
        index: 0,
        data1: [],
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '项目简介',
            key: 'projectDescription',
            align: 'center'
          },
          {
            title: '项目类别',
            key: 'projectType',
            align: 'center'
          },
          {
            title: '申报开始时间',
            key: 'applicationStartTime',
            align: 'center'
          },
          {
            title: '申报截止时间',
            key: 'applicationEndTime',
            align: 'center'
          },
          {
            title: '项目开始时间',
            key: 'projectStartTime',
            align: 'center'
          },
          {
            title: '项目截止时间',
            key: 'projectEndTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            width: 300,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Message.info("点击修改")
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.infoTitle = this.data1[params.index].projectName + ' 详情'
                      this.index = params.index
                      this.modal1 = true
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '请再次确认',
                        content: '确认删除 ' + this.data1[params.index].projectName + ' 吗?',
                        okText: '确定',
                        cancelText: '点错了',
                        onOk: () => {
                          axios({
                            url: apiRoot + '/admin/deleteProjectCategory',
                            method: 'post',
                            data: {
                              projectCategoryId: this.data1[params.index].projectCategoryId
                            }
                          }).then((res) => {
                            if (res.data.code === 'SUCCESS') {
                              this.data1.splice(params.index, 1);
                              this.$Message.success("删除成功！")
                            } else {
                              this.$Message.error(res.data.message)
                            }
                          })
                        }
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.initData('初始化成功！')
    },
    methods: {
      Refresh() {
        this.initData("刷新成功！")
      },
      initData(msg) {
        this.loading = true
        axios({
          url: apiRoot + '/admin/findMyProjectCategory',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data
            this.$Message.success(msg)
            this.loading = false
          } else {
            this.$Message.error(res.data.message)
            this.loading = false
          }
        }).catch((err) => {
          console.error(err)
          this.$Message.error("请检查网络连接！")
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "categoryList";
</style>
