<template>
  <div class="wrapper">
    <div class="operation">
      <ButtonGroup>
        <Button type="success" :loading="loading" icon="md-refresh" @click="Refresh" size="large" ghost>
          刷新
        </Button>
      </ButtonGroup>
    </div>
    <Table stripe border :columns="columns1" :data="data1" size="large" class="table"></Table>
    <Drawer :closable="false" width="640" v-model="drawer" :title="projectCategoryName">
      <p>Use</p>
      <p>Persona</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            Full Name: Aresn
          </Col>
          <Col span="12">
            Account: aresn@aresn.com
          </Col>
        </Row>
        <Row>
          <Col span="12">
            City: BeiJing
          </Col>
          <Col span="12">
            Country: China
          </Col>
        </Row>
        <Row>
          <Col span="12">
            Birthday: May 14, 1991
          </Col>
          <Col span="12">
            Website: <a href="https://dev.iviewui.com" target="_blank">https://dev.iviewui.com</a>
          </Col>
        </Row>
        Message: Hello, Developer
      </div>
      <Divider />
      <p>Company</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            Position: Programmer
          </Col>
          <Col span="12">
            Responsibilities:Coding
          </Col>
        </Row>
        <Row>
          <Col span="12">
            Department: Map visualization
          </Col>
        </Row>
        Skills: C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc.
      </div>
      <Divider />
      <p>Contacts</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            Email: admin@aresn.com
          </Col>
          <Col span="12">
            Phone Number: +86 18888888888
          </Col>
        </Row>
        <Row>
          <Col span="12">
            GitHub: <a href="https://github.com/iview/iview" target="_blank">https://github.com/iview/iview</a>
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "allProject",
    data() {
      return {
        loading: false,
        drawer: false,
        data1: [],
        projectCategoryName:null,
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
    mounted(){
      this.initData('初始化成功！')
    },
    methods: {
      Refresh() {
        this.initData('刷新成功！');
      },
      initData(msg){
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
        this.projectCategoryName=this.data1[index].projectCategoryName
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'allProject';
</style>
