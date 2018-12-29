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
          @on-ok="uploadMiddleReport"
        >
          <Upload
            type="drag"
            :headers="uploadHeaders"
            :on-success="uploadSuccess"
            :on-error="uploadError"
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

  export default {
    name: "myProject",
    data() {
      return {
        loading: false,
        modal1: false,
        data2index: 0,
        data3index: 0,
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
            width: 250,
          },
          {
            title: '立项日期',
            key: 'time',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            width: 100,
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
            width: 250,
          },
          {
            title: '提交截止日期',
            key: 'time',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            width: 100,
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
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.data2index = params.index;
                    }
                  }
                }, '上传中期报告')
              ])
            }
          }
        ],
        columns3: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            width: 250,
          },
          {
            title: '提交截止日期',
            key: 'time',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            width: 100,
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
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  on: {
                    click: () => {
                      this.$Message.info('点击上传结题报告')
                    }
                  }
                }, '上传结题报告')
              ])
            }
          }
        ],
        columns4: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            width: 250,
          },
          {
            title: '结项时间',
            key: 'time',
            align: 'center',
            width: 200,
          },
          {
            title: '项目简介',
            key: 'description',
            align: 'center'
          },
          {
            title: '项目状态',
            key: 'reviewPhase',
            width: 100,
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
      this.initData()
    },
    methods: {
      Refresh() {
        this.initData();
        this.$Message.success('刷新成功!')
      },
      initData() {
        this.loading = true
        axios({
          url: apiRoot + '/user/progressProject',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.data1 = res.data.data.buildProject;
            this.data2 = res.data.data.middleProject;
            this.data3 = res.data.data.finalProject;
            this.data4 = res.data.data.finishProject
            this.loading = false;
          } else {
            this.$Message.error(res.data.message);
            this.loading = false;
          }
        }).catch(() => {
          this.$Message.error("初始化失败,请检查网络！");
          this.loading = false
        })
      },
      uploadSuccess(response) {
        this.middleReportAddress = response.data
      },
      uploadError() {
        this.$Message.error("上传失败！");
      },
      uploadMiddleReport() {
        axios({
          url: apiRoot + '/user/commitReport',
          method: 'post',
          data: {
            applicationId: this.data2[this.data2index].projectApplicationId,
            uploadAddress: this.middleReportAddress,
            type: 1
          }
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            this.$Message.success("上传成功！");
            this.data2.splice(this.data2index, 1);
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch(() => {
          this.$Message.error("请检查网络连接！");
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "myProject";
</style>
