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
        index: 0,
        middleReportAddress: '',
        lastReportAddress: '',
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
            key: 'isOverTime',
            align: 'center'
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
            key: 'isOverTime',
            align: 'center'
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
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击查看详情')
                    }
                  }
                }, '详情')
              ])
            }
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
      Refresh() {
        this.initData('刷新成功!');
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
              if (res.data.data.middleProject[i].isOverTime === true) {
                res.data.data.middleProject[i].isOverTime = '已超过提交时间';
              } else {
                res.data.data.middleProject[i].isOverTime = '可提交';
              }
            }
            for (let i = 0; i < res.data.data.finalProject.length; i++) {
              if (res.data.data.finalProject[i].isOverTime === true) {
                res.data.data.finalProject[i].isOverTime = '已超过提交时间';
              } else {
                res.data.data.finalProject[i].isOverTime = '可提交';
              }
            }
            this.data1 = res.data.data.buildProject;
            this.data2 = res.data.data.middleProject;
            this.data3 = res.data.data.finalProject;
            this.data4 = res.data.data.finishProject
            this.$Message.success(msg)
            this.loading = false;
          } else {
            this.$Message.error(res.data.message);
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
        } else {
          var appId = this.data3[index].projectApplicationId;
          var address = this.lastReportAddress
        }
        axios({
          url: apiRoot + '/user/commitReport',
          method: 'post',
          data: {
            applicationId: appId,
            uploadAddress: address,
            type: type
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
            this.$Message.error(res.data.message);
          }
        }).catch(() => {
          this.$Message.error("请检查网络连接！");
        });
      },
      download(index, type) {
        const that = this
        if (type === 1) {
          var filename = this.data2[index].reportAddress.split('---')[1];
          var address = that.data2[index].reportAddress
        } else {
          var filename = this.data3[index].reportAddress.split('---')[1];
          var address = that.data3[index].reportAddress
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "myProject";
</style>
