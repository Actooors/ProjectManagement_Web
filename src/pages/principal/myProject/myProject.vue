<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" size="large" @click="Refresh" icon="md-refresh" ghost>刷新</Button>
      </ButtonGroup>
    </div>
    <Tabs class="tabs">
      <TabPane label="已立项" name="1" icon="md-apps">
        <Table table="table" :columns="column1" :data="data1" :loading="loading" sriple border size="large"></Table>
      </TabPane>
      <TabPane label="待提交中期报告" name="2" icon="md-albums">
        <Table table="table" :columns="column2" :data="data2" :loading="loading" sriple border size="large"></Table>
      </TabPane>
      <TabPane label="待提交结题报告" name="3" icon="md-analytics">
        <Table table="table" :columns="column3" :data="data3" :loading="loading" sriple border size="large"></Table>
      </TabPane>
      <TabPane label="已结项" name="4" icon="md-barcode">
        <Table table="table" :columns="column4" :data="data6" :loading="loading" sriple border size="large"></Table>
      </TabPane>
      <TabPane label="已驳回" name="5" icon="md-bookmarks">
        <Table table="table" :columns="column5" :data="data7" :loading="loading" sriple border size="large"></Table>
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
      <p>申请经费：{{data5.projectMoney}}元</p>
      <br>
      申报人类型：<p style="display: inline-flex;" v-for="item in data4.applicantType">{{item}}&nbsp;</p>
      <br>
      <br>
      专家名单：<p style="display: inline-flex;" v-for="item in data5.expertList">{{item.userName}}&nbsp;</p>
      <br>
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
  </div>
</template>

<script>
  import axios from 'axios'

    export default {
        name: "myProject",
        watch: {
          modal_detail (val) {
            if (val)
              this.modal_delay = true
          }
        },
        data() {
          return {
            loading:false,
            url_a: 0,
            url_b: 0,
            index: 0,
            flag: 1,
            modal_delay: false,
            modal_detail: false,
            infoTitle: null,
            modal_failPro: false,
            maxMoney: 1000,
            column1: [
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
                align: 'center'
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
                          this.details(1,params.index);
                        }
                      },
                    }, '详情')
                  ])
                }
              }
            ],
            column2: [
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
                title: '项目简介',
                key: 'description',
                align: 'center'
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
                          this.details(2,params.index);
                        }
                      },
                    }, '详情')
                  ])
                }
              }
            ],
            column3: [
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
                title: '项目简介',
                key: 'description',
                align: 'center'
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
                          this.details(3,params.index);
                        }
                      },
                    }, '详情')
                  ])
                }
              }
            ],
            column4: [
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
                title: '项目简介',
                key: 'description',
                align: 'center'
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
                          this.details(4,params.index);
                        }
                      },
                    }, '详情')
                  ])
                }
              }
            ],
            column5: [
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
                title: '项目简介',
                key: 'description',
                align: 'center'
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
                          this.details(5,params.index);
                        }
                      },
                    }, '详情')
                  ])
                }
              },
              {
                title: '驳回详情',
                key: 'failMessage',
                align: 'center'
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
            data1: [],
            data2: [],
            data3: [],
            data4: [],
            data5: [],
            data6: [],
            data7: []
          }
        },
        mounted() {
          this.initData('初始化数据成功！')
        },
        methods: {
          Refresh() {
            this.initData('刷新成功！')
          },
          initData(msg) {
            this.loading = true
            axios({
              url: apiRoot + '/admin/MyProject',
              method: 'get'
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.data1 = res.data.data.buildProject
                this.data2 = res.data.data.middleProject
                this.data3 = res.data.data.finalProject
                this.data6 = res.data.data.finishProject
                this.data7 = res.data.data.failProject
                this.loading = false
                this.$Message.success('初始化数据成功！')
              } else {
                this.loading = false
                this.$Message.success('初始化数据失败！')
              }
            }).catch(() => {
              this.$Message.error('初始化数据错误!')
              this.loading = false
            })
          },
          async details(flag,index) {
            if (flag === 1) {
              this.url_a = this.data1[index].projectCategoryId
              this.url_b = this.data1[index].projectApplicationId
            }
            else if (flag === 2) {
              this.url_a = this.data2[index].projectCategoryId
              this.url_b = this.data2[index].projectApplicationId
            }
            else if (flag === 3) {
              this.url_a = this.data3[index].projectCategoryId
              this.url_b = this.data3[index].projectApplicationId
            }
            else if (flag === 4) {
              this.url_a = this.data6[index].projectCategoryId
              this.url_b = this.data6[index].projectApplicationId
            }
            else if (flag === 5) {
              this.url_a = this.data7[index].projectCategoryId
              this.url_b = this.data7[index].projectApplicationId
            }
            console.log(this.url_a)
            const a = axios({
              url: apiRoot + '/admin/category/' + this.url_a,
              method: 'get'
            }).then((res) => {
              if (res.data.code === 'SUCCESS') {
                this.infoTitle = res.data.data.projectName
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
  @import "myProject";
</style>
