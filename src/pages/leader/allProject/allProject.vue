<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" :loading="loading" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :columns="columns1" :data="data1" :loading="loading" size="large" class="table" height="550"></Table>
    <Drawer :closable="false" width="640" v-model="drawer" :title="projectCategoryName" @on-close="onDrawerClose">
      <div v-for="item in items" v-if="items.length!==0">
        <Divider orientation="left">{{item.projectName}}</Divider>
        <Row>
          <Tag color="success">申请日期</Tag>&nbsp;{{item.applicationTime}}
        </Row>
        <Row>
          <Tag color="warning">所处阶段</Tag>&nbsp;{{item.reviewPhase}}
        </Row>
        <Row>
          <Col v-show="item.failureReason!==null">
            <Tag color="error">失败原因</Tag>&nbsp;{{item.failureReason}}
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Tag color="blue">项目负责人</Tag>&nbsp;{{item.userName}}
          </Col>
          <Col span="12" v-show="item.failureReason==null">
            <Tag color="gold">项目经费</Tag>&nbsp;{{item.projectMoney}}元
          </Col>
        </Row>
        <Row>
          <Col span="12" v-show="item.projectApplicationUploadAddress!==null">
            <Tag color="geekblue">项目申请书</Tag>&nbsp;
            <a @click="download(item.projectApplicationUploadAddress)">点击下载</a>
          </Col>
          <Col span="12">
            <Tag color="green">项目指标</Tag>&nbsp;
            <a @click="download(item.projectIndex)">点击下载</a>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Tag color="purple">是否上会</Tag>&nbsp;{{item.isMeeting}}
          </Col>
          <Col span="12" v-show="item.meetingReviewMessage!==null">
            <Tag color="magenta">会评意见</Tag>&nbsp;{{item.meetingReviewMessage}}
          </Col>
        </Row>
        <Tag color="cyan">项目简介</Tag>&nbsp;{{item.projectDescription}}
      </div>
      <div v-if="items.length===0">
        该类别暂无项目
      </div>
    </Drawer>
  </div>
</template>

<script>
  import axios from 'axios'
  import download from '../../../assets/js/download'

  export default {
    name: "allProject",
    data() {
      return {
        loading: false,
        drawer: false,
        data1: [],
        items: [],
        projectCategoryName: null,
        columns1: [
          {
            title: '项目类别',
            key: 'projectCategoryName',
            align: 'center',
          },
          {
            title: '项目简介',
            key: 'projectCategoryDescription',
            align: 'center',
            tooltip: true
          },
          {
            title: '项目负责业务员',
            key: 'principalName',
            align: 'center',
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 200,
            render: (h, params) => h('div', [
              h('Button', {
                props: {type: 'info'},
                on: {
                  click: () => {
                    this.details(params.index);
                  }
                },
              }, '详情')
            ])
          }
        ]
      }
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
          url: apiRoot + '/leader/AllApplication',
          method: 'get'
        }).then((res) => {
          if (res.data.code === 'SUCCESS') {
            console.log(res.data)
            this.data1 = res.data.data
            this.loading = false
            this.$Message.success(msg)
          } else {
            this.$Message.warning(res.data.message)
            this.loading = false
          }
        }).catch(() => {
          this.$Message.error("初始化失败，请检查网络连接！")
          this.loading = false
        })
      },
      details(index) {
        this.drawer = true
        this.projectCategoryName = this.data1[index].projectCategoryName
        this.items = this.data1[index].applicationList
      },
      onDrawerClose() {
        this.items = []
      },
      download(url) {
        const that = this
        let filename = url.split('---')[1]  //---后为文件名
        console.log(url)
        axios({
          url: url,
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
    }
  }
</script>

<style scoped lang="scss">
  @import 'allProject';
</style>
